import dynamic from "next/dynamic"

// Lazy-load all homepage sections — dramatically reduces first-compile time
// Each section loads in the background after the initial HTML is served
const HeroSection = dynamic(
  () => import("./components/hero-section").then((m) => m.HeroSection),
  { ssr: false }
)
const ServicesSection = dynamic(
  () => import("./components/services-section").then((m) => m.ServicesSection),
  { ssr: false }
)
const ProductsSection = dynamic(
  () => import("./components/product-section").then((m) => m.ProductsSection),
  { ssr: false }
)
const WhyChooseUs = dynamic(
  () => import("./components/why-choose-us").then((m) => m.WhyChooseUs),
  { ssr: false }
)
const AboutSection = dynamic(
  () => import("./components/about-section").then((m) => m.AboutSection),
  { ssr: false }
)
const TestimonialsSection = dynamic(
  () =>
    import("./components/testimonial-section").then(
      (m) => m.TestimonialsSection
    ),
  { ssr: false }
)
const CTASection = dynamic(
  () => import("./components/cta-section").then((m) => m.CTASection),
  { ssr: false }
)

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white font-sans text-[#1a1a1a]">
      <HeroSection />
      <ServicesSection />
      <ProductsSection />
      <WhyChooseUs />
      <AboutSection />
      <TestimonialsSection />
      <CTASection />
    </div>
  )
}
