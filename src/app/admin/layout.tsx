"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowLeft,
  CreditCard,
  Cpu,
  Flag,
  LayoutDashboard,
  Megaphone,
  Settings,
  ShieldAlert,
  Users,
} from "lucide-react";
import { RequireAuth } from "@/components/auth/require-auth";
import { Logo } from "@/components/ui/logo";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuthStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/projects", label: "Projects", icon: Cpu },
  { href: "/admin/billing", label: "Billing", icon: CreditCard },
  { href: "/admin/moderation", label: "Moderation", icon: ShieldAlert },
  { href: "/admin/announcements", label: "Announcements", icon: Megaphone },
  { href: "/admin/feature-flags", label: "Feature flags", icon: Flag },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);

  return (
    <RequireAuth minRole="moderator">
      <div className="min-h-screen bg-bg">
        <div className="mx-auto grid min-h-screen max-w-[1600px] grid-cols-[260px_1fr]">
          <aside className="border-r border-border bg-bg-soft/40 px-2 py-3">
            <div className="px-2 py-2 flex items-center gap-2">
              <Logo />
              <span className="chip border-amber-400/30 bg-amber-400/10 text-amber-300 text-[10px]">
                Admin
              </span>
            </div>

            <Link
              href="/dashboard"
              className="mx-1.5 mt-2 flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs text-fg-muted hover:bg-bg-soft hover:text-fg"
            >
              <ArrowLeft size={12} /> Back to app
            </Link>

            <nav className="mt-4 space-y-1 px-1.5">
              {NAV.map((n) => {
                const active = n.exact
                  ? pathname === n.href
                  : pathname?.startsWith(n.href);
                return (
                  <Link
                    key={n.href}
                    href={n.href}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition",
                      active
                        ? "bg-bg-elev text-fg shadow-soft"
                        : "text-fg-muted hover:bg-bg-soft hover:text-fg"
                    )}
                  >
                    <n.icon size={15} className={active ? "text-amber-300" : ""} />
                    {n.label}
                  </Link>
                );
              })}
            </nav>

            {user && (
              <div className="m-2 mt-4 rounded-2xl border border-border bg-bg-soft/60 p-3 text-xs">
                <p className="text-fg truncate">{user.displayName || user.email}</p>
                <p className="capitalize text-fg-subtle">{user.role.replace("_", " ")}</p>
              </div>
            )}
          </aside>

          <div className="flex flex-col">
            <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-border bg-bg/80 px-6 py-3 backdrop-blur-xl">
              <div>
                <p className="text-xs uppercase tracking-wider text-fg-subtle">
                  Admin Console
                </p>
                <h2 className="text-sm font-medium text-fg">
                  {NAV.find(
                    (n) => (n.exact ? pathname === n.href : pathname?.startsWith(n.href))
                  )?.label ?? "Admin"}
                </h2>
              </div>
              <ThemeToggle />
            </header>

            <main className="flex-1 px-6 py-6">{children}</main>
          </div>
        </div>
      </div>
    </RequireAuth>
  );
}
