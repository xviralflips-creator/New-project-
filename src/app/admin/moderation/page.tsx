import { ShieldAlert } from "lucide-react";

export default function ModerationPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl">Moderation</h1>
        <p className="text-sm text-fg-muted">
          Review user-flagged projects, abuse signals, and suspicious AI generations.
        </p>
      </div>

      <div className="card p-8 text-center">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-bg-soft text-amber-300">
          <ShieldAlert size={20} />
        </div>
        <h3 className="mt-4 font-medium">No items in the queue</h3>
        <p className="mt-1 text-sm text-fg-muted max-w-md mx-auto">
          Flagged content will appear here. Hook this page up to your{" "}
          <code className="font-mono text-xs">moderation_logs</code> collection
          and a content classifier (Gemini safety filters or Perspective API).
        </p>
      </div>
    </div>
  );
}
