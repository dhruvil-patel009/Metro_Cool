import PDFDocument from "pdfkit"
import fs from "fs"
import path from "path"
import os from "os"
import { fileURLToPath } from "url"
import sharp from "sharp"

/* Get directory of THIS file — works in both dev (src/) and prod (dist/) */
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/* ═══════════════════════════════════════════════════
   PALETTE
═══════════════════════════════════════════════════ */
const C = {
  navy:        "#0D2137",
  blue:        "#1B4F8A",
  headerBg:    "#EBF3FF",
  teal:        "#0D9488",
  tealLight:   "#CCFBF1",
  tealBdr:     "#5EEAD4",
  green:       "#16A34A",
  greenLight:  "#F0FDF4",
  greenBdr:    "#86EFAC",
  text:        "#1E293B",
  muted:       "#64748B",
  subtle:      "#94A3B8",
  tableBg:     "#F1F5F9",
  line:        "#E2E8F0",
  lineDark:    "#CBD5E1",
  white:       "#FFFFFF",
  amber:       "#F59E0B",
}

/* ═══════════════════════════════════════════════════
   LOGO — SVG → PNG, white background, cached
═══════════════════════════════════════════════════ */
let _logoBuf: Buffer | null = null

async function getLogoPng(): Promise<Buffer | null> {
  if (_logoBuf) return _logoBuf

  // Build paths relative to THIS file (works in both src/ and dist/)
  // __dirname = backend/src/utils/ (dev) or backend/dist/utils/ (prod)
  const candidates = [
    // Same folder as this file
    path.join(__dirname, "logo.png"),
    // backend/logo.png (from src/utils/ go up 2 levels)
    path.join(__dirname, "..", "..", "logo.png"),
    // backend/logo.png (from dist/utils/ go up 2 levels)
    path.join(__dirname, "..", "..", "..", "logo.png"),
    // process.cwd() based (fallback for various deploy setups)
    path.join(process.cwd(), "logo.png"),
    path.join(process.cwd(), "..", "logo.png"),
    path.join(process.cwd(), "dist", "utils", "logo.png"),
    path.join(process.cwd(), "src", "utils", "logo.png"),
    // Frontend assets (local dev only)
    path.join(process.cwd(), "..", "frontend", "public", "assets", "logo.svg"),
    path.join(process.cwd(), "..", "frontend", "public", "assets", "logo.png"),
  ]

  console.log("[invoice-logo] searching for logo, cwd:", process.cwd(), "__dirname:", __dirname)
  for (const p of candidates) {
    if (!fs.existsSync(p)) {
      console.log("[invoice-logo] not found:", p)
      continue
    }
    console.log("[invoice-logo] found:", p)
    try {
      _logoBuf = await sharp(fs.readFileSync(p))
        .resize(140, 140, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 1 } })
        .flatten({ background: { r: 255, g: 255, b: 255 } })
        .png()
        .toBuffer()
      return _logoBuf
    } catch (e: any) {
      console.log("[invoice-logo] sharp failed for:", p, e?.message)
    }
  }
  console.log("[invoice-logo] no logo found, will use text fallback")
  return null
}

/* ═══════════════════════════════════════════════════
   FORMATTERS
═══════════════════════════════════════════════════ */
const INR = (v: number) =>
  `Rs. ${new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2, maximumFractionDigits: 2,
  }).format(v)}`

const fDate = (d: Date) =>
  d.toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })

const methodLabel = (m: string): string =>
  ({ upi: "UPI Payment", card: "Card Payment", netbanking: "Net Banking",
     wallet: "Wallet", cash: "Cash", emi: "EMI" }[(m||"").toLowerCase()] ?? "Online Payment")

const methodTag = (m: string): string =>
  ({ upi: "UPI", card: "CARD", netbanking: "NB",
     wallet: "WLT", cash: "CASH", emi: "EMI" }[(m||"").toLowerCase()] ?? "PAY")

/* ═══════════════════════════════════════════════════
   INTERFACE
═══════════════════════════════════════════════════ */
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

/* ═══════════════════════════════════════════════════
   PRIMITIVES
═══════════════════════════════════════════════════ */
type Doc = PDFKit.PDFDocument

const hRule = (doc: Doc, x: number, y: number, w: number, color = C.line, lw = 0.5) =>
  doc.save().moveTo(x, y).lineTo(x + w, y).strokeColor(color).lineWidth(lw).stroke().restore()

const vRule = (doc: Doc, x: number, y: number, h: number, color = C.lineDark, lw = 0.5) =>
  doc.save().moveTo(x, y).lineTo(x, y + h).strokeColor(color).lineWidth(lw).stroke().restore()

function fillRect(doc: Doc, x: number, y: number, w: number, h: number, color: string) {
  doc.rect(x, y, w, h).fill(color)
}

function fillRRect(
  doc: Doc, x: number, y: number, w: number, h: number,
  r: number, fill: string, stroke?: string, sw = 0.9
) {
  doc.roundedRect(x, y, w, h, r)
  stroke ? doc.lineWidth(sw).fillAndStroke(fill, stroke) : doc.fill(fill)
}

const fieldLabel = (doc: Doc, txt: string, x: number, y: number, color = C.subtle) =>
  doc.fillColor(color).fontSize(6.5).font("Helvetica-Bold")
     .text(txt.toUpperCase(), x, y, { characterSpacing: 0.9, lineBreak: false })

/* ═══════════════════════════════════════════════════
   MAIN
═══════════════════════════════════════════════════ */
export const generateInvoice = async (data: InvoiceData): Promise<string> => {
  const logoBuf = await getLogoPng()

  return new Promise<string>((resolve, reject) => {
    try {
      // Use OS temp directory — works on Vercel, AWS, VPS, local
      const dir = path.join(os.tmpdir(), "metro-cool-invoices")
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
      const filePath = path.join(dir, `invoice_${data.booking_id}.pdf`)
      console.log("[invoice] writing PDF to:", filePath)

      const doc = new PDFDocument({ size: "A4", margin: 0,
        info: {
          Title:   `Invoice INV-${data.booking_id.slice(0,8).toUpperCase()}`,
          Author:  "Metro Cool", Subject: "Service Invoice",
        },
      })
      const stream = fs.createWriteStream(filePath)
      doc.pipe(stream)

      /* ── Page dimensions ── */
      const W  = 595
      const H  = 842
      const ML = 44          // left margin
      const MR = 44          // right margin
      const IW = W - ML - MR // 507 inner width

      /* ── Computed ── */
      const total  = Number(data.amount)
      const base   = +(total / 1.18).toFixed(2)
      const gst    = +(total - base).toFixed(2)
      const meth   = (data.payment_method || "card").toLowerCase()
      const invNo  = `INV-${data.booking_id.slice(0,8).toUpperCase()}`
      const isProd = data.service_type === "product"
      const invDate = data.payment_date
        ? fDate(new Date(data.payment_date)) : fDate(new Date())

      /* ════════════════════════════════════════
         1. PAGE BACKGROUND
      ════════════════════════════════════════ */
      fillRect(doc, 0, 0, W, H, C.white)

      /* Top thick navy bar */
      fillRect(doc, 0, 0, W, 6, C.navy)

      /* ════════════════════════════════════════
         2. HEADER BAND  (y: 6 → 128)
      ════════════════════════════════════════ */
      const BAND_H = 122
      fillRect(doc, 0, 6, W, BAND_H, C.headerBg)

      /* -- Logo box -- */
      const LX = ML
      const LY = 18
      const LS = 70   // logo size

      // White rounded frame
      fillRRect(doc, LX - 3, LY - 3, LS + 6, LS + 6, 9, C.white, C.lineDark, 0.7)
      if (logoBuf) {
        try { doc.image(logoBuf, LX, LY, { width: LS, height: LS }) }
        catch (_) {
          fillRRect(doc, LX, LY, LS, LS, 8, C.blue)
          doc.fillColor(C.white).fontSize(22).font("Helvetica-Bold")
            .text("MC", LX + 14, LY + 20)
        }
      } else {
        fillRRect(doc, LX, LY, LS, LS, 8, C.blue)
        doc.fillColor(C.white).fontSize(22).font("Helvetica-Bold")
          .text("MC", LX + 14, LY + 20)
      }

      /* -- Company text (right of logo) -- */
      const TX = LX + LS + 14
      doc.fillColor(C.navy).fontSize(18).font("Helvetica-Bold")
        .text("METRO COOL", TX, LY + 2, { lineBreak: false })
      doc.fillColor(C.muted).fontSize(9).font("Helvetica")
        .text("AC Repair & Maintenance Services", TX, LY + 25, { lineBreak: false })
      doc.fillColor(C.subtle).fontSize(7.5).font("Helvetica")
        .text("www.metro-cool.com  |  support@metro-cool.com", TX, LY + 39, { lineBreak: false })

      /* -- Right side: INVOICE title -- */
      // "INVOICE" text — right edge
      doc.fillColor(C.navy).fontSize(38).font("Helvetica-Bold")
        .text("INVOICE", ML, 14, { width: IW, align: "right", lineBreak: false })

      /* Invoice No */
      const RX = W - MR - 195  // fixed right block left edge
      doc.fillColor(C.muted).fontSize(9).font("Helvetica")
        .text("Invoice No: ", RX, 68, { lineBreak: false, continued: true })
      doc.fillColor(C.navy).font("Helvetica-Bold")
        .text(invNo, { lineBreak: false })

      /* Date */
      doc.fillColor(C.muted).fontSize(9).font("Helvetica")
        .text("Date: ", RX, 84, { lineBreak: false, continued: true })
      doc.fillColor(C.navy).font("Helvetica-Bold")
        .text(invDate, { lineBreak: false })

      /* PAID badge */
      const BW = 62, BH = 21
      const BX = W - MR - BW
      const BY = 101
      fillRRect(doc, BX, BY, BW, BH, 10, C.tealLight, C.teal, 1)
      doc.fillColor(C.teal).fontSize(9.5).font("Helvetica-Bold")
        .text("PAID", BX, BY + 5, { width: BW, align: "center", lineBreak: false })

      /* Separator under band */
      const BAND_END = 6 + BAND_H   // y = 128
      hRule(doc, 0, BAND_END, W, C.lineDark, 1)

      /* ════════════════════════════════════════
         3. INFO ROW — FROM | BILLED TO | SERVICE DETAILS
         Three equal columns, each 169pt wide
      ════════════════════════════════════════ */
      const IR_Y   = BAND_END + 18   // info row top
      const COL_W  = IW / 3          // 169 pt
      const COL_H  = 76              // info row height

      /* Column 1 — FROM */
      fieldLabel(doc, "From", ML, IR_Y)
      doc.fillColor(C.text).fontSize(10.5).font("Helvetica-Bold")
        .text("Metro Cool", ML, IR_Y + 13, { lineBreak: false })
      doc.fillColor(C.muted).fontSize(8.5).font("Helvetica")
        .text("www.metro-cool.com", ML, IR_Y + 29, { lineBreak: false })
        .text("support@metro-cool.com", ML, IR_Y + 41, { lineBreak: false })

      /* Vertical separator after col 1 */
      vRule(doc, ML + COL_W, IR_Y, COL_H)

      /* Column 2 — BILLED TO */
      const C2X = ML + COL_W + 16
      fieldLabel(doc, "Billed To", C2X, IR_Y)
      doc.fillColor(C.text).fontSize(10.5).font("Helvetica-Bold")
        .text(data.customer_name || "Customer", C2X, IR_Y + 13, {
          width: COL_W - 20, lineBreak: false,
        })
      if (data.customer_phone) {
        doc.fillColor(C.teal).fontSize(9).font("Helvetica")
          .text(data.customer_phone, C2X, IR_Y + 29, { lineBreak: false })
      }

      /* Vertical separator after col 2 */
      vRule(doc, ML + COL_W * 2, IR_Y, COL_H)

      /* Column 3 — SERVICE DETAILS */
      const C3X = ML + COL_W * 2 + 16
      const C3W = IW - COL_W * 2 - 16
      fieldLabel(doc, isProd ? "Product Details" : "Service Details", C3X, IR_Y)
      doc.fillColor(C.text).fontSize(10.5).font("Helvetica-Bold")
        .text(data.service_name || "AC Service", C3X, IR_Y + 13, {
          width: C3W, lineBreak: false,
        })
      doc.fillColor(C.muted).fontSize(8.5).font("Helvetica")
        .text(isProd ? "Product Purchase" : "Professional AC Service",
          C3X, IR_Y + 29, { width: C3W, lineBreak: false })
      if (data.booking_date) {
        const sd = fDate(new Date(data.booking_date)) +
          (data.time_slot ? "  |  " + data.time_slot : "")
        doc.fillColor(C.subtle).fontSize(8).font("Helvetica")
          .text(sd, C3X, IR_Y + 43, { width: C3W, lineBreak: false })
      }

      /* Divider under info row */
      const IR_END = IR_Y + COL_H   // ~222
      hRule(doc, ML, IR_END, IW, C.lineDark, 0.7)

      /* ════════════════════════════════════════
         4. TABLE
      ════════════════════════════════════════ */
      const TB_Y = IR_END + 12

      /* ── Column x positions (all from ML) ── */
      // Description: ML → ML+240
      // HSN:         ML+248
      // QTY:         ML+316  (centred in ~50pt wide zone)
      // Unit Price:  ML+380
      // Amount:      ML+456
      const xD   = ML          // description start
      const xH   = ML + 248    // HSN/SAC
      const xQ   = ML + 318    // QTY center anchor
      const xQW  = 42          // QTY column width (for centering)
      const xU   = ML + 375    // Unit Price
      const xA   = ML + 455    // Amount

      /* Table header */
      const TH_H = 28
      fillRect(doc, ML, TB_Y, IW, TH_H, C.tableBg)
      hRule(doc, ML, TB_Y,        IW, C.lineDark, 0.6)
      hRule(doc, ML, TB_Y + TH_H, IW, C.lineDark, 0.6)

      const th_y = TB_Y + 9
      doc.fillColor(C.muted).fontSize(8).font("Helvetica-Bold")
        .text("DESCRIPTION", xD + 10, th_y, { lineBreak: false })
        .text("HSN / SAC",   xH,      th_y, { lineBreak: false })
        .text("QTY",         xQ,      th_y, { width: xQW, align: "center", lineBreak: false })
        .text("UNIT PRICE",  xU,      th_y, { lineBreak: false })
        .text("AMOUNT",      xA,      th_y, { lineBreak: false })

      /* Data row */
      const TR_H = 50
      const TR_Y = TB_Y + TH_H
      fillRect(doc, ML, TR_Y, IW, TR_H, C.white)
      hRule(doc, ML, TR_Y + TR_H, IW, C.line, 0.5)

      // Description + subtext
      doc.fillColor(C.text).fontSize(10.5).font("Helvetica-Bold")
        .text(data.service_name || "AC Service", xD + 10, TR_Y + 10, {
          width: 220, lineBreak: false,
        })
      doc.fillColor(C.muted).fontSize(8.5).font("Helvetica")
        .text(isProd ? "Product purchase" : "Professional AC Service",
          xD + 10, TR_Y + 27, { width: 220, lineBreak: false })

      // HSN code
      doc.fillColor(C.subtle).fontSize(9).font("Helvetica")
        .text("998719", xH, TR_Y + 20, { lineBreak: false })

      // QTY
      doc.fillColor(C.text).fontSize(10).font("Helvetica")
        .text("1", xQ, TR_Y + 20, { width: xQW, align: "center", lineBreak: false })

      // Unit price
      doc.fillColor(C.text).fontSize(9.5).font("Helvetica")
        .text(INR(base), xU, TR_Y + 20, { lineBreak: false })

      // Amount (bold)
      doc.fillColor(C.text).fontSize(9.5).font("Helvetica-Bold")
        .text(INR(base), xA, TR_Y + 20, { lineBreak: false })

      /* ════════════════════════════════════════
         5. PAYMENT  +  TOTALS
         Left  (ML → ML+258):  payment method + verified
         Right (ML+275 → MR):  subtotal / GST / total
      ════════════════════════════════════════ */
      const S5_Y = TR_Y + TR_H + 20
      const PM_W = 252     // payment block width
      const GAP  = 18      // gap between blocks
      const TOT_X = ML + PM_W + GAP
      const TOT_W = IW - PM_W - GAP   // ~237

      /* ── Payment method ── */
      fieldLabel(doc, "Payment Method", ML, S5_Y, C.muted)

      /* Badge */
      const badgeCol = meth === "cash" ? C.green : meth === "upi" ? C.teal : C.blue
      fillRRect(doc, ML, S5_Y + 14, 52, 30, 5, badgeCol)
      doc.fillColor(C.white).fontSize(9).font("Helvetica-Bold")
        .text(methodTag(meth), ML, S5_Y + 22, { width: 52, align: "center", lineBreak: false })

      /* Method name */
      doc.fillColor(C.text).fontSize(11).font("Helvetica-Bold")
        .text(methodLabel(meth), ML + 60, S5_Y + 20, { lineBreak: false })

      /* Detail sub-line */
      let detail = ""
      if (meth === "card" && data.payment_last4)
        detail = `Card ending  ....  ${data.payment_last4}`
      else if (meth === "upi" && data.payment_vpa)
        detail = `UPI: ${data.payment_vpa}`
      else if (meth === "netbanking" && data.payment_bank)
        detail = `Bank: ${data.payment_bank}`
      else if (meth === "cash")
        detail = "Paid to technician"
      else if (meth === "wallet")
        detail = "Digital wallet"
      if (detail) {
        doc.fillColor(C.muted).fontSize(8.5).font("Helvetica")
          .text(detail, ML + 60, S5_Y + 34, { width: PM_W - 64, lineBreak: false })
      }

      /* Verified banner */
      const V_Y = S5_Y + 56
      const V_H = 28
      fillRRect(doc, ML, V_Y, PM_W, V_H, 7, C.greenLight, C.greenBdr, 0.8)
      doc.circle(ML + 16, V_Y + V_H / 2, 5.5).fill(C.green)
      const verTxt = meth === "card" && data.payment_last4
        ? `Paid via CARD  **** ${data.payment_last4}`
        : meth === "upi"  ? "Paid via UPI"
        : meth === "cash" ? "Paid in Cash"
        : "Payment Confirmed"
      doc.fillColor(C.green).fontSize(9).font("Helvetica-Bold")
        .text(`verified   ${verTxt}`, ML + 28, V_Y + 9, {
          width: PM_W - 36, lineBreak: false,
        })

      /* ── Totals block ── */
      const T_LINE_H = 26  // height per row

      // Subtotal
      const TL1_Y = S5_Y + 8
      doc.fillColor(C.muted).fontSize(9).font("Helvetica")
        .text("Subtotal",  TOT_X,             TL1_Y, { lineBreak: false })
        .text(INR(base),   TOT_X + TOT_W - 88, TL1_Y, { lineBreak: false })
      hRule(doc, TOT_X, TL1_Y + T_LINE_H, TOT_W, C.line, 0.5)

      // GST
      const TL2_Y = TL1_Y + T_LINE_H + 6
      doc.fillColor(C.muted).fontSize(9).font("Helvetica")
        .text("GST (18%)", TOT_X,             TL2_Y, { lineBreak: false })
        .text(INR(gst),    TOT_X + TOT_W - 88, TL2_Y, { lineBreak: false })
      hRule(doc, TOT_X, TL2_Y + T_LINE_H, TOT_W, C.line, 0.5)

      // Total paid bar
      const TL3_Y = TL2_Y + T_LINE_H + 6
      const TL3_H = 40
      fillRRect(doc, TOT_X, TL3_Y, TOT_W, TL3_H, 8, C.navy)
      doc.fillColor(C.white).fontSize(9.5).font("Helvetica-Bold")
        .text("TOTAL PAID", TOT_X + 14, TL3_Y + 12, { lineBreak: false })
      doc.fillColor(C.white).fontSize(14).font("Helvetica-Bold")
        .text(INR(total), TOT_X + TOT_W - 100, TL3_Y + 11, { lineBreak: false })

      /* ════════════════════════════════════════
         6. DIVIDER
      ════════════════════════════════════════ */
      // Bottom of this section = max of left and right columns
      const S5_END = Math.max(V_Y + V_H, TL3_Y + TL3_H) + 22
      hRule(doc, ML, S5_END, IW, C.lineDark, 0.7)

      /* ════════════════════════════════════════
         7. THANK YOU
      ════════════════════════════════════════ */
      const TY_Y = S5_END + 14

      doc.fillColor(C.navy).fontSize(12).font("Helvetica-Bold")
        .text("Thank you for choosing Metro Cool!", ML, TY_Y, { lineBreak: false })

      /* Stars */
      doc.fillColor(C.amber).fontSize(13).font("Helvetica-Bold")
        .text("* * * * *", ML, TY_Y + 1, { width: IW, align: "right", lineBreak: false })

      doc.fillColor(C.muted).fontSize(8.5).font("Helvetica")
        .text(
          "We appreciate your trust. For support or future bookings: www.metro-cool.com",
          ML, TY_Y + 17, { width: IW * 0.70, lineBreak: false }
        )

      /* Payment ref */
      const pidTxt = String(data.payment_id).length > 36
        ? String(data.payment_id).slice(0, 36) + "..." : String(data.payment_id)
      doc.fillColor(C.subtle).fontSize(7.5).font("Helvetica")
        .text(`Payment Ref: ${pidTxt}`, ML, TY_Y + 34, { lineBreak: false })

      /* ════════════════════════════════════════
         8. FOOTER DIVIDER
      ════════════════════════════════════════ */
      const FD_Y = TY_Y + 56
      hRule(doc, ML, FD_Y, IW, C.lineDark, 0.7)

      /* ════════════════════════════════════════
         9. FOOTER
      ════════════════════════════════════════ */
      const FY = FD_Y + 14

      /* Left — company block */
      doc.fillColor(C.navy).fontSize(10).font("Helvetica-Bold")
        .text("Metro Cool", ML, FY, { lineBreak: false })
      doc.fillColor(C.muted).fontSize(8.5).font("Helvetica")
        .text("AC Repair & Maintenance Services", ML, FY + 14, { lineBreak: false })
      doc.fillColor(C.teal).fontSize(8.5).font("Helvetica")
        .text("www.metro-cool.com  |  support@metro-cool.com", ML, FY + 27, { lineBreak: false })

      /* Right — terms */
      const FTX = ML + IW * 0.44
      const FTW = IW * 0.56
      doc.fillColor(C.muted).fontSize(8).font("Helvetica")
        .text(
          "- Computer-generated invoice, no signature required.\n" +
          "- Disputes: email support@metro-cool.com within 7 days.\n",
          FTX, FY, { width: FTW, lineGap: 3.5 }
        )

      /* ════════════════════════════════════════
         10. GENERATED-ON LINE
      ════════════════════════════════════════ */
      const GY = FY + 52
      hRule(doc, ML, GY, IW, C.line, 0.5)
      doc.fillColor(C.subtle).fontSize(7).font("Helvetica")
        .text(
          "Metro Cool Services  |  AC Repair & Maintenance  |  support@metro-cool.com  |  www.metro-cool.com",
          ML, GY + 8, { width: IW, align: "center", lineBreak: false }
        )
        .text(
          `Generated on ${fDate(new Date())}  |  Page 1 of 1`,
          ML, GY + 20, { width: IW, align: "center", lineBreak: false }
        )

      /* Bottom navy bar */
      fillRect(doc, 0, H - 6, W, 6, C.navy)

      doc.end()
      stream.on("finish", () => resolve(filePath))
      stream.on("error", reject)

    } catch (err: any) {
      console.error("[generateInvoice] crash:", err?.message, err?.stack)
      reject(err)
    }
  })
}
