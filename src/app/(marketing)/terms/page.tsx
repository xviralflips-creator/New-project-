import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <article className="prose-invert mx-auto max-w-3xl px-4 py-16 text-fg-muted">
      <h1 className="font-display text-4xl text-fg">Terms of Service</h1>
      <p className="mt-2 text-sm text-fg-subtle">Last updated: May 25, 2026</p>
      <p className="mt-6">
        These Terms govern your access to and use of NextGen AI Builder. By
        creating an account you agree to be bound by them. This template is a
        starting point — replace it with terms reviewed by your legal counsel
        before going to production.
      </p>
      <h2 className="mt-8 text-fg text-xl font-semibold">1. Account</h2>
      <p>You are responsible for keeping your credentials secure and for all activity under your account.</p>
      <h2 className="mt-6 text-fg text-xl font-semibold">2. Acceptable use</h2>
      <p>Don't use the service to generate or distribute illegal content, infringe IP rights, or attempt to abuse the AI system.</p>
      <h2 className="mt-6 text-fg text-xl font-semibold">3. Content ownership</h2>
      <p>You retain ownership of the projects and code you generate. We retain no rights to your output beyond what's necessary to operate the service.</p>
      <h2 className="mt-6 text-fg text-xl font-semibold">4. Termination</h2>
      <p>We may suspend or terminate accounts that violate these Terms. You may cancel any time from billing settings.</p>
    </article>
  );
}
