"use client";

import { useState } from "react";
import { RequireAuth } from "@/components/auth/require-auth";
import { Sidebar } from "@/components/app/sidebar";
import { Topbar } from "@/components/app/topbar";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <RequireAuth>
      <div className="min-h-screen bg-bg">
        {/* Desktop sidebar */}
        <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-border bg-bg-soft/40 px-2 py-3 lg:block">
          <Sidebar />
        </aside>

        {/* Mobile drawer */}
        <div
          className={cn(
            "lg:hidden fixed inset-0 z-40 transition",
            open ? "pointer-events-auto" : "pointer-events-none"
          )}
        >
          <div
            onClick={() => setOpen(false)}
            className={cn(
              "absolute inset-0 bg-black/50 transition-opacity",
              open ? "opacity-100" : "opacity-0"
            )}
          />
          <div
            className={cn(
              "absolute inset-y-0 left-0 w-72 border-r border-border bg-bg p-2 shadow-xl transition-transform",
              open ? "translate-x-0" : "-translate-x-full"
            )}
          >
            <Sidebar onNavigate={() => setOpen(false)} />
          </div>
        </div>

        <div className="lg:pl-64">
          <Topbar onMenu={() => setOpen(true)} />
          <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            {children}
          </main>
        </div>
      </div>
    </RequireAuth>
  );
}
