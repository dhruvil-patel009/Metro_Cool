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

  // Block render until Zustand has restored the token from localStorage.
  // This prevents "Invalid token" flashes and auth guard flickering on refresh.
  if (!hydrated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-3">
        <div className="relative w-10 h-10">
          <div className="absolute inset-0 rounded-full border-4 border-blue-100" />
          <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
        </div>
        <p className="text-sm text-gray-400 font-medium animate-pulse">Loading…</p>
      </div>
    )
  }

  return <>{children}</>
}
