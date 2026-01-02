import { Suspense } from "react"
import TechniciansContent from "../components/technicians-content"

export default function TechniciansPage() {
  return (
    <Suspense fallback={null}>
      <TechniciansContent />
    </Suspense>
  )
}
