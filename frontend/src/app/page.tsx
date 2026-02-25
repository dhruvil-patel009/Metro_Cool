export const dynamic = "force-static";

import Image from "next/image";
import Header from "./components/header";
import { AboutSection } from "./user/components/about-section";
import { CTASection } from "./user/components/cta-section";
import { Footer } from "./user/components/footer";
import { HeroSection } from "./user/components/hero-section";
import { ProductsSection } from "./user/components/product-section";
import { ServicesSection } from "./user/components/services-section";
import { TestimonialsSection } from "./user/components/testimonial-section";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white font-sans text-[#1a1a1a]">
      <a href="https://www.seobility.net/en/seocheck/check?url=https%3A%2F%2Fwww.metro-cool.com%2F"><Image src="https://app.seobility.net/widget/widget.png?url=https%3A%2F%2Fwww.metro-cool.com%2F" alt="Seobility Score for metro-cool.com"/></a>
      <Header />
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