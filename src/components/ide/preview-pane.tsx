"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  ExternalLink,
  Monitor,
  RefreshCw,
  Smartphone,
  Tablet,
  Terminal as TerminalIcon,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useIDEStore } from "@/lib/store";
import { buildPreviewSrcDoc } from "@/lib/preview";

type Device = "desktop" | "tablet" | "mobile";
const DIMS: Record<Device, { w: number; h: number; label: string }> = {
  desktop: { w: 1280, h: 800, label: "Desktop · 1280" },
  tablet: { w: 768, h: 1024, label: "Tablet · 768" },
  mobile: { w: 390, h: 844, label: "Mobile · 390" },
};

export function PreviewPane() {
  const files = useIDEStore((s) => s.files);
  const previewKey = useIDEStore((s) => s.previewKey);
  const bumpPreview = useIDEStore((s) => s.bumpPreview);
  const log = useIDEStore((s) => s.consoleLog);
  const pushLog = useIDEStore((s) => s.pushLog);
  const clearLog = useIDEStore((s) => s.clearLog);

  const [device, setDevice] = useState<Device>("desktop");
  const [showConsole, setShowConsole] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const srcDoc = useMemo(() => buildPreviewSrcDoc(files), [files, previewKey]);

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      const data = e.data;
      if (!data || typeof data !== "object") return;
      if (data.type === "preview-log") {
        pushLog(`[${data.level}] ${data.message}`);
      } else if (data.type === "preview-error") {
        setError(String(data.message ?? "Unknown error"));
        pushLog(`[error] ${data.message}`);
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [pushLog]);

  // clear error on rebuild
  useEffect(() => {
    setError(null);
  }, [previewKey, srcDoc]);

  // open in new tab
  function openExternal() {
    const blob = new Blob([srcDoc], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank", "noopener,noreferrer");
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  }

  return (
    <div className="flex h-full flex-col bg-bg">
      <div className="flex items-center justify-between border-b border-border bg-bg-soft/40 px-2 py-1.5">
        <div className="flex items-center gap-1">
          {(["desktop", "tablet", "mobile"] as Device[]).map((d) => (
            <button
              key={d}
              onClick={() => setDevice(d)}
              className={cn(
                "flex h-7 w-8 items-center justify-center rounded-lg text-fg-muted",
                device === d && "bg-bg-elev text-fg shadow-sm"
              )}
              title={DIMS[d].label}
              aria-label={d}
            >
              {d === "desktop" ? (
                <Monitor size={13} />
              ) : d === "tablet" ? (
                <Tablet size={13} />
              ) : (
                <Smartphone size={13} />
              )}
            </button>
          ))}
          <span className="ml-2 text-[11px] text-fg-subtle">
            {DIMS[device].label}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowConsole((v) => !v)}
            className={cn(
              "flex h-7 items-center gap-1 rounded-lg px-2 text-xs text-fg-muted hover:bg-bg-soft",
              showConsole && "bg-bg-elev text-fg"
            )}
            title="Toggle console"
          >
            <TerminalIcon size={12} /> Console
            {log.length > 0 && (
              <span className="rounded-full bg-bg-elev px-1 text-[10px]">
                {log.length}
              </span>
            )}
          </button>
          <button
            onClick={() => bumpPreview()}
            className="flex h-7 items-center gap-1 rounded-lg px-2 text-xs text-fg-muted hover:bg-bg-soft hover:text-fg"
            title="Refresh preview"
          >
            <RefreshCw size={12} />
          </button>
          <button
            onClick={openExternal}
            className="flex h-7 items-center gap-1 rounded-lg px-2 text-xs text-fg-muted hover:bg-bg-soft hover:text-fg"
            title="Open in new tab"
          >
            <ExternalLink size={12} />
          </button>
        </div>
      </div>

      <div
        ref={containerRef}
        className="relative flex-1 min-h-0 overflow-auto scroll-thin bg-[radial-gradient(circle_at_50%_0%,rgba(168,85,247,0.07),transparent_55%)] p-3 sm:p-6"
      >
        <div
          className="mx-auto rounded-2xl border border-border bg-white shadow-soft overflow-hidden transition-all"
          style={{
            width: "100%",
            maxWidth: device === "desktop" ? "100%" : `${DIMS[device].w}px`,
            height:
              device === "desktop"
                ? "100%"
                : `${Math.min(DIMS[device].h, 900)}px`,
          }}
        >
          <iframe
            key={previewKey}
            title="Live preview"
            sandbox="allow-scripts allow-forms allow-modals allow-popups allow-same-origin"
            className="h-full w-full border-0 bg-white"
            srcDoc={srcDoc}
          />
        </div>

        {error && (
          <div className="pointer-events-auto absolute inset-x-4 bottom-4 z-10 max-w-2xl mx-auto rounded-xl border border-red-500/40 bg-red-950/90 p-3 text-xs text-red-200 shadow-glow">
            <div className="flex items-start gap-2">
              <AlertTriangle size={14} className="mt-0.5 text-red-300" />
              <div className="flex-1">
                <p className="font-medium text-red-100">Runtime error</p>
                <p className="mt-1 break-words">{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="rounded p-1 text-red-200 hover:bg-red-900/40"
              >
                ×
              </button>
            </div>
          </div>
        )}
      </div>

      {showConsole && (
        <div className="h-40 border-t border-border bg-bg-soft/40">
          <div className="flex items-center justify-between border-b border-border px-3 py-1.5 text-xs text-fg-subtle">
            <span className="uppercase tracking-wider">Console</span>
            <button
              onClick={clearLog}
              className="flex items-center gap-1 rounded p-1 hover:bg-bg-elev hover:text-fg"
              title="Clear console"
            >
              <Trash2 size={11} />
            </button>
          </div>
          <pre className="h-[calc(100%-1.75rem)] overflow-auto scroll-thin px-3 py-2 font-mono text-[11px] text-fg-muted">
            {log.length === 0 ? (
              <span className="text-fg-subtle">No output yet.</span>
            ) : (
              log.join("\n")
            )}
          </pre>
        </div>
      )}
    </div>
  );
}
