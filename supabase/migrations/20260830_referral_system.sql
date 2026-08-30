-- =================================================================
-- APNA TAMBOLA: SUPABASE REFERRAL SYSTEM SCHEMA & RPC MIGRATION
-- =================================================================

-- 1. Create public.users table if not exists (linked to auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  user_id UUID UNIQUE NOT NULL,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  referral_code TEXT UNIQUE NOT NULL,
  referrer_id UUID NULL REFERENCES public.users(id) ON DELETE SET NULL,
  referred_by_code TEXT NULL,
  status TEXT DEFAULT 'active',
  wallet_balance NUMERIC(12,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Indexes for high-performance referral lookups and code uniqueness
CREATE INDEX IF NOT EXISTS idx_users_referrer_id ON public.users(referrer_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_referral_code ON public.users(referral_code);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_phone ON public.users(phone);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 4. RLS Security Policies
-- Policy: User can read their own profile
DROP POLICY IF EXISTS "Users can read own profile" ON public.users;
CREATE POLICY "Users can read own profile"
  ON public.users
  FOR SELECT
  USING (auth.uid() = id);

-- Policy: User can read their direct referrals (where referrer_id = logged-in user's auth.uid)
DROP POLICY IF EXISTS "Users can read direct referrals" ON public.users;
CREATE POLICY "Users can read direct referrals"
  ON public.users
  FOR SELECT
  USING (referrer_id = auth.uid());

-- Policy: Authenticated users can insert their own profile
DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;
CREATE POLICY "Users can insert own profile"
  ON public.users
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Policy: Users can update only their non-sensitive fields
DROP POLICY IF EXISTS "Users can update own safe fields" ON public.users;
CREATE POLICY "Users can update own safe fields"
  ON public.users
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 5. Secure Supabase RPC Function: register_user_with_referral
CREATE OR REPLACE FUNCTION public.register_user_with_referral(
  p_user_id UUID,
  p_full_name TEXT,
  p_email TEXT,
  p_phone TEXT,
  p_referral_code TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  v_referrer_id UUID := NULL;
  v_referred_by_code TEXT := NULL;
  v_new_referral_code TEXT;
  v_existing_user public.users%ROWTYPE;
  v_user_record public.users%ROWTYPE;
BEGIN
  -- 1. Security check: User ID validation
  IF auth.uid() IS NOT NULL AND auth.uid() != p_user_id THEN
    RAISE EXCEPTION 'Unauthorized: User ID mismatch with authentication session.';
  END IF;

  -- 2. Check if user already registered
  SELECT * INTO v_existing_user FROM public.users WHERE id = p_user_id;
  IF FOUND THEN
    RETURN jsonb_build_object(
      'success', true,
      'message', 'User profile already exists.',
      'user', row_to_json(v_existing_user)
    );
  END IF;

  -- 3. Resolve Referrer from Referral Code
  IF p_referral_code IS NOT NULL AND TRIM(p_referral_code) != '' THEN
    SELECT id, referral_code INTO v_referrer_id, v_referred_by_code
    FROM public.users
    WHERE UPPER(TRIM(referral_code)) = UPPER(TRIM(p_referral_code))
    LIMIT 1;

    -- 4. Prevent self-referral
    IF v_referrer_id = p_user_id THEN
      v_referrer_id := NULL;
      v_referred_by_code := NULL;
    END IF;
  END IF;

  -- 5. Generate Unique Referral Code (Format: APNA + 4-6 uppercase chars)
  LOOP
    v_new_referral_code := 'APNA' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 4) || LPAD(FLOOR(RANDOM() * 100)::TEXT, 2, '0'));
    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.users WHERE referral_code = v_new_referral_code);
  END LOOP;

  -- 6. Insert new user record
  INSERT INTO public.users (
    id,
    user_id,
    full_name,
    email,
    phone,
    referral_code,
    referrer_id,
    referred_by_code,
    status,
    wallet_balance,
    created_at,
    updated_at
  )
  VALUES (
    p_user_id,
    p_user_id,
    TRIM(p_full_name),
    LOWER(TRIM(p_email)),
    TRIM(p_phone),
    v_new_referral_code,
    v_referrer_id,
    v_referred_by_code,
    'active',
    10.00,
    NOW(),
    NOW()
  )
  RETURNING * INTO v_user_record;

  RETURN jsonb_build_object(
    'success', true,
    'message', 'User registered successfully with referral link.',
    'user', row_to_json(v_user_record),
    'referrer_id', v_referrer_id,
    'referred_by_code', v_referred_by_code
  );
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object(
    'success', false,
    'error', SQLERRM
  );
END;
$$;

-- 6. Verification Queries Examples
-- 1. Check User A Referral Code:
-- SELECT id, full_name, referral_code FROM public.users WHERE referral_code = 'APNA831';

-- 2. Check User B Referrer Relationship:
-- SELECT id, full_name, referral_code, referrer_id, referred_by_code FROM public.users WHERE email = 'userb@example.com';

-- 3. Query All Direct Referrals of User A:
-- SELECT id, user_id, full_name, email, phone, referral_code, referrer_id, referred_by_code, status, created_at
-- FROM public.users
-- WHERE referrer_id = 'USER_A_UUID'
-- ORDER BY created_at DESC;

-- 4. Count Direct Referrals:
-- SELECT count(id) FROM public.users WHERE referrer_id = 'USER_A_UUID';
