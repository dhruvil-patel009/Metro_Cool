"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronRight, ArrowUpRight } from "lucide-react"
import { getServices, ServiceDTO } from "../lib/services.api"

type UIService = {
  id: string
  title: string
  category: string
  price: number
  originalPrice: number
  shortDescription: string
  thumbnailImage: string
  rating: number
  badge?: string
  badgeColor?: string   // ✅ ADD THIS
}

export default function ServicesPage() {
  const [services, setServices] = useState<UIService[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getServices()
      .then((data: ServiceDTO[]) => {
        const mapped = data.map((service) => ({
          id: service.id,
          title: service.title,
          category: service.category,
          price: service.price,
          originalPrice: service.price + 20, // UI only
          shortDescription: service.short_description,
          thumbnailImage: service.image_url || "/placeholder.svg",
           rating: service.rating ?? 0,
            badge: service.badge || undefined,
            badgeColor: service.badge_color || "#2563eb",
        }))

        setServices(mapped)
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        Loading services...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <main className="px-4 py-8 md:px-8 lg:px-12 animate-fade-in">
        {/* Breadcrumbs */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-slate-500">
          <Link href="/user" className="hover:text-blue-600 transition-colors">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-slate-900">Services</span>
        </nav>

        {/* Header */}
        <header className="mb-10 max-w-2xl">
          <h1 className="mb-3 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            AC Services
          </h1>
          <p className="text-base text-slate-600 leading-relaxed">
            Premium cooling solutions for your home. Select a service below to
            view details and book an expert technician.
          </p>
        </header>

        {/* Services Grid (UNCHANGED UI) */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {services.map((service) => (
            <div
              key={service.id}
              className="group overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                <Image
                  src={service.thumbnailImage}
                  alt={service.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />

                <Link
                  href={`/services/${service.id}`}
                  className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/20 text-white backdrop-blur-sm transition-colors hover:bg-black/40"
                >
                  <ArrowUpRight className="h-5 w-5" />
                </Link>

                {service.badge && (
                  <div
    className="absolute top-4 left-4 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider"
    style={{ backgroundColor: service.badgeColor }}
  >
    {service.badge}
  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="mb-2 text-[10px] uppercase tracking-widest text-gray-400 font-bold">
                  {service.category}
                </div>

                <h3 className="mb-2 text-lg font-bold text-slate-900">
                  {service.title}
                </h3>

                <p className="mb-4 text-sm leading-relaxed text-slate-600">
                  {service.shortDescription}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    <span className="text-lg font-bold text-slate-900">
                      ${service.price}
                    </span>
                    <span className="text-xs text-gray-400 line-through">
                      ${service.originalPrice}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <span className="text-yellow-400">★</span>
                    <span className="font-semibold">{service.rating}</span>
                  </div>
                </div>

                <Link
                  href={`/user/services/${service.id}`}
                  className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  View Details
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
