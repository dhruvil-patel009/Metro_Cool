"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { getTechnicians, TechnicianDTO } from "@/app/lib/technician.api"
import { Users, Wrench, Award, ChevronDown, ChevronUp } from "lucide-react"

export default function TeamSection() {
  const [technicians, setTechnicians] = useState<TechnicianDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [visibleCount, setVisibleCount] = useState(4)

  useEffect(() => {
    getTechnicians()
      .then(setTechnicians)
      .catch(() => setTechnicians([]))
      .finally(() => setLoading(false))
  }, [])

  /* ── Loading Skeleton ── */
  if (loading) {
    return (
      <section id="team" className="py-16 sm:py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="h-4 w-32 bg-gray-200 rounded mx-auto mb-3 animate-pulse" />
            <div className="h-8 w-64 bg-gray-200 rounded mx-auto mb-2 animate-pulse" />
            <div className="h-4 w-80 bg-gray-200 rounded mx-auto animate-pulse" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse">
                <div className="aspect-[4/5] bg-gray-200" />
                <div className="p-4 space-y-2">
                  <div className="h-4 w-24 bg-gray-200 rounded mx-auto" />
                  <div className="h-3 w-20 bg-gray-200 rounded mx-auto" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  /* ── Empty State — show team highlights instead of blank ── */
  if (technicians.length === 0) {
    return (
      <section id="team" className="py-16 sm:py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-1.5">Our Team</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Meet the Experts</h2>
            <p className="text-gray-500 text-sm sm:text-base max-w-md mx-auto">
              Skilled and certified technicians delivering precision cooling solutions
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-10">
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm text-center">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mx-auto mb-3">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">10+</p>
              <p className="text-xs text-gray-500 mt-1">Expert Technicians</p>
            </div>
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm text-center">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center mx-auto mb-3">
                <Wrench className="w-5 h-5 text-emerald-600" />
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">5000+</p>
              <p className="text-xs text-gray-500 mt-1">Jobs Completed</p>
            </div>
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm text-center">
              <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center mx-auto mb-3">
                <Award className="w-5 h-5 text-amber-600" />
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">4.8★</p>
              <p className="text-xs text-gray-500 mt-1">Avg. Rating</p>
            </div>
          </div>

          {/* Highlights */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 sm:p-10 text-center">
            <p className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">
              Certified & Trained Professionals
            </p>
            <p className="text-sm text-gray-500 max-w-lg mx-auto leading-relaxed mb-6">
              Our technicians are trained by HVAC engineers, certified in split AC, window AC, VRF, and industrial cooling systems. Every job comes with our Zero Mess guarantee.
            </p>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all text-sm"
            >
              Book a Service
            </Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="team" className="py-16 sm:py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-10 sm:mb-14 gap-4">
          <div>
            <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-1.5">Our Team</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              Meet the Experts
            </h2>
            <p className="text-gray-500 text-sm sm:text-base max-w-md">
              Skilled and certified technicians delivering precision cooling solutions
            </p>
          </div>

          <Link
            href="/contact"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors group"
          >
            Join our team
            <span className="group-hover:translate-x-0.5 transition-transform">→</span>
          </Link>
        </div>

        {/* ── Stats Bar ── */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-10 sm:mb-12">
          <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-gray-100 shadow-sm text-center">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-blue-50 flex items-center justify-center mx-auto mb-2">
              <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            </div>
            <p className="text-lg sm:text-2xl font-bold text-gray-900">{technicians.length}+</p>
            <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">Expert Technicians</p>
          </div>
          <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-gray-100 shadow-sm text-center">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-emerald-50 flex items-center justify-center mx-auto mb-2">
              <Wrench className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
            </div>
            <p className="text-lg sm:text-2xl font-bold text-gray-900">5000+</p>
            <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">Jobs Completed</p>
          </div>
          <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-gray-100 shadow-sm text-center">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-amber-50 flex items-center justify-center mx-auto mb-2">
              <Award className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
            </div>
            <p className="text-lg sm:text-2xl font-bold text-gray-900">4.8★</p>
            <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">Avg. Rating</p>
          </div>
        </div>

        {/* ── Technician Grid ── */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {technicians.slice(0, visibleCount).map((tech) => (
            <div key={tech.id} className="group">
              <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">

                {/* Photo */}
                <div className="aspect-[4/5] relative bg-gradient-to-b from-blue-50 to-gray-100 overflow-hidden">
                  <Image
                    src={tech.photo_url || "/placeholder-user.png"}
                    alt={tech.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Info */}
                <div className="p-4 sm:p-5 text-center">
                  <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-0.5 truncate">
                    {tech.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-blue-600 font-medium">
                    {tech.role}
                  </p>

                  {/* Services Badges */}
                  {tech.services && tech.services.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 justify-center mt-3">
                      {tech.services.slice(0, 2).map((service: string, i: number) => (
                        <span
                          key={i}
                          className="text-[10px] sm:text-[11px] bg-gray-50 text-gray-600 px-2 py-0.5 rounded-full border border-gray-100"
                        >
                          {service}
                        </span>
                      ))}
                      {tech.services.length > 2 && (
                        <span className="text-[10px] sm:text-[11px] text-gray-400 px-1">
                          +{tech.services.length - 2}
                        </span>
                      )}
                    </div>
                  )}
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* ── Show More / Less Button ── */}
        {technicians.length > 4 && (
          <div className="text-center mt-10">
            {visibleCount < technicians.length ? (
              <button
                onClick={() => setVisibleCount(technicians.length)}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl shadow-sm hover:shadow-md transition-all text-sm"
              >
                View All Technicians
                <ChevronDown className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => setVisibleCount(4)}
                className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl transition-all text-sm"
              >
                Show Less
                <ChevronUp className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

      </div>
    </section>
  )
}
