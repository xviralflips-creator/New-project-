"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  CreditCard,
  FolderKanban,
  Home,
  LayoutTemplate,
  LifeBuoy,
  Settings,
  ShieldCheck,
  Sparkles,
  Wand2,
} from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/store";
import type { Role } from "@/lib/types";

interface Item {
  href: string;
  label: string;
  icon: React.ElementType;
  minRole?: Role;
  highlight?: boolean;
}

const ITEMS: Item[] = [
  { href: "/dashboard", label: "Overview", icon: Home },
  { href: "/dashboard/generate", label: "Generate", icon: Wand2, highlight: true },
  { href: "/dashboard/projects", label: "Projects", icon: FolderKanban },
  { href: "/dashboard/templates", label: "Templates", icon: LayoutTemplate },
  { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
  { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
  { href: "/admin", label: "Admin", icon: ShieldCheck, minRole: "moderator" },
];

const ROLE_RANK: Record<Role, number> = {
  user: 0, pro: 1, premium: 2, enterprise: 3, moderator: 4, admin: 5, super_admin: 6,
};

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);

  return (
    <aside className="flex h-full flex-col gap-3">
      <div className="px-2 py-2">
        <Logo />
      </div>

      <nav className="flex-1 space-y-1 px-1.5">
        {ITEMS.map((item) => {
          if (item.minRole && user && ROLE_RANK[user.role] < ROLE_RANK[item.minRole]) {
            return null;
          }
          const active =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname?.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition",
                active
                  ? "bg-bg-elev text-fg shadow-soft"
                  : "text-fg-muted hover:bg-bg-soft hover:text-fg"
              )}
            >
              <item.icon size={16} className={active ? "text-accent-cyan" : ""} />
              <span className="flex-1">{item.label}</span>
              {item.highlight && (
                <Sparkles size={12} className="text-accent-violet" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="px-1.5">
        <Link
          href="/help"
          className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-fg-muted hover:bg-bg-soft hover:text-fg"
        >
          <LifeBuoy size={16} />
          <span>Help & Support</span>
        </Link>
      </div>

      {user && (
        <div className="m-2 rounded-2xl border border-border bg-bg-soft/60 p-3">
          <div className="flex items-center gap-3">
            <Avatar user={user} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-fg">
                {user.displayName || user.email.split("@")[0]}
              </p>
              <p className="truncate text-xs text-fg-subtle capitalize">
                {user.plan} plan
              </p>
            </div>
          </div>
          <div className="mt-3">
            <p className="text-[10px] uppercase tracking-wider text-fg-subtle">
              AI usage
            </p>
            <UsageBar
              used={user.aiGenerationsUsed}
              total={user.aiGenerationsLimit}
            />
          </div>
        </div>
      )}
    </aside>
  );
}

function Avatar({ user }: { user: { displayName: string | null; email: string; photoURL: string | null } }) {
  const initial = (user.displayName || user.email)[0]?.toUpperCase();
  if (user.photoURL) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={user.photoURL} alt="" className="h-9 w-9 rounded-full object-cover" />;
  }
  return (
    <div className="grid h-9 w-9 place-items-center rounded-full bg-[linear-gradient(135deg,#4458ff,#a855f7)] text-sm font-semibold text-white">
      {initial}
    </div>
  );
}

function UsageBar({ used, total }: { used: number; total: number }) {
  const pct = Math.min(100, Math.round((used / Math.max(1, total)) * 100));
  return (
    <div className="mt-1.5">
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-bg-elev">
        <div
          className="h-full bg-[linear-gradient(90deg,#4458ff,#a855f7,#22d3ee)]"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-1 text-[11px] text-fg-subtle">
        {used} / {total} used
      </p>
    </div>
  );
}
