import cron from "node-cron"
import { emailSettlementReport } from "../controllers/settlement.controller.js"
import { env } from "../config/env.js"

const CRON_TIME = env.SETTLEMENT_CRON_TIME
const CRON_TZ = env.SETTLEMENT_CRON_TIMEZONE

/**
 * Daily settlement email — configurable via .env
 *
 * .env keys:
 *   SETTLEMENT_CRON_TIME     — cron expression (default "0 20 * * *" = 8:00 PM)
 *   SETTLEMENT_CRON_TIMEZONE — IANA timezone  (default "Asia/Kolkata")
 *   SETTLEMENT_EMAIL         — recipient email address
 */
cron.schedule(
  CRON_TIME,
  async () => {
    const email = env.SETTLEMENT_EMAIL

    if (!email) {
      console.warn("[settlement-cron] SETTLEMENT_EMAIL not set — skipping")
      return
    }

    console.log(`[settlement-cron] Sending daily report to ${email}...`)

    try {
      const mockReq = { body: { email } } as any

      let responseData: any = null

      const mockRes = {
        statusCode: 200,
        json: (data: any) => {
          responseData = data
          console.log("[settlement-cron] Done:", data?.message || "sent")
          return mockRes
        },
        status: (code: number) => {
          mockRes.statusCode = code
          return mockRes
        },
        setHeader: () => mockRes,
        end: () => mockRes,
      } as any

      await emailSettlementReport(mockReq, mockRes)

      if (mockRes.statusCode >= 400) {
        console.error("[settlement-cron] Controller returned error:", responseData)
      }
    } catch (err) {
      console.error("[settlement-cron] Failed:", err)
    }
  },
  {
    timezone: CRON_TZ,
  }
)

console.log(`[settlement-cron] Scheduled — "${CRON_TIME}" (${CRON_TZ})`)
