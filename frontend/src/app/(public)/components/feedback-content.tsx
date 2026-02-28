"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Star, CheckCircle } from "lucide-react"
import { toast } from "react-toastify"
import AuthGuard from "@/app/components/AuthGuard"

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL!

export default function FeedbackContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  // 🔥 Booking ID from URL
  const bookingId = searchParams.get("id")

  // 🔥 Booking State
  const [booking, setBooking] = useState<any>(null)

  // Feedback state
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
      .then(res => res.json())
      .then(data => setBooking(data.booking))
  }, [bookingId])

  /* ---------------- LOADING ---------------- */
  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading feedback...
      </div>
    )
  }

  /* ---------------- MAP DB → UI ---------------- */
  const serviceTitle = booking.service?.title || "Service"
  const serviceimg =
    booking.service?.image_url || "/assets/technician-working-on-ac-unit.jpg"

  const bookingDate = new Date(booking.booking_date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })

  const orderId = `#${booking.id.slice(0, 6).toUpperCase()}`

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
    "Excellent Service!",
    "Outstanding!",
  ]

  const toggleTag = (tagId: string) => {
    setSelectedTags(prev =>
      prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId]
    )
  }

  /* ---------------- 🔥 SUBMIT FEEDBACK ---------------- */
  const handleSubmit = async () => {
    if (!rating) return

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

      if (!res.ok) {
        throw new Error("Failed to submit feedback")
      }

      toast("Thank you for your feedback! 🎉improve Your feedback helps usour service.")


      setTimeout(() => {
        router.push(`/bookings/completion?id=${bookingId}`)
      }, 1000)
    } catch (err) {
      toast("❌ Something went wrong Please try again later.")

    } finally {
      setSubmitting(false)
    }
  }

  const handleSkip = () => {
    router.push(`/bookings/completion?id=${bookingId}`)
  }

  /* ======================= UI (UNCHANGED) ======================= */

  return (
    <AuthGuard>
      <main className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-blue-500 to-blue-600"></div>

            <div className="p-8 sm:p-10">
              {/* Header */}
              <div className="flex items-start gap-4 mb-10 pb-8 border-b border-gray-100">
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-blue-600 overflow-hidden">
                    <img
                      src={serviceimg}
                      alt="Service"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                    <CheckCircle className="w-3.5 h-3.5 text-white" />
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-xl font-bold">{serviceTitle}</h2>
                    <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">
                      COMPLETED
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    Service provided by <span className="font-semibold">John Doe</span>
                  </p>
                  <div className="flex gap-4 text-xs text-gray-500">
                    <div>{bookingDate}</div>
                    <div>Order {orderId}</div>
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div className="mb-10 text-center">
                <h1 className="text-3xl font-bold mb-2">How was your experience?</h1>
                <p className="text-gray-600 mb-8">
                  Your feedback helps us maintain high quality service.
                </p>

                <div className="flex justify-center gap-2 mb-4">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                    >
                      <Star
                        className={`w-12 h-12 ${star <= (hoveredRating || rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "fill-gray-200 text-gray-200"
                          }`}
                      />
                    </button>
                  ))}
                </div>

                {rating > 0 && (
                  <p className="text-blue-600 font-semibold text-lg">
                    {ratingLabels[rating]}
                  </p>
                )}
              </div>

              {/* Tags */}
              <div className="mb-8 flex flex-wrap gap-3">
                {tags.map(tag => (
                  <button
                    key={tag.id}
                    onClick={() => toggleTag(tag.id)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium ${selectedTags.includes(tag.id)
                        ? "bg-blue-600 text-white"
                        : "border border-gray-200"
                      }`}
                  >
                    {tag.icon} {tag.label}
                  </button>
                ))}
              </div>

              {/* Comment */}
              <textarea
                value={feedback}
                onChange={e => setFeedback(e.target.value)}
                rows={4}
                placeholder="Share your experience..."
                className="w-full border rounded-xl p-4 mb-6"
              />

              {/* Actions */}
              <button
                disabled={rating === 0 || submitting}
                onClick={handleSubmit}
                className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold disabled:bg-gray-300"
              >
                Submit Feedback
              </button>

              <button
                onClick={handleSkip}
                className="w-full mt-4 text-gray-500"
              >
                Skip this step
              </button>
            </div>
          </div>
        </div>
      </main>
    </AuthGuard>
  )
}
