"use client"

import {
  ShoppingCart,
  Star,
  Check,
  Shield,
  Truck,
  ChevronRight,
  X,
  Plus,
  Minus,
  Heart,
  Download,
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
import { FaTrashAlt } from "react-icons/fa"

export default function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>()

  const [product, setProduct] = useState<any>(null)
  const [relatedProducts, setRelatedProducts] = useState<any[]>([])
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedCapacity, setSelectedCapacity] = useState("1.5 Ton")
  const [addInstallation, setAddInstallation] = useState(false)
  const [activeTab, setActiveTab] = useState("description")
  const [loading, setLoading] = useState(true)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const router = useRouter()
  const [showCartWarning, setShowCartWarning] = useState(false)

  const brochureLayoutPlugin = defaultLayoutPlugin({
    sidebarTabs: (defaultTabs) => [defaultTabs[0]],
  })

  const { cart, addToCart, removeFromCart, updateQty, total } = useCart()

  /* ---------------- FETCH PRODUCT ---------------- */
  useEffect(() => {
    if (!id) return

    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data)
        setSelectedCapacity(data.capacity_prices?.[0]?.capacity)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [id])

  /* ---------------- FETCH RELATED ---------------- */
  useEffect(() => {
    if (!product?.category) return

    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/products`)
      .then((res) => res.json())
      .then((data) => {
        setRelatedProducts(
          data
            .filter(
              (p: any) => p.id !== product.id && p.category === product.category
            )
            .slice(0, 4)
        )
      })
  }, [product])

  if (loading) {
    return (
      <div className="loader-wrapper">
        <div className="loader"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-700">Product not found</p>
          <Link href="/products" className="text-sm text-blue-600 mt-2 inline-block hover:underline">
            ← Back to products
          </Link>
        </div>
      </div>
    )
  }

  /* ---------------- IMAGES ---------------- */
  const images = [
    product.main_image,
    ...(product.thumbnail_images || []),
    ...(product.gallery_images || []),
  ].filter(Boolean)

  const selectedPrice = product
    ? (product.capacity_prices?.find(
        (c: any) => c.capacity === selectedCapacity
      )?.price ?? product.price)
    : 0

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* BREADCRUMB */}
        <nav className="mb-6 flex items-center gap-1.5 text-xs text-gray-400 flex-wrap">
          <Link href="/" className="hover:text-gray-600 transition-colors">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/products" className="hover:text-gray-600 transition-colors">Products</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-gray-700 font-medium truncate max-w-[200px]">{product.title}</span>
        </nav>

        {/* MAIN PRODUCT SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
          {/* GALLERY */}
          <div>
            {/* Main Image */}
            <div className="relative aspect-square rounded-2xl border border-gray-100 bg-gray-50 overflow-hidden">
              <Image
                src={images[selectedImage]}
                alt={product.title}
                fill
                className="object-contain p-6 sm:p-10"
              />
            </div>

            {/* Thumbnails */}
            <div className="mt-4 grid grid-cols-4 sm:grid-cols-5 gap-2 sm:gap-3">
              {images.map((img: string, i: number) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`relative aspect-square rounded-xl border bg-gray-50 overflow-hidden transition-all ${
                    i === selectedImage
                      ? "border-blue-600 ring-2 ring-blue-100"
                      : "border-gray-100 hover:border-gray-300"
                  }`}
                >
                  <Image src={img} alt="" fill className="object-contain p-2" />
                </button>
              ))}
            </div>
          </div>

          {/* BUY BOX */}
          <div>
            <div className="lg:sticky lg:top-28">
              {/* Badges */}
              <div className="mb-4 flex flex-wrap gap-2">
                <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                  product.in_stock
                    ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                    : "bg-red-50 text-red-600 border border-red-100"
                }`}>
                  {product.in_stock ? "IN STOCK" : "OUT OF STOCK"}
                </span>
                {product.badge && (
                  <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-blue-50 text-blue-600 border border-blue-100">
                    {product.badge}
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-bold text-[#1d242d] leading-tight">
                {product.title}
              </h1>

              {/* Rating */}
              <div className="mt-3 flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product.rating || 0)
                          ? "fill-amber-400 text-amber-400"
                          : "text-gray-200"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500">
                  ({product.review_count || 0} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="mt-5 flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-bold text-blue-600">
                  {formatINR(selectedPrice)}
                </span>
                {product.old_price && (
                  <span className="text-base line-through text-gray-400">
                    {formatINR(product.old_price)}
                  </span>
                )}
              </div>

              {/* Divider */}
              <div className="my-6 border-t border-gray-100" />

              {/* Capacity */}
              <div className="mb-6">
                <span className="mb-3 block text-sm font-semibold text-gray-700">
                  Select Capacity
                </span>
                <div className="flex flex-wrap gap-3">
                  {(product.capacity_prices?.length > 0
                    ? product.capacity_prices.map((c: any) => c.capacity)
                    : ["1.0 Ton", "1.5 Ton", "2.0 Ton"]
                  ).map((c: string) => (
                    <button
                      key={c}
                      onClick={() => setSelectedCapacity(c)}
                      className={`px-5 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all ${
                        c === selectedCapacity
                          ? "border-blue-600 bg-blue-50 text-blue-600"
                          : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={() => {
                    addToCart({
                      id: product.id,
                      title: product.title,
                      image: images[0],
                      capacity: selectedCapacity,
                      price: selectedPrice,
                      qty: 1,
                    })
                    router.push("/checkout")
                  }}
                  disabled={!product.in_stock}
                  className={`w-full rounded-xl py-4 font-bold text-base transition-all ${
                    !product.in_stock
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-200"
                  }`}
                >
                  Buy Now
                </button>

                <button
                  onClick={() => {
                    addToCart({
                      id: product.id,
                      title: product.title,
                      image: images[0],
                      capacity: selectedCapacity,
                      price: selectedPrice,
                      qty: 1,
                    })
                    setIsCartOpen(true)
                  }}
                  className="w-full rounded-xl border-2 border-gray-200 py-4 font-bold text-base text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-all"
                >
                  Add to Cart
                </button>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 grid grid-cols-2 gap-4 pt-6 border-t border-gray-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                    <Shield className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="text-xs font-semibold text-gray-700">5 Years Warranty</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                    <Truck className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="text-xs font-semibold text-gray-700">Free Delivery</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* TABS SECTION */}
        <div className="mt-12 sm:mt-16">
          {/* Tab Headers */}
          <div className="flex overflow-x-auto border-b border-gray-100 -mx-4 px-4 sm:mx-0 sm:px-0">
            {["description", "specifications", "reviews"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 sm:px-6 py-3.5 text-sm font-semibold whitespace-nowrap transition-colors ${
                  activeTab === tab
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="py-6 sm:py-8">
            {activeTab === "description" && (
              <div className="max-w-3xl">
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              </div>
            )}

            {activeTab === "specifications" && (
              <div className="max-w-3xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
                  {(product.specifications || []).map((s: any, i: number) => (
                    <div key={i} className="flex justify-between py-3 border-b border-gray-100">
                      <span className="text-sm text-gray-500">{s.label}</span>
                      <span className="text-sm font-semibold text-gray-900">{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                {/* Rating Summary */}
                <div className="lg:col-span-4">
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-bold text-[#1d242d]">
                        {product.rating}
                      </span>
                      <span className="text-gray-400 text-sm">out of 5</span>
                    </div>
                    <div className="my-3 flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-current" />
                      ))}
                    </div>
                    <p className="text-xs text-gray-500">
                      Based on {product.reviews || product.review_count || 0} reviews
                    </p>

                    <div className="mt-5 space-y-2.5">
                      {[
                        { star: 5, pct: 70 },
                        { star: 4, pct: 20 },
                        { star: 3, pct: 5 },
                        { star: 2, pct: 3 },
                        { star: 1, pct: 2 },
                      ].map((rating) => (
                        <div key={rating.star} className="flex items-center gap-3">
                          <span className="w-3 text-xs font-semibold text-gray-500">
                            {rating.star}
                          </span>
                          <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200">
                            <div
                              className="h-full rounded-full bg-blue-600"
                              style={{ width: `${rating.pct}%` }}
                            />
                          </div>
                          <span className="w-8 text-xs font-medium text-gray-400">
                            {rating.pct}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Review List */}
                <div className="lg:col-span-8">
                  <div className="space-y-6">
                    {[
                      {
                        name: "Marcus Johnson",
                        date: "2 days ago",
                        text: "Absolutely love this AC unit. The installation service from Metro Cool was prompt and professional. The unit itself is incredibly quiet, I sometimes forget it's even on.",
                      },
                      {
                        name: "Sarah Jenkins",
                        date: "1 week ago",
                        text: "Great value for money. Cooling is fast. The only downside is the remote feels a bit plasticky, but the app works perfectly so I use that mostly.",
                      },
                    ].map((review, i) => (
                      <div key={i} className="flex gap-4 pb-6 border-b border-gray-100 last:border-0">
                        <div className="h-10 w-10 shrink-0 rounded-full bg-gradient-to-br from-blue-400 to-blue-600" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-sm font-bold text-gray-900">
                              {review.name}
                            </span>
                            <span className="text-[11px] text-gray-400 shrink-0">
                              {review.date}
                            </span>
                          </div>
                          <div className="my-1.5 flex text-amber-400">
                            {[...Array(5)].map((_, j) => (
                              <Star key={j} className="h-3.5 w-3.5 fill-current" />
                            ))}
                          </div>
                          <p className="text-sm leading-relaxed text-gray-600">
                            {review.text}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="mt-8 w-full rounded-xl border-2 border-gray-200 py-3.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all">
                    Load more reviews
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RELATED PRODUCTS */}
        {relatedProducts.length > 0 && (
          <section className="mt-12 sm:mt-16 pt-8 border-t border-gray-100">
            <h2 className="text-xl sm:text-2xl font-bold text-[#1d242d] mb-6">
              You might also like
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
              {relatedProducts.map((p) => (
                <Link
                  key={p.id}
                  href={`/products/${p.id}`}
                  className="group rounded-2xl border border-gray-100 bg-white overflow-hidden hover:shadow-lg hover:border-gray-200 transition-all"
                >
                  <div className="relative aspect-square bg-gray-50">
                    <Image
                      src={p.main_image}
                      alt={p.title}
                      fill
                      className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-3 sm:p-4">
                    <h3 className="text-sm font-semibold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                      {p.title}
                    </h3>
                    <p className="text-sm font-bold text-blue-600 mt-1">
                      {formatINR(Number(p.price))}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* BROCHURE / CATALOG */}
        {product.catalog_pdf && (
          <div className="mt-12 sm:mt-16 rounded-2xl border border-gray-100 bg-white p-5 sm:p-8">
            <h3 className="mb-6 text-lg font-bold text-[#1d242d]">
              Official Product Brochure
            </h3>

            <div className="overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
              <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                <div className="h-[400px] sm:h-[520px]">
                  <Viewer
                    fileUrl={product.catalog_pdf}
                    plugins={[brochureLayoutPlugin]}
                  />
                </div>
              </Worker>
            </div>

            <div className="mt-6 flex justify-center">
              <a
                href={product.catalog_pdf}
                download
                className="flex items-center gap-2 rounded-xl border-2 border-blue-600 px-6 py-3 font-semibold text-blue-600 transition hover:bg-blue-50"
              >
                <Download className="h-4 w-4" />
                Download Brochure
              </a>
            </div>
          </div>
        )}
      </main>

      {/* ============ CART DRAWER ============ */}
      {/* Overlay */}
      {isCartOpen && (
        <div
          onClick={() => setIsCartOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full bg-white z-50 shadow-2xl transition-transform duration-300 ease-in-out w-full sm:w-[400px] flex flex-col ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2 font-bold text-lg text-[#1d242d]">
            <ShoppingCart className="w-5 h-5" />
            Your Cart
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Success Message */}
        <div className="px-5 pt-4">
          <div className="bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-xl p-3 text-sm font-medium">
            ✓ Item added to cart
          </div>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {cart.length === 0 ? (
            <p className="text-center text-gray-400 mt-10">Your cart is empty</p>
          ) : (
            cart.map((item) => (
              <div
                key={item.id + item.capacity}
                className="flex gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg border border-gray-200 bg-white object-contain p-1"
                />

                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm text-gray-900 truncate">
                    {item.title}
                  </h4>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Capacity: {item.capacity}
                  </p>
                  <p className="text-xs text-gray-400">
                    Unit: {formatINR(item.price)}
                  </p>

                  {/* Quantity */}
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center border border-gray-200 rounded-lg bg-white">
                      <button
                        className="px-2.5 py-1.5 hover:bg-gray-50 transition-colors"
                        onClick={() => {
                          if (item.qty === 1) {
                            removeFromCart(item.id, item.capacity)
                          } else {
                            updateQty(item.id, item.capacity, item.qty - 1)
                          }
                        }}
                      >
                        <Minus size={12} />
                      </button>
                      <span className="px-2.5 text-sm font-medium">{item.qty}</span>
                      <button
                        className="px-2.5 py-1.5 hover:bg-gray-50 transition-colors"
                        onClick={() => updateQty(item.id, item.capacity, item.qty + 1)}
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    <span className="ml-auto font-bold text-sm text-blue-600">
                      {formatINR(item.price * item.qty)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => removeFromCart(item.id, item.capacity)}
                  className="shrink-0 self-start p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <FaTrashAlt className="text-red-400 h-3.5 w-3.5" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Bottom Checkout Section */}
        <div className="border-t border-gray-100 bg-white p-5 space-y-3">
          {showCartWarning && (
            <div className="text-center text-sm bg-red-50 text-red-600 border border-red-100 py-2 rounded-lg">
              Please add a product first 🛒
            </div>
          )}

          <div className="flex justify-between text-sm text-gray-600">
            <span>Subtotal</span>
            <span className="font-medium">{formatINR(total)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Shipping</span>
            <span className="text-emerald-600 font-medium">FREE</span>
          </div>
          <div className="flex justify-between font-bold text-lg text-[#1d242d] pt-2 border-t border-gray-100">
            <span>Total</span>
            <span>{formatINR(total)}</span>
          </div>

          <button
            onClick={() => {
              if (cart.length === 0) {
                setShowCartWarning(true)
                setTimeout(() => setShowCartWarning(false), 2000)
                return
              }
              setIsCartOpen(false)
              router.push("/checkout")
            }}
            className={`w-full py-3.5 rounded-xl font-bold text-base transition-all ${
              cart.length === 0
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-200"
            }`}
          >
            Checkout Now →
          </button>

          <p className="text-center text-[11px] text-gray-400">
            Secure encrypted checkout
          </p>
        </div>
      </div>
    </div>
  )
}
