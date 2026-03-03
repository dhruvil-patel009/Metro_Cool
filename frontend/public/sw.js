self.addEventListener("install", (event) => {
  self.skipWaiting()
})

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim())
})

// 🔔 Receive push
self.addEventListener("push", function (event) {

  if (!event.data) return

  let data

  try {
    data = event.data.json()
  } catch (err) {
    // fallback if plain text push
    data = {
      title: "Metro Cool",
      body: event.data.text(),
      url: "/"
    }
  }

  const options = {
    body: data.body,
    icon: "/profile.png",
    badge: "/profile.png",
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