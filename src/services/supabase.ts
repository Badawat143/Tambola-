import { createClient, SupabaseClient, RealtimeChannel } from '@supabase/supabase-js';

export interface SupabaseProfile {
  id: string;
  full_name: string;
  name?: string;
  email: string;
  phone: string;
  referral_code: string;
  referred_by: string | null;
  referred_by_code: string | null;
  sponsor_name?: string | null;
  status: string;
  wallet_balance?: number;
  created_at: string;
  updated_at: string;
}

export interface DirectReferralRecord {
  id: string;
  name: string;
  phone: string;
  referral_code: string;
  referred_by?: string | null;
  status: string;
  created_at: string;
}

export interface DownlineTreeNodeRecord {
  id: string;
  name: string;
  referral_code: string;
  referred_by: string | null;
  level: number;
  status: string;
  created_at: string;
}

let supabaseInstance: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (supabaseInstance) return supabaseInstance;

  const metaEnv = typeof import.meta !== 'undefined' ? (import.meta as any).env : undefined;

  const url =
    (metaEnv && metaEnv.VITE_SUPABASE_URL) ||
    (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_URL) ||
    '';

  const anonKey =
    (metaEnv && metaEnv.VITE_SUPABASE_ANON_KEY) ||
    (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_ANON_KEY) ||
    '';

  if (url && anonKey) {
    try {
      supabaseInstance = createClient(url, anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      });
      return supabaseInstance;
    } catch (err) {
      console.warn('[SUPABASE] Failed to initialize client:', err);
    }
  }

  return null;
}

export function isSupabaseConfigured(): boolean {
  return !!getSupabase();
}

/**
 * Validates and looks up a sponsor by referral_code in Supabase
 * Queries public.profiles (or fallback public.users)
 */
export async function lookupReferrerByCode(rawCode: string): Promise<{ id: string; name: string; referralCode: string } | null> {
  const code = (rawCode || '').trim().toUpperCase();
  if (!code) return null;

  console.log(`[REFERRAL] URL referral code: ${code}`);
  console.log(`[REFERRAL] Sponsor lookup started`);

  const supabase = getSupabase();
  if (supabase) {
    try {
      // 1. Try public.profiles
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, name, referral_code')
        .or(`referral_code.ilike.${code},id.eq.${code}`)
        .limit(1)
        .maybeSingle();

      if (!error && data) {
        console.log(`[REFERRAL] Sponsor found in Supabase (profiles): ${data.id}`);
        return {
          id: data.id,
          name: data.full_name || data.name || 'Apna Tambola Sponsor',
          referralCode: data.referral_code || code,
        };
      }

      // 2. Fallback to public.users if profiles table is named users
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, full_name, referral_code')
        .or(`referral_code.ilike.${code},id.eq.${code}`)
        .limit(1)
        .maybeSingle();

      if (!userError && userData) {
        console.log(`[REFERRAL] Sponsor found in Supabase (users): ${userData.id}`);
        return {
          id: userData.id,
          name: userData.full_name || 'Apna Tambola Sponsor',
          referralCode: userData.referral_code || code,
        };
      }
    } catch (err) {
      console.warn('[SUPABASE] Error looking up referrer by code:', err);
    }
  }

  // Fallback to backend server API
  try {
    const res = await fetch(`/api/auth/sponsor/${encodeURIComponent(code)}`);
    const json = await res.json();
    if (json.success && json.sponsor) {
      console.log(`[REFERRAL] Resolved referrer ID via Server: ${json.sponsor.id}`);
      return {
        id: json.sponsor.id,
        name: json.sponsor.name,
        referralCode: json.sponsor.referralCode || json.sponsor.id,
      };
    }
  } catch (err) {
    console.warn('[REFERRAL] Server sponsor lookup error:', err);
  }

  return null;
}

/**
 * Registers new user profile with permanent sponsor UUID via register_profile_with_referral RPC
 */
export async function registerProfileWithReferral(params: {
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  referralCode?: string;
}): Promise<{ success: boolean; message: string; profile?: any; referredBy?: string | null }> {
  const cleanRef = (params.referralCode || '').trim().toUpperCase();
  console.log(`[REFERRAL] URL referral code detected: ${cleanRef || 'NONE (Direct)'}`);
  console.log(`[REGISTRATION] Auth user created: ${params.userId}`);

  const supabase = getSupabase();
  if (supabase) {
    try {
      // 1. Try register_profile_with_referral RPC
      const { data, error } = await supabase.rpc('register_profile_with_referral', {
        p_user_id: params.userId,
        p_name: params.fullName.trim(),
        p_mobile: params.phone.trim(),
        p_email: params.email.trim().toLowerCase(),
        p_referral_code: cleanRef || null,
      });

      if (!error && data) {
        console.log(`[REFERRAL] Saving referred_by: ${data.referred_by || 'NULL'}`);
        console.log(`[DATABASE] Profile created successfully:`, data);
        return {
          success: true,
          message: data.message || 'Profile created successfully.',
          profile: data,
          referredBy: data.referred_by,
        };
      }

      // 2. Try legacy RPC register_user_with_referral
      const { data: legacyData, error: legacyError } = await supabase.rpc('register_user_with_referral', {
        p_user_id: params.userId,
        p_full_name: params.fullName.trim(),
        p_email: params.email.trim().toLowerCase(),
        p_phone: params.phone.trim(),
        p_referral_code: cleanRef || null,
      });

      if (!legacyError && legacyData && legacyData.success) {
        return {
          success: true,
          message: legacyData.message || 'Registration successful.',
          profile: legacyData.user,
          referredBy: legacyData.referrer_id,
        };
      }

      if (error && error.message.includes('INVALID_REFERRAL_CODE')) {
        return {
          success: false,
          message: 'Invalid or expired referral code. Sponsor does not exist.',
        };
      }
      if (error && error.message.includes('SELF_REFERRAL_NOT_ALLOWED')) {
        return {
          success: false,
          message: 'Self-referral is strictly not allowed.',
        };
      }
    } catch (err) {
      console.warn('[SUPABASE] Registration RPC exception:', err);
    }
  }

  return { success: false, message: 'Supabase RPC bypassed or completed via Server API' };
}

/**
 * Backward compatibility alias for registerProfileWithReferral
 */
export const registerUserWithReferral = registerProfileWithReferral;

/**
 * Queries Direct Referrals from Supabase database via get_direct_referrals RPC or direct table query
 */
export async function getDirectReferralsFromSupabase(userId: string): Promise<DirectReferralRecord[]> {
  console.log(`[DIRECT REFERRAL] Current user: ${userId}`);

  const supabase = getSupabase();
  if (supabase && userId) {
    try {
      // 1. Call get_direct_referrals RPC
      const { data: rpcData, error: rpcError } = await supabase.rpc('get_direct_referrals', {
        p_user_id: userId,
      });

      if (!rpcError && rpcData && Array.isArray(rpcData)) {
        console.log(`[REFERRAL] Direct referral relationship verified via RPC:`, rpcData.length);
        return rpcData as DirectReferralRecord[];
      }

      // 2. Direct table SELECT from profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, name, phone, referral_code, status, created_at, referred_by')
        .eq('referred_by', userId)
        .order('created_at', { ascending: false });

      if (!profilesError && profilesData) {
        return profilesData.map((p) => ({
          id: p.id,
          name: p.full_name || p.name || 'Team Member',
          phone: p.phone || '',
          referral_code: p.referral_code,
          referred_by: p.referred_by,
          status: p.status || 'active',
          created_at: p.created_at,
        }));
      }

      // 3. Fallback table users
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('id, full_name, phone, referral_code, status, created_at, referrer_id')
        .eq('referrer_id', userId)
        .order('created_at', { ascending: false });

      if (!usersError && usersData) {
        return usersData.map((u) => ({
          id: u.id,
          name: u.full_name || 'Team Member',
          phone: u.phone || '',
          referral_code: u.referral_code,
          referred_by: u.referrer_id,
          status: u.status || 'active',
          created_at: u.created_at,
        }));
      }
    } catch (err) {
      console.warn('[SUPABASE] Failed to fetch direct referrals:', err);
    }
  }

  // Multi-device backend fallback query
  try {
    const res = await fetch(`/api/referrals/direct/${encodeURIComponent(userId)}`);
    const json = await res.json();
    if (json.success && Array.isArray(json.referrals)) {
      console.log(`[DIRECT REFERRAL] Found referrals from Server DB:`, json.referrals);
      return json.referrals.map((r: any) => ({
        id: r.id,
        name: r.name || r.full_name,
        phone: r.phone || '',
        referral_code: r.referralCode || r.referral_code || r.id,
        referred_by: r.referredBy || r.referred_by,
        status: r.status || 'active',
        created_at: r.createdAt || r.created_at,
      }));
    }
  } catch (err) {
    console.warn('[REFERRAL] Failed to fetch direct referrals from server:', err);
  }

  return [];
}

/**
 * Counts direct referrals for authenticated user via get_direct_referral_count RPC
 */
export async function getDirectReferralCountFromSupabase(userId: string): Promise<number> {
  const supabase = getSupabase();
  if (supabase && userId) {
    try {
      // 1. Call get_direct_referral_count RPC
      const { data: rpcCount, error: rpcError } = await supabase.rpc('get_direct_referral_count', {
        p_user_id: userId,
      });

      if (!rpcError && typeof rpcCount === 'number') {
        return rpcCount;
      }

      // 2. Select head count from profiles
      const { count, error } = await supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true })
        .eq('referred_by', userId);

      if (!error && typeof count === 'number') {
        return count;
      }
    } catch (err) {
      console.warn('[SUPABASE] Failed to get referral count:', err);
    }
  }

  try {
    const res = await fetch(`/api/referrals/count/${encodeURIComponent(userId)}`);
    const json = await res.json();
    if (json.success && typeof json.count === 'number') {
      return json.count;
    }
  } catch {
    // fallback
  }

  return 0;
}

/**
 * Queries Recursive Downline Tree from Supabase database via get_downline_tree RPC
 */
export async function getDownlineTreeFromSupabase(userId: string): Promise<DownlineTreeNodeRecord[]> {
  const supabase = getSupabase();
  if (supabase && userId) {
    try {
      const { data, error } = await supabase.rpc('get_downline_tree', {
        p_user_id: userId,
      });

      if (!error && data && Array.isArray(data)) {
        return data as DownlineTreeNodeRecord[];
      }
    } catch (err) {
      console.warn('[SUPABASE] get_downline_tree RPC error:', err);
    }
  }

  // Fallback to backend server recursive API
  try {
    const res = await fetch(`/api/referrals/downline/${encodeURIComponent(userId)}`);
    const json = await res.json();
    if (json.success) {
      const list: DownlineTreeNodeRecord[] = [];
      if (Array.isArray(json.level1)) {
        json.level1.forEach((m: any) => {
          list.push({
            id: m.id,
            name: m.name,
            referral_code: m.referralCode || m.referral_code || m.id,
            referred_by: m.referredBy || userId,
            level: 1,
            status: m.status || 'active',
            created_at: m.createdAt || m.created_at,
          });
        });
      }
      if (Array.isArray(json.level2)) {
        json.level2.forEach((m: any) => {
          list.push({
            id: m.id,
            name: m.name,
            referral_code: m.referralCode || m.referral_code || m.id,
            referred_by: m.referredBy,
            level: 2,
            status: m.status || 'active',
            created_at: m.createdAt || m.created_at,
          });
        });
      }
      return list;
    }
  } catch (err) {
    console.warn('[REFERRAL] Failed to fetch downline tree from server:', err);
  }

  return [];
}

/**
 * Subscribes to Supabase Realtime for new direct referrals
 */
export function subscribeToReferralRealtime(
  userId: string,
  onNewReferral: (payload: any) => void
): () => void {
  const supabase = getSupabase();
  if (!supabase || !userId) return () => {};

  let channel: RealtimeChannel | null = null;

  try {
    channel = supabase
      .channel(`referrals-channel-${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'profiles',
          filter: `referred_by=eq.${userId}`,
        },
        (payload) => {
          console.log(`[REALTIME] New referral event received on profiles:`, payload);
          onNewReferral(payload.new);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'users',
          filter: `referrer_id=eq.${userId}`,
        },
        (payload) => {
          console.log(`[REALTIME] New referral event received on users:`, payload);
          onNewReferral(payload.new);
        }
      )
      .subscribe((status) => {
        console.log(`[REALTIME] Supabase Realtime channel status: ${status}`);
      });
  } catch (err) {
    console.warn('[SUPABASE REALTIME] Setup error:', err);
  }

  return () => {
    if (channel && supabase) {
      supabase.removeChannel(channel);
    }
  };
}
