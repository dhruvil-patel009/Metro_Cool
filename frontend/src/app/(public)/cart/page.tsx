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

  // Shipping logic: Free above ₹10,000, otherwise ₹499
  const FREE_SHIPPING_THRESHOLD = 10000
  const SHIPPING_FEE = 499
  const shippingCost = total >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE
  const tax = Math.round(total * 0.18)
  const finalTotal = total + tax + shippingCost

  const handleRemove = (id: string, capacity: string) => {
    setRemovingId(id + capacity)
    setTimeout(() => {
      removeFromCart(id, capacity)
      setRemovingId(null)
    }, 300)
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[#f8f9fa] px-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="w-10 h-10 text-gray-300" />
          </div>
          <h1 className="text-2xl font-bold text-[#1d242d] mb-2">Your cart is empty</h1>
          <p className="text-sm text-gray-500 mb-6 leading-relaxed">
            Looks like you haven&apos;t added any products yet. Browse our collection of air conditioners and accessories.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold text-sm rounded-xl hover:bg-blue-700 transition-all shadow-sm"
            >
              <ShoppingBag className="w-4 h-4" />
              Browse Products
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-700 font-semibold text-sm rounded-xl border border-gray-200 hover:bg-gray-50 transition-all"
            >
              Browse Services
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#1d242d]">
              Shopping Cart
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              {itemCount} item{itemCount !== 1 ? "s" : ""} in your cart
            </p>
          </div>
          <button
            onClick={() => router.push("/products")}
            className="hidden sm:flex items-center gap-2 text-sm text-blue-600 font-medium hover:text-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Continue Shopping
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* ═══ CART ITEMS ═══ */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

              {/* Table header - desktop */}
              <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                <div className="col-span-6">Product</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-right">Total</div>
              </div>

              {/* Items */}
              <div className="divide-y divide-gray-100">
                {cart.map((item) => {
                  const isRemoving = removingId === item.id + item.capacity
                  return (
                    <div
                      key={item.id + item.capacity}
                      className={`px-4 sm:px-6 py-4 sm:py-5 transition-all duration-300 ${
                        isRemoving ? "opacity-0 -translate-x-4" : "opacity-100"
                      }`}
                    >
                      {/* Mobile Layout */}
                      <div className="sm:hidden flex gap-3">
                        <div className="relative w-20 h-20 rounded-xl border border-gray-100 bg-gray-50 overflow-hidden shrink-0">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.title}
                            fill
                            className="object-contain p-2"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">{item.title}</h3>
                          <p className="text-[11px] text-gray-500 mt-0.5">Capacity: {item.capacity}</p>
                          <p className="text-sm font-bold text-blue-600 mt-1">{formatINR(item.price)}</p>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center border border-gray-200 rounded-lg bg-white">
                              <button
                                onClick={() => {
                                  if (item.qty === 1) handleRemove(item.id, item.capacity)
                                  else updateQty(item.id, item.capacity, item.qty - 1)
                                }}
                                className="px-2.5 py-1.5 hover:bg-gray-50 transition-colors"
                              >
                                <Minus className="w-3 h-3 text-gray-600" />
                              </button>
                              <span className="px-3 text-sm font-semibold text-gray-900">{item.qty}</span>
                              <button
                                onClick={() => updateQty(item.id, item.capacity, item.qty + 1)}
                                className="px-2.5 py-1.5 hover:bg-gray-50 transition-colors"
                              >
                                <Plus className="w-3 h-3 text-gray-600" />
                              </button>
                            </div>
                            <button
                              onClick={() => handleRemove(item.id, item.capacity)}
                              className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Desktop Layout */}
                      <div className="hidden sm:grid grid-cols-12 gap-4 items-center">
                        {/* Product */}
                        <div className="col-span-6 flex items-center gap-4">
                          <div className="relative w-20 h-20 rounded-xl border border-gray-100 bg-gray-50 overflow-hidden shrink-0">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.title}
                              fill
                              className="object-contain p-2"
                            />
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 hover:text-blue-600 transition-colors">
                              <Link href={`/products/${item.id}`}>{item.title}</Link>
                            </h3>
                            <p className="text-xs text-gray-500 mt-1">Capacity: {item.capacity}</p>
                            <button
                              onClick={() => handleRemove(item.id, item.capacity)}
                              className="mt-1.5 flex items-center gap-1 text-[11px] text-red-500 hover:text-red-600 font-medium transition-colors"
                            >
                              <Trash2 className="w-3 h-3" />
                              Remove
                            </button>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="col-span-2 text-center">
                          <span className="text-sm font-semibold text-gray-900">{formatINR(item.price)}</span>
                        </div>

                        {/* Quantity */}
                        <div className="col-span-2 flex justify-center">
                          <div className="flex items-center border border-gray-200 rounded-lg bg-white">
                            <button
                              onClick={() => {
                                if (item.qty === 1) handleRemove(item.id, item.capacity)
                                else updateQty(item.id, item.capacity, item.qty - 1)
                              }}
                              className="px-2.5 py-1.5 hover:bg-gray-50 transition-colors"
                            >
                              <Minus className="w-3 h-3 text-gray-600" />
                            </button>
                            <span className="px-3 text-sm font-semibold text-gray-900 min-w-[28px] text-center">{item.qty}</span>
                            <button
                              onClick={() => updateQty(item.id, item.capacity, item.qty + 1)}
                              className="px-2.5 py-1.5 hover:bg-gray-50 transition-colors"
                            >
                              <Plus className="w-3 h-3 text-gray-600" />
                            </button>
                          </div>
                        </div>

                        {/* Total */}
                        <div className="col-span-2 text-right">
                          <span className="text-sm font-bold text-[#1d242d]">{formatINR(item.price * item.qty)}</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Cart actions */}
              <div className="px-4 sm:px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                <button
                  onClick={() => router.push("/products")}
                  className="sm:hidden flex items-center gap-1.5 text-xs text-blue-600 font-medium hover:text-blue-700 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Continue Shopping
                </button>
                <button
                  onClick={clearCart}
                  className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-600 font-medium transition-colors ml-auto"
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
                <div className="px-5 py-4 bg-gray-50 border-b border-gray-100">
                  <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Order Summary</h2>
                </div>

                <div className="p-5 space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Subtotal ({itemCount} items)</span>
                      <span className="font-semibold text-gray-900">{formatINR(total)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Shipping</span>
                      {shippingCost === 0 ? (
                        <span className="font-semibold text-emerald-600">FREE</span>
                      ) : (
                        <span className="font-semibold text-gray-900">{formatINR(shippingCost)}</span>
                      )}
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">GST (18%)</span>
                      <span className="font-semibold text-gray-900">{formatINR(tax)}</span>
                    </div>
                  </div>

                  {/* Free shipping progress */}
                  {shippingCost > 0 && (
                    <div className="p-3 rounded-lg bg-amber-50 border border-amber-100">
                      <p className="text-xs text-amber-700 font-medium mb-2">
                        Add {formatINR(FREE_SHIPPING_THRESHOLD - total)} more for free shipping!
                      </p>
                      <div className="w-full h-1.5 bg-amber-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-500 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min((total / FREE_SHIPPING_THRESHOLD) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {shippingCost === 0 && (
                    <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-100">
                      <p className="text-xs text-emerald-700 font-medium flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5" />
                        You qualify for free shipping!
                      </p>
                    </div>
                  )}

                  <div className="border-t border-gray-100 pt-4">
                    <div className="flex justify-between">
                      <span className="text-base font-bold text-[#1d242d]">Total</span>
                      <span className="text-xl font-bold text-[#1d242d]">{formatINR(finalTotal)}</span>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-1 text-right">Inclusive of all taxes</p>
                  </div>

                  {/* Checkout button */}
                  <button
                    onClick={() => router.push("/checkout")}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold text-sm transition-all shadow-md shadow-blue-200 active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    Proceed to Checkout
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                      <Truck className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-800">Free Delivery</p>
                      <p className="text-[11px] text-gray-400">On all orders across India</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                      <Shield className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-800">Secure Checkout</p>
                      <p className="text-[11px] text-gray-400">100% encrypted payment</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
                      <Tag className="w-4 h-4 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-800">Best Prices</p>
                      <p className="text-[11px] text-gray-400">Guaranteed lowest prices</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
