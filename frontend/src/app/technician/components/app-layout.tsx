"use client"

import type React from "react"
import { Sidebar } from "./sidebar"
import { Header } from "./header"
import { useSidebar } from "./sidebar-content"



export function AppLayout({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar()

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
        <Header />
        <main className="p-8 space-y-10 max-w-7xl mx-auto w-full overflow-x-hidden">{children}</main>
      </div>
    </div>
  )
}
