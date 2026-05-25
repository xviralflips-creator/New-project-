"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

const FAQ = [
  {
    q: "Do unused AI generations roll over?",
    a: "No. Generation quotas reset on the first day of each billing cycle. Pro and Premium plans support buying additional packs at any time.",
  },
  {
    q: "Can I bring my own Gemini key?",
    a: "Yes — Premium and Enterprise plans let you connect your own Gemini, OpenAI, or Anthropic API key for unmetered usage.",
  },
  {
    q: "Do you offer a free trial of paid plans?",
    a: "All paid plans come with a 14-day money-back guarantee. We'll refund you in full if it isn't working out.",
  },
  {
    q: "How does the team plan work?",
    a: "Premium includes 5 seats and shared workspaces. Add more seats from your billing settings; Enterprise gives you unlimited seats and SSO.",
  },
  {
    q: "Do you support invoicing or POs?",
    a: "Yes, on the Enterprise plan. Talk to our team to set up annual contracts, invoicing, and custom terms.",
  },
  {
    q: "What happens if I exceed my AI quota?",
    a: "Your projects keep working — you just won't be able to run new generations until next cycle, or until you top up. No surprise charges.",
  },
];

export function PricingFAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="mx-auto max-w-3xl px-4 py-20">
      <div className="text-center">
        <p className="label">FAQ</p>
        <h2 className="mt-2 font-display text-3xl sm:text-4xl">
          Frequently asked questions
        </h2>
      </div>
      <div className="mt-10 divide-y divide-border rounded-2xl border border-border bg-bg-elev/40">
        {FAQ.map((f, i) => (
          <button
            key={f.q}
            onClick={() => setOpen(open === i ? null : i)}
            className="flex w-full items-start gap-4 px-5 py-4 text-left"
          >
            <span className="mt-1 text-fg-muted">
              {open === i ? <Minus size={16} /> : <Plus size={16} />}
            </span>
            <span className="flex-1">
              <span className="font-medium text-fg">{f.q}</span>
              <span
                className={cn(
                  "block overflow-hidden text-sm text-fg-muted transition-all",
                  open === i ? "mt-2 max-h-40" : "max-h-0"
                )}
              >
                {f.a}
              </span>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
