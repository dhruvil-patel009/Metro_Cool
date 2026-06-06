import cron from "node-cron"
import { emailSettlementReport } from "../controllers/settlement.controller.js"

/**
 * Daily settlement email — fires every day at 8:00 PM
 * Sends today's settlements to SETTLEMENT_EMAIL from .env
 *
 * Cron expression: "0 20 * * *"
 *   ┌──────────── minute (0)
 *   │  ┌─────────── hour (20 = 8 PM)
 *   │  │  ┌──────── day of month (*)
 *   │  │  │  ┌───── month (*)
 *   │  │  │  │  ┌── day of week (*)
 *   0  20 *  *  *
 */
cron.schedule("0 20 * * *", async () => {
  const email = process.env.SETTLEMENT_EMAIL

  if (!email) {
    console.warn("[settlement-cron] SETTLEMENT_EMAIL not set — skipping")
    return
  }

  console.log(`[settlement-cron] Sending daily report to ${email}...`)

  try {
    // Reuse the same controller with mock req/res
    await emailSettlementReport(
      { body: { email } } as any,
      {
        json: (data: any) => {
          console.log("[settlement-cron] Done:", data?.message || "sent")
        },
        status: () => ({ json: (e: any) => console.error("[settlement-cron] Error:", e) }),
      } as any
    )
  } catch (err) {
    console.error("[settlement-cron] Failed:", err)
  }
})

console.log("[settlement-cron] Scheduled — daily at 8:00 PM")
