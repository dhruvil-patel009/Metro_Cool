"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"
import { useAuthStore } from "@/store/auth.store"

/**
 * SessionGuard — patches the global fetch to intercept 401 responses.
 * Shows a "Session expired" toast and redirects to /auth/login.
 * Mount once in the root layout, inside <Providers>.
 */
export default function SessionGuard() {
  const router  = useRouter()
  const logout  = useAuthStore((s) => s.logout)

  useEffect(() => {
    // Keep reference to original fetch
    const originalFetch = window.fetch

    let toastShown = false // prevent duplicate toasts per page load

    window.fetch = async (...args) => {
      const response = await originalFetch(...args)

      // Clone so consuming code can still read the body
      if (response.status === 401 && !toastShown) {
        // Read body to check if it's a token expiry
        const cloned = response.clone()
        try {
          const json = await cloned.json()
          const msg: string = json?.error || json?.message || ""

          if (
            msg.toLowerCase().includes("expired") ||
            msg.toLowerCase().includes("invalid") ||
            msg.toLowerCase().includes("token") ||
            msg.toLowerCase().includes("unauthorized")
          ) {
            toastShown = true

            // Clear auth
            logout()

            toast.error("⚠️ Session expired — please log in again", {
              toastId: "session-expired",
              autoClose: 4000,
              position: "top-center",
            })

            setTimeout(() => {
              router.push("/auth/login")
            }, 1600)
          }
        } catch {
          // Body was not JSON — ignore, let calling code handle it
        }
      }

      return response
    }

    // Restore original fetch on unmount (hot reload safety)
    return () => {
      window.fetch = originalFetch
    }
  }, [logout, router])

  return null // renders nothing
}
