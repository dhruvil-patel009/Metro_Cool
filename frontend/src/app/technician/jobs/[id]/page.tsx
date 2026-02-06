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
    return <WorkingView onBack={() => setIsWorking(false)} />
  }

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* HEADER */}
      <header className="bg-white border-b border-slate-100 px-8 py-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/jobs" className="text-slate-400 hover:text-slate-900">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-xl font-extrabold text-slate-900">
              Job #{booking.id}
            </h1>
          </div>
          <Button variant="ghost" size="icon" className="text-slate-400">
            <Bell className="w-6 h-6" />
          </Button>
        </div>
      </header>

      <main className="p-8 max-w-7xl mx-auto space-y-8">
        {/* HERO */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8"
        >
          <div className="space-y-3">
            <span className="text-[#0891b2] font-bold text-xs uppercase">
              {booking.issues?.join(", ") || "Service Job"}
            </span>
            <h2 className="text-4xl font-black text-slate-900">
              Scheduled Service
            </h2>
            <div className="flex items-center gap-6 text-slate-400 font-semibold">
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
            className="bg-[#0ea5e9] hover:bg-[#0284c7] text-white px-10 py-10 rounded-[2rem] font-black text-2xl gap-6 shadow-xl"
          >
            <Car className="w-8 h-8" />
            ON THE WAY
          </Button>
        </motion.div>

        {/* CUSTOMER */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-[2.5rem] p-8 border shadow-sm space-y-6">
            <div className="flex items-center gap-4">
              <User className="w-6 h-6 text-slate-400" />
              <h3 className="text-xl font-bold">Customer</h3>
            </div>

            <h4 className="text-2xl font-extrabold">
              {booking.user.full_name}
            </h4>

            <Button
              onClick={() => window.open(`tel:${booking.user.phone}`)}
              className="bg-emerald-500 text-white font-bold gap-2"
            >
              <Phone className="w-5 h-5" />
              Call Customer
            </Button>

            {/* MAP */}
            <div className="h-64 rounded-2xl overflow-hidden border">
              <iframe
                src={`https://www.google.com/maps?q=${encodeURIComponent(
                  fullAddress
                )}&output=embed`}
                className="w-full h-full border-0"
                loading="lazy"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* GOOGLE MAPS */}
              <Button
                variant="outline"
                onClick={() =>
                  window.open(
                    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      fullAddress
                    )}`,
                    "_blank"
                  )
                }
              >
                <ExternalLink className="w-5 h-5 mr-2" />
                Google Maps
              </Button>

              {/* NAVIGATION */}
              <Button
                onClick={() =>
                  navigator.geolocation.getCurrentPosition((pos) => {
                    const { latitude, longitude } = pos.coords
                    window.open(
                      `https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${encodeURIComponent(
                        fullAddress
                      )}`,
                      "_blank"
                    )
                  })
                }
                className="bg-black text-white"
              >
                <Navigation className="w-5 h-5 mr-2" />
                Start Navigation
              </Button>
            </div>
          </div>

          {/* SERVICE DETAILS (unchanged visually) */}
          <div className="bg-white rounded-[2.5rem] p-8 border shadow-sm">
            <h3 className="text-xl font-bold mb-4">Service Details</h3>
            <p className="font-semibold text-slate-700">
              Arrival Window: {booking.time_slot}
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
