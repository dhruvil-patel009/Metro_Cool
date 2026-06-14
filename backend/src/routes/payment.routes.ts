import express from "express"
import {
  createRazorpayOrder,
  verifyRazorpayPayment,
  razorpayWebhook,
  markCashPayment,
  getInvoice,
  getOrderInvoice,
  createProductRazorpayOrder,
  verifyProductPayment,
} from "../controllers/payment.controller.js"
import { protect } from "../middlewares/auth.middleware.js"

const router = express.Router()

// service booking payments
router.post("/razorpay-order", protect, createRazorpayOrder)
router.post("/verify", protect, verifyRazorpayPayment)

// product order payments
router.post("/product-razorpay-order", protect, createProductRazorpayOrder)
router.post("/product-verify", protect, verifyProductPayment)

// NOTE: /webhook is registered directly in app.ts with raw body parsing
// Do NOT add it here — it must receive a raw Buffer for HMAC verification

router.post("/cash", protect, markCashPayment)
router.get("/invoice/:bookingId", protect, getInvoice)
router.get("/order-invoice/:orderId", protect, getOrderInvoice)


export default router