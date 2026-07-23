"use client"

import {
  ShoppingCart,
  Star,
  Check,
  Shield,
  ChevronRight,
  X,
  Plus,
  Minus,
  Download,
  Home,
  Thermometer,
  ChevronDown,
  Zap,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Worker, Viewer } from "@react-pdf-viewer/core"
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout"

import "@react-pdf-viewer/core/lib/styles/index.css"
import "@react-pdf-viewer/default-layout/lib/styles/index.css"
import { useRouter } from "next/navigation"
import { formatINR } from "@/app/lib/currency"
import { useCart } from "@/app/context/CartContext"
import { useRoomSize, ROOM_OPTIONS, RoomOption, extractTon, findClosestCapacity } from "@/app/context/RoomSizeContext"
import { useAuthStore } from "@/store/auth.store"
import { toast } from "react-toastify"
import { FaTrashAlt } from "react-icons/fa"
import { ImageGallery } from "./components/ImageGallery"

export default function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>()

  const [product, setProduct] = useState<any>(null)
  const [relatedProducts, setRelatedProducts] = useState<any[]>([])
  const [selectedCapacity, setSelectedCapacity] = useState("1.5 Ton")
  const [addInstallation, setAddInstallation] = useState(false)
  const [activeTab, setActiveTab] = useState("description")
  const [loading, setLoading] = useState(true)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const router = useRouter()
  const [showCartWarning, setShowCartWarning] = useState(false)
  const [showRoomPicker, setShowRoomPicker] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)

  const brochureLayoutPlugin = defaultLayoutPlugin({
    sidebarTabs: (defaultTabs) => [defaultTabs[0]],
  })

  const { cart, addToCart, removeFromCart, updateQty, total } = useCart()
  const { recommendedCapacity, selectedRoom, setSelectedRoom, clearSelection } = useRoomSize()
  const { token } = useAuthStore()

  /** Redirect to login if not authenticated, returns true if logged in */
  const requireAuth = () => {
    if (!token) {
      toast.info("Please login to continue")
      router.push("/auth")
      return false
    }
    return true
  }

  /* ---------------- FETCH PRODUCT ---------------- */
  useEffect(() => {
    if (!id) return
    setLoading(true)
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Product not found")
        return res.json()
      })
      .then((data) => {
        setProduct(data)
        const capacities = data.capacity_prices?.map((c: any) => c.capacity) || []
        if (recommendedCapacity && capacities.length > 0) {
          const targetNum = extractTon(recommendedCapacity)
          const closest = findClosestCapacity(capacities, targetNum)
          setSelectedCapacity(closest || capacities[0])
        } else {
          setSelectedCapacity(capacities[0] || "1.5 Ton")
        }
      })
      .catch((err) => {
        console.error("Failed to load product:", err)
        setProduct(null)
      })
      .finally(() => setLoading(false))
  }, [id, recommendedCapacity])

  /* ---------------- FETCH RELATED ---------------- */
  useEffect(() => {
    if (!product?.category) return
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/products`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load related products")
        return res.json()
      })
      .then((data) => {
        setRelatedProducts(
          data.filter((p: any) => p.id !== product.id && p.category === product.category).slice(0, 4)
        )
      })
      .catch((err) => {
        console.error("Related products error:", err)
        setRelatedProducts([])
      })
  }, [product])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa]">
        <div className="loader-wrapper"><div className="loader"></div></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa]">
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-700">Product not found</p>
          <Link href="/products" className="text-sm text-blue-600 mt-2 inline-block hover:underline">
            ← Back to products
          </Link>
        </div>
      </div>
    )
  }

  /* ---------------- DERIVED ---------------- */
  const images = [
    product.main_image,
    ...(product.thumbnail_images || []),
    ...(product.gallery_images || []),
  ].filter(Boolean)

  const selectedPrice = product.capacity_prices?.find(
    (c: any) => c.capacity === selectedCapacity
  )?.price ?? product.price

  const discount = product.old_price && Number(product.old_price) > 0 && Number(product.old_price) > selectedPrice
    ? Math.round(((Number(product.old_price) - selectedPrice) / Number(product.old_price)) * 100)
    : 0

  const savings = product.old_price && Number(product.old_price) > 0 && Number(product.old_price) > selectedPrice
    ? Number(product.old_price) - selectedPrice
    : 0

  return (
    <div className="min-h-screen bg-gray-50/50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">

        {/* ═══ BREADCRUMB ═══ */}
        <nav className="mb-4 sm:mb-6 flex items-center gap-1.5 text-xs text-gray-400 flex-wrap">
          <Link href="/" className="hover:text-blue-600 transition-colors flex items-center gap-1">
            <Home className="w-3 h-3" />
            <span className="hidden sm:inline">Home</span>
          </Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/products" className="hover:text-blue-600 transition-colors">Products</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-gray-600 font-medium truncate max-w-[160px] sm:max-w-[300px]">{product.title}</span>
        </nav>

        {/* ═══ MAIN PRODUCT GRID ═══ */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">

            {/* ─── GALLERY SIDE ─── */}
            <ImageGallery images={images} title={product.title} discount={discount} />

            {/* ─── BUY BOX SIDE ─── */}
            <div className="p-4 sm:p-6 lg:p-8">
              <div className="lg:sticky lg:top-24 space-y-5">

                {/* Badges */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`px-3 py-1.5 rounded-full text-[11px] font-bold ${
                    product.in_stock
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-red-50 text-red-600 border border-red-200"
                  }`}>
                    {product.in_stock ? "✓ In Stock" : "✕ Out of Stock"}
                  </span>
                  {product.badge && (
                    <span
                      className="px-3 py-1.5 rounded-full text-[11px] font-bold text-white shadow-sm"
                      style={{ backgroundColor: product.badge_color || "#2563eb" }}
                    >
                      {product.badge}
                    </span>
                  )}
                  {product.brand && (
                    <span className="px-3 py-1.5 rounded-full text-[11px] font-semibold text-blue-600 bg-blue-50 border border-blue-100">
                      {product.brand}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h1 className="text-xl sm:text-2xl lg:text-[28px] font-bold text-gray-900 leading-tight">
                  {product.title}
                </h1>

                {/* Rating */}
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex items-center gap-1 bg-green-600 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-sm">
                    <span>{Number(product.rating || 0).toFixed(1)}</span>
                    <Star className="w-3 h-3 fill-white" />
                  </div>
                  <span className="text-sm text-gray-500">
                    {product.review_count || 0} ratings & reviews
                  </span>
                  {product.brand && (
                    <span className="text-xs text-gray-400 hidden sm:inline">|  Brand: <span className="text-gray-700 font-medium">{product.brand}</span></span>
                  )}
                </div>

                {/* Price Block */}
                <div className="p-4 sm:p-5 bg-gradient-to-r from-blue-50/50 to-gray-50 rounded-2xl border border-gray-100">
                  <div className="flex items-baseline gap-3 flex-wrap">
                    <span className="text-3xl sm:text-4xl font-bold text-gray-900">
                      {formatINR(selectedPrice)}
                    </span>
                    {discount > 0 && (
                      <>
                        <span className="text-base sm:text-lg text-gray-400 line-through">
                          {formatINR(Number(product.old_price))}
                        </span>
                        <span className="text-sm font-bold text-white bg-red-500 px-2 py-0.5 rounded-md">
                          {discount}% OFF
                        </span>
                      </>
                    )}
                  </div>
                  {savings > 0 && (
                    <p className="text-sm text-green-600 font-semibold mt-2 flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5" />
                      You save {formatINR(savings)} on this purchase
                    </p>
                  )}
                  <p className="text-[11px] text-gray-400 mt-1.5">Inclusive of all taxes • Free delivery</p>
                </div>

                {/* Room Size Picker */}
                <div className="rounded-xl border border-gray-100 overflow-hidden">
                  <button
                    onClick={() => setShowRoomPicker(!showRoomPicker)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                        <Home className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-semibold text-gray-800">
                          {selectedRoom
                            ? `${selectedRoom.range} — ${selectedRoom.label}`
                            : "Find AC for your room size"}
                        </p>
                        {selectedRoom ? (
                          <p className="text-[10px] text-emerald-600 font-medium mt-0.5">
                            Recommended: {selectedRoom.capacity} AC
                          </p>
                        ) : (
                          <p className="text-[10px] text-gray-400 mt-0.5">
                            Click to get a personalized recommendation
                          </p>
                        )}
                      </div>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${showRoomPicker ? "rotate-180" : ""}`} />
                  </button>

                  {showRoomPicker && (
                    <div className="p-3 border-t border-gray-100 bg-white space-y-1.5 max-h-[280px] overflow-y-auto">
                      {ROOM_OPTIONS.map((option) => {
                        const isActive = selectedRoom?.id === option.id
                        return (
                          <button
                            key={option.id}
                            onClick={() => {
                              setSelectedRoom(option)
                              const capacities = product.capacity_prices?.map((c: any) => c.capacity) || []
                              const closest = findClosestCapacity(capacities, option.capacityNum)
                              if (closest) setSelectedCapacity(closest)
                              setShowRoomPicker(false)
                            }}
                            className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-2.5 transition-all ${
                              isActive
                                ? "bg-blue-50 border border-blue-200"
                                : "bg-gray-50/70 border border-transparent hover:bg-blue-50/50 hover:border-blue-100"
                            }`}
                          >
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                              isActive ? "border-blue-600 bg-blue-600" : "border-gray-300"
                            }`}>
                              {isActive && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className={`text-xs font-semibold ${isActive ? "text-blue-900" : "text-gray-700"}`}>
                                {option.range}
                              </span>
                              <span className="text-[10px] text-gray-400 ml-1.5">({option.label})</span>
                            </div>
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                              isActive ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"
                            }`}>
                              {option.capacity}
                            </span>
                          </button>
                        )
                      })}
                      {selectedRoom && (
                        <button
                          onClick={() => { clearSelection(); setShowRoomPicker(false) }}
                          className="w-full text-center text-[11px] text-gray-400 hover:text-red-500 font-medium py-2 transition-colors"
                        >
                          Clear room selection
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Capacity Selection */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-gray-700">Select Capacity</span>
                    {recommendedCapacity && selectedRoom && (
                      <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
                        <Thermometer className="w-3 h-3" />
                        {recommendedCapacity} suggested
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {(product.capacity_prices?.length > 0
                      ? product.capacity_prices.map((c: any) => c.capacity)
                      : ["1.0 Ton", "1.5 Ton", "2.0 Ton"]
                    ).map((c: string) => {
                      const isRecommended = recommendedCapacity &&
                        selectedRoom &&
                        findClosestCapacity(
                          product.capacity_prices?.map((cp: any) => cp.capacity) || [],
                          extractTon(recommendedCapacity)
                        ) === c
                      const isSelected = c === selectedCapacity
                      return (
                        <button
                          key={c}
                          onClick={() => setSelectedCapacity(c)}
                          className={`relative px-4 sm:px-5 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all ${
                            isSelected
                              ? "border-blue-600 bg-blue-50 text-blue-600 shadow-sm"
                              : "border-gray-200 text-gray-600 hover:border-blue-300 hover:bg-blue-50/30"
                          }`}
                        >
                          {c}
                          {isRecommended && (
                            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center shadow-sm">
                              <Check className="w-2.5 h-2.5 text-white" />
                            </span>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 pt-2">
                  <button
                    onClick={() => {
                      if (!requireAuth()) return
                      addToCart({
                        id: product.id,
                        title: product.title,
                        image: images[0],
                        capacity: selectedCapacity,
                        price: selectedPrice,
                        qty: 1,
                        delivery_charge: Number(product.delivery_charge || 0),
                      })
                      router.push("/checkout")
                    }}
                    disabled={!product.in_stock}
                    className={`w-full rounded-2xl py-4 font-bold text-sm sm:text-base transition-all flex items-center justify-center gap-2.5 ${
                      !product.in_stock
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200/50 active:scale-[0.98] hover:shadow-xl hover:shadow-blue-300/40"
                    }`}
                  >
                    <Zap className="w-4 h-4" />
                    Buy Now
                  </button>

                  <button
                    onClick={() => {
                      if (!requireAuth()) return
                      addToCart({
                        id: product.id,
                        title: product.title,
                        image: images[0],
                        capacity: selectedCapacity,
                        price: selectedPrice,
                        qty: 1,
                        delivery_charge: Number(product.delivery_charge || 0),
                      })
                      setAddedToCart(true)
                      setIsCartOpen(true)
                      setTimeout(() => setAddedToCart(false), 2000)
                    }}
                    disabled={!product.in_stock}
                    className={`w-full rounded-2xl border-2 py-4 font-bold text-sm sm:text-base transition-all flex items-center justify-center gap-2.5 ${
                      !product.in_stock
                        ? "border-gray-200 text-gray-400 cursor-not-allowed"
                        : addedToCart
                          ? "border-emerald-500 bg-emerald-50 text-emerald-600"
                          : "border-gray-200 text-gray-700 hover:border-blue-400 hover:bg-blue-50/50 active:scale-[0.98]"
                    }`}
                  >
                    {addedToCart ? (
                      <><Check className="w-4 h-4" /> Added to Cart</>
                    ) : (
                      <><ShoppingCart className="w-4 h-4" /> Add to Cart</>
                    )}
                  </button>
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-2 gap-2.5 pt-5 border-t border-gray-100">
                  {[
                    { icon: <Shield className="w-4 h-4 text-blue-600" />, text: "5 Year Warranty", sub: "Brand warranty" },
                    { icon: <Zap className="w-4 h-4 text-amber-600" />, text: "Fast Install", sub: "Same day" },
                  ].map((badge, i) => (
                    <div key={i} className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-gray-50/80 border border-gray-100 hover:border-blue-100 hover:bg-blue-50/30 transition-all">
                      <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-sm">
                        {badge.icon}
                      </div>
                      <span className="text-[10px] sm:text-[11px] font-bold text-gray-700 text-center leading-tight">{badge.text}</span>
                      <span className="text-[9px] text-gray-400 font-medium">{badge.sub}</span>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* ═══ TABS SECTION ═══ */}
        <div className="mt-6 sm:mt-8 bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Tab Headers */}
          <div className="flex overflow-x-auto border-b border-gray-100 px-2 sm:px-6 hide-scrollbar">
            {["description", "specifications", "reviews"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 sm:px-6 py-4 sm:py-5 text-sm font-semibold whitespace-nowrap transition-all relative cursor-pointer ${
                  activeTab === tab
                    ? "text-blue-600"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {activeTab === tab && (
                  <span className="absolute bottom-0 left-2 right-2 h-[3px] bg-blue-600 rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-4 sm:p-6 lg:p-8">
            {activeTab === "description" && (
              <div className="max-w-3xl">
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
                {/* Features list */}
                {product.features && product.features.length > 0 && (
                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {product.features.map((f: any, i: number) => (
                      <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800">{f.title}</p>
                          {f.description && (
                            <p className="text-xs text-gray-500 mt-0.5">{f.description}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "specifications" && (
              <div className="max-w-3xl">
                <div className="rounded-xl border border-gray-100 overflow-hidden">
                  {(product.specifications || []).map((s: any, i: number) => (
                    <div key={i} className={`flex items-center justify-between px-4 py-3 ${
                      i % 2 === 0 ? "bg-gray-50" : "bg-white"
                    }`}>
                      <span className="text-sm text-gray-500">{s.label}</span>
                      <span className="text-sm font-semibold text-gray-900">{s.value}</span>
                    </div>
                  ))}
                </div>
                {(!product.specifications || product.specifications.length === 0) && (
                  <p className="text-sm text-gray-400 text-center py-8">No specifications available</p>
                )}
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
                {/* Rating Summary */}
                <div className="lg:col-span-4">
                  <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-2xl p-5 sm:p-6 border border-gray-100">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl sm:text-5xl font-bold text-[#1d242d]">{product.rating || "4.5"}</span>
                      <span className="text-gray-400 text-sm">/5</span>
                    </div>
                    <div className="my-2 flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                    <p className="text-xs text-gray-500">
                      Based on {product.review_count || 0} reviews
                    </p>
                    <div className="mt-4 space-y-2">
                      {[
                        { star: 5, pct: 70 },
                        { star: 4, pct: 20 },
                        { star: 3, pct: 5 },
                        { star: 2, pct: 3 },
                        { star: 1, pct: 2 },
                      ].map((r) => (
                        <div key={r.star} className="flex items-center gap-2">
                          <span className="w-3 text-[11px] font-semibold text-gray-500">{r.star}</span>
                          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-200">
                            <div className="h-full rounded-full bg-blue-600" style={{ width: `${r.pct}%` }} />
                          </div>
                          <span className="w-7 text-[10px] font-medium text-gray-400">{r.pct}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Review List */}
                <div className="lg:col-span-8 space-y-5">
                  {[
                    { name: "Marcus Johnson", date: "2 days ago", text: "Absolutely love this AC unit. The installation service from Metro Cool was prompt and professional. The unit itself is incredibly quiet." },
                    { name: "Sarah Jenkins", date: "1 week ago", text: "Great value for money. Cooling is fast. The only downside is the remote feels a bit plasticky, but the app works perfectly so I use that mostly." },
                  ].map((review, i) => (
                    <div key={i} className="flex gap-3 sm:gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="h-9 w-9 shrink-0 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
                        {review.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-bold text-gray-900">{review.name}</span>
                          <span className="text-[10px] text-gray-400 shrink-0">{review.date}</span>
                        </div>
                        <div className="my-1 flex text-amber-400">
                          {[...Array(5)].map((_, j) => (
                            <Star key={j} className="h-3 w-3 fill-current" />
                          ))}
                        </div>
                        <p className="text-xs sm:text-sm leading-relaxed text-gray-600">{review.text}</p>
                      </div>
                    </div>
                  ))}
                  <button className="w-full rounded-xl border-2 border-gray-200 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all">
                    Load more reviews
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ═══ RELATED PRODUCTS ═══ */}
        {relatedProducts.length > 0 && (
          <section className="mt-6 sm:mt-8">
            <div className="flex items-center justify-between mb-4 sm:mb-5">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                You Might Also Like
              </h2>
              <Link href="/products" className="text-sm text-blue-600 font-semibold hover:text-blue-700 transition-colors hidden sm:block">
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {relatedProducts.map((p) => {
                const relDiscount = p.old_price && Number(p.old_price) > 0 && Number(p.old_price) > Number(p.price)
                  ? Math.round(((Number(p.old_price) - Number(p.price)) / Number(p.old_price)) * 100)
                  : 0
                return (
                  <Link
                    key={p.id}
                    href={`/products/${p.id}`}
                    className="group rounded-2xl border border-gray-100 bg-white overflow-hidden hover:shadow-xl hover:border-blue-200 transition-all duration-300 flex flex-col hover:-translate-y-0.5"
                  >
                    <div className="relative aspect-square bg-gray-50">
                      <Image src={p.main_image} alt={p.title} fill
                        className="object-contain p-3 sm:p-4 group-hover:scale-105 transition-transform duration-300" />
                      {relDiscount > 0 && (
                        <div className="absolute top-2 left-2">
                          <div className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-sm">{relDiscount}% OFF</div>
                        </div>
                      )}
                    </div>
                    <div className="p-3 sm:p-4 flex-1 flex flex-col">
                      <h3 className="text-xs sm:text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors leading-snug">{p.title}</h3>
                      <div className="mt-auto pt-2.5">
                        <div className="flex items-baseline gap-1.5 flex-wrap">
                          <span className="text-sm sm:text-base font-bold text-gray-900">{formatINR(Number(p.price))}</span>
                          {Number(p.old_price) > 0 && Number(p.old_price) > Number(p.price) && (
                            <span className="text-[10px] sm:text-xs text-gray-400 line-through">{formatINR(Number(p.old_price))}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>
        )}

        {/* ═══ BROCHURE ═══ */}
        {product.catalog_pdf && (
          <div className="mt-6 sm:mt-8 rounded-2xl sm:rounded-3xl border border-gray-100 bg-white shadow-sm p-4 sm:p-6 lg:p-8">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h3 className="text-lg font-bold text-gray-900">Official Product Brochure</h3>
              <a href={product.catalog_pdf} download
                className="flex items-center gap-2 rounded-xl bg-blue-50 border border-blue-100 px-4 py-2 font-semibold text-xs text-blue-600 transition hover:bg-blue-100">
                <Download className="h-3.5 w-3.5" /> Download
              </a>
            </div>
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
              <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                <div className="h-[300px] sm:h-[400px] lg:h-[520px]">
                  <Viewer fileUrl={product.catalog_pdf} plugins={[brochureLayoutPlugin]} />
                </div>
              </Worker>
            </div>
          </div>
        )}
      </main>

      {/* ═══ CART DRAWER ═══ */}
      {isCartOpen && (
        <div onClick={() => setIsCartOpen(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity" />
      )}

      <div className={`fixed top-0 right-0 h-full bg-white z-50 shadow-2xl transition-transform duration-300 ease-in-out w-full sm:w-[400px] flex flex-col rounded-l-2xl ${
        isCartOpen ? "translate-x-0" : "translate-x-full"
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
              <ShoppingCart className="w-4 h-4 text-blue-600" />
            </div>
            <span className="font-bold text-base text-gray-900">Your Cart ({cart.length})</span>
          </div>
          <button onClick={() => setIsCartOpen(false)}
            className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer">
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Success banner */}
        {addedToCart && (
          <div className="px-5 pt-3 shrink-0">
            <div className="bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl p-3 text-xs font-medium flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                <Check className="w-3 h-3 text-white" />
              </div>
              Item added to cart successfully!
            </div>
          </div>
        )}

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {cart.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="w-7 h-7 text-gray-300" />
              </div>
              <p className="text-gray-400 text-sm font-medium">Your cart is empty</p>
              <p className="text-gray-300 text-xs mt-1">Add items to get started</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id + item.capacity} className="flex gap-3 p-3 rounded-xl border border-gray-100 bg-white hover:border-gray-200 transition-colors">
                <div className="w-16 h-16 rounded-xl border border-gray-100 bg-gray-50 overflow-hidden shrink-0">
                  <img src={item.image} alt={item.title}
                    className="w-full h-full object-contain p-1.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm text-gray-900 truncate">{item.title}</h4>
                  <p className="text-[11px] text-gray-400 mt-0.5">{item.capacity}</p>
                  <div className="flex items-center gap-2.5 mt-2">
                    <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50 overflow-hidden">
                      <button className="px-2.5 py-1.5 hover:bg-gray-100 transition-colors cursor-pointer"
                        onClick={() => { if (item.qty === 1) removeFromCart(item.id, item.capacity); else updateQty(item.id, item.capacity, item.qty - 1); }}>
                        <Minus size={12} />
                      </button>
                      <span className="px-2.5 text-xs font-bold text-gray-700">{item.qty}</span>
                      <button className="px-2.5 py-1.5 hover:bg-gray-100 transition-colors cursor-pointer"
                        onClick={() => updateQty(item.id, item.capacity, item.qty + 1)}>
                        <Plus size={12} />
                      </button>
                    </div>
                    <span className="ml-auto font-bold text-sm text-blue-600">{formatINR(item.price * item.qty)}</span>
                  </div>
                </div>
                <button onClick={() => removeFromCart(item.id, item.capacity)}
                  className="shrink-0 self-start p-2 hover:bg-red-50 rounded-lg transition-colors cursor-pointer">
                  <FaTrashAlt className="text-red-400 h-3.5 w-3.5" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Checkout Footer */}
        {cart.length > 0 && (
          <div className="border-t border-gray-100 bg-gray-50/50 p-5 space-y-3 shrink-0">
            {showCartWarning && (
              <div className="text-center text-xs bg-red-50 text-red-600 border border-red-100 py-2.5 rounded-xl font-medium">
                Please add a product first
              </div>
            )}
            <div className="flex justify-between text-sm text-gray-500">
              <span>Subtotal</span>
              <span className="font-medium text-gray-700">{formatINR(total)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>Shipping</span>
              <span className="text-emerald-600 font-semibold">FREE</span>
            </div>
            <div className="flex justify-between font-bold text-lg text-gray-900 pt-3 border-t border-gray-200">
              <span>Total</span>
              <span>{formatINR(total)}</span>
            </div>
            <button
              onClick={() => {
                if (cart.length === 0) { setShowCartWarning(true); setTimeout(() => setShowCartWarning(false), 2000); return }
                setIsCartOpen(false); router.push("/checkout")
              }}
              className="w-full py-3.5 rounded-xl font-bold text-sm bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-200/50 transition-all active:scale-[0.98] cursor-pointer"
            >
              Proceed to Checkout →
            </button>
            <p className="text-center text-[10px] text-gray-400 flex items-center justify-center gap-1">
              <Shield className="w-3 h-3" />
              Secure encrypted checkout
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
