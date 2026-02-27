"use client"
import { useEffect, useState } from "react"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { ProductCard } from "./ui/product-card"
import { products } from "../lib/data"
import Image from "next/image"
import { ChevronRight, ArrowUpRight } from "lucide-react"
import { getServices, ServiceDTO } from "../lib/services.api"
import { formatINR } from "@/app/lib/currency"

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

export function ProductsSection() {

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

  // const productsSchema = {
  //   "@context": "https://schema.org",
  //   "@type": "ItemList",
  //   name: "Featured Air Conditioning Products",
  //   itemListElement: products.map((product, index) => ({
  //     "@type": "Product",
  //     position: index + 1,
  //     name: product.title,
  //     image: product.image,
  //     description: product.description,
  //     brand: {
  //       "@type": "Brand",
  //       name: product.brand || "Metro Cool",
  //     },
  //     offers: {
  //       "@type": "Offer",
  //       priceCurrency: "USD",
  //       price: product.price,
  //       availability: "https://schema.org/InStock",
  //     },
  //   })),
  // }

  return (
    <>
    <h2 className="text-2xl md:text-4xl
 font-bold mb-2 text-center pt-12">Featured Services</h2>
    <div className="grid grid-cols-1 pt-12 pb-10 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  
  {services.slice(0, 3).map((service) => (
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
          href={`/user/services/${service.id}`}
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

{/* See More Button */}
{services.length > 3 && (
  <div className="text-center pb-24 mt-10">
    <Link
      href="/user/services"
      className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition duration-200"
    >
      See More Services
    </Link>
  </div>
)}
    <section className="py-8 bg-[#f9fafb]" aria-labelledby="featured-products-heading">
       {/* <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productsSchema),
        }}
      /> */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div className="m-auto">
            <h2 className="text-2xl md:text-4xl
 font-bold mb-2">Featured Products</h2>
            <p className="text-gray-500 text-center">Genuine parts and top-rated appliances</p>
          </div>
          <Link href="/user/products" className="text-blue-600 font-bold text-sm flex items-center gap-1">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <ProductCard key={index} {...product} />
          ))}
        </div>
      </div>
    </section>
    </>
  )
}
