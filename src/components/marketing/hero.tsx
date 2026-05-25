"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const SUGGESTIONS = [
  "Build a SaaS landing page with pricing",
  "Create a food delivery web app",
  "Generate a portfolio with case studies",
  "Make a CRM dashboard with charts",
  "Build a Notion-style productivity tool",
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-stage pt-10 sm:pt-16">
      <div className="absolute inset-0 bg-grid" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 pt-12 pb-20 sm:pt-20 sm:pb-28">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <Link
            href="/changelog"
            className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs text-fg-muted hover:text-fg"
          >
            <Sparkles size={12} className="text-accent-cyan" />
            Now powered by Gemini 2.0 Flash
            <ArrowRight size={12} />
          </Link>
          <h1 className="mt-6 font-display text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.05] heading-grad">
            Build the next generation of apps,
            <br className="hidden sm:block" /> from a single prompt.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-fg-muted">
            NextGen AI Builder turns natural-language ideas into production-ready
            websites and apps — generated, edited, previewed, and deployed inside
            one beautiful workspace.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/signup">
              <Button size="lg" className="px-6">
                Start building free <ArrowRight size={16} />
              </Button>
            </Link>
            <Link href="/features">
              <Button variant="secondary" size="lg" className="px-6">
                See what it can do
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Prompt preview card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="relative mx-auto mt-14 max-w-4xl"
        >
          <div className="rounded-3xl border border-border-strong bg-bg-elev/80 backdrop-blur-xl shadow-glow">
            <div className="flex items-center gap-2 border-b border-border px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-red-400/70" />
              <span className="h-3 w-3 rounded-full bg-yellow-400/70" />
              <span className="h-3 w-3 rounded-full bg-green-400/70" />
              <span className="ml-3 text-xs text-fg-subtle">
                nextgen.ai · /generate
              </span>
            </div>
            <div className="p-6 sm:p-8">
              <div className="flex items-start gap-3 rounded-2xl border border-border bg-bg-soft p-4">
                <Wand2 size={18} className="mt-0.5 text-accent-violet" />
                <div className="flex-1">
                  <p className="text-sm text-fg">
                    Build a SaaS landing page for an{" "}
                    <span className="text-accent-cyan">AI fitness coach</span>{" "}
                    with hero, features, testimonials, pricing and FAQ. Dark
                    mode, glassmorphism, animated gradient.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {SUGGESTIONS.map((s) => (
                      <span key={s} className="chip">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  ["Frontend", "Next.js + Tailwind"],
                  ["Backend", "Firebase + Functions"],
                  ["Auth", "Email · Google · GitHub"],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-xl border border-border bg-bg-soft p-3">
                    <p className="text-[10px] uppercase tracking-wider text-fg-subtle">
                      {k}
                    </p>
                    <p className="mt-1 text-sm text-fg">{v}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="pointer-events-none absolute -inset-x-10 -bottom-16 h-40 bg-[radial-gradient(50%_50%_at_50%_0%,rgba(68,88,255,.35),transparent)]" />
        </motion.div>
      </div>
    </section>
  );
}
