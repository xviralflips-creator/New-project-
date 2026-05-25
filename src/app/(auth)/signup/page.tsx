"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { SocialButtons } from "@/components/auth/social-buttons";
import { emailSignUp } from "@/lib/firebase/auth";
import { friendlyError } from "@/lib/firebase/errors";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    setSubmitting(true);
    try {
      await emailSignUp(email, password, name);
      toast.success("Account created. Check your email to verify.");
      router.push("/dashboard");
    } catch (err) {
      toast.error(friendlyError(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="card w-full max-w-md p-7 sm:p-8">
      <h2 className="font-display text-2xl">Create your account</h2>
      <p className="mt-1 text-sm text-fg-muted">
        Free forever. Upgrade only when you need to.
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
        <Field label="Name">
          <Input
            required
            autoComplete="name"
            placeholder="Ada Lovelace"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Field>
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
        <Field label="Password" hint="At least 8 characters.">
          <Input
            type="password"
            required
            autoComplete="new-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Field>
        <Button className="w-full" loading={submitting}>
          Create account
        </Button>
      </form>

      <p className="mt-6 text-center text-xs text-fg-subtle">
        By signing up you agree to our{" "}
        <Link href="/terms" className="hover:text-fg">Terms</Link> and{" "}
        <Link href="/privacy" className="hover:text-fg">Privacy Policy</Link>.
      </p>

      <p className="mt-4 text-center text-sm text-fg-muted">
        Already have an account?{" "}
        <Link href="/login" className="text-fg hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
