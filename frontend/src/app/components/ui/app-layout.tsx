"use client"

import * as React from "react"

import { cn } from "@/app/lib/utils"

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex min-h-screen bg-muted/40">
      {/* Sidebar */}

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}

        {/* Page Content */}
        <main
          className={cn(
            "flex-1 overflow-y-auto",
            "bg-background"
          )}
        >
          {children}
        </main>
      </div>
    </div>
  )
}
