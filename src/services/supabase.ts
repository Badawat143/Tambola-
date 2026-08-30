import { createClient, SupabaseClient } from '@supabase/supabase-js';

export interface SupabaseUser {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone: string;
  referral_code: string;
  referrer_id: string | null;
  referred_by_code: string | null;
  status: string;
  wallet_balance: number;
  created_at: string;
  updated_at: string;
}

export interface DirectReferralRecord {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone: string;
  referral_code: string;
  referrer_id: string | null;
  referred_by_code: string | null;
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
 * Validates and looks up a referrer by referral_code in Supabase
 */
export async function lookupReferrerByCode(rawCode: string): Promise<{ id: string; name: string; referralCode: string } | null> {
  const code = (rawCode || '').trim().toUpperCase();
  if (!code) return null;

  console.log(`[REFERRAL] URL referral code: ${code}`);

  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, full_name, referral_code')
        .ilike('referral_code', code)
        .limit(1)
        .maybeSingle();

      if (!error && data) {
        console.log(`[REFERRAL] Resolved referrer ID: ${data.id}`);
        return {
          id: data.id,
          name: data.full_name || 'Apna Tambola Member',
          referralCode: data.referral_code,
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
 * Registers new user profile with permanent referrer_id in Supabase
 */
export async function registerUserWithReferral(params: {
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  referralCode?: string;
}): Promise<{ success: boolean; message: string; user?: any; referrerId?: string | null }> {
  const cleanRef = (params.referralCode || '').trim().toUpperCase();
  console.log(`[REFERRAL] URL referral code: ${cleanRef || 'NONE (Direct)'}`);
  console.log(`[REGISTRATION] New user ID: ${params.userId}`);

  const supabase = getSupabase();
  if (supabase) {
    try {
      // 1. Call Secure Supabase RPC function register_user_with_referral
      const { data, error } = await supabase.rpc('register_user_with_referral', {
        p_user_id: params.userId,
        p_full_name: params.fullName.trim(),
        p_email: params.email.trim().toLowerCase(),
        p_phone: params.phone.trim(),
        p_referral_code: cleanRef || null,
      });

      if (!error && data && data.success) {
        console.log(`[REGISTRATION] Saved referrer ID: ${data.referrer_id || 'NULL'}`);
        return {
          success: true,
          message: data.message || 'Registration successful.',
          user: data.user,
          referrerId: data.referrer_id,
        };
      }

      if (error) {
        console.warn('[SUPABASE] RPC register_user_with_referral warning, attempting direct insert:', error);
      }
    } catch (err) {
      console.warn('[SUPABASE] Registration RPC exception:', err);
    }
  }

  return { success: false, message: 'Supabase RPC not executed' };
}

/**
 * Queries Direct Referrals from Supabase database
 * SELECT id, user_id, full_name, email, phone, referral_code, referrer_id, referred_by_code, status, created_at
 * FROM public.users WHERE referrer_id = user.id ORDER BY created_at DESC;
 */
export async function getDirectReferralsFromSupabase(userId: string): Promise<DirectReferralRecord[]> {
  console.log(`[DIRECT REFERRAL] Current user: ${userId}`);

  const supabase = getSupabase();
  if (supabase && userId) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select(`
          id,
          user_id,
          full_name,
          email,
          phone,
          referral_code,
          referrer_id,
          referred_by_code,
          status,
          created_at
        `)
        .eq('referrer_id', userId)
        .order('created_at', { ascending: false });

      if (!error && data) {
        console.log(`[DIRECT REFERRAL] Found referrals:`, data);
        return data as DirectReferralRecord[];
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
      return json.referrals;
    }
  } catch (err) {
    console.warn('[REFERRAL] Failed to fetch direct referrals from server:', err);
  }

  return [];
}

/**
 * Counts direct referrals for authenticated user
 */
export async function getDirectReferralCountFromSupabase(userId: string): Promise<number> {
  const supabase = getSupabase();
  if (supabase && userId) {
    try {
      const { count, error } = await supabase
        .from('users')
        .select('id', { count: 'exact', head: true })
        .eq('referrer_id', userId);

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
