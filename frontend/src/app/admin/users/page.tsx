import { Suspense } from "react"
import { Header } from "../components/headers"
import UsersContent from "../components/user-content"

export default function UsersPage() {
  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <div className="p-6 lg:p-8">
        {/* Breadcrumb */}
        <div className="mb-4 flex items-center gap-2 text-sm text-gray-600">
          <a href="/admin/dashboard" className="hover:text-gray-900">
            Home
          </a>
          <span>›</span>
          <span className="text-gray-900">Users</span>
        </div>

        <Suspense fallback={<div>Loading...</div>}>
          <UsersContent />
        </Suspense>
      </div>
    </div>
  )
}
