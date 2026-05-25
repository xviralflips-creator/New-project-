"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Spinner } from "@/components/ui/skeleton";
import { useAuthStore } from "@/lib/store";
import type { Role } from "@/lib/types";

const ROLE_RANK: Record<Role, number> = {
  user: 0,
  pro: 1,
  premium: 2,
  enterprise: 3,
  moderator: 4,
  admin: 5,
  super_admin: 6,
};

export function RequireAuth({
  children,
  minRole,
}: {
  children: React.ReactNode;
  minRole?: Role;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useAuthStore();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace(`/login?next=${encodeURIComponent(pathname || "/dashboard")}`);
      return;
    }
    if (minRole && ROLE_RANK[user.role] < ROLE_RANK[minRole]) {
      router.replace("/dashboard");
    }
  }, [user, loading, minRole, router, pathname]);

  if (loading || !user) {
    return (
      <div className="grid min-h-screen place-items-center text-fg-muted">
        <div className="flex items-center gap-2 text-sm">
          <Spinner /> Loading workspace…
        </div>
      </div>
    );
  }
  if (minRole && ROLE_RANK[user.role] < ROLE_RANK[minRole]) return null;
  return <>{children}</>;
}
