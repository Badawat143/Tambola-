import { initializeApp, getApps, getApp } from 'firebase/app';
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
  orderBy,
  limit,
  serverTimestamp,
} from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

let _firebaseApp: any = null;
let _db: any = null;
let _auth: any = null;

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

export function getDb() {
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

export {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
  limit,
  serverTimestamp,
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
