import type { Metadata } from "next"
import { Button } from "@/app/components/ui/button"
import { Check, Zap, BadgeCheck, Clock, Users, TrendingUp, Sprout } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export const metadata: Metadata = {
  title: "About Metro Cool | Best AC Repair & Installation Services Since 2010",
  description:
    "Metro Cool provides expert AC repair, installation, and maintenance services since 2010. 24/7 emergency support, certified technicians, and transparent pricing.",
  keywords: [
    "AC repair services",
    "air conditioning installation",
    "HVAC maintenance",
    "emergency AC repair",
    "Metro Cool",
    "AC technicians near me",
  ],
  metadataBase: new URL("https://www.metrocool.com"),
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Metro Cool | Trusted AC Experts",
    description:
      "Certified AC repair and installation experts providing 24/7 emergency services with 15+ years experience.",
    url: "https://www.metrocool.com/about",
    siteName: "Metro Cool",
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
    title: "Metro Cool | AC Experts Since 2010",
    description:
      "Trusted AC repair and installation services with certified technicians and emergency support.",
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
    name: "Metro Cool",
    image: "https://www.metrocool.com/assets/ac-technician-installing-air-conditioning-unit.jpg",
    url: "https://www.metrocool.com",
    telephone: "+1-000-000-0000",
    description:
      "Metro Cool offers professional AC repair, installation and maintenance services with 24/7 emergency support.",
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
            <span className="text-sm font-medium text-gray-700">SINCE 2010</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Redefining Comfort for
            <br />
            <span className="text-blue-600">Modern Living</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mb-8">
            Metro Cool isn't just about fixing ACs. We're on a mission to engineer perfect climates for homes and
            businesses, combining cutting-edge efficiency with old-school reliability.
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
              <div className="text-4xl font-bold text-gray-900 mb-2">15+</div>
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
                <h2 className="text-4xl font-bold text-gray-900">City Icon</h2>
                <div className="w-12 h-1 bg-blue-600"></div>
              </div>
              <p className="text-gray-600 leading-relaxed mb-8">
                It started with a simple belief: nobody should sweat (the small stuff—especially not indoors) or freeze
                in their own living room. What began as a two-person operation in a suburban garage has grown into the
                city's most trusted name in climate control.
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
                    <h3 className="text-xl font-bold text-gray-900">Founded in a Garage</h3>
                    <span className="text-blue-600 font-semibold">2010</span>
                  </div>
                  <p className="text-gray-600">
                    Metro Cool is born. Just two techs, one van, and a lot of determination to do things right.
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
                    <h3 className="text-xl font-bold text-gray-900">First Fleet Expansion</h3>
                    <span className="text-blue-600 font-semibold">2014</span>
                  </div>
                  <p className="text-gray-600">
                    Demand skyrocketed. We purchased 5 new vans and hired our first dedicated support team.
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
                    <h3 className="text-xl font-bold text-gray-900">City-Wide Coverage</h3>
                    <span className="text-blue-600 font-semibold">2018</span>
                  </div>
                  <p className="text-gray-600">
                    Officially covering the entire metro area with guaranteed 2-hour emergency response times.
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
                    <h3 className="text-xl font-bold text-gray-900">Green Tech Award</h3>
                    <span className="text-blue-600 font-semibold">2023</span>
                  </div>
                  <p className="text-gray-600">
                    Recognized for our commitment to installing energy-efficient systems that save money and the planet.
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
              <h3 className="text-xl font-bold text-gray-900 mb-4">Certified Expertise</h3>
              <p className="text-gray-600">
                Every technician on our team is NATE-certified and undergoes 150+ hours of annual training on the latest
                AC systems.
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-8 text-center animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Rapid Response</h3>
              <p className="text-gray-600">
                AC doesn't wait for a convenient time to break—and neither should you. We offer guaranteed same-day
                service for emergency breakdowns.
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-8 text-center animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-6">
                <Check className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Transparent Pricing</h3>
              <p className="text-gray-600">
                No hidden fees. No surprise invoices. We provide a full quote before we pick up a wrench, so you know
                exactly what to expect.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12 animate-fade-in">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-2">Meet the Experts</h2>
              <p className="text-gray-600">The people behind the perfect temperature</p>
            </div>
            <Link href="/contact" className="text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-2">
              Join our team <span>→</span>
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="group animate-fade-in">
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <div className="aspect-[3/4] relative bg-gray-200">
                  <Image src="/assets/professional-woman-technician-smiling.jpg" alt="Sarah Jenkins" fill className="object-cover" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">Sarah Jenkins</h3>
                  <p className="text-blue-600 text-md font-bold">Operations Manager</p>
                </div>
              </div>
            </div>

            <div className="group animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <div className="aspect-[3/4] relative bg-gray-200">
                  <Image src="/assets/professional-man-technician-confident.jpg" alt="David Chen" fill className="object-cover" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">David Chen</h3>
                  <p className="text-blue-600 text-md font-bold">Lead Technician</p>
                </div>
              </div>
            </div>

            <div className="group animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <div className="aspect-[3/4] relative bg-gray-200">
                  <Image src="/assets/professional-man-with-glasses-technician.jpg" alt="Marcus Johnson" fill className="object-cover" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">Marcus Johnson</h3>
                  <p className="text-blue-600 text-md font-bold">Installation Specialist</p>
                </div>
              </div>
            </div>

            <div className="group animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <div className="aspect-[3/4] relative bg-gray-200">
                  <Image src="/assets/smiling-professional-woman.png" alt="Elena Rodriguez" fill className="object-cover" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">Elena Rodriguez</h3>
                  <p className="text-blue-600 text-md font-bold">Customer Success</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl p-12 text-center text-white shadow-2xl animate-scale-in">
            <h2 className="text-4xl font-bold mb-4">Ready to Feel the Difference?</h2>
            <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
              Don't let the weather dictate your comfort. Schedule your service with Metro Cool today and experience
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
