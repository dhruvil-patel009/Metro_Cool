export async function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return

  try {
    const reg = await navigator.serviceWorker.register("/sw.js")

    console.log("Service Worker Registered:", reg)
  } catch (err) {
    console.error("SW registration failed:", err)
  }
}