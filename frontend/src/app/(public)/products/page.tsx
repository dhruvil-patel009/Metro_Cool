"use client"

import { ShoppingCart, Star, Check, Heart, SlidersHorizontal, X, ChevronRight, Zap, ArrowUpDown } from "lucide-react"
import Link from "next/link"
import { useState, useMemo } from "react"
import { formatINR } from "@/app/lib/currency"
import { useCart } from "@/app/context/CartContext"
import { useRoomSize } from "@/app/context/RoomSizeContext"
import { useAuthStore } from "@/store/auth.store"
import { toast } from "react-toastify"
import { useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { ACCapacityRecommendation } from "../components/ac-capacity-recommendation"

type SortOption = "relevance" | "price-low" | "price-high" | "rating" | "newest"

export default function ProductsPage() {
  const { addToCart } = useCart()
  const { recommendedCapacity, selectedRoom, clearSelection } = useRoomSize()
  const { token } = useAuthStore()
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
  const [sortBy, setSortBy] = useState<SortOption>("relevance")
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500000])
  const [showSortDropdown, setShowSortDropdown] = useState(false)

  const toggleBrand = (brand: string) =>
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    )

  /* ── Filtering: brand + capacity + price range ── */
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter(p => {
      const brandMatch = selectedBrands.length === 0 || selectedBrands.includes(p.brand)
      const capacityMatch = !recommendedCapacity || (
        p.capacity_prices?.some((cp: any) =>
          cp.capacity?.toLowerCase().includes(recommendedCapacity.toLowerCase().replace(" ton", ""))
        ) ||
        p.title?.toLowerCase().includes(recommendedCapacity.toLowerCase().replace(" ", "")) ||
        p.title?.toLowerCase().includes(recommendedCapacity.toLowerCase())
      )
      const price = Number(p.price) || 0
      const priceMatch = price >= priceRange[0] && price <= priceRange[1]
      return brandMatch && capacityMatch && priceMatch
    })

    // Sort
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => Number(a.price) - Number(b.price))
        break
      case "price-high":
        filtered.sort((a, b) => Number(b.price) - Number(a.price))
        break
      case "rating":
        filtered.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0))
        break
      case "newest":
        filtered.reverse()
        break
      default:
        break
    }

    return filtered
  }, [products, selectedBrands, recommendedCapacity, priceRange, sortBy])

  const brands = Array.from(new Set(products.map(p => p.brand).filter(Boolean)))

  // Get price bounds for the range filter
  const maxPrice = useMemo(() => {
    if (products.length === 0) return 500000
    return Math.max(...products.map(p => Number(p.price) || 0), 100000)
  }, [products])

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.preventDefault()
    e.stopPropagation()
    if (!token) {
      toast.info("Please login to add items to cart")
      router.push("/auth")
      return
    }
    const capacity = product.capacity_prices?.[0]?.capacity || "1.5 Ton"
    const price = product.capacity_prices?.[0]?.price ?? product.price
    addToCart({ id: product.id, title: product.title, image: product.main_image || "/placeholder.svg", capacity, price: Number(price), qty: 1 })
    setAddedIds(prev => new Set([...prev, product.id]))
    setTimeout(() => setAddedIds(prev => { const n = new Set(prev); n.delete(product.id); return n }), 2000)
    toast.success(`${product.title} added to cart!`)
  }

  const getDiscount = (price: number, oldPrice: number | undefined) => {
    if (!oldPrice || oldPrice <= price) return 0
    return Math.round(((oldPrice - price) / oldPrice) * 100)
  }

  const sortLabels: Record<SortOption, string> = {
    relevance: "Relevance",
    "price-low": "Price: Low to High",
    "price-high": "Price: High to Low",
    rating: "Highest Rated",
    newest: "Newest First",
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-[#f8f9fa]">
        <div className="loader-wrapper"><div className="loader"></div></div>
      </div>
    )
  }

  /* ===== FILTER SIDEBAR CONTENT ===== */
  const FilterContent = () => (
    <div className="space-y-6">
      {/* Room Size Guide */}
      <ACCapacityRecommendation />

      {/* Divider */}
      <div className="border-t border-gray-100" />

      {/* Price Range Filter */}
      <div>
        <h3 className="font-bold text-xs uppercase tracking-wide text-gray-500 mb-3">Price Range</h3>
        <div className="space-y-3">
          <input
            type="range"
            min={0}
            max={maxPrice}
            step={1000}
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
            className="w-full h-1.5 bg-gray-200 rounded-full appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{formatINR(priceRange[0])}</span>
            <span>{formatINR(priceRange[1])}</span>
          </div>
          {priceRange[1] < maxPrice && (
            <button
              onClick={() => setPriceRange([0, maxPrice])}
              className="text-[11px] text-blue-600 hover:text-blue-700 font-medium"
            >
              Reset price filter
            </button>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100" />

      {/* Brand Filter */}
      <div>
        <h3 className="font-bold text-xs uppercase tracking-wide text-gray-500 mb-3">Filter by Brand</h3>
        <div className="space-y-2.5">
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
              <span className="ml-auto text-[10px] text-gray-400">
                ({products.filter(p => p.brand === brand).length})
              </span>
            </label>
          ))}
          {brands.length === 0 && <p className="text-xs text-gray-400">No brands available</p>}
        </div>
      </div>

      {selectedBrands.length > 0 && (
        <button onClick={() => setSelectedBrands([])} className="text-xs text-red-500 hover:text-red-600 font-medium">
          Clear brand filters
        </button>
      )}

      {/* Divider */}
      <div className="border-t border-gray-100" />

      <button
        onClick={() => router.push("/checkout")}
        className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-blue-700 transition-all shadow-sm shadow-blue-200"
      >
        <ShoppingCart className="w-4 h-4" /> Go to Checkout
      </button>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">

        {/* ═══ Breadcrumb ═══ */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-4 sm:mb-5">
          <Link href="/" className="hover:text-gray-600 transition-colors">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-gray-700 font-medium">Air Conditioners</span>
        </nav>

        {/* ═══ Page Header ═══ */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 mb-5 sm:mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#1d242d]">Air Conditioners</h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              {filteredAndSortedProducts.length} product{filteredAndSortedProducts.length !== 1 ? "s" : ""} available
              {recommendedCapacity && (
                <span className="text-blue-600 font-medium"> for {recommendedCapacity}</span>
              )}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Sort Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className="flex items-center gap-2 px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm"
              >
                <ArrowUpDown className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{sortLabels[sortBy]}</span>
                <span className="sm:hidden">Sort</span>
              </button>

              {showSortDropdown && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setShowSortDropdown(false)} />
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-40 py-1 overflow-hidden">
                    {(Object.keys(sortLabels) as SortOption[]).map((option) => (
                      <button
                        key={option}
                        onClick={() => { setSortBy(option); setShowSortDropdown(false) }}
                        className={`w-full text-left px-4 py-2.5 text-xs font-medium transition-colors ${
                          sortBy === option
                            ? "bg-blue-50 text-blue-600"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {sortLabels[option]}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Mobile Filter Button */}
            <button
              onClick={() => setShowMobileFilter(true)}
              className="lg:hidden flex items-center gap-2 px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
              {(selectedBrands.length > 0 || recommendedCapacity || priceRange[1] < maxPrice) && (
                <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[9px] font-bold flex items-center justify-center">
                  {selectedBrands.length + (recommendedCapacity ? 1 : 0) + (priceRange[1] < maxPrice ? 1 : 0)}
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-5 lg:gap-6">

          {/* ═══ DESKTOP SIDEBAR ═══ */}
          <aside className="hidden lg:block lg:w-[260px] xl:w-[280px] shrink-0">
            <div className="sticky top-24 bg-white rounded-2xl border border-gray-100 p-5 shadow-sm max-h-[calc(100vh-7rem)] overflow-y-auto hide-scrollbar">
              <FilterContent />
            </div>
          </aside>

          {/* ═══ MOBILE FILTER DRAWER ═══ */}
          {showMobileFilter && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowMobileFilter(false)} />
              <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-5 pt-3 max-h-[80vh] overflow-y-auto hide-scrollbar animate-in slide-in-from-bottom">
                {/* Drawer handle */}
                <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-base font-bold text-gray-900">Filters & Room Size</h2>
                  <button onClick={() => setShowMobileFilter(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <X className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
                <FilterContent />
              </div>
            </div>
          )}

          {/* ═══ PRODUCT GRID ═══ */}
          <div className="flex-1 min-w-0">

            {/* Active filter chips */}
            {(recommendedCapacity || selectedBrands.length > 0 || priceRange[1] < maxPrice) && (
              <div className="mb-4 flex flex-wrap items-center gap-2">
                {recommendedCapacity && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-full text-xs font-medium text-blue-700">
                    <Zap className="w-3 h-3" />
                    {recommendedCapacity} ({selectedRoom?.label})
                    <button onClick={clearSelection} className="ml-0.5 hover:text-red-500 transition-colors">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {priceRange[1] < maxPrice && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full text-xs font-medium text-emerald-700">
                    Up to {formatINR(priceRange[1])}
                    <button onClick={() => setPriceRange([0, maxPrice])} className="ml-0.5 hover:text-red-500 transition-colors">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {selectedBrands.map(brand => (
                  <span key={brand} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 border border-gray-200 rounded-full text-xs font-medium text-gray-700">
                    {brand}
                    <button onClick={() => toggleBrand(brand)} className="hover:text-red-500 transition-colors">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Empty State */}
            {filteredAndSortedProducts.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-10 sm:p-16 text-center shadow-sm">
                <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                  <ShoppingCart className="w-7 h-7 text-gray-400" />
                </div>
                <p className="font-bold text-gray-800 text-lg">No products found</p>
                <p className="text-sm text-gray-400 mt-2 max-w-xs mx-auto">
                  Try adjusting your filters, room size, or price range to see more results.
                </p>
                <div className="flex flex-wrap justify-center gap-2 mt-5">
                  {selectedBrands.length > 0 && (
                    <button onClick={() => setSelectedBrands([])}
                      className="px-4 py-2 text-sm text-blue-600 bg-blue-50 hover:bg-blue-100 font-medium rounded-lg transition-colors">
                      Clear brand filters
                    </button>
                  )}
                  {recommendedCapacity && (
                    <button onClick={clearSelection}
                      className="px-4 py-2 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 font-medium rounded-lg transition-colors">
                      Show all capacities
                    </button>
                  )}
                  {priceRange[1] < maxPrice && (
                    <button onClick={() => setPriceRange([0, maxPrice])}
                      className="px-4 py-2 text-sm text-emerald-600 bg-emerald-50 hover:bg-emerald-100 font-medium rounded-lg transition-colors">
                      Reset price range
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-3 sm:gap-4">
                {filteredAndSortedProducts.map((product: any) => {
                  const isAdded = addedIds.has(product.id)
                  const discount = getDiscount(Number(product.price), product.old_price ? Number(product.old_price) : undefined)
                  const savings = product.old_price ? Number(product.old_price) - Number(product.price) : 0

                  return (
                    <Link
                      key={product.id}
                      href={`/products/${product.id}`}
                      className="group relative bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-gray-100 hover:border-blue-200 hover:shadow-xl transition-all duration-300 flex flex-col"
                    >
                      {/* Image */}
                      <div className="relative aspect-[4/3] sm:aspect-square overflow-hidden bg-gray-50/80">
                        <img
                          src={product.main_image || "/placeholder.svg"}
                          alt={product.title}
                          className="w-full h-full object-contain p-3 sm:p-5 transition-transform duration-500 group-hover:scale-105"
                        />

                        {/* Discount Badge */}
                        {discount > 0 && (
                          <div className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5">
                            <div className="bg-[#cc0c39] text-white text-[9px] sm:text-[11px] font-bold px-2 py-0.5 sm:py-1 rounded-md shadow-sm">
                              {discount}% OFF
                            </div>
                          </div>
                        )}

                        {/* Badge */}
                        {product.badge && !discount && (
                          <div className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5">
                            <div className="text-white text-[9px] sm:text-[11px] font-bold px-2 py-0.5 sm:py-1 rounded-md shadow-sm"
                              style={{ backgroundColor: product.badge_color || "#2563eb" }}>
                              {product.badge}
                            </div>
                          </div>
                        )}

                        {/* Wishlist */}
                        <button
                          onClick={e => { e.preventDefault(); e.stopPropagation() }}
                          className="absolute top-2 right-2 w-7 h-7 sm:w-8 sm:h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-white transition-all shadow-sm opacity-0 group-hover:opacity-100"
                        >
                          <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>

                        {/* Out of Stock overlay */}
                        {product.in_stock === false && (
                          <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] flex items-center justify-center">
                            <span className="bg-gray-900/90 text-white text-[10px] sm:text-xs font-bold px-3 py-1.5 rounded-lg">Out of Stock</span>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-3 sm:p-4 flex flex-col flex-1">
                        {/* Brand */}
                        {product.brand && (
                          <p className="text-[9px] sm:text-[10px] text-blue-600 font-bold uppercase tracking-wider mb-1">
                            {product.brand}
                          </p>
                        )}

                        {/* Title */}
                        <h3 className="font-semibold text-[11px] sm:text-sm text-gray-900 mb-1.5 line-clamp-2 leading-snug group-hover:text-blue-700 transition-colors">
                          {product.title}
                        </h3>

                        {/* Rating */}
                        <div className="flex items-center gap-1.5 mb-2 sm:mb-3">
                          <div className="flex items-center gap-0.5 bg-green-600 text-white text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded">
                            <span>{Number(product.rating || 0).toFixed(1)}</span>
                            <Star className="w-2.5 h-2.5 fill-white" />
                          </div>
                          <span className="text-[9px] sm:text-[10px] text-gray-400">
                            ({product.review_count || 0})
                          </span>
                        </div>

                        {/* Pricing */}
                        <div className="mt-auto">
                          <div className="flex items-baseline gap-1.5 flex-wrap">
                            <span className="text-sm sm:text-lg font-bold text-[#1d242d]">
                              {formatINR(Number(product.price))}
                            </span>
                            {product.old_price && Number(product.old_price) > Number(product.price) && (
                              <span className="text-[9px] sm:text-xs text-gray-400 line-through">
                                {formatINR(Number(product.old_price))}
                              </span>
                            )}
                          </div>
                          {savings > 0 && (
                            <p className="text-[9px] sm:text-[11px] text-green-600 font-medium mt-0.5">
                              Save {formatINR(savings)}
                            </p>
                          )}
                        </div>

                        {/* Add to Cart */}
                        <button
                          onClick={e => handleAddToCart(e, product)}
                          disabled={product.in_stock === false}
                          className={`mt-2.5 sm:mt-3 w-full flex items-center justify-center gap-1.5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-semibold text-[10px] sm:text-xs transition-all ${
                            product.in_stock === false
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                              : isAdded
                                ? "bg-emerald-500 text-white shadow-sm"
                                : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-100 active:scale-[0.97]"
                          }`}
                        >
                          {product.in_stock === false ? (
                            "Out of Stock"
                          ) : isAdded ? (
                            <><Check className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Added</>
                          ) : (
                            <><ShoppingCart className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Add to Cart</>
                          )}
                        </button>
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
