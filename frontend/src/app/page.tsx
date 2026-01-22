
import Header from "./components/header";
import { AboutSection } from "./User/components/about-section";
import { CTASection } from "./User/components/cta-section";
import { Footer } from "./User/components/footer";
import { HeroSection } from "./User/components/hero-section";
import { ProductsSection } from "./User/components/product-section";
import { ServicesSection } from "./User/components/services-section";
import { TestimonialsSection } from "./User/components/testimonial-section";




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
