import { HeroSection } from "@/components/home/hero-section"
import { WhyHpvSection } from "@/components/home/why-hpv-section"
import { HiddenProblemSection } from "@/components/home/hidden-problem-section"
import { FeaturesSection } from "@/components/home/features-section"
import { CtaSection } from "@/components/home/cta-section"

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <WhyHpvSection />
      <HiddenProblemSection />
      <FeaturesSection />
      <CtaSection />
    </div>
  )
}
