export const subscribeToPush = async () => {

  if (!("serviceWorker" in navigator)) return

  // 1️⃣ Ask permission
  const permission = await Notification.requestPermission()
  if (permission !== "granted") {
    console.log("Notification permission denied")
    return
  }

  // 2️⃣ Register service worker
  const registration = await navigator.serviceWorker.register("/sw.js")

  // 🔥 MOST IMPORTANT LINE
  const sw = await navigator.serviceWorker.ready

  // 3️⃣ Check existing subscription (prevents duplicate error)
  let subscription = await sw.pushManager.getSubscription()

  if (!subscription) {
    subscription = await sw.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
      ),
    })
  }

  // 4️⃣ Send to backend
  await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/push/subscribe`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(subscription),
  })

  console.log("Push notification subscribed ✅")
}


// Convert VAPID key
function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/")

  const rawData = atob(base64)
  return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)))
}