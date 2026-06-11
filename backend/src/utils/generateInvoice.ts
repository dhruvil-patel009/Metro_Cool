import PDFDocument from "pdfkit"
import fs from "fs"
import path from "path"

/* ─────────────────────────────────────────
   PALETTE
───────────────────────────────────────── */
const P = {
  navy:      "#0F172A",
  blue:      "#2563EB",
  blueDark:  "#1D4ED8",
  blueDeep:  "#1E3A8A",
  blueLight: "#EFF6FF",
  blueMid:   "#BFDBFE",
  blueHint:  "#93C5FD",
  teal:      "#0891B2",
  green:     "#16A34A",
  greenBg:   "#F0FDF4",
  greenBdr:  "#BBF7D0",
  amber:     "#D97706",
  gray50:    "#F8FAFC",
  gray100:   "#F1F5F9",
  gray200:   "#E2E8F0",
  text:      "#1E293B",
  muted:     "#64748B",
  white:     "#FFFFFF",
}

/* ─────────────────────────────────────────
   HELPERS — no emojis, no special Unicode
   PDFKit Helvetica only supports Latin-1
───────────────────────────────────────── */
const INR = (v: number) => {
  // Format number in Indian style, prefix with "Rs." since
  // Helvetica cannot render the rupee sign (U+20B9)
  const formatted = new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(v)
  return `Rs. ${formatted}`
}

const fDate = (d: Date) =>
  d.toLocaleDateString("en-IN", {
    day: "2-digit", month: "long", year: "numeric",
  })

const methodLabel = (m: string) => {
  const s = (m || "").toLowerCase()
  if (s === "upi")        return "UPI Payment"
  if (s === "card")       return "Card Payment"
  if (s === "netbanking") return "Net Banking"
  if (s === "wallet")     return "Wallet"
  if (s === "cash")       return "Cash"
  if (s === "emi")        return "EMI"
  return "Online Payment"
}

const methodTag = (m: string) => {
  const s = (m || "").toLowerCase()
  if (s === "upi")        return "UPI"
  if (s === "card")       return "CARD"
  if (s === "netbanking") return "NB"
  if (s === "wallet")     return "WLT"
  if (s === "cash")       return "CASH"
  if (s === "emi")        return "EMI"
  return "PAY"
}

/* ─────────────────────────────────────────
   INTERFACE
───────────────────────────────────────── */
export interface InvoiceData {
  booking_id:      string
  payment_id:      string
  amount:          number | string
  customer_name:   string
  customer_phone?: string
  service_name:    string
  service_type?:   "service" | "product"
  booking_date?:   string
  time_slot?:      string
  payment_method?: string
  payment_last4?:  string
  payment_bank?:   string
  payment_vpa?:    string
  payment_date?:   string
  otp?:            string
}

/* ─────────────────────────────────────────
   DRAW HELPERS
───────────────────────────────────────── */
function hline(doc: PDFKit.PDFDocument, x: number, y: number, w: number, color = P.gray200) {
  doc.save()
    .moveTo(x, y).lineTo(x + w, y)
    .strokeColor(color).lineWidth(0.6).stroke()
    .restore()
}

function pill(doc: PDFKit.PDFDocument, x: number, y: number, w: number, h: number, r: number, color: string) {
  doc.roundedRect(x, y, w, h, r).fill(color)
}

function sectionLabel(doc: PDFKit.PDFDocument, text: string, x: number, y: number, color = P.blue) {
  doc.fillColor(color).fontSize(7).font("Helvetica-Bold")
    .text(text.toUpperCase(), x, y, { characterSpacing: 0.5 })
}

/* ─────────────────────────────────────────
   MAIN
───────────────────────────────────────── */
export const generateInvoice = async (data: InvoiceData): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    try {
      const dir = path.join(process.cwd(), "invoices")
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })

      const filePath = path.join(dir, `invoice_${data.booking_id}.pdf`)

      const doc = new PDFDocument({ size: "A4", margin: 0,
        info: {
          Title:   `Invoice INV-${data.booking_id.slice(0, 8).toUpperCase()}`,
          Author:  "Metro Cool",
          Subject: "Payment Invoice",
        },
      })
      const stream = fs.createWriteStream(filePath)
      doc.pipe(stream)

      const W = 595
      const H = 842
      const M = 44       // side margin
      const IW = W - M * 2  // inner width

      const total = Number(data.amount)
      const base  = +(total / 1.18).toFixed(2)
      const gst   = +(total - base).toFixed(2)
      const meth  = (data.payment_method || "card").toLowerCase()
      const invNo = `INV-${data.booking_id.slice(0, 8).toUpperCase()}`
      const isProd = data.service_type === "product"
      const invDate = data.payment_date
        ? fDate(new Date(data.payment_date)) : fDate(new Date())

      /* ══════════════════════════
         1. HEADER — navy bg
      ══════════════════════════ */
      doc.rect(0, 0, W, 144).fill(P.navy)

      // Left teal accent bar
      doc.rect(0, 0, 5, 144).fill(P.teal)

      // --- Logo PNG (process.cwd() = backend root) ---
      const logoPath = path.join(process.cwd(), "logo.png")
      let logoDrawn = false
      if (fs.existsSync(logoPath)) {
        try {
          doc.image(logoPath, M, 20, { width: 50, height: 50 })
          logoDrawn = true
        } catch (_) { /* fall through to text logo */ }
      }
      if (!logoDrawn) {
        // Text-based logo fallback
        doc.roundedRect(M, 20, 50, 50, 8).fill(P.blue)
        doc.fillColor(P.white).fontSize(18).font("Helvetica-Bold")
          .text("MC", M + 9, M - 8)
      }

      // Company name
      doc.fillColor(P.white).fontSize(20).font("Helvetica-Bold")
        .text("METRO COOL", M + 60, 24)
      doc.fillColor(P.blueHint).fontSize(9).font("Helvetica")
        .text("AC Repair & Maintenance Services", M + 60, 49)
      doc.fillColor(P.blueMid).fontSize(7.5).font("Helvetica")
        .text("www.metro-cool.com  |  support@metro-cool.com", M + 60, 63)

      // INVOICE label (right)
      doc.fillColor(P.white).fontSize(30).font("Helvetica-Bold")
        .text("INVOICE", W - M - 160, 18, { width: 160, align: "right" })
      doc.fillColor(P.blueHint).fontSize(10).font("Helvetica")
        .text(invNo, W - M - 160, 57, { width: 160, align: "right" })

      // PAID badge
      pill(doc, W - M - 68, 76, 68, 24, 12, P.green)
      doc.fillColor(P.white).fontSize(10).font("Helvetica-Bold")
        .text("[ PAID ]", W - M - 63, 81)

      // Blue accent stripe
      doc.rect(0, 144, W, 5).fill(P.blue)

      /* ══════════════════════════
         2. META BAR
      ══════════════════════════ */
      doc.rect(0, 149, W, 52).fill(P.blueLight)

      const mY = 162
      const cW = IW / 3

      // Invoice date
      sectionLabel(doc, "Invoice Date", M, mY)
      doc.fillColor(P.text).fontSize(10).font("Helvetica")
        .text(invDate, M, mY + 12)

      // Service date
      const sDate = data.booking_date
        ? fDate(new Date(data.booking_date)) + (data.time_slot ? "  |  " + data.time_slot : "")
        : "N/A"
      sectionLabel(doc, "Service Date", M + cW, mY)
      doc.fillColor(P.text).fontSize(10).font("Helvetica")
        .text(sDate, M + cW, mY + 12, { width: cW - 4 })

      // Payment ID
      const pidTxt = String(data.payment_id).length > 22
        ? String(data.payment_id).slice(0, 22) + "..."
        : String(data.payment_id)
      sectionLabel(doc, "Payment Reference", M + cW * 2, mY)
      doc.fillColor(P.text).fontSize(9).font("Helvetica")
        .text(pidTxt, M + cW * 2, mY + 12, { width: cW })

      /* ══════════════════════════
         3. BILL TO  +  SERVICE
      ══════════════════════════ */
      const s3Y = 218
      const hW  = (IW - 14) / 2

      // Billed To card
      doc.rect(M, s3Y, hW, 82).fill(P.gray50)
      doc.rect(M, s3Y, 4, 82).fill(P.blue)
      sectionLabel(doc, "Billed To", M + 12, s3Y + 10)
      doc.fillColor(P.text).fontSize(12).font("Helvetica-Bold")
        .text(data.customer_name || "Customer", M + 12, s3Y + 24, { width: hW - 18 })
      if (data.customer_phone) {
        doc.fillColor(P.muted).fontSize(9).font("Helvetica")
          .text("Phone: " + data.customer_phone, M + 12, s3Y + 46)
      }

      // Service / Product card
      const s2X = M + hW + 14
      doc.rect(s2X, s3Y, hW, 82).fill(P.gray50)
      doc.rect(s2X, s3Y, 4, 82).fill(P.teal)
      sectionLabel(doc, isProd ? "Product Details" : "Service Details", s2X + 12, s3Y + 10, P.teal)
      doc.fillColor(P.text).fontSize(12).font("Helvetica-Bold")
        .text(data.service_name || "AC Service", s2X + 12, s3Y + 24, { width: hW - 18 })
      doc.fillColor(P.muted).fontSize(9).font("Helvetica")
        .text(isProd ? "Product Purchase" : "Professional AC Service", s2X + 12, s3Y + 46)

      /* ══════════════════════════
         4. LINE ITEMS TABLE
      ══════════════════════════ */
      const tY = s3Y + 96
      const cols = {
        d: M,
        h: M + IW * 0.46,
        q: M + IW * 0.60,
        r: M + IW * 0.72,
        a: M + IW * 0.85,
      }

      // Header
      doc.rect(M, tY, IW, 27).fill(P.blueDeep)
      doc.fillColor(P.white).fontSize(8.5).font("Helvetica-Bold")
      const hRow = tY + 9
      doc.text("DESCRIPTION",  cols.d + 8, hRow)
        .text("HSN / SAC",     cols.h,     hRow)
        .text("QTY",           cols.q,     hRow)
        .text("UNIT PRICE",    cols.r,     hRow)
        .text("AMOUNT",        cols.a,     hRow)

      // Row
      const dRow = tY + 27
      doc.rect(M, dRow, IW, 36).fill(P.white)
      hline(doc, M, dRow + 36, IW)

      doc.fillColor(P.text).fontSize(10).font("Helvetica-Bold")
        .text(data.service_name || "AC Service", cols.d + 8, dRow + 8, { width: IW * 0.42 })
      doc.fillColor(P.muted).fontSize(8).font("Helvetica")
        .text("998719",    cols.h,      dRow + 12)
        .text("1",         cols.q + 8,  dRow + 12)
        .text(INR(base),   cols.r,      dRow + 12)
      doc.fillColor(P.text).fontSize(10).font("Helvetica-Bold")
        .text(INR(base),   cols.a,      dRow + 12)

      /* ══════════════════════════
         5. PAYMENT METHOD  +  TOTALS
      ══════════════════════════ */
      const s5Y  = dRow + 50
      const totX = W - M - 215
      const totW = 215
      const pmW  = totX - M - 14
      const s5H  = 90

      // Payment Method card
      doc.rect(M, s5Y, pmW, s5H).fill(P.gray50)
      doc.rect(M, s5Y, 4, s5H).fill(P.teal)
      sectionLabel(doc, "Payment Method", M + 12, s5Y + 10, P.teal)

      // Badge color by method
      const badgeCol = meth === "cash" ? P.green : meth === "upi" ? P.teal : P.blueDeep
      pill(doc, M + 12, s5Y + 24, 48, 30, 6, badgeCol)
      doc.fillColor(P.white).fontSize(9).font("Helvetica-Bold")
        .text(methodTag(meth), M + 14, s5Y + 33, { width: 44, align: "center" })

      doc.fillColor(P.text).fontSize(11).font("Helvetica-Bold")
        .text(methodLabel(meth), M + 68, s5Y + 26)

      // Payment detail line
      let detail = ""
      if (meth === "card" && data.payment_last4)
        detail = "Card ending  ....  " + data.payment_last4
      else if (meth === "upi" && data.payment_vpa)
        detail = "UPI ID: " + data.payment_vpa
      else if (meth === "netbanking" && data.payment_bank)
        detail = "Bank: " + data.payment_bank
      else if (meth === "cash")
        detail = "Paid directly to technician"
      else if (meth === "wallet")
        detail = "Paid via digital wallet"

      if (detail) {
        doc.fillColor(P.muted).fontSize(8.5).font("Helvetica")
          .text(detail, M + 68, s5Y + 44, { width: pmW - 78 })
      }

      // Totals
      // Subtotal row
      doc.rect(totX, s5Y, totW, 27).fill(P.gray100)
      doc.fillColor(P.muted).fontSize(9).font("Helvetica")
        .text("Subtotal",  totX + 12, s5Y + 8)
        .text(INR(base),   totX + totW - 85, s5Y + 8)

      // GST row
      doc.rect(totX, s5Y + 27, totW, 27).fill(P.white)
      hline(doc, totX, s5Y + 27, totW)
      hline(doc, totX, s5Y + 54, totW)
      doc.fillColor(P.muted).fontSize(9).font("Helvetica")
        .text("GST @ 18%", totX + 12, s5Y + 35)
        .text(INR(gst),    totX + totW - 85, s5Y + 35)

      // Total row
      doc.rect(totX, s5Y + 54, totW, 36).fill(P.blue)
      doc.fillColor(P.white).fontSize(11).font("Helvetica-Bold")
        .text("TOTAL PAID",  totX + 12,          s5Y + 65)
        .text(INR(total),    totX + totW - 95,    s5Y + 64)

      /* ══════════════════════════
         6. SUCCESS BANNER
      ══════════════════════════ */
      const banY = s5Y + s5H + 14
      const banH = 56

      doc.rect(M, banY, IW, banH).fill(P.greenBg)
      doc.rect(M, banY, IW, banH).strokeColor(P.greenBdr).lineWidth(0.8).stroke()
      doc.rect(M, banY, 5, banH).fill(P.green)

      // Circle with checkmark (no emoji — use text "OK")
      doc.circle(M + 36, banY + banH / 2, 17).fill(P.green)
      doc.fillColor(P.white).fontSize(11).font("Helvetica-Bold")
        .text("OK", M + 27, banY + banH / 2 - 7)

      doc.fillColor("#14532D").fontSize(11).font("Helvetica-Bold")
        .text(
          isProd ? "Order Placed & Payment Successful!" : "Service Completed & Payment Received!",
          M + 64, banY + 11
        )
      doc.fillColor("#166534").fontSize(9).font("Helvetica")
        .text(
          isProd
            ? "Your order is confirmed. Thank you for shopping with Metro Cool!"
            : "Your AC service is done and payment received. Thank you for choosing Metro Cool!",
          M + 64, banY + 28, { width: IW - 78 }
        )

      /* ══════════════════════════
         7. THANK YOU CARD
      ══════════════════════════ */
      const tyY = banY + banH + 14
      const tyH = 68

      doc.rect(M, tyY, IW, tyH).fill(P.blueDeep)
      doc.rect(M, tyY, 5, tyH).fill(P.teal)
      // Right accent panel
      doc.rect(M + IW - 80, tyY, 80, tyH).fill("#1E40AF")

      doc.fillColor(P.white).fontSize(14).font("Helvetica-Bold")
        .text("Thank you for choosing Metro Cool!", M + 16, tyY + 12, { width: IW - 100 })
      doc.fillColor(P.blueMid).fontSize(9).font("Helvetica")
        .text(
          "We appreciate your trust. For support or future bookings: www.metro-cool.com",
          M + 16, tyY + 34, { width: IW - 100 }
        )

      // Star rating — plain text (no Unicode stars which fail)
      doc.fillColor("#FCD34D").fontSize(16).font("Helvetica-Bold")
        .text("* * * * *", M + IW - 74, tyY + 24, { width: 72, align: "center" })

      /* ══════════════════════════
         8. TERMS  +  SUMMARY
      ══════════════════════════ */
      const noteY = tyY + tyH + 14
      const hNW   = (IW - 14) / 2

      // Terms box
      doc.rect(M, noteY, hNW, 62).fill(P.gray50)
      doc.rect(M, noteY, 4, 62).fill(P.amber)
      sectionLabel(doc, "Terms & Conditions", M + 12, noteY + 9, P.amber)
      doc.fillColor(P.muted).fontSize(7.8).font("Helvetica")
        .text(
          "- Computer-generated invoice, no signature required.\n" +
          "- For disputes email support@metro-cool.com within 7 days.\n" +
          "- Refund policy at metro-cool.com/terms",
          M + 12, noteY + 22, { width: hNW - 20, lineGap: 3 }
        )

      // Invoice summary box
      const refX = M + hNW + 14
      doc.rect(refX, noteY, hNW, 62).fill(P.blueLight)
      doc.rect(refX, noteY, 4, 62).fill(P.blue)
      sectionLabel(doc, "Invoice Summary", refX + 12, noteY + 9, P.blue)
      doc.fillColor(P.muted).fontSize(8.5).font("Helvetica")
        .text("Invoice No :  " + invNo,         refX + 12, noteY + 22)
        .text("Amount Paid:  " + INR(total),     refX + 12, noteY + 35)
        .text("Date       :  " + invDate,        refX + 12, noteY + 48)

      /* ══════════════════════════
         9. FOOTER
      ══════════════════════════ */
      const fDivY = noteY + 76
      hline(doc, M, fDivY, IW, P.gray200)

      const fY = fDivY + 10
      doc.fillColor("#94A3B8").fontSize(7.5).font("Helvetica")
        .text(
          "Metro Cool Services  |  AC Repair & Maintenance  |  support@metro-cool.com  |  www.metro-cool.com",
          M, fY, { width: IW, align: "center" }
        )
        .text(
          "Generated on " + fDate(new Date()) + "  |  Page 1 of 1",
          M, fY + 13, { width: IW, align: "center" }
        )

      // Bottom split bar — teal left, blue right
      doc.rect(0,     H - 7, W / 2, 7).fill(P.teal)
      doc.rect(W / 2, H - 7, W / 2, 7).fill(P.blue)

      doc.end()
      stream.on("finish", () => resolve(filePath))
      stream.on("error", reject)

    } catch (err: any) {
      console.error("[generateInvoice] crash:", err?.message, err?.stack)
      reject(err)
    }
  })
}
