import { HeroSection } from "@/components/HeroSection"
import { QuickLinks } from "@/components/QuickLinks"
import { FeaturedProducts } from "@/components/FeaturedProducts"
import { StatsSection } from "@/components/StatsSection"
import { TestimonialsSection } from "@/components/TestimonialsSection"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <QuickLinks />
      <FeaturedProducts />
      <StatsSection />
      <TestimonialsSection />
    </div>
  )
}
