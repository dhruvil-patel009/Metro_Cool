/* ── Token helper ── */
const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null
  try {
    const direct = localStorage.getItem("accessToken")
    if (direct && direct !== "null" && direct !== "undefined") return direct

    const raw = localStorage.getItem("auth-storage")
    if (raw) {
      const t = JSON.parse(raw)?.state?.token
      if (t && t !== "null" && t !== "undefined") return t
    }
  } catch (_) {}
  return null
}

/**
 * subscribeToPush
 *
 * Registers the service worker, requests notification permission,
 * subscribes the browser to web-push, and saves the subscription
 * to the backend.
 *
 * - Works whether or not the user is logged in.
 * - If a JWT token is present it's sent along so the subscription
 *   is associated with that user_id on the backend.
 * - If called again after login, upserts on the existing endpoint
 *   so the user_id column gets filled in.
 * - Safe to call multiple times — no duplicate browser subscriptions.
 */
export const subscribeToPush = async () => {
  if (typeof window === "undefined") return
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) return

  try {
    /* 1️⃣ Request notification permission */
    const permission = await Notification.requestPermission()
    if (permission !== "granted") {
      console.log("[push] Notification permission denied")
      return
    }

    /* 2️⃣ Register (or reuse) service worker */
    const registration = await navigator.serviceWorker.register("/sw.js")
    const sw = await navigator.serviceWorker.ready

    /* 3️⃣ Get existing subscription or create a new one */
    let subscription = await sw.pushManager.getSubscription()

    if (!subscription) {
      const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
      if (!vapidKey) {
        console.warn("[push] NEXT_PUBLIC_VAPID_PUBLIC_KEY not set — skipping subscribe")
        return
      }
      subscription = await sw.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey),
      })
    }

    /* 4️⃣ POST subscription to backend
       Always include the JWT when available so the backend can link
       the subscription to the logged-in user. The route accepts
       requests without a token too (stores as anonymous). */
    const token = getAuthToken()

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    }
    if (token) headers["Authorization"] = `Bearer ${token}`

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/push/subscribe`,
      {
        method: "POST",
        headers,
        credentials: "include",
        body: JSON.stringify(subscription),
      }
    )

    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      console.warn("[push] Backend save failed:", res.status, body)
      return
    }

    console.log("[push] Subscribed successfully 🔔", token ? "(authenticated)" : "(anonymous)")
  } catch (err) {
    console.error("[push] Subscription error:", err)
  }
}

/* ── Convert VAPID base64url key to Uint8Array ── */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")
  const rawData = atob(base64)
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)))
}
