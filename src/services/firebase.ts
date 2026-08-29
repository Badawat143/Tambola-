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

// Initialize Firebase App singleton
export const firebaseApp =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore with default or specific database ID if configured
const customDbId = (firebaseConfig as any).firestoreDatabaseId;
export const db = customDbId
  ? getFirestore(firebaseApp, customDbId)
  : getFirestore(firebaseApp);

export const auth = getAuth(firebaseApp);
export const googleProvider = new GoogleAuthProvider();

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
    const userRef = doc(db, COLLECTIONS.USERS, user.id);
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
    const ticketRef = doc(db, COLLECTIONS.TICKETS, ticket.id);
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
    const gameRef = doc(db, COLLECTIONS.GAMES, game.id);
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
    const txRef = doc(db, COLLECTIONS.TRANSACTIONS, transaction.id);
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
    const winRef = doc(db, COLLECTIONS.WINNERS, winner.id);
    await setDoc(winRef, {
      ...winner,
      createdAt: serverTimestamp(),
    }, { merge: true });
  } catch (error) {
    console.warn('Firestore record winner error:', error);
  }
}
