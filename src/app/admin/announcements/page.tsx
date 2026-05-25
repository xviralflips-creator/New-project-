"use client";

import { useState } from "react";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import toast from "react-hot-toast";
import { Megaphone, Send } from "lucide-react";
import { getDb } from "@/lib/firebase/client";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/input";

export default function AnnouncementsPage() {
  const [submitting, setSubmitting] = useState(false);

  async function broadcast(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const title = String(data.title || "").trim();
    const body = String(data.body || "").trim();
    if (!title || !body) return;
    setSubmitting(true);
    try {
      await setDoc(
        doc(getDb(), "admin_settings", "latest_announcement"),
        { title, body, createdAt: serverTimestamp() }
      );
      toast.success("Announcement saved. Wire a Cloud Function to fan out per-user notifications.");
      e.currentTarget.reset();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  async function sendTestNotification(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const userId = String(data.userId || "").trim();
    const title = String(data.title || "").trim();
    const body = String(data.body || "").trim();
    if (!userId || !title || !body) return;
    try {
      await addDoc(collection(getDb(), "notifications"), {
        userId,
        title,
        body,
        kind: "info",
        read: false,
        createdAt: serverTimestamp(),
      });
      toast.success("Notification sent");
      e.currentTarget.reset();
    } catch (e) {
      toast.error((e as Error).message);
    }
  }

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="font-display text-2xl">Announcements</h1>
        <p className="text-sm text-fg-muted">
          Broadcast updates to all users and send targeted notifications.
        </p>
      </div>

      <form onSubmit={broadcast} className="card p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Megaphone size={16} className="text-amber-300" />
          <h2 className="font-medium">Platform-wide announcement</h2>
        </div>
        <Field label="Title">
          <Input name="title" required placeholder="Maintenance window tonight" />
        </Field>
        <Field label="Body">
          <Textarea name="body" required placeholder="We'll be performing scheduled maintenance from 23:00 to 23:30 UTC." />
        </Field>
        <div className="flex justify-end">
          <Button loading={submitting}><Send size={13} /> Save announcement</Button>
        </div>
      </form>

      <form onSubmit={sendTestNotification} className="card p-6 space-y-4">
        <h2 className="font-medium">Send notification to a specific user</h2>
        <Field label="User UID">
          <Input name="userId" required placeholder="firebase user uid" />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Title">
            <Input name="title" required placeholder="Welcome to Pro!" />
          </Field>
          <Field label="Body">
            <Input name="body" required placeholder="Your plan is now active." />
          </Field>
        </div>
        <div className="flex justify-end">
          <Button>Send notification</Button>
        </div>
      </form>
    </div>
  );
}
