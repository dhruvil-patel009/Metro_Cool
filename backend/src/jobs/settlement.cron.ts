import cron from "node-cron"
import { emailSettlementReport } from "../controllers/settlement.controller.js"

cron.schedule("0 20 * * *", async () => {
  console.log("8PM settlement email sending...")
  await emailSettlementReport(
    { body: { email: "metrocool@yopmail.com" } } as any,
    { json: () => {} } as any
  )
})