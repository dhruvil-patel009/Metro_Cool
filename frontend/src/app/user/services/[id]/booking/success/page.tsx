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

export default function BookingSuccessPage() {
  const params = useParams<{ id: string }>()
  const bookingId = params.id

  console.log("BOOKING ID:", bookingId)
  console.log(window.location.pathname)
  // 🔥 REAL booking state
  const [booking, setBooking] = useState<any>(null)
  const [loading, setLoading] = useState(true)

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
  const date = new Date(booking.booking_date).toDateString()
  const time = booking.time_slot
  const address = booking.address

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <main className="max-w-5xl mx-auto px-4 py-8">

        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Your Service is Booked!</h1>
          <p className="text-gray-600">
            Booking ID:
            <span className="font-semibold text-blue-600"> #{booking.id}</span>
          </p>
        </div>

        {/* Booking Summary */}
        <div className="bg-white rounded-xl shadow border p-6 mb-8">

          {/* Service Info */}
          <div className="mb-6 border-b pb-4">
            <h2 className="text-lg font-bold">{service.title}</h2>
            <p className="text-sm text-gray-600">
              ⭐ {service.rating || "4.8"} / 5
            </p>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-blue-600" />
                <p className="font-semibold">{date}</p>
              </div>
              <div className="flex items-center gap-3 mt-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <p>{time}</p>
              </div>
            </div>

            {/* Location */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-red-500" />
                <div>
                  <p className="font-semibold">{address.street}</p>
                  <p className="text-sm text-gray-600">
                    {address.city} {address.zipCode}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Total */}
          <div className="text-right font-bold text-lg">
            Total Paid: ${booking.total_amount}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-4">
          <Link
            href="/"
            className="px-6 py-3 border rounded-lg font-semibold"
          >
            Back to Home
          </Link>

          <Link
            href={`/user/bookings`}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold flex items-center gap-2"
          >
            View My Bookings
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>
    </div>
  )
}
