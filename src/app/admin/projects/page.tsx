"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import toast from "react-hot-toast";
import { Eye, EyeOff, Trash2 } from "lucide-react";
import { getDb } from "@/lib/firebase/client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatRelative } from "@/lib/utils";
import type { Project } from "@/lib/types";

export default function AdminProjectsPage() {
  const [items, setItems] = useState<Project[] | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDocs(
          query(collection(getDb(), "projects"), orderBy("updatedAt", "desc"), limit(200))
        );
        setItems(
          snap.docs.map((d) => {
            const data = d.data() as Record<string, unknown>;
            return {
              id: d.id,
              ownerId: String(data.ownerId ?? ""),
              name: String(data.name ?? "Untitled"),
              description: String(data.description ?? ""),
              prompt: String(data.prompt ?? ""),
              framework: (data.framework as Project["framework"]) ?? "static",
              visibility: (data.visibility as Project["visibility"]) ?? "private",
              collaborators: (data.collaborators as string[]) ?? [],
              files: [],
              tags: (data.tags as string[]) ?? [],
              createdAt:
                typeof data.createdAt === "object" && data.createdAt && "toMillis" in (data.createdAt as object)
                  ? (data.createdAt as { toMillis: () => number }).toMillis()
                  : Number(data.createdAt) || Date.now(),
              updatedAt:
                typeof data.updatedAt === "object" && data.updatedAt && "toMillis" in (data.updatedAt as object)
                  ? (data.updatedAt as { toMillis: () => number }).toMillis()
                  : Number(data.updatedAt) || Date.now(),
              versionCount: Number(data.versionCount ?? 0),
              status: (data.status as Project["status"]) ?? "ready",
              deployUrl: data.deployUrl as string | undefined,
            } as Project;
          })
        );
      } catch (e) {
        toast.error((e as Error).message);
        setItems([]);
      }
    })();
  }, []);

  async function disable(id: string, current: Project["status"]) {
    const next = current === "archived" ? "ready" : "archived";
    try {
      await updateDoc(doc(getDb(), "projects", id), { status: next });
      setItems((it) => it?.map((p) => (p.id === id ? { ...p, status: next } : p)) ?? null);
      toast.success(`Project ${next === "archived" ? "archived" : "restored"}`);
    } catch (e) {
      toast.error((e as Error).message);
    }
  }

  async function destroy(id: string) {
    if (!confirm("Permanently delete this project?")) return;
    try {
      await deleteDoc(doc(getDb(), "projects", id));
      setItems((it) => it?.filter((p) => p.id !== id) ?? null);
      toast.success("Deleted");
    } catch (e) {
      toast.error((e as Error).message);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl">Projects</h1>
        <p className="text-sm text-fg-muted">
          Review, archive, or delete projects across all users.
        </p>
      </div>

      {items === null ? (
        <Skeleton className="h-72" />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto scroll-thin">
            <table className="w-full text-sm">
              <thead className="bg-bg-soft text-left text-xs uppercase tracking-wider text-fg-subtle">
                <tr>
                  <th className="px-4 py-2.5">Name</th>
                  <th className="px-4 py-2.5">Owner</th>
                  <th className="px-4 py-2.5">Status</th>
                  <th className="px-4 py-2.5">Updated</th>
                  <th className="px-4 py-2.5"></th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-fg-subtle">
                      No projects yet.
                    </td>
                  </tr>
                )}
                {items.map((p) => (
                  <tr key={p.id} className="border-t border-border">
                    <td className="px-4 py-3">
                      <Link
                        href={`/dashboard/projects/${p.id}`}
                        className="text-fg hover:underline"
                      >
                        {p.name}
                      </Link>
                      <p className="line-clamp-1 text-xs text-fg-subtle">
                        {p.description || p.prompt}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-xs text-fg-muted">
                      {p.ownerId.slice(0, 10)}…
                    </td>
                    <td className="px-4 py-3 text-xs">
                      <span className={`chip capitalize ${
                        p.status === "archived"
                          ? "border-red-500/40 bg-red-500/10 text-red-300"
                          : ""
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-fg-muted">
                      {formatRelative(p.updatedAt)}
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => disable(p.id, p.status)}
                      >
                        {p.status === "archived" ? <Eye size={12} /> : <EyeOff size={12} />}
                        {p.status === "archived" ? "Restore" : "Archive"}
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => destroy(p.id)}>
                        <Trash2 size={12} /> Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
