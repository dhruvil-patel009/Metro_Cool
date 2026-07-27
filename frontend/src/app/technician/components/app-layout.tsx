"use client"

import type React from "react"
import { Sidebar } from "./sidebar"
import { Header } from "./header"
import { useSidebar } from "./sidebar-content"
import { usePushSubscription } from "@/hooks/usePushSubscription"

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar()

  // Registers SW + subscribes to push on login (technician auto-opt-in)
  usePushSubscription()

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
        <Header />
        <main className="p-7 space-y-10 max-w-7xl mx-auto w-full overflow-x-hidden">{children}</main>
      </div>
    </div>
  )
}
