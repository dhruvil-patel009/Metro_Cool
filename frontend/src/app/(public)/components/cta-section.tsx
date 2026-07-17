"use client"

import Link from "next/link"
import { ArrowRight, Zap } from "lucide-react"
import { motion } from "framer-motion"

export function CTASection() {
  const ctaSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "AC Repair and Installation Services",
    provider: {
      "@type": "LocalBusiness",
      name: "Metro Cool",
      url: "https://www.metrocool.com",
    },
    areaServed: { "@type": "Country", name: "India" },
    description:
      "Book professional AC repair, installation or browse energy-efficient air conditioners from Metro Cool.",
  }

  return (
    <section
      className="px-4 sm:px-6 lg:px-8 mb-16 sm:mb-20 relative z-20"
      aria-labelledby="cta-heading"
      itemScope
      itemType="https://schema.org/Service"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ctaSchema) }}
      />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 rounded-3xl py-16 sm:py-20 px-6 sm:px-12 text-center relative overflow-hidden shadow-2xl shadow-blue-600/20"
      >
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3" />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #fff 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />

        <div className="relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs font-semibold mb-6">
            <Zap className="w-3.5 h-3.5 fill-yellow-300 text-yellow-300" />
            Same Day Service Available
          </div>

          <h2
            id="cta-heading"
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-5 leading-tight"
          >
            Ready to Beat the Heat?
          </h2>
          <p className="text-blue-100 text-base sm:text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
            Book your service today or browse our latest collection of energy-efficient air
            conditioners. Expert technicians at your doorstep.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/services">
              <button className="group bg-white text-blue-700 px-8 sm:px-10 py-4 rounded-xl font-bold hover:bg-blue-50 transition-all cursor-pointer flex items-center gap-2 justify-center w-full sm:w-auto shadow-lg">
                Book a Service
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <Link href="/products">
              <button className="bg-white/10 backdrop-blur-sm border border-white/25 text-white px-8 sm:px-10 py-4 rounded-xl font-bold hover:bg-white/20 transition-all cursor-pointer w-full sm:w-auto">
                View Products
              </button>
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
