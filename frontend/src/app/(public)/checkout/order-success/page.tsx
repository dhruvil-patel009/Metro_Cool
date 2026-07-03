"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import {
  CheckCircle, Package, ArrowRight, ShoppingBag,
  Download, Loader2, MapPin, IndianRupee,
} from "lucide-react"
import { toast } from "react-toastify"
import { Suspense } from "react"

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL!

const formatINR = (v: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(v)

function OrderSuccessContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("order_id")

  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(!!orderId)
  const [downloadingInvoice, setDownloadingInvoice] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (!orderId) return
    const token = localStorage.getItem("accessToken") || localStorage.getItem("token")
    if (!token) return

    fetch(`${API_URL}/orders/${orderId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(d => setOrder(d.order))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [orderId])

  const handleDownloadInvoice = async () => {
    if (!orderId) return
    setDownloadingInvoice(true)
    try {
      const token = localStorage.getItem("accessToken") || localStorage.getItem("token")
      const res = await fetch(`${API_URL}/payments/order-invoice/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (!res.ok || !data?.invoice_url) {
        toast.error("Invoice not ready yet. Please try again in a moment.")
        return
      }
      window.open(data.invoice_url, "_blank")
    } catch {
      toast.error("Failed to download invoice")
    } finally {
      setDownloadingInvoice(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-white px-4 py-10 sm:py-14">
      <div className={`bg-white sm:border sm:border-gray-100 sm:shadow-sm rounded-2xl sm:rounded-3xl p-5 sm:p-8 max-w-lg w-full transition-all duration-700 ${
        mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}>

        {/* Success Icon */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="relative mx-auto w-18 h-18 sm:w-20 sm:h-20 mb-4">
            <div className="absolute inset-0 bg-emerald-100 rounded-full animate-ping opacity-20" />
            <div className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-emerald-50 border-4 border-emerald-100 flex items-center justify-center">
              <CheckCircle className="w-9 h-9 sm:w-10 sm:h-10 text-emerald-500" strokeWidth={2.5} />
            </div>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#1d242d] mb-2">Order Placed Successfully!</h1>
          <p className="text-gray-500 text-sm leading-relaxed max-w-sm mx-auto">
            Thank you for your purchase. Your order has been confirmed and will be delivered soon.
          </p>
        </div>

        {/* Order Details */}
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
          </div>
        ) : order ? (
          <div className="space-y-4 mb-6">
            {/* Order ID + Status */}
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-blue-500 uppercase tracking-wide">Order ID</span>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  order.payment_status === "completed"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-amber-100 text-amber-700"
                }`}>
                  {order.payment_status === "completed" ? "Paid" : "Cash on Delivery"}
                </span>
              </div>
              <p className="font-mono text-sm font-bold text-blue-700">#{order.id.slice(0, 12).toUpperCase()}</p>
            </div>

            {/* Items */}
            <div className="border border-gray-100 rounded-2xl overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Items Ordered</p>
              </div>
              <div className="divide-y divide-gray-50">
                {(order.order_items || []).map((item: any) => (
                  <div key={item.id} className="flex items-center gap-3 p-4">
                    {item.image && (
                      <img src={item.image} className="w-14 h-14 rounded-xl object-cover border border-gray-100" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-gray-900 truncate">{item.title}</p>
                      <p className="text-xs text-gray-400">{item.capacity} × {item.qty}</p>
                    </div>
                    <p className="font-bold text-sm text-gray-900">{formatINR(item.price * item.qty)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery address */}
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-0.5">Delivery To</p>
                <p className="text-sm text-gray-700 font-medium">{order.customer_name}</p>
                <p className="text-xs text-gray-500">{order.street}, {order.city} {order.zip}</p>
              </div>
            </div>

            {/* Total */}
            <div className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="flex items-center gap-2 text-gray-600">
                <IndianRupee className="w-4 h-4" />
                <span className="font-semibold text-sm">Total Paid</span>
              </div>
              <span className="font-bold text-lg text-blue-600">{formatINR(order.total_amount)}</span>
            </div>
          </div>
        ) : (
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-6">
            <div className="flex items-center gap-3">
              <Package className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <p className="text-sm text-blue-800 font-medium">
                Your order is confirmed and will be delivered soon.
              </p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-3">
          {order?.payment_status === "completed" && (
            <button
              onClick={handleDownloadInvoice}
              disabled={downloadingInvoice}
              className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white px-6 py-3.5 rounded-xl font-semibold text-sm hover:bg-emerald-700 transition-all disabled:opacity-60 shadow-sm shadow-emerald-200"
            >
              {downloadingInvoice
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating…</>
                : <><Download className="w-4 h-4" /> Download Invoice</>}
            </button>
          )}
          <Link
            href="/products"
            className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3.5 rounded-xl font-semibold text-sm hover:bg-blue-700 transition-all shadow-sm shadow-blue-200"
          >
            <ShoppingBag className="w-4 h-4" />
            Continue Shopping
          </Link>
          <Link
            href="/profile/orders"
            className="w-full inline-flex items-center justify-center gap-2 text-gray-600 px-6 py-3 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-all border-2 border-gray-200"
          >
            View My Orders
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  )
}
