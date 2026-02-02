import { HeroSection } from "@/components/landing/HeroSection"
import { DemoSection } from "@/components/landing/DemoSection"
import { HowItWorks } from "@/components/landing/HowItWorks"

export function LandingPage() {
  return (
    <div>
      <HeroSection />
      <HowItWorks />
      <DemoSection />
    </div>
  )
}
