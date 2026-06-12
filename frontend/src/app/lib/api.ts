import { toast } from "react-toastify"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL!

/* ── Token getter — reads Zustand persist key as primary source ── */
const getToken = (): string | null => {
  if (typeof window === "undefined") return null
  try {
    // 1. Try the dedicated key set on login (fastest)
    const direct = localStorage.getItem("accessToken")
    if (direct && direct !== "null" && direct !== "undefined") return direct

    // 2. Fall back to Zustand persist blob
    const raw = localStorage.getItem("auth-storage")
    if (raw) {
      const parsed = JSON.parse(raw)
      const t = parsed?.state?.token
      if (t && t !== "null" && t !== "undefined") return t
    }
  } catch (_) {}
  return null
}

/* ── Single flag so we show the expired toast only once ── */
let _sessionExpired = false

export const handleSessionExpiry = () => {
  if (_sessionExpired) return        // already handled — don't fire twice
  _sessionExpired = true

  // Clear every auth key
  localStorage.removeItem("auth-storage")
  localStorage.removeItem("accessToken")
  localStorage.removeItem("token")

  toast.error("Session expired — please log in again", {
    toastId: "session-expired",
    autoClose: 4000,
    position: "top-center",
  })

  // Give the toast time to appear before redirect
  setTimeout(() => {
    _sessionExpired = false          // reset for next login
    window.location.href = "/auth/login"
  }, 1600)
}

/* ── Utility: is a JWT string expired? ── */
export const isTokenExpired = (token: string | null): boolean => {
  if (!token) return true
  try {
    const payload = JSON.parse(atob(token.split(".")[1]))
    // exp is in seconds; Date.now() is in ms
    return payload.exp * 1000 < Date.now()
  } catch (_) {
    return false // can't decode — let the server decide
  }
}

/**
 * apiFetch — universal API wrapper used everywhere.
 *
 * - Injects JWT automatically
 * - Checks token expiry client-side before the request (saves a round-trip)
 * - On 401 server response triggers session expiry flow
 * - Supports FormData (skip Content-Type so browser sets multipart boundary)
 */
export async function apiFetch<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken()

  // Pre-flight expiry check — avoid unnecessary network request
  if (token && isTokenExpired(token)) {
    handleSessionExpiry()
    throw new Error("Session expired")
  }

  const isFormData = options.body instanceof FormData

  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
    credentials: "include",
    headers: {
      // Don't set Content-Type for FormData — browser adds multipart boundary
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  })

  if (!res.ok) {
    let errBody: any = {}
    try { errBody = await res.json() } catch (_) {}

    if (res.status === 401) {
      handleSessionExpiry()
      throw new Error("Session expired")
    }

    throw new Error(errBody.error || errBody.message || `Request failed (${res.status})`)
  }

  // Handle empty responses (204 No Content etc.)
  const text = await res.text()
  if (!text) return undefined as T
  return JSON.parse(text) as T
}
