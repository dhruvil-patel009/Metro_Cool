"use client"

import Link from "next/link"
import Image from "next/image"
import { ChevronRight, ArrowUpRight, Star, ShoppingBag, ArrowRight } from "lucide-react"
import { getServices, ServiceDTO } from "../lib/services.api"
import { formatINR } from "@/app/lib/currency"
import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"

/* ================= TYPES ================= */

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
  badgeColor?: string
}

type UIProduct = {
  id: string
  title: string
  short_desc: string
  price: number
  old_price?: number
  main_image: string
  rating?: number
  review_count?: number
  brand?: string
  badge?: string
  badge_color?: string
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
}

export function ProductsSection() {
  /* =========================================================
     SERVICES FETCH
  ========================================================= */
  const { data: services = [], isLoading: loading } = useQuery<UIService[]>({
    queryKey: ["home-services"],
    queryFn: async () => {
      const data: ServiceDTO[] = await getServices()
      return data.map((service) => ({
        id: service.id,
        title: service.title,
        category: service.category,
        price: service.price,
        originalPrice: service.price + 20,
        shortDescription: service.short_description,
        thumbnailImage: service.image_url || "/placeholder.svg",
        rating: service.rating ?? 0,
        badge: service.badge || undefined,
        badgeColor: service.badge_color || "#2563eb",
      }))
    },
    staleTime: 60 * 1000,
  })

  /* =========================================================
     PRODUCTS FETCH
  ========================================================= */
  const { data: products = [], isLoading: productLoading } = useQuery<UIProduct[]>({
    queryKey: ["home-products"],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/products`)
      if (!res.ok) throw new Error("Failed to fetch products")
      const data = await res.json()
      return [...data].reverse()
    },
    staleTime: 60 * 1000,
  })

  /* =========================================================
     UI
  ========================================================= */
  return (
    <>
      {/* ================= SERVICES SECTION ================= */}
      <section className="py-16 sm:py-20 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider mb-4">
              Featured Services
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              Popular Service Bookings
            </h2>
            <p className="text-gray-500 text-sm sm:text-base max-w-lg mx-auto">
              Choose from our most-booked services — transparent pricing, expert technicians
            </p>
          </motion.div>

          {/* Service Cards */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6"
          >
            {services.slice(0, 3).map((service) => (
              <motion.div
                key={service.id}
                variants={cardVariants}
                className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
                  <Image
                    src={service.thumbnailImage}
                    alt={service.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  <Link
                    href={`/services/${service.id}`}
                    className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-gray-700 backdrop-blur-sm transition-all hover:bg-blue-600 hover:text-white shadow-sm"
                  >
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>

                  {service.badge && (
                    <div
                      className="absolute top-3 left-3 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider shadow-sm"
                      style={{ backgroundColor: service.badgeColor }}
                    >
                      {service.badge}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 sm:p-6">
                  <div className="mb-2 text-[10px] uppercase tracking-widest text-gray-400 font-bold">
                    {service.category}
                  </div>

                  <h3 className="mb-2 text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {service.title}
                  </h3>

                  <p className="mb-4 text-sm leading-relaxed text-gray-500 line-clamp-2">
                    {service.shortDescription}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-bold text-gray-900">
                        {formatINR(service.price)}
                      </span>
                      <span className="text-xs text-gray-400 line-through">
                        {formatINR(service.originalPrice)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-xs bg-amber-50 px-2 py-1 rounded-lg">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      <span className="font-semibold text-amber-700">{service.rating}</span>
                    </div>
                  </div>

                  <Link
                    href={`/services/${service.id}`}
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    View Details
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* See More */}
          {services.length > 3 && (
            <div className="text-center mt-10 sm:mt-12">
              <Link
                href="/services"
                className="group inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-7 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
              >
                See All Services
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ================= PRODUCTS SECTION ================= */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold uppercase tracking-wider mb-4">
              <ShoppingBag className="w-3.5 h-3.5" />
              Shop
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              Featured Products
            </h2>
            <p className="text-gray-500 text-sm sm:text-base">
              Genuine parts and top-rated appliances at the best prices
            </p>
          </motion.div>

          {/* Product Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6"
          >
            {products.slice(0, 4).map((product) => {
              const hasValidOldPrice = product.old_price && Number(product.old_price) > 0 && Number(product.old_price) > Number(product.price)
              const discount = hasValidOldPrice
                  ? Math.round(
                      ((Number(product.old_price) - Number(product.price)) /
                        Number(product.old_price)) *
                        100
                    )
                  : 0
              const savings = hasValidOldPrice
                ? Number(product.old_price) - Number(product.price)
                : 0

              return (
                <motion.div key={product.id} variants={cardVariants}>
                  <Link
                    href={`/products/${product.id}`}
                    className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-blue-200 hover:shadow-xl transition-all duration-300 flex flex-col h-full"
                  >
                    {/* Image */}
                    <div className="relative aspect-square overflow-hidden bg-gray-50">
                      <img
                        src={product.main_image || "/placeholder.svg"}
                        alt={product.title}
                        className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                      />
                      {discount > 0 && (
                        <div className="absolute top-0 left-0">
                          <div className="bg-red-500 text-white text-[10px] sm:text-xs font-bold px-2.5 py-1.5 rounded-br-xl shadow-sm">
                            {discount}% OFF
                          </div>
                        </div>
                      )}
                      {product.badge && !discount && (
                        <div className="absolute top-0 left-0">
                          <div
                            className="text-white text-[10px] font-bold px-2.5 py-1.5 rounded-br-xl shadow-sm"
                            style={{ backgroundColor: product.badge_color || "#2563eb" }}
                          >
                            {product.badge}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-3.5 sm:p-4 flex flex-col flex-1">
                      {product.brand && (
                        <p className="text-[10px] sm:text-[11px] text-blue-600 font-semibold uppercase tracking-wide mb-1">
                          {product.brand}
                        </p>
                      )}

                      <h3 className="font-semibold text-xs sm:text-sm text-gray-900 mb-2 line-clamp-2 leading-snug group-hover:text-blue-700 transition-colors">
                        {product.title}
                      </h3>

                      {/* Rating */}
                      <div className="flex items-center gap-1.5 mb-3">
                        <div className="flex items-center gap-0.5 bg-green-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                          <span>{Number(product.rating || 0).toFixed(1)}</span>
                          <Star className="w-2.5 h-2.5 fill-white" />
                        </div>
                        <span className="text-[10px] sm:text-xs text-gray-400">
                          ({product.review_count || 0})
                        </span>
                      </div>

                      {/* Pricing */}
                      <div className="mt-auto space-y-1">
                        <div className="flex items-baseline gap-1.5 flex-wrap">
                          <span className="text-base sm:text-lg font-bold text-gray-900">
                            ₹{Number(product.price).toLocaleString("en-IN")}
                          </span>
                          {hasValidOldPrice && (
                              <span className="text-[10px] sm:text-xs text-gray-400 line-through">
                                ₹{Number(product.old_price).toLocaleString("en-IN")}
                              </span>
                            )}
                        </div>
                        {savings > 0 && (
                          <p className="text-[10px] sm:text-xs text-green-600 font-medium">
                            Save ₹{savings.toLocaleString("en-IN")}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </motion.div>

          {/* View All */}
          {products.length > 4 && (
            <div className="text-center mt-10 sm:mt-12">
              <Link
                href="/products"
                className="group inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-semibold px-7 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
              >
                View All Products
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
