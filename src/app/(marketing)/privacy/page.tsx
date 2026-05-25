import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <article className="prose-invert mx-auto max-w-3xl px-4 py-16 text-fg-muted">
      <h1 className="font-display text-4xl text-fg">Privacy Policy</h1>
      <p className="mt-2 text-sm text-fg-subtle">Last updated: May 25, 2026</p>
      <p className="mt-6">
        We collect the minimum information needed to operate the service:
        account email, project metadata, and usage logs. We never sell your
        data. This template should be reviewed by counsel and adapted to your
        jurisdiction.
      </p>
      <h2 className="mt-8 text-fg text-xl font-semibold">Data we collect</h2>
      <ul className="list-disc pl-6">
        <li>Account: email, display name, profile photo (if provided)</li>
        <li>Usage: AI generations, project counts, storage usage</li>
        <li>Billing: handled by Stripe; we never store card details</li>
      </ul>
      <h2 className="mt-6 text-fg text-xl font-semibold">Your rights</h2>
      <p>You can export or delete your data at any time from settings, or by emailing privacy@nextgen.ai.</p>
    </article>
  );
}
