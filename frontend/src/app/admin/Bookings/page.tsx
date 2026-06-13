import { Suspense } from "react"
import BookingsContent from "../components/booking-content"
import { AdminLoadingState } from "../components/admin-page-shell"

export default function BookingsPage() {
  return (
    <Suspense fallback={<AdminLoadingState />}>
      <BookingsContent />
    </Suspense>
  )
}
