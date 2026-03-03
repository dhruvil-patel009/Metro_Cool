import webpush from "web-push"

webpush.setVapidDetails(
  "mailto:support@metro-cool.com",
  process.env.VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
)

export const sendPush = async (subscription: any, payload: any) => {
  try {
    await webpush.sendNotification(
      subscription,
      JSON.stringify(payload)
    )
    console.log("Push sent ✅")
  } catch (err) {
    console.error("Push error ❌", err)
  }
}