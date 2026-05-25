import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Templates",
  description:
    "Fork polished, production-ready templates and customize them with AI.",
};

const TEMPLATES = [
  {
    slug: "saas-landing",
    name: "SaaS Landing",
    tag: "Marketing",
    description:
      "Hero, features, pricing, testimonials, FAQ — animated and dark-mode ready.",
    color: "from-brand-500 to-accent-violet",
  },
  {
    slug: "portfolio",
    name: "Designer Portfolio",
    tag: "Personal",
    description:
      "Case-study driven portfolio with project pages and a contact form.",
    color: "from-accent-pink to-accent-violet",
  },
  {
    slug: "ecom",
    name: "Storefront",
    tag: "Ecommerce",
    description:
      "Product grid, PDP, cart drawer, and checkout-ready scaffolding.",
    color: "from-accent-cyan to-brand-500",
  },
  {
    slug: "blog",
    name: "Editorial Blog",
    tag: "Content",
    description: "MDX-powered blog with categories, search, and reading time.",
    color: "from-accent-lime to-accent-cyan",
  },
  {
    slug: "dashboard",
    name: "Analytics Dashboard",
    tag: "Internal",
    description:
      "Sidebar layout with charts, KPI cards, tables, and a command palette.",
    color: "from-brand-500 to-accent-cyan",
  },
  {
    slug: "ai-tool",
    name: "AI Tool Starter",
    tag: "AI",
    description: "Form input → streamed AI output with auth and usage tracking.",
    color: "from-accent-violet to-accent-pink",
  },
];

export default function TemplatesPage() {
  return (
    <div className="pt-16">
      <div className="mx-auto max-w-3xl px-4 text-center">
        <p className="label">Templates</p>
        <h1 className="mt-2 font-display text-4xl sm:text-6xl tracking-tight heading-grad">
          Fork it. Ship it.
        </h1>
        <p className="mt-5 text-fg-muted">
          Hand-crafted starters you can spin up in seconds — and customize with
          AI from the workspace.
        </p>
      </div>

      <div className="mx-auto mt-14 max-w-7xl px-4 sm:px-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TEMPLATES.map((t) => (
          <article
            key={t.slug}
            className="card group overflow-hidden p-0 transition hover:border-border-strong"
          >
            <div
              className={`relative h-40 bg-gradient-to-br ${t.color} bg-[length:200%_200%] animate-gradient-x`}
            >
              <div className="absolute inset-0 bg-noise opacity-10 mix-blend-overlay" />
              <span className="absolute left-4 top-4 chip bg-black/40 border-white/20 text-white">
                {t.tag}
              </span>
            </div>
            <div className="p-5">
              <h3 className="font-medium">{t.name}</h3>
              <p className="mt-1 text-sm text-fg-muted">{t.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <Link href="/signup">
                  <Button variant="secondary" size="sm">
                    <Sparkles size={12} /> Use template
                  </Button>
                </Link>
                <Link
                  href={`/templates/${t.slug}`}
                  className="text-xs text-fg-muted hover:text-fg"
                >
                  Preview →
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
