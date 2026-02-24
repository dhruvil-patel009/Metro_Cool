"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { ArrowLeft, Star, Download, Lock, Copy, Check } from "lucide-react"
import Link from "next/link"
import { toast } from "react-toastify"

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL!


declare global {
  interface Window {
    Razorpay: any
  }
}


export default function CompletionContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const bookingId = searchParams.get("id") || "MC-8293"

  const [paymentMethod, setPaymentMethod] = useState<"upi" | "cash" | null>(null)
  const [paymentConfirmed, setPaymentConfirmed] = useState(false)
  const [copied, setCopied] = useState(false)
  const [booking, setBooking] = useState<any>(null)
  const [serviceOTP, setServiceOTP] = useState<string | null>(null)

  // const serviceOTP = "4829"

  useEffect(() => {
  const script = document.createElement("script")
  script.src = "https://checkout.razorpay.com/v1/checkout.js"
  script.async = true
  document.body.appendChild(script)

  return () => {
    document.body.removeChild(script)
  }
}, [])
  const handlePayment = () => {
    // Simulate payment processing
    setTimeout(() => {
      setPaymentConfirmed(true)
      toast(`🎉 Payment Successfully! 🎉 Transaction ID: #TXN-882920`)
    }, 1000)
  }

const copyOTP = () => {
  if (!serviceOTP) return   // ⬅️ guard

  navigator.clipboard.writeText(serviceOTP)
  setCopied(true)
  toast.success("OTP copied to clipboard!")
  setTimeout(() => setCopied(false), 2000)
}


const handleRazorpay = async () => {
  if (paymentMethod !== "upi") return

  const token = localStorage.getItem("accessToken")

  const res = await fetch(`${API_URL}/payments/razorpay-order`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      booking_id: bookingId,
      amount: 150,
    }),
  })

  const { orderId, key } = await res.json()

  const options = {
    key,
    amount: 150 * 100,
    currency: "INR",
    name: "Metro Cool",
    description: "AC Service Payment",
    order_id: orderId,
    method: { upi: true },
    modal: {
  ondismiss: async function () {
    await fetch(`${API_URL}/payments/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        booking_id: bookingId,
        status: "cancelled",
      }),
    })
  }
},
    handler: async (response: any) => {
      const verifyRes = await fetch(`${API_URL}/payments/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          booking_id: bookingId,
          ...response,
        }),
      })

      const data = await verifyRes.json()
      setServiceOTP(data.closure_otp)
      setPaymentConfirmed(true)
      toast.success("Payment successful")
    },
  }

  const rzp = new window.Razorpay(options)
  rzp.open()
}

const downloadInvoice = async () => {
  const token = localStorage.getItem("accessToken")

  const res = await fetch(`${API_URL}/payments/invoice/${bookingId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  const data = await res.json()
  window.open(data.invoice_url, "_blank")
}


useEffect(() => {
  if (!bookingId) return

  const token = localStorage.getItem("accessToken")

  fetch(`${API_URL}/bookings/${bookingId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then(res => res.json())
    .then(data => setBooking(data.booking))
    .catch(() => toast.error("Failed to load booking"))
}, [bookingId])

const handleCashPayment = async () => {
  setPaymentConfirmed(true)
  setServiceOTP("4829") // or fetch from backend
  toast.success("Marked as Cash Payment")
}



  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        {/* <Link
          href={`/user/bookings?id=${bookingId}`}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Bookings</span>
        </Link> */}

        <div className="grid lg:grid-cols-[1fr_400px] gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Service Completion</h1>
                <p className="text-gray-600">Review invoice and complete payment to close the service request.</p>
              </div>
              <div className="flex items-center gap-2 bg-yellow-50 text-yellow-700 px-4 py-2 rounded-lg border border-yellow-200">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="font-semibold text-sm">Payment Pending</span>
              </div>
            </div>

            {/* Technician Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden bg-yellow-400">
                    <img
                      src="/assets/technician-working-on-ac-unit.jpg"
                      alt="Rahul Sharma"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900">Rahul Sharma</h3>
                  <p className="text-sm text-gray-600">Senior AC Technician • Metro Cool Pro</p>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold text-sm">4.8</span>
                    </div>
                    <span className="text-sm text-gray-500">500+ Jobs Completed</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500 mb-1">ID: T-8821</div>
                  <button className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Service Details */}
              <div className="grid md:grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-100">
                <div>
                  <div className="text-sm text-gray-500 uppercase tracking-wide mb-1">Service Reference</div>
                  <div className="font-bold text-gray-900">#SR-99281</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 uppercase tracking-wide mb-1">Completion Time</div>
                  <div className="font-bold text-gray-900">Oct 14, 2023 at 2:30 PM</div>
                </div>
                <div className="md:col-span-2">
                  <div className="text-sm text-gray-500 uppercase tracking-wide mb-1">Service Type</div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <span className="font-semibold text-gray-900">AC Deep Cleaning (Split Unit) + Gas Refill</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bill Summary */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Bill Summary</h3>
                <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm">
                  <Download className="w-4 h-4" />
                  Invoice
                </button>
              </div>

              <div className="space-y-4">
                <div className="pb-4 border-b border-gray-100">
                  <div className="text-sm text-gray-500 uppercase tracking-wide mb-3">Description</div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <span className="text-gray-900">Standard AC Service (x1)</span>
                      <span className="font-semibold text-gray-900">₹499.00</span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-gray-900">Gas Refill (R32) - 1.5kg</span>
                      <span className="font-semibold text-gray-900">₹800.00</span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-gray-600 text-sm">Taxes & Service Fee</span>
                      <span className="font-medium text-gray-900">₹0.00</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <span className="text-lg font-bold text-gray-900">Total Payable</span>
                  <span className="text-2xl font-bold text-blue-600">₹1,299.00</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Payment Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-blue-500 to-blue-600"></div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Make Payment</h3>
                  <div className="flex items-center gap-2 bg-red-50 text-red-600 px-3 py-1 rounded-lg">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                    <span className="font-semibold text-xs uppercase">Due Now</span>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="text-sm text-gray-500 mb-2">Total Amount</div>
                  <div className="text-4xl font-bold text-gray-900">₹1,299</div>
                </div>

                <div className="mb-6">
                  <div className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Choose Method</div>
                  <div className="space-y-3">
                    <button
                      onClick={() => setPaymentMethod("upi")}
                      className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                        paymentMethod === "upi" ? "border-blue-600 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-lg border border-gray-200 flex items-center justify-center">
                          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <div className="text-left">
                          <div className="font-semibold text-gray-900">UPI / Online</div>
                          <div className="text-xs text-gray-500">GPay, PhonePe, Paytm</div>
                        </div>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          paymentMethod === "upi" ? "border-blue-600 bg-blue-600" : "border-gray-300"
                        }`}
                      >
                        {paymentMethod === "upi" && <div className="w-2 h-2 bg-white rounded-full"></div>}
                      </div>
                    </button>

                    <button
                      onClick={() => setPaymentMethod("cash")}
                      className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                        paymentMethod === "cash"
                          ? "border-blue-600 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-lg border border-gray-200 flex items-center justify-center">
                          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                          </svg>
                        </div>
                        <div className="text-left">
                          <div className="font-semibold text-gray-900">Cash</div>
                          <div className="text-xs text-gray-500">Pay directly to technician</div>
                        </div>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          paymentMethod === "cash" ? "border-blue-600 bg-blue-600" : "border-gray-300"
                        }`}
                      >
                        {paymentMethod === "cash" && <div className="w-2 h-2 bg-white rounded-full"></div>}
                      </div>
                    </button>
                  </div>
                </div>

                <button
  onClick={() => {
    if (paymentMethod === "upi") handleRazorpay()
    if (paymentMethod === "cash") handleCashPayment()
  }}
  disabled={!paymentMethod}
  className={`w-full py-4 rounded-xl font-bold text-white transition-all ${
    !paymentMethod
      ? "bg-gray-300 cursor-not-allowed"
      : "bg-blue-600 hover:bg-blue-700"
  }`}
>
  Pay ₹150
</button>

                <div className="flex items-center justify-center gap-2 mt-4">
                  <Lock className="w-3 h-3 text-gray-400" />
                  <span className="text-xs text-gray-500">Secured by Razorpay</span>
                </div>
              </div>
            </div>

            {/* Service Closure Code */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-lg font-bold text-gray-600">2</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Service Closure Code</h3>
                    <p className="text-sm text-gray-500">Unlocks after payment confirmation</p>
                  </div>
                  <Lock className="w-5 h-5 text-gray-400 ml-auto" />
                </div>

                <div
                  className={`relative rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 p-6 transition-all ${
                    !paymentConfirmed ? "blur-sm" : ""
                  }`}
                >
                  {!paymentConfirmed && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center">
                        <Lock className="w-6 h-6 text-gray-400" />
                      </div>
                    </div>
                  )}
                  <div className="text-center">
                    <div className="text-sm text-gray-600 mb-2">Share this code</div>
                    <div className="flex justify-center gap-2 mb-3">
                      {serviceOTP?.split("").map((digit, idx) => (
                        <div
                          key={idx}
                          className="w-14 h-14 bg-white rounded-lg border-2 border-gray-200 flex items-center justify-center text-2xl font-bold text-gray-900"
                        >
                          {digit}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {paymentConfirmed && (
                  <div className="mt-6 space-y-4 animate-fade-in">
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-bold text-green-900">Payment Successful!</span>
                      </div>
                      <p className="text-sm text-green-700">Transaction ID: #TXN-882920</p>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <div className="text-sm font-semibold text-blue-900 mb-2 uppercase tracking-wide">
                        Share OTP with Technician
                      </div>
                      <p className="text-sm text-blue-700 mb-3">
                        This code closes the service request <span className="font-semibold">#SR-99281</span>
                      </p>
                      <button
                        onClick={copyOTP}
                        className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2"
                      >
                        {copied ? (
                          <>
                            <Check className="w-4 h-4" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            Copy OTP
                          </>
                        )}
                      </button>
                    </div>

                    <button  onClick={downloadInvoice} className="w-full py-3 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2">
                      <Download className="w-4 h-4" />
                      Download Receipt
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
