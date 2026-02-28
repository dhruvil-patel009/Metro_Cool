export const dynamic = "force-static";

import { AboutSection } from "./(public)/components/about-section";
import { CTASection } from "./(public)/components/cta-section";
import { Footer } from "./(public)/components/footer";
import { HeroSection } from "./(public)/components/hero-section";
import { ProductsSection } from "./(public)/components/product-section";
import { ServicesSection } from "./(public)/components/services-section";
import { TestimonialsSection } from "./(public)/components/testimonial-section";
import { Navigation } from "./(public)/components/navigation";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white font-sans text-[#1a1a1a]">
      <Navigation />
      <HeroSection />
      <ServicesSection />
      <ProductsSection />
      <AboutSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </div>
  );
}