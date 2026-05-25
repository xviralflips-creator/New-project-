import Link from "next/link";

export default function AdminBillingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl">Billing</h1>
        <p className="text-sm text-fg-muted">
          Plans, pricing, coupons, and invoices.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card p-5">
          <h2 className="font-medium">Plans</h2>
          <p className="mt-1 text-sm text-fg-muted">
            Plans are defined in <code className="font-mono text-xs">src/lib/plans.ts</code>.
            For dynamic plan changes, persist them in <code className="font-mono text-xs">admin_settings/plans</code> and
            read from Firestore at boot.
          </p>
          <div className="mt-3">
            <Link
              href="/pricing"
              className="text-sm text-accent-cyan hover:underline"
            >
              View public pricing →
            </Link>
          </div>
        </div>

        <div className="card p-5">
          <h2 className="font-medium">Coupons</h2>
          <p className="mt-1 text-sm text-fg-muted">
            Manage coupons in your Stripe dashboard. They&apos;re automatically
            available at checkout via <code className="font-mono text-xs">allow_promotion_codes</code>.
          </p>
          <a
            href="https://dashboard.stripe.com/coupons"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block text-sm text-accent-cyan hover:underline"
          >
            Open Stripe Coupons →
          </a>
        </div>
      </div>

      <div className="card p-5">
        <h2 className="font-medium">Webhook configuration</h2>
        <ol className="mt-3 space-y-2 list-decimal list-inside text-sm text-fg-muted">
          <li>
            Set <code className="font-mono text-xs">STRIPE_SECRET_KEY</code> and{" "}
            <code className="font-mono text-xs">STRIPE_WEBHOOK_SECRET</code> in your env.
          </li>
          <li>
            In Stripe → Webhooks, add an endpoint at{" "}
            <code className="font-mono text-xs">/api/stripe/webhook</code> for the events:{" "}
            <code className="font-mono text-xs">checkout.session.completed</code>,{" "}
            <code className="font-mono text-xs">customer.subscription.*</code>,{" "}
            <code className="font-mono text-xs">invoice.*</code>.
          </li>
          <li>
            Wire <code className="font-mono text-xs">firebase-admin</code> in the webhook
            route to persist subscription state to Firestore.
          </li>
        </ol>
      </div>
    </div>
  );
}
