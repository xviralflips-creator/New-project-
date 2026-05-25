import Link from "next/link";
import { Logo } from "@/components/ui/logo";

const COLS: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "Product",
    links: [
      { href: "/features", label: "Features" },
      { href: "/pricing", label: "Pricing" },
      { href: "/templates", label: "Templates" },
      { href: "/changelog", label: "Changelog" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/careers", label: "Careers" },
      { href: "/blog", label: "Blog" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/docs", label: "Documentation" },
      { href: "/help", label: "Help center" },
      { href: "/status", label: "Status" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/terms", label: "Terms" },
      { href: "/privacy", label: "Privacy" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-bg-soft/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-14">
        <div className="grid gap-10 md:grid-cols-5">
          <div className="md:col-span-2 space-y-3">
            <Logo />
            <p className="max-w-xs text-sm text-fg-muted">
              The AI builder for ambitious teams. Generate, edit, preview, and
              ship full-stack apps from a single prompt.
            </p>
          </div>
          {COLS.map((c) => (
            <div key={c.title}>
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-fg-subtle">
                {c.title}
              </h4>
              <ul className="space-y-2">
                {c.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm text-fg-muted hover:text-fg"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-fg-subtle">
            © {new Date().getFullYear()} NextGen AI Builder. All rights reserved.
          </p>
          <p className="text-xs text-fg-subtle">
            Built with Next.js, Firebase & Gemini.
          </p>
        </div>
      </div>
    </footer>
  );
}
