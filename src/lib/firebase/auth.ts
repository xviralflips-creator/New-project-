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
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
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

/** Build a minimal in-memory profile from a FirebaseAuth user. */
function profileFromUser(user: User): UserProfile {
  return {
    uid: user.uid,
    email: user.email ?? "",
    displayName: user.displayName,
    photoURL: user.photoURL,
    emailVerified: user.emailVerified,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    ...DEFAULTS,
  };
}

function isPermissionError(e: unknown): boolean {
  const code = (e as { code?: string }).code ?? "";
  const msg = (e as { message?: string }).message ?? "";
  return (
    code === "permission-denied" ||
    code.includes("insufficient") ||
    /missing or insufficient permissions/i.test(msg)
  );
}

/**
 * Best-effort sync of `users/{uid}` in Firestore.
 *
 * If Firestore is unreachable or denies the write (because security rules
 * haven't been deployed yet), we DON'T crash the auth flow — we just return
 * an in-memory profile based on the FirebaseAuth user. The dashboard then
 * shows a "Firestore rules need to be deployed" banner so the user can fix
 * it in 30 seconds via the Firebase Console.
 */
export async function ensureUserDoc(user: User): Promise<UserProfile> {
  const fallback = profileFromUser(user);

  let db;
  try {
    db = getDb();
  } catch {
    return fallback;
  }

  const ref = doc(db, "users", user.uid);

  try {
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      try {
        await setDoc(ref, {
          ...fallback,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      } catch (e) {
        if (isPermissionError(e)) {
          warnRulesNotDeployed();
          return fallback;
        }
        throw e;
      }
      return fallback;
    }

    // Refresh email/displayName/photo on each login (best-effort)
    try {
      await updateDoc(ref, {
        email: user.email ?? snap.data().email,
        displayName: user.displayName ?? snap.data().displayName ?? null,
        photoURL: user.photoURL ?? snap.data().photoURL ?? null,
        emailVerified: user.emailVerified,
        updatedAt: serverTimestamp(),
      });
    } catch (e) {
      if (!isPermissionError(e)) throw e;
      warnRulesNotDeployed();
    }

    const data = snap.data() as Partial<UserProfile> & {
      createdAt?: { toMillis?: () => number };
      updatedAt?: { toMillis?: () => number };
    };
    return {
      ...DEFAULTS,
      ...data,
      uid: user.uid,
      email: user.email ?? data.email ?? "",
      displayName: user.displayName ?? data.displayName ?? null,
      photoURL: user.photoURL ?? data.photoURL ?? null,
      emailVerified: user.emailVerified,
      createdAt: data.createdAt?.toMillis?.() ?? Date.now(),
      updatedAt: data.updatedAt?.toMillis?.() ?? Date.now(),
    } as UserProfile;
  } catch (e) {
    if (isPermissionError(e)) {
      warnRulesNotDeployed();
      return fallback;
    }
    // eslint-disable-next-line no-console
    console.warn("[auth] Could not sync users/{uid} doc:", (e as Error).message);
    return fallback;
  }
}

let warned = false;
function warnRulesNotDeployed() {
  if (warned) return;
  warned = true;
  if (typeof window !== "undefined") {
    (window as unknown as { __ngFirestoreRulesMissing?: boolean }).__ngFirestoreRulesMissing = true;
    window.dispatchEvent(new CustomEvent("ng-firestore-rules-missing"));
  }
  // eslint-disable-next-line no-console
  console.warn(
    "[firestore] Rules deny writes. Open Firebase Console → Firestore → " +
      "Rules and paste the contents of firestore.rules from the repo, then " +
      "click Publish. Until then, your data won't persist between sessions."
  );
}

export async function emailSignUp(email: string, password: string, name?: string) {
  const auth = getFirebaseAuth();
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  if (name) {
    try {
      await updateProfile(cred.user, { displayName: name });
    } catch {
      // non-fatal
    }
  }
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
