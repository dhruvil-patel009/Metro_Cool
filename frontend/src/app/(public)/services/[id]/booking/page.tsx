"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { Calendar, ChevronRight, ChevronLeft, Info, MessageCircle, Check } from "lucide-react"
import { formatINR } from "@/app/lib/currency"
import { getServiceById } from "@/app/(public)/lib/services.api"
import AuthGuard from "@/app/components/AuthGuard"

/* ---------------- TYPES ---------------- */
interface Service {
  id: string
  title: string
  category: string
  price: number
  original_price?: number
  originalPrice?: number
  badge?: string
}

/* ---------------- CALENDAR HELPERS ---------------- */
function generateCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const daysInMonth = lastDay.getDate()
  const startingDayOfWeek = firstDay.getDay()
  const days: (number | null)[] = []

  for (let i = 0; i < startingDayOfWeek; i++) days.push(null)
  for (let i = 1; i <= daysInMonth; i++) days.push(i)

  return days
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
]

const DAY_NAMES = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]

export default function BookingPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const id = params?.id as string
  const searchParams = useSearchParams()

  const selectedAddons = JSON.parse(searchParams.get("addons") || "[]")
  const selectedTotal = Number(searchParams.get("total") || 0)

  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL!

  /* ---------------- STATE ---------------- */
  const [service, setService] = useState<Service | null>(null)
  const [serviceLoading, setServiceLoading] = useState(true)

  const today = new Date()
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth())
  const [selectedYear, setSelectedYear] = useState(today.getFullYear())
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [selectedTime] = useState("10:00 AM")
  const [blockedDates, setBlockedDates] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  /* ---------------- FETCH SERVICE ---------------- */
  useEffect(() => {
    if (!id) return
    async function loadService() {
      try {
        const data = (await getServiceById(id)) as Service
        setService({
          ...data,
          originalPrice: data.original_price ?? data.originalPrice ?? data.price + 20,
        })
      } catch {
        setService(null)
      } finally {
        setServiceLoading(false)
      }
    }
    loadService()
  }, [id])

  /* ---------------- FETCH BLOCKED DATES ---------------- */
  useEffect(() => {
    if (!id) return
    const month = `${selectedYear}-${String(selectedMonth + 1).padStart(2, "0")}`
    fetch(`${API_URL}/bookings/dates?serviceId=${id}&month=${month}`)
      .then((res) => res.json())
      .then((data) => setBlockedDates(data.dates || []))
      .catch(() => setBlockedDates([]))
  }, [selectedMonth, selectedYear, id])

  /* ---------------- AUTO SELECT FIRST AVAILABLE DAY ---------------- */
  useEffect(() => {
    const days = generateCalendarDays(selectedYear, selectedMonth)
    for (const day of days) {
      if (!day) continue
      const formattedDate = `${selectedYear}-${String(selectedMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
      const isBooked = blockedDates.includes(formattedDate)
      const isPast = day < today.getDate() && selectedMonth === today.getMonth() && selectedYear === today.getFullYear()
      if (!isBooked && !isPast) {
        setSelectedDay(day)
        break
      }
    }
  }, [blockedDates, selectedMonth, selectedYear])

  /* ---------------- BOOKING HANDLER ---------------- */
  const handleContinueBooking = async () => {
    if (!selectedDay) {
      alert("Please select a date")
      return
    }

    const bookingDate = `${selectedYear}-${String(selectedMonth + 1).padStart(2, "0")}-${String(selectedDay).padStart(2, "0")}`
    const token = localStorage.getItem("accessToken")

    if (!token) {
      router.push("/login")
      return
    }

    setLoading(true)

    try {
      const res = await fetch(`${API_URL}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ serviceId: id, bookingDate, timeSlot: selectedTime }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message)

      setBlockedDates((prev) => [...prev, bookingDate])

      localStorage.setItem("bookingId", data.booking.id)
      localStorage.setItem("bookingDate", bookingDate)
      localStorage.setItem("bookingTime", selectedTime)
      localStorage.setItem(
        "bookingService",
        JSON.stringify({
          ...service,
          totalPrice: total,
          basePrice: subtotal,
          taxAmount: taxAndFees,
          selectedAddons,
        })
      )

      router.push(`/services/${id}/booking/confirm`)
    } catch (err: any) {
      alert(err.message || "Booking failed")
    } finally {
      setLoading(false)
    }
  }

  /* ---------------- CALENDAR NAVIGATION ---------------- */
  const calendarDays = generateCalendarDays(selectedYear, selectedMonth)

  const handlePreviousMonth = () => {
    const isCurrentMonth = selectedMonth === today.getMonth() && selectedYear === today.getFullYear()
    if (isCurrentMonth) return
    if (selectedMonth === 0) {
      setSelectedMonth(11)
      setSelectedYear(selectedYear - 1)
    } else {
      setSelectedMonth(selectedMonth - 1)
    }
  }

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0)
      setSelectedYear(selectedYear + 1)
    } else {
      setSelectedMonth(selectedMonth + 1)
    }
  }

  /* ---------------- PRICING ---------------- */
  const subtotal = selectedTotal || Number(service?.price || 0)
  const taxAndFees = +(subtotal * 0.18).toFixed(2)
  const total = subtotal + taxAndFees

  /* ---------------- LOADING / ERROR ---------------- */
  if (serviceLoading) {
    return (
      <div className="loader-wrapper">
        <div className="loader"></div>
      </div>
    )
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-700">Service Not Found</p>
          <Link href="/services" className="text-sm text-blue-600 mt-2 inline-block hover:underline">
            ← Back to services
          </Link>
        </div>
      </div>
    )
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-white">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-6 flex-wrap">
            <Link href="/" className="hover:text-gray-600 transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href={`/services/${id}`} className="hover:text-gray-600 transition-colors">
              {service.category || "Service"}
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gray-700 font-medium">Schedule</span>
          </nav>

          {/* Page Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1d242d] mb-2">
              Select Date & Time
            </h1>
            <p className="text-gray-500 text-sm sm:text-base max-w-xl">
              Choose a convenient slot for our AC experts to visit your property.
            </p>
          </div>

          {/* Progress Steps */}
          <div className="bg-gray-50 rounded-xl border border-gray-100 p-4 sm:p-5 mb-8">
            <div className="flex items-center justify-between max-w-lg mx-auto">
              {/* Step 1 - Done */}
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-500 flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <div className="hidden sm:block">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Step 1</p>
                  <p className="text-xs font-bold text-[#1d242d]">Service</p>
                </div>
              </div>

              <div className="flex-1 h-0.5 bg-blue-600 mx-2 sm:mx-4 rounded-full" />

              {/* Step 2 - Active */}
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                  2
                </div>
                <div className="hidden sm:block">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Step 2</p>
                  <p className="text-xs font-bold text-blue-600">Date & Time</p>
                </div>
              </div>

              <div className="flex-1 h-0.5 bg-gray-200 mx-2 sm:mx-4 rounded-full" />

              {/* Step 3 - Pending */}
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs font-bold">
                  3
                </div>
                <div className="hidden sm:block">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Step 3</p>
                  <p className="text-xs font-bold text-gray-400">Confirm</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Left - Calendar */}
            <div className="lg:col-span-2 space-y-5">
              {/* Calendar Card */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 shadow-sm">
                {/* Calendar Header */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="font-bold text-base sm:text-lg text-[#1d242d]">
                        {MONTH_NAMES[selectedMonth]} {selectedYear}
                      </h2>
                      <p className="text-[11px] text-gray-400">Available slots for your area</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={handlePreviousMonth}
                      disabled={selectedMonth === today.getMonth() && selectedYear === today.getFullYear()}
                      className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleNextMonth}
                      className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1 sm:gap-2">
                  {/* Day headers */}
                  {DAY_NAMES.map((day) => (
                    <div key={day} className="text-center text-[11px] font-bold text-gray-400 uppercase py-2">
                      {day}
                    </div>
                  ))}

                  {/* Day cells */}
                  {calendarDays.map((day, index) => {
                    if (!day) return <div key={index} />

                    const formattedDate = `${selectedYear}-${String(selectedMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
                    const isBooked = blockedDates.includes(formattedDate)
                    const isPast = day < today.getDate() && selectedMonth === today.getMonth() && selectedYear === today.getFullYear()
                    const isSelected = day === selectedDay
                    const isToday = day === today.getDate() && selectedMonth === today.getMonth() && selectedYear === today.getFullYear()
                    const isDisabled = isBooked || isPast

                    return (
                      <button
                        key={index}
                        onClick={() => !isDisabled && setSelectedDay(day)}
                        disabled={isDisabled}
                        className={`
                          aspect-square flex items-center justify-center rounded-xl text-sm font-medium transition-all
                          ${isSelected
                            ? "bg-blue-600 text-white shadow-md shadow-blue-200 scale-105"
                            : isToday
                              ? "bg-blue-50 text-blue-600 border border-blue-200"
                              : isDisabled
                                ? "text-gray-300 cursor-not-allowed"
                                : "text-gray-700 hover:bg-gray-100"
                          }
                        `}
                      >
                        {day}
                      </button>
                    )
                  })}
                </div>

                {/* Legend */}
                <div className="flex flex-wrap items-center gap-4 mt-5 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-blue-600" />
                    <span className="text-[11px] text-gray-500">Selected</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-blue-50 border border-blue-200" />
                    <span className="text-[11px] text-gray-500">Today</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-gray-100" />
                    <span className="text-[11px] text-gray-500">Unavailable</span>
                  </div>
                </div>
              </div>

              {/* Pro Tip */}
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3">
                <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm text-[#1d242d] mb-0.5">Pro Tip</p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Morning slots are recommended for AC maintenance as it allows better temperature readings before the afternoon heat.
                  </p>
                </div>
              </div>
            </div>

            {/* Right - Booking Summary */}
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-24 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Summary Header */}
                <div className="p-5 sm:p-6 border-b border-gray-100">
                  <h3 className="font-bold text-lg text-[#1d242d]">Booking Summary</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Review your selection</p>
                </div>

                <div className="p-5 sm:p-6 space-y-5">
                  {/* Service Info */}
                  <div className="flex gap-3 p-3.5 bg-blue-50/60 rounded-xl border border-blue-100/50">
                    <div className="w-11 h-11 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm text-[#1d242d] truncate">{service.title}</h4>
                      <p className="text-[11px] text-gray-500 mt-0.5">Split Unit • 1 Unit</p>
                      {service.badge && (
                        <span className="inline-block bg-emerald-50 text-emerald-600 border border-emerald-100 text-[9px] font-bold px-2 py-0.5 rounded-md mt-1.5 uppercase tracking-wider">
                          {service.badge}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Date & Time */}
                  <div className="pb-4 border-b border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 text-gray-500">
                        <Calendar className="w-3.5 h-3.5" />
                        <span className="text-[11px] font-bold uppercase tracking-wider">Date & Time</span>
                      </div>
                    </div>
                    <p className="text-sm font-bold text-[#1d242d]">
                      {selectedDay
                        ? `${MONTH_NAMES[selectedMonth]} ${selectedDay}, ${selectedYear}`
                        : "Select a date"}
                    </p>
                    <p className="text-sm font-medium text-blue-600 mt-0.5">
                      {selectedTime} - {Number.parseInt(selectedTime) + 1}:30 {selectedTime.includes("AM") ? "AM" : "PM"}
                    </p>
                  </div>

                  {/* Location */}
                  <div className="pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-2 text-gray-500 mb-2">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-[11px] font-bold uppercase tracking-wider">Location</span>
                    </div>
                    <p className="text-sm font-medium text-gray-600">Address provided on next step</p>
                  </div>

                  {/* Price Breakdown */}
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Subtotal</span>
                      <span className="font-semibold text-[#1d242d]">{formatINR(subtotal.toFixed(2))}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">GST (18%)</span>
                      <span className="font-semibold text-[#1d242d]">{formatINR(taxAndFees.toFixed(2))}</span>
                    </div>
                    <div className="flex items-center justify-between text-base font-bold pt-3 border-t border-gray-100">
                      <span className="text-[#1d242d]">Total</span>
                      <span className="text-blue-600">{formatINR(total.toFixed(2))}</span>
                    </div>
                  </div>

                  {/* CTA */}
                  <button
                    onClick={handleContinueBooking}
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold text-sm hover:bg-blue-700 transition-all active:scale-[0.98] shadow-sm shadow-blue-200 flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {loading ? "Booking..." : "Continue Booking"}
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  {/* Guarantee */}
                  <div className="flex items-center justify-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-[11px] text-gray-500 font-medium">100% Satisfaction Guarantee</span>
                  </div>
                </div>

                {/* Help Section */}
                <div className="bg-gray-50 border-t border-gray-100 p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 bg-white rounded-lg border border-gray-100 flex items-center justify-center shrink-0">
                      <MessageCircle className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#1d242d]">Need help?</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">We're available 24/7</p>
                      <a href="tel:+919824897099" className="text-xs text-blue-600 font-semibold mt-1.5 inline-block hover:underline">
                        Call Support
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  )
}
