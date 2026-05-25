"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

type TabId = "ide" | "preview" | "ai" | "deploy";

const TABS = [
  {
    id: "ide",
    label: "Built-in IDE",
    title: "A real IDE — not a textbox",
    body: "Monaco editor, file tree, multi-tab editing, syntax highlighting, AI autocomplete, and an integrated terminal. Everything you'd expect from a modern desktop IDE — running in the browser.",
    bullets: ["Multi-pane layout", "Keyboard shortcuts", "Theme aware"],
  },
  {
    id: "preview",
    label: "Live preview",
    title: "Edit on the left, see it instantly on the right",
    body: "Sandboxed iframe preview with desktop, tablet, and mobile modes. Console output and runtime errors are streamed back into your editor.",
    bullets: ["Hot-reload", "Device frames", "Error overlays"],
  },
  {
    id: "ai",
    label: "AI tools",
    title: "An AI co-pilot for every layer",
    body: "Explain, debug, refactor, improve UI, score SEO and accessibility — invoked from a single command palette or a contextual right-click menu.",
    bullets: ["Context-aware", "One-click fixes", "Streaming output"],
  },
  {
    id: "deploy",
    label: "Deploy",
    title: "Ship anywhere in one click",
    body: "Export to ZIP, push to a connected GitHub repo, or deploy directly to Vercel or Firebase Hosting. Custom domains and environment management included.",
    bullets: ["GitHub export", "ZIP archive", "Custom domains"],
  },
];

export function ShowcaseTabs() {
  const [active, setActive] = useState(TABS[0].id);
  const tab = TABS.find((t) => t.id === active)!;
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <p className="label">Inside the workspace</p>
        <h2 className="mt-2 font-display text-3xl sm:text-5xl tracking-tight heading-grad">
          Everything connected.
        </h2>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-12 items-start">
        <div className="lg:col-span-4">
          <div className="flex lg:flex-col gap-2 overflow-x-auto scroll-thin pb-2">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setActive(t.id)}
                className={cn(
                  "rounded-xl border px-4 py-3 text-left text-sm transition flex-shrink-0 lg:flex-shrink",
                  active === t.id
                    ? "border-border-strong bg-bg-elev text-fg"
                    : "border-border bg-bg-soft/50 text-fg-muted hover:text-fg"
                )}
              >
                <span className="block text-xs uppercase tracking-wider text-fg-subtle">
                  {t.label}
                </span>
                <span className="mt-1 block text-fg">{t.title}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="card relative overflow-hidden p-6 sm:p-8 min-h-[360px]"
            >
              <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-[radial-gradient(closest-side,#a855f733,transparent)]" />
              <h3 className="font-display text-2xl">{tab.title}</h3>
              <p className="mt-3 text-fg-muted max-w-xl">{tab.body}</p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {tab.bullets.map((b) => (
                  <li key={b} className="chip">
                    {b}
                  </li>
                ))}
              </ul>

              <div className="mt-8 rounded-2xl border border-border bg-bg-soft/70 overflow-hidden">
                <div className="flex items-center gap-1.5 border-b border-border px-4 py-2.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
                </div>
                <pre className="p-5 text-xs leading-relaxed text-fg-muted overflow-x-auto scroll-thin">
                  <code>{SAMPLE[tab.id as TabId]}</code>
                </pre>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

const SAMPLE: Record<TabId, string> = {
  ide: `// app/page.tsx
import { Hero } from "@/components/Hero";
export default function Home() {
  return (
    <main>
      <Hero
        title="Welcome to Acme"
        subtitle="The fastest way to ship"
      />
    </main>
  );
}`,
  preview: `> Preview ready at /
> Reload triggered: app/page.tsx
> 1 console.warn: Image without alt
> Lighthouse: Performance 96 · A11y 94 · SEO 100`,
  ai: `/ai refactor
- Extract <Header /> from app/page.tsx
- Memoize <Pricing /> children with useMemo
- Replace inline SVGs with <Icon name="..." />
✓ 3 changes applied across 4 files`,
  deploy: `$ ng deploy --target vercel
✓ Building project (next build)
✓ Uploading 142 files
✓ Live at https://acme-1.nextgen.app`,
};
