import { Router } from "express"
import { sendPush } from "../utils/push.js"
import { supabase } from "../utils/supabase.js"
import { protect } from "../middlewares/auth.middleware.js"

const router = Router()

/**
 * POST /api/push/subscribe
 *
 * Saves the web-push subscription for the authenticated user.
 * The browser sends: { endpoint, keys: { p256dh, auth } }
 * We store endpoint, p256dh, auth as separate columns and upsert
 * on endpoint (unique) so re-subscribing is safe.
 */
router.post("/subscribe", protect, async (req: any, res) => {
  try {
    const userId = req.user?.id
    if (!userId) return res.status(401).json({ error: "Unauthorized" })

    const { endpoint, keys } = req.body
    const p256dh = keys?.p256dh
    const auth   = keys?.auth

    if (!endpoint || !p256dh || !auth) {
      return res.status(400).json({ error: "Invalid subscription — endpoint, keys.p256dh and keys.auth are required" })
    }

    const { error } = await supabase
      .from("push_subscriptions")
      .upsert(
        { user_id: userId, endpoint, p256dh, auth },
        { onConflict: "endpoint" }   // unique on endpoint
      )

    if (error) {
      console.error("[push] Save subscription error:", error)
      return res.status(500).json({ error: "Failed to save subscription" })
    }

    console.log(`[push] Subscription saved for user ${userId} ✅`)
    res.json({ success: true })
  } catch (err) {
    console.error("[push] subscribe error:", err)
    res.status(500).json({ error: "Server error" })
  }
})

/**
 * POST /api/push/send  (test endpoint)
 * Sends a test push to the authenticated user's most recent subscription.
 */
router.post("/send", protect, async (req: any, res) => {
  try {
    const userId = req.user?.id
    if (!userId) return res.status(401).json({ error: "Unauthorized" })

    const { data, error } = await supabase
      .from("push_subscriptions")
      .select("endpoint, p256dh, auth")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle()

    if (error || !data) {
      return res.status(400).json({ message: "No subscription found for this user" })
    }

    // Reconstruct the web-push subscription object from columns
    const subscription = {
      endpoint: data.endpoint,
      keys: { p256dh: data.p256dh, auth: data.auth },
    }

    await sendPush(subscription, {
      title: "Metro Cool 🔧",
      body: "Your service update is here!",
      url: "https://metro-cool.com",
    })

    res.json({ success: true })
  } catch (err) {
    console.error("[push] send error:", err)
    res.status(500).json({ error: "Server error" })
  }
})

export default router
