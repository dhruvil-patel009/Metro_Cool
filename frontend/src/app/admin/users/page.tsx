import { Suspense } from "react"
import UsersContent from "../components/user-content"
import { AdminLoadingState } from "../components/admin-page-shell"

export default function UsersPage() {
  return (
    <Suspense fallback={<AdminLoadingState />}>
      <UsersContent />
    </Suspense>
  )
}
