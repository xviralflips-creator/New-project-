"use client";

import { getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

/**
 * Firebase web config.
 *
 * Why this is hard-coded as a fallback:
 *   Firebase's web config is **public by design** — it identifies your
 *   project to the SDK; security comes from Firestore rules + App Check,
 *   not from hiding these values. Hard-coding a fallback means:
 *     - The app never breaks if a deploy forgets the env vars (esp. on
 *       Vercel where NEXT_PUBLIC_* are inlined at build time).
 *     - You can still override per-environment by setting the env vars.
 *
 * If you want to use a different Firebase project, either:
 *   1) replace these values, or
 *   2) set NEXT_PUBLIC_FIREBASE_* env vars (they take precedence).
 */
const FALLBACK = {
  apiKey: "AIzaSyCT2240uSY2fMDtMdxum2jUN6z3Q24B6jQ",
  authDomain: "money-flow-machine.firebaseapp.com",
  projectId: "money-flow-machine",
  storageBucket: "money-flow-machine.firebasestorage.app",
  messagingSenderId: "101467783599",
  appId: "1:101467783599:web:2e6ca50c3ed6cd254f2f5a",
};

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || FALLBACK.apiKey,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || FALLBACK.authDomain,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || FALLBACK.projectId,
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || FALLBACK.storageBucket,
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ||
    FALLBACK.messagingSenderId,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || FALLBACK.appId,
};

let _app: FirebaseApp | null = null;
let _auth: Auth | null = null;
let _db: Firestore | null = null;
let _storage: FirebaseStorage | null = null;

export function getFirebaseApp(): FirebaseApp {
  if (_app) return _app;
  _app = getApps()[0] ?? initializeApp(firebaseConfig);
  return _app;
}

export function getFirebaseAuth(): Auth {
  if (_auth) return _auth;
  _auth = getAuth(getFirebaseApp());
  return _auth;
}

export function getDb(): Firestore {
  if (_db) return _db;
  _db = getFirestore(getFirebaseApp());
  return _db;
}

export function getFirebaseStorage(): FirebaseStorage {
  if (_storage) return _storage;
  _storage = getStorage(getFirebaseApp());
  return _storage;
}

/** True if Firebase has a real config (always true with the hardcoded fallback). */
export function isFirebaseConfigured(): boolean {
  return Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);
}
