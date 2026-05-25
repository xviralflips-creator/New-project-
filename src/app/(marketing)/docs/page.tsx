import type { Metadata } from "next";
import Link from "next/link";
import { Book, Code, Cpu, Rocket, ShieldCheck, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "Documentation",
  description: "Guides, reference, and recipes for NextGen AI Builder.",
};

const SECTIONS = [
  {
    icon: Rocket,
    title: "Getting started",
    href: "/docs/getting-started",
    body: "Create your first AI-generated project in under 60 seconds.",
  },
  {
    icon: Cpu,
    title: "Prompting guide",
    href: "/docs/prompts",
    body: "Patterns and examples for prompting that consistently produce great output.",
  },
  {
    icon: Code,
    title: "IDE & shortcuts",
    href: "/docs/ide",
    body: "Master the workspace: panels, command palette, keyboard shortcuts.",
  },
  {
    icon: Zap,
    title: "AI tools",
    href: "/docs/ai-tools",
    body: "Explain, debug, refactor, accessibility, SEO, and performance assists.",
  },
  {
    icon: ShieldCheck,
    title: "Security & roles",
    href: "/docs/security",
    body: "Firebase rules, role-based access, audit logs, and best practices.",
  },
  {
    icon: Book,
    title: "API reference",
    href: "/docs/api",
    body: "REST and webhook reference for programmatic access.",
  },
];

export default function DocsPage() {
  return (
    <div className="pt-16">
      <div className="mx-auto max-w-3xl px-4 text-center">
        <p className="label">Documentation</p>
        <h1 className="mt-2 font-display text-4xl sm:text-6xl tracking-tight heading-grad">
          Build faster, by the book.
        </h1>
        <p className="mt-5 text-fg-muted">
          Everything you need to get the most out of NextGen AI Builder.
        </p>
      </div>

      <div className="mx-auto mt-14 max-w-6xl px-4 sm:px-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SECTIONS.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="card p-6 transition hover:border-border-strong group"
          >
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-bg-soft text-fg">
              <s.icon size={18} />
            </div>
            <h3 className="mt-4 font-medium group-hover:text-accent-cyan transition">
              {s.title}
            </h3>
            <p className="mt-1.5 text-sm text-fg-muted">{s.body}</p>
            <p className="mt-3 text-xs text-fg-subtle">Read the guide →</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
