"use client";

import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { resetPassword } from "@/lib/firebase/auth";

export default function ResetPage() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await resetPassword(email);
      setSent(true);
      toast.success("Reset link sent.");
    } catch (e) {
      toast.error((e as Error).message ?? "Could not send reset link.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="card w-full max-w-md p-7 sm:p-8">
      <h2 className="font-display text-2xl">Reset password</h2>
      <p className="mt-1 text-sm text-fg-muted">
        We&apos;ll email you a secure reset link.
      </p>

      {sent ? (
        <div className="mt-6 rounded-2xl border border-border bg-bg-soft p-5 text-sm text-fg-muted">
          Check your inbox. If you don&apos;t see the email in a few minutes,
          look in spam or try again with a different address.
        </div>
      ) : (
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <Field label="Email">
            <Input
              type="email"
              required
              autoComplete="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Field>
          <Button className="w-full" loading={submitting}>
            Send reset link
          </Button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-fg-muted">
        Remembered it?{" "}
        <Link href="/login" className="text-fg hover:underline">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
