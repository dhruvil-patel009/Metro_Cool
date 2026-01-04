import { Suspense } from "react"
import SettingsContent from "../components/setting-contents"

export default function SettingsPage() {
  return (
        <main className="flex-1 overflow-y-auto">
          <Suspense fallback={<div className="p-8">Loading...</div>}>
            <SettingsContent />
          </Suspense>
        </main>
  )
}
