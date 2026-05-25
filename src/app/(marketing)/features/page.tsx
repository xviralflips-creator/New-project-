import type { Metadata } from "next";
import { FeatureGrid } from "@/components/marketing/feature-grid";
import { ShowcaseTabs } from "@/components/marketing/showcase-tabs";
import { CtaBand } from "@/components/marketing/cta-band";

export const metadata: Metadata = {
  title: "Features",
  description:
    "AI-native generation, a real IDE, instant preview, deep AI assists, and one-click deployment.",
};

export default function FeaturesPage() {
  return (
    <div className="pt-10">
      <div className="mx-auto max-w-3xl px-4 text-center pt-10">
        <p className="label">Features</p>
        <h1 className="mt-2 font-display text-4xl sm:text-6xl tracking-tight heading-grad">
          The complete AI build stack.
        </h1>
        <p className="mt-5 text-fg-muted">
          From your first prompt to a production deploy, every layer is wired
          for speed, polish, and AI assistance.
        </p>
      </div>
      <FeatureGrid />
      <ShowcaseTabs />
      <CtaBand />
    </div>
  );
}
