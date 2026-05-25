"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import toast from "react-hot-toast";
import { Search, Shield, ShieldOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { getDb } from "@/lib/firebase/client";
import { useAuthStore } from "@/lib/store";
import { formatRelative } from "@/lib/utils";
import type { Role, UserProfile } from "@/lib/types";

const ROLES: Role[] = [
  "user", "pro", "premium", "enterprise", "moderator", "admin", "super_admin",
];

export default function AdminUsersPage() {
  const me = useAuthStore((s) => s.user);
  const [users, setUsers] = useState<UserProfile[] | null>(null);
  const [q, setQ] = useState("");

  useEffect(() => {
    if (!me) return;
    (async () => {
      try {
        const snap = await getDocs(
          query(collection(getDb(), "users"), orderBy("createdAt", "desc"), limit(200))
        );
        setUsers(
          snap.docs.map((d) => {
            const data = d.data() as Record<string, unknown>;
            return {
              uid: d.id,
              email: String(data.email ?? ""),
              displayName: (data.displayName as string | null) ?? null,
              photoURL: (data.photoURL as string | null) ?? null,
              role: (data.role as Role) ?? "user",
              plan: (data.plan as UserProfile["plan"]) ?? "free",
              createdAt:
                typeof data.createdAt === "object" && data.createdAt && "toMillis" in (data.createdAt as object)
                  ? (data.createdAt as { toMillis: () => number }).toMillis()
                  : Number(data.createdAt) || Date.now(),
              updatedAt: Date.now(),
              aiGenerationsUsed: Number(data.aiGenerationsUsed ?? 0),
              aiGenerationsLimit: Number(data.aiGenerationsLimit ?? 10),
              storageUsedBytes: Number(data.storageUsedBytes ?? 0),
              storageLimitBytes: Number(data.storageLimitBytes ?? 1024 * 1024 * 1024),
              projectsCount: Number(data.projectsCount ?? 0),
              emailVerified: Boolean(data.emailVerified),
              banned: Boolean(data.banned),
            };
          })
        );
      } catch (e) {
        toast.error((e as Error).message);
        setUsers([]);
      }
    })();
  }, [me]);

  async function setRole(uid: string, role: Role) {
    try {
      await updateDoc(doc(getDb(), "users", uid), { role });
      setUsers((u) => u?.map((x) => (x.uid === uid ? { ...x, role } : x)) ?? null);
      toast.success("Role updated");
    } catch (e) {
      toast.error((e as Error).message);
    }
  }

  async function toggleBan(u: UserProfile) {
    try {
      await updateDoc(doc(getDb(), "users", u.uid), { banned: !u.banned });
      setUsers(
        (users) =>
          users?.map((x) => (x.uid === u.uid ? { ...x, banned: !u.banned } : x)) ?? null
      );
      toast.success(u.banned ? "User unbanned" : "User banned");
    } catch (e) {
      toast.error((e as Error).message);
    }
  }

  const filtered =
    users?.filter(
      (u) =>
        !q.trim() ||
        u.email.toLowerCase().includes(q.toLowerCase()) ||
        (u.displayName ?? "").toLowerCase().includes(q.toLowerCase())
    ) ?? null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl">Users</h1>
        <p className="text-sm text-fg-muted">
          Search, change roles, and ban accounts.
        </p>
      </div>

      <div className="relative max-w-md">
        <Search
          size={14}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-fg-subtle"
        />
        <Input
          placeholder="Search by email or name…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="pl-8"
        />
      </div>

      {filtered === null ? (
        <Skeleton className="h-72" />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto scroll-thin">
            <table className="w-full text-sm">
              <thead className="bg-bg-soft text-left text-xs uppercase tracking-wider text-fg-subtle">
                <tr>
                  <th className="px-4 py-2.5">User</th>
                  <th className="px-4 py-2.5">Plan</th>
                  <th className="px-4 py-2.5">Role</th>
                  <th className="px-4 py-2.5">Joined</th>
                  <th className="px-4 py-2.5">Status</th>
                  <th className="px-4 py-2.5"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u.uid} className="border-t border-border">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {u.photoURL ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={u.photoURL}
                            alt=""
                            className="h-8 w-8 rounded-full object-cover"
                          />
                        ) : (
                          <span className="grid h-8 w-8 place-items-center rounded-full bg-[linear-gradient(135deg,#4458ff,#a855f7)] text-xs font-semibold text-white">
                            {(u.displayName ?? u.email)[0]?.toUpperCase()}
                          </span>
                        )}
                        <div className="min-w-0">
                          <p className="truncate text-fg">
                            {u.displayName || u.email}
                          </p>
                          <p className="truncate text-xs text-fg-subtle">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs">
                      <span className="chip uppercase">{u.plan}</span>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={u.role}
                        onChange={(e) => setRole(u.uid, e.target.value as Role)}
                        className="input h-8 py-1 text-xs"
                        disabled={u.uid === me?.uid && u.role === "super_admin"}
                      >
                        {ROLES.map((r) => (
                          <option key={r} value={r}>
                            {r.replace("_", " ")}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-xs text-fg-muted">
                      {formatRelative(u.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      {u.banned ? (
                        <span className="chip border-red-500/40 bg-red-500/10 text-red-300">
                          Banned
                        </span>
                      ) : (
                        <span className="chip border-emerald-500/40 bg-emerald-500/10 text-emerald-300">
                          Active
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        size="sm"
                        variant={u.banned ? "secondary" : "danger"}
                        onClick={() => toggleBan(u)}
                        disabled={u.uid === me?.uid}
                      >
                        {u.banned ? <ShieldOff size={12} /> : <Shield size={12} />}
                        {u.banned ? "Unban" : "Ban"}
                      </Button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-fg-subtle">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
