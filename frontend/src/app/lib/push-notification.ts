export const subscribeToPush = async () => {

  if (!("serviceWorker" in navigator)) return

  const permission = await Notification.requestPermission()
  if (permission !== "granted") return

  const registration = await navigator.serviceWorker.register("/sw.js")
  const sw = await navigator.serviceWorker.ready

  const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
  const convertedKey = urlBase64ToUint8Array(vapidKey)

  const subscription = await sw.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: convertedKey,
  })

  await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/push/subscribe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(subscription),
  })

  console.log("Subscribed successfully 🔔")
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/")

  const rawData = atob(base64)
  return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)))
}