import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CtaBand() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
      <div className="relative overflow-hidden rounded-3xl border border-border-strong bg-[linear-gradient(120deg,#4458ff,#a855f7,#22d3ee)] bg-[length:200%_200%] animate-gradient-x p-10 sm:p-16 text-center">
        <div className="absolute inset-0 bg-noise opacity-10 mix-blend-overlay" />
        <h2 className="relative font-display text-3xl sm:text-5xl text-white">
          From idea to live app in minutes.
        </h2>
        <p className="relative mt-3 text-white/80 max-w-xl mx-auto">
          Sign up and generate your first project. No credit card required.
        </p>
        <div className="relative mt-7 flex justify-center gap-3">
          <Link href="/signup">
            <Button size="lg" className="px-8 bg-white text-black hover:bg-white/90 shadow-none">
              Start free <ArrowRight size={16} />
            </Button>
          </Link>
          <Link href="/contact">
            <Button size="lg" variant="ghost" className="text-white hover:bg-white/10">
              Talk to sales
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
