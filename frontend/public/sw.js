/* ============================================================
   Metro Cool — Service Worker
   Handles background push notifications with:
   - Lock-screen display (requireInteraction)
   - Notification sound via Web Audio API (postMessage to page)
   - Action buttons (View Job / Dismiss)
   - Click → opens correct URL
   ============================================================ */

/* ── Install ── */
self.addEventListener("install", (event) => {
  console.log("[SW] Installed")
  self.skipWaiting()
})

self.addEventListener("activate", (event) => {
  console.log("[SW] Activated")
  event.waitUntil(self.clients.claim())
})

/* ── Push: show notification ── */
self.addEventListener("push", (event) => {
  if (!event.data) return

  let data
  try {
    data = event.data.json()
  } catch {
    data = {
      title: "Metro Cool",
      body: event.data.text(),
      url: "/technician/jobs",
    }
  }

  const title = data.title || "Metro Cool"
  const url   = data.url   || "/technician/jobs"

  const options = {
    body:    data.body  || "You have a new update.",
    icon:    "/assets/metro-cool-logo.png",
    badge:   "/assets/icon-light-32x32.png",
    image:   data.image || undefined,

    // ── Lock screen & persistence ──────────────────────────
    requireInteraction: true,   // stays on screen until user acts (Android/desktop)
    renotify:           true,   // always play sound even if same tag
    tag:                data.tag || "metro-cool-job",  // groups same-type notifications
    silent:             false,  // let the OS play default sound

    // ── Vibration pattern (mobile) ──────────────────────────
    vibrate: [300, 150, 300, 150, 300],

    // ── Action buttons ──────────────────────────────────────
    actions: [
      { action: "view",    title: "View Job",  icon: "/assets/icon-light-32x32.png" },
      { action: "dismiss", title: "Dismiss" },
    ],

    // ── Payload passed to notificationclick ─────────────────
    data: { url, bookingRef: data.bookingRef || "" },
  }

  event.waitUntil(
    (async () => {
      // Show the OS notification
      await self.registration.showNotification(title, options)

      // Signal any open page tabs to play the chime via Web Audio API
      // (AudioContext is only available in window context, not in SW)
      try {
        const allClients = await self.clients.matchAll({ type: "window", includeUncontrolled: true })
        for (const client of allClients) {
          client.postMessage({ type: "PLAY_NOTIFICATION_SOUND" })
        }
      } catch (e) {
        // Non-fatal — notification already shown
      }
    })()
  )
})

/* ── Notification click ── */
self.addEventListener("notificationclick", (event) => {
  event.notification.close()

  const url = event.notification.data?.url || "/technician/jobs"

  if (event.action === "dismiss") return

  // "view" action OR clicking the notification body → open/focus the app
  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        // If a window is already open, focus it and navigate
        for (const client of clientList) {
          if ("focus" in client) {
            client.focus()
            client.navigate(url)
            return
          }
        }
        // No open window — open a new one
        return self.clients.openWindow(url)
      })
  )
})

/* ── Notification close (dismissed from tray) ── */
self.addEventListener("notificationclose", (event) => {
  console.log("[SW] Notification dismissed:", event.notification.tag)
})
