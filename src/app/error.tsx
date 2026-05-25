"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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

  return (
    <main className="min-h-screen grid place-items-center px-4">
      <div className="card max-w-md p-8 text-center">
        <p className="label">Something broke</p>
        <h1 className="mt-2 font-display text-2xl">
          We hit an unexpected error.
        </h1>
        <p className="mt-2 text-sm text-fg-muted break-words">
          {error.message || "Unknown error"}
        </p>
        <div className="mt-6 flex justify-center gap-2">
          <Button onClick={reset}>Try again</Button>
          <Link href="/"><Button variant="secondary">Go home</Button></Link>
        </div>
      </div>
    </main>
  );
}
