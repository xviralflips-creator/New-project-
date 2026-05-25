"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import {
  collection,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { Bell, CheckCheck } from "lucide-react";
import { useAuthStore } from "@/lib/store";
import { getDb } from "@/lib/firebase/client";
import { Empty } from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { formatRelative } from "@/lib/utils";
import type { NotificationDoc } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function NotificationsPage() {
  const user = useAuthStore((s) => s.user);
  const [items, setItems] = useState<NotificationDoc[] | null>(null);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(getDb(), "notifications"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc"),
      limit(100)
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        setItems(
          snap.docs.map((d) => {
            const data = d.data() as Record<string, unknown>;
            return {
              id: d.id,
              userId: String(data.userId ?? user.uid),
              title: String(data.title ?? "Notification"),
              body: String(data.body ?? ""),
              href: data.href as string | undefined,
              read: Boolean(data.read),
              kind: (data.kind as NotificationDoc["kind"]) ?? "info",
              createdAt:
                typeof data.createdAt === "object" && data.createdAt && "toMillis" in (data.createdAt as object)
                  ? (data.createdAt as { toMillis: () => number }).toMillis()
                  : Number(data.createdAt) || Date.now(),
            };
          })
        );
      },
      (err) => {
        const code = (err as { code?: string }).code ?? "";
        if (code === "permission-denied" || code.includes("insufficient")) {
          if (typeof window !== "undefined") {
            (window as unknown as { __ngFirestoreRulesMissing?: boolean }).__ngFirestoreRulesMissing = true;
            window.dispatchEvent(new CustomEvent("ng-firestore-rules-missing"));
          }
        }
        setItems([]);
      }
    );
    return unsub;
  }, [user]);

  async function markAllRead() {
    if (!items) return;
    await Promise.all(
      items
        .filter((n) => !n.read)
        .map((n) =>
          updateDoc(doc(getDb(), "notifications", n.id), { read: true })
        )
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl">Notifications</h1>
          <p className="text-sm text-fg-muted">
            Updates from the platform and your projects.
          </p>
        </div>
        {items && items.some((i) => !i.read) && (
          <Button variant="secondary" size="sm" onClick={markAllRead}>
            <CheckCheck size={14} /> Mark all read
          </Button>
        )}
      </div>

      {items === null ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-16" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <Empty
          icon={<Bell size={20} />}
          title="No notifications yet"
          description="You'll see updates here when there's something new — generation completions, billing events, and announcements."
        />
      ) : (
        <ul className="space-y-2">
          {items.map((n) => (
            <li
              key={n.id}
              className={cn(
                "card flex items-start gap-3 p-4",
                !n.read && "border-brand-500/40"
              )}
            >
              <span
                className={cn(
                  "mt-1 inline-block h-2 w-2 rounded-full",
                  n.kind === "error"
                    ? "bg-red-400"
                    : n.kind === "warning"
                    ? "bg-amber-400"
                    : n.kind === "success"
                    ? "bg-accent-cyan"
                    : "bg-accent-violet"
                )}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{n.title}</p>
                <p className="text-sm text-fg-muted">{n.body}</p>
                <p className="mt-1 text-xs text-fg-subtle">
                  {formatRelative(n.createdAt)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
