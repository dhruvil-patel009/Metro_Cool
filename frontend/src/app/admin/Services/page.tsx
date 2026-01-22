import { Suspense } from "react"
import { ServicesContent } from "../components/services-content"

export default function ServicesPage() {
  return (
    <Suspense fallback={null}>
      <ServicesContent />
    </Suspense>
  )
}
