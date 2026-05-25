"use client";

import { useEffect, useRef, useState } from "react";
import { Bug, ChevronDown, Lightbulb, Palette, Sparkles, Wand2 } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { useIDEStore } from "@/lib/store";
import { cn } from "@/lib/utils";

type Kind = "explain" | "debug" | "refactor" | "ui_improve";

const ITEMS: { kind: Kind; label: string; icon: React.ElementType; desc: string }[] = [
  { kind: "explain", label: "Explain code", icon: Lightbulb, desc: "Plain-English breakdown" },
  { kind: "debug", label: "Debug & fix", icon: Bug, desc: "Find bugs, propose patch" },
  { kind: "refactor", label: "Refactor", icon: Wand2, desc: "Clean & modernize" },
  { kind: "ui_improve", label: "Improve UI", icon: Palette, desc: "Polish design + a11y" },
];

export function AIAssistMenu() {
  const [open, setOpen] = useState(false);
  const [busyKind, setBusyKind] = useState<Kind | null>(null);
  const [output, setOutput] = useState<{ kind: Kind; text: string } | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  const files = useIDEStore((s) => s.files);
  const activePath = useIDEStore((s) => s.activePath);
  const updateFile = useIDEStore((s) => s.updateFile);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const file = files.find((f) => f.path === activePath);

  async function run(kind: Kind) {
    if (!file) {
      toast.error("Open a file first.");
      return;
    }
    setOpen(false);
    setBusyKind(kind);
    setOutput(null);
    try {
      const res = await fetch("/api/ai/assist", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ kind, code: file.content, extra: `File: ${file.path}` }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Failed");
      setOutput({ kind, text: data.text });
      toast.success("AI response ready");
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusyKind(null);
    }
  }

  function applyAsFullFile() {
    if (!output || !file) return;
    // strip code fences if present
    let text = output.text.trim();
    const fence = text.match(/^```(?:\w+)?\n([\s\S]*?)\n```$/);
    if (fence) text = fence[1];
    updateFile(file.path, text);
    toast.success("Applied to active file");
    setOutput(null);
  }

  return (
    <>
      <div ref={ref} className="relative">
        <Button
          size="sm"
          variant="secondary"
          onClick={() => setOpen((v) => !v)}
          loading={busyKind !== null}
        >
          <Sparkles size={12} /> AI assist
          <ChevronDown size={12} />
        </Button>
        {open && (
          <div className="absolute right-0 z-50 mt-2 w-72 rounded-xl border border-border bg-bg-elev shadow-soft p-1.5">
            {ITEMS.map((i) => (
              <button
                key={i.kind}
                onClick={() => run(i.kind)}
                className="flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-fg-muted hover:bg-bg-soft hover:text-fg"
              >
                <span className="mt-0.5 grid h-7 w-7 place-items-center rounded-lg bg-bg-soft text-accent-violet">
                  <i.icon size={13} />
                </span>
                <span>
                  <span className="block text-fg">{i.label}</span>
                  <span className="block text-xs text-fg-subtle">{i.desc}</span>
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {output && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4"
          onClick={() => setOutput(null)}
        >
          <div
            className="card w-full max-w-3xl max-h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border px-5 py-3">
              <p className="font-medium capitalize">
                AI · {output.kind.replace("_", " ")}
              </p>
              <div className="flex items-center gap-2">
                {(output.kind === "refactor" || output.kind === "ui_improve") && (
                  <Button size="sm" onClick={applyAsFullFile}>
                    Apply to file
                  </Button>
                )}
                <button
                  onClick={() => setOutput(null)}
                  className="rounded-lg p-1.5 text-fg-muted hover:bg-bg-soft"
                  aria-label="Close"
                >
                  ×
                </button>
              </div>
            </div>
            <pre className="flex-1 overflow-auto scroll-thin p-5 font-mono text-xs leading-relaxed text-fg-muted whitespace-pre-wrap">
              {output.text}
            </pre>
          </div>
        </div>
      )}
    </>
  );
}
