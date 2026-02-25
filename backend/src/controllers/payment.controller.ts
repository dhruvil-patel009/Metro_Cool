import Razorpay from "razorpay"
import { Request, Response } from "express"
import crypto from "crypto"
import { supabase } from "../utils/supabase.js"
import { uploadInvoice } from "../utils/uploadInvoice.js"
import { generateInvoice } from "../utils/generateInvoice.js"


const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export const createRazorpayOrder = async (req: Request, res: Response) => {
  const { booking_id, amount } = req.body

  try {
    const order = await razorpay.orders.create({
      amount: Math.round(Number(amount) * 100),
      currency: "INR",
      receipt: booking_id,
      notes: {
        booking_id: booking_id,
      },
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
  try {
    const {
      booking_id,
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
    } = req.body

    // verify signature only
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex")

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        error: "Payment verification failed",
      })
    }

    // DO NOT INSERT PAYMENT HERE ❌
    // webhook will handle it

    return res.json({
      success: true,
      message: "Payment verified. Awaiting confirmation...",
    })

  } catch (error) {
    return res.status(500).json({ error: "Verification failed" })
  }
}

export const razorpayWebhook = async (req: any, res: Response) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET!

    const shasum = crypto.createHmac("sha256", secret)
    shasum.update(req.body)
    const digest = shasum.digest("hex")

    if (digest !== req.headers["x-razorpay-signature"]) {
      return res.status(400).send("Invalid webhook signature")
    }

    const event = JSON.parse(req.body.toString())

    if (event.event !== "payment.captured") {
      return res.json({ status: "ignored" })
    }

    const payment = event.payload.payment.entity

    const booking_id = payment.notes?.booking_id || payment.order_id

    /* ---------------- FIND BOOKING ---------------- */
    const { data: booking } = await supabase
      .from("bookings")
      .select("*")
      .eq("booking_id", booking_id)
      .single()

    if (!booking) return res.json({ status: "booking not found" })

    /* ---------------- GENERATE OTP ---------------- */
    const closureOTP = Math.floor(1000 + Math.random() * 9000).toString()

    /* ---------------- INSERT PAYMENT ---------------- */
    const { data: insertedPayment } = await supabase
      .from("payments")
      .insert({
        booking_id,
        user_id: booking.user_id,

        razorpay_order_id: payment.order_id,
        razorpay_payment_id: payment.id,

        amount: Number(payment.amount) / 100,
        currency: payment.currency,
        payment_method: payment.method,

        status: "captured",
        closure_otp: closureOTP,
        raw_payload: payment,
      })
      .select()
      .single()

    /* ---------------- UPDATE BOOKING ---------------- */
    await supabase
      .from("bookings")
      .update({
        payment_status: "paid",
        closure_otp: closureOTP,
      })
      .eq("booking_id", booking_id)

    /* ---------------- GENERATE INVOICE ---------------- */
    const invoicePath = await generateInvoice({
      booking_id,
      payment_id: payment.id,
      amount: Number(payment.amount) / 100,
      customer_name: booking.customer_name,
      service_name: booking.service_name,
      otp: closureOTP,
    })

    const invoiceUrl = await uploadInvoice(invoicePath, booking_id)

    await supabase
      .from("payments")
      .update({ invoice_url: invoiceUrl })
      .eq("id", insertedPayment.id)

    res.json({ status: "ok" })

  } catch (err) {
    console.log("WEBHOOK ERROR", err)
    res.status(500).send("Webhook error")
  }
}