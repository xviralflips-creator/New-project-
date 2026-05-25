"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/input";

export default function ContactPage() {
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    const data = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success("Message sent — we'll get back to you within a day.");
      e.currentTarget.reset();
    } catch {
      toast.error("Could not send. Email us instead at hello@nextgen.ai");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="pt-16">
      <div className="mx-auto max-w-3xl px-4 text-center">
        <p className="label">Contact</p>
        <h1 className="mt-2 font-display text-4xl sm:text-6xl tracking-tight heading-grad">
          Talk to a human.
        </h1>
        <p className="mt-5 text-fg-muted">
          Sales, support, partnerships — pick your topic and we'll route it to
          the right person within a business day.
        </p>
      </div>

      <div className="mx-auto max-w-2xl px-4 mt-12">
        <form onSubmit={onSubmit} className="card p-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name">
              <Input name="name" required placeholder="Ada Lovelace" />
            </Field>
            <Field label="Email">
              <Input name="email" type="email" required placeholder="ada@example.com" />
            </Field>
          </div>
          <Field label="Topic">
            <select name="topic" className="input" defaultValue="sales">
              <option value="sales">Sales / Enterprise</option>
              <option value="support">Support</option>
              <option value="partnerships">Partnerships</option>
              <option value="press">Press</option>
            </select>
          </Field>
          <Field label="Message">
            <Textarea name="message" required placeholder="Tell us what you're building..." />
          </Field>
          <div className="flex items-center justify-between pt-2">
            <p className="flex items-center gap-2 text-xs text-fg-subtle">
              <Mail size={12} /> hello@nextgen.ai
            </p>
            <Button loading={submitting}>Send message</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
