"use client";

import { useEffect } from "react";
import { ensureUserDoc, watchAuth } from "@/lib/firebase/auth";
import { useAuthStore } from "@/lib/store";

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
          console.error("ensureUserDoc failed", e);
          setUser(null);
        }
      });
    } catch (e) {
      // Firebase env not configured; keep app rendering
      console.warn("[auth] Firebase not initialized:", (e as Error).message);
      setUser(null);
    }
    return () => {
      if (unsub) unsub();
    };
  }, [setUser, setLoading]);

  return <>{children}</>;
}
