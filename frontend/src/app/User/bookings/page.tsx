"use client"

import { Suspense } from "react"
import BookingsContent from "../components/booking-contents"

export default function BookingsPage() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Suspense fallback={<BookingsLoading />}>
        <BookingsContent />
      </Suspense>
    </div>
  )
}

function BookingsLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-96 bg-gray-200 rounded-2xl"></div>
          </div>
          <div className="space-y-6">
            <div className="h-32 bg-gray-200 rounded-2xl"></div>
            <div className="h-64 bg-gray-200 rounded-2xl"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
