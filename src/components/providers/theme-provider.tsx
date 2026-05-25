"use client";

import { useEffect } from "react";
import { useThemeStore } from "@/lib/store";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);

  // hydrate from localStorage on mount
  useEffect(() => {
    const stored = (typeof window !== "undefined"
      ? (localStorage.getItem("theme") as "dark" | "light" | "system" | null)
      : null);
    if (stored) setTheme(stored);
  }, [setTheme]);

  // apply class
  useEffect(() => {
    if (typeof window === "undefined") return;
    const root = document.documentElement;
    const apply = (t: "dark" | "light") => {
      root.classList.remove("dark", "light");
      root.classList.add(t);
    };
    if (theme === "system") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      apply(mq.matches ? "dark" : "light");
      const handler = (e: MediaQueryListEvent) => apply(e.matches ? "dark" : "light");
      mq.addEventListener("change", handler);
      return () => mq.removeEventListener("change", handler);
    }
    apply(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return <>{children}</>;
}
