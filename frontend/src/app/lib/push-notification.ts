export const subscribeToPush = async () => {
  if (!("serviceWorker" in navigator)) return

  try {
    /* 1️⃣ Request permission */
    const permission = await Notification.requestPermission()

    if (permission !== "granted") {
      console.log("Notification permission denied")
      return
    }

    /* 2️⃣ Register service worker */
    const registration = await navigator.serviceWorker.register("/sw.js")

    const sw = await navigator.serviceWorker.ready

    /* 3️⃣ Check if already subscribed */
    let subscription = await sw.pushManager.getSubscription()

    if (!subscription) {
      const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
      const convertedKey = urlBase64ToUint8Array(vapidKey)

      subscription = await sw.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedKey,
      })
    }

    /* 4️⃣ Send subscription to backend */
    await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/push/subscribe`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(subscription),
    })

    console.log("Push subscribed successfully 🔔")

  } catch (error) {
    console.error("Push subscription failed:", error)
  }
}

/* 🔧 Convert VAPID key */
function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4)

  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/")

  const rawData = atob(base64)

  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)))
}