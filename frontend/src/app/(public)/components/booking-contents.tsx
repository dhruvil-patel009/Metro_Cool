"use client"

import { useState, useEffect, useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import {
  MapPin,
  Phone,
  MessageSquare,
  NavigationIcon,
  CheckCircle,
  User,
  Wrench,
  ThumbsUp,
  Copy,
  Shield,
} from "lucide-react"
import { toast } from "react-toastify"
import { subscribeToPush } from "@/app/lib/push-notification"
import AuthGuard from "@/app/components/AuthGuard"

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL!

export default function BookingsContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  // 🔥 GET BOOKING ID
  const bookingIdRef = useRef<string | null>(null)
  if (!bookingIdRef.current) {
    bookingIdRef.current = searchParams.get("id")
  }

  const bookingId = bookingIdRef.current
  const [booking, setBooking] = useState<any>(null)
  const [mounted, setMounted] = useState(false)
  const [copiedOTP, setCopiedOTP] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [hasRedirected, setHasRedirected] = useState(false)


  // 🔥 SINGLE OTP (removed duplicate)
  const serviceOTP = "4829"

  useEffect(() => setMounted(true), [])


  useEffect(() => {
    subscribeToPush()
  }, [])

  useEffect(() => {
    console.log("Notification permission:", Notification.permission)

    navigator.serviceWorker.ready.then(async (reg) => {
      const sub = await reg.pushManager.getSubscription()
      console.log("Subscription:", sub)
    })
  }, [])

  /* ---------------- FETCH BOOKING ---------------- */
  useEffect(() => {
    if (!bookingId) return

    const fetchBooking = async () => {
      const token = localStorage.getItem("accessToken")
      if (!token) {
        router.replace("/auth/login")
        return
      }

      try {
        const res = await fetch(`${API_URL}/bookings/${bookingId}`, {
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        })

        if (res.status === 401) {
          localStorage.removeItem("accessToken")
          router.replace("/auth/login")
          return
        }

        const data = await res.json()

        // 🔥 Prevent unnecessary rerender loop
        setBooking((prev: { job_status: any }) => {
          if (!prev) return data.booking
          if (prev.job_status === data.booking.job_status) return prev
          return data.booking
        })

      } catch (err) {
        console.error("Booking fetch failed", err)
      }
    }

    // first call
    fetchBooking()

    // prevent multiple intervals
    if (!pollingRef.current) {
      pollingRef.current = setInterval(fetchBooking, 3000)
    }

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current)
        pollingRef.current = null
      }
    }
  }, [bookingId])

  const pollingRef = useRef<NodeJS.Timeout | null>(null)
  /* ---------------- MAP JOB STATUS TO STEP ---------------- */
  const getStepFromStatus = (status: string) => {
    switch (status) {
      case "open":
        return 0
      case "assigned":
        return 1
      case "on_the_way":
        return 2
      case "working":
        return 3
      case "completed":
        return 4
      default:
        return 0
    }
  }

  useEffect(() => {
    if (!booking?.job_status) return

    const step = getStepFromStatus(booking.job_status)
    setCurrentStep(step)

    if (booking.job_status === "completed" && !hasRedirected) {
      setHasRedirected(true)

      toast.success("Service completed 🎉")

      setTimeout(() => {
        router.push(`/bookings/feedback?id=${bookingId}`)
      }, 1500)
    }
  }, [booking?.job_status])


  if (!booking) {
    return <div className="p-10 text-center">Loading booking...</div>
  }

  /* ---------------- 🔥 MAP DB → UI VARIABLES ---------------- */

  const orderId = `#${booking.id}`

  const address = booking.address
  const fullAddress = `${address.street}, ${address.apt}, ${address.city} ${address.zipCode}`

  const service = booking.service

  /* ---------------- TECHNICIAN FROM BOOKING ---------------- */
  const technician = booking?.technician || null

  // show technician only after assigned
  const showTechnician =
    booking?.job_status === "assigned" ||
    booking?.job_status === "on_the_way" ||
    booking?.job_status === "working" ||
    booking?.job_status === "completed"

  // 🔥 These replace missing vars (NO UI CHANGE)
  const estimatedArrival = "10:45 AM"
  const currentLocation = "2.4 km away"
  const estimatedTime = "15 mins"
  const trafficStatus = "Clear Route"

  const subtotal = booking.service_price
  const tax = booking.tax
  const total = booking.total_amount

  const location = {
    address: `${address.street}, ${address.apt}`,
    city: `${address.city} ${address.zipCode}`,
  }

  console.log("location", location)

  /* ---------------- COPY OTP ---------------- */
  const handleCopyOTP = () => {
    navigator.clipboard.writeText(serviceOTP)
    setCopiedOTP(true)
    setTimeout(() => setCopiedOTP(false), 2000)
  }

  // call now button 
  const handleCallTechnician = () => {
    if (!technician?.phone) return
    window.location.href = `tel:${technician.phone}`
  }
  /* ---------------- TIMELINE ---------------- */
  const timeline = [
    { title: "Booking Confirmed", icon: CheckCircle },
    { title: "Technician Assigned", icon: User },
    { title: "Out for Service", icon: NavigationIcon },
    { title: "Work in Progress", icon: Wrench },
    { title: "Job Completed", icon: ThumbsUp },
  ]

  /* ===================== UI BELOW (UNCHANGED) ===================== */


  return (
    <AuthGuard>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Status Badge and Order ID */}
        <div
          className={`mb-4 transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
            }`}
        >
          <div className="flex items-center gap-2 text-sm">
            <span className="inline-flex items-center gap-2 bg-blue-600 text-white px-3 py-1.5 rounded-full font-bold">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
              IN PROGRESS
            </span>
            <span className="text-gray-600">Order ID: {orderId}</span>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Section */}
            <div
              className={`transition-all duration-700 delay-100 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
            >
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Technician is arriving soon</h1>
              <p className="text-gray-600">Your AC expert is currently en route to your location.</p>
            </div>

            {/* Map Section */}
            <div
              className={`bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-700 delay-200 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
            >
              {/* Map Image */}
              <div className="relative h-[400px] bg-gradient-to-br from-blue-50 to-blue-100">
                <iframe
                  title="Service Location"
                  src={`https://www.google.com/maps?q=${encodeURIComponent(fullAddress)}&output=embed`}
                  className="w-full h-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />

                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(fullAddress)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:underline font-semibold"
                >
                  Get Directions
                </a>

                {/* Live Tracking Badge */}
                <div className="absolute top-4 right-4 bg-white rounded-lg px-3 py-2 shadow-lg flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="text-sm font-semibold">Live Tracking</span>
                </div>
                {/* Technician Marker */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                    <NavigationIcon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              {/* Location Info Card */}
              <div className="p-4 bg-white border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <NavigationIcon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Current Location</p>
                      <p className="font-bold text-lg">
                        {currentLocation} · {estimatedTime}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Traffic Status</p>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span className="font-bold text-green-600">{trafficStatus}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Service Timeline */}
            <div
              className={`bg-white rounded-2xl shadow-sm border border-gray-200 p-6 transition-all duration-700 delay-300 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Service Timeline</h2>
                <button className="text-sm text-blue-600 font-semibold hover:underline">View Details</button>
              </div>

              <div className="space-y-6">
                {timeline.map((step, index) => {
                  const Icon = step.icon
                  const isActive = currentStep === index
                  const isCompleted = currentStep > index

                  return (
                    <div key={index} className="flex gap-4 items-start">
                      {/* ICON */}
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all
                  ${isActive
                            ? "bg-blue-600 text-white animate-pulse"
                            : isCompleted
                              ? "bg-blue-100 text-blue-600"
                              : "bg-gray-100 text-gray-400"
                          }
                `}
                      >
                        <Icon className="w-6 h-6" />
                      </div>

                      {/* CONTENT */}
                      <div className="flex-1">
                        <h3
                          className={`font-bold ${isActive ? "text-blue-600" : "text-gray-900"
                            }`}
                        >
                          {step.title}
                        </h3>
                        {/* <p className="text-sm text-gray-600">{step.description}</p> */}

                        {isActive && (
                          <span className="inline-block mt-2 text-xs bg-blue-600 text-white px-2 py-1 rounded animate-pulse">
                            LIVE
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Estimated Arrival Card */}
            {/* <div
            className={`bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-5 border border-blue-200 transition-all duration-700 delay-100 ${
              mounted ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
            }`}
          >
            <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-2">Estimated Arrival</p>
            <div className="flex items-center justify-between">
              <p className="text-3xl font-bold text-blue-900">{estimatedArrival}</p>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-white text-blue-600 rounded-lg text-sm font-semibold hover:bg-blue-50 transition-colors">
                  Help
                </button>
                <button className="px-4 py-2 bg-white text-red-600 rounded-lg text-sm font-semibold hover:bg-red-50 transition-colors">
                  Cancel
                </button>
              </div>
            </div>
            <p className="text-sm text-green-700 font-semibold mt-1">On Time</p>
          </div> */}

            {/* Technician Card */}
            {showTechnician && technician && (
              <div className={`bg-white rounded-2xl shadow-sm border border-gray-200 p-6 transition-all duration-700 delay-200 ${mounted ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
                }`}>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Your Professional</p>
                  {technician && (
                    <div className="flex items-center gap-1 text-blue-600">
                      <Shield className="w-4 h-4" />
                      <span className="text-xs font-bold">Verified</span>
                    </div>
                  )}
                </div>

                {/* Technician Info */}
                <div className="flex flex-col items-center text-center mb-6">
                  <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-4 border-blue-100">
                    <img
                      src={technician.avatar || "/placeholder.svg"}
                      alt={technician.full_name || technician.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-bold mb-1">{technician.full_name || technician.name}</h3>
                  <p className="text-blue-600 font-semibold text-sm mb-2">AC Service Technician</p>
                  <p className="text-xs text-gray-600">{technician.experience_years
                    ? `${technician.experience_years}+ Years Experience`
                    : "Verified Professional"}</p>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={handleCallTechnician}
                    className="flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-all">
                    <Phone className="w-4 h-4" />
                    Call Now
                  </button>
                  <button className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-200 transition-all">
                    <MessageSquare className="w-4 h-4" />
                    Message
                  </button>
                </div>
              </div>
            )}
            {/* OTP Card */}
            {/* <div
            className={`bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white transition-all duration-700 delay-300 ${
              mounted ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs font-semibold text-blue-100 uppercase tracking-wide mb-1">Start Code (OTP)</p>
                <p className="text-xs text-blue-200">Share with technician upon arrival</p>
              </div>
              <button
                onClick={handleCopyOTP}
                className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-all"
              >
                {copiedOTP ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="flex justify-center gap-3">
                {serviceOTP.split("").map((digit, index) => (
                  <div
                    key={index}
                    className="w-14 h-16 bg-white/20 backdrop-blur-md rounded-lg flex items-center justify-center"
                  >
                    <span className="text-3xl font-bold">{digit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div> */}

            {/* Service Summary */}
            <div
              className={`bg-white rounded-2xl shadow-sm border mt-24 border-gray-200 p-6 transition-all duration-700 delay-400 ${mounted ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
                }`}
            >
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">Service Summary</h3>

              {/* Service Item */}
              <div className="flex gap-3 mb-6 pb-6 border-b border-gray-100">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-sm mb-1">{service.title}</h4>
                  <p className="text-xs text-gray-600 mb-2">Quantity: {service.quantity}</p>
                  {service.includesCheck && (
                    <span className="inline-block bg-green-50 text-green-700 text-[10px] font-bold px-2 py-1 rounded">
                      Includes Gas Check
                    </span>
                  )}
                </div>
                <div>
                  <p className="font-bold text-lg">${service.price.toFixed(2)}</p>
                </div>
              </div>

              {/* Location */}
              <div className="mb-6 pb-6 border-b border-gray-100">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Service Location</h4>
                <div className="flex gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-900">{location.address}</p>
                    <p className="text-sm text-gray-600">{location.city}</p>
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                {/* <div className="flex justify-between text-sm">
                <span className="text-gray-600">Taxes & Fees</span>
                <span className="font-semibold">${taxesAndFees.toFixed(2)}</span>
              </div> */}
                <div className="pt-3 border-t border-gray-200 flex justify-between">
                  <span className="font-bold">Total Amount</span>
                  <span className="text-2xl font-bold text-blue-600">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Payment Status */}
              <div className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 p-3 rounded-lg">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
                <span>Payment captured: Card ending in •••• 4242</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </AuthGuard>
  )
}
