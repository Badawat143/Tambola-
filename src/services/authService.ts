import { User, AuthSession, AuthResult } from '../types/tambola';

const USER_SESSION_KEY = 'tambola_user_session_v1';
const ADMIN_SESSION_KEY = 'tambola_admin_session_v1';
const CAPTURED_REF_KEY = 'tambola_captured_ref_v1';
const PENDING_REF_KEY = 'pendingReferralCode';

export interface UserSessionData {
  user: User;
  token: string;
  expiresAt: number;
}

export interface AdminSessionData {
  admin: {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'superadmin';
  };
  token: string;
  expiresAt: number;
}

/**
 * Captures referral ID from URL parameters (?ref=APNA831 or ?referral=... or ?r=...)
 * and permanently caches it in localStorage and sessionStorage as pendingReferralCode
 * so if the user navigates, opens login/register, or refreshes, the referral code is never lost.
 * Returns empty string if no referral code was provided.
 */
export function captureReferralCodeFromUrl(): string {
  try {
    if (typeof window === 'undefined') return '';
    const params = new URLSearchParams(window.location.search);
    const ref =
      params.get('ref') ||
      params.get('referral') ||
      params.get('r') ||
      params.get('sponsor') ||
      params.get('code') ||
      params.get('refcode') ||
      params.get('refCode') ||
      params.get('referralCode') ||
      params.get('referral_code') ||
      params.get('invite') ||
      params.get('inviter');
    if (ref && ref.trim().length > 0) {
      const clean = ref.trim().toUpperCase();
      localStorage.setItem(PENDING_REF_KEY, clean);
      localStorage.setItem(CAPTURED_REF_KEY, clean);
      sessionStorage.setItem(PENDING_REF_KEY, clean);
      sessionStorage.setItem(CAPTURED_REF_KEY, clean);
      return clean;
    }
    const cached =
      localStorage.getItem(PENDING_REF_KEY) ||
      sessionStorage.getItem(PENDING_REF_KEY) ||
      localStorage.getItem(CAPTURED_REF_KEY) ||
      sessionStorage.getItem(CAPTURED_REF_KEY);
    if (cached && cached.trim().length > 0) return cached.trim().toUpperCase();
  } catch {
    // fallback
  }
  return '';
}

export function getCachedReferralCode(): string {
  try {
    const cached =
      localStorage.getItem(PENDING_REF_KEY) ||
      sessionStorage.getItem(PENDING_REF_KEY) ||
      localStorage.getItem(CAPTURED_REF_KEY) ||
      sessionStorage.getItem(CAPTURED_REF_KEY) ||
      '';
    return cached.trim().toUpperCase();
  } catch {
    return '';
  }
}

export function clearCachedReferralCode(): void {
  try {
    localStorage.removeItem(PENDING_REF_KEY);
    sessionStorage.removeItem(PENDING_REF_KEY);
    localStorage.removeItem(CAPTURED_REF_KEY);
    sessionStorage.removeItem(CAPTURED_REF_KEY);
  } catch {
    // fallback
  }
}

export function getUserSession(): UserSessionData | null {
  try {
    const saved = localStorage.getItem(USER_SESSION_KEY);
    if (!saved) return null;
    const session: UserSessionData = JSON.parse(saved);
    if (session.expiresAt && Date.now() > session.expiresAt) {
      localStorage.removeItem(USER_SESSION_KEY);
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export function setUserSession(user: User, token?: string): void {
  try {
    const session: UserSessionData = {
      user,
      token: token || `USR_TOK_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
    };
    localStorage.setItem(USER_SESSION_KEY, JSON.stringify(session));
  } catch (err) {
    console.error('Failed to set user session', err);
  }
}

export function clearUserSession(): void {
  try {
    localStorage.removeItem(USER_SESSION_KEY);
  } catch (err) {
    console.error('Failed to clear user session', err);
  }
}

export function getAdminSession(): AdminSessionData | null {
  try {
    const saved = localStorage.getItem(ADMIN_SESSION_KEY);
    if (!saved) return null;
    const session: AdminSessionData = JSON.parse(saved);
    if (session.expiresAt && Date.now() > session.expiresAt) {
      localStorage.removeItem(ADMIN_SESSION_KEY);
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export function setAdminSession(admin: AdminSessionData['admin'], token?: string): void {
  try {
    const session: AdminSessionData = {
      admin,
      token: token || `ADM_TOK_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000,
    };
    localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
  } catch (err) {
    console.error('Failed to set admin session', err);
  }
}

export function clearAdminSession(): void {
  try {
    localStorage.removeItem(ADMIN_SESSION_KEY);
  } catch (err) {
    console.error('Failed to clear admin session', err);
  }
}
