"use client"

import {
  ArrowLeft,
  Bell,
  MapPin,
  Calendar,
  Clock,
  Phone,
  Navigation,
  ExternalLink,
  History,
  Edit2,
  Car,
  User,
} from "lucide-react"
import { Button } from "@/app/components/ui/button"
import Link from "next/link"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { WorkingView } from "../../components/working-view"

type Address = {
  street?: string
  apt?: string
  city?: string
  zipCode?: string
}

type Booking = {
  id: string
  booking_date: string
  time_slot: string
  issues?: string[]
   instructions?: string
  address: Address | string | null
  user: {
    full_name: string
    phone: string
  }
}

export default function JobDetailsPage() {
  const { id } = useParams()
  const [booking, setBooking] = useState<Booking | null>(null)
  const [loading, setLoading] = useState(true)
  const [isWorking, setIsWorking] = useState(false)

  /* ================= ADDRESS HELPERS ================= */

  const parseAddress = (address: any): Address | null => {
    if (!address) return null
    if (typeof address === "string") {
      try {
        return JSON.parse(address)
      } catch {
        return null
      }
    }
    return address
  }

  const fullAddress = booking
    ? [
        parseAddress(booking.address)?.street,
        parseAddress(booking.address)?.apt,
        parseAddress(booking.address)?.city,
        parseAddress(booking.address)?.zipCode,
      ]
        .filter(Boolean)
        .join(", ")
    : ""

  /* ================= FETCH BOOKING ================= */

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const token = localStorage.getItem("token")

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/bookings/techjobs/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
          }
        )

        const json = await res.json()
        if (json.success) {
          setBooking(json.booking)
        }
      } catch (err) {
        console.error("Failed to load booking", err)
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchBooking()
  }, [id])

  if (loading) {
    return <div className="p-10 text-center">Loading job details…</div>
  }

  if (!booking) {
    return <div className="p-10 text-center">Job not found</div>
  }

  if (isWorking) {
    return <WorkingView onBack={() => setIsWorking(false)} jobId={booking.id} />

  }

  return (
  <div className="min-h-screen bg-slate-50">
    {/* HEADER */}
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/technician/jobs" className="text-slate-400 hover:text-slate-900">
            <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
          </Link>

          <div>
            <h1 className="text-lg md:text-xl font-extrabold text-slate-900">
              Job #{booking.id.slice(0, 6)}
            </h1>
            <p className="text-xs text-slate-400">Technician Dashboard</p>
          </div>
        </div>

        {/* <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </Button> */}
      </div>
    </header>

    <main className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-8 space-y-6">

      {/* HERO CARD */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6"
      >
        <div className="space-y-3">
          <span className="text-[#0891b2] font-bold text-xs uppercase tracking-wider">
            {booking.issues?.join(", ") || "Service Job"}
          </span>

          <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-900">
            Scheduled Service
          </h2>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-slate-500 font-medium text-sm md:text-base">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              {fullAddress}
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {booking.booking_date}
            </div>
          </div>
        </div>

        <Button
          onClick={() => setIsWorking(true)}
          className="w-full lg:w-auto cursor-pointer bg-[#0ea5e9] hover:bg-[#0284c7] text-white font-black text-lg px-8 py-6 rounded-2xl shadow-lg flex items-center justify-center gap-3"
        >
          <Car className="w-6 h-6" />
          ON THE WAY
        </Button>
      </motion.div>

      {/* GRID SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* CUSTOMER CARD */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8 space-y-6">

          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-slate-500" />
            <h3 className="text-lg font-bold text-slate-900">
              Customer Information
            </h3>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h4 className="text-xl font-extrabold text-slate-900">
                {booking.user.full_name}
              </h4>
              <p className="text-sm text-emerald-500 font-semibold">
                Verified Customer
              </p>
            </div>

            <Button
              onClick={() => window.open(`tel:${booking.user.phone}`)}
              className="w-full sm:w-auto cursor-pointer bg-emerald-500 hover:bg-emerald-600 text-white font-bold gap-2"
            >
              <Phone className="w-4 h-4" />
              Call Customer
            </Button>
          </div>

          {/* MAP */}
          <div className="rounded-2xl overflow-hidden border h-56 md:h-64">
            <iframe
              src={`https://www.google.com/maps?q=${encodeURIComponent(fullAddress)}&output=embed`}
              className="w-full h-full border-0"
              loading="lazy"
            />
          </div>

          {/* MAP BUTTONS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="w-full cursor-pointer"
              onClick={() =>
                window.open(
                  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`,
                  "_blank"
                )
              }
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Google Maps
            </Button>

            <Button
              className="w-full bg-slate-900 text-white cursor-pointer"
              onClick={() =>
                navigator.geolocation.getCurrentPosition((pos) => {
                  const { latitude, longitude } = pos.coords
                  window.open(
                    `https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${encodeURIComponent(fullAddress)}`,
                    "_blank"
                  )
                })
              }
            >
              <Navigation className="w-4 h-4 mr-2" />
              Start Navigation
            </Button>
          </div>
        </div>

        {/* SERVICE DETAILS */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8 space-y-6">

          <h3 className="text-lg font-bold text-slate-900">
            Service Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-2xl p-5 flex items-center gap-4">
              <Calendar className="w-5 h-5 text-slate-400" />
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase">Date</p>
                <p className="font-bold text-slate-900">{booking.booking_date}</p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-5 flex items-center gap-4">
              <Clock className="w-5 h-5 text-slate-400" />
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase">
                  Arrival Window
                </p>
                <p className="font-bold text-slate-900">{booking.time_slot}</p>
              </div>
            </div>

            {/* CUSTOMER NOTES */}
{booking.instructions && (
  <div className="space-y-3">
    <div className="flex items-center gap-2">
      <Edit2 className="w-4 h-4 text-orange-400" />
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
        Customer Notes
      </span>
    </div>

    <div className="relative p-6 bg-amber-50/60 border-l-4 border-amber-400 rounded-r-2xl text-slate-700 italic leading-relaxed w-fit break-words">
      <span className="absolute left-0 top-0 bottom-0 w-1 bg-amber-400 rounded-l-2xl" />

      <p className="font-medium">
        "{booking.instructions}"
      </p>
    </div>
  </div>
)}

          </div>
        </div>

      </div>
    </main>
  </div>
)

}
