"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Download,
  PanelLeftClose,
  PanelLeftOpen,
  PlayCircle,
  Save,
  Share2,
} from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/skeleton";
import { useIDEStore } from "@/lib/store";
import { saveProjectVersion, updateProject } from "@/lib/firebase/projects";
import { useAuthStore } from "@/lib/store";
import { makeZip } from "@/lib/zip";
import { cn } from "@/lib/utils";
import { FileTree } from "./file-tree";
import { EditorPane } from "./editor-pane";
import { PreviewPane } from "./preview-pane";
import { AIAssistMenu } from "./ai-assist-menu";

export function IDEShell() {
  const router = useRouter();
  const project = useIDEStore((s) => s.project);
  const files = useIDEStore((s) => s.files);
  const dirty = useIDEStore((s) => s.dirty);
  const markSaved = useIDEStore((s) => s.markSaved);
  const bumpPreview = useIDEStore((s) => s.bumpPreview);
  const user = useAuthStore((s) => s.user);

  const [showTree, setShowTree] = useState(true);
  const [saving, setSaving] = useState(false);

  // Cmd/Ctrl-S to save, Cmd/Ctrl-R to refresh preview
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      const mod = e.metaKey || e.ctrlKey;
      if (!mod) return;
      const k = e.key.toLowerCase();
      if (k === "s") {
        e.preventDefault();
        save();
      } else if (k === "b") {
        e.preventDefault();
        setShowTree((v) => !v);
      } else if (k === "enter") {
        e.preventDefault();
        bumpPreview();
      }
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // warn on unsaved leave
  useEffect(() => {
    function handler(e: BeforeUnloadEvent) {
      if (dirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    }
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  async function save() {
    if (!project || !user) return;
    if (saving) return;
    setSaving(true);
    try {
      await updateProject(project.id, { files, status: "ready" });
      await saveProjectVersion(project.id, files, user.uid, undefined, undefined);
      markSaved();
      toast.success("Saved · snapshot created");
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setSaving(false);
    }
  }

  function exportZip() {
    if (!project) return;
    const bytes = makeZip(files.map((f) => ({ path: f.path, content: f.content })));
    const blob = new Blob([bytes], { type: "application/zip" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${project.name.replace(/\s+/g, "-").toLowerCase()}.zip`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function copyShare() {
    if (typeof window === "undefined" || !project) return;
    const url = `${window.location.origin}/dashboard/projects/${project.id}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied");
  }

  if (!project) {
    return (
      <div className="grid min-h-[60vh] place-items-center text-fg-muted">
        <div className="flex items-center gap-2 text-sm">
          <Spinner /> Loading project…
        </div>
      </div>
    );
  }

  return (
    <div
      className="-mx-4 -my-6 sm:-mx-6 lg:-mx-8 flex flex-col bg-bg"
      style={{ height: "calc(100vh - 3.5rem)" }}
    >
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 border-b border-border bg-bg-soft/40 px-3 py-2">
        <div className="flex items-center gap-2 min-w-0">
          <Link
            href="/dashboard/projects"
            className="rounded-lg p-1.5 text-fg-muted hover:bg-bg-elev hover:text-fg"
            aria-label="Back"
          >
            <ArrowLeft size={14} />
          </Link>
          <button
            onClick={() => setShowTree((v) => !v)}
            className="rounded-lg p-1.5 text-fg-muted hover:bg-bg-elev hover:text-fg"
            aria-label="Toggle file tree"
            title="Toggle file tree (⌘B)"
          >
            {showTree ? <PanelLeftClose size={14} /> : <PanelLeftOpen size={14} />}
          </button>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-fg">{project.name}</p>
            <p className="truncate text-[11px] text-fg-subtle">
              {files.length} files · {project.framework}
              {dirty && " · unsaved"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => bumpPreview()}
            title="Re-run preview (⌘↵)"
          >
            <PlayCircle size={13} /> Run
          </Button>
          <AIAssistMenu />
          <Button size="sm" variant="ghost" onClick={exportZip} title="Export ZIP">
            <Download size={13} />
            <span className="hidden sm:inline">Export</span>
          </Button>
          <Button size="sm" variant="ghost" onClick={copyShare} title="Copy share link">
            <Share2 size={13} />
            <span className="hidden sm:inline">Share</span>
          </Button>
          <Button
            size="sm"
            onClick={save}
            loading={saving}
            disabled={!dirty && !saving}
            title="Save (⌘S)"
          >
            <Save size={13} /> Save
          </Button>
        </div>
      </div>

      {/* Body */}
      <div
        className={cn(
          "flex-1 min-h-0 grid",
          showTree
            ? "grid-cols-1 md:grid-cols-[260px_1fr] xl:grid-cols-[260px_1fr_minmax(380px,_1fr)]"
            : "grid-cols-1 xl:grid-cols-[1fr_minmax(380px,_1fr)]"
        )}
      >
        {showTree && (
          <div className="hidden md:block min-h-0 border-r border-border bg-bg-soft/30">
            <FileTree />
          </div>
        )}
        <div className="min-h-0 border-r border-border">
          <EditorPane />
        </div>
        <div className="hidden xl:block min-h-0">
          <PreviewPane />
        </div>
      </div>

      {/* Mobile preview toggle (under XL) — preview moves below editor */}
      <div className="xl:hidden border-t border-border h-72">
        <PreviewPane />
      </div>
    </div>
  );
}
