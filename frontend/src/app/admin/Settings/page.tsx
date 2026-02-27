import { Suspense } from "react"
import SettingsContent from "../components/setting-contents"

export default function SettingsPage() {
  return (
        <main className="flex-1 overflow-y-auto">
          <Suspense fallback={<div className="loader-wrapper">
  <div className="loader"></div>
</div>}>
            <SettingsContent />
          </Suspense>
        </main>
  )
}
