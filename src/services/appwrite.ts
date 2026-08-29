import { Client, Account, Databases, ID, OAuthProvider } from 'appwrite';

// Configurable Appwrite Endpoint & Project ID
export const APPWRITE_ENDPOINT: string =
  (import.meta as any).env?.VITE_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1';

export const APPWRITE_PROJECT_ID: string =
  (import.meta as any).env?.VITE_APPWRITE_PROJECT_ID || 'fra-6a9237fe0029724b3e69';

let _appwriteClient: Client | null = null;
let _appwriteAccount: Account | null = null;
let _appwriteDatabases: Databases | null = null;

export function getAppwriteClient(): Client {
  if (!_appwriteClient) {
    _appwriteClient = new Client()
      .setEndpoint(APPWRITE_ENDPOINT)
      .setProject(APPWRITE_PROJECT_ID);
  }
  return _appwriteClient;
}

export function getAppwriteAccount(): Account {
  if (!_appwriteAccount) {
    _appwriteAccount = new Account(getAppwriteClient());
  }
  return _appwriteAccount;
}

export function getAppwriteDatabases(): Databases {
  if (!_appwriteDatabases) {
    _appwriteDatabases = new Databases(getAppwriteClient());
  }
  return _appwriteDatabases;
}

export interface AppwriteAuthResult {
  success: boolean;
  user?: any;
  session?: any;
  error?: string;
}

/**
 * Register a new user in Appwrite
 */
export async function appwriteRegister(
  email: string,
  password: string,
  name: string
): Promise<AppwriteAuthResult> {
  try {
    const account = getAppwriteAccount();
    const userId = ID.unique();
    const user = await account.create(userId, email, password, name);
    // Automatically log in after registration
    const session = await account.createEmailPasswordSession(email, password);
    return { success: true, user, session };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to register with Appwrite Authentication',
    };
  }
}

/**
 * Login existing user with Email & Password
 */
export async function appwriteLogin(
  email: string,
  password: string
): Promise<AppwriteAuthResult> {
  try {
    const account = getAppwriteAccount();
    const session = await account.createEmailPasswordSession(email, password);
    const user = await account.get();
    return { success: true, user, session };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Invalid credentials or Appwrite Auth error',
    };
  }
}

/**
 * Anonymous guest session
 */
export async function appwriteAnonymousLogin(): Promise<AppwriteAuthResult> {
  try {
    const account = getAppwriteAccount();
    const session = await account.createAnonymousSession();
    const user = await account.get();
    return { success: true, user, session };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to start anonymous Appwrite session',
    };
  }
}

/**
 * Get current Appwrite session / user
 */
export async function appwriteGetCurrentUser(): Promise<any | null> {
  try {
    const account = getAppwriteAccount();
    return await account.get();
  } catch {
    return null;
  }
}

/**
 * Logout current session
 */
export async function appwriteLogout(): Promise<boolean> {
  try {
    const account = getAppwriteAccount();
    await account.deleteSession('current');
    return true;
  } catch {
    return false;
  }
}

/**
 * OAuth Login (Google, GitHub, etc.)
 */
export function appwriteLoginOAuth(provider: 'google' | 'github' = 'google') {
  const account = getAppwriteAccount();
  const targetProvider = provider === 'google' ? OAuthProvider.Google : OAuthProvider.Github;
  const redirectSuccess = `${window.location.origin}/?auth=appwrite_success`;
  const redirectFailure = `${window.location.origin}/?auth=appwrite_failed`;
  
  return account.createOAuth2Session(targetProvider, redirectSuccess, redirectFailure);
}

/**
 * Ping Appwrite to verify connectivity
 */
export async function checkAppwriteHealth(): Promise<{ connected: boolean; message: string }> {
  try {
    const account = getAppwriteAccount();
    await account.get();
    return { connected: true, message: 'Appwrite connected & active session detected' };
  } catch (err: any) {
    if (err?.code === 401) {
      // 401 means server reachable, project ID is valid, but no user is currently logged in
      return { connected: true, message: 'Appwrite Project connected & ready for Authentication' };
    }
    return {
      connected: false,
      message: err?.message || 'Unable to connect to Appwrite endpoint',
    };
  }
}

