import dotenv from "dotenv"

dotenv.config()

// Fail fast at startup if any critical env var is missing
const REQUIRED = [
  "JWT_SECRET",
  "RAZORPAY_KEY_ID",
  "RAZORPAY_KEY_SECRET",
  "RAZORPAY_WEBHOOK_SECRET",
]

const missing = REQUIRED.filter(k => !process.env[k])
if (missing.length > 0) {
  throw new Error(`Missing required environment variables: ${missing.join(", ")}`)
}

export const env = {
  JWT_SECRET: process.env.JWT_SECRET!,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET!,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET!,
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID!,
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET!,
  RAZORPAY_WEBHOOK_SECRET: process.env.RAZORPAY_WEBHOOK_SECRET!,
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:3000",
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || "metrocool.official@gmail.com",
  SETTLEMENT_EMAIL: process.env.SETTLEMENT_EMAIL || "",
  /** Cron expression for settlement email (default: 8:00 PM daily = "0 20 * * *") */
  SETTLEMENT_CRON_TIME: process.env.SETTLEMENT_CRON_TIME || "0 20 * * *",
  /** IANA timezone for settlement cron (default: Asia/Kolkata) */
  SETTLEMENT_CRON_TIMEZONE: process.env.SETTLEMENT_CRON_TIMEZONE || "Asia/Kolkata",
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: Number(process.env.PORT) || 5000,
}
