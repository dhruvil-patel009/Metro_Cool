"use client"

import { useEffect, useState } from "react"
import { useAuthStore } from "@/store/auth.store"

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const hydrated = useAuthStore((s) => s.hydrated)
  const hydrate = useAuthStore((s) => s.hydrate)

  // Run hydration once on mount
  useEffect(() => {
    hydrate()
  }, [hydrate])

  // Block render until Zustand has restored the token from localStorage
  // This prevents "Invalid token" flashes on page refresh
  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return <>{children}</>
}
