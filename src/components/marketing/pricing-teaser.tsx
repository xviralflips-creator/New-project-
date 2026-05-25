import Link from "next/link";
import { Check } from "lucide-react";
import { PLANS } from "@/lib/plans";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function PricingTeaser() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-20" id="pricing">
      <div className="mx-auto max-w-2xl text-center">
        <p className="label">Pricing</p>
        <h2 className="mt-2 font-display text-3xl sm:text-5xl tracking-tight heading-grad">
          Plans that scale with you.
        </h2>
        <p className="mt-4 text-fg-muted">
          Start free. Upgrade when you ship.
        </p>
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PLANS.map((p) => (
          <div
            key={p.id}
            className={cn(
              "card relative flex flex-col p-6",
              p.popular && "border-brand-500/50 shadow-glow"
            )}
          >
            {p.popular && (
              <span className="absolute -top-3 left-6 rounded-full bg-[linear-gradient(120deg,#4458ff,#a855f7)] px-3 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
                Most popular
              </span>
            )}
            <h3 className="font-display text-xl">{p.name}</h3>
            <p className="mt-1 text-sm text-fg-muted">{p.description}</p>
            <p className="mt-4">
              {p.id === "enterprise" ? (
                <span className="font-display text-3xl">Custom</span>
              ) : (
                <>
                  <span className="font-display text-4xl">${p.priceMonthly}</span>
                  <span className="text-sm text-fg-subtle"> /mo</span>
                </>
              )}
            </p>
            <ul className="mt-5 space-y-2 text-sm">
              {p.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2 text-fg">
                  <Check size={14} className="mt-0.5 text-accent-cyan" />
                  {h}
                </li>
              ))}
            </ul>
            <div className="mt-auto pt-6">
              <Link
                href={p.id === "enterprise" ? "/contact" : "/signup"}
                className="block"
              >
                <Button
                  variant={p.popular ? "primary" : "secondary"}
                  className="w-full"
                >
                  {p.cta}
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-6 text-center text-xs text-fg-subtle">
        Prices in USD. Taxes may apply. Cancel anytime.
      </p>
    </section>
  );
}
