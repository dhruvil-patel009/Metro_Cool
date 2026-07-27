import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { transporter } from "./mailer.js"
import { env } from "../config/env.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const templatesDir = path.resolve(__dirname, "../../templates")

/* ── Startup: verify email config ── */
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
console.log("[admin-notify] 📧 Email notification module loaded")
console.log("[admin-notify] MAIL_USER:", process.env.MAIL_USER || "❌ NOT SET")
console.log("[admin-notify] MAIL_PASS:", process.env.MAIL_PASS ? "✅ SET (hidden)" : "❌ NOT SET")
console.log("[admin-notify] ADMIN_EMAIL:", env.ADMIN_EMAIL)
console.log("[admin-notify] Templates dir:", templatesDir)
console.log("[admin-notify] booking-notification.html exists:", fs.existsSync(path.join(templatesDir, "booking-notification.html")))
console.log("[admin-notify] booking-confirmation-customer.html exists:", fs.existsSync(path.join(templatesDir, "booking-confirmation-customer.html")))
console.log("[admin-notify] payment-completed.html exists:", fs.existsSync(path.join(templatesDir, "payment-completed.html")))
console.log("[admin-notify] order-notification.html exists:", fs.existsSync(path.join(templatesDir, "order-notification.html")))
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")

/* ── Helper: load and populate template ── */
function loadTemplate(fileName: string, replacements: Record<string, string>): string {
  const filePath = path.join(templatesDir, fileName)
  console.log("[admin-notify] Loading template:", filePath)

  if (!fs.existsSync(filePath)) {
    throw new Error(`Template file not found: ${filePath}`)
  }

  let html = fs.readFileSync(filePath, "utf-8")

  for (const [key, value] of Object.entries(replacements)) {
    html = html.replaceAll(`{{${key}}}`, value)
  }

  return html
}

/* ── Format date nicely ── */
function formatDate(dateStr?: string): string {
  if (!dateStr) return new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })
  const d = new Date(dateStr)
  return d.toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })
}

/* ── Format currency ── */
function formatCurrency(amount: number): string {
  return `\u20B9${amount.toLocaleString("en-IN")}`
}

/* =========================================================
   EMAIL 1: BOOKING NOTIFICATION
   → Sent when customer confirms a booking (before payment)
========================================================= */
export interface BookingNotificationData {
  bookingId: string
  customerName: string
  customerPhone: string
  customerEmail?: string
  customerAddress: string
  serviceName: string
  bookingDate: string
  timeSlot: string
  totalAmount: number
}

export async function sendBookingNotification(data: BookingNotificationData): Promise<void> {
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
  console.log("[admin-notify] 🔔 sendBookingNotification CALLED")
  console.log("[admin-notify] Booking ID:", data.bookingId)
  console.log("[admin-notify] Customer:", data.customerName)
  console.log("[admin-notify] Service:", data.serviceName)
  console.log("[admin-notify] Sending to:", env.ADMIN_EMAIL)
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")

  const templateReplacements = {
    bookingId: data.bookingId,
    date: formatDate(),
    customerName: data.customerName,
    customerPhone: data.customerPhone || "N/A",
    customerEmail: data.customerEmail || "N/A",
    customerAddress: data.customerAddress || "N/A",
    serviceName: data.serviceName,
    bookingDate: formatDate(data.bookingDate),
    timeSlot: data.timeSlot || "N/A",
    totalAmount: formatCurrency(data.totalAmount),
  }

  try {
    // ── 1. Send ADMIN notification ──
    const adminHtml = loadTemplate("booking-notification.html", templateReplacements)

    console.log("[admin-notify] ✅ Admin template loaded successfully")
    console.log("[admin-notify] Sending admin email...")

    const info = await transporter.sendMail({
      from: `"Metro Cool" <${process.env.MAIL_USER}>`,
      to: env.ADMIN_EMAIL,
      subject: `[SERVICE] New Booking — ${data.serviceName} | ${data.customerName}`,
      html: adminHtml,
    })

    console.log("[admin-notify] ✅ ADMIN BOOKING EMAIL SENT!")
    console.log("[admin-notify] Message ID:", info.messageId)
    console.log("[admin-notify] Response:", info.response)

    // ── 2. Send CUSTOMER confirmation email ──
    if (data.customerEmail && data.customerEmail !== "N/A") {
      try {
        const customerHtml = loadTemplate("booking-confirmation-customer.html", templateReplacements)

        console.log("[admin-notify] Sending customer confirmation email to:", data.customerEmail)

        const custInfo = await transporter.sendMail({
          from: `"Metro Cool" <${process.env.MAIL_USER}>`,
          to: data.customerEmail,
          subject: `[SERVICE] Booking Confirmed — ${data.serviceName} | Metro Cool`,
          html: customerHtml,
        })

        console.log("[admin-notify] ✅ CUSTOMER CONFIRMATION EMAIL SENT!")
        console.log("[admin-notify] Message ID:", custInfo.messageId)
      } catch (custErr: any) {
        console.error("[admin-notify] ⚠️ Failed to send customer email (non-fatal):", custErr.message)
      }
    }

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
  } catch (err: any) {
    console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    console.error("[admin-notify] ❌ FAILED to send booking notification!")
    console.error("[admin-notify] Error name:", err?.name)
    console.error("[admin-notify] Error message:", err?.message)
    console.error("[admin-notify] Error code:", err?.code)
    console.error("[admin-notify] Full error:", err)
    console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
  }
}

/* =========================================================
   EMAIL 2: PAYMENT COMPLETED NOTIFICATION
   → Sent when service is closed and payment is done
========================================================= */
export interface PaymentCompletedData {
  bookingId: string
  customerName: string
  customerPhone: string
  customerEmail?: string
  serviceName: string
  bookingDate: string
  timeSlot: string
  amountPaid: number
  paymentMethod: string
}

export async function sendPaymentCompletedNotification(data: PaymentCompletedData): Promise<void> {
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
  console.log("[admin-notify] 💰 sendPaymentCompletedNotification CALLED")
  console.log("[admin-notify] Booking ID:", data.bookingId)
  console.log("[admin-notify] Customer:", data.customerName)
  console.log("[admin-notify] Amount:", data.amountPaid)
  console.log("[admin-notify] Method:", data.paymentMethod)
  console.log("[admin-notify] Sending to:", env.ADMIN_EMAIL)
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")

  try {
    const html = loadTemplate("payment-completed.html", {
      bookingId: data.bookingId,
      customerName: data.customerName,
      customerPhone: data.customerPhone || "N/A",
      customerEmail: data.customerEmail || "N/A",
      serviceName: data.serviceName,
      bookingDate: formatDate(data.bookingDate),
      timeSlot: data.timeSlot || "N/A",
      amountPaid: formatCurrency(data.amountPaid),
      paymentMethod: data.paymentMethod,
      paymentDate: formatDate(),
    })

    console.log("[admin-notify] ✅ Template loaded successfully")
    console.log("[admin-notify] Sending email...")

    const info = await transporter.sendMail({
      from: `"Metro Cool" <${process.env.MAIL_USER}>`,
      to: env.ADMIN_EMAIL,
      subject: `[SERVICE] Payment Received — ${data.serviceName} | ${data.customerName} | ${formatCurrency(data.amountPaid)}`,
      html,
    })

    console.log("[admin-notify] ✅ PAYMENT EMAIL SENT!")
    console.log("[admin-notify] Message ID:", info.messageId)
    console.log("[admin-notify] Response:", info.response)
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
  } catch (err: any) {
    console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    console.error("[admin-notify] ❌ FAILED to send payment notification!")
    console.error("[admin-notify] Error name:", err?.name)
    console.error("[admin-notify] Error message:", err?.message)
    console.error("[admin-notify] Error code:", err?.code)
    console.error("[admin-notify] Full error:", err)
    console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
  }
}

/* =========================================================
   ORDER NOTIFICATION (Product purchases)
========================================================= */
export interface OrderItem {
  title: string
  qty: number
  price: number
  capacity?: string
}

export interface OrderNotificationData {
  orderId: string
  customerName: string
  customerPhone: string
  customerEmail?: string
  items: OrderItem[]
  totalAmount: number
  paymentStatus: string
  deliveryAddress: string
}

export async function sendOrderNotification(data: OrderNotificationData): Promise<void> {
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
  console.log("[admin-notify] 🔔 sendOrderNotification CALLED")
  console.log("[admin-notify] Order ID:", data.orderId)
  console.log("[admin-notify] Customer:", data.customerName)
  console.log("[admin-notify] Items:", data.items.length)
  console.log("[admin-notify] Sending to:", env.ADMIN_EMAIL)
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")

  try {
    // Build product rows HTML
    const productRows = data.items
      .map(
        (item) => `
      <tr>
        <td style="font-size:13px;color:#64748b;padding:4px 0;">${item.title}${item.capacity ? ` (${item.capacity})` : ""}</td>
        <td style="font-size:13px;font-weight:600;color:#1e293b;text-align:right;padding:4px 0;">x${item.qty} — ${formatCurrency(item.price * item.qty)}</td>
      </tr>`
      )
      .join("")

    const html = loadTemplate("order-notification.html", {
      orderId: data.orderId,
      date: formatDate(),
      customerName: data.customerName,
      customerPhone: data.customerPhone || "N/A",
      customerEmail: data.customerEmail || "N/A",
      productRows,
      totalAmount: formatCurrency(data.totalAmount),
      paymentStatus: data.paymentStatus,
      deliveryAddress: data.deliveryAddress || "N/A",
    })

    console.log("[admin-notify] ✅ Template loaded successfully")
    console.log("[admin-notify] Sending email...")

    const info = await transporter.sendMail({
      from: `"Metro Cool" <${process.env.MAIL_USER}>`,
      to: env.ADMIN_EMAIL,
      subject: `[PRODUCT] New Order — ${formatCurrency(data.totalAmount)} | ${data.customerName}`,
      html,
    })

    console.log("[admin-notify] ✅ ORDER EMAIL SENT!")
    console.log("[admin-notify] Message ID:", info.messageId)
    console.log("[admin-notify] Response:", info.response)
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
  } catch (err: any) {
    console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    console.error("[admin-notify] ❌ FAILED to send order notification!")
    console.error("[admin-notify] Error name:", err?.name)
    console.error("[admin-notify] Error message:", err?.message)
    console.error("[admin-notify] Error code:", err?.code)
    console.error("[admin-notify] Full error:", err)
    console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
  }
}
