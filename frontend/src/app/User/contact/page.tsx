"use client"

import type React from "react"

import { MapPin, Phone, Mail, Send, ChevronDown } from "lucide-react"
import { useState } from "react"

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
    // Handle form submission
  }

  const faqs = [
    {
      question: "How much does an AC tune-up cost?",
      answer:
        "Our standard AC tune-up service starts at $99 and includes a comprehensive inspection, cleaning, and performance optimization.",
    },
    {
      question: "Do you offer emergency services?",
      answer:
        "Yes! We provide 24/7 emergency AC repair services with guaranteed 2-hour response times for urgent situations.",
    },
    {
      question: "What warranty do you provide?",
      answer:
        "We offer a 90-day warranty on all repairs and a 1-year warranty on new installations, backed by manufacturer guarantees.",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero Section */}
      <div className="relative h-[400px] bg-gradient-to-br from-gray-600 to-gray-800 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: "url('/assets/technician-working-on-ac-unit.jpg')" }}
        />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">Get in Touch</h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-2xl">
            Need AC repair, a new installation, or have a question? We're here to help keep your home comfortable.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10 animate-slide-up">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Send us a Message</h2>
              <p className="text-gray-600 mb-8">
                Fill out the form below and our team will get back to you within 24 hours.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Full Name</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Email Address</label>
                    <input
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Service Type</label>
                  <div className="relative">
                    <select
                      value={formData.serviceType}
                      onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none bg-white"
                      required
                    >
                      <option value="">Select a subject</option>
                      <option value="repair">AC Repair</option>
                      <option value="installation">New Installation</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="emergency">Emergency Service</option>
                      <option value="other">Other</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Message</label>
                  <textarea
                    rows={5}
                    placeholder="Tell us more about your issue..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
                >
                  <Send className="w-5 h-5" />
                  Send Message
                </button>
              </form>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-8 animate-slide-up" style={{ animationDelay: "0.1s" }}>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h3>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Phone</p>
                    <a
                      href="tel:+15550123456"
                      className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                    >
                      +1 (555) 012-3456
                    </a>
                    <p className="text-sm text-gray-500 mt-1">Mon-Fri 8am-6pm</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Email</p>
                    <a
                      href="mailto:support@metrocool.com"
                      className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors break-all"
                    >
                      support@metrocool.com
                    </a>
                    <p className="text-sm text-gray-500 mt-1">Online support 24/7</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Office</p>
                    <p className="text-lg font-semibold text-gray-900">123 Cooling Blvd, Suite 400</p>
                    <p className="text-lg font-semibold text-gray-900">Metro City, ST 90210</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="bg-white rounded-2xl shadow-lg p-4 animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <div className="relative h-64 rounded-lg overflow-hidden bg-gray-200">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage:
                      "url('https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/-73.935242,40.730610,12,0/600x400@2x?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw')",
                  }}
                />
                <button className="absolute bottom-4 right-4 bg-white hover:bg-gray-50 text-gray-900 font-semibold px-4 py-2 rounded-lg shadow-lg transition-colors flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Get Directions
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 animate-slide-up" style={{ animationDelay: "0.3s" }}>
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Frequently Asked Questions</h2>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {faqs.map((faq, index) => (
              <button
                key={index}
                onClick={() => setActiveQuestion(activeQuestion === index ? null : index)}
                className={`px-6 py-3 rounded-full font-medium transition-all ${
                  activeQuestion === index
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-gray-50 shadow"
                }`}
              >
                {faq.question}
              </button>
            ))}
          </div>
          {activeQuestion !== null && (
            <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8 animate-scale-in">
              <h3 className="text-xl font-bold text-gray-900 mb-4">{faqs[activeQuestion].question}</h3>
              <p className="text-gray-600 leading-relaxed">{faqs[activeQuestion].answer}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
