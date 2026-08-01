import { Router } from "express"
import { sendPush, sendPushToUser } from "../utils/push.js"
import { supabase } from "../utils/supabase.js"
import { protect } from "../middlewares/auth.middleware.js"

const router = Router()

/**
 * POST /api/push/subscribe
 *
 * Saves the web-push subscription.
 * - If a valid JWT is present (protect middleware succeeds), stores with user_id.
 * - If no token, stores with user_id = null (anonymous subscription).
 * This way the call never fails with 401/400 even when called on public pages.
 */
router.post("/subscribe", async (req: any, res) => {
  try {
    // Try to identify the user from the JWT if present — non-fatal if missing
    let userId: string | null = null
    const authHeader = req.headers.authorization
    if (authHeader?.startsWith("Bearer ")) {
      try {
        const jwt = await import("jsonwebtoken")
        const decoded: any = jwt.default.verify(
          authHeader.slice(7),
          process.env.JWT_SECRET!
        )
        userId = decoded?.id ?? null
      } catch (_) {
        // invalid / expired token — still save the subscription without user_id
      }
    }

    const { endpoint, keys } = req.body
    const p256dh = keys?.p256dh
    const auth   = keys?.auth

    if (!endpoint || !p256dh || !auth) {
      return res.status(400).json({
        error: "Invalid subscription — endpoint, keys.p256dh and keys.auth are required",
      })
    }

    // Build upsert payload — include user_id only when known
    const payload: any = { endpoint, p256dh, auth }
    if (userId) payload.user_id = userId

    const { error } = await supabase
      .from("push_subscriptions")
      .upsert(payload, { onConflict: "endpoint" })

    if (error) {
      console.error("[push] Save subscription error:", error)
      return res.status(500).json({ error: "Failed to save subscription" })
    }

    console.log(`[push] Subscription saved${userId ? ` for user ${userId}` : " (anonymous)"} ✅`)
    res.json({ success: true })
  } catch (err) {
    console.error("[push] subscribe error:", err)
    res.status(500).json({ error: "Server error" })
  }
})

/**
 * POST /api/push/send  (test endpoint)
 * Sends a test push to ALL devices of the authenticated user.
 * This tests the full flow — notification should appear on lock screen,
 * play sound, and show even if the browser/app tab is closed.
 */
router.post("/send", protect, async (req: any, res) => {
  try {
    const userId = req.user?.id
    if (!userId) return res.status(401).json({ error: "Unauthorized" })

    await sendPushToUser(userId, {
      title: "Metro Cool 🔧",
      body:  "Your service update is here!",
      url:   "https://metro-cool.com",
      tag:   "metro-cool-test-" + Date.now(), // unique tag → always plays sound
    })

    res.json({ success: true })
  } catch (err) {
    console.error("[push] send error:", err)
    res.status(500).json({ error: "Server error" })
  }
})

export default router
