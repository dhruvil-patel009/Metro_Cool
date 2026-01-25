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
} from "lucide-react"

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

  console.log("BOOKING ID:", bookingId)
  console.log(window.location.pathname)
  // 🔥 REAL booking state
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
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    })
      .then(res => res.json())
      .then(data => {
        setBooking(data.booking)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [bookingId])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Booking not found
      </div>
    )
  }

  // 🔥 Extract data
  const service = booking.service
  const user = booking.user   // ✅ ADD THIS
  const date = new Date(booking.booking_date).toDateString()
  const time = booking.time_slot
  const address = booking.address

  return (
        <div className="min-h-screen bg-gray-50 font-sans">
    
          <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Success Icon with Animation */}
            <div
              className={`flex justify-center mb-6 transition-all duration-700 ${
                mounted ? "opacity-100 scale-100" : "opacity-0 scale-50"
              }`}
            >
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
            </div>
    
            {/* Success Message with Animation */}
            <div
              className={`text-center mb-8 transition-all duration-700 delay-200 ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <h1 className="text-3xl md:text-4xl font-bold mb-3">Your Service is Booked!</h1>
              <p className="text-gray-600 mb-4">
                We have sent a confirmation Text to <span className="font-semibold text-blue-600">{user?.phone}</span>
                <br />
                with all the details.
              </p>
              <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg">
                <span className="font-semibold text-sm">Booking ID: #{bookingId}</span>
                <button className="hover:opacity-70 transition-opacity">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                </button>
              </div>
            </div>
    
            {/* Booking Summary Card with Animation */}
            <div
              className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8 mb-8 transition-all duration-700 delay-300 ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              {/* Header with Print and Receipt */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                <h2 className="text-xl font-bold">Booking Summary</h2>
                <div className="flex items-center gap-3">
                  {/* <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors">
                    <Printer className="w-4 h-4" />
                    <span className="hidden sm:inline">Print</span>
                  </button>
                  <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors">
                    <FileText className="w-4 h-4" />
                    <span className="hidden sm:inline">Receipt</span>
                  </button> */}
                </div>
              </div>
    
              {/* Service Info */}
              <div className="flex gap-4 mb-6 pb-6 border-b border-gray-100">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                  <img src={service.image_url} alt="Service" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <span className="inline-block bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-1 rounded mb-2 uppercase tracking-wide">
                    Verified Professional
                  </span>
                  <h3 className="font-bold text-lg mb-2">{service.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <span>Provider: Metro Cool Experts</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className="w-4 h-4 text-orange-400 fill-current"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="text-sm text-gray-600 ml-1">(4.8/5)</span>
                  </div>
                </div>
              </div>
    
              {/* Date, Time & Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* Date & Time */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Date & Time</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-bold text-sm">{date}</p>
                        {/* <p className="text-xs text-gray-600">{bookingDay}</p> */}
                      </div>
                    </div>
                    {/* <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-bold text-sm">{bookingTime}</p>
                        <p className="text-xs text-gray-600">{duration}</p>
                      </div>
                    </div> */}
                  </div>
                </div>
    
                {/* Service Location */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Service Location</h4>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-sm mb-1">{address.street}</p>
                      <p className="text-xs text-gray-600 mb-2">{address.city} {address.zipCode}</p>
                      <button className="text-xs text-blue-600 hover:underline font-semibold">Get Directions</button>
                    </div>
                  </div>
                </div>
              </div>
    
    
            </div>
    
            {/* What Happens Next with Animation */}
            <div
              className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8 mb-8 transition-all duration-700 delay-500 ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <h2 className="text-xl font-bold mb-6">What Happens Next?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Step 1 - Booked */}
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-sm mb-2">Booked</h3>
                  <p className="text-xs text-gray-600">Your booking has been confirmed</p>
                </div>
    
                {/* Step 2 - Assigning Pro */}
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-bold text-sm mb-2">Assigning Pro</h3>
                  <p className="text-xs text-gray-600">We're finding the best technician</p>
                </div>
    
                {/* Step 3 - Service */}
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-bold text-sm mb-2">Service</h3>
                  <p className="text-xs text-gray-600">Professional will arrive on time</p>
                </div>
              </div>
            </div>
    
            {/* Action Buttons with Animation */}
            <div
              className={`flex flex-col sm:flex-row gap-4 justify-center items-center mb-8 transition-all duration-700 delay-700 ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <Link
                href="/user"
                className="px-8 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg font-bold hover:border-gray-400 transition-all"
              >
                Back to Home
              </Link>
              <Link
                href={`/user/bookings?id=${bookingId}`}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-200"
              >
                View My Bookings
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
    
            {/* Support Link with Animation */}
            <div className={`text-center transition-all duration-700 delay-900 ${mounted ? "opacity-100" : "opacity-0"}`}>
              <p className="text-sm text-gray-600">
                Need to reschedule?{" "}
                <Link href="/support" className="text-blue-600 hover:underline font-semibold">
                  Contact Support
                </Link>
              </p>
            </div>
          </main>
        </div>
  )
}
