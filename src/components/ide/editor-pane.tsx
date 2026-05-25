"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import { useIDEStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/skeleton";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="grid h-full place-items-center text-fg-muted">
      <div className="flex items-center gap-2 text-sm">
        <Spinner /> Loading editor…
      </div>
    </div>
  ),
});

export function EditorPane() {
  const files = useIDEStore((s) => s.files);
  const activePath = useIDEStore((s) => s.activePath);
  const openFile = useIDEStore((s) => s.openFile);
  const updateFile = useIDEStore((s) => s.updateFile);

  // Open tabs = activePath + recently opened (just show all files for now,
  // capped). For simplicity show top-level files first.
  const tabs = useMemo(() => {
    const order = files.map((f) => f.path);
    const idx = activePath ? order.indexOf(activePath) : -1;
    if (idx > 5) {
      // bring active into the visible row of 6
      return [activePath!, ...order.filter((p) => p !== activePath).slice(0, 5)];
    }
    return order.slice(0, 8);
  }, [files, activePath]);

  const file = files.find((f) => f.path === activePath) ?? null;

  return (
    <div className="flex h-full flex-col bg-bg-elev">
      <div className="flex items-center gap-1 overflow-x-auto scroll-thin border-b border-border bg-bg-soft/40 px-1.5">
        {tabs.map((path) => {
          const active = path === activePath;
          return (
            <button
              key={path}
              onClick={() => openFile(path)}
              className={cn(
                "group inline-flex items-center gap-2 border-b-2 px-3 py-2 text-xs whitespace-nowrap transition",
                active
                  ? "border-accent-violet text-fg"
                  : "border-transparent text-fg-muted hover:text-fg"
              )}
            >
              <span className="truncate max-w-[180px]">{path}</span>
            </button>
          );
        })}
      </div>

      <div className="relative flex-1 min-h-0">
        {file ? (
          <MonacoEditor
            key={file.path}
            height="100%"
            theme="vs-dark"
            language={file.language || guessLang(file.path)}
            value={file.content}
            onChange={(v) => updateFile(file.path, v ?? "")}
            options={{
              fontFamily: "var(--font-mono), ui-monospace, monospace",
              fontSize: 13,
              minimap: { enabled: false },
              smoothScrolling: true,
              scrollBeyondLastLine: false,
              padding: { top: 12, bottom: 12 },
              wordWrap: "on",
              tabSize: 2,
              automaticLayout: true,
              roundedSelection: true,
              renderLineHighlight: "all",
              cursorBlinking: "smooth",
              guides: { indentation: true },
            }}
          />
        ) : (
          <div className="grid h-full place-items-center text-sm text-fg-muted">
            Select a file from the explorer.
          </div>
        )}
      </div>
    </div>
  );
}

function guessLang(path: string): string {
  const ext = path.split(".").pop()?.toLowerCase() ?? "";
  return (
    {
      html: "html",
      htm: "html",
      css: "css",
      js: "javascript",
      mjs: "javascript",
      ts: "typescript",
      tsx: "typescript",
      jsx: "javascript",
      json: "json",
      md: "markdown",
      svg: "xml",
    } as Record<string, string>
  )[ext] ?? "plaintext";
}
