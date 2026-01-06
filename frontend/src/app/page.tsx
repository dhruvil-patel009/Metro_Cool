import { HeroSection } from "./User/components/hero-section";
import { ServicesSection } from "./User/components/services-section";
import { CTASection } from "./User/components/cta-section";
import { TestimonialsSection } from "./User/components/testimonial-section";
import { ProductsSection } from "./User/components/product-section";
import { AboutSection } from "./User/components/about-section";
import Header from "./components/header";
import { Footer } from "./User/components/footer";



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
