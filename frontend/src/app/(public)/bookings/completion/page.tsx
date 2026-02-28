import { Suspense } from "react"
import CompletionContent from "../../components/completion-contents"

export default function CompletionPage() {
  return (
    <Suspense fallback={null}>
      <CompletionContent />
    </Suspense>
  )
}
