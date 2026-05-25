import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { CopyButton } from "@/components/ui/copy-button";

export const metadata: Metadata = {
  title: "Publishing Firestore rules",
};

const RULES = `rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    function isSignedIn() { return request.auth != null; }
    function isOwner(uid) { return isSignedIn() && request.auth.uid == uid; }
    function isAdmin() {
      return isSignedIn() &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role
          in ['admin','super_admin','moderator'];
    }

    match /users/{userId} {
      allow read: if isOwner(userId) || isAdmin();
      allow create: if isOwner(userId);
      allow update: if isOwner(userId) || isAdmin();
      allow delete: if isAdmin();
    }

    match /projects/{projectId} {
      allow read: if isAdmin() || (isSignedIn() &&
        (resource.data.ownerId == request.auth.uid ||
         request.auth.uid in resource.data.collaborators));
      allow create: if isSignedIn() &&
        request.resource.data.ownerId == request.auth.uid;
      allow update, delete: if isAdmin() ||
        (isSignedIn() && resource.data.ownerId == request.auth.uid);

      match /versions/{versionId} {
        allow read, write: if isAdmin() || (isSignedIn() &&
          get(/databases/$(database)/documents/projects/$(projectId)).data.ownerId
            == request.auth.uid);
      }
    }

    match /ai_generations/{id} {
      allow read: if isAdmin() ||
        (isSignedIn() && resource.data.userId == request.auth.uid);
      allow create: if isSignedIn() &&
        request.resource.data.userId == request.auth.uid;
      allow update, delete: if isAdmin();
    }

    match /subscriptions/{id} {
      allow read: if isAdmin() ||
        (isSignedIn() && resource.data.userId == request.auth.uid);
      allow write: if false;
    }
    match /invoices/{id} {
      allow read: if isAdmin() ||
        (isSignedIn() && resource.data.userId == request.auth.uid);
      allow write: if false;
    }

    match /templates/{id}      { allow read: if true;       allow write: if isAdmin(); }
    match /feature_flags/{id}  { allow read: if true;       allow write: if isAdmin(); }
    match /admin_settings/{id} { allow read, write: if isAdmin(); }
    match /moderation_logs/{id}{ allow read, write: if isAdmin(); }
    match /API_usage_logs/{id} { allow read, write: if isAdmin(); }
    match /analytics/{id}      { allow read, write: if isAdmin(); }

    match /notifications/{id} {
      allow read, update: if isSignedIn() &&
        resource.data.userId == request.auth.uid;
      allow create: if isAdmin() || isSignedIn();
      allow delete: if isAdmin();
    }

    match /support_tickets/{id} {
      allow read: if isAdmin() ||
        (isSignedIn() && resource.data.userId == request.auth.uid);
      allow create: if isSignedIn() &&
        request.resource.data.userId == request.auth.uid;
      allow update, delete: if isAdmin();
    }

    match /coupons/{id} {
      allow read: if isSignedIn();
      allow write: if isAdmin();
    }
  }
}`;

const OPEN_RULES = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}`;

export default function FirestoreRulesGuide() {
  return (
    <main className="min-h-screen bg-bg">
      <header className="mx-auto flex max-w-3xl items-center justify-between px-6 pt-6">
        <Logo />
        <Link
          href="/"
          className="text-sm text-fg-muted hover:text-fg flex items-center gap-1.5"
        >
          <ArrowLeft size={13} /> Home
        </Link>
      </header>

      <article className="mx-auto max-w-3xl px-6 py-10">
        <p className="label">Setup guide</p>
        <h1 className="mt-2 font-display text-4xl tracking-tight heading-grad">
          Publish your Firestore rules
        </h1>
        <p className="mt-4 text-fg-muted">
          You only have to do this once per Firebase project. It takes about 30
          seconds. Without these rules, Firestore rejects all reads and writes
          with{" "}
          <span className="font-mono text-xs">
            Missing or insufficient permissions
          </span>
          .
        </p>

        <ol className="mt-10 space-y-7 text-sm">
          <Step n={1} title="Open the Firestore Rules editor">
            <p>
              Go to your Firebase project, open <strong>Firestore Database</strong>,
              then click the <strong>Rules</strong> tab.
            </p>
            <a
              href="https://console.firebase.google.com/project/money-flow-machine/firestore/rules"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-bg-elev border border-border px-3 py-1.5 text-xs font-medium hover:border-border-strong"
            >
              Open Firestore Rules <ExternalLink size={11} />
            </a>
          </Step>

          <Step n={2} title="Replace the entire editor contents">
            <p className="mb-3">Select all (⌘A / Ctrl+A) and paste this in:</p>
            <div className="rounded-2xl border border-border bg-bg-soft/60 overflow-hidden">
              <div className="flex items-center justify-between border-b border-border px-4 py-2">
                <span className="text-xs text-fg-subtle">firestore.rules</span>
                <CopyButton text={RULES} />
              </div>
              <pre className="overflow-x-auto scroll-thin p-4 font-mono text-[11px] leading-relaxed text-fg-muted">
                <code>{RULES}</code>
              </pre>
            </div>
          </Step>

          <Step n={3} title="Click Publish">
            <p>
              Firebase will validate the rules and roll them out in seconds.
              Refresh your app — the warning banner will disappear and login,
              project save, and dashboard reads will all work.
            </p>
          </Step>

          <Step n={4} title="(Optional) Quick-test mode">
            <p className="mb-3">
              If you just want to play with the app for a few minutes without
              proper auth, you can paste this open ruleset instead. Don&apos;t
              ship this to production — anyone can read/write your DB.
            </p>
            <div className="rounded-2xl border border-amber-500/40 bg-amber-500/5 overflow-hidden">
              <div className="flex items-center justify-between border-b border-amber-500/30 px-4 py-2">
                <span className="text-xs text-amber-300/70">
                  open ruleset (testing only)
                </span>
                <CopyButton text={OPEN_RULES} className="text-amber-300/70 hover:text-amber-100" />
              </div>
              <pre className="p-4 font-mono text-[11px] leading-relaxed text-amber-200">
                <code>{OPEN_RULES}</code>
              </pre>
            </div>
          </Step>
        </ol>

        <div className="mt-12 rounded-2xl border border-border bg-bg-elev/40 p-5">
          <h3 className="font-medium">Why isn&apos;t this automatic?</h3>
          <p className="mt-1 text-sm text-fg-muted">
            Firebase doesn&apos;t let a web client deploy security rules — that
            would defeat the whole point. Rules can only be deployed by a
            project owner via the Firebase Console or the Firebase CLI{" "}
            <code className="font-mono text-xs">
              (firebase deploy --only firestore:rules)
            </code>
            .
          </p>
        </div>
      </article>
    </main>
  );
}

function Step({
  n,
  title,
  children,
}: {
  n: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex gap-4">
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[linear-gradient(135deg,#4458ff,#a855f7)] text-sm font-semibold text-white">
        {n}
      </span>
      <div className="flex-1 min-w-0">
        <h3 className="text-base font-semibold text-fg">{title}</h3>
        <div className="mt-2 text-fg-muted">{children}</div>
      </div>
    </li>
  );
}
