"use client"

import { useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { ArrowLeft, Star, CheckCircle } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export default function FeedbackContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const bookingId = searchParams.get("id") || "MC-8293"
  const orderId = `#12345`

  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [feedback, setFeedback] = useState("")

  const tags = [
    { id: "professional", label: "Professional", icon: "👔" },
    { id: "on-time", label: "On-Time", icon: "⏰" },
    { id: "clean-work", label: "Clean Work", icon: "✨" },
    { id: "friendly", label: "Friendly", icon: "😊" },
    { id: "knowledgeable", label: "Knowledgeable", icon: "🎓" },
    { id: "good-value", label: "Good Value", icon: "💰" },
  ]

  const ratingLabels = ["", "Poor Service", "Below Average", "Good Service", "Excellent Service!", "Outstanding!"]

  const toggleTag = (tagId: string) => {
    setSelectedTags((prev) => (prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]))
  }

  const handleSubmit = () => {
    toast.success("Thank You For Feedback!", {
      description: "Your feedback helps us improve our service.",
      duration: 2000,
    })
    setTimeout(() => {
      router.push(`/User/bookings/completion?id=${bookingId}`)
    }, 1000)
  }

  const handleSkip = () => {
    router.push(`/User/bookings/completion?id=${bookingId}`)
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        {/* <Link
          href={`/bookings?id=${bookingId}`}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Bookings</span>
        </Link> */}

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden animate-fade-in">
          {/* Blue Top Bar */}
          <div className="h-2 bg-gradient-to-r from-blue-500 to-blue-600"></div>

          <div className="p-8 sm:p-10">
            {/* Service Header */}
            <div className="flex items-start gap-4 mb-10 pb-8 border-b border-gray-100">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center overflow-hidden">
                  <img
                    src="/assets/technician-working-on-ac-unit.jpg"
                    alt="Technician"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                  <CheckCircle className="w-3.5 h-3.5 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-xl font-bold text-gray-900">AC Maintenance Service</h2>
                  <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">COMPLETED</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  Service provided by <span className="font-semibold text-gray-900">John Doe</span>
                </p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    Oct 12, 2023
                  </div>
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    Order {orderId}
                  </div>
                </div>
              </div>
            </div>

            {/* Rating Section */}
            <div className="mb-10 text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">How was your experience?</h1>
              <p className="text-gray-600 mb-8">Your feedback helps us maintain high quality service.</p>

              {/* Star Rating */}
              <div className="flex justify-center gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="transition-all duration-200 hover:scale-110 focus:outline-none"
                  >
                    <Star
                      className={`w-12 h-12 transition-all ${
                        star <= (hoveredRating || rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "fill-gray-200 text-gray-200"
                      }`}
                    />
                  </button>
                ))}
              </div>

              {/* Rating Label */}
              {rating > 0 && (
                <p className="text-blue-600 font-semibold text-lg animate-fade-in">{ratingLabels[rating]}</p>
              )}
            </div>

            {/* Tags Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">What stood out?</h3>
                <span className="text-sm text-gray-500">Select all that apply</span>
              </div>

              <div className="flex flex-wrap gap-3">
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => toggleTag(tag.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
                      selectedTags.includes(tag.id)
                        ? "bg-blue-600 text-white border-2 border-blue-600"
                        : "bg-white text-gray-700 border-2 border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    <span className="text-lg">{tag.icon}</span>
                    {tag.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Feedback Text */}
            <div className="mb-8">
              <label htmlFor="feedback" className="block text-lg font-bold text-gray-900 mb-2">
                Anything else to add? <span className="text-gray-500 font-normal text-sm">(Optional)</span>
              </label>
              <textarea
                id="feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={5}
                placeholder="Share more details about what made your experience great..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 resize-none text-gray-900 placeholder-gray-400 transition-colors"
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={rating === 0}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${
                rating === 0
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700 active:scale-98"
              }`}
            >
              Submit Feedback
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>

            {/* Skip Button */}
            <button
              onClick={handleSkip}
              className="w-full mt-4 py-3 text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              Skip this step
            </button>

            {/* Footer */}
            <p className="text-center text-xs text-gray-500 mt-8">
              Protected by reCAPTCHA and subject to the Metro Cool Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
