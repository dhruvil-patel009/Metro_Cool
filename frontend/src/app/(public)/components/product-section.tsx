"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronRight, ArrowRight, ArrowUpRight, Star, ShoppingCart } from "lucide-react"
import { getServices, ServiceDTO } from "../lib/services.api"
import { formatINR } from "@/app/lib/currency"

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
   SERVICES FETCH
========================================================= */

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
          originalPrice: service.price + 20,
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

/* =========================================================
   PRODUCTS FETCH
========================================================= */

  const [products, setProducts] = useState<UIProduct[]>([])
  const [productLoading, setProductLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/products`
        )

        if (!res.ok) throw new Error("Failed to fetch products")

        const data = await res.json()

        // newest first
        const sorted = [...data].reverse()

        setProducts(sorted)
      } catch (err) {
        console.error("❌ Product fetch error:", err)
      } finally {
        setProductLoading(false)
      }
    }

    fetchProducts()
  }, [])

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

<section className="py-16 bg-[#f9fafb]">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

    <div className="text-center mb-12">
      <h2 className="text-2xl md:text-4xl font-bold mb-2">
        Featured Products
      </h2>
      <p className="text-gray-500">
        Genuine parts and top-rated appliances
      </p>
    </div>

    {/* PRODUCT GRID */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

      {products.slice(0, 4).map((product) => (
        <Link
          key={product.id}
          href={`/products/${product.id}`}
          className="group relative h-[420px] bg-white rounded-md overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
        >
          {/* IMAGE */}
          <div className="absolute inset-0">
            <img
              src={product.main_image || "/placeholder.svg"}
              alt={product.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          </div>

          {/* CONTENT */}
          <div className="relative h-full p-5 flex flex-col justify-between pointer-events-none">

            {product.badge && (
              <span
                className="px-3 py-1.5 text-white text-[10px] font-bold rounded-full uppercase tracking-widest absolute top-4 left-4"
                style={{ backgroundColor: product.badge_color || "#2563eb" }}
              >
                {product.badge}
              </span>
            )}

            <div className="pointer-events-auto mt-auto">

              {/* Rating */}
              <div className="flex items-center gap-1 mb-2">
                {[1,2,3,4,5].map((s)=>(
                  <Star
                    key={s}
                    className={`w-3.5 h-3.5 ${
                      s <= Math.floor(product.rating || 0)
                        ? "fill-amber-400 text-amber-400"
                        : "text-white/30"
                    }`}
                  />
                ))}
                <span className="text-xs text-white/70 ml-1">
                  ({Number(product.rating || 0).toFixed(1)})
                </span>
              </div>

              {/* Title */}
              <h3 className="font-bold text-xl text-white mb-2 line-clamp-2">
                {product.title}
              </h3>

              {/* Description */}
              <p className="text-xs text-white/70 mb-5 line-clamp-2">
                {product.short_desc}
              </p>

              {/* Price */}
              <div className="flex justify-between items-center">
                <div>
                  {product.old_price && (
                    <span className="text-xs text-white/40 line-through">
                      ₹{Number(product.old_price).toLocaleString()}
                    </span>
                  )}
                  <div className="text-2xl font-bold text-white">
                    ₹{Number(product.price).toLocaleString()}
                  </div>
                </div>

                <div className="bg-blue-600 p-3 rounded-md hover:bg-blue-700">
                  <ShoppingCart className="w-5 h-5 text-white" />
                </div>
              </div>

            </div>
          </div>
        </Link>
      ))}

    </div>

    {/* VIEW ALL BUTTON */}
    {products.length > 4 && (
      <div className="text-center mt-12">
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