"use client";

import { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDocs,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import toast from "react-hot-toast";
import { Plus } from "lucide-react";
import { getDb } from "@/lib/firebase/client";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import type { FeatureFlag } from "@/lib/types";

export default function FeatureFlagsPage() {
  const [flags, setFlags] = useState<FeatureFlag[] | null>(null);

  useEffect(() => {
    (async () => {
      const snap = await getDocs(collection(getDb(), "feature_flags"));
      setFlags(
        snap.docs.map((d) => {
          const data = d.data() as Record<string, unknown>;
          return {
            id: d.id,
            enabled: Boolean(data.enabled),
            description: (data.description as string) ?? "",
            rolloutPercent: Number(data.rolloutPercent ?? 100),
          };
        })
      );
    })();
  }, []);

  async function toggle(f: FeatureFlag) {
    try {
      await setDoc(
        doc(getDb(), "feature_flags", f.id),
        { ...f, enabled: !f.enabled, updatedAt: serverTimestamp() },
        { merge: true }
      );
      setFlags(
        (flags) =>
          flags?.map((x) => (x.id === f.id ? { ...x, enabled: !f.enabled } : x)) ?? null
      );
    } catch (e) {
      toast.error((e as Error).message);
    }
  }

  async function add(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const id = String(data.id || "").trim();
    const description = String(data.description || "").trim();
    if (!id) return;
    try {
      await setDoc(doc(getDb(), "feature_flags", id), {
        enabled: false,
        description,
        rolloutPercent: 100,
        createdAt: serverTimestamp(),
      });
      setFlags((flags) => [...(flags ?? []), { id, enabled: false, description, rolloutPercent: 100 }]);
      e.currentTarget.reset();
      toast.success("Flag created");
    } catch (e) {
      toast.error((e as Error).message);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl">Feature flags</h1>
        <p className="text-sm text-fg-muted">
          Roll out experiments and gate features without redeploying.
        </p>
      </div>

      {flags === null ? (
        <Skeleton className="h-44" />
      ) : (
        <div className="card divide-y divide-border">
          {flags.length === 0 ? (
            <p className="p-5 text-sm text-fg-muted">
              No flags yet. Create your first one below.
            </p>
          ) : (
            flags.map((f) => (
              <div
                key={f.id}
                className="flex items-center justify-between gap-4 px-5 py-4"
              >
                <div className="min-w-0">
                  <p className="font-medium">{f.id}</p>
                  {f.description && (
                    <p className="text-xs text-fg-muted">{f.description}</p>
                  )}
                </div>
                <button
                  onClick={() => toggle(f)}
                  className={`relative h-6 w-11 rounded-full transition ${
                    f.enabled ? "bg-[linear-gradient(120deg,#4458ff,#a855f7)]" : "bg-bg-soft border border-border"
                  }`}
                  aria-label="Toggle"
                >
                  <span
                    className={`absolute top-0.5 ${f.enabled ? "left-6" : "left-0.5"} h-5 w-5 rounded-full bg-white shadow transition-all`}
                  />
                </button>
              </div>
            ))
          )}
        </div>
      )}

      <form onSubmit={add} className="card grid gap-3 p-5 sm:grid-cols-[1fr_2fr_auto] sm:items-end">
        <Field label="Flag id">
          <Input name="id" required placeholder="enable-new-ide" />
        </Field>
        <Field label="Description">
          <Input name="description" placeholder="Roll out the redesigned IDE shell" />
        </Field>
        <Button type="submit">
          <Plus size={14} /> Create flag
        </Button>
      </form>
    </div>
  );
}
