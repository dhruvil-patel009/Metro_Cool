"use client"

import { ShoppingCart, Star, Check, Heart } from "lucide-react"
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
  const [addedIds, setAddedIds]       = useState<Set<string>>(new Set())

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
    const price    = product.capacity_prices?.[0]?.price ?? product.price
    addToCart({ id: product.id, title: product.title, image: product.main_image || "/placeholder.svg", capacity, price: Number(price), qty: 1 })
    setAddedIds(prev => new Set([...prev, product.id]))
    setTimeout(() => setAddedIds(prev => { const n = new Set(prev); n.delete(product.id); return n }), 2000)
    toast.success(`${product.title} added to cart!`)
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <main className="container mx-auto px-4 py-6">

        {/* Breadcrumb */}
        <nav className="text-xs text-slate-400 mb-6">
          <Link href="/" className="hover:text-slate-600">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-slate-900 font-medium">Air Conditioners</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* SIDEBAR */}
          <aside className="lg:w-64 shrink-0 space-y-5">
            <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm">
              <h3 className="font-bold text-sm mb-4 text-slate-800">Filter by Brand</h3>
              <div className="space-y-3">
                {brands.map(brand => (
                  <label key={brand} className="flex items-center gap-3 cursor-pointer group">
                    <div
                      onClick={() => toggleBrand(brand)}
                      className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                        selectedBrands.includes(brand)
                          ? "bg-blue-600 border-blue-600"
                          : "border-slate-300 hover:border-blue-400"
                      }`}
                    >
                      {selectedBrands.includes(brand) && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <span className="text-sm text-slate-600 group-hover:text-slate-900">{brand}</span>
                  </label>
                ))}
                {brands.length === 0 && <p className="text-xs text-slate-400">No brands available</p>}
              </div>
            </div>

            <button
              onClick={() => router.push("/checkout")}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-blue-700 transition-all"
            >
              <ShoppingCart className="w-4 h-4" />
              Go to Checkout
            </button>
          </aside>

          {/* MAIN */}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Air Conditioners</h1>
                <p className="text-sm text-slate-500 mt-0.5">{filteredProducts.length} products found</p>
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-xl border p-16 text-center">
                <ShoppingCart className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="font-semibold text-gray-600">No products found</p>
                <p className="text-sm text-gray-400 mt-1">Try removing some filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product: any) => {
                  const isAdded = addedIds.has(product.id)
                  return (
                    <Link
                      key={product.id}
                      href={`/products/${product.id}`}
                      className="group relative h-[440px] bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
                    >
                      {/* Image */}
                      <div className="absolute inset-0">
                        <img
                          src={product.main_image || "/placeholder.svg"}
                          alt={product.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                      </div>

                      {/* Badge */}
                      <div className="relative p-4 flex justify-between items-start">
                        {product.badge && (
                          <span className="px-3 py-1 bg-blue-600 text-white text-[10px] font-bold rounded-full uppercase tracking-wide">
                            {product.badge}
                          </span>
                        )}
                        <button
                          onClick={e => { e.preventDefault(); e.stopPropagation() }}
                          className="ml-auto p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-red-500 transition"
                        >
                          <Heart className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Content */}
                      <div className="absolute bottom-0 left-0 right-0 p-5">
                        <div className="flex items-center gap-1 mb-2">
                          {[1,2,3,4,5].map(s => (
                            <Star key={s} className={`w-3 h-3 ${s <= Math.floor(product.rating || 0) ? "fill-amber-400 text-amber-400" : "text-white/30"}`} />
                          ))}
                          <span className="text-xs text-white/70 ml-1">({product.review_count || 0})</span>
                        </div>
                        <h3 className="font-bold text-lg text-white mb-1 line-clamp-1">{product.title}</h3>
                        <p className="text-xs text-white/60 mb-4 line-clamp-2">{product.short_desc}</p>

                        <div className="flex items-center justify-between">
                          <div>
                            {product.old_price && (
                              <span className="text-xs text-white/40 line-through block">
                                {formatINR(Number(product.old_price))}
                              </span>
                            )}
                            <span className="text-xl font-bold text-white">
                              {formatINR(Number(product.price))}
                            </span>
                          </div>

                          <button
                            onClick={e => handleAddToCart(e, product)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                              isAdded
                                ? "bg-emerald-500 text-white"
                                : "bg-blue-600 hover:bg-blue-700 text-white"
                            }`}
                          >
                            {isAdded
                              ? <><Check className="w-4 h-4" /> Added</>
                              : <><ShoppingCart className="w-4 h-4" /> Add</>}
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
