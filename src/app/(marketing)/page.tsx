import { Hero } from "@/components/marketing/hero";
import { FeatureGrid } from "@/components/marketing/feature-grid";
import { LogoStrip } from "@/components/marketing/logo-strip";
import { ShowcaseTabs } from "@/components/marketing/showcase-tabs";
import { PricingTeaser } from "@/components/marketing/pricing-teaser";
import { CtaBand } from "@/components/marketing/cta-band";
import { Stats } from "@/components/marketing/stats";

export default function HomePage() {
  return (
    <>
      <Hero />
      <LogoStrip />
      <Stats />
      <FeatureGrid />
      <ShowcaseTabs />
      <PricingTeaser />
      <CtaBand />
    </>
  );
}
