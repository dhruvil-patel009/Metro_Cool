"use client"

import { useEffect, useRef, useState } from "react"
import { useSearchParams } from "next/navigation"
import {
  Download, Lock, Copy, Check, CreditCard, Banknote,
  ShieldCheck, Wrench, CalendarDays, Clock, User, Receipt,
  Loader2, AlertCircle, RefreshCw,
} from "lucide-react"
import { toast } from "react-toastify"
import { formatINR } from "@/app/lib/currency"

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL!

// Max time to poll before showing a "taking longer" warning (ms)
const POLL_TIMEOUT_MS = 3 * 60 * 1000 // 3 minutes
const POLL_INTERVAL_MS = 3000

// Safe token getter — reads from both possible keys
const getToken = (): string | null => {
  if (typeof window === "undefined") return null
  return (
    localStorage.getItem("accessToken") ||
    localStorage.getItem("token") ||
    null
  )
}

declare global {
  interface Window { Razorpay: any }
}

export default function CompletionContent() {
  const searchParams = useSearchParams()

  const [bookingId, setBookingId] = useState<string | null>(null)
  const [bookingError, setBookingError] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "cash" | null>(null)
  const [paymentConfirmed, setPaymentConfirmed] = useState(false)
  const [copied, setCopied] = useState(false)
  const [booking, setBooking] = useState<any>(null)
  const [serviceOTP, setServiceOTP] = useState<string | null>(null)
  const [checkingPayment, setCheckingPayment] = useState(false)
  const [pollTimedOut, setPollTimedOut] = useState(false)
  const [razorpayPaymentId, setRazorpayPaymentId] = useState<string | null>(null)
  const [paying, setPaying] = useState(false)
  const [downloadingInvoice, setDownloadingInvoice] = useState(false)

  const fetchedRef = useRef(false)
  const pollingRef = useRef<NodeJS.Timeout | null>(null)
  const pollTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const razorpayOpened = useRef(false)
  const confirmedRef = useRef(false) // prevents duplicate "Payment Confirmed" toasts

  // ── Amount: always use booking.total_amount as single source of truth ──
  const totalAmount = Number(booking?.total_amount || 0)
  const servicePrice = Number(booking?.service_price || 0)
  // If tax field is missing/zero but total > service_price, derive tax from the difference
  const storedTax = Number(booking?.tax || 0)
  const taxAmount = storedTax > 0
    ? storedTax
    : Math.max(0, totalAmount - servicePrice)

  // ── Read bookingId from URL ──
  useEffect(() => {
    const id = searchParams.get("id")
    if (id && id.length > 10) {
      setBookingId(id)
    } else {
      setBookingError(true)
    }
  }, [])

  // ── Fetch booking ──
  useEffect(() => {
    if (!bookingId || fetchedRef.current) return
    fetchedRef.current = true

    const token = getToken()
    fetch(`${API_URL}/bookings/${bookingId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then(data => {
        setBooking(data.booking)
        if (data.booking?.payment_status === "completed") {
          setServiceOTP(data.booking.closure_otp)
          setPaymentConfirmed(true)
        }
      })
      .catch(() => {
        setBookingError(true)
        toast.error("Failed to load booking details")
      })
  }, [bookingId])

  // ── Cleanup on unmount ──
  useEffect(() => {
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current)
      if (pollTimeoutRef.current) clearTimeout(pollTimeoutRef.current)
    }
  }, [])

  // ── Stop polling ──
  const stopPolling = () => {
    if (pollingRef.current) { clearInterval(pollingRef.current); pollingRef.current = null }
    if (pollTimeoutRef.current) { clearTimeout(pollTimeoutRef.current); pollTimeoutRef.current = null }
    setCheckingPayment(false)
  }

  // ── Start polling for payment confirmation ──
  const waitForPaymentConfirmation = () => {
    if (!bookingId || pollingRef.current) return

    const token = getToken()
    setCheckingPayment(true)
    setPollTimedOut(false)

    // Safety timeout — stop polling after 3 minutes
    pollTimeoutRef.current = setTimeout(() => {
      stopPolling()
      setPollTimedOut(true)
    }, POLL_TIMEOUT_MS)

    pollingRef.current = setInterval(async () => {
      try {
        const res = await fetch(`${API_URL}/bookings/${bookingId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        if (data?.booking?.payment_status === "completed" && !confirmedRef.current) {
          confirmedRef.current = true  // set FIRST — blocks any concurrent ticks
          setServiceOTP(data.booking.closure_otp)
          setPaymentConfirmed(true)
          setBooking(data.booking)
          stopPolling()
          toast.success("Payment Confirmed!")
        }
      } catch (_) { /* silently retry */ }
    }, POLL_INTERVAL_MS)
  }

  // ── Load Razorpay SDK ──
  const loadRazorpay = () => new Promise<void>((resolve, reject) => {
    if (typeof window === "undefined") return reject(new Error("SSR"))
    if (window.Razorpay) return resolve()
    const existing = document.querySelector<HTMLScriptElement>(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    )
    if (existing) {
      existing.addEventListener("load", () => resolve())
      existing.addEventListener("error", () => reject(new Error("Script load failed")))
      return
    }
    const s = document.createElement("script")
    s.src = "https://checkout.razorpay.com/v1/checkout.js"
    s.async = true
    s.onload = () => (window.Razorpay ? resolve() : reject(new Error("Razorpay not available")))
    s.onerror = () => reject(new Error("Script load failed"))
    document.body.appendChild(s)
  })

  // ── Handle Razorpay payment ──
  const handleRazorpay = async () => {
    if (razorpayOpened.current) return
    razorpayOpened.current = true
    setPaying(true)

    try {
      await loadRazorpay()
    } catch {
      toast.error("Payment gateway failed to load. Please try again.")
      razorpayOpened.current = false
      setPaying(false)
      return
    }

    if (!totalAmount || totalAmount <= 0) {
      toast.error("Invalid payment amount")
      razorpayOpened.current = false
      setPaying(false)
      return
    }

    const token = getToken()

    let orderData: any
    try {
      const orderRes = await fetch(`${API_URL}/payments/razorpay-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ booking_id: bookingId, amount: totalAmount }),
      })
      orderData = await orderRes.json()
      if (!orderRes.ok || !orderData.orderId) {
        throw new Error(orderData.error || orderData.message || "Order creation failed")
      }
    } catch (err: any) {
      toast.error(err.message || "Could not create payment order")
      razorpayOpened.current = false
      setPaying(false)
      return
    }

    const options = {
      key: orderData.key,
      order_id: orderData.orderId,
      amount: Math.round(totalAmount * 100),
      currency: "INR",
      name: "Metro Cool",
      description: booking?.service?.title || "Service Payment",
      image: "/logo.png",
      prefill: {
        name: booking?.user?.full_name || "",
        contact: booking?.user?.phone || "",
      },
      theme: { color: "#2563eb" },
      handler: async (response: any) => {
        try {
          setRazorpayPaymentId(response.razorpay_payment_id)

          const verifyRes = await fetch(`${API_URL}/payments/verify`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({
              booking_id: bookingId,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            }),
          })

          if (!verifyRes.ok) {
            const errData = await verifyRes.json().catch(() => ({}))
            toast.error(errData.error || "Payment verification failed. Contact support.")
            razorpayOpened.current = false
            return
          }

          // Verify returned success — start polling for booking update
          waitForPaymentConfirmation()
        } catch {
          toast.error("Network error during verification. Your payment may have succeeded — please check your bookings.")
          // Still start polling — the payment may have gone through
          waitForPaymentConfirmation()
        }
      },
      modal: {
        ondismiss: () => {
          razorpayOpened.current = false
          setPaying(false)
        },
      },
    }

    const rzp = new window.Razorpay(options)
    rzp.on("payment.failed", (response: any) => {
      const reason = response?.error?.description || "Payment failed. Please try again."
      toast.error(reason)
      razorpayOpened.current = false
      setPaying(false)
    })
    rzp.open()
    // setPaying(false) here would prematurely clear — it clears in ondismiss/success
  }

  // ── Handle cash payment ──
  const handleCashPayment = async () => {
    if (!bookingId) return
    setPaying(true)
    try {
      const token = getToken()
      const res = await fetch(`${API_URL}/payments/cash`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ booking_id: bookingId }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || "Cash payment failed")
        return
      }
      toast.success("Cash payment recorded")
      waitForPaymentConfirmation()
    } catch {
      toast.error("Network error. Please try again.")
    } finally {
      setPaying(false)
    }
  }

  // ── Copy OTP ──
  const copyOTP = () => {
    if (!serviceOTP) return
    navigator.clipboard.writeText(serviceOTP)
    setCopied(true)
    toast.success("OTP copied!")
    setTimeout(() => setCopied(false), 2000)
  }

  // ── Download invoice ──
  const downloadInvoice = async () => {
    if (!bookingId) return
    setDownloadingInvoice(true)
    try {
      const token = getToken()
      const res = await fetch(`${API_URL}/payments/invoice/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (!res.ok || !data?.invoice_url) {
        console.error("[invoice] API error:", data)
        toast.error(data?.error || "Invoice not ready yet. Please try again in a moment.")
        return
      }
      console.log("[invoice] opening URL:", data.invoice_url)
      window.open(data.invoice_url, "_blank")
    } catch (err) {
      console.error("[invoice] download error:", err)
      toast.error("Failed to download invoice. Please try again.")
    } finally {
      setDownloadingInvoice(false)
    }
  }

  // ── Derived values ──
  const serviceName = booking?.service?.title || "AC Service"
  const serviceRef = booking?.id || ""
  const technicianName = booking?.technician?.full_name || booking?.technician?.name || "Pending Assignment"
  const serviceDate = booking?.booking_date
    ? new Date(booking.booking_date).toLocaleDateString("en-IN", {
        day: "2-digit", month: "short", year: "numeric",
      })
    : "—"
  const serviceTime = booking?.time_slot || ""

  // ── Error state ──
  if (bookingError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="text-center space-y-4 max-w-sm">
          <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-7 h-7 text-red-500" />
          </div>
          <h2 className="text-lg font-bold text-[#1d242d]">Booking not found</h2>
          <p className="text-sm text-gray-500">
            We couldn't load your booking. Please go back and try again, or contact support.
          </p>
          <button
            onClick={() => window.history.back()}
            className="text-blue-600 text-sm font-medium hover:underline"
          >
            ← Go back
          </button>
        </div>
      </div>
    )
  }

  // ── Loading state ──
  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="loader-wrapper">
          <div className="loader"></div>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-white py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">

        {/* ── Header ── */}
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1d242d]">Service Completion</h1>
            <p className="text-gray-500 mt-1 text-sm">Complete payment to receive your closure OTP</p>
          </div>
          <span className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border self-start ${
            paymentConfirmed
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-amber-50 text-amber-700 border-amber-200"
          }`}>
            <span className={`w-2 h-2 rounded-full ${
              paymentConfirmed ? "bg-emerald-500" : "bg-amber-500 animate-pulse"
            }`} />
            {paymentConfirmed ? "Payment Completed" : "Payment Pending"}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 lg:gap-6">

          {/* ═══ LEFT COLUMN ═══ */}
          <div className="lg:col-span-3 space-y-5">

            {/* Booking info */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-blue-500 via-blue-400 to-cyan-400" />
              <div className="p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                    <Wrench className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{serviceName}</p>
                    <p className="text-xs text-gray-400">Ref #{serviceRef.slice(0, 8).toUpperCase()}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-gray-50 rounded-xl p-3">
                    <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                      <User className="w-3.5 h-3.5" /> Technician
                    </div>
                    <p className={`font-semibold text-sm truncate ${booking?.technician ? "text-gray-900" : "text-gray-400 italic"}`}>
                      {technicianName}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                      <CalendarDays className="w-3.5 h-3.5" /> Date
                    </div>
                    <p className="font-semibold text-gray-900 text-sm">{serviceDate}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                      <Clock className="w-3.5 h-3.5" /> Time
                    </div>
                    <p className="font-semibold text-gray-900 text-sm">{serviceTime || "—"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bill summary */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-gray-400" />
                  <h3 className="font-bold text-gray-900">Bill Summary</h3>
                </div>
                {paymentConfirmed && (
                  <button
                    onClick={downloadInvoice}
                    disabled={downloadingInvoice}
                    className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors disabled:opacity-60"
                  >
                    {downloadingInvoice
                      ? <Loader2 className="w-4 h-4 animate-spin" />
                      : <Download className="w-4 h-4" />}
                    Download Receipt
                  </button>
                )}
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-3 border-b border-gray-50">
                  <span className="text-gray-600">{serviceName}</span>
                  <span className="font-semibold text-gray-900">{formatINR(servicePrice)}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-50">
                  <span className="text-gray-500 text-sm">GST / Taxes (18%)</span>
                  <span className="font-medium text-gray-700">{formatINR(taxAmount)}</span>
                </div>
                <div className="flex justify-between items-center pt-3">
                  <span className="font-bold text-gray-900 text-lg">Total Payable</span>
                  <span className="font-bold text-blue-600 text-2xl">{formatINR(totalAmount)}</span>
                </div>
              </div>
            </div>

            {/* Payment success banner */}
            {paymentConfirmed && (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-green-900">Payment Successful</p>
                    <p className="text-sm text-green-700">
                      {razorpayPaymentId
                        ? `Payment ID: ${razorpayPaymentId}`
                        : `Ref: #${serviceRef.slice(0, 8).toUpperCase()}`}
                    </p>
                  </div>
                </div>
                <button
                  onClick={downloadInvoice}
                  disabled={downloadingInvoice}
                  className="w-full flex items-center justify-center gap-2 bg-white border border-green-300 text-green-700 hover:bg-green-100 py-2.5 rounded-xl font-semibold text-sm transition-colors disabled:opacity-60"
                >
                  {downloadingInvoice
                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating…</>
                    : <><Download className="w-4 h-4" /> Download Invoice</>}
                </button>
              </div>
            )}
          </div>

          {/* ═══ RIGHT COLUMN ═══ */}
          <div className="lg:col-span-2 space-y-5">

            {/* Payment card */}
            {!paymentConfirmed ? (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-blue-500 to-cyan-500" />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-gray-900 text-lg">Make Payment</h3>
                    <span className="bg-red-50 text-red-600 text-xs font-bold px-3 py-1 rounded-full border border-red-100">
                      DUE NOW
                    </span>
                  </div>
                  <p className="text-3xl font-bold text-gray-900 mt-4 mb-6">{formatINR(totalAmount)}</p>

                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Choose Method</p>
                  <div className="space-y-3 mb-6">
                    {/* UPI */}
                    <button
                      onClick={() => setPaymentMethod("upi")}
                      className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200 ${
                        paymentMethod === "upi"
                          ? "border-blue-600 bg-blue-50 shadow-sm"
                          : "border-gray-100 hover:border-gray-200 bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          paymentMethod === "upi" ? "bg-blue-100" : "bg-white border border-gray-200"
                        }`}>
                          <CreditCard className={`w-5 h-5 ${paymentMethod === "upi" ? "text-blue-600" : "text-gray-500"}`} />
                        </div>
                        <div className="text-left">
                          <p className="font-semibold text-gray-900 text-sm">UPI / Online</p>
                          <p className="text-xs text-gray-400">GPay, PhonePe, Card, NetBanking</p>
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        paymentMethod === "upi" ? "border-blue-600 bg-blue-600" : "border-gray-300"
                      }`}>
                        {paymentMethod === "upi" && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                    </button>

                    {/* Cash */}
                    <button
                      onClick={() => setPaymentMethod("cash")}
                      className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200 ${
                        paymentMethod === "cash"
                          ? "border-blue-600 bg-blue-50 shadow-sm"
                          : "border-gray-100 hover:border-gray-200 bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          paymentMethod === "cash" ? "bg-blue-100" : "bg-white border border-gray-200"
                        }`}>
                          <Banknote className={`w-5 h-5 ${paymentMethod === "cash" ? "text-blue-600" : "text-gray-500"}`} />
                        </div>
                        <div className="text-left">
                          <p className="font-semibold text-gray-900 text-sm">Cash</p>
                          <p className="text-xs text-gray-400">Pay directly to technician</p>
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        paymentMethod === "cash" ? "border-blue-600 bg-blue-600" : "border-gray-300"
                      }`}>
                        {paymentMethod === "cash" && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      if (paymentMethod === "upi") handleRazorpay()
                      if (paymentMethod === "cash") handleCashPayment()
                    }}
                    disabled={!paymentMethod || paying}
                    className={`w-full py-4 rounded-xl font-bold text-white text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                      !paymentMethod || paying
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg active:scale-[0.98]"
                    }`}
                  >
                    {paying
                      ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing…</>
                      : <>Pay {formatINR(totalAmount)}</>}
                  </button>

                  <div className="flex items-center justify-center gap-2 mt-4">
                    <ShieldCheck className="w-3.5 h-3.5 text-gray-300" />
                    <span className="text-xs text-gray-400">Secured by Razorpay · 256-bit SSL</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white shadow-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold">Payment Complete</p>
                    <p className="text-blue-200 text-xs">{formatINR(totalAmount)} paid</p>
                  </div>
                </div>
                <p className="text-blue-100 text-sm">
                  Share the OTP below with your technician to close the service.
                </p>
              </div>
            )}

            {/* OTP card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Lock className={`w-5 h-5 ${paymentConfirmed ? "text-green-500" : "text-gray-300"}`} />
                  <div>
                    <p className="font-bold text-gray-900 text-sm">Service Closure OTP</p>
                    <p className="text-xs text-gray-400">
                      {paymentConfirmed
                        ? "Share this with your technician to close the job"
                        : "Unlocks after payment is confirmed"}
                    </p>
                  </div>
                </div>

                {/* OTP digits */}
                <div className={`flex justify-center gap-3 my-5 transition-all ${
                  !paymentConfirmed ? "opacity-20 pointer-events-none select-none" : ""
                }`}>
                  {(serviceOTP || "----").split("").map((digit, i) => (
                    <div
                      key={i}
                      className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-bold border-2 ${
                        paymentConfirmed
                          ? "bg-blue-50 border-blue-200 text-blue-700"
                          : "bg-gray-50 border-gray-200 text-gray-300"
                      }`}
                    >
                      {digit}
                    </div>
                  ))}
                </div>

                {/* Polling indicator */}
                {checkingPayment && !paymentConfirmed && (
                  <div className="flex items-center justify-center gap-2 text-sm text-amber-600 bg-amber-50 rounded-xl p-3 mb-4">
                    <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
                    <span>Confirming your payment…</span>
                  </div>
                )}

                {/* Poll timed out */}
                {pollTimedOut && !paymentConfirmed && (
                  <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-4 space-y-3">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-orange-700">
                        Payment is taking longer than expected. If you were charged, it will appear in your bookings shortly.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setPollTimedOut(false)
                        fetchedRef.current = false
                        // Re-check booking status manually
                        const token = getToken()
                        fetch(`${API_URL}/bookings/${bookingId}`, {
                          headers: { Authorization: `Bearer ${token}` },
                        })
                          .then(r => r.json())
                          .then(data => {
                            if (data?.booking?.payment_status === "completed" && !confirmedRef.current) {
                              confirmedRef.current = true
                              setServiceOTP(data.booking.closure_otp)
                              setPaymentConfirmed(true)
                              setBooking(data.booking)
                              toast.success("Payment Confirmed!")
                            } else {
                              waitForPaymentConfirmation()
                            }
                          })
                          .catch(() => toast.error("Could not check status"))
                      }}
                      className="flex items-center gap-2 text-sm text-orange-700 font-semibold hover:text-orange-800 transition-colors"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Check again
                    </button>
                  </div>
                )}

                {paymentConfirmed && (
                  <div className="space-y-3">
                    <button
                      onClick={copyOTP}
                      className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-semibold text-sm transition-all flex items-center justify-center gap-2"
                    >
                      {copied
                        ? <><Check className="w-4 h-4" /> Copied!</>
                        : <><Copy className="w-4 h-4" /> Copy OTP</>}
                    </button>
                    <button
                      onClick={downloadInvoice}
                      disabled={downloadingInvoice}
                      className="w-full py-3 rounded-xl border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-gray-700 font-semibold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                      {downloadingInvoice
                        ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating…</>
                        : <><Download className="w-4 h-4" /> Download Receipt</>}
                    </button>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  )
}
