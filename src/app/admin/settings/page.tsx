"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import toast from "react-hot-toast";
import { getDb } from "@/lib/firebase/client";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

interface PlatformSettings {
  appName: string;
  supportEmail: string;
  maintenanceMode: boolean;
  maintenanceMessage: string;
  defaultTheme: "dark" | "light" | "system";
}

const DEFAULTS: PlatformSettings = {
  appName: "NextGen AI Builder",
  supportEmail: "support@nextgen.ai",
  maintenanceMode: false,
  maintenanceMessage: "",
  defaultTheme: "dark",
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<PlatformSettings | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDoc(doc(getDb(), "admin_settings", "platform"));
        setSettings({ ...DEFAULTS, ...((snap.data() as Partial<PlatformSettings>) ?? {}) });
      } catch {
        setSettings(DEFAULTS);
      }
    })();
  }, []);

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    try {
      await setDoc(
        doc(getDb(), "admin_settings", "platform"),
        { ...settings, updatedAt: serverTimestamp() },
        { merge: true }
      );
      toast.success("Settings saved");
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setSaving(false);
    }
  }

  if (!settings) return <Skeleton className="h-72 max-w-3xl" />;

  return (
    <form onSubmit={save} className="space-y-6 max-w-3xl">
      <div>
        <h1 className="font-display text-2xl">Platform settings</h1>
        <p className="text-sm text-fg-muted">
          Global configuration. Stored under{" "}
          <code className="font-mono text-xs">admin_settings/platform</code>.
        </p>
      </div>

      <section className="card p-6 space-y-4">
        <h2 className="font-medium">Branding</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="App name">
            <Input
              value={settings.appName}
              onChange={(e) =>
                setSettings({ ...settings, appName: e.target.value })
              }
            />
          </Field>
          <Field label="Support email">
            <Input
              type="email"
              value={settings.supportEmail}
              onChange={(e) =>
                setSettings({ ...settings, supportEmail: e.target.value })
              }
            />
          </Field>
        </div>
        <Field label="Default theme">
          <select
            className="input"
            value={settings.defaultTheme}
            onChange={(e) =>
              setSettings({
                ...settings,
                defaultTheme: e.target.value as PlatformSettings["defaultTheme"],
              })
            }
          >
            <option value="dark">Dark</option>
            <option value="light">Light</option>
            <option value="system">System</option>
          </select>
        </Field>
      </section>

      <section className="card p-6 space-y-4">
        <h2 className="font-medium">Maintenance mode</h2>
        <label className="flex items-center gap-3 text-sm">
          <input
            type="checkbox"
            checked={settings.maintenanceMode}
            onChange={(e) =>
              setSettings({ ...settings, maintenanceMode: e.target.checked })
            }
          />
          Enable maintenance banner
        </label>
        <Field label="Banner message" hint="Shown to all users when maintenance mode is on.">
          <Textarea
            value={settings.maintenanceMessage}
            onChange={(e) =>
              setSettings({ ...settings, maintenanceMessage: e.target.value })
            }
            placeholder="We're upgrading our AI pipeline — back in 30 minutes."
          />
        </Field>
      </section>

      <div className="flex justify-end">
        <Button loading={saving}>Save settings</Button>
      </div>
    </form>
  );
}
