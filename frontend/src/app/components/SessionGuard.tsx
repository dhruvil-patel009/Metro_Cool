"use client"

import { useEffect } from "react"
import { useAuthStore } from "@/store/auth.store"
import { handleSessionExpiry, isTokenExpired } from "@/app/lib/api"

/**
 * SessionGuard — two jobs:
 *
 * 1. On mount: check if the stored token is already expired and log out
 *    immediately (no API call needed — pure client-side check).
 *
 * 2. Monkey-patches window.fetch to catch any 401 that slips through
 *    components still using raw fetch directly (admin components, etc.).
 *    Delegates to the central handleSessionExpiry so the toast fires once.
 */
export default function SessionGuard() {
  const logout  = useAuthStore((s) => s.logout)
  const token   = useAuthStore((s) => s.token)
  const hydrated = useAuthStore((s) => s.hydrated)

  /* ── 1. Proactive expired-token check after hydration ── */
  useEffect(() => {
    if (!hydrated) return
    if (token && isTokenExpired(token)) {
      logout()
      handleSessionExpiry()
    }
  }, [hydrated, token, logout])

  /* ── 2. Global fetch interceptor for raw-fetch callers ── */
  useEffect(() => {
    const originalFetch = window.fetch
    let handled = false

    window.fetch = async (...args) => {
      const response = await originalFetch(...args)

      if (response.status === 401 && !handled) {
        const cloned = response.clone()
        try {
          const json = await cloned.json()
          const msg = (json?.error || json?.message || "").toLowerCase()
          if (
            msg.includes("expired") ||
            msg.includes("invalid") ||
            msg.includes("token") ||
            msg.includes("unauthorized")
          ) {
            handled = true
            logout()
            handleSessionExpiry()
          }
        } catch {
          // Body wasn't JSON — pass through
        }
      }

      return response
    }

    return () => {
      window.fetch = originalFetch
    }
  }, [logout])

  return null
}
