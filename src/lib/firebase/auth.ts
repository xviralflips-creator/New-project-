"use client";

import {
  createUserWithEmailAndPassword,
  GithubAuthProvider,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  type User,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { getDb, getFirebaseAuth } from "./client";
import type { Role, UserProfile } from "../types";

const DEFAULTS = {
  role: "user" as Role,
  plan: "free" as const,
  aiGenerationsUsed: 0,
  aiGenerationsLimit: 10,
  storageUsedBytes: 0,
  storageLimitBytes: 1024 * 1024 * 1024, // 1 GB
  projectsCount: 0,
};

export async function ensureUserDoc(user: User): Promise<UserProfile> {
  const db = getDb();
  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    const profile: UserProfile = {
      uid: user.uid,
      email: user.email ?? "",
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      ...DEFAULTS,
    };
    await setDoc(ref, { ...profile, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
    return profile;
  }
  // keep email/displayName/photo fresh
  await updateDoc(ref, {
    email: user.email ?? snap.data().email,
    displayName: user.displayName ?? snap.data().displayName ?? null,
    photoURL: user.photoURL ?? snap.data().photoURL ?? null,
    emailVerified: user.emailVerified,
    updatedAt: serverTimestamp(),
  });
  const data = snap.data() as Omit<UserProfile, "createdAt" | "updatedAt"> & {
    createdAt?: { toMillis?: () => number };
    updatedAt?: { toMillis?: () => number };
  };
  return {
    ...DEFAULTS,
    ...data,
    uid: user.uid,
    createdAt: data.createdAt?.toMillis?.() ?? Date.now(),
    updatedAt: data.updatedAt?.toMillis?.() ?? Date.now(),
  } as UserProfile;
}

export async function emailSignUp(email: string, password: string, name?: string) {
  const auth = getFirebaseAuth();
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  if (name) await updateProfile(cred.user, { displayName: name });
  await ensureUserDoc(cred.user);
  try {
    await sendEmailVerification(cred.user);
  } catch {
    // non-fatal
  }
  return cred.user;
}

export async function emailSignIn(email: string, password: string) {
  const auth = getFirebaseAuth();
  const cred = await signInWithEmailAndPassword(auth, email, password);
  await ensureUserDoc(cred.user);
  return cred.user;
}

export async function googleSignIn() {
  const provider = new GoogleAuthProvider();
  const cred = await signInWithPopup(getFirebaseAuth(), provider);
  await ensureUserDoc(cred.user);
  return cred.user;
}

export async function githubSignIn() {
  const provider = new GithubAuthProvider();
  const cred = await signInWithPopup(getFirebaseAuth(), provider);
  await ensureUserDoc(cred.user);
  return cred.user;
}

export async function resetPassword(email: string) {
  await sendPasswordResetEmail(getFirebaseAuth(), email);
}

export async function logout() {
  await signOut(getFirebaseAuth());
}

export function watchAuth(cb: (u: User | null) => void) {
  return onAuthStateChanged(getFirebaseAuth(), cb);
}
