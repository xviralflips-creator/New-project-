"use client";

export const dynamic = "force-dynamic";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Cpu,
  FolderKanban,
  HardDrive,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Empty } from "@/components/ui/empty";
import { ProjectCard } from "@/components/app/project-card";
import { useAuthStore } from "@/lib/store";
import { watchUserProjects } from "@/lib/firebase/projects";
import { formatBytes, formatRelative } from "@/lib/utils";
import type { Project } from "@/lib/types";

export default function DashboardOverview() {
  const user = useAuthStore((s) => s.user);
  const [projects, setProjects] = useState<Project[] | null>(null);

  useEffect(() => {
    if (!user) return;
    const unsub = watchUserProjects(user.uid, setProjects, 6);
    return unsub;
  }, [user]);

  if (!user) return null;

  const aiPct = Math.round((user.aiGenerationsUsed / Math.max(1, user.aiGenerationsLimit)) * 100);
  const storagePct = Math.round((user.storageUsedBytes / Math.max(1, user.storageLimitBytes)) * 100);

  return (
    <div className="space-y-8">
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="card relative overflow-hidden p-6 sm:p-8"
      >
        <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-[radial-gradient(closest-side,#a855f733,transparent)]" />
        <p className="label">Welcome back</p>
        <h1 className="mt-1 font-display text-2xl sm:text-3xl">
          Hello, {user.displayName?.split(" ")[0] || user.email.split("@")[0]} 👋
        </h1>
        <p className="mt-1 text-fg-muted max-w-xl">
          What are we building today? Spin up a new project from a single prompt,
          or pick up where you left off.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/dashboard/generate">
            <Button>
              <Sparkles size={14} /> Start a new AI project
            </Button>
          </Link>
          <Link href="/dashboard/templates">
            <Button variant="secondary">Browse templates</Button>
          </Link>
        </div>
      </motion.section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="AI generations"
          value={`${user.aiGenerationsUsed}/${user.aiGenerationsLimit}`}
          progress={aiPct}
          icon={<Cpu size={16} />}
        />
        <StatCard
          label="Storage used"
          value={`${formatBytes(user.storageUsedBytes)} / ${formatBytes(user.storageLimitBytes)}`}
          progress={storagePct}
          icon={<HardDrive size={16} />}
        />
        <StatCard
          label="Projects"
          value={String(user.projectsCount ?? 0)}
          icon={<FolderKanban size={16} />}
          accent
        />
        <StatCard
          label="Plan"
          value={user.plan.toUpperCase()}
          icon={<TrendingUp size={16} />}
          cta={
            user.plan === "free"
              ? { href: "/dashboard/billing", label: "Upgrade" }
              : undefined
          }
        />
      </section>

      <section>
        <div className="flex items-end justify-between">
          <h2 className="font-display text-lg">Recent projects</h2>
          <Link
            href="/dashboard/projects"
            className="text-sm text-fg-muted hover:text-fg flex items-center gap-1"
          >
            View all <ArrowUpRight size={12} />
          </Link>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects === null ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-44" />
            ))
          ) : projects.length === 0 ? (
            <div className="sm:col-span-2 lg:col-span-3">
              <Empty
                icon={<Sparkles size={20} />}
                title="No projects yet"
                description="Generate your first project from a prompt — landing pages, dashboards, full apps."
                action={
                  <Link href="/dashboard/generate">
                    <Button>Generate a project</Button>
                  </Link>
                }
              />
            </div>
          ) : (
            projects.map((p) => <ProjectCard key={p.id} project={p} />)
          )}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <ActivityCard projects={projects ?? []} />
        <TipsCard />
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  progress,
  icon,
  accent,
  cta,
}: {
  label: string;
  value: string;
  progress?: number;
  icon: React.ReactNode;
  accent?: boolean;
  cta?: { href: string; label: string };
}) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <span className="label">{label}</span>
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-bg-soft text-fg-muted">
          {icon}
        </span>
      </div>
      <p
        className={`mt-3 font-display text-2xl ${
          accent ? "heading-grad" : "text-fg"
        }`}
      >
        {value}
      </p>
      {typeof progress === "number" && (
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-bg-soft">
          <div
            className="h-full bg-[linear-gradient(90deg,#4458ff,#a855f7,#22d3ee)]"
            style={{ width: `${Math.min(100, progress)}%` }}
          />
        </div>
      )}
      {cta && (
        <Link
          href={cta.href}
          className="mt-3 inline-flex items-center gap-1 text-xs text-accent-cyan hover:underline"
        >
          {cta.label} <ArrowUpRight size={10} />
        </Link>
      )}
    </div>
  );
}

function ActivityCard({ projects }: { projects: Project[] }) {
  return (
    <div className="card p-5">
      <h3 className="font-medium">Recent activity</h3>
      {projects.length === 0 ? (
        <p className="mt-2 text-sm text-fg-muted">
          Your activity will appear here as you create and edit projects.
        </p>
      ) : (
        <ul className="mt-4 space-y-3">
          {projects.slice(0, 5).map((p) => (
            <li key={p.id} className="flex items-center gap-3">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-bg-soft text-fg-muted">
                <Sparkles size={14} />
              </span>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm">
                  Updated <span className="text-fg">{p.name}</span>
                </p>
                <p className="text-xs text-fg-subtle">
                  {formatRelative(p.updatedAt)}
                </p>
              </div>
              <Link
                href={`/dashboard/projects/${p.id}`}
                className="text-xs text-fg-muted hover:text-fg"
              >
                Open →
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function TipsCard() {
  return (
    <div className="card p-5">
      <h3 className="font-medium">Tips for great prompts</h3>
      <ul className="mt-3 space-y-2 text-sm text-fg-muted">
        <li>• Lead with the user goal: "a portfolio that helps me get hired".</li>
        <li>• Mention 1-3 key sections you want.</li>
        <li>• Reference a vibe: "minimal", "playful", "Linear-like".</li>
        <li>• Add constraints: "dark mode", "tailwind", "no images".</li>
      </ul>
      <Link
        href="/docs/prompts"
        className="mt-4 inline-flex items-center gap-1 text-xs text-accent-cyan hover:underline"
      >
        Read the prompting guide <ArrowUpRight size={10} />
      </Link>
    </div>
  );
}
