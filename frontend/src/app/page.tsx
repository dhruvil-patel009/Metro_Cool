import { HeroSection } from "./user/components/hero-section";
import { ServicesSection } from "./user/components/services-section";
import { CTASection } from "./user/components/cta-section";
import { TestimonialsSection } from "./user/components/testimonial-section";
import { ProductsSection } from "./user/components/product-section";
import { AboutSection } from "./user/components/about-section";
import Header from "./components/header";
import { Footer } from "./user/components/footer";



export default function HomePage() {
  return (
    <div className="min-h-screen bg-white font-sans text-[#1a1a1a]">
      <Header/>
      <HeroSection />
      <ServicesSection />
      <ProductsSection />
      <AboutSection />
      <TestimonialsSection />
      <CTASection />
      <Footer/>
    </div>
  )
}
