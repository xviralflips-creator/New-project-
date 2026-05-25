"use client";

export const dynamic = "force-dynamic";

import Link from "next/link";
import { useState } from "react";
import { Check } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/store";
import { PLANS } from "@/lib/plans";
import { cn, formatBytes } from "@/lib/utils";

export default function BillingPage() {
  const user = useAuthStore((s) => s.user);
  const [busy, setBusy] = useState<string | null>(null);

  if (!user) return null;

  async function checkout(planId: string) {
    if (planId === "enterprise") {
      window.location.href = "/contact";
      return;
    }
    setBusy(planId);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ plan: planId, userId: user!.uid, email: user!.email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Checkout failed");
      if (data.url) window.location.href = data.url;
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl">Billing</h1>
        <p className="text-sm text-fg-muted">
          Manage your subscription, payment method, and invoices.
        </p>
      </div>

      <section className="card p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="label">Current plan</p>
            <p className="mt-1 font-display text-2xl capitalize">{user.plan}</p>
            <p className="mt-1 text-sm text-fg-muted">
              {user.subscriptionStatus
                ? `Status: ${user.subscriptionStatus}`
                : "You're on the free plan."}
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-center">
            <Stat
              label="AI used"
              value={`${user.aiGenerationsUsed}/${user.aiGenerationsLimit}`}
            />
            <Stat
              label="Storage"
              value={`${formatBytes(user.storageUsedBytes)} / ${formatBytes(user.storageLimitBytes)}`}
            />
            <Stat label="Projects" value={String(user.projectsCount ?? 0)} />
          </div>
        </div>
      </section>

      <section>
        <h2 className="font-display text-lg">Plans</h2>
        <div className="mt-4 grid gap-4 lg:grid-cols-4">
          {PLANS.map((p) => {
            const isCurrent = p.id === user.plan;
            return (
              <div
                key={p.id}
                className={cn(
                  "card flex flex-col p-6",
                  p.popular && "border-brand-500/50"
                )}
              >
                <h3 className="font-display text-xl">{p.name}</h3>
                <p className="mt-1 text-sm text-fg-muted">{p.description}</p>
                <p className="mt-4">
                  {p.id === "enterprise" ? (
                    <span className="font-display text-3xl">Custom</span>
                  ) : (
                    <>
                      <span className="font-display text-3xl">${p.priceMonthly}</span>
                      <span className="text-sm text-fg-subtle"> /mo</span>
                    </>
                  )}
                </p>
                <ul className="mt-4 space-y-1.5 text-sm">
                  {p.features.slice(0, 5).map((f) => (
                    <li key={f} className="flex items-start gap-2 text-fg-muted">
                      <Check size={12} className="mt-1 text-accent-cyan" />
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto pt-5">
                  <Button
                    className="w-full"
                    variant={isCurrent ? "secondary" : "primary"}
                    disabled={isCurrent}
                    loading={busy === p.id}
                    onClick={() => checkout(p.id)}
                  >
                    {isCurrent ? "Current plan" : p.cta}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="card p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-medium">Invoices</h2>
          <Link
            href="#"
            onClick={(e) => {
              e.preventDefault();
              toast("Connect a Stripe key to fetch invoices.");
            }}
            className="text-sm text-fg-muted hover:text-fg"
          >
            Manage billing portal →
          </Link>
        </div>
        <p className="mt-3 text-sm text-fg-muted">
          You don&apos;t have any invoices yet. Once you subscribe, your invoices
          will appear here and be emailed to you.
        </p>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-bg-soft px-3 py-2">
      <p className="text-[10px] uppercase tracking-wider text-fg-subtle">
        {label}
      </p>
      <p className="text-sm font-medium">{value}</p>
    </div>
  );
}
