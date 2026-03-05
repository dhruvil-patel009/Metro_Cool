self.addEventListener("install", (event) => {
  console.log("SW Installed")
  self.skipWaiting()
})

self.addEventListener("activate", (event) => {
  console.log("SW Activated")
  event.waitUntil(self.clients.claim())
})

/* 🔔 Receive Push */
self.addEventListener("push", (event) => {
  console.log("Push received")

  if (!event.data) return

  let data

  try {
    data = event.data.json()
  } catch {
    data = {
      title: "Metro Cool",
      body: event.data.text(),
      url: "/",
    }
  }

  const options = {
    body: data.body,
    icon: "/profile.png",
    badge: "/profile.png",
    vibrate: [200, 100, 200],
    data: {
      url: data.url,
    },
  }

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  )
})

/* 🔁 Click Notification */
self.addEventListener("notificationclick", (event) => {
  event.notification.close()

  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  )
})