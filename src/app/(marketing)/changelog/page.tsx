import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Changelog",
  description: "What's new in NextGen AI Builder.",
};

const ENTRIES = [
  {
    date: "May 24, 2026",
    tag: "Major",
    title: "Gemini 2.0 Flash is now the default model",
    body: "Faster generations, better adherence to instructions, and improved JSON output. All plans get the upgrade automatically.",
  },
  {
    date: "May 12, 2026",
    tag: "New",
    title: "Multi-device live preview",
    body: "Preview your project in desktop, tablet, and mobile frames side-by-side, with synchronized scrolling.",
  },
  {
    date: "May 02, 2026",
    tag: "Improved",
    title: "Versioning rebuilt",
    body: "Every save now creates an immutable snapshot. Diff and restore from any point in your project's history.",
  },
  {
    date: "Apr 18, 2026",
    tag: "New",
    title: "AI accessibility scanner",
    body: "Highlights WCAG violations directly in the editor and proposes one-click semantic HTML upgrades.",
  },
  {
    date: "Apr 03, 2026",
    tag: "Fixed",
    title: "Firebase Auth race conditions",
    body: "Fixed an edge case where the user profile doc could be created twice on first sign-in via Google popup.",
  },
];

export default function ChangelogPage() {
  return (
    <div className="pt-16">
      <div className="mx-auto max-w-3xl px-4 text-center">
        <p className="label">Changelog</p>
        <h1 className="mt-2 font-display text-4xl sm:text-6xl tracking-tight heading-grad">
          What we shipped.
        </h1>
        <p className="mt-5 text-fg-muted">
          A monthly log of new capabilities, improvements, and fixes.
        </p>
      </div>

      <div className="mx-auto max-w-3xl px-4 mt-14 space-y-6">
        {ENTRIES.map((e) => (
          <article key={e.title} className="card p-6">
            <div className="flex items-center gap-3 text-xs">
              <span className="chip">{e.tag}</span>
              <span className="text-fg-subtle">{e.date}</span>
            </div>
            <h3 className="mt-3 font-display text-xl">{e.title}</h3>
            <p className="mt-2 text-sm text-fg-muted">{e.body}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
