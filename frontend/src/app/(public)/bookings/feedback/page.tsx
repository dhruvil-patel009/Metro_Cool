import { Suspense } from "react"
import FeedbackContent from "../../components/feedback-content"

export default function FeedbackPage() {
  return (
    <Suspense fallback={null}>
      <FeedbackContent />
    </Suspense>
  )
}
