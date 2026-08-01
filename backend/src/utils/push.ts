import webpush from "web-push"
import { supabase } from "./supabase.js"

webpush.setVapidDetails(
  "mailto:metrocool.official@gmail.com",
  process.env.VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
)

/**
 * sendPush — Send a web-push notification to a single subscription.
 *
 * Key options for RELIABLE delivery (lock screen / background / doze):
 * - TTL (Time-To-Live): How long (seconds) the push service holds the
 *   message if the device is offline. 86400 = 24 hours.
 * - urgency: "high" tells the OS to wake the device immediately,
 *   even in battery-saver / doze mode. Use "high" for job alerts.
 * - topic: Allows the push service to replace an older undelivered
 *   notification with a newer one of the same topic.
 */
export const sendPush = async (subscription: any, payload: any) => {
  try {
    await webpush.sendNotification(
      subscription,
      JSON.stringify(payload),
      {
        TTL:     86400,          // keep message for 24h if device is offline
        urgency: "high",        // wake device from doze / battery saver
        topic:   payload.tag || "metro-cool-notification",
      }
    )
    console.log("Push sent ✅")
  } catch (err: any) {
    // If subscription is expired/invalid (410 Gone or 404), remove it
    if (err?.statusCode === 410 || err?.statusCode === 404) {
      console.warn("Push subscription expired, removing:", subscription.endpoint)
      try {
        await supabase
          .from("push_subscriptions")
          .delete()
          .eq("endpoint", subscription.endpoint)
      } catch (delErr) {
        console.error("Failed to delete expired subscription:", delErr)
      }
    } else {
      console.error("Push error ❌", err)
    }
  }
}

/**
 * sendPushToUser — Send a push notification to ALL devices of a user.
 *
 * This ensures that even if the user logged in on multiple devices
 * (phone, laptop, tablet), all devices receive the notification.
 * Useful for showing on lock screen even when the user isn't
 * actively using any particular device.
 */
export const sendPushToUser = async (userId: string, payload: any) => {
  try {
    const { data: subscriptions, error } = await supabase
      .from("push_subscriptions")
      .select("endpoint, p256dh, auth")
      .eq("user_id", userId)

    if (error || !subscriptions || subscriptions.length === 0) {
      console.warn(`[push] No subscriptions found for user ${userId}`)
      return
    }

    // Send to all registered devices in parallel
    const results = await Promise.allSettled(
      subscriptions.map((sub) =>
        sendPush(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          payload
        )
      )
    )

    const sent = results.filter((r) => r.status === "fulfilled").length
    console.log(`[push] Sent to ${sent}/${subscriptions.length} devices for user ${userId}`)
  } catch (err) {
    console.error("[push] sendPushToUser error:", err)
  }
}