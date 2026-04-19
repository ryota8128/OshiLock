import { Nav } from "@/components/nav";
import { HeroA } from "@/components/hero";
import { PainSection } from "@/components/pain-section";
import { SolutionSection } from "@/components/solution-section";
import { CardFeatureSection } from "@/components/card-feature-section";
import { ComparisonSection } from "@/components/comparison-section";
import { PricingSection } from "@/components/pricing-section";
import { CreatorSection } from "@/components/creator-section";
import { WaitlistSection } from "@/components/waitlist-section";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div>
      <Nav scrollTarget="waitlist" />
      <HeroA scrollTarget="waitlist" />
      <PainSection />
      <div id="how">
        <SolutionSection />
      </div>
      <CardFeatureSection />
      <ComparisonSection />
      <div id="pricing">
        <PricingSection scrollTarget="waitlist" />
      </div>
      <CreatorSection />
      <WaitlistSection />
      <Footer />
    </div>
  );
}
