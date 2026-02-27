import webpush from "web-push"

webpush.setVapidDetails(
  "mailto:support@acservice.com",
  process.env.VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
)

export const sendPushNotification = async (subscription: any, data: any) => {
  try {
    await webpush.sendNotification(
      subscription,
      JSON.stringify(data)
    )
  } catch (err) {
    console.log("Push Error:", err)
  }
}