"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { ChevronRight, MapPin, ArrowRight, MessageCircle, Check, Calendar, Clock } from "lucide-react"
import { toast } from "react-toastify"
import { servicesData } from "../../../../lib/services-data"
import { formatINR } from "@/app/lib/currency"
import AuthGuard from "@/app/components/AuthGuard"

const ISSUE_OPTIONS = [
  { id: "not-cooling", label: "Not Cooling", icon: "❄️" },
  { id: "leaking", label: "Leaking Water", icon: "💧" },
  { id: "noisy", label: "Noisy", icon: "🔊" },
  { id: "other", label: "Other", icon: "⚙️" },
]

export default function BookingConfirmPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const id = params.id

  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("09:00 - 11:00")
  const [selectedIssues, setSelectedIssues] = useState<string[]>(["not-cooling"])
  const [additionalInstructions, setAdditionalInstructions] = useState("")
  const [fullName, setFullName] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [streetAddress, setStreetAddress] = useState("")
  const [aptSuite, setAptSuite] = useState("")
  const [city, setCity] = useState("")
  const [zipCode, setZipCode] = useState("")
  const [service, setService] = useState<any>(null)
  const [savedAddresses, setSavedAddresses] = useState<any[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL!

  /* ---------- LOAD STORED DATE/TIME ---------- */
  useEffect(() => {
    const storedDate = localStorage.getItem("bookingDate")
    const storedTime = localStorage.getItem("bookingTime")
    if (storedDate) setSelectedDate(storedDate)
    if (storedTime) setSelectedTimeSlot(storedTime)
  }, [])

  /* ---------- APPLY ADDRESS ---------- */
  const applyAddress = (addr: any) => {
    setSelectedAddressId(addr.id)
    setFullName(addr.full_name || "")
    setPhoneNumber(addr.phone || "")
    setStreetAddress(addr.street || "")
    setAptSuite(addr.apartment || "")
    setCity(addr.city || "")
    setZipCode(addr.postal_code || "")
  }

  /* ---------- FETCH SAVED ADDRESSES ---------- */
  useEffect(() => {
    const fetchAddresses = async () => {
      const token = localStorage.getItem("accessToken")
      if (!token) return

      try {
        const res = await fetch(`${API_URL}/addresses`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.message)

        setSavedAddresses(data.addresses)
        const defaultAddress = data.addresses.find((a: any) => a.is_default)
        if (defaultAddress) applyAddress(defaultAddress)
      } catch (err) {
        console.error("Address load failed", err)
      }
    }
    fetchAddresses()
  }, [])

  /* ---------- FETCH USER PROFILE ---------- */
  const hasFetched = useRef(false)
  useEffect(() => {
    if (hasFetched.current) return
    hasFetched.current = true

    const token = localStorage.getItem("accessToken")
    fetch(`${API_URL}/user/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    })
      .then((res) => res.json())
      .then((data) => {
        setFullName(`${data.first_name} ${data.last_name}`)
        setPhoneNumber(data.phone || "")
      })
  }, [])

  /* ---------- LOAD SERVICE DATA ---------- */
  useEffect(() => {
    const stored = localStorage.getItem("bookingService")
    if (stored) {
      setService(JSON.parse(stored))
    } else {
      const fallback = servicesData.find((s) => s.id === id)
      if (fallback) setService(fallback)
    }
  }, [id])

  if (!service) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#1d242d] mb-2">Service Not Found</h1>
          <Link href="/services" className="text-sm text-blue-600 hover:underline">
            ← Return to Services
          </Link>
        </div>
      </div>
    )
  }

  const toggleIssue = (issueId: string) => {
    setSelectedIssues((prev) =>
      prev.includes(issueId) ? prev.filter((id) => id !== issueId) : [...prev, issueId]
    )
  }

  /* ---------- PRICE CALCULATION ---------- */
  const _rawTotal = service?.totalPrice || service?.price || 0
  const _hasNewFmt = service?.basePrice != null && service?.taxAmount != null

  const serviceFee = _hasNewFmt
    ? Number(service.basePrice)
    : +(_rawTotal / 1.18).toFixed(2)

  const gstAmount = _hasNewFmt
    ? Number(service.taxAmount)
    : +(_rawTotal - serviceFee).toFixed(2)

  const total = +(serviceFee + gstAmount).toFixed(2)

  /* ---------- SUBMIT ---------- */
  const handleCompleteBooking = async () => {
    if (!streetAddress || !city || !fullName) {
      toast.error("Please fill in your address details")
      return
    }

    setSubmitting(true)

    try {
      const token = localStorage.getItem("accessToken")
      const bookingId = localStorage.getItem("bookingId")
      if (!bookingId) {
        toast.error("Booking ID missing")
        return
      }

      const res = await fetch(`${API_URL}/bookings/${bookingId}/complete`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          bookingDate: selectedDate,
          timeSlot: selectedTimeSlot,
          issues: selectedIssues,
          instructions: additionalInstructions,
          address: {
            street: streetAddress,
            apt: aptSuite,
            city,
            zipCode,
          },
          pricing: {
            serviceFee,
            tax: gstAmount,
            total,
          },
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Booking failed")

      toast.success("Booking completed!")
      router.push(`/services/${bookingId}/booking/success`)
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-white">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-6 flex-wrap">
            <Link href="/" className="hover:text-gray-600 transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/services" className="hover:text-gray-600 transition-colors">Services</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gray-700 font-medium">Booking Details</span>
          </nav>

          {/* Page Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1d242d] mb-2">
              Complete your booking
            </h1>
            <p className="text-gray-500 text-sm sm:text-base">
              Provide details for your AC service appointment.
            </p>
          </div>

          {/* Progress Steps */}
          <div className="bg-gray-50 rounded-xl border border-gray-100 p-4 sm:p-5 mb-8">
            <div className="flex items-center justify-between max-w-lg mx-auto">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-500 flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <span className="hidden sm:block text-xs font-bold text-[#1d242d]">Service</span>
              </div>
              <div className="flex-1 h-0.5 bg-emerald-500 mx-2 sm:mx-4 rounded-full" />
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-500 flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <span className="hidden sm:block text-xs font-bold text-[#1d242d]">Date & Time</span>
              </div>
              <div className="flex-1 h-0.5 bg-blue-600 mx-2 sm:mx-4 rounded-full" />
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                  3
                </div>
                <span className="hidden sm:block text-xs font-bold text-blue-600">Confirm</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* ============ MAIN FORM ============ */}
            <div className="lg:col-span-2 space-y-5">
              {/* Service Preference Card */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-[#1d242d]">Service Preference</h3>
                    <p className="text-xs text-gray-400">Date and issue details</p>
                  </div>
                </div>

                {/* Date */}
                <div className="mb-5">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full sm:w-auto px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all"
                  />
                </div>

                {/* Issue Selection */}
                <div className="mb-5">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    What's the issue?{" "}
                    <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                    {ISSUE_OPTIONS.map((issue) => (
                      <button
                        key={issue.id}
                        onClick={() => toggleIssue(issue.id)}
                        className={`flex items-center justify-center gap-1.5 px-3 py-3 rounded-xl border-2 text-xs sm:text-sm font-semibold transition-all ${
                          selectedIssues.includes(issue.id)
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white border-gray-200 text-gray-700 hover:border-blue-300"
                        }`}
                      >
                        <span>{issue.icon}</span>
                        <span>{issue.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Additional Instructions */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Additional Instructions
                  </label>
                  <textarea
                    value={additionalInstructions}
                    onChange={(e) => setAdditionalInstructions(e.target.value)}
                    placeholder="Describe the problem or give access instructions..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none text-sm transition-all"
                  />
                </div>
              </div>

              {/* Service Location Card */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-[#1d242d]">Service Location</h3>
                    <p className="text-xs text-gray-400">Where should we send the technician?</p>
                  </div>
                </div>

                {/* Saved Addresses */}
                {savedAddresses.length > 0 && (
                  <div className="mb-5 space-y-2.5">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Saved Addresses
                    </label>
                    {savedAddresses.map((addr) => {
                      const formatted = `${addr.street}${addr.apartment ? ", " + addr.apartment : ""}, ${addr.city}, ${addr.state} ${addr.postal_code}`
                      return (
                        <button
                          key={addr.id}
                          type="button"
                          onClick={() => applyAddress(addr)}
                          className={`w-full text-left rounded-xl p-4 border-2 transition-all ${
                            selectedAddressId === addr.id
                              ? "border-blue-500 bg-blue-50/50"
                              : "border-gray-100 hover:border-gray-300 bg-white"
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold text-sm text-[#1d242d]">{addr.label}</p>
                            {addr.is_default && (
                              <span className="text-[9px] bg-blue-600 text-white px-2 py-0.5 rounded-md font-bold">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-600">{addr.full_name} • {addr.phone}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{formatted}</p>
                        </button>
                      )
                    })}

                    <Link
                      href="/profile/addresses"
                      className="block text-center border-2 border-dashed border-gray-200 rounded-xl p-3.5 text-sm font-semibold text-gray-500 hover:border-blue-300 hover:text-blue-600 transition-colors"
                    >
                      + Add / Manage Addresses
                    </Link>
                  </div>
                )}

                {/* Manual Input */}
                <div>
                  {savedAddresses.length > 0 && (
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                      Or enter manually
                    </p>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Full Name</label>
                      <input
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Phone</label>
                      <input
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-gray-500 mb-1">Street Address</label>
                      <input
                        value={streetAddress}
                        onChange={(e) => setStreetAddress(e.target.value)}
                        placeholder="123 Main Street"
                        className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Apartment / Suite</label>
                      <input
                        value={aptSuite}
                        onChange={(e) => setAptSuite(e.target.value)}
                        placeholder="Apt 4B"
                        className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">City</label>
                      <input
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Ahmedabad"
                        className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Zip Code</label>
                      <input
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                        placeholder="382418"
                        className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile CTA (visible on mobile only) */}
              <div className="lg:hidden bg-white rounded-2xl border border-gray-100 p-5">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-500">Total</span>
                  <span className="text-xl font-bold text-blue-600">{formatINR(total.toFixed(2))}</span>
                </div>
                <button
                  onClick={handleCompleteBooking}
                  disabled={submitting}
                  className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-base hover:bg-blue-700 transition-all active:scale-[0.98] shadow-sm shadow-blue-200 flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {submitting ? "Submitting..." : "Complete Booking"}
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* ============ SIDEBAR ============ */}
            <div className="hidden lg:block lg:col-span-1">
              <div className="lg:sticky lg:top-24 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Header */}
                <div className="p-5 border-b border-gray-100">
                  <h3 className="font-bold text-lg text-[#1d242d]">Booking Summary</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Confirm your details</p>
                </div>

                <div className="p-5 space-y-5">
                  {/* Service Info */}
                  <div className="flex gap-3 p-3.5 bg-blue-50/60 rounded-xl border border-blue-100/50">
                    <div className="w-11 h-11 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm text-[#1d242d] truncate">{service.title}</h4>
                      <p className="text-[11px] text-gray-500 mt-0.5">Split AC • 1 Unit</p>
                    </div>
                  </div>

                  {/* Date & Time Display */}
                  {selectedDate && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-400">Scheduled</p>
                        <p className="text-sm font-semibold text-[#1d242d]">
                          {new Date(selectedDate).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                          {" • "}{selectedTimeSlot}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Price Breakdown */}
                  <div className="space-y-2.5 pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Service Fee</span>
                      <span className="font-semibold text-[#1d242d]">{formatINR(serviceFee.toFixed(2))}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">GST (18%)</span>
                      <span className="font-semibold text-[#1d242d]">{formatINR(gstAmount.toFixed(2))}</span>
                    </div>
                    <div className="flex items-center justify-between text-base font-bold pt-3 border-t border-gray-100">
                      <span className="text-[#1d242d]">Total</span>
                      <span className="text-blue-600">{formatINR(total.toFixed(2))}</span>
                    </div>
                  </div>

                  {/* CTA */}
                  <button
                    onClick={handleCompleteBooking}
                    disabled={submitting}
                    className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold text-sm hover:bg-blue-700 transition-all active:scale-[0.98] shadow-sm shadow-blue-200 flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {submitting ? "Submitting..." : "Complete Booking"}
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  {/* Security */}
                  <div className="flex items-center justify-center gap-2">
                    <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span className="text-[11px] text-gray-400">Encrypted & Secure</span>
                  </div>
                </div>

                {/* Help */}
                <div className="bg-gray-50 border-t border-gray-100 p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 bg-white rounded-lg border border-gray-100 flex items-center justify-center shrink-0">
                      <MessageCircle className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#1d242d]">Need Help?</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">Support available 24/7</p>
                      <a href="tel:+919824897099" className="text-xs text-blue-600 font-semibold mt-1 inline-block hover:underline">
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
