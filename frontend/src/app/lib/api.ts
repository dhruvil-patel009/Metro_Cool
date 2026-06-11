import { toast } from "react-toastify"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL!

/* ── Get token safely from localStorage ── */
const getToken = (): string | null => {
  if (typeof window === "undefined") return null
  // Fixed: was using && (always null) — now uses || correctly
  return localStorage.getItem("accessToken") || localStorage.getItem("token") || null
}

/* ── Handle session expiry ── */
const handleSessionExpiry = () => {
  // Clear all auth data
  localStorage.removeItem("auth-storage")
  localStorage.removeItem("accessToken")
  localStorage.removeItem("token")

  // Show toast notification
  toast.error("Session expired — please log in again", {
    toastId: "session-expired", // prevent duplicate toasts
    autoClose: 4000,
  })

  // Redirect to login after a short delay so user sees the toast
  setTimeout(() => {
    window.location.href = "/auth/login"
  }, 1500)
}

/**
 * Universal API Fetch — always sends JWT automatically.
 * On 401, shows a "Session expired" toast and redirects to login.
 */
export async function apiFetch<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = getToken()

  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))

    if (res.status === 401) {
      handleSessionExpiry()
      throw new Error("Session expired")
    }

    throw new Error(err.error || err.message || "API Error")
  }

  return res.json() as Promise<T>
}
