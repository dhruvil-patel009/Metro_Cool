"use client"

import type React from "react"
import { MapPin, Phone, Mail, Send, ChevronDown, Building2, Home } from "lucide-react"
import { useState } from "react"

const addresses = [
  {
    label: "Registered Office",
    icon: Building2,
    address: "A-401, Suvas Oram, Opp. Hotel Safari, Odhav Ring Road, Ahmedabad 382415",
    mapSrc:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1836.0319526220978!2d72.66816613857164!3d23.021425694793663!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e87a935ae3a51%3A0x89d7a6c7f94aafc8!2sSuvas%20Oram!5e0!3m2!1sen!2sin!4v1784454546839!5m2!1sen!2sin",
    mapsLink:
      "https://maps.google.com/maps?q=A-401,+Suvas+Oram,+Opp.+Hotel+Safari,+Odhav+Ring+Road,+Ahmedabad+382415",
  },
  {
    label: "Service Centre",
    icon: Home,
    address: "GF-6, Radhe Chamber, Kansas County, B/h, Vastral, Ahmedabad, Gujarat 382418",
    mapSrc:
      "https://maps.google.com/maps?q=GF-6%2C+Radhe+Chamber%2C+Kansas+County%2C+Vastral%2C+Ahmedabad%2C+Gujarat+382418&t=&z=15&ie=UTF8&iwloc=&output=embed",
    mapsLink:
      "https://maps.google.com/maps?q=GF-6,+Radhe+Chamber,+Kansas+County,+Vastral,+Ahmedabad,+Gujarat+382418",
  },
]

export default function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    serviceType: "",
    message: "",
  })
  const [activeQuestion, setActiveQuestion] = useState<number | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
  }

  const faqs = [
    {
      question: "How much does an AC tune-up cost?",
      answer:
        "Our AC tune-up service includes a comprehensive inspection, cleaning, and performance optimization. Contact us for the latest pricing.",
    },
    {
      question: "Do you offer emergency services?",
      answer:
        "Yes! We provide emergency AC repair services with fast response times for urgent situations.",
    },
    {
      question: "What warranty do you provide?",
      answer:
        "We offer a warranty on all repairs and a 1-year warranty on new installations, backed by manufacturer guarantees.",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero */}
      <div className="relative h-[320px] sm:h-[400px] bg-gradient-to-br from-gray-700 to-gray-900 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: "url('/assets/technician-working-on-ac-unit.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight">Get in Touch</h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-200 max-w-2xl">
            Need AC repair, a new installation, or have a question? We&apos;re here to help.
          </p>
        </div>
      </div>

      {/* Quick contact strip */}
      <div className="bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-10 text-sm font-medium">
          <a href="tel:+919106385649" className="flex items-center gap-2 hover:text-blue-100 transition-colors">
            <Phone className="w-4 h-4" /> +91 91063 85649
          </a>
          <a href="mailto:support@metro-cool.com" className="flex items-center gap-2 hover:text-blue-100 transition-colors">
            <Mail className="w-4 h-4" /> support@metro-cool.com
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">

        {/* ── Top grid: Form + Contact Info ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 md:p-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Send us a Message</h2>
              <p className="text-gray-500 text-sm mb-8">Our team will get back to you within 24 hours.</p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">Full Name</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">Email Address</label>
                    <input
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-sm"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Service Type</label>
                  <div className="relative">
                    <select
                      value={formData.serviceType}
                      onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl appearance-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none bg-white text-sm"
                      required
                    >
                      <option value="">Select a subject</option>
                      <option value="repair">AC Repair</option>
                      <option value="installation">New Installation</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="emergency">Emergency Service</option>
                      <option value="other">Other</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Message</label>
                  <textarea
                    rows={5}
                    placeholder="Tell us more about your issue..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none text-sm"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-semibold px-8 py-3 rounded-xl transition-all shadow-sm shadow-blue-200"
                >
                  <Send className="w-4 h-4" />
                  Send Message
                </button>
              </form>
            </div>
          </div>

          {/* Contact Info Card */}
          <div className="flex flex-col gap-5">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-7">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Contact Information</h3>
              <div className="space-y-5">

                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Phone</p>
                    <a href="tel:+919106385649" className="text-base font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                      +91 91063 85649
                    </a>
                    <p className="text-xs text-gray-400 mt-0.5">Mon – Sat, 9am – 9pm</p>
                  </div>
                </div>

                <div className="border-t border-gray-50" />

                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Email</p>
                    <a href="mailto:support@metro-cool.com" className="text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors break-all">
                      support@metro-cool.com
                    </a>
                    <p className="text-xs text-gray-400 mt-0.5">Online support 24/7</p>
                  </div>
                </div>

                <div className="border-t border-gray-50" />

                {/* Registered Office */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Registered Office</p>
                    <p className="text-sm font-semibold text-gray-900 leading-snug">
                      A-401, Suvas Oram, Opp. Hotel Safari,<br />
                      Odhav Ring Road, Ahmedabad 382415
                    </p>
                  </div>
                </div>

                <div className="border-t border-gray-50" />

                {/* Service Centre */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Service Centre</p>
                    <p className="text-sm font-semibold text-gray-900 leading-snug">
                      GF-6, Radhe Chamber, Kansas County,<br />
                      B/h, Vastral, Ahmedabad, Gujarat 382418
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* ── Maps Section ── */}
        <div className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-3">Our Locations</h2>
          <p className="text-sm text-gray-500 text-center mb-8">Visit us at either of our offices in Ahmedabad</p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {addresses.map((addr, i) => {
              const Icon = addr.icon
              return (
                <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                  {/* Map iframe */}
                  <div className="relative h-64 sm:h-72 w-full bg-gray-100">
                    <iframe
                      src={addr.mapSrc}
                      className="absolute inset-0 w-full h-full border-0"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title={addr.label}
                    />
                  </div>

                  {/* Card footer */}
                  <div className="p-5 flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${i === 0 ? "bg-blue-50" : "bg-emerald-50"}`}>
                        <Icon className={`w-5 h-5 ${i === 0 ? "text-blue-600" : "text-emerald-600"}`} />
                      </div>
                      <div>
                        <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${i === 0 ? "text-blue-500" : "text-emerald-500"}`}>
                          {addr.label}
                        </p>
                        <p className="text-sm font-semibold text-gray-900 leading-snug">{addr.address}</p>
                      </div>
                    </div>
                    <a
                      href={addr.mapsLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`shrink-0 flex items-center gap-1.5 text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors whitespace-nowrap ${
                        i === 0
                          ? "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-100"
                          : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-100"
                      }`}
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      Directions
                    </a>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── FAQ Section ── */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-8">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-3">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <button
                  onClick={() => setActiveQuestion(activeQuestion === index ? null : index)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900 text-sm sm:text-base">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-300 ${
                      activeQuestion === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {activeQuestion === index && (
                  <div className="px-6 pb-5 text-sm text-gray-600 leading-relaxed border-t border-gray-50">
                    <p className="pt-4">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
