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
  Shield,
} from "lucide-react"
import { toast } from "react-toastify"
import { subscribeToPush } from "@/app/lib/push-notification"
import AuthGuard from "@/app/components/AuthGuard"
import { formatINR } from "@/app/lib/currency"

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL!

export default function BookingsContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const bookingIdRef = useRef<string | null>(null)
  if (!bookingIdRef.current) {
    bookingIdRef.current = searchParams.get("id")
  }

  const bookingId = bookingIdRef.current
  const [booking, setBooking] = useState<any>(null)
  const [mounted, setMounted] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [hasRedirected, setHasRedirected] = useState(false)
  const previousStatusRef = useRef<string | null>(null)
  const pollingRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    subscribeToPush()
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

        setBooking((prev: any) => {
          if (!prev) return data.booking
          if (prev.job_status === data.booking.job_status) return prev
          return data.booking
        })
      } catch (err) {
        console.error("Booking fetch failed", err)
      }
    }

    fetchBooking()

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

  /* ---------------- MAP STATUS TO STEP ---------------- */
  const getStepFromStatus = (status: string) => {
    switch (status) {
      case "open": return 0
      case "assigned": return 1
      case "on_the_way": return 2
      case "working": return 3
      case "report_submitted":
      case "completed": return 4
      default: return 0
    }
  }

  useEffect(() => {
    if (!booking?.job_status) return

    // Only show notification when status actually changes (not on first load)
    if (previousStatusRef.current && previousStatusRef.current !== booking.job_status) {
      showLocalNotification(booking.job_status)

      // Only redirect to feedback when status TRANSITIONS to completed/report_submitted in real-time
      // (i.e., user was watching the timeline and technician just finished)
      if (
        (booking.job_status === "completed" || booking.job_status === "report_submitted") &&
        !hasRedirected
      ) {
        setHasRedirected(true)
        toast.success("Service completed 🎉")
        setTimeout(() => {
          if (booking.job_status === "report_submitted") {
            // Work done, payment pending — go to payment page
            router.push(`/bookings/completion?id=${bookingId}`)
          } else {
            // Fully completed — go to feedback (if not already given)
            router.push(`/bookings/feedback?id=${bookingId}`)
          }
        }, 1500)
      }
    }

    previousStatusRef.current = booking.job_status

    const step = getStepFromStatus(booking.job_status)
    setCurrentStep(step)
  }, [booking?.job_status])

  /* ---------------- LOCAL NOTIFICATION ---------------- */
  const showLocalNotification = async (status: string) => {
    let title = "Metro Cool"
    let message = ""
    let tag = "metro-cool-status"

    switch (status) {
      case "assigned":
        title = "Technician Assigned"
        message = "A certified professional has been assigned to your service. They'll be on their way shortly."
        tag = "metro-cool-assigned"
        break
      case "on_the_way":
        title = "Technician En Route"
        message = "Your technician is on the way to your location. Please ensure someone is available."
        tag = "metro-cool-enroute"
        break
      case "working":
        title = "Service Started"
        message = "The technician has arrived and started working on your AC unit."
        tag = "metro-cool-working"
        break
      case "completed":
        title = "Service Completed ✓"
        message = "Your AC service has been completed successfully. Please rate your experience."
        tag = "metro-cool-completed"
        break
      case "report_submitted":
        title = "Service Completed ✓"
        message = "Your AC service has been completed successfully. Please rate your experience."
        tag = "metro-cool-completed"
        break
      default:
        title = "Booking Update"
        message = "Your booking status has been updated."
    }

    try {
      const reg = await navigator.serviceWorker.ready
      reg.showNotification(title, {
        body: message,
        icon: "/assets/logo.ico",
        badge: "/assets/icon-dark-32x32.png",
        vibrate: [100, 50, 100, 50, 200],
        tag,
        renotify: true,
        data: {
          url: `/bookings?id=${bookingId}`,
        },
      } as any)
    } catch (err) {
      console.error("Notification failed:", err)
    }
  }

  /* ---------------- LOADING STATE ---------------- */
  if (!booking) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-8 bg-gray-100 rounded-lg w-1/2 animate-pulse" />
            <div className="h-4 bg-gray-100 rounded-lg w-1/3 animate-pulse" />
            <div className="h-[300px] sm:h-[400px] bg-gray-100 rounded-2xl animate-pulse" />
            <div className="h-48 bg-gray-100 rounded-2xl animate-pulse" />
          </div>
          <div className="space-y-4">
            <div className="h-48 bg-gray-100 rounded-2xl animate-pulse" />
            <div className="h-64 bg-gray-100 rounded-2xl animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  /* ---------------- DERIVED DATA ---------------- */
  const orderId = `#${booking.id?.slice(0, 8)}`
  const address = booking.address
  const fullAddress = `${address.street}, ${address.apt || ""}, ${address.city} ${address.zipCode}`
  const service = booking.service
  const technician = booking?.technician || null

  const showTechnician =
    booking?.job_status === "assigned" ||
    booking?.job_status === "on_the_way" ||
    booking?.job_status === "working" ||
    booking?.job_status === "completed"

  const subtotal = booking.service_price
  const total = booking.total_amount

  const location = {
    address: `${address.street}${address.apt ? ", " + address.apt : ""}`,
    city: `${address.city} ${address.zipCode}`,
  }

  const handleCallTechnician = () => {
    if (!technician?.phone) return
    window.location.href = `tel:${technician.phone}`
  }

  const timeline = [
    { title: "Booking Confirmed", desc: "Your booking has been received", icon: CheckCircle },
    { title: "Technician Assigned", desc: "A professional has been assigned", icon: User },
    { title: "Out for Service", desc: "Technician is on the way", icon: NavigationIcon },
    { title: "Work in Progress", desc: "Service is being performed", icon: Wrench },
    { title: "Job Completed", desc: "Service finished successfully", icon: ThumbsUp },
  ]

  /* ============ STATUS LABEL ============ */
  const getStatusLabel = (status: string) => {
    switch (status) {
      case "open": return "Awaiting Assignment"
      case "assigned": return "Technician Assigned"
      case "on_the_way": return "Technician En Route"
      case "working": return "Service In Progress"
      case "completed": return "Completed"
      default: return "In Progress"
    }
  }

  return (
    <AuthGuard>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Status Badge + Order ID */}
        <div
          className={`mb-5 sm:mb-6 transition-all duration-700 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
          }`}
        >
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="inline-flex items-center gap-2 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
              {getStatusLabel(booking.job_status)}
            </span>
            <span className="text-sm text-gray-500">Order {orderId}</span>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6">
          {/* ============ LEFT COLUMN ============ */}
          <div className="lg:col-span-2 space-y-5">
            {/* Header */}
            <div
              className={`transition-all duration-700 delay-100 ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <h1 className="text-2xl sm:text-3xl font-bold text-[#1d242d] mb-1">
                {booking.job_status === "on_the_way"
                  ? "Technician is arriving soon"
                  : booking.job_status === "working"
                    ? "Service in progress"
                    : booking.job_status === "completed"
                      ? "Service completed!"
                      : "Your booking is confirmed"}
              </h1>
              <p className="text-gray-500 text-sm sm:text-base">
                {booking.job_status === "on_the_way"
                  ? "Your AC expert is currently en route to your location."
                  : booking.job_status === "working"
                    ? "The technician is working on your AC unit."
                    : "We'll assign a technician to your booking shortly."}
              </p>
            </div>

            {/* Map Section */}
            <div
              className={`bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm transition-all duration-700 delay-200 ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <div className="relative h-[250px] sm:h-[350px] lg:h-[400px]">
                <iframe
                  title="Service Location"
                  src={`https://www.google.com/maps?q=${encodeURIComponent(fullAddress)}&output=embed`}
                  className="w-full h-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />

                {/* Live Tracking Badge */}
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow-sm border border-gray-100 flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-xs font-semibold text-[#1d242d]">Live</span>
                </div>
              </div>

              {/* Location Info Bar */}
              <div className="p-4 sm:p-5 border-t border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-medium">Service Location</p>
                      <p className="text-sm font-semibold text-[#1d242d] truncate max-w-[250px]">
                        {location.address}
                      </p>
                    </div>
                  </div>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(fullAddress)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 shrink-0"
                  >
                    <NavigationIcon className="w-3 h-3" />
                    Get Directions
                  </a>
                </div>
              </div>
            </div>

            {/* Service Timeline */}
            <div
              className={`bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 shadow-sm transition-all duration-700 delay-300 ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <h2 className="text-base sm:text-lg font-bold text-[#1d242d] mb-5">Service Timeline</h2>

              <div className="space-y-1">
                {timeline.map((step, index) => {
                  const Icon = step.icon
                  const isActive = currentStep === index
                  const isCompleted = currentStep > index
                  const isLast = index === timeline.length - 1

                  return (
                    <div key={index} className="flex gap-3 sm:gap-4">
                      {/* Icon + Line */}
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 transition-all ${
                            isActive
                              ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                              : isCompleted
                                ? "bg-emerald-100 text-emerald-600"
                                : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                          ) : (
                            <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                          )}
                        </div>
                        {!isLast && (
                          <div
                            className={`w-0.5 h-8 sm:h-10 ${
                              isCompleted ? "bg-emerald-200" : "bg-gray-100"
                            }`}
                          />
                        )}
                      </div>

                      {/* Content */}
                      <div className="pt-1.5 pb-4">
                        <h3
                          className={`text-sm font-semibold ${
                            isActive ? "text-blue-600" : isCompleted ? "text-[#1d242d]" : "text-gray-400"
                          }`}
                        >
                          {step.title}
                        </h3>
                        <p className="text-xs text-gray-400 mt-0.5">{step.desc}</p>
                        {isActive && (
                          <span className="inline-flex items-center gap-1.5 mt-2 text-[10px] bg-blue-50 text-blue-600 border border-blue-100 px-2 py-0.5 rounded-md font-bold">
                            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse" />
                            CURRENT
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* ============ RIGHT COLUMN (SIDEBAR) ============ */}
          <div className="space-y-5">
            {/* Technician Card */}
            {showTechnician && technician && (
              <div
                className={`bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all duration-700 delay-200 ${
                  mounted ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
                }`}
              >
                <div className="p-5 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Your Professional</p>
                    <div className="flex items-center gap-1 text-emerald-600">
                      <Shield className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-bold">Verified</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-center text-center mb-5">
                    <div className="w-20 h-20 rounded-full overflow-hidden mb-3 border-4 border-blue-50">
                      <img
                        src={technician.avatar || "/placeholder.svg"}
                        alt={technician.full_name || technician.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-lg font-bold text-[#1d242d]">
                      {technician.full_name || technician.name}
                    </h3>
                    <p className="text-xs text-blue-600 font-semibold mt-0.5">AC Service Technician</p>
                    {technician.experience_years && (
                      <p className="text-[11px] text-gray-400 mt-1">
                        {technician.experience_years}+ Years Experience
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      onClick={handleCallTechnician}
                      className="flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-sm shadow-blue-200"
                    >
                      <Phone className="w-4 h-4" />
                      Call
                    </button>
                    <button className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-3 rounded-xl text-sm font-bold hover:bg-gray-200 transition-all">
                      <MessageSquare className="w-4 h-4" />
                      Message
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Service Summary Card */}
            <div
              className={`bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all duration-700 delay-400 ${
                mounted ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
              }`}
            >
              <div className="p-5 sm:p-6">
                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-4">
                  Service Summary
                </h3>

                {/* Service Item */}
                <div className="flex gap-3 mb-5 pb-5 border-b border-gray-100">
                  <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                    <Wrench className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm text-[#1d242d] truncate">{service.title}</h4>
                    {service.includesCheck && (
                      <span className="inline-block bg-emerald-50 text-emerald-600 border border-emerald-100 text-[9px] font-bold px-2 py-0.5 rounded-md mt-1 uppercase">
                        Includes Gas Check
                      </span>
                    )}
                  </div>
                  <p className="font-bold text-sm text-[#1d242d] shrink-0">
                    {formatINR(subtotal?.toFixed(2))}
                  </p>
                </div>

                {/* Location */}
                <div className="mb-5 pb-5 border-b border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Location</p>
                  <div className="flex gap-2.5">
                    <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-[#1d242d] font-medium">{location.address}</p>
                      <p className="text-xs text-gray-400">{location.city}</p>
                    </div>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="font-semibold text-[#1d242d]">{formatINR(subtotal?.toFixed(2))}</span>
                  </div>
                  <div className="flex justify-between items-baseline pt-3 border-t border-gray-100">
                    <span className="text-sm font-bold text-[#1d242d]">Total</span>
                    <span className="text-xl font-bold text-blue-600">{formatINR(total?.toFixed(2))}</span>
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div className="bg-gray-50 border-t border-gray-100 px-5 py-3.5">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  <span>Payment will be collected after service</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </AuthGuard>
  )
}
