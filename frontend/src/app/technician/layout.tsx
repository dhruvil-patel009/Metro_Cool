import type React from "react"
import { TechnicianHeader } from "./components/technician-header"

export default function TechnicianLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <TechnicianHeader />
      <main className="mx-auto max-w-[1400px] p-6">{children}</main>
    </div>
  )
}
