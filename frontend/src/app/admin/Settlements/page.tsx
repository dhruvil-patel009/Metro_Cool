import { Suspense } from "react"
import SettlementsContent from "../components/settlements-content"

export default function SettlementsPage() {
  return (

        <div className="flex-1 overflow-auto bg-gray-50">
      <div className="py-6 px-2 sm:px-8 sm:py-8">
        {/* Breadcrumb */}
        <div className="mb-4 flex items-center gap-2 text-sm text-gray-600">
          <a href="/admin" className="hover:text-gray-900">
            Home
          </a>
          <span>›</span>
          <span className="text-gray-900">Settlement</span>
        </div>
          <Suspense fallback={<div className="loader-wrapper">
  <div className="loader"></div>
</div>}>
            <SettlementsContent />
          </Suspense>

          </div>
          </div>
  )
}
