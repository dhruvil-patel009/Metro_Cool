import type { Metadata } from "next"
import { Button } from "@/app/components/ui/button"
import { BadgeCheck, Clock, Users, TrendingUp, Sprout, Sparkles, Cpu } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import TeamSection from "./TeamSection"

export const metadata: Metadata = {
  title: "About MetroCool | Precision AC & Cooling Experts Since 2016",
  description:
    "MetroCool is the digital evolution of Comfort HVAC Solutions. Since 2016 we've delivered precision cooling for homes, industries, and IT environments with technicians trained by HVAC engineers.",
  keywords: [
    "AC repair services",
    "air conditioning installation",
    "HVAC maintenance",
    "industrial cooling",
    "server room cooling",
    "Comfort HVAC Solutions",
    "MetroCool",
    "AC technicians near me",
  ],
  metadataBase: new URL("https://www.metrocool.com"),
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About MetroCool | Precision Cooling Experts",
    description:
      "From Comfort HVAC Solutions to MetroCool — industrial-grade cooling expertise packed into a seamless 60-second booking experience.",
    url: "https://www.metrocool.com/about",
    siteName: "MetroCool",
    images: [
      {
        url: "/assets/ac-technician-installing-air-conditioning-unit.jpg",
        width: 1200,
        height: 630,
        alt: "Professional AC technician installing air conditioning unit",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MetroCool | Precision Cooling Experts Since 2016",
    description:
      "Technicians trained by HVAC engineers, transparent pricing, and a signature Zero Mess promise.",
    images: ["/assets/ac-technician-installing-air-conditioning-unit.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function AboutPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "MetroCool",
    image: "https://www.metrocool.com/assets/ac-technician-installing-air-conditioning-unit.jpg",
    url: "https://www.metrocool.com",
    telephone: "+1-000-000-0000",
    description:
      "MetroCool is the digital evolution of Comfort HVAC Solutions, offering precision AC repair, installation and industrial cooling services with technicians trained by HVAC engineers.",
    foundingDate: "2016",
    parentOrganization: {
      "@type": "Organization",
      name: "Comfort HVAC Solutions",
    },
    openingHours: "Mo-Su 00:00-23:59",
  }

  

  return (
    <div className="min-h-screen bg-gray-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {/* Hero Section */}
      <section className="relative h-[600px] bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/assets/ac-technician-installing-air-conditioning-unit.jpg"
            alt="AC Technician Working"
            fill
            className="object-cover opacity-40"
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col items-center justify-center text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full mb-6 shadow-sm">
            <span className="text-sm font-medium text-gray-700">SINCE 2016</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Precision Cooling for
            <br />
            <span className="text-blue-600">Modern Living</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mb-8">
            MetroCool is the digital evolution of Comfort HVAC Solutions. We&apos;ve packed nearly a decade of
            industrial-grade cooling expertise into a seamless, 60-second booking experience.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="#story">
              <Button size="lg" className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white">
                View Our Story
              </Button>
            </Link>
            <Link href="#team">
              <Button size="lg" variant="outline" className="bg-white/80 cursor-pointer backdrop-blur-sm">
                Meet the Team
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative -mt-20 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 grid grid-cols-2 md:grid-cols-4 gap-6 animate-scale-in">
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">10k+</div>
              <div className="text-sm text-gray-600 uppercase tracking-wide">Hours Worked</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">50+</div>
              <div className="text-sm text-gray-600 uppercase tracking-wide">Certifications</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">9+</div>
              <div className="text-sm text-gray-600 uppercase tracking-wide">Years Experience</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">24/7</div>
              <div className="text-sm text-gray-600 uppercase tracking-wide">Emergency Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section id="story" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Left - City Icon */}
            <div className="animate-fade-in">
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-4xl font-bold text-gray-900">The MetroCool Story</h2>
                <div className="w-12 h-1 bg-blue-600"></div>
              </div>
              <p className="text-gray-600 leading-relaxed mb-8">
                In 2016, we founded Comfort HVAC Solutions with a single mission: to provide precision cooling for
                complex residential, industrial, and IT environments. Over nearly a decade, we&apos;ve mastered
                everything from massive commercial chillers to the server rooms that keep businesses running — and
                MetroCool brings that expertise to your doorstep.
              </p>
              <div className="relative rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src="/assets/technician-adjusting-air-conditioning-thermostat.jpg"
                  alt="Technician at Work"
                  width={600}
                  height={400}
                  className="w-full"
                />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-white rounded-xl p-4 shadow-lg">
                    <p className="text-sm text-gray-700">"We don't just fix ACs, we restore comfort."</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Timeline */}
            <div className="space-y-8 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="w-0.5 h-full bg-gray-200 mt-4"></div>
                </div>
                <div className="pb-12">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">Comfort HVAC Solutions Founded</h3>
                    <span className="text-blue-600 font-semibold">2016</span>
                  </div>
                  <p className="text-gray-600">
                    We started with a single mission — to deliver precision cooling for complex residential,
                    industrial, and IT environments.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="w-0.5 h-full bg-gray-200 mt-4"></div>
                </div>
                <div className="pb-12">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">Industrial &amp; IT Cooling</h3>
                    <span className="text-blue-600 font-semibold">2018</span>
                  </div>
                  <p className="text-gray-600">
                    We scaled up to handle massive commercial chillers and the critical server rooms that keep
                    businesses running.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="w-0.5 h-full bg-gray-200 mt-4"></div>
                </div>
                <div className="pb-12">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">The Service Jacket Protocol</h3>
                    <span className="text-blue-600 font-semibold">2021</span>
                  </div>
                  <p className="text-gray-600">
                    We introduced our signature Zero Mess protocol — engineering-grade standards that keep your walls
                    and floors spotless on every job.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Sprout className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">MetroCool Goes Digital</h3>
                    <span className="text-blue-600 font-semibold">2025</span>
                  </div>
                  <p className="text-gray-600">
                    We launched MetroCool — packing 9+ years of industrial-grade expertise into a seamless, 60-second
                    booking experience.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why MetroCool Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why MetroCool?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We don't just promise cool air, we promise peace of mind. Here's what sets our service apart from the
              competition.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-2xl p-8 text-center animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-6">
                <BadgeCheck className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Deep Roots</h3>
              <p className="text-gray-600">
                Powered by Comfort HVAC Solutions&apos; decade of experience, our technicians are trained by HVAC
                engineers — not just general handymen.
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-8 text-center animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Zero Mess Promise</h3>
              <p className="text-gray-600">
                Our signature &quot;Service Jacket&quot; protocol keeps your walls and floors clean — no dust, no
                stains, no surprises left behind.
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-8 text-center animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-6">
                <Cpu className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Engineering Mindset</h3>
              <p className="text-gray-600">
                We don&apos;t just &quot;wash&quot; ACs — we optimize them for energy efficiency, so your system runs
                cooler, quieter, and cheaper.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
       
         <TeamSection />


      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl p-12 text-center text-white shadow-2xl animate-scale-in">
            <h2 className="text-4xl font-bold mb-4">Ready to Feel the Difference?</h2>
            <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
              Don&apos;t let the weather dictate your comfort. Schedule your service with MetroCool today and experience
              AC done right.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/services">
                <Button size="lg" className="bg-white cursor-pointer text-blue-600 hover:bg-gray-100">
                  Book a Service Now
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white cursor-pointer hover:text-white hover:bg-white/10 bg-transparent"
                >
                  Contact Support
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
