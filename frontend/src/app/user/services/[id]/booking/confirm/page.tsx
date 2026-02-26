"use client"

import { use, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { ChevronRight, User, Phone, MapPin, ArrowRight, MessageCircle } from "lucide-react"
import { toast } from "react-toastify"
import { servicesData } from "../../../../lib/services-data"
import { formatINR } from "@/app/lib/currency"

const ISSUE_OPTIONS = [
  { id: "not-cooling", label: "Not Cooling", icon: "❄️" },
  { id: "leaking", label: "Leaking Water", icon: "💧" },
  { id: "noisy", label: "Noisy", icon: "🔊" },
  { id: "other", label: "Other", icon: "⚙️" },
]

export default function BookingConfirmPage (){
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const id = params.id
  // const service = servicesData.find((s) => s.id === id)

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
  const [saveAddress, setSaveAddress] = useState(false)
  const [service, setService] = useState<any>(null)

  const [savedAddresses, setSavedAddresses] = useState<any[]>([])
const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL!

useEffect(() => {
  const storedDate = localStorage.getItem("bookingDate")
  const storedTime = localStorage.getItem("bookingTime")

  if (storedDate) setSelectedDate(storedDate)
  if (storedTime) setSelectedTimeSlot(storedTime)
}, [])

const applyAddress = (addr: any) => {
  setSelectedAddressId(addr.id)

  setFullName(addr.full_name || "")
  setPhoneNumber(addr.phone || "")
  setStreetAddress(addr.street || "")
  setAptSuite(addr.apartment || "")
  setCity(addr.city || "")
  setZipCode(addr.postal_code || "")
}

useEffect(() => {
  const fetchAddresses = async () => {
    const token = localStorage.getItem("accessToken")
    if (!token) return

    try {
      const res = await fetch(`${API_URL}/addresses`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message)

      setSavedAddresses(data.addresses)

      // AUTO SELECT DEFAULT ADDRESS ⭐
      const defaultAddress = data.addresses.find((a: any) => a.is_default)

      if (defaultAddress) {
        applyAddress(defaultAddress)
      }
    } catch (err) {
      console.error("Address load failed", err)
    }
  }

  fetchAddresses()
}, [])

const hasFetched = useRef(false)

useEffect(() => {
  if (hasFetched.current) return
  hasFetched.current = true

  const token = localStorage.getItem("accessToken")

  fetch(`${API_URL}/user/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  })
    .then(res => res.json())
    .then(data => {
      setFullName(`${data.first_name} ${data.last_name}`)
      setPhoneNumber(data.phone || "")
    })
}, [])

useEffect(() => {
  const stored = localStorage.getItem("bookingService")

  if (stored) {
    setService(JSON.parse(stored))
  } else {
    const fallback = servicesData.find(s => s.id === id)
    if (fallback) setService(fallback)
  }
}, [id])

  if (!service) {
    return (
      <div className="min-h-screen bg-white">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Service Not Found</h1>
            <Link href="/services" className="text-blue-600 hover:underline">
              Return to Services
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const toggleIssue = (issueId: string) => {
    setSelectedIssues((prev) => (prev.includes(issueId) ? prev.filter((id) => id !== issueId) : [...prev, issueId]))
  }

  const serviceFee = service.price
  const estimatedParts = 10.0
  const taxes = (serviceFee + estimatedParts) * 0.08
  const total = serviceFee + estimatedParts + taxes

const handleCompleteBooking = async () => {
  try {
    const token = localStorage.getItem("accessToken")
    const id = localStorage.getItem("bookingId")
    if (!id) {
  toast.error("Booking ID missing")
  return
}

    const res = await fetch(`${API_URL}/bookings/${id}/complete`, {
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
    parts: estimatedParts,
    tax: taxes,
    total,
  },
}),
})
const data = await res.json()


if (!res.ok) {
  throw new Error(data.message || "Booking failed")
}

    toast.success("Booking completed!")
    console.log("Booking Id is a ",id)
    router.push(`/user/services/${id}/booking/success`)
  } catch (err: any) {
    toast.error(err.message)
  }
}


  return (
    <div className="min-h-screen bg-gray-50 font-sans animate-fade-in">

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
          <Link href="/user" className="hover:text-blue-600">
            Home
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/user/services" className="hover:text-blue-600">
            Services
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium">Booking Details</span>
        </nav>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Complete your booking</h1>
          <p className="text-gray-600">Please provide the details for your AC service.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Service Preference */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-start gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-lg">Service Preference</h3>
                  <p className="text-sm text-gray-500">Choose a convenient date and time</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  />
                </div>
                {/* <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Time Slot</label>
                  <div className="grid grid-cols-2 gap-2">
                    {["09:00 - 11:00", "11:00 - 13:00", "14:00 - 16:00", "16:00 - 18:00"].map((slot) => (
                      <button
                        key={slot}
                        onClick={() => setSelectedTimeSlot(slot)}
                        className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                          selectedTimeSlot === slot
                            ? "bg-blue-600 text-white border-2 border-blue-600"
                            : "bg-white border border-gray-300 text-gray-700 hover:border-blue-300"
                        }`}
                      >
                        {slot}
                        <br />
                        <span className="text-[10px] font-normal opacity-75">
                          {slot.startsWith("09") || slot.startsWith("11")
                            ? "Morning"
                            : slot.startsWith("14")
                              ? "Afternoon"
                              : "Evening"}
                        </span>
                      </button>
                    ))}
                  </div>
                </div> */}
              </div>

              {/* What's the issue */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  What's the issue? <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {ISSUE_OPTIONS.map((issue) => (
                    <button
                      key={issue.id}
                      onClick={() => toggleIssue(issue.id)}
                      className={`flex items-center justify-center cursor-pointer gap-2 px-4 py-3 rounded-lg border-2 text-sm font-semibold transition-all ${
                        selectedIssues.includes(issue.id)
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white border-gray-300 text-gray-700 hover:border-blue-300"
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
                <label className="block text-sm font-semibold text-gray-700 mb-2">Additional Instructions</label>
                <textarea
                  value={additionalInstructions}
                  onChange={(e) => setAdditionalInstructions(e.target.value)}
                  placeholder="Describe the problem or give access instructions..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent resize-none"
                />
              </div>
            </div>

            {/* Service Location */}
            <div className="bg-white rounded-xl border p-6 mb-6">
                  <div className="flex items-start gap-3 mb-6">
                    <MapPin className="w-6 h-6 text-green-600"/>
                    <div>
                      <h3 className="font-bold text-lg">Service Location</h3>
                      <p className="text-sm text-gray-500">Select a saved address</p>
                    </div>
                  </div>
            
                  {/* SAVED ADDRESSES */}
                  {savedAddresses.length > 0 && (
                    <div className="mb-6 space-y-3">
                      {savedAddresses.map(addr => {
            
                        const formatted =
                          `${addr.street}, ${addr.apartment ?? ""}, ${addr.city}, ${addr.state} ${addr.postal_code}`
            
                        return (
                          <button
                            key={addr.id}
                            type="button"
                            onClick={() => applyAddress(addr)}
                            className={`w-full text-left border rounded-lg p-4 transition ${
                              selectedAddressId === addr.id
                                ? "border-blue-600 bg-blue-50"
                                : "border-gray-200 hover:border-blue-300"
                            }`}
                          >
                            <p className="font-semibold">
                              {addr.label}
                              {addr.is_default && (
                                <span className="ml-2 text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded-full">
                                  Default
                                </span>
                              )}
                            </p>
            
                            <p className="text-sm">{addr.full_name}</p>
                            <p className="text-xs text-gray-500">{formatted}</p>
                            <p className="text-xs text-gray-500">{addr.phone}</p>
                          </button>
                        )
                      })}
            
                      <Link
                        href="/user/profile/addresses"
                        className="block text-center border-2 border-dashed rounded-lg p-4 text-sm font-semibold text-gray-600 hover:border-blue-400 hover:text-blue-600"
                      >
                        + Add / Manage Addresses
                      </Link>
                    </div>
                  )}
            
                  {/* MANUAL INPUT (still allowed) */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <input value={fullName} onChange={e=>setFullName(e.target.value)} placeholder="Full Name" className="border rounded-lg px-3 py-2"/>
                    <input value={phoneNumber} onChange={e=>setPhoneNumber(e.target.value)} placeholder="Phone" className="border rounded-lg px-3 py-2"/>
                    <input value={streetAddress} onChange={e=>setStreetAddress(e.target.value)} placeholder="Street" className="border rounded-lg px-3 py-2 md:col-span-2"/>
                    <input value={aptSuite} onChange={e=>setAptSuite(e.target.value)} placeholder="Apartment" className="border rounded-lg px-3 py-2"/>
                    <input value={city} onChange={e=>setCity(e.target.value)} placeholder="City" className="border rounded-lg px-3 py-2"/>
                    <input value={zipCode} onChange={e=>setZipCode(e.target.value)} placeholder="Zip Code" className="border rounded-lg px-3 py-2"/>
                  </div>
                </div>
          </div>

          {/* Booking Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h3 className="font-bold text-lg mb-1">Booking Summary</h3>
              <p className="text-xs text-gray-500 mb-6">Order #MC-82921</p>

              {/* Service Info */}
              <div className="mb-6 pb-6 border-b border-gray-100">
                <div className="flex gap-3">
                  <div className="w-16 h-16 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <span className="inline-block bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-1 rounded mb-2 uppercase tracking-wider">
                      Repair
                    </span>
                    <h4 className="font-bold text-sm mb-1">{service.title}</h4>
                    <p className="text-xs text-gray-600 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                        />
                      </svg>
                      Split AC • 1 Unit
                    </p>
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Service Fee</span>
                  <span className="font-semibold">{formatINR(serviceFee.toFixed(2))}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Est. Parts</span>
                  <span className="font-semibold">{formatINR(estimatedParts.toFixed(2))}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Taxes (8%)</span>
                  <span className="font-semibold">{formatINR(taxes.toFixed(2))}</span>
                </div>
                <div className="flex items-center justify-between text-lg font-bold pt-3 border-t border-gray-200">
                  <span>Total</span>
                  <span className="text-blue-600">{formatINR(total.toFixed(2))}</span>
                </div>
              </div>

              {/* Complete Button */}
              <button
                onClick={handleCompleteBooking}
                className="w-full bg-blue-600 cursor-pointer text-white py-4 rounded-lg font-bold hover:bg-blue-700 transition-all active:scale-[0.98] shadow-lg shadow-blue-200 flex items-center justify-center gap-2 mb-3"
              >
                Complete Booking
                <ArrowRight className="w-5 h-5" />
              </button>

              {/* Security Badge */}
              <div className="flex items-center justify-center gap-2 mb-6">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <span className="text-xs text-gray-500">Encrypted & Secure Payment</span>
              </div>

              {/* Need Help */}
              <div className="bg-blue-50 rounded-lg p-4 flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                  <MessageCircle className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-sm mb-1">Need Help?</p>
                  <p className="text-xs text-gray-600">Our support team is available 24/7 to assist you</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
