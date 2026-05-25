"use client";

export const dynamic = "force-dynamic";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const TEMPLATES = [
  { slug: "saas-landing", name: "SaaS Landing", tag: "Marketing", color: "from-brand-500 to-accent-violet", prompt: "Build a futuristic SaaS landing page with hero, features, testimonials, pricing, and FAQ. Dark mode, glassmorphism." },
  { slug: "portfolio", name: "Designer Portfolio", tag: "Personal", color: "from-accent-pink to-accent-violet", prompt: "Create a minimalist designer portfolio with case studies, projects gallery, and contact form." },
  { slug: "ecom", name: "Storefront", tag: "Ecommerce", color: "from-accent-cyan to-brand-500", prompt: "Generate an ecommerce storefront with product grid, product detail page, and a slide-over cart drawer." },
  { slug: "blog", name: "Editorial Blog", tag: "Content", color: "from-accent-lime to-accent-cyan", prompt: "Build an editorial-style blog with categories, search, reading-time estimates, and tag pages." },
  { slug: "dashboard", name: "Analytics Dashboard", tag: "Internal", color: "from-brand-500 to-accent-cyan", prompt: "Generate a SaaS analytics dashboard with sidebar nav, KPI cards, line/bar charts, and a data table with filters." },
  { slug: "ai-tool", name: "AI Tool Starter", tag: "AI", color: "from-accent-violet to-accent-pink", prompt: "Create an AI utility app with a prompt input, streamed response area, history sidebar, and copy-to-clipboard." },
];

export default function DashboardTemplatesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl">Templates</h1>
        <p className="text-sm text-fg-muted">
          Start from a polished template — fork and customize with AI.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TEMPLATES.map((t) => (
          <article
            key={t.slug}
            className="card group overflow-hidden p-0 transition hover:border-border-strong"
          >
            <div
              className={`relative h-32 bg-gradient-to-br ${t.color} bg-[length:200%_200%] animate-gradient-x`}
            >
              <div className="absolute inset-0 bg-noise opacity-10 mix-blend-overlay" />
              <span className="absolute left-3 top-3 chip bg-black/40 border-white/20 text-white">
                {t.tag}
              </span>
            </div>
            <div className="p-4">
              <h3 className="font-medium">{t.name}</h3>
              <p className="mt-1 text-xs text-fg-muted line-clamp-2">{t.prompt}</p>
              <div className="mt-3">
                <Link href={`/dashboard/generate?prompt=${encodeURIComponent(t.prompt)}`}>
                  <Button size="sm" variant="secondary">
                    <Sparkles size={12} /> Use template
                  </Button>
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
