"use client"

import { useCart } from "@/app/context/CartContext"
import { formatINR } from "@/app/lib/currency"
import {
  ShoppingCart,
  Minus,
  Plus,
  Trash2,
  ChevronRight,
  ShoppingBag,
  ArrowLeft,
  Shield,
  Truck,
  Tag,
  Package,
  BadgePercent,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function CartPage() {
  const { cart, total, updateQty, removeFromCart, clearCart } = useCart()
  const router = useRouter()
  const [removingId, setRemovingId] = useState<string | null>(null)

  const itemCount = cart.reduce((sum, item) => sum + item.qty, 0)

  // Shipping logic
  const FREE_SHIPPING_THRESHOLD = 10000
  const SHIPPING_FEE = 499
  const shippingCost = total >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE
  const finalTotal = total + shippingCost

  const handleRemove = (id: string, capacity: string) => {
    setRemovingId(id + capacity)
    setTimeout(() => {
      removeFromCart(id, capacity)
      setRemovingId(null)
    }, 300)
  }

  /* ═══ EMPTY STATE ═══ */
  if (cart.length === 0) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center bg-gray-50/50 px-4">
        <div className="text-center max-w-sm">
          <div className="w-24 h-24 rounded-3xl bg-gray-100 flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="w-10 h-10 text-gray-300" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h1>
          <p className="text-sm text-gray-500 mb-8 leading-relaxed">
            Looks like you haven&apos;t added any products yet. Browse our collection of ACs and accessories.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-600 text-white font-semibold text-sm rounded-xl hover:bg-blue-700 transition-all shadow-md shadow-blue-200/50"
            >
              <ShoppingBag className="w-4 h-4" />
              Browse Products
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-gray-700 font-semibold text-sm rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
            >
              Browse Services
            </Link>
          </div>
        </div>
      </div>
    )
  }

  /* ═══ CART WITH ITEMS ═══ */
  return (
    <div className="min-h-screen bg-gray-50/50">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
              Shopping Cart
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              {itemCount} item{itemCount !== 1 ? "s" : ""} in your cart
            </p>
          </div>
          <button
            onClick={() => router.push("/products")}
            className="hidden sm:flex items-center gap-2 text-sm text-blue-600 font-semibold hover:text-blue-700 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Continue Shopping
          </button>
        </div>

        {/* Free shipping banner */}
        {shippingCost === 0 && (
          <div className="mb-5 p-3 sm:p-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
              <Truck className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-sm text-emerald-700 font-medium">
              🎉 You qualify for <span className="font-bold">FREE delivery</span> on this order!
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6">

          {/* ═══ CART ITEMS ═══ */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

              {/* Table header - desktop */}
              <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-3.5 bg-gray-50/80 border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                <div className="col-span-6">Product</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-right">Total</div>
              </div>

              {/* Items */}
              <div className="divide-y divide-gray-50">
                {cart.map((item) => {
                  const isRemoving = removingId === item.id + item.capacity
                  return (
                    <div
                      key={item.id + item.capacity}
                      className={`px-4 sm:px-6 py-4 sm:py-5 transition-all duration-300 hover:bg-gray-50/50 ${
                        isRemoving ? "opacity-0 scale-95" : "opacity-100 scale-100"
                      }`}
                    >
                      {/* Mobile Layout */}
                      <div className="sm:hidden flex gap-3">
                        <Link href={`/products/${item.id}`} className="shrink-0">
                          <div className="relative w-20 h-20 rounded-xl border border-gray-100 bg-gray-50 overflow-hidden">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.title}
                              fill
                              className="object-contain p-2"
                            />
                          </div>
                        </Link>
                        <div className="flex-1 min-w-0">
                          <Link href={`/products/${item.id}`}>
                            <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 hover:text-blue-600 transition-colors">{item.title}</h3>
                          </Link>
                          <p className="text-[11px] text-gray-400 mt-0.5">{item.capacity}</p>
                          <div className="flex items-center justify-between mt-2.5">
                            <div className="flex items-center border border-gray-200 rounded-xl bg-white overflow-hidden shadow-sm">
                              <button
                                onClick={() => {
                                  if (item.qty === 1) handleRemove(item.id, item.capacity)
                                  else updateQty(item.id, item.capacity, item.qty - 1)
                                }}
                                className="px-3 py-2 hover:bg-gray-50 transition-colors cursor-pointer active:bg-gray-100"
                              >
                                <Minus className="w-3 h-3 text-gray-600" />
                              </button>
                              <span className="px-3 text-sm font-bold text-gray-900 min-w-[32px] text-center">{item.qty}</span>
                              <button
                                onClick={() => updateQty(item.id, item.capacity, item.qty + 1)}
                                className="px-3 py-2 hover:bg-gray-50 transition-colors cursor-pointer active:bg-gray-100"
                              >
                                <Plus className="w-3 h-3 text-gray-600" />
                              </button>
                            </div>
                            <span className="text-sm font-bold text-gray-900">{formatINR(item.price * item.qty)}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemove(item.id, item.capacity)}
                          className="shrink-0 self-start p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Desktop Layout */}
                      <div className="hidden sm:grid grid-cols-12 gap-4 items-center">
                        {/* Product */}
                        <div className="col-span-6 flex items-center gap-4">
                          <Link href={`/products/${item.id}`} className="shrink-0">
                            <div className="relative w-[72px] h-[72px] rounded-xl border border-gray-100 bg-gray-50 overflow-hidden hover:border-blue-200 transition-colors">
                              <Image
                                src={item.image || "/placeholder.svg"}
                                alt={item.title}
                                fill
                                className="object-contain p-2"
                              />
                            </div>
                          </Link>
                          <div className="min-w-0">
                            <Link href={`/products/${item.id}`}>
                              <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 hover:text-blue-600 transition-colors">
                                {item.title}
                              </h3>
                            </Link>
                            <p className="text-xs text-gray-400 mt-1">{item.capacity}</p>
                            <button
                              onClick={() => handleRemove(item.id, item.capacity)}
                              className="mt-1.5 flex items-center gap-1 text-[11px] text-gray-400 hover:text-red-500 font-medium transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3" />
                              Remove
                            </button>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="col-span-2 text-center">
                          <span className="text-sm font-semibold text-gray-700">{formatINR(item.price)}</span>
                        </div>

                        {/* Quantity */}
                        <div className="col-span-2 flex justify-center">
                          <div className="flex items-center border border-gray-200 rounded-xl bg-white overflow-hidden shadow-sm">
                            <button
                              onClick={() => {
                                if (item.qty === 1) handleRemove(item.id, item.capacity)
                                else updateQty(item.id, item.capacity, item.qty - 1)
                              }}
                              className="px-2.5 py-2 hover:bg-gray-50 transition-colors cursor-pointer"
                            >
                              <Minus className="w-3 h-3 text-gray-600" />
                            </button>
                            <span className="px-3 text-sm font-bold text-gray-900 min-w-[32px] text-center">{item.qty}</span>
                            <button
                              onClick={() => updateQty(item.id, item.capacity, item.qty + 1)}
                              className="px-2.5 py-2 hover:bg-gray-50 transition-colors cursor-pointer"
                            >
                              <Plus className="w-3 h-3 text-gray-600" />
                            </button>
                          </div>
                        </div>

                        {/* Total */}
                        <div className="col-span-2 text-right">
                          <span className="text-sm font-bold text-gray-900">{formatINR(item.price * item.qty)}</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Cart actions footer */}
              <div className="px-4 sm:px-6 py-3.5 bg-gray-50/60 border-t border-gray-100 flex items-center justify-between">
                <button
                  onClick={() => router.push("/products")}
                  className="sm:hidden flex items-center gap-1.5 text-xs text-blue-600 font-semibold hover:text-blue-700 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Continue Shopping
                </button>
                <button
                  onClick={clearCart}
                  className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-500 font-medium transition-colors ml-auto cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Clear Cart
                </button>
              </div>
            </div>
          </div>

          {/* ═══ ORDER SUMMARY SIDEBAR ═══ */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-24 space-y-4">

              {/* Summary Card */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-5 py-4 bg-gradient-to-r from-gray-50 to-blue-50/30 border-b border-gray-100">
                  <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide flex items-center gap-2">
                    <Package className="w-4 h-4 text-blue-600" />
                    Order Summary
                  </h2>
                </div>

                <div className="p-5 space-y-4">
                  {/* Line items */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Subtotal ({itemCount} items)</span>
                      <span className="font-semibold text-gray-900">{formatINR(total)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Shipping</span>
                      {shippingCost === 0 ? (
                        <span className="font-semibold text-emerald-600 flex items-center gap-1">
                          <Truck className="w-3.5 h-3.5" /> FREE
                        </span>
                      ) : (
                        <span className="font-semibold text-gray-900">{formatINR(shippingCost)}</span>
                      )}
                    </div>
                  </div>

                  {/* Free shipping progress */}
                  {shippingCost > 0 && (
                    <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-100">
                      <p className="text-xs text-amber-700 font-medium mb-2.5">
                        Add <span className="font-bold">{formatINR(FREE_SHIPPING_THRESHOLD - total)}</span> more for free shipping!
                      </p>
                      <div className="w-full h-2 bg-amber-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min((total / FREE_SHIPPING_THRESHOLD) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Total */}
                  <div className="border-t border-gray-100 pt-4">
                    <div className="flex justify-between items-baseline">
                      <span className="text-base font-bold text-gray-900">Total</span>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-gray-900">{formatINR(finalTotal)}</span>
                        <p className="text-[10px] text-gray-400 mt-0.5">Inclusive of all taxes</p>
                      </div>
                    </div>
                  </div>

                  {/* Checkout button */}
                  <button
                    onClick={() => router.push("/checkout")}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-200/50 active:scale-[0.98] hover:shadow-xl hover:shadow-blue-300/40 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    Proceed to Checkout
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  {/* Secure badge */}
                  <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400">
                    <Shield className="w-3.5 h-3.5" />
                    Secure & encrypted checkout
                  </div>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
                {[
                  {
                    icon: <Truck className="w-4 h-4 text-emerald-600" />,
                    bg: "bg-emerald-50",
                    title: "Free Delivery",
                    desc: "On orders above ₹10,000",
                  },
                  {
                    icon: <Shield className="w-4 h-4 text-blue-600" />,
                    bg: "bg-blue-50",
                    title: "Secure Payment",
                    desc: "100% encrypted transactions",
                  },
                  {
                    icon: <BadgePercent className="w-4 h-4 text-violet-600" />,
                    bg: "bg-violet-50",
                    title: "Best Prices",
                    desc: "Price match guarantee",
                  },
                ].map((badge, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl ${badge.bg} flex items-center justify-center shrink-0`}>
                      {badge.icon}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-800">{badge.title}</p>
                      <p className="text-[11px] text-gray-400">{badge.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
