self.addEventListener("install", (event) => {
  self.skipWaiting()
})

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim())
})

// 🔔 Receive push
self.addEventListener("push", function (event) {

  if (!event.data) return

  const data = event.data.json()

  const options = {
    body: data.body,
    icon: "/icon.png",
    badge: "/icon.png",
    vibrate: [200, 100, 200],
    data: { url: data.url }
  }

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  )
})

// 🔁 Click notification
self.addEventListener("notificationclick", function (event) {
  event.notification.close()
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  )
})