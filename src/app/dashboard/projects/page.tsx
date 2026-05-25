"use client";

export const dynamic = "force-dynamic";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Empty } from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { ProjectCard } from "@/components/app/project-card";
import { useAuthStore } from "@/lib/store";
import { watchUserProjects } from "@/lib/firebase/projects";
import type { Project } from "@/lib/types";

export default function ProjectsPage() {
  const user = useAuthStore((s) => s.user);
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [q, setQ] = useState("");

  useEffect(() => {
    if (!user) return;
    return watchUserProjects(user.uid, setProjects, 200);
  }, [user]);

  const filtered = useMemo(() => {
    if (!projects) return null;
    const t = q.trim().toLowerCase();
    if (!t) return projects;
    return projects.filter(
      (p) =>
        p.name.toLowerCase().includes(t) ||
        p.description.toLowerCase().includes(t) ||
        p.prompt.toLowerCase().includes(t) ||
        p.tags.some((tag) => tag.toLowerCase().includes(t))
    );
  }, [projects, q]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl">Projects</h1>
          <p className="text-sm text-fg-muted">
            Everything you&apos;ve built with NextGen.
          </p>
        </div>
        <Link href="/dashboard/generate">
          <Button>
            <Sparkles size={14} /> New AI project
          </Button>
        </Link>
      </div>

      <div className="relative max-w-md">
        <Search
          size={14}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-fg-subtle"
        />
        <Input
          placeholder="Search by name, description, tag…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="pl-8"
        />
      </div>

      {filtered === null ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-44" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Empty
          icon={<Sparkles size={20} />}
          title={q ? "No matches" : "No projects yet"}
          description={
            q
              ? "Try a different keyword or clear the filter."
              : "Generate your first project from a prompt — landing pages, dashboards, full-stack apps."
          }
          action={
            !q ? (
              <Link href="/dashboard/generate">
                <Button>Generate a project</Button>
              </Link>
            ) : null
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      )}
    </div>
  );
}
