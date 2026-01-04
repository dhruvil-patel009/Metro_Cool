"use client"

import { ShoppingCart, ChevronDown, Star, Heart } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { products } from "../lib/product-data"

export default function ProductsPage() {
  const [selectedBrands, setSelectedBrands] = useState<string[]>(["Samsung"])
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1500 })

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) => (prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]))
  }

  const filteredProducts = products.filter(
    (product) =>
      (selectedBrands.length === 0 || selectedBrands.includes(product.brand)) &&
      product.price >= priceRange.min &&
      product.price <= priceRange.max,
  )

  return (
    <div className="min-h-screen bg-[#F8FAFC]">

      <main className="container mx-auto px-4 py-6 animate-fade-in">
        {/* Breadcrumbs */}
        <nav className="text-xs text-slate-400 mb-6">
          <Link href="/" className="hover:text-slate-600">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-slate-900 font-medium">Products</span>
          <span className="mx-2">/</span>
          <span className="text-slate-900 font-medium">Air Conditioners</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-64 shrink-0 flex flex-col gap-6">
            {/* Categories */}
            <div className="bg-white rounded-md border border-slate-100 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-4 h-4 bg-blue-600 rounded-sm"></div>
                <h3 className="font-bold text-sm">Categories</h3>
              </div>
              <ul className="space-y-3">
                {[
                  { name: "Air Conditioners", count: 24, active: true },
                  { name: "Refrigerators", count: 12 },
                  { name: "Air Purifiers", count: 8 },
                  { name: "Parts & Remotes", count: 45 },
                ].map((cat) => (
                  <li
                    key={cat.name}
                    className={`flex items-center justify-between text-sm cursor-pointer ${cat.active ? "text-blue-600 font-semibold" : "text-slate-500 hover:text-slate-800"}`}
                  >
                    <span>{cat.name}</span>
                    <span className="text-xs opacity-60">{cat.count}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Price Range */}
            <div className="bg-white rounded-md border border-slate-100 p-5 shadow-sm">
              <h3 className="font-bold text-sm mb-4">Price Range</h3>
              <div className="px-1 mb-6">
                <div className="h-1 bg-blue-100 rounded-full relative">
                  <div className="absolute left-0 right-1/4 h-full bg-blue-600 rounded-full"></div>
                  <div className="absolute right-1/4 top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-blue-600 rounded-full cursor-pointer shadow-sm"></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase font-bold">Min</label>
                  <div className="border border-slate-200 rounded-lg p-2 text-sm font-semibold">${priceRange.min}</div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase font-bold">Max</label>
                  <div className="border border-slate-200 rounded-lg p-2 text-sm font-semibold">${priceRange.max}</div>
                </div>
              </div>
            </div>

            {/* Brands */}
            <div className="bg-white rounded-md border border-slate-100 p-5 shadow-sm">
              <h3 className="font-bold text-sm mb-4">Brands</h3>
              <div className="space-y-3">
                {["Samsung", "LG", "Daikin", "Voltas", "Blue Star", "Carrier"].map((brand) => (
                  <label key={brand} className="flex items-center gap-3 cursor-pointer group">
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${selectedBrands.includes(brand) ? "bg-blue-600 border-blue-600" : "border-slate-300 group-hover:border-blue-400"}`}
                      onClick={() => toggleBrand(brand)}
                    >
                      {selectedBrands.includes(brand) && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                    </div>
                    <span className="text-sm text-slate-600">{brand}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold mb-1">Air Conditioners</h1>
                <p className="text-sm text-slate-500">Showing {filteredProducts.length} results for "Split AC"</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-400">Sort by:</span>
                <button className="flex items-center gap-4 bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm font-medium">
                  Recommended
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/User/products/${product.id}`}
                  className="group relative h-[450px] bg-white rounded-md overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  <div className="absolute inset-0">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                  </div>

                  {/* Badges & Actions */}
                  <div className="relative h-full p-6 flex flex-col justify-between pointer-events-none">
                    <div className="flex justify-between items-start pointer-events-auto">
                      {product.badge && (
                        <span
                          className={`px-3 py-1.5 ${product.badgeColor} text-white text-[10px] font-bold rounded-full uppercase tracking-widest`}
                        >
                          {product.badge}
                        </span>
                      )}
                      <button className="p-2.5 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-red-500 transition-all">
                        <Heart className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="pointer-events-auto">
                      <div className="flex items-center gap-1 mb-2">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-3.5 h-3.5 ${s <= Math.floor(product.rating) ? "fill-amber-400 text-amber-400" : "text-white/30"}`}
                          />
                        ))}
                        <span className="text-xs text-white/70 ml-1">({product.rating.toFixed(1)})</span>
                      </div>

                      <h3 className="font-bold text-xl text-white mb-2">{product.name}</h3>
                      <p className="text-xs text-white/70 mb-6 line-clamp-2 leading-relaxed">{product.shortDesc}</p>

                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          {product.oldPrice && (
                            <span className="text-xs text-white/40 line-through">${product.oldPrice.toFixed(2)}</span>
                          )}
                          <span className="text-2xl font-bold text-white">${product.price.toFixed(2)}</span>
                        </div>

                        <button className="bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20">
                          <ShoppingCart className="w-6 h-6" />
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Load More Button */}
            <div className="flex justify-center mt-12 mb-8">
              <button className="bg-white border border-slate-200 rounded-md px-12 py-3.5 text-sm font-bold shadow-sm hover:bg-slate-50 transition-colors">
                Load More Products
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
