import { Suspense } from "react"
import SettlementsContent from "../components/settlements-content"

export default function SettlementsPage() {
  return (

        <div className="flex-1 overflow-auto bg-gray-50">
      <div className="p-6 lg:p-8">
        {/* Breadcrumb */}
        <div className="mb-4 flex items-center gap-2 text-sm text-gray-600">
          <a href="/admin/dashboard" className="hover:text-gray-900">
            Home
          </a>
          <span>›</span>
          <span className="text-gray-900">Settlement</span>
        </div>
          <Suspense fallback={<div>Loading...</div>}>
            <SettlementsContent />
          </Suspense>

          </div>
          </div>
  )
}
