"use client"

import { useEffect, useState } from "react"
import { CheckCircle2 } from "lucide-react"
import { heroSlides } from "../lib/data"
import Link from "next/link"

export function HeroSection() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % heroSlides.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const slide = heroSlides[current]

  const heroSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Metro Cool",
    url: "https://www.metrocool.com",
    description:
      "Professional AC repair, installation and energy-efficient air conditioning services.",
    areaServed: {
      "@type": "Country",
      name: "United States",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Air Conditioning Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "AC Repair",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "AC Installation",
          },
        },
      ],
    },
  }

  return (
    <section
      className="relative min-h-[700px] flex items-center overflow-hidden transition-all duration-1000"
      style={{
        backgroundImage: `url(${slide.bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      aria-label="Metro Cool AC Repair and Installation Hero Section"
      itemScope
      itemType="https://schema.org/LocalBusiness"
    >

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(heroSchema),
        }}
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Radial gradient */}
      <div
        className="absolute inset-0 opacity-50"
        style={{
          background: "radial-gradient(circle at 90% 50%, rgba(212, 212, 192, 0.4) 0%, transparent 60%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="max-w-3xl transition-all duration-700">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold mb-6">
            <div className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center">
              <CheckCircle2 className="text-white w-2.5 h-2.5" />
            </div>
            {slide.badge}
          </div>

          <h1 className="text-4xl lg:text-7xl font-bold leading-tight mb-3 text-white">
            {slide.title} <br />
            <span className="text-blue-500">{slide.highlight}</span>
          </h1>

          <p className="text-xl text-gray-400 leading-relaxed mb-8 max-w-xl">{slide.desc}</p>

          <div className="flex flex-wrap gap-4 mb-12">
            <Link href="/services">
              <button className="bg-blue-600 text-white px-8 py-4 rounded-md font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 cursor-pointer">
                Book Service
              </button>
            </Link>
            {/* <button className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-md font-bold hover:bg-white/20 transition-all border border-white/10">
              Our Plans
            </button> */}
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3">
        {heroSlides.map((_, i) => (
          <span
            key={i}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${current === i ? "bg-blue-600 scale-125" : "bg-gray-500/60"
              }`}
          />
        ))}
      </div>
    </section>
  )
}
