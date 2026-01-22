"use client"

import { useState, useEffect } from "react"
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
import { toast } from "sonner"

export default function BookingsContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const bookingIdFromUrl = searchParams.get("id")

  const [mounted, setMounted] = useState(false)
  const [copiedOTP, setCopiedOTP] = useState(false)
  const [currentStep, setCurrentStep] = useState(0) // Start at step 3 (index 2) "Out for Service"

  useEffect(() => {
    setMounted(true)
  }, [])

useEffect(() => {
  const TOTAL_STEPS = 5
  const STEP_DURATION = 3000 // 3 sec per step → 15 sec total

  const interval = setInterval(() => {
    setCurrentStep((prev) => {
      const next = prev + 1

      // When job is completed
      if (next === TOTAL_STEPS) {
        clearInterval(interval)

        // ✅ Show success toast
        toast.success("Your service has been completed successfully 🎉", {
          description: "Thank you for choosing Metro Cool",
          duration: 3000,
        })

        // 🔁 Redirect to feedback after toast
        setTimeout(() => {
          router.push(
            `/user/bookings/feedback?id=${bookingIdFromUrl || "MC-8293"}`
          )
        }, 1500)

        return prev
      }

      return next
    })
  }, STEP_DURATION)

  return () => clearInterval(interval)
}, [router, bookingIdFromUrl])

  const bookingId = bookingIdFromUrl || "MC-8293"
  const orderId = `#${bookingId}`
  const estimatedArrival = "10:45 AM"
  const currentLocation = "2.4 km away"
  const estimatedTime = "15 mins"
  const trafficStatus = "Clear Route"

  const technician = {
    name: "Rahul Kumar",
    title: "Master Technician",
    image: "/technician-working-on-ac-unit.jpg",
    jobsCompleted: "120+ Jobs completed",
    verified: true,
  }

  const serviceOTP = "4829"

  const service = {
    name: "AC Deep Clean (Split)",
    quantity: "2 Units",
    price: 120.0,
    includesCheck: true,
  }

  const location = {
    address: "Block A, Apt 402, Green Valley Residency,",
    city: "Metro City, 560001",
  }

  const subtotal = 120.0
  const taxesAndFees = 5.0
  const total = 125.0

  const timeline = [
    {
      id: 1,
      title: "Booking Confirmed",
      description: "We received your request for AC Deep Clean.",
      icon: CheckCircle,
    },
    {
      id: 2,
      title: "Technician Assigned",
      description: "Rahul K. has accepted your booking",
      icon: User,
    },
    {
      id: 3,
      title: "Out for Service",
      description: "Technician is on the way to your location.",
      icon: NavigationIcon,
    },
    {
      id: 4,
      title: "Work in Progress",
      description: "Estimated duration: 1h 30m",
      icon: Wrench,
    },
    {
      id: 5,
      title: "Job Completed",
      description: "Final inspection, payment & rating",
      icon: ThumbsUp,
    },
  ]

  const handleCopyOTP = () => {
    navigator.clipboard.writeText(serviceOTP)
    setCopiedOTP(true)
    setTimeout(() => setCopiedOTP(false), 2000)
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Status Badge and Order ID */}
      <div
        className={`mb-4 transition-all duration-700 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
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
            className={`transition-all duration-700 delay-100 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Technician is arriving soon</h1>
            <p className="text-gray-600">Your AC expert is currently en route to your location.</p>
          </div>

          {/* Map Section */}
          <div
            className={`bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-700 delay-200 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            {/* Map Image */}
            <div className="relative h-[400px] bg-gradient-to-br from-blue-50 to-blue-100">
              <img
                src="https://api.mapbox.com/styles/v1/mapbox/light-v11/static/-74.006,40.7128,11,0/800x400@2x?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw"
                alt="Map"
                className="w-full h-full object-cover opacity-80"
              />
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
            className={`bg-white rounded-2xl shadow-sm border border-gray-200 p-6 transition-all duration-700 delay-300 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
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
                  ${
                    isActive
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
                  className={`font-bold ${
                    isActive ? "text-blue-600" : "text-gray-900"
                  }`}
                >
                  {step.title}
                </h3>
                <p className="text-sm text-gray-600">{step.description}</p>

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
          <div
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
          </div>

          {/* Technician Card */}
          <div
            className={`bg-white rounded-2xl shadow-sm border border-gray-200 p-6 transition-all duration-700 delay-200 ${
              mounted ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Your Professional</p>
              {technician.verified && (
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
                  src={technician.image || "/placeholder.svg"}
                  alt={technician.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold mb-1">{technician.name}</h3>
              <p className="text-blue-600 font-semibold text-sm mb-2">{technician.title}</p>
              <p className="text-xs text-gray-600">{technician.jobsCompleted}</p>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-all">
                <Phone className="w-4 h-4" />
                Call Now
              </button>
              <button className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-200 transition-all">
                <MessageSquare className="w-4 h-4" />
                Message
              </button>
            </div>
          </div>

          {/* OTP Card */}
          <div
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

            {/* OTP Display */}
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
          </div>

          {/* Service Summary */}
          <div
            className={`bg-white rounded-2xl shadow-sm border border-gray-200 p-6 transition-all duration-700 delay-400 ${
              mounted ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
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
                <h4 className="font-bold text-sm mb-1">{service.name}</h4>
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
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Taxes & Fees</span>
                <span className="font-semibold">${taxesAndFees.toFixed(2)}</span>
              </div>
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
  )
}
