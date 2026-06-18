import { Navigation } from "@/components/landing/navigation";
import { HeroSection } from "@/components/landing/hero-section";
import { MarqueeStrip } from "@/components/landing/marquee-strip";
import { ProblemSection } from "@/components/landing/problem-section";
import { ShowcaseSection } from "@/components/landing/showcase-section";
import { FileBrowserSection } from "@/components/landing/file-browser-section";
import { FeaturesGrid } from "@/components/landing/features-grid";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { WhatYouHaveSection } from "@/components/landing/what-you-have-section";
import { ReferralSection } from "@/components/landing/referral-section";
import { PricingSection } from "@/components/landing/pricing-section";
import { FaqSection } from "@/components/landing/faq-section";
import { FinalCtaSection } from "@/components/landing/final-cta-section";
import { Footer } from "@/components/landing/footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-ds-pure-black selection:bg-ds-true-white selection:text-ds-pure-black">
      <Navigation />
      <HeroSection />
      <MarqueeStrip />
      <ProblemSection />
      <ShowcaseSection />
      <FileBrowserSection />
      <FeaturesGrid />
      <HowItWorksSection />
      <WhatYouHaveSection />
      <ReferralSection />
      <PricingSection />
      <FaqSection />
      <FinalCtaSection />
      <Footer />
    </main>
  );
}
