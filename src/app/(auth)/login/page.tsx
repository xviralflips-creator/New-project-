"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { SocialButtons } from "@/components/auth/social-buttons";
import { emailSignIn } from "@/lib/firebase/auth";

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await emailSignIn(email, password);
      toast.success("Welcome back!");
      router.push(next);
    } catch (e) {
      const code = (e as { code?: string }).code ?? "";
      toast.error(
        code === "auth/invalid-credential" || code === "auth/wrong-password"
          ? "Invalid email or password."
          : code === "auth/user-not-found"
          ? "No account with that email."
          : (e as Error).message
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="card w-full max-w-md p-7 sm:p-8">
      <h2 className="font-display text-2xl">Sign in</h2>
      <p className="mt-1 text-sm text-fg-muted">
        Welcome back. Pick up where you left off.
      </p>

      <div className="mt-6">
        <SocialButtons />
      </div>
      <div className="my-6 flex items-center gap-3 text-xs text-fg-subtle">
        <div className="h-px flex-1 bg-border" />
        OR CONTINUE WITH EMAIL
        <div className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
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
        <Field
          label="Password"
        >
          <Input
            type="password"
            required
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Field>
        <div className="flex justify-end -mt-2">
          <Link
            href="/reset"
            className="text-xs text-fg-muted hover:text-fg"
          >
            Forgot password?
          </Link>
        </div>
        <Button className="w-full" loading={submitting}>
          Sign in
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-fg-muted">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-fg hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
