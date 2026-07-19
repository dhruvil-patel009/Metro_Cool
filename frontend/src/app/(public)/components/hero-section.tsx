"use client"

import { useEffect, useState } from "react"
import { CheckCircle2, ArrowRight, Wind } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { heroSlides } from "../lib/data"
import Link from "next/link"

export function HeroSection() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % heroSlides.length)
    }, 5000)
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
      name: "India",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Air Conditioning Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: "AC Repair" },
        },
        {
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: "AC Installation" },
        },
      ],
    },
  }

  return (
    <section
      className="relative min-h-[100svh] flex items-center overflow-hidden"
      aria-label="Metro Cool AC Repair and Installation Hero Section"
      itemScope
      itemType="https://schema.org/LocalBusiness"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(heroSchema) }}
      />

      {/* Background Images with Crossfade */}
      {heroSlides.map((s, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{
            backgroundImage: `url(${s.bg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: current === i ? 1 : 0,
          }}
        />
      ))}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full py-20">
        <div className="max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: "easeOut" as const }}
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-semibold mb-6">
                <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                  <CheckCircle2 className="text-white w-3 h-3" />
                </div>
                {slide.badge}
              </div>

              {/* Heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-[1.1] mb-6 text-white tracking-tight">
                {slide.title}
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                  {slide.highlight}
                </span>
              </h1>

              {/* Description */}
              <p className="text-base sm:text-lg lg:text-xl text-gray-300 leading-relaxed mb-10 max-w-xl">
                {slide.desc}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/services">
              <button className="group bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 flex items-center gap-2 cursor-pointer w-full sm:w-auto justify-center">
                Book a Service
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <Link href="/products">
              <button className="group bg-white/10 backdrop-blur-md text-white px-8 py-4 rounded-xl font-bold hover:bg-white/20 transition-all border border-white/20 flex items-center gap-2 cursor-pointer w-full sm:w-auto justify-center">
                <Wind className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                Book an AC
              </button>
            </Link>
          </div>

          {/* Stats Row */}
          <div className="mt-14 flex flex-wrap gap-6 sm:gap-10">
            {[
              { value: "9+", label: "Years Experience" },
              { value: "5000+", label: "Happy Customers" },
              { value: "4.8★", label: "Average Rating" },
            ].map((stat) => (
              <div key={stat.label} className="text-center sm:text-left">
                <p className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</p>
                <p className="text-xs sm:text-sm text-gray-400 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-2 rounded-full transition-all duration-500 cursor-pointer ${
              current === i ? "bg-blue-500 w-8" : "bg-white/40 w-2 hover:bg-white/60"
            }`}
          />
        ))}
      </div>
    </section>
  )
}
