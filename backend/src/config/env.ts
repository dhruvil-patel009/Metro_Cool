export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as string
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET as string

if (!ACCESS_TOKEN_SECRET) {
  throw new Error("ACCESS_TOKEN_SECRET missing in .env")
}

if (!REFRESH_TOKEN_SECRET) {
  throw new Error("REFRESH_TOKEN_SECRET missing in .env")
}

export const env = {
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID!,
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET!,
  RAZORPAY_WEBHOOK_SECRET: process.env.RAZORPAY_WEBHOOK_SECRET!,
}

// runtime validation
if (!env.RAZORPAY_WEBHOOK_SECRET) {
  throw new Error("RAZORPAY_WEBHOOK_SECRET is missing in .env")
}