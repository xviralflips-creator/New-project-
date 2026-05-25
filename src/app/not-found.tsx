import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";

export default function NotFound() {
  return (
    <main className="relative min-h-screen flex items-center justify-center px-4 bg-stage">
      <div className="absolute inset-0 bg-grid" aria-hidden />
      <div className="relative text-center">
        <Logo />
        <p className="mt-10 font-display text-8xl heading-grad">404</p>
        <h1 className="mt-2 text-2xl font-semibold">Page not found</h1>
        <p className="mt-2 text-fg-muted">
          The page you were looking for doesn't exist or has moved.
        </p>
        <div className="mt-6 flex justify-center gap-2">
          <Link href="/"><Button>Back to home</Button></Link>
          <Link href="/dashboard"><Button variant="secondary">Open dashboard</Button></Link>
        </div>
      </div>
    </main>
  );
}
