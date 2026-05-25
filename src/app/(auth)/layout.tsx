import Link from "next/link";
import { Logo } from "@/components/ui/logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-stage">
      <div className="absolute inset-0 bg-grid" aria-hidden />
      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 pt-6">
        <Logo />
        <Link
          href="/"
          className="text-xs text-fg-muted hover:text-fg transition"
        >
          ← Back to home
        </Link>
      </header>
      <div className="relative z-10 mx-auto flex max-w-6xl items-center justify-center px-4 py-12 sm:py-16">
        <div className="grid w-full gap-12 lg:grid-cols-2 items-center">
          <div className="hidden lg:block">
            <p className="label">NextGen AI Builder</p>
            <h1 className="mt-2 font-display text-5xl tracking-tight heading-grad">
              Generate. Edit. Ship.
            </h1>
            <p className="mt-4 max-w-md text-fg-muted">
              The AI workspace for ambitious builders. Sign in to spin up your
              first project — landing pages, dashboards, full-stack apps — all
              from a single prompt.
            </p>
            <ul className="mt-8 space-y-3 text-sm text-fg-muted">
              <li className="flex gap-3">
                <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-accent-cyan" />
                10 AI generations free, every month
              </li>
              <li className="flex gap-3">
                <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-accent-violet" />
                Built-in IDE with multi-device live preview
              </li>
              <li className="flex gap-3">
                <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-accent-pink" />
                Export to GitHub, ZIP, or one-click deploy
              </li>
            </ul>
          </div>
          <div className="flex justify-center">{children}</div>
        </div>
      </div>
    </main>
  );
}
