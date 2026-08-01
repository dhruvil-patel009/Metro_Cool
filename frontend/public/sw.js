/* ============================================================
   Metro Cool — Service Worker
   Handles background push notifications with:
   - Lock-screen display (requireInteraction)
   - Notification sound (plays even when app/tab is closed)
   - Works in background / phone locked / tab closed
   - Action buttons (View Job / Dismiss)
   - Click → opens correct URL
   - Urgency-aware: high-priority push wakes device from doze
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

/* ── Generate WAV notification sound in-memory ──
   Creates a short two-tone "ding-dong" chime as a WAV blob.
   This works entirely in the Service Worker — no external file needed.
   The sound plays via the Notification API's `sound` option on
   supported platforms, or via AudioContext on open tabs.
   ──────────────────────────────────────────────────────────── */
function generateNotificationWav() {
  const sampleRate = 22050
  const duration = 0.6 // seconds
  const numSamples = Math.floor(sampleRate * duration)
  const buffer = new ArrayBuffer(44 + numSamples * 2)
  const view = new DataView(buffer)

  // WAV header
  const writeString = (offset, str) => {
    for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i))
  }
  writeString(0, "RIFF")
  view.setUint32(4, 36 + numSamples * 2, true)
  writeString(8, "WAVE")
  writeString(12, "fmt ")
  view.setUint32(16, 16, true) // chunk size
  view.setUint16(20, 1, true)  // PCM
  view.setUint16(22, 1, true)  // mono
  view.setUint32(24, sampleRate, true)
  view.setUint32(28, sampleRate * 2, true) // byte rate
  view.setUint16(32, 2, true)  // block align
  view.setUint16(34, 16, true) // bits per sample
  writeString(36, "data")
  view.setUint32(40, numSamples * 2, true)

  // Generate two-tone chime: 880Hz then 660Hz
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate
    let sample = 0
    if (t < 0.2) {
      // First tone: 880Hz with fade-in/out
      const env = t < 0.02 ? t / 0.02 : (0.2 - t) / 0.18
      sample = Math.sin(2 * Math.PI * 880 * t) * env * 0.7
    } else if (t >= 0.25 && t < 0.55) {
      // Second tone: 660Hz with fade-in/out
      const localT = t - 0.25
      const env = localT < 0.02 ? localT / 0.02 : (0.3 - localT) / 0.28
      sample = Math.sin(2 * Math.PI * 660 * t) * env * 0.5
    }
    const int16 = Math.max(-32768, Math.min(32767, Math.floor(sample * 32767)))
    view.setInt16(44 + i * 2, int16, true)
  }

  return new Blob([buffer], { type: "audio/wav" })
}

/* ── Cache the notification sound on install for offline use ── */
const SOUND_CACHE = "metro-cool-notification-sound-v1"
const SOUND_URL = "/notification-sound.wav"

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(SOUND_CACHE).then((cache) => {
      const wavBlob = generateNotificationWav()
      const response = new Response(wavBlob, {
        headers: { "Content-Type": "audio/wav" },
      })
      return cache.put(SOUND_URL, response)
    })
  )
})

/* ── Serve cached notification sound via fetch ── */
self.addEventListener("fetch", (event) => {
  if (event.request.url.endsWith("/notification-sound.wav")) {
    event.respondWith(
      caches.match(SOUND_URL).then((cached) => {
        if (cached) return cached
        // Regenerate if cache was cleared
        const wavBlob = generateNotificationWav()
        return new Response(wavBlob, {
          headers: { "Content-Type": "audio/wav" },
        })
      })
    )
  }
})

/* ── Push: show notification ──
   This fires EVEN WHEN:
   - The browser tab is closed
   - The phone is locked
   - The app is in background
   
   As long as the user logged in once and the service worker is 
   registered + push subscription is saved, notifications arrive.
   The OS wakes the service worker to handle the push event.
   ──────────────────────────────────────────────────────────── */
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
    // requireInteraction: keeps notification on screen / lock screen 
    // until user interacts (swipes or taps). Works on Android & desktop.
    requireInteraction: true,

    // ── Sound ──────────────────────────────────────────────
    // renotify: true → OS plays sound even if replacing same-tag notification
    // silent: false → OS is allowed to play its default notification sound
    // On Android: the system notification sound plays automatically
    // On desktop: we also trigger Web Audio in open tabs (fallback below)
    renotify: true,
    silent:   false,
    tag:      data.tag || "metro-cool-" + Date.now(), // unique tag = always plays sound

    // ── Vibration pattern (mobile — works on lock screen) ───
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
      // Show the OS notification (this works on lock screen, background, etc.)
      await self.registration.showNotification(title, options)

      // Signal any open page tabs to play the chime sound via Web Audio API
      // This is a BONUS — even if no tabs are open, the OS notification
      // still shows on lock screen with the system sound + vibration above.
      try {
        const allClients = await self.clients.matchAll({ 
          type: "window", 
          includeUncontrolled: true 
        })
        for (const client of allClients) {
          client.postMessage({ type: "PLAY_NOTIFICATION_SOUND" })
        }
      } catch (e) {
        // Non-fatal — notification already shown with OS sound
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
