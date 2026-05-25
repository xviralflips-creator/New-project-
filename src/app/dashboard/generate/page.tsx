"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Cpu,
  Layers,
  Sparkles,
  Wand2,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { useAuthStore } from "@/lib/store";
import { createProject } from "@/lib/firebase/projects";
import type { ProjectFile } from "@/lib/types";

const PRESETS = [
  "Build a SaaS landing page for an AI fitness coach with hero, features, pricing, testimonials and FAQ — dark mode, glassmorphism.",
  "Create a food delivery web app with cuisines grid, restaurant cards, menu detail with add-to-cart, and a slide-over cart.",
  "Generate a designer portfolio with case studies, projects gallery, and a contact form. Minimal, editorial, lots of whitespace.",
  "Make an analytics dashboard with sidebar nav, KPI cards, line + bar charts, and a filterable data table.",
  "Build a Notion-style productivity tool with sidebar, page list, rich text editor, and dark mode.",
  "Generate an AI tool starter: prompt input, streamed response area, history sidebar, and copy-to-clipboard.",
];

const STAGES = [
  "Analyzing prompt intent…",
  "Planning project structure…",
  "Composing HTML, CSS, JS…",
  "Polishing UI & responsiveness…",
  "Finalizing & saving project…",
];

export default function GeneratePage() {
  const router = useRouter();
  const params = useSearchParams();
  const user = useAuthStore((s) => s.user);

  const [prompt, setPrompt] = useState(params.get("prompt") ?? "");
  const [busy, setBusy] = useState(false);
  const [stage, setStage] = useState(0);
  const stageTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (stageTimer.current) clearInterval(stageTimer.current);
    };
  }, []);

  function pickPreset(p: string) {
    setPrompt(p);
  }

  async function generate() {
    if (!user) return;
    if (prompt.trim().length < 8) {
      toast.error("Add a few more words about what you want to build.");
      return;
    }

    setBusy(true);
    setStage(0);
    stageTimer.current = setInterval(() => {
      setStage((s) => Math.min(STAGES.length - 1, s + 1));
    }, 1800);

    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = (await res.json()) as
        | {
            ok: true;
            project: {
              name: string;
              description: string;
              tags: string[];
              files: ProjectFile[];
            };
            durationMs: number;
          }
        | { ok: false; error: string };

      if (!("ok" in data) || !data.ok) {
        throw new Error("error" in data ? data.error : "Generation failed");
      }

      const proj = await createProject({
        ownerId: user.uid,
        name: data.project.name,
        description: data.project.description,
        prompt,
        framework: "static",
        files: data.project.files,
        tags: data.project.tags,
      });

      toast.success(`Generated in ${(data.durationMs / 1000).toFixed(1)}s`);
      router.push(`/dashboard/projects/${proj.id}`);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      if (stageTimer.current) clearInterval(stageTimer.current);
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl">Generate a new project</h1>
        <p className="text-sm text-fg-muted">
          Describe what you want to build. Be specific — sections, vibe,
          features, constraints.
        </p>
      </div>

      <div className="card relative overflow-hidden">
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-[radial-gradient(closest-side,#a855f733,transparent)]" />
        <div className="relative p-5 sm:p-6">
          <div className="flex items-center gap-2 text-xs text-fg-subtle">
            <Wand2 size={14} className="text-accent-violet" />
            Powered by Gemini · context-aware project generation
          </div>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. Build a SaaS landing page for an AI fitness coach with hero, features, pricing and FAQ — dark mode and glassmorphism."
            className="mt-3 min-h-[140px]"
            disabled={busy}
            maxLength={4000}
          />
          <div className="mt-3 flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p}
                disabled={busy}
                onClick={() => pickPreset(p)}
                className="chip hover:text-fg hover:border-border-strong disabled:opacity-50"
              >
                {p.length > 64 ? p.slice(0, 64) + "…" : p}
              </button>
            ))}
          </div>
          <div className="mt-5 flex items-center justify-between gap-2">
            <p className="text-xs text-fg-subtle">
              {prompt.length}/4000 ·{" "}
              {user
                ? `${user.aiGenerationsLimit - user.aiGenerationsUsed} generations left this cycle`
                : ""}
            </p>
            <Button onClick={generate} loading={busy} className="px-5">
              <Sparkles size={14} /> Generate project <ArrowRight size={14} />
            </Button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {busy && (
          <motion.div
            key="progress"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="card p-6"
          >
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-bg-soft text-accent-violet">
                <Cpu size={16} />
              </span>
              <div className="flex-1">
                <p className="text-sm font-medium">Generating your project</p>
                <p className="text-xs text-fg-muted">
                  This usually takes 5–15 seconds.
                </p>
              </div>
            </div>
            <ul className="mt-5 space-y-2">
              {STAGES.map((s, i) => (
                <li
                  key={s}
                  className={`flex items-center gap-3 text-sm ${
                    i <= stage ? "text-fg" : "text-fg-subtle"
                  }`}
                >
                  <span
                    className={`grid h-5 w-5 place-items-center rounded-full border ${
                      i < stage
                        ? "border-accent-cyan bg-accent-cyan/10 text-accent-cyan"
                        : i === stage
                        ? "border-accent-violet bg-accent-violet/10 text-accent-violet animate-pulse-glow"
                        : "border-border text-fg-subtle"
                    }`}
                  >
                    {i < stage ? "✓" : i + 1}
                  </span>
                  {s}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          {
            icon: Layers,
            title: "Multi-file output",
            body: "Gemini returns a complete index.html plus CSS/JS modules — ready to preview and edit.",
          },
          {
            icon: Wand2,
            title: "Editable everything",
            body: "Tweak the result with AI assists (refactor, debug, polish UI) right inside the workspace.",
          },
          {
            icon: Sparkles,
            title: "One-click ship",
            body: "Export to ZIP, push to GitHub, or deploy to Vercel — without leaving your browser.",
          },
        ].map((f) => (
          <div key={f.title} className="card p-5">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-bg-soft text-fg">
              <f.icon size={16} />
            </span>
            <h3 className="mt-3 font-medium">{f.title}</h3>
            <p className="mt-1 text-sm text-fg-muted">{f.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
