"use client"

import { ShoppingCart, Star, Check, Heart, SlidersHorizontal, X } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { formatINR } from "@/app/lib/currency"
import { useCart } from "@/app/context/CartContext"
import { toast } from "react-toastify"
import { useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"

export default function ProductsPage() {
  const { addToCart } = useCart()
  const router = useRouter()

  const { data: products = [], isLoading: loading } = useQuery<any[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/products`)
      if (!res.ok) throw new Error("Failed to load products")
      const data = await res.json()
      return Array.isArray(data) ? data : []
    },
    staleTime: 60 * 1000,
  })

  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set())
  const [showMobileFilter, setShowMobileFilter] = useState(false)

  const toggleBrand = (brand: string) =>
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    )

  const filteredProducts = products.filter(p =>
    selectedBrands.length === 0 || selectedBrands.includes(p.brand)
  )

  const brands = Array.from(new Set(products.map(p => p.brand).filter(Boolean)))

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.preventDefault()
    e.stopPropagation()
    const capacity = product.capacity_prices?.[0]?.capacity || "1.5 Ton"
    const price = product.capacity_prices?.[0]?.price ?? product.price
    addToCart({ id: product.id, title: product.title, image: product.main_image || "/placeholder.svg", capacity, price: Number(price), qty: 1 })
    setAddedIds(prev => new Set([...prev, product.id]))
    setTimeout(() => setAddedIds(prev => { const n = new Set(prev); n.delete(product.id); return n }), 2000)
    toast.success(`${product.title} added to cart!`)
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="loader-wrapper">
          <div className="loader"></div>
        </div>
      </div>
    )
  }

  /* ===== FILTER SIDEBAR CONTENT (shared between desktop & mobile) ===== */
  const FilterContent = () => (
    <div className="space-y-5">
      <div>
        <h3 className="font-bold text-sm mb-4 text-gray-800">Filter by Brand</h3>
        <div className="space-y-3">
          {brands.map(brand => (
            <label key={brand} className="flex items-center gap-3 cursor-pointer group">
              <div
                onClick={() => toggleBrand(brand)}
                className={`w-[18px] h-[18px] rounded border-2 flex items-center justify-center transition-all ${
                  selectedBrands.includes(brand)
                    ? "bg-blue-600 border-blue-600"
                    : "border-gray-300 group-hover:border-blue-400"
                }`}
              >
                {selectedBrands.includes(brand) && <Check className="w-3 h-3 text-white" />}
              </div>
              <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">{brand}</span>
            </label>
          ))}
          {brands.length === 0 && <p className="text-xs text-gray-400">No brands available</p>}
        </div>
      </div>

      {selectedBrands.length > 0 && (
        <button
          onClick={() => setSelectedBrands([])}
          className="text-xs text-blue-600 hover:text-blue-700 font-medium"
        >
          Clear all filters
        </button>
      )}

      <button
        onClick={() => router.push("/checkout")}
        className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-blue-700 transition-all shadow-sm shadow-blue-200"
      >
        <ShoppingCart className="w-4 h-4" />
        Go to Checkout
      </button>
    </div>
  )

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

        {/* Breadcrumb */}
        <nav className="text-xs text-gray-400 mb-6">
          <Link href="/" className="hover:text-gray-600 transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">Air Conditioners</span>
        </nav>

        {/* Page Header */}
        <div className="flex items-center justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1d242d]">Air Conditioners</h1>
            <p className="text-sm text-gray-500 mt-1">{filteredProducts.length} products found</p>
          </div>

          {/* Mobile filter toggle */}
          <button
            onClick={() => setShowMobileFilter(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">

          {/* DESKTOP SIDEBAR */}
          <aside className="hidden lg:block lg:w-60 xl:w-64 shrink-0">
            <div className="sticky top-28 bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <FilterContent />
            </div>
          </aside>

          {/* MOBILE FILTER DRAWER */}
          {showMobileFilter && (
            <div className="fixed inset-0 z-50 lg:hidden">
              {/* Backdrop */}
              <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={() => setShowMobileFilter(false)}
              />
              {/* Drawer */}
              <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 pt-4 max-h-[70vh] overflow-y-auto animate-slide-up">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-lg font-bold text-gray-900">Filters</h2>
                  <button
                    onClick={() => setShowMobileFilter(false)}
                    className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
                <FilterContent />
              </div>
            </div>
          )}

          {/* PRODUCT GRID */}
          <div className="flex-1 min-w-0">
            {filteredProducts.length === 0 ? (
              <div className="bg-gray-50 rounded-2xl border border-gray-100 p-12 sm:p-16 text-center">
                <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="font-semibold text-gray-700 text-lg">No products found</p>
                <p className="text-sm text-gray-400 mt-2">Try removing some filters to see more results</p>
                {selectedBrands.length > 0 && (
                  <button
                    onClick={() => setSelectedBrands([])}
                    className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
                {filteredProducts.map((product: any) => {
                  const isAdded = addedIds.has(product.id)
                  return (
                    <Link
                      key={product.id}
                      href={`/products/${product.id}`}
                      className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300"
                    >
                      {/* Image Container */}
                      <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
                        <img
                          src={product.main_image || "/placeholder.svg"}
                          alt={product.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />

                        {/* Badge */}
                        {product.badge && (
                          <span className="absolute top-3 left-3 px-2.5 py-1 bg-blue-600 text-white text-[10px] font-bold rounded-lg uppercase tracking-wide shadow-sm">
                            {product.badge}
                          </span>
                        )}

                        {/* Wishlist */}
                        <button
                          onClick={e => { e.preventDefault(); e.stopPropagation() }}
                          className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-white transition-all shadow-sm"
                        >
                          <Heart className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Content */}
                      <div className="p-4 sm:p-5">
                        {/* Rating */}
                        <div className="flex items-center gap-1 mb-2">
                          {[1, 2, 3, 4, 5].map(s => (
                            <Star
                              key={s}
                              className={`w-3.5 h-3.5 ${
                                s <= Math.floor(product.rating || 0)
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-gray-200"
                              }`}
                            />
                          ))}
                          <span className="text-xs text-gray-400 ml-1">
                            ({product.review_count || 0})
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="font-bold text-[15px] text-gray-900 mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">
                          {product.title}
                        </h3>

                        {/* Description */}
                        <p className="text-xs text-gray-400 mb-4 line-clamp-2 leading-relaxed">
                          {product.short_desc}
                        </p>

                        {/* Price & CTA */}
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            {product.old_price && (
                              <span className="text-xs text-gray-400 line-through block leading-tight">
                                {formatINR(Number(product.old_price))}
                              </span>
                            )}
                            <span className="text-lg font-bold text-[#1d242d]">
                              {formatINR(Number(product.price))}
                            </span>
                          </div>

                          <button
                            onClick={e => handleAddToCart(e, product)}
                            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-semibold text-xs transition-all ${
                              isAdded
                                ? "bg-emerald-500 text-white shadow-sm shadow-emerald-200"
                                : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-200"
                            }`}
                          >
                            {isAdded
                              ? <><Check className="w-3.5 h-3.5" /> Added</>
                              : <><ShoppingCart className="w-3.5 h-3.5" /> Add</>}
                          </button>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
