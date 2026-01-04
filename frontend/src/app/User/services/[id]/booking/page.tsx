"use client"

import { use, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Calendar, ChevronRight, ChevronLeft, Info, MessageCircle, Check } from "lucide-react"
import { servicesData } from "@/app/User/lib/services-data"

// Generate calendar days for the current month
function generateCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const daysInMonth = lastDay.getDate()
  const startingDayOfWeek = firstDay.getDay()

  const days = []

  // Add empty slots for days before the first day of the month
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null)
  }

  // Add actual days
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }

  return days
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

const DAY_NAMES = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]

const MORNING_SLOTS = ["08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM"]
const AFTERNOON_SLOTS = ["12:00 PM", "02:00 PM", "04:00 PM", "05:30 PM"]

export default function BookingPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = use(params)
  const service = servicesData.find((s) => s.id === id)

  const [currentDate] = useState(new Date())
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth())
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear())
  const [selectedDay, setSelectedDay] = useState(5)
  const [selectedTime, setSelectedTime] = useState("10:00 AM")

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

  const calendarDays = generateCalendarDays(selectedYear, selectedMonth)

  const handlePreviousMonth = () => {
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

  const subtotal = service.price
  const taxAndFees = 2.5
  const total = subtotal + taxAndFees

  return (
    <div className="min-h-screen bg-gray-50 font-sans animate-fade-in">

      <main className="max-w-fit mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-blue-600">
            Home
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link href={`/services/${id}`} className="hover:text-blue-600">
            {service.category}
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium">Schedule</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Select Date & Time</h1>
          <p className="text-gray-600">
            Choose a convenient slot for our HVAC experts to visit your property. We value your time.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex items-center justify-between max-w-2xl">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white">
                <Check className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Step 1</p>
                <p className="font-bold text-sm">Service Selection</p>
              </div>
            </div>

            <div className="hidden sm:block flex-1 h-0.5 bg-blue-600 mx-4"></div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                2
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Step 2</p>
                <p className="font-bold text-sm">Date & Time</p>
              </div>
            </div>

            <div className="hidden sm:block flex-1 h-0.5 bg-gray-200 mx-4"></div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 font-bold">
                3
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Step 3</p>
                <p className="font-bold text-sm text-gray-400">Confirmation</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar and Time Selection */}
          <div className="lg:col-span-2 space-y-6">
            {/* Calendar */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <div>
                    <h2 className="font-bold text-lg">
                      {MONTH_NAMES[selectedMonth]} {selectedYear}
                    </h2>
                    <p className="text-xs text-gray-500">Availability for your area</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={handlePreviousMonth} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button onClick={handleNextMonth} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2">
                {DAY_NAMES.map((day) => (
                  <div key={day} className="text-center text-xs font-semibold text-gray-500 py-2">
                    {day}
                  </div>
                ))}
                {calendarDays.map((day, index) => (
                  <button
                    key={index}
                    onClick={() => day && setSelectedDay(day)}
                    disabled={!day}
                    className={`
                      aspect-square p-2 rounded-lg text-sm font-medium transition-all
                      ${!day ? "invisible" : ""}
                      ${
                        day === selectedDay
                          ? "bg-blue-600 text-white shadow-lg scale-105"
                          : "hover:bg-gray-100 text-gray-700"
                      }
                      ${
                        day && day < currentDate.getDate() && selectedMonth === currentDate.getMonth()
                          ? "text-gray-300 cursor-not-allowed"
                          : ""
                      }
                    `}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            {/* Time Slots */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              {/* Morning */}
              <div className="mb-6">
                <h3 className="font-bold text-sm uppercase tracking-wider text-gray-500 mb-4">Morning</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {MORNING_SLOTS.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`
                        px-4 py-3 rounded-lg border-2 text-sm font-semibold transition-all
                        ${
                          selectedTime === time
                            ? "border-blue-600 bg-blue-600 text-white shadow-md"
                            : "border-gray-200 hover:border-blue-200 hover:bg-blue-50"
                        }
                      `}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              {/* Afternoon */}
              <div>
                <h3 className="font-bold text-sm uppercase tracking-wider text-gray-500 mb-4">Afternoon</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {AFTERNOON_SLOTS.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`
                        px-4 py-3 rounded-lg border-2 text-sm font-semibold transition-all
                        ${
                          selectedTime === time
                            ? "border-blue-600 bg-blue-600 text-white shadow-md"
                            : "border-gray-200 hover:border-blue-200 hover:bg-blue-50"
                        }
                      `}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Pro Tip */}
            <div className="bg-blue-50 rounded-lg p-4 flex gap-3">
              <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm text-blue-900 mb-1">Pro Tip:</p>
                <p className="text-sm text-blue-700">
                  Morning slots are recommended for AC maintenance as it allows better temperature readings before the
                  afternoon heat.
                </p>
              </div>
            </div>
          </div>

          {/* Booking Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 sticky top-24">
              <h3 className="font-bold text-lg mb-1">Booking Summary</h3>
              <p className="text-xs text-gray-500 mb-6">Order #MC-82921</p>

              {/* Service Info */}
              <div className="flex gap-4 p-4 bg-blue-50 rounded-lg mb-6">
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
                  <h4 className="font-bold text-sm mb-1">{service.title}</h4>
                  <p className="text-xs text-gray-600">Split Unit • 1 Unit</p>
                  <span className="inline-block bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded mt-2 uppercase tracking-wider">
                    {service.badge || "Premium"}
                  </span>
                </div>
              </div>

              {/* Date & Time */}
              <div className="mb-4 pb-4 border-b border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span className="text-xs font-semibold uppercase tracking-wider">Date & Time</span>
                  </div>
                  <button className="text-blue-600 text-xs font-semibold hover:underline">Edit</button>
                </div>
                <p className="font-bold text-sm">
                  Thu, Oct {selectedDay}, {selectedYear}
                </p>
                <p className="text-blue-600 text-sm font-semibold">
                  {selectedTime} - {Number.parseInt(selectedTime) + 1}:30 {selectedTime.includes("AM") ? "AM" : "PM"}
                </p>
              </div>

              {/* Location */}
              <div className="mb-6 pb-6 border-b border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-gray-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span className="text-xs font-semibold uppercase tracking-wider">Location</span>
                  </div>
                  <button className="text-blue-600 text-xs font-semibold hover:underline">Edit</button>
                </div>
                <p className="text-sm font-semibold">123 Palm Avenue, Metro City</p>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Tax & Fees</span>
                  <span className="font-semibold">${taxAndFees.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-lg font-bold pt-3 border-t border-gray-100">
                  <span>Total</span>
                  <span className="text-blue-600">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Continue Button */}
              <button className="w-full bg-blue-600 text-white py-4 rounded-lg font-bold hover:bg-blue-700 transition-all active:scale-[0.98] shadow-lg shadow-blue-200 flex items-center justify-center gap-2 mb-4">
                Continue Booking
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Guarantee Badge */}
              <div className="flex items-center justify-center gap-2 mb-6">
                <Check className="w-4 h-4 text-green-600" />
                <span className="text-xs text-gray-600">100% Satisfaction Guarantee</span>
              </div>

              {/* Assistance */}
              <div className="bg-gray-50 rounded-lg p-4 flex items-start gap-3">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shrink-0">
                  <MessageCircle className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-sm mb-1">Need assistance?</p>
                  <p className="text-xs text-gray-600 mb-2">We're here to help 24/7</p>
                  <button className="text-blue-600 text-xs font-bold hover:underline">Chat Now</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
