"use client";

import { useEffect, useState } from "react";
import { collection, getCountFromServer, query, where } from "firebase/firestore";
import {
  Cpu,
  DollarSign,
  FlaskConical,
  Megaphone,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import { getDb } from "@/lib/firebase/client";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

interface Counts {
  users: number;
  projects: number;
  generations: number;
  active: number;
}

export default function AdminOverview() {
  const [counts, setCounts] = useState<Counts | null>(null);

  useEffect(() => {
    (async () => {
      const db = getDb();
      try {
        const [u, p, g, a] = await Promise.all([
          getCountFromServer(collection(db, "users")),
          getCountFromServer(collection(db, "projects")),
          getCountFromServer(collection(db, "ai_generations")).catch(() => null),
          getCountFromServer(
            query(collection(db, "users"), where("plan", "in", ["pro", "premium", "enterprise"]))
          ).catch(() => null),
        ]);
        setCounts({
          users: u.data().count,
          projects: p.data().count,
          generations: g?.data().count ?? 0,
          active: a?.data().count ?? 0,
        });
      } catch {
        setCounts({ users: 0, projects: 0, generations: 0, active: 0 });
      }
    })();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl">Admin overview</h1>
        <p className="text-sm text-fg-muted">
          Monitor users, projects, AI usage, and platform health.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label="Users"
          value={counts?.users}
          icon={<Users size={14} />}
          accent
        />
        <Stat
          label="Projects"
          value={counts?.projects}
          icon={<Sparkles size={14} />}
        />
        <Stat
          label="AI generations"
          value={counts?.generations}
          icon={<Cpu size={14} />}
        />
        <Stat
          label="Paid users"
          value={counts?.active}
          icon={<TrendingUp size={14} />}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Quick actions" icon={<Megaphone size={14} />}>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link
                href="/admin/announcements"
                className="text-fg-muted hover:text-fg flex items-center justify-between"
              >
                <span>📣 Broadcast announcement</span>
                <span>→</span>
              </Link>
            </li>
            <li>
              <Link
                href="/admin/feature-flags"
                className="text-fg-muted hover:text-fg flex items-center justify-between"
              >
                <span>🚩 Toggle feature flags</span>
                <span>→</span>
              </Link>
            </li>
            <li>
              <Link
                href="/admin/users"
                className="text-fg-muted hover:text-fg flex items-center justify-between"
              >
                <span>👥 Manage users</span>
                <span>→</span>
              </Link>
            </li>
            <li>
              <Link
                href="/admin/moderation"
                className="text-fg-muted hover:text-fg flex items-center justify-between"
              >
                <span>🛡️ Review flagged content</span>
                <span>→</span>
              </Link>
            </li>
          </ul>
        </Card>

        <Card title="Platform" icon={<FlaskConical size={14} />}>
          <ul className="mt-3 space-y-2 text-sm text-fg-muted">
            <li className="flex justify-between">
              <span>API status</span>
              <span className="text-emerald-300">Operational</span>
            </li>
            <li className="flex justify-between">
              <span>Gemini integration</span>
              <span className="text-emerald-300">Healthy</span>
            </li>
            <li className="flex justify-between">
              <span>Stripe webhooks</span>
              <span className="text-amber-300">Configure</span>
            </li>
            <li className="flex justify-between">
              <span>Maintenance mode</span>
              <span className="text-fg">Off</span>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  icon,
  accent,
}: {
  label: string;
  value: number | undefined;
  icon: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <span className="label">{label}</span>
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-bg-soft text-fg-muted">
          {icon}
        </span>
      </div>
      {value === undefined ? (
        <Skeleton className="mt-3 h-9 w-24" />
      ) : (
        <p
          className={`mt-3 font-display text-2xl ${
            accent ? "heading-grad" : "text-fg"
          }`}
        >
          {value.toLocaleString()}
        </p>
      )}
    </div>
  );
}

function Card({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="card p-5">
      <div className="flex items-center gap-2">
        <span className="grid h-7 w-7 place-items-center rounded-lg bg-bg-soft text-fg-muted">
          {icon}
        </span>
        <h3 className="font-medium">{title}</h3>
      </div>
      {children}
    </div>
  );
}
