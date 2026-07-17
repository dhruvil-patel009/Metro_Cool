"use client"

import { Clock, Shield, BadgeCheck, Banknote, Headphones, Leaf } from "lucide-react"
import { motion } from "framer-motion"

const reasons = [
  {
    icon: <Clock className="w-6 h-6" />,
    title: "Same Day Service",
    desc: "Book now, get service today. No long waiting periods.",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: <BadgeCheck className="w-6 h-6" />,
    title: "Certified Engineers",
    desc: "HVAC-trained technicians with 5+ years experience.",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    icon: <Banknote className="w-6 h-6" />,
    title: "Transparent Pricing",
    desc: "No hidden charges. See the price before you book.",
    color: "text-violet-600",
    bg: "bg-violet-50",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Service Warranty",
    desc: "30-day warranty on all repairs. Peace of mind guaranteed.",
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    icon: <Headphones className="w-6 h-6" />,
    title: "24/7 Support",
    desc: "Round-the-clock customer support for all your queries.",
    color: "text-rose-600",
    bg: "bg-rose-50",
  },
  {
    icon: <Leaf className="w-6 h-6" />,
    title: "Eco-Friendly",
    desc: "Energy-efficient solutions that save money and the planet.",
    color: "text-teal-600",
    bg: "bg-teal-50",
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
}

export function WhyChooseUs() {
  return (
    <section className="py-20 sm:py-28 bg-gradient-to-b from-white to-gray-50/80 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-50 rounded-full blur-3xl opacity-30" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14 sm:mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider mb-4">
            Why MetroCool
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Why Customers Trust Us
          </h2>
          <p className="text-gray-500 text-sm sm:text-base max-w-2xl mx-auto">
            We combine industrial-grade expertise with a seamless digital experience to deliver cooling solutions you can rely on.
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6"
        >
          {reasons.map((reason) => (
            <motion.div
              key={reason.title}
              variants={itemVariants}
              className="group bg-white p-7 rounded-2xl border border-gray-100 hover:border-blue-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
            >
              <div
                className={`w-12 h-12 ${reason.bg} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}
              >
                <div className={reason.color}>{reason.icon}</div>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{reason.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{reason.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
