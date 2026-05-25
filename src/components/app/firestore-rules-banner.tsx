"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle, X } from "lucide-react";

const STORAGE_KEY = "ng_firestore_banner_dismissed";

/**
 * In-app banner shown when Firestore rejected a request with a
 * permission error. Listens for the custom `ng-firestore-rules-missing`
 * event dispatched by our auth/projects helpers.
 */
export function FirestoreRulesBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const dismissed =
      typeof window !== "undefined" &&
      window.sessionStorage.getItem(STORAGE_KEY) === "1";
    if (dismissed) return;

    function reveal() {
      setShow(true);
    }
    if (
      typeof window !== "undefined" &&
      (window as unknown as { __ngFirestoreRulesMissing?: boolean }).__ngFirestoreRulesMissing
    ) {
      reveal();
    }
    window.addEventListener("ng-firestore-rules-missing", reveal);
    return () => window.removeEventListener("ng-firestore-rules-missing", reveal);
  }, []);

  if (!show) return null;

  function dismiss() {
    setShow(false);
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(STORAGE_KEY, "1");
    }
  }

  return (
    <div className="mb-4 rounded-2xl border border-amber-500/40 bg-amber-500/5 p-4">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 grid h-7 w-7 place-items-center rounded-lg bg-amber-500/20 text-amber-300">
          <AlertTriangle size={14} />
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-amber-100">
            Firestore rules need to be published
          </p>
          <p className="mt-1 text-sm text-amber-200/80">
            Your data won&apos;t persist until you publish the security rules
            in Firebase Console. It takes 30 seconds — copy{" "}
            <code className="rounded bg-amber-500/20 px-1 py-0.5 font-mono text-xs">firestore.rules</code>{" "}
            from the repo and paste it into Firebase Console → Firestore → Rules.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <a
              href="https://console.firebase.google.com/project/money-flow-machine/firestore/rules"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500/20 px-3 py-1.5 text-xs font-medium text-amber-100 hover:bg-amber-500/30"
            >
              Open Firestore Rules →
            </a>
            <Link
              href="/help/firestore-rules"
              className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/40 px-3 py-1.5 text-xs font-medium text-amber-100 hover:bg-amber-500/10"
            >
              Step-by-step guide
            </Link>
          </div>
        </div>
        <button
          onClick={dismiss}
          className="rounded-lg p-1 text-amber-300/70 hover:bg-amber-500/10 hover:text-amber-100"
          aria-label="Dismiss"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
