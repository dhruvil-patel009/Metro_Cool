import PDFDocument from "pdfkit"
import fs from "fs"
import path from "path"

/* ── Brand colors ── */
const BLUE       = "#1D4ED8"
const BLUE_DARK  = "#1E3A8A"
const BLUE_LIGHT = "#EFF6FF"
const GRAY_TEXT  = "#374151"
const GRAY_LIGHT = "#F9FAFB"
const GRAY_MID   = "#E5E7EB"
const GREEN      = "#16A34A"
const WHITE      = "#FFFFFF"

const formatINR = (v: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(v)

const formatDate = (d: Date) =>
  d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })

export const generateInvoice = async ({
  booking_id,
  payment_id,
  amount,
  customer_name,
  service_name,
  otp,
}: {
  booking_id: string
  payment_id: string
  amount: number | string
  customer_name: string
  service_name: string
  otp: string
}) => {
  return new Promise<string>((resolve, reject) => {
    try {
      const invoicesDir = path.join(process.cwd(), "invoices")
      if (!fs.existsSync(invoicesDir)) {
        fs.mkdirSync(invoicesDir, { recursive: true })
      }

      const fileName = `invoice_${booking_id}.pdf`
      const filePath = path.join(invoicesDir, fileName)

      const doc = new PDFDocument({
        size: "A4",
        margin: 0,
        info: {
          Title: `Invoice INV-${booking_id.slice(0, 8).toUpperCase()}`,
          Author: "Metro Cool Services",
          Subject: "Service Invoice",
        },
      })

      const stream = fs.createWriteStream(filePath)
      doc.pipe(stream)

      const W = doc.page.width   // 595
      const H = doc.page.height  // 842
      const MARGIN = 48

      const totalAmount = Number(amount)
      // Reverse-calculate: total = base + 18% GST
      // So base = total / 1.18
      const baseAmount  = +(totalAmount / 1.18).toFixed(2)
      const gstAmount   = +(totalAmount - baseAmount).toFixed(2)

      /* ════════════════════════════════════════
         1. DARK HEADER BAND
      ════════════════════════════════════════ */
      doc.rect(0, 0, W, 140).fill(BLUE_DARK)

      // Company name
      doc
        .fillColor(WHITE)
        .fontSize(26)
        .font("Helvetica-Bold")
        .text("METRO COOL", MARGIN, 32, { lineBreak: false })

      // Tagline
      doc
        .fillColor("#93C5FD")
        .fontSize(10)
        .font("Helvetica")
        .text("AC Repair & Maintenance Services", MARGIN, 64)

      // INVOICE label on the right
      doc
        .fillColor(WHITE)
        .fontSize(36)
        .font("Helvetica-Bold")
        .text("INVOICE", W - MARGIN - 160, 28, { width: 160, align: "right" })

      // Invoice number under INVOICE
      doc
        .fillColor("#93C5FD")
        .fontSize(11)
        .font("Helvetica")
        .text(
          `#INV-${booking_id.slice(0, 8).toUpperCase()}`,
          W - MARGIN - 160,
          72,
          { width: 160, align: "right" }
        )

      /* ════════════════════════════════════════
         2. BLUE ACCENT STRIPE
      ════════════════════════════════════════ */
      doc.rect(0, 140, W, 6).fill(BLUE)

      /* ════════════════════════════════════════
         3. META ROW  (Date | Status | Payment ID)
      ════════════════════════════════════════ */
      const metaY = 164
      doc.rect(0, 155, W, 55).fill(BLUE_LIGHT)

      // Date
      doc.fillColor(BLUE).fontSize(8).font("Helvetica-Bold")
        .text("DATE ISSUED", MARGIN, metaY)
      doc.fillColor(GRAY_TEXT).fontSize(11).font("Helvetica")
        .text(formatDate(new Date()), MARGIN, metaY + 13)

      // Status
      const statusX = W / 2 - 60
      doc.fillColor(BLUE).fontSize(8).font("Helvetica-Bold")
        .text("STATUS", statusX, metaY)
      // Green pill
      doc.roundedRect(statusX, metaY + 10, 64, 20, 10).fill(GREEN)
      doc.fillColor(WHITE).fontSize(9).font("Helvetica-Bold")
        .text("PAID", statusX + 18, metaY + 14)

      // Payment ID
      const pidX = W - MARGIN - 180
      doc.fillColor(BLUE).fontSize(8).font("Helvetica-Bold")
        .text("PAYMENT ID", pidX, metaY)
      doc.fillColor(GRAY_TEXT).fontSize(9).font("Helvetica")
        .text(
          String(payment_id).length > 22
            ? String(payment_id).slice(0, 22) + "…"
            : String(payment_id),
          pidX,
          metaY + 13,
          { width: 180 }
        )

      /* ════════════════════════════════════════
         4. BILL TO + SERVICE INFO (two columns)
      ════════════════════════════════════════ */
      const sectionY = 232
      const colW = (W - MARGIN * 2 - 24) / 2

      // ── Bill To ──
      doc.rect(MARGIN, sectionY, colW, 88).fill(GRAY_LIGHT)
        .rect(MARGIN, sectionY, 4, 88).fill(BLUE)

      doc.fillColor(BLUE).fontSize(8).font("Helvetica-Bold")
        .text("BILLED TO", MARGIN + 12, sectionY + 12)
      doc.fillColor(GRAY_TEXT).fontSize(13).font("Helvetica-Bold")
        .text(customer_name || "Customer", MARGIN + 12, sectionY + 26, {
          width: colW - 20,
        })
      doc.fillColor("#6B7280").fontSize(9).font("Helvetica")
        .text("Valued Customer", MARGIN + 12, sectionY + 48)

      // ── Service Info ──
      const col2X = MARGIN + colW + 24
      doc.rect(col2X, sectionY, colW, 88).fill(GRAY_LIGHT)
        .rect(col2X, sectionY, 4, 88).fill(BLUE)

      doc.fillColor(BLUE).fontSize(8).font("Helvetica-Bold")
        .text("SERVICE DETAILS", col2X + 12, sectionY + 12)
      doc.fillColor(GRAY_TEXT).fontSize(13).font("Helvetica-Bold")
        .text(service_name || "AC Service", col2X + 12, sectionY + 26, {
          width: colW - 20,
        })
      doc.fillColor("#6B7280").fontSize(9).font("Helvetica")
        .text("Professional AC Service", col2X + 12, sectionY + 48)

      /* ════════════════════════════════════════
         5. ITEMS TABLE
      ════════════════════════════════════════ */
      const tableY = sectionY + 108
      const tableW = W - MARGIN * 2
      const COL = {
        desc:  MARGIN,
        hsn:   MARGIN + tableW * 0.48,
        qty:   MARGIN + tableW * 0.62,
        rate:  MARGIN + tableW * 0.72,
        amt:   MARGIN + tableW * 0.85,
      }

      // Header row
      doc.rect(MARGIN, tableY, tableW, 28).fill(BLUE)
      doc.fillColor(WHITE).fontSize(9).font("Helvetica-Bold")
      const headY = tableY + 9
      doc.text("DESCRIPTION",        COL.desc + 8, headY)
      doc.text("HSN / SAC",          COL.hsn,      headY)
      doc.text("QTY",                COL.qty,      headY)
      doc.text("UNIT PRICE",         COL.rate,     headY)
      doc.text("AMOUNT",             COL.amt,      headY)

      // Item row 1 — service
      const row1Y = tableY + 28
      doc.rect(MARGIN, row1Y, tableW, 36).fill(WHITE)
      doc.rect(MARGIN, row1Y, tableW, 36).stroke(GRAY_MID)

      doc.fillColor(GRAY_TEXT).fontSize(10).font("Helvetica-Bold")
        .text(service_name || "AC Service", COL.desc + 8, row1Y + 6, {
          width: tableW * 0.44,
        })
      doc.fillColor("#6B7280").fontSize(8).font("Helvetica")
        .text("998719", COL.hsn, row1Y + 11)
      doc.text("1", COL.qty + 8, row1Y + 11)
      doc.text(formatINR(baseAmount), COL.rate, row1Y + 11)
      doc.fillColor(GRAY_TEXT).fontSize(10).font("Helvetica-Bold")
        .text(formatINR(baseAmount), COL.amt, row1Y + 11)

      /* ════════════════════════════════════════
         6. SUMMARY BOX (right-aligned)
      ════════════════════════════════════════ */
      const summaryY = row1Y + 48
      const summaryX = W - MARGIN - 220
      const summaryW = 220

      // Subtotal row
      doc.rect(summaryX, summaryY, summaryW, 26).fill(GRAY_LIGHT)
      doc.fillColor("#6B7280").fontSize(9).font("Helvetica")
        .text("Subtotal", summaryX + 10, summaryY + 7)
      doc.text(formatINR(baseAmount), summaryX + summaryW - 80, summaryY + 7)

      // GST row
      doc.rect(summaryX, summaryY + 26, summaryW, 26).fill(WHITE)
      doc.rect(summaryX, summaryY + 26, summaryW, 26).stroke(GRAY_MID)
      doc.fillColor("#6B7280").fontSize(9).font("Helvetica")
        .text("GST @ 18%", summaryX + 10, summaryY + 33)
      doc.text(formatINR(gstAmount), summaryX + summaryW - 80, summaryY + 33)

      // Total row
      doc.rect(summaryX, summaryY + 52, summaryW, 34).fill(BLUE)
      doc.fillColor(WHITE).fontSize(11).font("Helvetica-Bold")
        .text("TOTAL PAID", summaryX + 10, summaryY + 62)
      doc.fontSize(13)
        .text(formatINR(totalAmount), summaryX + summaryW - 95, summaryY + 60)

      /* ════════════════════════════════════════
         7. NOTES (left side, same level as summary)
      ════════════════════════════════════════ */
      doc.fillColor(BLUE).fontSize(8).font("Helvetica-Bold")
        .text("NOTES", MARGIN, summaryY + 4)
      doc.fillColor("#6B7280").fontSize(8.5).font("Helvetica")
        .text(
          "Payment received. Thank you for choosing Metro Cool!\n" +
          "For support, contact us at support@metro-cool.com\n" +
          "This is a computer-generated invoice.",
          MARGIN,
          summaryY + 16,
          { width: summaryX - MARGIN - 16, lineGap: 4 }
        )

      /* ════════════════════════════════════════
         8. SERVICE COMPLETED BANNER
      ════════════════════════════════════════ */
      const bannerY = summaryY + 112

      // Green success banner
      doc.rect(MARGIN, bannerY, tableW, 60).fill("#F0FDF4")
      doc.rect(MARGIN, bannerY, tableW, 60).stroke("#BBF7D0")
      doc.rect(MARGIN, bannerY, 6, 60).fill(GREEN)

      // Checkmark circle
      doc.circle(MARGIN + 38, bannerY + 30, 18).fill(GREEN)
      doc.fillColor(WHITE).fontSize(16).font("Helvetica-Bold")
        .text("✓", MARGIN + 29, bannerY + 22)

      // Text
      doc.fillColor("#14532D").fontSize(12).font("Helvetica-Bold")
        .text("Service Successfully Completed", MARGIN + 68, bannerY + 10)
      doc.fillColor("#166534").fontSize(9).font("Helvetica")
        .text(
          "Your AC service has been completed and payment has been received. " +
          "Thank you for choosing Metro Cool!",
          MARGIN + 68,
          bannerY + 28,
          { width: tableW - 90 }
        )

      /* ════════════════════════════════════════
         9. DIVIDER
      ════════════════════════════════════════ */
      const divY = bannerY + 80
      doc.rect(MARGIN, divY, tableW, 1).fill(GRAY_MID)

      /* ════════════════════════════════════════
         10. FOOTER
      ════════════════════════════════════════ */
      const footerY = divY + 12

      doc.fillColor("#9CA3AF").fontSize(8).font("Helvetica")
        .text(
          "Metro Cool Services  ·  AC Repair & Maintenance  ·  support@metro-cool.com  ·  www.metro-cool.com",
          MARGIN,
          footerY,
          { width: tableW, align: "center" }
        )

      // Page number
      doc.text(
        `Generated on ${formatDate(new Date())}  ·  Page 1 of 1`,
        MARGIN,
        footerY + 14,
        { width: tableW, align: "center" }
      )

      // Bottom blue bar
      doc.rect(0, H - 8, W, 8).fill(BLUE)

      /* ── Done ── */
      doc.end()
      stream.on("finish", () => resolve(filePath))
      stream.on("error", (err) => reject(err))

    } catch (err) {
      reject(err)
    }
  })
}
