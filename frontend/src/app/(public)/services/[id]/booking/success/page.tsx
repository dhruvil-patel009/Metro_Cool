"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import {
  CheckCircle,
  Calendar,
  Clock,
  MapPin,
  ArrowRight,
  Copy,
  Star,
} from "lucide-react"
import { toast } from "react-toastify"
import AuthGuard from "@/app/components/AuthGuard"

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL!

type Booking = {
  id: string
  booking_date: string
  time_slot: string
  total_amount: number
  address: {
    street: string
    city: string
    zipCode: string
  }
  service: {
    title: string
    rating: number
    image_url: string
  }
  user: {
    phone: string
    full_name: string
  }
}

export default function BookingSuccessPage() {
  const params = useParams<{ id: string }>()
  const bookingId = params.id

  const [booking, setBooking] = useState<Booking | null>(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!bookingId) return
    const token = localStorage.getItem("accessToken")

    fetch(`${API_URL}/bookings/${bookingId}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    })
      .then((res) => res.json())
      .then((data) => {
        setBooking(data.booking)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [bookingId])

  const copyBookingId = () => {
    if (bookingId) {
      navigator.clipboard.writeText(bookingId)
      toast.success("Booking ID copied!")
    }
  }

  if (loading) {
    return (
      <div className="loader-wrapper">
        <div className="loader"></div>
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-700">Booking not found</p>
          <Link href="/services" className="text-sm text-blue-600 mt-2 inline-block hover:underline">
            ← Back to services
          </Link>
        </div>
      </div>
    )
  }

  const service = booking.service
  const user = booking.user
  const date = new Date(booking.booking_date)
  const formattedDate = date.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })
  const time = booking.time_slot
  const address = booking.address

  return (
    <AuthGuard>
      <div className="min-h-screen bg-white">
        <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Success Animation */}
          <div
            className={`flex flex-col items-center text-center mb-8 sm:mb-10 transition-all duration-700 ${
              mounted ? "opacity-100 scale-100" : "opacity-0 scale-75"
            }`}
          >
            {/* Success Icon */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-emerald-50 rounded-full flex items-center justify-center mb-5 border-4 border-emerald-100">
              <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-emerald-500" />
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1d242d] mb-2">
              Your Service is Booked!
            </h1>
            <p className="text-gray-500 text-sm sm:text-base max-w-md mb-4">
              We've sent a confirmation to{" "}
              <span className="font-semibold text-[#1d242d]">{user?.phone}</span>{" "}
              with all the details.
            </p>

            {/* Booking ID Badge */}
            <button
              onClick={copyBookingId}
              className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 px-4 py-2 rounded-xl hover:bg-blue-100 transition-colors"
            >
              <span className="text-sm font-semibold">Booking ID: #{bookingId?.slice(0, 8)}</span>
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Booking Details Card */}
          <div
            className={`bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6 transition-all duration-700 delay-200 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            {/* Service Info Header */}
            <div className="p-5 sm:p-6 border-b border-gray-100">
              <div className="flex gap-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                  {service.image_url ? (
                    <img
                      src={service.image_url}
                      alt={service.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-blue-50 flex items-center justify-center">
                      <CheckCircle className="w-8 h-8 text-blue-300" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="inline-block bg-emerald-50 text-emerald-600 border border-emerald-100 text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider mb-1.5">
                    Confirmed
                  </span>
                  <h3 className="font-bold text-base sm:text-lg text-[#1d242d] truncate">
                    {service.title}
                  </h3>
                  <div className="flex items-center gap-1 mt-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          s <= Math.floor(service.rating || 4.8)
                            ? "fill-amber-400 text-amber-400"
                            : "text-gray-200"
                        }`}
                      />
                    ))}
                    <span className="text-xs text-gray-500 ml-1">
                      ({service.rating || 4.8})
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Date, Time & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
              {/* Date & Time */}
              <div className="p-5 sm:p-6">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">
                  Scheduled
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#1d242d]">{formattedDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-violet-50 flex items-center justify-center">
                      <Clock className="w-4 h-4 text-violet-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#1d242d]">{time}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="p-5 sm:p-6">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">
                  Service Location
                </p>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-red-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#1d242d]">{address?.street}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {address?.city} {address?.zipCode}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* What Happens Next */}
          <div
            className={`bg-gray-50 rounded-2xl border border-gray-100 p-5 sm:p-6 mb-8 transition-all duration-700 delay-400 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <h2 className="text-base sm:text-lg font-bold text-[#1d242d] mb-5">What Happens Next?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Step 1 */}
              <div className="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-0">
                <div className="w-11 h-11 sm:w-14 sm:h-14 bg-blue-600 rounded-full flex items-center justify-center shrink-0 sm:mb-3">
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#1d242d]">Booked</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Booking confirmed</p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-0">
                <div className="w-11 h-11 sm:w-14 sm:h-14 bg-blue-100 rounded-full flex items-center justify-center shrink-0 sm:mb-3">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#1d242d]">Assigning Pro</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Finding best technician</p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-0">
                <div className="w-11 h-11 sm:w-14 sm:h-14 bg-gray-200 rounded-full flex items-center justify-center shrink-0 sm:mb-3">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#1d242d]">Service Day</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Pro arrives on time</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div
            className={`flex flex-col sm:flex-row gap-3 justify-center mb-8 transition-all duration-700 delay-500 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <Link
              href="/"
              className="px-6 py-3.5 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-semibold text-sm text-center hover:border-gray-300 hover:bg-gray-50 transition-all"
            >
              Back to Home
            </Link>
            <Link
              href={`/bookings?id=${bookingId}`}
              className="px-6 py-3.5 bg-blue-600 text-white rounded-xl font-semibold text-sm text-center hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-sm shadow-blue-200"
            >
              View My Bookings
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Support Link */}
          <div
            className={`text-center transition-all duration-700 delay-700 ${
              mounted ? "opacity-100" : "opacity-0"
            }`}
          >
            <p className="text-sm text-gray-400">
              Need to reschedule?{" "}
              <Link href="/contact" className="text-blue-600 hover:underline font-medium">
                Contact Support
              </Link>
            </p>
          </div>
        </main>
      </div>
    </AuthGuard>
  )
}
