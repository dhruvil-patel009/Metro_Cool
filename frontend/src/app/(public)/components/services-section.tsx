"use client"

import { Wrench, Settings, Wind, ArrowRight, Shield } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

const services = [
  {
    icon: <Wrench className="w-6 h-6" />,
    title: "AC Repair",
    description:
      "Fast diagnostics and expert fixes for all AC brands. We restore your cooling comfort same-day.",
    features: ["All Brands", "Same Day", "Warranty"],
    color: "from-blue-500 to-blue-600",
    bgLight: "bg-blue-50",
    textColor: "text-blue-600",
  },
  {
    icon: <Settings className="w-6 h-6" />,
    title: "Installation",
    description:
      "Professional uninstallation and installation services. Secure mounting and leakage checks included.",
    features: ["Free Survey", "Secure Mount", "Gas Check"],
    color: "from-emerald-500 to-emerald-600",
    bgLight: "bg-emerald-50",
    textColor: "text-emerald-600",
  },
  {
    icon: <Wind className="w-6 h-6" />,
    title: "Maintenance",
    description:
      "Regular servicing to improve efficiency and longevity. Deep cleaning and gas refilling services.",
    features: ["Deep Clean", "Gas Refill", "Health Check"],
    color: "from-violet-500 to-violet-600",
    bgLight: "bg-violet-50",
    textColor: "text-violet-600",
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
}

export function ServicesSection() {
  const servicesSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    provider: {
      "@type": "LocalBusiness",
      name: "Metro Cool",
      url: "https://www.metrocool.com",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Air Conditioning Services",
      itemListElement: services.map((s) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: s.title,
          description: s.description,
        },
      })),
    },
  }

  return (
    <section className="py-20 sm:py-28 bg-white relative overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesSchema) }}
      />

      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-60" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-violet-50 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl opacity-60" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider mb-4">
              <Shield className="w-3.5 h-3.5" />
              What We Do
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Our Professional Services
            </h2>
            <p className="text-gray-500 text-base sm:text-lg max-w-2xl mx-auto">
              Expert cooling solutions backed by 9+ years of industrial-grade experience
            </p>
          </motion.div>
        </div>

        {/* Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {services.map((service) => (
            <motion.div
              key={service.title}
              variants={cardVariants}
              className="group relative bg-white p-8 sm:p-10 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Icon */}
              <div
                className={`w-14 h-14 ${service.bgLight} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
              >
                <div className={service.textColor}>{service.icon}</div>
              </div>

              {/* Content */}
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                {service.title}
              </h3>
              <p className="text-gray-500 leading-relaxed mb-6 text-sm sm:text-base">
                {service.description}
              </p>

              {/* Features Tags */}
              <div className="flex flex-wrap gap-2 mb-8">
                {service.features.map((f) => (
                  <span
                    key={f}
                    className="text-xs font-medium px-3 py-1 rounded-full bg-gray-50 text-gray-600 border border-gray-100"
                  >
                    {f}
                  </span>
                ))}
              </div>

              {/* Link */}
              <Link
                href="/services"
                className={`inline-flex items-center gap-1.5 text-sm font-bold ${service.textColor} group-hover:gap-3 transition-all`}
              >
                Book Now
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
