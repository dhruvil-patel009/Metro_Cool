import { Suspense } from "react"
import { CategoriesContent } from "../components/categories-content"

export default function CategoriesPage() {
  return (
    <Suspense fallback={null}>
      <CategoriesContent/>
    </Suspense>
  )
}
