"use client"

import { use, useEffect, useState, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  ChevronRight,
  Star,
  Clock,
  UserCheck,
  ShieldCheck,
  Calendar,
  Truck,
  Share2,
  ChevronDown,
  Headphones,
  CheckCircle2,
  ThumbsUp,
  SearchCheck,
  Droplets,
  Wind,
  Trash2,
  Phone,
} from "lucide-react"

import { formatINR } from "@/app/lib/currency"
import { getFullServiceDetails } from "../../lib/serviceDetails.api"
import { useAuthStore } from "@/store/auth.store"
import { toast } from "react-toastify"
import { useRouter } from "next/navigation"

const iconMap: Record<string, any> = {
  SearchCheck,
  Droplets,
  Wind,
  Trash2,
  CheckCircle2,
  ShieldCheck,
  Clock,
}

export default function ServiceDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [service, setService] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [selectedAddons, setSelectedAddons] = useState<string[]>([])
  const { token } = useAuthStore()
  const router = useRouter()

  // Calculate total price safely using useMemo
  const totalPrice = useMemo(() => {
    if (!service) return 0
    const basePrice = Number(service.price) || 0
    const addonsPrice = (service.addons || [])
      .filter((addon: any) => selectedAddons.includes(addon.id))
      .reduce((sum: number, addon: any) => sum + (Number(addon.price) || 0), 0)
    return basePrice + addonsPrice
  }, [service, selectedAddons])

  // Calculate discount percentage
  const discountPercent = useMemo(() => {
    if (!service) return 0
    const originalPrice = Number(service.originalPrice) || 0
    const basePrice = Number(service.price) || 0
    if (originalPrice <= basePrice) return 0
    return Math.round(((originalPrice - basePrice) / originalPrice) * 100)
  }, [service])

  const toggleAddon = (addonId: string) => {
    setSelectedAddons((prev) =>
      prev.includes(addonId) ? prev.filter((a) => a !== addonId) : [...prev, addonId]
    )
  }

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        setError(null)
        const data = await getFullServiceDetails(id)

        if (!data || !data.service) {
          throw new Error("Service data is empty")
        }

        const main = data.service

        setService({
          ...main,
          longDescription: main.description || main.short_description || "",
          originalPrice: main.original_price ?? (main.price ? main.price + 200 : 0),
          included: data.includes || [],
          addons: (data.addons || []).map((a: any) => ({
            ...a,
            id: a.id || String(Math.random()),
            price: Number(a.price) || 0,
          })),
          faqs: data.faqs || [],
          // duration: main.duration_minutes
          //   ? `${main.duration_minutes} mins`
          //   : "60–90 mins",
          expertise: main.expertise || "Certified Technician",
          warranty: main.warranty || "30 Day Service Warranty",
          reviews: main.review_count ?? 0,
        })
      } catch (e: any) {
        console.error("Failed to load service:", e)
        setError(e.message || "Failed to load service")
        setService(null)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="loader-wrapper">
          <div className="loader"></div>
        </div>
      </div>
    )
  }

  if (error || !service) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-7 h-7 text-red-400" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#1d242d] mb-2">Service Not Found</h1>
          <p className="text-sm text-gray-500 mb-5">
            {error || "The service you're looking for doesn't exist or has been removed."}
          </p>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
          >
            ← Browse All Services
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-6 sm:mb-8 flex-wrap">
          <Link href="/" className="hover:text-gray-600 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/services" className="hover:text-gray-600 transition-colors">
            Services
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-700 font-medium truncate max-w-[180px] sm:max-w-none">
            {service.title}
          </span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* ============ MAIN CONTENT ============ */}
          <div className="lg:col-span-7 xl:col-span-8">
            {/* Header */}
            <div className="mb-6">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                {service.badge && (
                  <span
                    className="text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider text-white"
                    style={{ backgroundColor: service.badge_color || "#2563eb" }}
                  >
                    {service.badge}
                  </span>
                )}
                {service.category && (
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider text-blue-600 bg-blue-50 border border-blue-100">
                    {service.category}
                  </span>
                )}
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-bold text-[#1d242d]">
                    {Number(service.rating || 0).toFixed(1)}
                  </span>
                  <span className="text-xs text-gray-400">({service.reviews} reviews)</span>
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1d242d] leading-tight mb-3">
                {service.title}
              </h1>
              <p className="text-gray-500 text-sm sm:text-base leading-relaxed max-w-2xl">
                {service.longDescription}
              </p>
            </div>

            {/* Quick Info Pills */}
            <div className="flex flex-wrap gap-3 sm:gap-4 mb-8">
              <div className="flex items-center gap-2.5 bg-gray-50 rounded-xl px-4 py-2.5 border border-gray-100">
                <Clock className="w-4 h-4 text-blue-600" />
                {/* <div>
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold leading-none">Duration</p>
                  <p className="text-xs font-bold text-[#1d242d] mt-0.5">{service.duration}</p>
                </div> */}
              </div>
              <div className="flex items-center gap-2.5 bg-gray-50 rounded-xl px-4 py-2.5 border border-gray-100">
                <UserCheck className="w-4 h-4 text-violet-600" />
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold leading-none">Expertise</p>
                  <p className="text-xs font-bold text-[#1d242d] mt-0.5">{service.expertise}</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 bg-gray-50 rounded-xl px-4 py-2.5 border border-gray-100">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold leading-none">Warranty</p>
                  <p className="text-xs font-bold text-[#1d242d] mt-0.5">{service.warranty}</p>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            {service.image_url && (
              <div className="relative rounded-2xl overflow-hidden mb-10 sm:mb-12 border border-gray-100">
                <div className="relative aspect-[16/9] sm:aspect-[16/8]">
                  <Image
                    src={service.image_url}
                    alt={service.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm border border-gray-100">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-xs font-semibold text-[#1d242d]">Available Now</span>
                </div>
              </div>
            )}

            {/* What's Included */}
            {service.included && service.included.length > 0 && (
              <div className="mb-12">
                <h2 className="text-xl sm:text-2xl font-bold text-[#1d242d] mb-6 flex items-center gap-3">
                  <span className="w-1 h-7 bg-blue-600 rounded-full" />
                  What&apos;s Included
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {service.included.map((item: any, i: number) => {
                    const Icon = iconMap[item.icon as string] || SearchCheck
                    return (
                      <div
                        key={i}
                        className="flex items-start gap-4 p-4 sm:p-5 rounded-xl border border-gray-100 bg-white hover:border-blue-100 hover:shadow-sm transition-all"
                      >
                        <div className="w-11 h-11 shrink-0 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-[#1d242d] text-sm">
                            {item.title}
                          </h3>
                          {item.description && (
                            <p className="text-gray-500 text-xs leading-relaxed mt-1">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Enhance Your Service (Addons) */}
            {service.addons && service.addons.length > 0 && (
              <div className="mb-12">
                <h2 className="text-xl sm:text-2xl font-bold text-[#1d242d] mb-2 flex items-center gap-3">
                  <span className="w-1 h-7 bg-blue-600 rounded-full" />
                  Enhance Your Service
                </h2>
                <p className="text-xs text-gray-400 mb-6 ml-4">
                  Select optional add-ons to customize your service
                </p>
                <div className="space-y-3">
                  {service.addons.map((addon: any) => {
                    const isSelected = selectedAddons.includes(addon.id)
                    return (
                      <div
                        key={addon.id}
                        onClick={() => toggleAddon(addon.id)}
                        className={`flex items-center gap-4 p-4 sm:p-5 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? "border-blue-300 bg-blue-50/50 shadow-sm"
                            : "border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm"
                        }`}
                      >
                        {/* Image */}
                        {addon.image && (
                          <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden shrink-0 border border-gray-100">
                            <Image
                              src={addon.image}
                              alt={addon.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}

                        {/* Text */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold text-[#1d242d] text-sm">
                              {addon.title}
                            </h3>
                            {addon.badge && (
                              <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-blue-100 text-blue-600 uppercase tracking-wide">
                                {addon.badge}
                              </span>
                            )}
                          </div>
                          {addon.description && (
                            <p className="text-xs text-gray-500 mt-0.5 line-clamp-1 sm:line-clamp-none leading-relaxed">
                              {addon.description}
                            </p>
                          )}
                        </div>

                        {/* Price + Checkbox */}
                        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                          <span className="text-sm font-bold text-[#1d242d]">
                            +{formatINR(addon.price)}
                          </span>
                          <div
                            className={`w-5 h-5 sm:w-6 sm:h-6 rounded-md border-2 flex items-center justify-center transition-all ${
                              isSelected
                                ? "bg-blue-600 border-blue-600"
                                : "border-gray-300 bg-white"
                            }`}
                          >
                            {isSelected && (
                              <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Selected addons summary */}
                {selectedAddons.length > 0 && (
                  <div className="mt-4 p-3 rounded-lg bg-blue-50 border border-blue-100">
                    <p className="text-xs font-medium text-blue-700">
                      {selectedAddons.length} add-on{selectedAddons.length > 1 ? "s" : ""} selected &middot; Additional {formatINR(
                        service.addons
                          .filter((a: any) => selectedAddons.includes(a.id))
                          .reduce((sum: number, a: any) => sum + (Number(a.price) || 0), 0)
                      )}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* FAQs */}
            {service.faqs && service.faqs.length > 0 && (
              <div className="mb-12">
                <h2 className="text-xl sm:text-2xl font-bold text-[#1d242d] mb-6 flex items-center gap-3">
                  <span className="w-1 h-7 bg-blue-600 rounded-full" />
                  Common Questions
                </h2>
                <div className="space-y-3">
                  {service.faqs.map((faq: any, i: number) => {
                    const isOpen = openFaq === i
                    return (
                      <div
                        key={i}
                        className={`rounded-xl border transition-all ${
                          isOpen
                            ? "border-blue-200 bg-blue-50/30"
                            : "border-gray-100 bg-white hover:border-gray-200"
                        }`}
                      >
                        <button
                          onClick={() => setOpenFaq(isOpen ? null : i)}
                          className="w-full flex items-center justify-between gap-4 text-left px-5 py-4"
                        >
                          <span className={`text-sm font-semibold ${isOpen ? "text-blue-700" : "text-[#1d242d]"}`}>
                            {faq.question}
                          </span>
                          {/* <ChevronDown
                            className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                              isOpen ? "rotate-180 text-blue-600" : "text-gray-400"
                            }`}
                          /> */}
                        </button>
                        {isOpen && (
                          <div className="px-5 pb-4 -mt-1">
                            <p className="text-sm text-gray-500 leading-relaxed">
                              {faq.answer}
                            </p>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* ============ SIDEBAR ============ */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="lg:sticky lg:top-24 space-y-5">
              {/* Booking Card */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-gray-100/80 overflow-hidden">
                {/* Price Header */}
                <div className="p-5 sm:p-6 pb-0">
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-2">
                    Total Estimate
                  </p>
                  <div className="flex items-baseline gap-3 flex-wrap">
                    <span className="text-3xl sm:text-4xl font-bold text-[#1d242d]">
                      {formatINR(totalPrice)}
                    </span>
                    {discountPercent > 0 && (
                      <>
                        <span className="text-base text-gray-400 line-through">
                          {formatINR(service.originalPrice)}
                        </span>
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md">
                          SAVE {discountPercent}%
                        </span>
                      </>
                    )}
                  </div>
                  {/* <p className="text-[11px] text-gray-400 mt-1.5">Taxes & fees included</p> */}

                  {/* Price breakdown when addons selected */}
                  {selectedAddons.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-100 space-y-1.5">
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Base service</span>
                        <span className="font-medium">{formatINR(service.price)}</span>
                      </div>
                      {service.addons
                        .filter((a: any) => selectedAddons.includes(a.id))
                        .map((a: any) => (
                          <div key={a.id} className="flex justify-between text-xs text-gray-500">
                            <span className="truncate max-w-[160px]">{a.title}</span>
                            <span className="font-medium">{formatINR(a.price)}</span>
                          </div>
                        ))}
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="p-5 sm:p-6 space-y-5">
                  <div className="space-y-3 py-4 border-y border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5 text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">Date</span>
                      </div>
                      <span className="text-sm font-semibold text-[#1d242d]">Choose at booking</span>
                    </div>
                    {/* <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5 text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">Duration</span>
                      </div>
                      <span className="text-sm font-semibold text-[#1d242d]">{service.duration}</span>
                    </div> */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5 text-gray-500">
                        <Truck className="w-4 h-4" />
                        <span className="text-sm">Visit Fee</span>
                      </div>
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                        FREE
                      </span>
                    </div>
                  </div>

                  {/* CTA */}
                  <button
                    onClick={() => {
                      if (!token) {
                        toast.info("Please login to book a service")
                        router.push("/auth")
                        return
                      }
                      const query = new URLSearchParams()
                      if (selectedAddons.length > 0) query.set("addons", JSON.stringify(selectedAddons))
                      query.set("total", String(totalPrice))
                      router.push(`/services/${service.id}/booking?${query.toString()}`)
                    }}
                    className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-md shadow-blue-200 active:scale-[0.98]"
                  >
                    Book Appointment
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  {/* Trust Badges */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 rounded-xl p-3 flex flex-col items-center gap-1.5 text-center border border-gray-100">
                      <CheckCircle2 className="w-4 h-4 text-blue-600" />
                      <span className="text-[10px] font-semibold text-gray-500">Secure Payment</span>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3 flex flex-col items-center gap-1.5 text-center border border-gray-100">
                      <ThumbsUp className="w-4 h-4 text-blue-600" />
                      <span className="text-[10px] font-semibold text-gray-500">Satisfaction Guarantee</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Assistance Card */}
              <div className="bg-[#1d242d] rounded-2xl p-6 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-12 -mt-12" />
                <div className="relative z-10 flex items-start gap-4">
                  <div className="w-11 h-11 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                    <Headphones className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold mb-0.5">Need Assistance?</h3>
                    <p className="text-gray-400 text-xs mb-3">Our experts are available 24/7</p>
                    <a
                      href="tel:+919824897099"
                      className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      +91 982 489 7099
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
