import { AboutSection } from "./components/about-section";
import { CTASection } from "./components/cta-section";
import { HeroSection } from "./components/hero-section";
import { ProductsSection } from "./components/product-section";
import { ServicesSection } from "./components/services-section";
import { TestimonialsSection } from "./components/testimonial-section";



export default function HomePage() {
  return (
    <div className="min-h-screen bg-white font-sans text-[#1a1a1a]">
      <HeroSection />
      <ServicesSection />
      <ProductsSection />
      <AboutSection />
      <TestimonialsSection />
      <CTASection />
    </div>
  )
}
