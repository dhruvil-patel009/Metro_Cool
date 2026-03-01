"use client"

import { use, useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  ChevronRight,
  Star,
  Clock,
  UserCheck,
  ShieldCheck,
  Calendar,
  Users,
  Truck,
  Share2,
  Heart,
  SearchCheck,
  Droplets,
  Wind,
  Trash2,
  ChevronDown,
  Headphones,
  CheckCircle2,
  ThumbsUp,
} from "lucide-react"
import {
  getServiceById,
  getServiceIncludes,
  getServiceAddons,
  getServiceFaqs,
  likeService,
} from "../../lib/services.api"
import { Card } from "@/app/components/ui/card"
import { formatINR } from "@/app/lib/currency"

const iconMap = {
  SearchCheck,
  Droplets,
  Wind,
  Trash2,
}

export default function ServiceDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [service, setService] = useState<any>(null)
  const [loading, setLoading] = useState(true)


  /* =========================
     FETCH ALL DATA (NO UI CHANGE)
  ========================= */
  useEffect(() => {
    async function load() {
      try {
        const main = await getServiceById(id)

        const [includes, addons, faqs] = await Promise.all([
          getServiceIncludes(main.category),
          getServiceAddons(main.category),
          getServiceFaqs(main.category),
        ])

        setService({
          ...main,

          /* 🔑 map backend → UI fields */
          longDescription: main.long_description,
          originalPrice:
            main.original_price ??
            main.originalPrice ??
            main.price + 20,
          included: Array.isArray(includes) ? includes : [],
          addons: Array.isArray(addons) ? addons : [],
          faqs: Array.isArray(faqs) ? faqs : [],
        })
      } catch (e) {
        setService(null)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [id])

  /* =========================
     LOADING STATE
  ========================= */
  if (loading) {
    return (
      <div className="loader-wrapper">
  <div className="loader"></div>
</div>
    )
  }

  /* =========================
     NOT FOUND
  ========================= */
  if (!service) {
    return (
      <div className="min-h-screen bg-white">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Service Not Found</h1>
            <Link href="/services" className="text-blue-600 hover:underline">
              Return to Services
            </Link>
          </div>
        </div>
      </div>
    )
  }

  /* =========================
   PAGE (UI 100% SAME)
========================= */

  return (
    <div className="min-h-screen bg-white font-sans text-[#1a1a1a] animate-fade-in">

      <main className="max-w-fit mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-xs text-gray-400 mb-8">
          <Link href="/" className="hover:text-[#0060ff] flex items-center gap-1">
            <Calendar className="w-3 h-3" /> Home
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/services" className="hover:text-[#0060ff]">
            Services
          </Link>
          {/* <ChevronRight className="w-3 h-3" />
          <Link href="/services" className="hover:text-[#0060ff]">
            {service.category}
          </Link> */}
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-900 font-medium text-pretty">{service.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-8">
            {/* Header Section */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                {service.badge && (
                  <span
                    className="text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider border"
                    style={{
                      backgroundColor: service.badge_color,
                      color: "#fff",
                    }}
                  >
                    {service.badge}
                  </span>
                )}
                <div className="flex items-center gap-1 text-sm">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-bold">{service.rating}</span>
                  <span className="text-gray-400 text-xs">{service.reviews} reviews</span>
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight leading-tight">{service.title}</h1>
              <p className="text-gray-500 text-lg leading-relaxed max-w-2xl">{service.longDescription}</p>
            </div>

            {/* Quick Info */}
            <div className="flex flex-wrap gap-8 mb-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#0060ff]">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Duration</p>
                  <p className="font-bold text-sm">{service.duration}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Expertise</p>
                  <p className="font-bold text-sm">{service.expertise}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Warranty</p>
                  <p className="font-bold text-sm">{service.warranty}</p>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative rounded-md overflow-hidden mb-12 group">
              <Image
                src={service.image_url || "/placeholder.svg"}
                alt={service.title}
                width={500}
                height={450}
                className="object-cover transition-transform duration-700 group-hover:scale-105 w-auto"
              />
              <div className="absolute bottom-6 left-6 flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-bold">Available</span>
              </div>
              <div className="absolute top-6 right-6 flex gap-2">
                <button className="p-2.5 bg-white/90 backdrop-blur rounded-full shadow hover:bg-white transition-colors">
                  <Share2 className="w-4 h-4 text-gray-700" />
                </button>
                <button className="group p-2.5 cursor-pointer bg-white/90 backdrop-blur rounded-full shadow hover:bg-white transition-colors">
  <Heart className="w-4 h-4 text-gray-700 fill-transparent group-hover:fill-red-500 group-hover:text-red-500 transition-all" />
</button>

              </div>
            </div>

            {/* What's Included */}
            <div className="mb-16">
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                <span className="w-1.5 h-8 bg-[#0060ff] rounded-full"></span>
                What&apos;s Included
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {service.included.map((item: any, i: number) => {
                  const Icon =
                    iconMap[item.icon as keyof typeof iconMap] || SearchCheck
                  return (
                    <Card key={i}>
                      <div
                        className={`w-12 h-12 rounded-md flex items-center justify-center ${item.color}`}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold mb-1">{item.title}</h3>
                        <p className="text-xs text-gray-400">
                          {item.description}
                        </p>
                      </div>
                    </Card>
                  )
                })}
              </div>
            </div>

            {/* Enhance Your Service */}
            {service.addons.length > 0 && (
              <div className="mb-16">
                <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                  <span className="w-1.5 h-8 bg-[#0060ff] rounded-full"></span>
                  Enhance Your Service
                </h2>
                <div className="space-y-4">
                  {service.addons.map((addon: any, i: number) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-4 rounded-md bg-white border border-gray-100 hover:border-blue-100 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative w-16 h-16 rounded-md overflow-hidden">
                          <Image
                            src={addon.image || "/placeholder.svg"}
                            alt={addon.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold">{addon.title}</h3>
                            {addon.badge && (
                              <span className="text-[8px] bg-blue-50 text-[#0060ff] font-bold px-1.5 py-0.5 rounded uppercase tracking-tighter">
                                {addon.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-gray-400 leading-tight max-w-[180px]">{addon.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-bold text-gray-900">{addon.price}</span>
                        <input
                          type="checkbox"
                          className="w-5 h-5 rounded border-gray-300 text-[#0060ff] focus:ring-[#0060ff]"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Common Questions */}
            {service.faqs.length > 0 && (
              <div className="mb-16">
                <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                  <span className="w-1.5 h-8 bg-[#0060ff] rounded-full"></span>
                  Common Questions
                </h2>
                <div className="space-y-3">
                  {service.faqs.map((faq: any, i: number) => (
                    <div
                      key={i}
                      className="group p-5 rounded-md bg-white border border-gray-100 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-semibold text-gray-700">{faq.question}</span>
                      <ChevronDown className="w-5 h-5 text-gray-400 transition-transform group-hover:translate-y-0.5" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              {/* Booking Card */}
              <div className="bg-white rounded-md border border-gray-100 shadow-xl shadow-gray-100/50 overflow-hidden">
                <div className="p-8 pb-0 flex justify-between items-start">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-2">Total Estimate</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-black font-semibold tracking-tighter">
                          {formatINR(service.price)}

                        <span className="text-2xl">.00</span>
                      </span>
                      <span className="text-gray-400 line-through text-lg">{formatINR(service.originalPrice)}</span>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1">Taxes & fees included</p>
                  </div>
                  <div className="relative">
                    <div className="bg-[#e8f5e9] text-[#2e7d32] text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1">
                      SAVE {service.discount}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rotate-45 transform translate-x-3 translate-y-3"></div>
                  </div>
                </div>

                <div className="p-8 space-y-6">
                  <div className="space-y-4 py-6 border-y border-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-gray-500">
                        <Calendar className="w-5 h-5" />
                        <span className="text-sm font-medium">Date</span>
                      </div>
                      <span className="text-sm font-bold">Tomorrow, 10:00 AM</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-gray-500">
                        <Users className="w-5 h-5" />
                        <span className="text-sm font-medium">Team Size</span>
                      </div>
                      <span className="text-sm font-bold">1 Technician</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-gray-500">
                        <Truck className="w-5 h-5" />
                        <span className="text-sm font-medium">Visit Fee</span>
                      </div>
                      <span className="bg-green-50 text-green-600 text-[10px] font-black px-2 py-0.5 rounded tracking-widest uppercase">
                        Free
                      </span>
                    </div>
                  </div>

                  <Link
                    href={`/services/${service.id}/booking`}
                    className="w-full bg-[#0060ff] text-white py-5 rounded-md font-bold text-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-all active:scale-[0.98] shadow-lg shadow-blue-200"
                  >
                    Book Appointment <ChevronRight className="w-5 h-5" />
                  </Link>

                  <div className="flex gap-3">
                    <div className="flex-1 bg-gray-50 p-4 rounded-md flex flex-col items-center gap-2 text-center">
                      <CheckCircle2 className="w-5 h-5 text-blue-600" />
                      <span className="text-[8px] uppercase tracking-widest font-bold text-gray-500">
                        Secure Payment
                      </span>
                    </div>
                    <div className="flex-1 bg-gray-50 p-4 rounded-md flex flex-col items-center gap-2 text-center">
                      <ThumbsUp className="w-5 h-5 text-blue-600" />
                      <span className="text-[8px] uppercase tracking-widest font-bold text-gray-500">
                        Satisfaction Guarantee
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Assistance Card */}
              <div className="bg-[#111827] rounded-md p-8 text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500"></div>
                <div className="flex items-start gap-4 relative z-10">
                  <div className="w-12 h-12 bg-white/10 rounded-md flex items-center justify-center backdrop-blur-sm">
                    <Headphones className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">Need Assistance?</h3>
                    <p className="text-gray-400 text-xs mb-4">Our experts are here 24/7.</p>
                    <a
                      href="tel:800METRO"
                      className="inline-flex items-center gap-1 text-sm font-bold hover:text-blue-400 transition-colors uppercase tracking-widest"
                    >
                      Call 800-METRO <Share2 className="w-3 h-3 rotate-45" />
                    </a>
                  </div>
                </div>
                <div className="absolute bottom-4 right-4 grid grid-cols-2 gap-1 opacity-20">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
