"use client"

import { useCart } from "@/app/context/CartContext"
import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"
import { formatINR } from "@/app/lib/currency"
import {
  MapPin, CreditCard, Banknote, ChevronRight, Package, Loader2,
  Plus, Trash2, ShoppingCart,
} from "lucide-react"
import AuthGuard from "@/app/components/AuthGuard"

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL!

declare global {
  interface Window {
    Razorpay: any
  }
}

export default function CheckoutPage() {
  const router = useRouter()
  const { cart, total, updateQty, removeFromCart, clearCart } = useCart()

  const [savedAddresses, setSavedAddresses] = useState<any[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)

  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [street, setStreet] = useState("")
  const [apt, setApt] = useState("")
  const [city, setCity] = useState("")
  const [zip, setZip] = useState("")

  const [paymentMethod, setPaymentMethod] = useState<"upi" | "cod" | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const razorpayOpened = useRef(false)

  const tax = total * 0.18
  const finalAmount = total + tax

  /* LOAD ADDRESSES */
  const applyAddress = (addr: any) => {
    setSelectedAddressId(addr.id)
    setFullName(addr.full_name)
    setPhone(addr.phone)
    setStreet(addr.street)
    setApt(addr.apartment)
    setCity(addr.city)
    setZip(addr.postal_code)
  }

  useEffect(() => {
    const token = localStorage.getItem("accessToken")
    if (!token) return

    fetch(`${API_URL}/addresses`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.addresses) {
          setSavedAddresses(data.addresses)
          const defaultAddress = data.addresses.find((a: any) => a.is_default)
          if (defaultAddress) applyAddress(defaultAddress)
        }
      })
      .catch(() => {})
  }, [])

  /* CREATE ORDER */
  const createOrder = async () => {
    const token = localStorage.getItem("accessToken")

    const res = await fetch(`${API_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        items: cart,
        customer_name: fullName,
        phone,
        address: { street, city, zip },
        total_amount: finalAmount
      })
    })

    if (!res.ok) throw new Error("Failed to create order")

    const data = await res.json()
    return data.order.id
  }

  /* LOAD RAZORPAY */
  const loadRazorpay = () => {
    return new Promise<void>((resolve, reject) => {
      if (window.Razorpay) { resolve(); return }
      const script = document.createElement("script")
      script.src = "https://checkout.razorpay.com/v1/checkout.js"
      script.onload = () => resolve()
      script.onerror = () => reject()
      document.body.appendChild(script)
    })
  }

  /* ONLINE PAYMENT (PRODUCT) */
  const handleRazorpay = async () => {
    if (razorpayOpened.current) return
    razorpayOpened.current = true

    try {
      await loadRazorpay()
      const orderId = await createOrder()
      const token = localStorage.getItem("accessToken")

      const orderRes = await fetch(`${API_URL}/payments/product-razorpay-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ order_id: orderId, amount: finalAmount })
      })

      if (!orderRes.ok) throw new Error("Failed to create payment order")

      const orderData = await orderRes.json()

      const options = {
        key: orderData.key,
        order_id: orderData.orderId,
        amount: Math.round(finalAmount * 100),
        currency: "INR",
        name: "Metro Cool",
        handler: async function (response: any) {
          try {
            const verifyRes = await fetch(`${API_URL}/payments/product-verify`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
              },
              body: JSON.stringify({
                order_id: orderId,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              })
            })
            if (!verifyRes.ok) {
              toast.error("Payment verification failed. Please contact support.")
              setIsProcessing(false)
              razorpayOpened.current = false
              return
            }
            clearCart()
            router.push(`/checkout/order-success?order_id=${orderId}`)
          } catch {
            toast.error("Payment verified but confirmation failed. Check your orders.")
            router.push(`/checkout/order-success?order_id=${orderId}`)
          }
        },
        modal: {
          ondismiss: () => {
            razorpayOpened.current = false
            setIsProcessing(false)
          }
        }
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (err: any) {
      razorpayOpened.current = false
      setIsProcessing(false)
      toast.error(err.message || "Payment failed")
    }
  }

  /* COD */
  const handleCOD = async () => {
    try {
      const orderId = await createOrder()
      const token = localStorage.getItem("accessToken") || localStorage.getItem("token")

      // Try to mark as COD — non-fatal if this fails
      try {
        await fetch(`${API_URL}/orders/cod`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ order_id: orderId }),
        })
      } catch {
        // COD marking failed but order was created — still redirect
        console.warn("COD status update failed, order still created")
      }

      clearCart()
      router.push(`/checkout/order-success?order_id=${orderId}`)
    } catch (err: any) {
      toast.error(err.message || "Failed to place order. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  /* CHECKOUT */
  const handleCheckout = () => {
    if (!fullName || !phone || !street || !city || !zip) {
      toast.error("Please fill in all address fields")
      return
    }

    if (!paymentMethod) {
      toast.error("Please select a payment method")
      return
    }

    setIsProcessing(true)

    if (paymentMethod === "upi") handleRazorpay()
    if (paymentMethod === "cod") handleCOD()
  }

  /* EMPTY CART STATE */
  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-5">
          <ShoppingCart className="w-8 h-8 text-gray-400" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Add some products to get started.</p>
        <button
          onClick={() => router.push("/products")}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
        >
          Browse Products
        </button>
      </div>
    )
  }

  return (
    <AuthGuard>
    <div className="min-h-screen bg-[#f8fafc] py-8 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-xs text-slate-500">
          <button onClick={() => router.push("/products")} className="hover:text-blue-600">Products</button>
          <ChevronRight className="h-3 w-3" />
          <span className="text-slate-900 font-medium">Checkout</span>
        </nav>

        <h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-6">

          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 space-y-5">

            {/* SAVED ADDRESSES */}
            {savedAddresses.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <h2 className="font-semibold text-gray-900">Saved Addresses</h2>
                </div>
                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {savedAddresses.map(addr => (
                    <button
                      key={addr.id}
                      onClick={() => applyAddress(addr)}
                      className={`text-left p-4 rounded-xl border-2 transition-all ${
                        selectedAddressId === addr.id
                          ? "border-blue-500 bg-blue-50/50"
                          : "border-gray-100 hover:border-gray-200"
                      }`}
                    >
                      <p className="font-semibold text-sm text-gray-900">
                        {addr.label}
                        {addr.is_default && (
                          <span className="ml-2 text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded-full">
                            Default
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">{addr.full_name}</p>
                      <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">
                        {addr.street}, {addr.apartment ?? ""}, {addr.city}, {addr.state} {addr.postal_code}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">{addr.phone}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ADDRESS FORM */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                <h2 className="font-semibold text-gray-900">Delivery Address</h2>
              </div>
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Full Name</label>
                    <input
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:bg-white focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Phone</label>
                    <input
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="9876543210"
                      className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:bg-white focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Street Address</label>
                  <input
                    value={street}
                    onChange={e => setStreet(e.target.value)}
                    placeholder="123, Main Street"
                    className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:bg-white focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Apartment</label>
                    <input
                      value={apt}
                      onChange={e => setApt(e.target.value)}
                      placeholder="Apt 4B"
                      className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:bg-white focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">City</label>
                    <input
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      placeholder="Ahmedabad"
                      className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:bg-white focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">PIN Code</label>
                    <input
                      value={zip}
                      onChange={e => setZip(e.target.value)}
                      placeholder="380001"
                      className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:bg-white focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* PAYMENT METHOD */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-blue-600" />
                <h2 className="font-semibold text-gray-900">Payment Method</h2>
              </div>
              <div className="p-4 space-y-3">
                <button
                  onClick={() => setPaymentMethod("upi")}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                    paymentMethod === "upi"
                      ? "border-blue-500 bg-blue-50/50"
                      : "border-gray-100 hover:border-gray-200"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    paymentMethod === "upi" ? "bg-blue-100" : "bg-gray-100"
                  }`}>
                    <CreditCard className="w-5 h-5" style={{ color: paymentMethod === "upi" ? "#2563eb" : "#6b7280" }} />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-gray-900">Online Payment</p>
                    <p className="text-xs text-gray-400">UPI, Cards, Net Banking via Razorpay</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === "upi" ? "border-blue-600" : "border-gray-300"
                  }`}>
                    {paymentMethod === "upi" && <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />}
                  </div>
                </button>

                <button
                  onClick={() => setPaymentMethod("cod")}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                    paymentMethod === "cod"
                      ? "border-blue-500 bg-blue-50/50"
                      : "border-gray-100 hover:border-gray-200"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    paymentMethod === "cod" ? "bg-blue-100" : "bg-gray-100"
                  }`}>
                    <Banknote className="w-5 h-5" style={{ color: paymentMethod === "cod" ? "#2563eb" : "#6b7280" }} />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-gray-900">Cash on Delivery</p>
                    <p className="text-xs text-gray-400">Pay when you receive the product</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === "cod" ? "border-blue-600" : "border-gray-300"
                  }`}>
                    {paymentMethod === "cod" && <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />}
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN — ORDER SUMMARY */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden sticky top-24">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
                <Package className="w-4 h-4 text-blue-600" />
                <h2 className="font-semibold text-gray-900">Order Summary</h2>
              </div>

              {/* Cart Items */}
              <div className="p-4 space-y-3 max-h-72 overflow-y-auto">
                {cart.map(item => (
                  <div key={item.id + item.capacity} className="flex gap-3 pb-3 border-b border-gray-50 last:border-0">
                    <img src={item.image} className="w-16 h-16 rounded-xl object-cover border border-gray-100" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-gray-900 truncate">{item.title}</p>
                      <p className="text-xs text-gray-400">{item.capacity}</p>
                      <p className="text-sm font-bold text-blue-600 mt-0.5">{formatINR(item.price)}</p>

                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center border border-gray-200 rounded-lg">
                          <button
                            onClick={() => {
                              if (item.qty === 1) removeFromCart(item.id, item.capacity)
                              else updateQty(item.id, item.capacity, item.qty - 1)
                            }}
                            className="px-2 py-1 hover:bg-gray-50 rounded-l-lg"
                          >
                            <Plus className="w-3 h-3 rotate-180" />
                          </button>
                          <span className="px-2 text-sm font-semibold">{item.qty}</span>
                          <button
                            onClick={() => updateQty(item.id, item.capacity, item.qty + 1)}
                            className="px-2 py-1 hover:bg-gray-50 rounded-r-lg"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id, item.capacity)}
                          className="ml-auto p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-red-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="px-5 py-4 bg-gray-50/60 border-t border-gray-100 space-y-2.5">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium">{formatINR(total)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Tax (18% GST)</span>
                  <span className="font-medium">{formatINR(Math.round(tax))}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping</span>
                  <span className="font-medium text-emerald-600">FREE</span>
                </div>
                <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span className="text-blue-600">{formatINR(Math.round(finalAmount))}</span>
                </div>
              </div>

              {/* Place Order Button */}
              <div className="p-5">
                <button
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  className="w-full py-3.5 rounded-xl font-bold text-white transition-all bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing…
                    </>
                  ) : (
                    <>
                      Place Order — {formatINR(Math.round(finalAmount))}
                    </>
                  )}
                </button>
                <p className="text-center text-xs text-gray-400 mt-3">
                  🔒 Secure encrypted checkout
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </AuthGuard>
  )
}
