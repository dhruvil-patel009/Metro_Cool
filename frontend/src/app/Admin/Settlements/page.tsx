import { Suspense } from "react"
import SettlementsContent from "../components/settlements-content"

export default function SettlementsPage() {
  return (
          <Suspense fallback={<div>Loading...</div>}>
            <SettlementsContent />
          </Suspense>
  )
}
