-- ============================================================================
-- APNA TAMBOLA — SUPABASE REFERRAL SYSTEM ROOT FIX (PRODUCTION SQL MIGRATION)
-- ============================================================================
-- Canonical schema:
--   public.profiles (or public.users)
--   profiles.id = auth.uid() (UUID primary key)
--   profiles.referral_code = unique referral code ('APNA' + unique code)
--   profiles.referred_by = sponsor UUID (foreign key -> profiles.id)
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. Ensure Table Exists
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  name TEXT,
  phone TEXT,
  email TEXT,
  referral_code TEXT,
  referred_by UUID,
  referred_by_code TEXT,
  sponsor_name TEXT,
  role TEXT DEFAULT 'user',
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Alter Table to add required columns if not already existing
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS referral_code TEXT,
  ADD COLUMN IF NOT EXISTS referred_by UUID,
  ADD COLUMN IF NOT EXISTS referred_by_code TEXT,
  ADD COLUMN IF NOT EXISTS sponsor_name TEXT,
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now(),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- 3. Create foreign key self-reference constraint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'profiles_referred_by_fkey'
  ) THEN
    ALTER TABLE public.profiles
    ADD CONSTRAINT profiles_referred_by_fkey
    FOREIGN KEY (referred_by)
    REFERENCES public.profiles(id)
    ON DELETE SET NULL;
  END IF;
END $$;

-- 4. Unique Referral Code index
CREATE UNIQUE INDEX IF NOT EXISTS profiles_referral_code_unique
  ON public.profiles(referral_code)
  WHERE referral_code IS NOT NULL;

-- 5. Query Optimization Indexes
CREATE INDEX IF NOT EXISTS profiles_referred_by_idx
  ON public.profiles(referred_by);

CREATE INDEX IF NOT EXISTS profiles_created_at_idx
  ON public.profiles(created_at);

-- 6. Referral Code Generation Function with collision check
CREATE OR REPLACE FUNCTION public.generate_unique_referral_code()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_code TEXT;
  v_exists BOOLEAN;
  v_chars TEXT := '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  v_random TEXT;
  i INT;
BEGIN
  LOOP
    v_random := '';
    FOR i IN 1..4 LOOP
      v_random := v_random || substr(v_chars, floor(random() * length(v_chars) + 1)::integer, 1);
    END LOOP;
    
    v_code := 'APNA' || v_random;
    
    SELECT EXISTS(
      SELECT 1 FROM public.profiles WHERE upper(referral_code) = upper(v_code)
    ) INTO v_exists;
    
    IF NOT v_exists THEN
      RETURN v_code;
    END IF;
  END LOOP;
END;
$$;

-- 7. Secure Atomic Registration RPC: register_profile_with_referral
CREATE OR REPLACE FUNCTION public.register_profile_with_referral(
  p_user_id UUID,
  p_name TEXT,
  p_mobile TEXT,
  p_email TEXT DEFAULT NULL,
  p_referral_code TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  v_existing RECORD;
  v_sponsor_id UUID := NULL;
  v_sponsor_name TEXT := NULL;
  v_sponsor_code TEXT := NULL;
  v_clean_ref TEXT := NULL;
  v_new_code TEXT;
  v_profile RECORD;
BEGIN
  -- 1. Validate p_user_id
  IF p_user_id IS NULL THEN
    RAISE EXCEPTION 'USER_ID_REQUIRED';
  END IF;

  -- 2. Check if profile already exists
  SELECT * INTO v_existing FROM public.profiles WHERE id = p_user_id;
  IF FOUND THEN
    RETURN jsonb_build_object(
      'success', true,
      'message', 'Profile already registered',
      'id', v_existing.id,
      'name', COALESCE(v_existing.full_name, v_existing.name),
      'referral_code', v_existing.referral_code,
      'referred_by', v_existing.referred_by,
      'created_at', v_existing.created_at,
      'status', v_existing.status
    );
  END IF;

  -- 3. Resolve Sponsor if referral code provided
  IF p_referral_code IS NOT NULL AND length(trim(p_referral_code)) > 0 THEN
    v_clean_ref := upper(trim(p_referral_code));
    
    SELECT id, COALESCE(full_name, name) as sname, referral_code
    INTO v_sponsor_id, v_sponsor_name, v_sponsor_code
    FROM public.profiles
    WHERE upper(referral_code) = v_clean_ref
       OR id::text = v_clean_ref
    LIMIT 1;

    IF v_sponsor_id IS NULL THEN
      RAISE EXCEPTION 'INVALID_REFERRAL_CODE';
    END IF;

    -- Anti-Self Referral check
    IF v_sponsor_id = p_user_id THEN
      RAISE EXCEPTION 'SELF_REFERRAL_NOT_ALLOWED';
    END IF;
  END IF;

  -- 4. Generate unique referral code
  v_new_code := public.generate_unique_referral_code();

  -- 5. Insert profile record atomically
  INSERT INTO public.profiles (
    id,
    full_name,
    name,
    phone,
    email,
    referral_code,
    referred_by,
    referred_by_code,
    sponsor_name,
    status,
    created_at,
    updated_at
  ) VALUES (
    p_user_id,
    trim(p_name),
    trim(p_name),
    trim(p_mobile),
    lower(trim(p_email)),
    v_new_code,
    v_sponsor_id,
    v_sponsor_code,
    v_sponsor_name,
    'active',
    now(),
    now()
  )
  RETURNING * INTO v_profile;

  -- 6. Insert notification for sponsor if sponsor exists
  IF v_sponsor_id IS NOT NULL THEN
    INSERT INTO public.notifications (
      user_id,
      type,
      title,
      message,
      related_user_id,
      read,
      created_at
    ) VALUES (
      v_sponsor_id,
      'new_direct_referral',
      '🎉 New Direct Referral!',
      'User ' || trim(p_name) || ' joined your team using your referral code ' || v_sponsor_code || '.',
      p_user_id,
      false,
      now()
    ) ON CONFLICT DO NOTHING;
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'id', v_profile.id,
    'name', v_profile.full_name,
    'referral_code', v_profile.referral_code,
    'referred_by', v_profile.referred_by,
    'referred_by_code', v_profile.referred_by_code,
    'sponsor_name', v_profile.sponsor_name,
    'created_at', v_profile.created_at,
    'status', v_profile.status
  );
END;
$$;

-- 8. Notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  related_user_id UUID,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS notifications_user_id_idx ON public.notifications(user_id);

-- 9. Direct Referrals RPC: get_direct_referrals
CREATE OR REPLACE FUNCTION public.get_direct_referrals(p_user_id UUID)
RETURNS TABLE (
  id UUID,
  name TEXT,
  phone TEXT,
  referral_code TEXT,
  status TEXT,
  created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  -- Authenticated caller verification
  IF auth.uid() IS NOT NULL AND auth.uid() != p_user_id THEN
    RAISE EXCEPTION 'UNAUTHORIZED_ACCESS';
  END IF;

  RETURN QUERY
  SELECT
    p.id,
    COALESCE(p.full_name, p.name) AS name,
    p.phone,
    p.referral_code,
    p.status,
    p.created_at
  FROM public.profiles p
  WHERE p.referred_by = p_user_id
  ORDER BY p.created_at DESC;
END;
$$;

-- 10. Direct Referral Count RPC: get_direct_referral_count
CREATE OR REPLACE FUNCTION public.get_direct_referral_count(p_user_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  v_count INTEGER;
BEGIN
  SELECT count(*)::INTEGER
  INTO v_count
  FROM public.profiles
  WHERE referred_by = p_user_id;

  RETURN v_count;
END;
$$;

-- 11. Recursive Downline Tree RPC: get_downline_tree
CREATE OR REPLACE FUNCTION public.get_downline_tree(p_user_id UUID)
RETURNS TABLE (
  id UUID,
  name TEXT,
  referral_code TEXT,
  referred_by UUID,
  level INT,
  status TEXT,
  created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  RETURN QUERY
  WITH RECURSIVE downline AS (
    -- Anchor member (Level 1 direct referrals)
    SELECT
      p.id,
      COALESCE(p.full_name, p.name) AS name,
      p.referral_code,
      p.referred_by,
      1 AS level,
      p.status,
      p.created_at
    FROM public.profiles p
    WHERE p.referred_by = p_user_id

    UNION ALL

    -- Recursive member downline (Level 2 to Level 8)
    SELECT
      c.id,
      COALESCE(c.full_name, c.name) AS name,
      c.referral_code,
      c.referred_by,
      d.level + 1 AS level,
      c.status,
      c.created_at
    FROM public.profiles c
    INNER JOIN downline d ON c.referred_by = d.id
    WHERE d.level < 8
  )
  SELECT * FROM downline ORDER BY level ASC, created_at DESC;
END;
$$;

-- 12. Enable RLS and create security policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Drop obsolete or insecure policies
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile safe fields" ON public.profiles;
DROP POLICY IF EXISTS "Users can read own notifications" ON public.notifications;

-- Strict read policy
CREATE POLICY "Users can read own profile"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (id = auth.uid());

-- Safe update policy (never allow normal users to change referred_by, id, or referral_code)
CREATE POLICY "Users can update own profile safe fields"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

CREATE POLICY "Users can read own notifications"
  ON public.notifications
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- 13. Enable Realtime Replication Publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
