import { Suspense } from "react"
import SettlementsContent from "../components/settlements-content"
import { AdminLoadingState } from "../components/admin-page-shell"

export default function SettlementsPage() {
  return (
    <div className="p-5 lg:p-7 max-w-[1600px] mx-auto">
      <Suspense fallback={<AdminLoadingState />}>
        <SettlementsContent />
      </Suspense>
    </div>
  )
}
