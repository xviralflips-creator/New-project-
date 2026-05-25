"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { friendlyError, isFirestorePermissionError } from "@/lib/firebase/errors";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  const isRulesError = isFirestorePermissionError(error);

  return (
    <main className="min-h-screen grid place-items-center px-4">
      <div className="card max-w-md p-8 text-center">
        <p className="label">{isRulesError ? "Setup needed" : "Something broke"}</p>
        <h1 className="mt-2 font-display text-2xl">
          {isRulesError ? "Firestore rules aren't published" : "We hit an unexpected error."}
        </h1>
        <p className="mt-2 text-sm text-fg-muted break-words">
          {friendlyError(error)}
        </p>
        <div className="mt-6 flex justify-center gap-2 flex-wrap">
          {isRulesError ? (
            <Link href="/help/firestore-rules">
              <Button>Open setup guide</Button>
            </Link>
          ) : (
            <Button onClick={reset}>Try again</Button>
          )}
          <Link href="/"><Button variant="secondary">Go home</Button></Link>
        </div>
      </div>
    </main>
  );
}
