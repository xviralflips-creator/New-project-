"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import toast from "react-hot-toast";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { useAuthStore } from "@/lib/store";
import { getDb } from "@/lib/firebase/client";
import { logout } from "@/lib/firebase/auth";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const user = useAuthStore((s) => s.user);
  const patchUser = useAuthStore((s) => s.patchUser);
  const router = useRouter();
  const [displayName, setDisplayName] = useState(user?.displayName ?? "");
  const [saving, setSaving] = useState(false);

  if (!user) return null;

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await updateDoc(doc(getDb(), "users", user!.uid), {
        displayName,
        updatedAt: serverTimestamp(),
      });
      patchUser({ displayName });
      toast.success("Saved");
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  async function signOut() {
    await logout();
    router.push("/");
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="font-display text-2xl">Settings</h1>
        <p className="text-sm text-fg-muted">Manage your profile and account.</p>
      </div>

      <section className="card p-6">
        <h2 className="font-medium">Profile</h2>
        <form onSubmit={save} className="mt-5 space-y-4">
          <Field label="Display name">
            <Input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
            />
          </Field>
          <Field label="Email" hint="Email cannot be changed from here.">
            <Input value={user.email} disabled />
          </Field>
          <div className="flex justify-end">
            <Button loading={saving}>Save changes</Button>
          </div>
        </form>
      </section>

      <section className="card p-6">
        <h2 className="font-medium">Account</h2>
        <p className="mt-1 text-sm text-fg-muted">
          Plan: <span className="text-fg capitalize">{user.plan}</span> · Role:{" "}
          <span className="text-fg capitalize">{user.role.replace("_", " ")}</span>
        </p>
        <p className="mt-1 text-sm text-fg-muted">
          Member since {new Date(user.createdAt).toLocaleDateString()}
        </p>
        <div className="mt-5 flex gap-2">
          <Button variant="secondary" onClick={signOut}>
            Sign out
          </Button>
        </div>
      </section>

      <section className="card p-6 border-red-500/20">
        <h2 className="font-medium text-red-400">Danger zone</h2>
        <p className="mt-1 text-sm text-fg-muted">
          Permanently delete your account and all associated data. Contact
          support — this action is not yet self-serve in this build.
        </p>
        <div className="mt-5">
          <Button variant="danger" disabled>
            Delete account
          </Button>
        </div>
      </section>
    </div>
  );
}
