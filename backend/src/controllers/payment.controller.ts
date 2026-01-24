import Razorpay from "razorpay"
import { Request, Response } from "express"
import crypto from "crypto"


const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export const createRazorpayOrder = async (req: Request, res: Response) => {
  const { booking_id, amount } = req.body

  try {
    const order = await razorpay.orders.create({
      amount: amount * 100, // INR → paise
      currency: "INR",
      receipt: booking_id,
    })

    res.json({
      orderId: order.id,
      key: process.env.RAZORPAY_KEY_ID,
    })
  } catch (err) {
    res.status(500).json({ error: "Failed to create order" })
  }
}



export const verifyRazorpayPayment = async (req: Request, res: Response) => {
  const {
    booking_id,
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature,
  } = req.body

  const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex")

  if (generatedSignature !== razorpay_signature) {
    return res.status(400).json({ error: "Invalid payment signature" })
  }

  // ✅ PAYMENT IS VERIFIED
  // Update DB here
  // bookings.payment_status = 'paid'
  // generate closure OTP

  const closureOTP = Math.floor(1000 + Math.random() * 9000).toString()

  res.json({
    success: true,
    closure_otp: closureOTP,
  })
}

