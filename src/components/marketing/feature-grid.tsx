"use client";

import { motion } from "framer-motion";
import {
  Brain,
  Code2,
  Eye,
  GitBranch,
  Globe,
  Layers,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";

const FEATURES = [
  {
    icon: Brain,
    title: "Prompt-to-app generation",
    body: "Describe what you want; get a fully wired frontend, backend, and database — generated in seconds.",
  },
  {
    icon: Code2,
    title: "Built-in IDE",
    body: "Monaco-powered editor with multi-tab editing, file tree, AI autocomplete, and split-pane preview.",
  },
  {
    icon: Eye,
    title: "Live preview",
    body: "Instant hot-reload across desktop, tablet, and mobile breakpoints with error overlays.",
  },
  {
    icon: Sparkles,
    title: "AI co-pilot suite",
    body: "Explain, debug, refactor, improve UI, score accessibility & SEO — without leaving your file.",
  },
  {
    icon: GitBranch,
    title: "Versioning",
    body: "Every save is a snapshot. Diff, restore, and branch your project with one click.",
  },
  {
    icon: Layers,
    title: "Templates & marketplace",
    body: "Fork from 200+ premium templates, or publish your own to the community marketplace.",
  },
  {
    icon: ShieldCheck,
    title: "Enterprise security",
    body: "Firebase rules, role-based access, audit logs, and rate-limited APIs out of the box.",
  },
  {
    icon: Globe,
    title: "Deploy anywhere",
    body: "Export to ZIP, push to GitHub, or one-click deploy to Vercel, Firebase Hosting, or your own infra.",
  },
  {
    icon: Zap,
    title: "Built for speed",
    body: "Edge rendering, ISR, and a streaming AI pipeline — your projects feel snappy from the first keystroke.",
  },
];

export function FeatureGrid() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-20" id="features">
      <div className="mx-auto max-w-2xl text-center">
        <p className="label">Features</p>
        <h2 className="mt-2 font-display text-3xl sm:text-5xl tracking-tight heading-grad">
          One workspace. Every layer.
        </h2>
        <p className="mt-4 text-fg-muted">
          From the first prompt to a deployed product, every step is AI-native
          and built to feel obvious.
        </p>
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.04 }}
            className="card group p-6 transition hover:border-border-strong"
          >
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-[linear-gradient(135deg,#4458ff33,#a855f733)] text-fg">
              <f.icon size={18} />
            </div>
            <h3 className="mt-4 font-medium">{f.title}</h3>
            <p className="mt-1.5 text-sm text-fg-muted">{f.body}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
