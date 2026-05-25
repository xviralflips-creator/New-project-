"use client";

import Link from "next/link";
import { useState } from "react";
import { ExternalLink, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { formatRelative } from "@/lib/utils";
import { deleteProject } from "@/lib/firebase/projects";
import type { Project } from "@/lib/types";

export function ProjectCard({ project }: { project: Project }) {
  const [deleting, setDeleting] = useState(false);

  async function onDelete(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm(`Delete "${project.name}"? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      await deleteProject(project.id);
      toast.success("Project deleted");
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <Link
      href={`/dashboard/projects/${project.id}`}
      className="card group block overflow-hidden transition hover:border-border-strong"
    >
      <div className="relative h-32 overflow-hidden bg-[linear-gradient(120deg,#4458ff,#a855f7,#22d3ee)] bg-[length:200%_200%] animate-gradient-x">
        <div className="absolute inset-0 bg-noise opacity-10 mix-blend-overlay" />
        <div className="absolute right-3 top-3 flex gap-1.5">
          <span className="chip border-white/20 bg-black/30 text-white">
            {project.framework}
          </span>
        </div>
        <div className="absolute bottom-3 left-3 right-3">
          <p className="line-clamp-1 text-sm font-medium text-white">
            {project.name}
          </p>
          <p className="line-clamp-1 text-xs text-white/70">
            {project.description || project.prompt}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between p-3">
        <p className="text-xs text-fg-subtle">
          Updated {formatRelative(project.updatedAt)}
        </p>
        <div className="flex items-center gap-1">
          {project.deployUrl && (
            <a
              href={project.deployUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="rounded-md p-1.5 text-fg-muted hover:bg-bg-soft hover:text-fg"
              aria-label="Open deployed project"
            >
              <ExternalLink size={13} />
            </a>
          )}
          <button
            onClick={onDelete}
            disabled={deleting}
            className="rounded-md p-1.5 text-fg-muted hover:bg-bg-soft hover:text-red-400 disabled:opacity-50"
            aria-label="Delete project"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </Link>
  );
}
