"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  Search,
  Settings,
  Sparkles,
  User,
} from "lucide-react";
import toast from "react-hot-toast";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuthStore } from "@/lib/store";
import { logout } from "@/lib/firebase/auth";
import { cn } from "@/lib/utils";

export function Topbar({ onMenu }: { onMenu?: () => void }) {
  const user = useAuthStore((s) => s.user);
  const router = useRouter();
  const [menu, setMenu] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setMenu(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // Cmd/Ctrl-K placeholder: focus the search input
  const searchRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-bg/80 px-4 py-3 backdrop-blur-xl sm:px-6">
      <button
        onClick={onMenu}
        className="lg:hidden rounded-lg p-2 text-fg-muted hover:bg-bg-soft"
        aria-label="Menu"
      >
        <Menu size={18} />
      </button>

      <div className="relative flex-1 max-w-md">
        <Search
          size={14}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-fg-subtle"
        />
        <input
          ref={searchRef}
          placeholder="Search projects, templates, docs…"
          className="input h-9 pl-8 pr-12"
        />
        <kbd className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rounded border border-border bg-bg-elev px-1.5 py-0.5 text-[10px] text-fg-subtle">
          ⌘K
        </kbd>
      </div>

      <Link
        href="/dashboard/generate"
        className="hidden sm:inline-flex btn-primary px-3 py-1.5 text-xs"
      >
        <Sparkles size={12} /> New AI project
      </Link>

      <ThemeToggle />

      <Link
        href="/dashboard/notifications"
        className="rounded-lg p-2 text-fg-muted hover:bg-bg-soft hover:text-fg"
        aria-label="Notifications"
      >
        <Bell size={18} />
      </Link>

      <div ref={ref} className="relative">
        <button
          onClick={() => setMenu((v) => !v)}
          className={cn(
            "flex items-center gap-2 rounded-lg px-2 py-1 text-sm transition",
            "hover:bg-bg-soft"
          )}
        >
          {user?.photoURL ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.photoURL}
              alt=""
              className="h-7 w-7 rounded-full object-cover"
            />
          ) : (
            <span className="grid h-7 w-7 place-items-center rounded-full bg-[linear-gradient(135deg,#4458ff,#a855f7)] text-xs font-semibold text-white">
              {user?.displayName?.[0]?.toUpperCase() ?? user?.email[0]?.toUpperCase() ?? "?"}
            </span>
          )}
          <ChevronDown size={14} className="text-fg-muted" />
        </button>
        {menu && (
          <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl border border-border bg-bg-elev shadow-soft p-1.5">
            <div className="px-3 py-2.5">
              <p className="truncate text-sm font-medium text-fg">
                {user?.displayName || user?.email}
              </p>
              <p className="truncate text-xs text-fg-subtle capitalize">
                {user?.plan} plan · {user?.role.replace("_", " ")}
              </p>
            </div>
            <div className="my-1 h-px bg-border" />
            <MenuLink href="/dashboard/settings" icon={<User size={14} />}>
              Profile
            </MenuLink>
            <MenuLink href="/dashboard/settings" icon={<Settings size={14} />}>
              Settings
            </MenuLink>
            <button
              onClick={async () => {
                await logout();
                toast.success("Signed out");
                router.push("/");
              }}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-fg-muted hover:bg-bg-soft hover:text-fg"
            >
              <LogOut size={14} /> Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

function MenuLink({
  href,
  icon,
  children,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-fg-muted hover:bg-bg-soft hover:text-fg"
    >
      {icon} {children}
    </Link>
  );
}
