"use client"

import Link from "next/link"
import Image from "next/image"
import { ChevronRight, ArrowUpRight, Star } from "lucide-react"
import { getServices, ServiceDTO } from "../lib/services.api"
import { formatINR } from "@/app/lib/currency"
import { useQuery } from "@tanstack/react-query"

/* ================= SERVICES TYPE ================= */

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

/* ================= PRODUCTS TYPE ================= */

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

export function ProductsSection() {

/* =========================================================
   SERVICES FETCH (React Query — cached + fast)
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
    staleTime: 60 * 1000, // 1 minute — services don't change often
  })

/* =========================================================
   PRODUCTS FETCH (React Query — cached + fast)
========================================================= */

  const { data: products = [], isLoading: productLoading } = useQuery<UIProduct[]>({
    queryKey: ["home-products"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/products`
      )
      if (!res.ok) throw new Error("Failed to fetch products")
      const data = await res.json()
      return [...data].reverse()
    },
    staleTime: 60 * 1000, // 1 minute cache
  })

/* =========================================================
   UI
========================================================= */

  return (
    <>

{/* ================= SERVICES SECTION ================= */}

<h2 className="text-2xl md:text-4xl font-bold mb-2 text-center pt-12">
  Featured Services
</h2>

<div className="grid grid-cols-1 pt-12 pb-10 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

{services.slice(0, 3).map((service) => (
  <div
    key={service.id}
    className="group overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md"
  >
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

    <div className="p-6">
      <div className="mb-2 text-[10px] uppercase tracking-widest text-gray-400 font-bold">
        {service.category}
      </div>

      <h3 className="mb-2 text-lg font-bold text-slate-900">
        {service.title}
      </h3>

      <p className="mb-4 text-sm leading-relaxed text-slate-600 line-clamp-2">
        {service.shortDescription}
      </p>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1">
          <span className="text-lg font-bold text-slate-900">
            {formatINR(service.price)}
          </span>
          <span className="text-xs text-gray-400 line-through">
            {formatINR(service.originalPrice)}
          </span>
        </div>

        <div className="flex items-center gap-1 text-xs text-gray-500">
          <span className="text-yellow-400">★</span>
          <span className="font-semibold">{service.rating}</span>
        </div>
      </div>

      <Link
        href={`/services/${service.id}`}
        className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
      >
        View Details
        <ChevronRight className="h-4 w-4" />
      </Link>
    </div>
  </div>
))}

</div>

{services.length > 3 && (
  <div className="text-center pb-24 mt-10">
    <Link
      href="/services"
      className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition duration-200"
    >
      See More Services
    </Link>
  </div>
)}

{/* ================= PRODUCTS SECTION ================= */}

<section className="py-12 sm:py-16 bg-[#f9fafb]">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

    <div className="text-center mb-8 sm:mb-12">
      <h2 className="text-2xl md:text-4xl font-bold mb-2">
        Featured Products
      </h2>
      <p className="text-gray-500 text-sm sm:text-base">
        Genuine parts and top-rated appliances
      </p>
    </div>

    {/* PRODUCT GRID */}
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">

      {products.slice(0, 4).map((product) => {
        const discount = product.old_price && Number(product.old_price) > Number(product.price)
          ? Math.round(((Number(product.old_price) - Number(product.price)) / Number(product.old_price)) * 100)
          : 0
        const savings = product.old_price ? Number(product.old_price) - Number(product.price) : 0

        return (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            className="group relative bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-gray-100 hover:border-blue-200 hover:shadow-xl transition-all duration-300 flex flex-col"
          >
            {/* Image */}
            <div className="relative aspect-square overflow-hidden bg-gray-50">
              <img
                src={product.main_image || "/placeholder.svg"}
                alt={product.title}
                className="w-full h-full object-contain p-3 sm:p-4 transition-transform duration-500 group-hover:scale-105"
              />
              {/* Discount Badge */}
              {discount > 0 && (
                <div className="absolute top-0 left-0">
                  <div className="bg-[#cc0c39] text-white text-[10px] sm:text-xs font-bold px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-br-lg shadow-sm">
                    {discount}% OFF
                  </div>
                </div>
              )}
              {product.badge && !discount && (
                <div className="absolute top-0 left-0">
                  <div className="text-white text-[10px] font-bold px-2 py-1 rounded-br-lg shadow-sm"
                    style={{ backgroundColor: product.badge_color || "#2563eb" }}>
                    {product.badge}
                  </div>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-3 sm:p-4 flex flex-col flex-1">
              {/* Brand */}
              {product.brand && (
                <p className="text-[10px] sm:text-[11px] text-blue-600 font-semibold uppercase tracking-wide mb-1">
                  {product.brand}
                </p>
              )}

              {/* Title */}
              <h3 className="font-semibold text-xs sm:text-sm text-gray-900 mb-1.5 line-clamp-2 leading-snug group-hover:text-blue-700 transition-colors">
                {product.title}
              </h3>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-2">
                <div className="flex items-center gap-0.5 bg-green-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                  <span>{Number(product.rating || 0).toFixed(1)}</span>
                  <Star className="w-2.5 h-2.5 fill-white" />
                </div>
                <span className="text-[10px] sm:text-xs text-gray-400">
                  ({product.review_count || 0})
                </span>
              </div>

              {/* Pricing */}
              <div className="mt-auto space-y-0.5">
                <div className="flex items-baseline gap-1.5 flex-wrap">
                  <span className="text-base sm:text-lg font-bold text-gray-900">
                    ₹{Number(product.price).toLocaleString("en-IN")}
                  </span>
                  {product.old_price && Number(product.old_price) > Number(product.price) && (
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
        )
      })}

    </div>

    {/* VIEW ALL BUTTON */}
    {products.length > 4 && (
      <div className="text-center mt-10 sm:mt-12">
        <Link
          href="/products"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-7 py-3 rounded-lg shadow-md transition duration-200"
        >
          View All Products
        </Link>
      </div>
    )}

  </div>
</section>

    </>
  )
}