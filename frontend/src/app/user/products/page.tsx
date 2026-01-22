"use client"

import { ShoppingCart, ChevronDown, Star, Heart } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function ProductsPage() {
  /* ---------------- STATE ---------------- */
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // ✅ SHOW ALL PRODUCTS BY DEFAULT
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])

  // ✅ FIXED PRICE RANGE (SUPPORT REAL PRICES)
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 })

  /* ---------------- FETCH PRODUCTS ---------------- */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/products`
        )

        if (!res.ok) throw new Error("Failed to fetch products")

        const data = await res.json()
        setProducts(data)
      } catch (error) {
        console.error("❌ Product fetch error:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  /* ---------------- FILTER LOGIC ---------------- */
  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand)
        ? prev.filter((b) => b !== brand)
        : [...prev, brand]
    )
  }

  const filteredProducts = products.filter(
    (product) =>
      (selectedBrands.length === 0 ||
        selectedBrands.includes(product.brand)) &&
      Number(product.price) >= priceRange.min &&
      Number(product.price) <= priceRange.max
  )

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-lg font-semibold">
        Loading products...
      </div>
    )
  }

  /* ---------------- DYNAMIC BRAND LIST ---------------- */
  const brands = Array.from(
    new Set(products.map((p) => p.brand).filter(Boolean))
  )

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <main className="container mx-auto px-4 py-6 animate-fade-in">

        {/* Breadcrumbs */}
        <nav className="text-xs text-slate-400 mb-6">
          <Link href="/" className="hover:text-slate-600">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-slate-900 font-medium">Products</span>
          <span className="mx-2">/</span>
          <span className="text-slate-900 font-medium">Air Conditioners</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* SIDEBAR */}
          <aside className="lg:w-64 shrink-0 flex flex-col gap-6">

            {/* Brands */}
            <div className="bg-white rounded-md border border-slate-100 p-5 shadow-sm">
              <h3 className="font-bold text-sm mb-4">Brands</h3>
              <div className="space-y-3">
                {brands.map((brand) => (
                  <label key={brand} className="flex items-center gap-3 cursor-pointer group">
                    <div
                      onClick={() => toggleBrand(brand)}
                      className={`w-4 h-4 rounded border flex items-center justify-center ${
                        selectedBrands.includes(brand)
                          ? "bg-blue-600 border-blue-600"
                          : "border-slate-300"
                      }`}
                    >
                      {selectedBrands.includes(brand) && (
                        <div className="w-1.5 h-1.5 bg-white rounded-full" />
                      )}
                    </div>
                    <span className="text-sm text-slate-600">{brand}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* MAIN CONTENT */}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold mb-1">
                  Air Conditioners
                </h1>
                <p className="text-sm text-slate-500">
                  Showing {filteredProducts.length} products
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-400">Sort by:</span>
                <button className="flex items-center gap-4 bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm font-medium">
                  Recommended
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* PRODUCT GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product: any) => (
                <Link
                  key={product.id}
                  href={`/user/products/${product.id}`}
                  className="group relative h-[450px] bg-white rounded-md overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
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
                  <div className="relative h-full p-6 flex flex-col justify-between pointer-events-none">

                    {/* BADGE */}
                    <div className="flex justify-between items-start pointer-events-auto">
                      {product.badge && (
                        <span
                          className={`px-3 py-1.5 ${product.badge_color} text-white text-[10px] font-bold rounded-full uppercase tracking-widest`}
                        >
                          {product.badge}
                        </span>
                      )}
                      <button className="p-2.5 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-red-500">
                        <Heart className="w-5 h-5" />
                      </button>
                    </div>

                    {/* DETAILS */}
                    <div className="pointer-events-auto">
                      <div className="flex items-center gap-1 mb-2">
                        {[1, 2, 3, 4, 5].map((s) => (
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
                          ({Number(product.rating || 0).toFixed(1)} · {product.review_count || 0})
                        </span>
                      </div>

                      <h3 className="font-bold text-xl text-white mb-2">
                        {product.title}
                      </h3>

                      <p className="text-xs text-white/70 mb-6 line-clamp-2">
                        {product.short_desc}
                      </p>

                      <div className="flex justify-between items-center">
                        <div>
                          {product.old_price && (
                            <span className="text-xs text-white/40 line-through">
                              ${Number(product.old_price).toFixed(2)}
                            </span>
                          )}
                          <div className="text-2xl font-bold text-white">
                            ${Number(product.price).toFixed(2)}
                          </div>
                        </div>

                        <button className="bg-blue-600 p-3 rounded-md hover:bg-blue-700">
                          <ShoppingCart className="w-6 h-6 text-white" />
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
