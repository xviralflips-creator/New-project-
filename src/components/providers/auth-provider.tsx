"use client";

import { useEffect } from "react";
import { ensureUserDoc, watchAuth } from "@/lib/firebase/auth";
import { useAuthStore } from "@/lib/store";
import type { UserProfile } from "@/lib/types";

/**
 * Bridges Firebase Auth into our Zustand store.
 *
 * Defensive contract: this provider NEVER throws synchronously and never
 * leaves the store in a broken state. If ensureUserDoc throws (it really
 * shouldn't — we made it bulletproof — but defense in depth), we still
 * set a minimal in-memory profile from the FirebaseAuth user so the app
 * keeps rendering normally.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setUser = useAuthStore((s) => s.setUser);
  const setLoading = useAuthStore((s) => s.setLoading);

  useEffect(() => {
    setLoading(true);
    let unsub: (() => void) | undefined;
    try {
      unsub = watchAuth(async (fbUser) => {
        if (!fbUser) {
          setUser(null);
          return;
        }
        try {
          const profile = await ensureUserDoc(fbUser);
          setUser(profile);
        } catch (e) {
          // Belt + suspenders: ensureUserDoc shouldn't throw, but if it
          // ever does, fall back to an in-memory profile so the user
          // can still browse the dashboard.
          // eslint-disable-next-line no-console
          console.error("[auth-provider] ensureUserDoc threw — using in-memory fallback:", e);
          const fallback: UserProfile = {
            uid: fbUser.uid,
            email: fbUser.email ?? "",
            displayName: fbUser.displayName,
            photoURL: fbUser.photoURL,
            emailVerified: fbUser.emailVerified,
            role: "user",
            plan: "free",
            createdAt: Date.now(),
            updatedAt: Date.now(),
            aiGenerationsUsed: 0,
            aiGenerationsLimit: 10,
            storageUsedBytes: 0,
            storageLimitBytes: 1024 * 1024 * 1024,
            projectsCount: 0,
          };
          setUser(fallback);
          if (typeof window !== "undefined") {
            (window as unknown as { __ngFirestoreRulesMissing?: boolean }).__ngFirestoreRulesMissing = true;
            window.dispatchEvent(new CustomEvent("ng-firestore-rules-missing"));
          }
        }
      });
    } catch (e) {
      // Firebase init blew up. Leave user=null so the marketing site
      // still renders. The dashboard will redirect to /login.
      // eslint-disable-next-line no-console
      console.warn("[auth-provider] Firebase init failed:", (e as Error).message);
      setUser(null);
    }
    return () => {
      if (unsub) unsub();
    };
  }, [setUser, setLoading]);

  return <>{children}</>;
}
