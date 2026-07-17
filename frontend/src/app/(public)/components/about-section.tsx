"use client"

import { ArrowRight, History, Sparkles, Cpu, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

const features = [
  {
    icon: <History className="w-5 h-5 text-blue-600" />,
    title: "Deep Roots",
    desc: "Powered by Comfort HVAC Solutions' decade of experience in industrial cooling.",
  },
  {
    icon: <Sparkles className="w-5 h-5 text-amber-500" />,
    title: "Zero Mess Promise",
    desc: 'Our signature "Service Jacket" protocol ensures your space stays spotless.',
  },
  {
    icon: <Cpu className="w-5 h-5 text-emerald-500" />,
    title: "Engineering Mindset",
    desc: "We optimize ACs for peak energy efficiency, not just surface cleaning.",
  },
]

const highlights = [
  "9+ years of industrial expertise",
  "Certified HVAC engineers",
  "60-second easy booking",
  "Transparent pricing, no hidden fees",
]

export function AboutSection() {
  const aboutSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: "MetroCool",
        url: "https://www.metrocool.com",
        description:
          "MetroCool provides professional AC repair, installation and industrial cooling services.",
        foundingDate: "2016",
        parentOrganization: {
          "@type": "Organization",
          name: "Comfort HVAC Solutions",
        },
      },
    ],
  }

  return (
    <section className="py-20 sm:py-28 bg-white overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16 xl:gap-24 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider mb-6">
              About Us
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-gray-900 leading-tight">
              The MetroCool{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                Story
              </span>
            </h2>

            <div className="space-y-4 text-gray-600 leading-relaxed mb-8 text-sm sm:text-base">
              <p>
                Founded in 2016,{" "}
                <span className="font-semibold text-gray-900">Comfort HVAC Solutions</span> began
                with a single mission — to deliver precision cooling for residential, industrial,
                and IT environments.
              </p>
              <p>
                <span className="text-blue-600 font-semibold">MetroCool</span> is the digital
                evolution — packing 9+ years of industrial-grade expertise into a seamless booking
                experience. When you book with us, you get a technician trained by HVAC engineers.
              </p>
            </div>

            {/* Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {highlights.map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-600 shrink-0" />
                  <span className="text-sm text-gray-700">{item}</span>
                </div>
              ))}
            </div>

            <Link href="/about">
              <button className="group bg-gray-900 text-white px-7 py-3.5 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-800 transition-all cursor-pointer">
                Read Full Story
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </motion.div>

          {/* Right Cards */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-12 lg:mt-0 space-y-5"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
                className="group bg-gray-50 p-6 sm:p-7 rounded-2xl flex items-start gap-5 border border-gray-100 hover:border-blue-100 hover:bg-blue-50/30 hover:shadow-md transition-all duration-300"
              >
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform shrink-0">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900 mb-1">{feature.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
