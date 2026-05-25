import type { Metadata } from "next";
import { PricingTeaser } from "@/components/marketing/pricing-teaser";
import { PricingFAQ } from "@/components/marketing/pricing-faq";
import { CtaBand } from "@/components/marketing/cta-band";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Simple plans that scale with your team. Free forever to start.",
};

export default function PricingPage() {
  return (
    <div className="pt-10">
      <div className="mx-auto max-w-3xl px-4 text-center pt-10 pb-2">
        <p className="label">Pricing</p>
        <h1 className="mt-2 font-display text-4xl sm:text-6xl tracking-tight heading-grad">
          Pay for what you ship.
        </h1>
        <p className="mt-5 text-fg-muted">
          Generous free tier, transparent overages, and an Enterprise plan with
          custom limits, SSO, and a dedicated account team.
        </p>
      </div>
      <PricingTeaser />
      <PricingFAQ />
      <CtaBand />
    </div>
  );
}
