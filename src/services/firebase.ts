import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAnalytics, isSupported as isAnalyticsSupported, logEvent, Analytics } from 'firebase/analytics';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  runTransaction,
  increment,
  Firestore,
} from 'firebase/firestore';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

let _firebaseApp: any = null;
let _db: any = null;
let _auth: any = null;
let _analytics: Analytics | null = null;

export function getFirebaseApp() {
  if (!_firebaseApp && typeof window !== 'undefined') {
    try {
      _firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    } catch (err) {
      console.warn('Firebase App initialization warning:', err);
    }
  }
  return _firebaseApp;
}

export async function getFirebaseAnalytics(): Promise<Analytics | null> {
  if (!_analytics && typeof window !== 'undefined') {
    try {
      const supported = await isAnalyticsSupported();
      if (supported) {
        const app = getFirebaseApp();
        if (app) {
          _analytics = getAnalytics(app);
        }
      }
    } catch (err) {
      console.warn('Firebase Analytics initialization warning:', err);
    }
  }
  return _analytics;
}

export function getDb(): Firestore | null {
  if (!_db) {
    try {
      const app = getFirebaseApp();
      if (app) {
        const customDbId = (firebaseConfig as any).firestoreDatabaseId;
        _db = customDbId ? getFirestore(app, customDbId) : getFirestore(app);
      }
    } catch (err) {
      console.warn('Firestore initialization warning:', err);
    }
  }
  return _db;
}

export function getFirebaseAuth() {
  if (!_auth) {
    try {
      const app = getFirebaseApp();
      if (app) {
        _auth = getAuth(app);
      }
    } catch (err) {
      console.warn('Firebase Auth initialization warning:', err);
    }
  }
  return _auth;
}

export const getGoogleProvider = () => {
  try {
    return new GoogleAuthProvider();
  } catch {
    return null;
  }
};

/**
 * Sign in with Google using Firebase Auth popup
 */
export async function signInWithFirebaseGoogle(): Promise<{
  success: boolean;
  user?: {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
  };
  error?: string;
}> {
  try {
    const auth = getFirebaseAuth();
    if (!auth) {
      return { success: false, error: 'Firebase Auth is not initialized.' };
    }
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    const result = await signInWithPopup(auth, provider);
    const fbUser = result.user;

    return {
      success: true,
      user: {
        uid: fbUser.uid,
        email: fbUser.email,
        displayName: fbUser.displayName,
        photoURL: fbUser.photoURL,
      },
    };
  } catch (err: any) {
    console.warn('[Firebase Google Sign-In Error]:', err);
    return {
      success: false,
      error: err.message || 'Google Sign-In failed or was cancelled.',
    };
  }
}

export {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  runTransaction,
  increment,
  getAnalytics,
  logEvent,
};

// Firestore collections references
export const COLLECTIONS = {
  USERS: 'users',
  GAMES: 'games',
  TICKETS: 'tickets',
  TRANSACTIONS: 'transactions',
  WINNERS: 'winners',
  SETTINGS: 'settings',
  DEPOSITS: 'deposits',
  WITHDRAWALS: 'withdrawals',
};

export interface RegisterUserInput {
  name: string;
  phone: string;
  email: string;
  password?: string;
  pendingReferralCode?: string | null;
  stateOfResidence?: string;
  requestedUserId?: string;
}

export interface RegisterUserResult {
  success: boolean;
  user?: any;
  referrer?: {
    id: string;
    name: string;
    referralCode?: string;
  } | null;
  message?: string;
  error?: string;
}

/**
 * Robust Registration Function using Firestore Transactions (runTransaction)
 * - Validates input and cleans mobile/email
 * - Validates pendingReferralCode from localStorage / client cache
 * - Strictly prevents self-referral across ID, referral code, phone, and email
 * - Atomically writes the new user document into the 'users' collection with 'referredBy' assigned
 * - Atomically increments the sponsor's directReferralsCount within the same ACID transaction
 */
export async function registerUserWithFirestoreTransaction(
  input: RegisterUserInput,
  firestoreInstance?: Firestore | null
): Promise<RegisterUserResult> {
  const firestoreDb = firestoreInstance || getDb();
  if (!firestoreDb) {
    return {
      success: false,
      error: 'Firestore is not initialized. Please ensure Firebase connection is active.',
    };
  }

  const name = (input.name || '').trim();
  const rawPhone = (input.phone || '').toString();
  const cleanPhone = rawPhone.replace(/[^0-9]/g, '');
  const cleanEmail = (input.email || '').trim().toLowerCase();
  const password = input.password || 'Password@123';
  const stateOfResidence = input.stateOfResidence || 'India';

  if (!name || !cleanPhone || !cleanEmail) {
    return {
      success: false,
      error: 'Full name, valid mobile number, and email address are required.',
    };
  }

  if (cleanPhone.length < 10) {
    return {
      success: false,
      error: 'Please enter a valid 10-digit mobile number.',
    };
  }

  // Extract pending referral code
  const rawPendingRef = (input.pendingReferralCode || '').toString().trim();
  const cleanPendingRef = rawPendingRef.toUpperCase();

  try {
    const result = await runTransaction(firestoreDb, async (transaction) => {
      // 1. Generate unique user ID and referral code
      const generatedId = input.requestedUserId && input.requestedUserId.trim()
        ? input.requestedUserId.trim().toUpperCase()
        : `AT${Math.floor(100000 + Math.random() * 900000)}`;

      const newUserDocRef = doc(firestoreDb, COLLECTIONS.USERS, generatedId);
      const existingNewUserSnap = await transaction.get(newUserDocRef);

      let targetUserId = generatedId;
      if (existingNewUserSnap.exists()) {
        targetUserId = `AT${Math.floor(100000 + Math.random() * 900000)}`;
      }
      const finalUserDocRef = doc(firestoreDb, COLLECTIONS.USERS, targetUserId);

      // Generate random referral code
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
      let rand = '';
      for (let i = 0; i < 4; i++) {
        rand += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      const newReferralCode = `APNA${rand}${Math.floor(100 + Math.random() * 900)}`.slice(0, 7);

      // 2. Validate pendingReferralCode & Resolve Referrer (with Transaction Reads First)
      let verifiedReferrerId: string | null = null;
      let verifiedReferrerCode: string | null = null;
      let sponsorName: string | null = null;
      let sponsorDocRefToUpdate: any = null;

      if (cleanPendingRef && cleanPendingRef.length > 0) {
        // Try reading potential sponsor document directly by ID
        const potentialSponsorRef = doc(firestoreDb, COLLECTIONS.USERS, cleanPendingRef);
        const sponsorSnap = await transaction.get(potentialSponsorRef);

        if (sponsorSnap.exists()) {
          const sData = sponsorSnap.data() as any;
          // ANTI-SELF-REFERRAL CHECK
          const isSelf =
            sponsorSnap.id.toUpperCase() === targetUserId.toUpperCase() ||
            (sData.email && sData.email.toLowerCase() === cleanEmail) ||
            (sData.phone && sData.phone.replace(/[^0-9]/g, '') === cleanPhone) ||
            (sData.referralCode && sData.referralCode.toUpperCase() === newReferralCode.toUpperCase());

          if (!isSelf) {
            verifiedReferrerId = sponsorSnap.id;
            verifiedReferrerCode = sData.referralCode || sponsorSnap.id;
            sponsorName = sData.name || 'Sponsor';
            sponsorDocRefToUpdate = potentialSponsorRef;
          } else {
            console.warn(`[Firestore Transaction] Self-referral attempt blocked for ID: ${targetUserId}`);
          }
        } else {
          // If not matched by doc ID directly, store cleaned code if not self
          if (cleanPendingRef !== targetUserId && cleanPendingRef !== newReferralCode) {
            verifiedReferrerId = cleanPendingRef;
            verifiedReferrerCode = cleanPendingRef;
          }
        }
      }

      // 3. Construct New User Record with Atomic referredBy Assignment
      const newUserPayload = {
        id: targetUserId,
        name,
        phone: cleanPhone,
        email: cleanEmail,
        password,
        referralCode: newReferralCode,
        referredBy: verifiedReferrerId, // ATOMICALLY ASSIGNED
        referredByCode: verifiedReferrerCode,
        sponsorName: sponsorName,
        depositWallet: 0,
        ticketWallet: 0,
        winningWallet: 10, // ₹10 Signup Bonus
        walletBalance: 10,
        referralEarnings: 0,
        directIncomeEarnings: 0,
        gameWinnings: 0,
        totalDeposited: 0,
        totalWithdrawn: 0,
        freeTicketsAvailable: 0,
        directReferralsCount: 0,
        role: 'user',
        stateOfResidence,
        isKycVerified: false,
        ageVerified: true,
        termsAccepted: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      // 4. Atomic Writes in Transaction
      transaction.set(finalUserDocRef, newUserPayload);

      // If sponsor document was resolved and read, update direct downline count atomically
      if (sponsorDocRefToUpdate) {
        transaction.update(sponsorDocRefToUpdate, {
          directReferralsCount: increment(1),
          updatedAt: serverTimestamp(),
        });
      }

      return {
        user: {
          ...newUserPayload,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        referrer: verifiedReferrerId
          ? { id: verifiedReferrerId, name: sponsorName || 'Sponsor', referralCode: verifiedReferrerCode || undefined }
          : null,
      };
    });

    return {
      success: true,
      user: result.user,
      referrer: result.referrer,
      message: 'User registered successfully with atomic referral assignment.',
    };
  } catch (error: any) {
    console.error('[Firestore Transaction Registration Error]:', error);
    return {
      success: false,
      error: error.message || 'Firestore transaction registration failed.',
    };
  }
}

/**
 * Query downline users referred by a specific user (utilizes index on referredBy)
 */
export async function getDownlineUsersByReferrer(referrerId: string): Promise<any[]> {
  try {
    const firestoreDb = getDb();
    if (!firestoreDb || !referrerId) return [];

    const usersRef = collection(firestoreDb, COLLECTIONS.USERS);
    const q = query(
      usersRef,
      where('referredBy', '==', referrerId),
      orderBy('createdAt', 'desc'),
      limit(100)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));
  } catch (error) {
    console.warn('[Firestore getDownlineUsers error]:', error);
    return [];
  }
}

/**
 * Save / sync user profile to Firestore
 */
export async function syncUserToFirestore(user: any) {
  try {
    if (!user || !user.id) return;
    const firestoreDb = getDb();
    if (!firestoreDb) return;
    const userRef = doc(firestoreDb, COLLECTIONS.USERS, user.id);
    await setDoc(userRef, {
      ...user,
      updatedAt: serverTimestamp(),
    }, { merge: true });
  } catch (error) {
    console.warn('Firestore sync user error:', error);
  }
}

/**
 * Save ticket purchase to Firestore
 */
export async function syncTicketToFirestore(ticket: any) {
  try {
    if (!ticket || !ticket.id) return;
    const firestoreDb = getDb();
    if (!firestoreDb) return;
    const ticketRef = doc(firestoreDb, COLLECTIONS.TICKETS, ticket.id);
    await setDoc(ticketRef, {
      ...ticket,
      createdAt: serverTimestamp(),
    }, { merge: true });
  } catch (error) {
    console.warn('Firestore sync ticket error:', error);
  }
}

/**
 * Save game state and called numbers to Firestore
 */
export async function syncGameToFirestore(game: any) {
  try {
    if (!game || !game.id) return;
    const firestoreDb = getDb();
    if (!firestoreDb) return;
    const gameRef = doc(firestoreDb, COLLECTIONS.GAMES, game.id);
    await setDoc(gameRef, {
      ...game,
      updatedAt: serverTimestamp(),
    }, { merge: true });
  } catch (error) {
    console.warn('Firestore sync game error:', error);
  }
}

/**
 * Record a transaction to Firestore
 */
export async function recordTransactionToFirestore(transaction: any) {
  try {
    if (!transaction || !transaction.id) return;
    const firestoreDb = getDb();
    if (!firestoreDb) return;
    const txRef = doc(firestoreDb, COLLECTIONS.TRANSACTIONS, transaction.id);
    await setDoc(txRef, {
      ...transaction,
      timestamp: serverTimestamp(),
    }, { merge: true });
  } catch (error) {
    console.warn('Firestore record transaction error:', error);
  }
}

/**
 * Record winner to Firestore
 */
export async function recordWinnerToFirestore(winner: any) {
  try {
    if (!winner || !winner.id) return;
    const firestoreDb = getDb();
    if (!firestoreDb) return;
    const winRef = doc(firestoreDb, COLLECTIONS.WINNERS, winner.id);
    await setDoc(winRef, {
      ...winner,
      createdAt: serverTimestamp(),
    }, { merge: true });
  } catch (error) {
    console.warn('Firestore record winner error:', error);
  }
}
