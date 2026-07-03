"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Star, CheckCircle, ArrowRight } from "lucide-react"
import { toast } from "react-toastify"
import AuthGuard from "@/app/components/AuthGuard"

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL!

export default function FeedbackContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const bookingId = searchParams.get("id")
  const [booking, setBooking] = useState<any>(null)
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [feedback, setFeedback] = useState("")
  const [submitting, setSubmitting] = useState(false)

  /* ---------------- FETCH BOOKING ---------------- */
  useEffect(() => {
    if (!bookingId) return
    const token = localStorage.getItem("accessToken")

    fetch(`${API_URL}/bookings/${bookingId}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    })
      .then((res) => res.json())
      .then((data) => setBooking(data.booking))
  }, [bookingId])

  /* ---------------- LOADING ---------------- */
  if (!booking) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="loader-wrapper">
          <div className="loader"></div>
        </div>
      </div>
    )
  }

  /* ---------------- DERIVED DATA ---------------- */
  const serviceTitle = booking.service?.title || "Service"
  const serviceImg =
    booking.service?.image_url || "/assets/technician-working-on-ac-unit.jpg"
  const technicianName =
    booking.technician?.full_name || booking.technician?.name || "Your Technician"

  const bookingDate = new Date(booking.booking_date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })

  const orderId = `#${booking.id.slice(0, 8)}`

  /* ---------------- TAGS ---------------- */
  const tags = [
    { id: "professional", label: "Professional", icon: "👔" },
    { id: "on-time", label: "On-Time", icon: "⏰" },
    { id: "clean-work", label: "Clean Work", icon: "✨" },
    { id: "friendly", label: "Friendly", icon: "😊" },
    { id: "knowledgeable", label: "Knowledgeable", icon: "🎓" },
    { id: "good-value", label: "Good Value", icon: "💰" },
  ]

  const ratingLabels = [
    "",
    "Poor Service",
    "Below Average",
    "Good Service",
    "Excellent!",
    "Outstanding!",
  ]

  const ratingColors = [
    "",
    "text-red-500",
    "text-orange-500",
    "text-yellow-600",
    "text-blue-600",
    "text-emerald-600",
  ]

  const toggleTag = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    )
  }

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async () => {
    if (!rating) {
      toast.error("Please select a rating")
      return
    }

    try {
      setSubmitting(true)
      const token = localStorage.getItem("accessToken")

      const res = await fetch(`${API_URL}/feedbacks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          booking_id: booking.id,
          service_id: booking.service.id,
          rating,
          tags: selectedTags,
          comment: feedback,
        }),
      })

      if (!res.ok) throw new Error("Failed to submit feedback")

      toast.success("Thank you for your feedback! 🎉")

      setTimeout(() => {
        router.push(`/bookings/completion?id=${bookingId}`)
      }, 1000)
    } catch (err) {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleSkip = () => {
    router.push(`/bookings/completion?id=${bookingId}`)
  }

  return (
    <AuthGuard>
      <main className="min-h-screen bg-white py-8 sm:py-12 px-4">
        <div className="max-w-xl mx-auto">
          {/* Card */}
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Top accent */}
            <div className="h-1.5 bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600" />

            <div className="p-5 sm:p-8">
              {/* Service Info Header */}
              <div className="flex items-start gap-4 mb-8 pb-6 border-b border-gray-100">
                <div className="relative shrink-0">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-gray-100">
                    <img
                      src={serviceImg}
                      alt="Service"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                    <CheckCircle className="w-3 h-3 text-white" />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h2 className="text-base sm:text-lg font-bold text-[#1d242d] truncate">
                      {serviceTitle}
                    </h2>
                    <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                      Completed
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    Service by <span className="font-medium text-[#1d242d]">{technicianName}</span>
                  </p>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400">
                    <span>{bookingDate}</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full" />
                    <span>Order {orderId}</span>
                  </div>
                </div>
              </div>

              {/* Rating Section */}
              <div className="text-center mb-8">
                <h1 className="text-xl sm:text-2xl font-bold text-[#1d242d] mb-1.5">
                  How was your experience?
                </h1>
                <p className="text-sm text-gray-500 mb-6">
                  Your feedback helps us maintain high quality service.
                </p>

                {/* Star Rating */}
                <div className="flex justify-center gap-1.5 sm:gap-2 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="transition-transform hover:scale-110 active:scale-95"
                    >
                      <Star
                        className={`w-10 h-10 sm:w-12 sm:h-12 transition-colors ${
                          star <= (hoveredRating || rating)
                            ? "fill-amber-400 text-amber-400"
                            : "fill-gray-200 text-gray-200"
                        }`}
                      />
                    </button>
                  ))}
                </div>

                {rating > 0 && (
                  <p className={`text-sm sm:text-base font-semibold ${ratingColors[rating]}`}>
                    {ratingLabels[rating]}
                  </p>
                )}
              </div>

              {/* Quick Tags */}
              {rating > 0 && (
                <div className="mb-6">
                  <p className="text-sm font-semibold text-gray-700 mb-3">
                    What stood out? <span className="font-normal text-gray-400">(Optional)</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <button
                        key={tag.id}
                        onClick={() => toggleTag(tag.id)}
                        className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                          selectedTags.includes(tag.id)
                            ? "bg-blue-600 text-white shadow-sm shadow-blue-200"
                            : "bg-gray-50 border border-gray-200 text-gray-700 hover:border-blue-200 hover:bg-blue-50"
                        }`}
                      >
                        {tag.icon} {tag.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Comment Box */}
              {rating > 0 && (
                <div className="mb-6">
                  <p className="text-sm font-semibold text-gray-700 mb-2">
                    Additional comments <span className="font-normal text-gray-400">(Optional)</span>
                  </p>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    rows={3}
                    placeholder="Tell us more about your experience..."
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none transition-all"
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <button
                  disabled={rating === 0 || submitting}
                  onClick={handleSubmit}
                  className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-blue-700 transition-all active:scale-[0.98] shadow-sm shadow-blue-200 disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none disabled:cursor-not-allowed"
                >
                  {submitting ? "Submitting..." : "Submit Feedback"}
                  {!submitting && <ArrowRight className="w-4 h-4" />}
                </button>

                <button
                  onClick={handleSkip}
                  className="w-full py-3 text-sm text-gray-400 font-medium hover:text-gray-600 transition-colors"
                >
                  Skip for now
                </button>
              </div>
            </div>
          </div>

          {/* Footer text */}
          <p className="text-center text-xs text-gray-400 mt-5">
            Your feedback is anonymous and helps us improve our service quality.
          </p>
        </div>
      </main>
    </AuthGuard>
  )
}
