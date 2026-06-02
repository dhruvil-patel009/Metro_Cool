import express from "express"
import {
  createRazorpayOrder,
  verifyRazorpayPayment,
  razorpayWebhook,
  markCashPayment,
  getInvoice,
} from "../controllers/payment.controller.js"
import { protect } from "../middlewares/auth.middleware.js"

const router = express.Router()

// create order
router.post("/razorpay-order", protect, createRazorpayOrder)

// only signature verify
router.post("/verify", protect, verifyRazorpayPayment)

// NOTE: /webhook is registered directly in app.ts with raw body parsing
// Do NOT add it here — it must receive a raw Buffer for HMAC verification

router.post("/cash", protect, markCashPayment)
router.get("/invoice/:bookingId", getInvoice)


export default router