import { Suspense } from "react"
import SettlementsContent from "../components/settlements-content"
import { AdminLoadingState } from "../components/admin-page-shell"

export default function SettlementsPage() {
  return (
    <div className="min-h-full bg-gray-50/40">
      <div className="p-5 lg:p-8 max-w-[1600px] mx-auto">
        <Suspense fallback={<AdminLoadingState />}>
          <SettlementsContent />
        </Suspense>
      </div>
    </div>
  )
}
