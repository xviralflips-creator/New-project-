"use client";

import { Moon, Sun, Monitor } from "lucide-react";
import { useThemeStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);
  const items: { v: "light" | "dark" | "system"; icon: React.ReactNode }[] = [
    { v: "light", icon: <Sun size={14} /> },
    { v: "dark", icon: <Moon size={14} /> },
    { v: "system", icon: <Monitor size={14} /> },
  ];
  return (
    <div className="hidden sm:flex items-center rounded-xl border border-border bg-bg-soft p-0.5">
      {items.map((i) => (
        <button
          key={i.v}
          onClick={() => setTheme(i.v)}
          aria-label={i.v}
          className={cn(
            "flex h-7 w-8 items-center justify-center rounded-lg text-fg-muted transition",
            theme === i.v && "bg-bg-elev text-fg shadow-sm"
          )}
        >
          {i.icon}
        </button>
      ))}
    </div>
  );
}
