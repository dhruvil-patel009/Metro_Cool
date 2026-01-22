import { Suspense } from "react"
import { BookingsContent } from "../components/booking-content"

export default function BookingsPage() {
  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <Suspense fallback={null}>
        <BookingsContent />
      </Suspense>
    </div>
  )
}
