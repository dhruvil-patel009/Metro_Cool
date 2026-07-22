import PDFDocument from "pdfkit"
import fs from "fs"
import path from "path"
import os from "os"
import { fileURLToPath } from "url"
import sharp from "sharp"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/* ─── PALETTE ─────────────────────────────────────────── */
const C = {
  navy:       "#0D2137",
  blue:       "#1B4F8A",
  headerBg:   "#EBF3FF",
  teal:       "#0D9488",
  tealLight:  "#CCFBF1",
  tealBdr:    "#5EEAD4",
  green:      "#16A34A",
  greenLight: "#F0FDF4",
  greenBdr:   "#86EFAC",
  text:       "#1E293B",
  muted:      "#64748B",
  subtle:     "#94A3B8",
  tableBg:    "#F1F5F9",
  line:       "#E2E8F0",
  lineDark:   "#CBD5E1",
  white:      "#FFFFFF",
  amber:      "#F59E0B",
}

/* ─── LOGO ─────────────────────────────────────────────── */
let _logoBuf: Buffer | null = null

async function getLogoPng(): Promise<Buffer | null> {
  if (_logoBuf) return _logoBuf
  const candidates = [
    path.join(__dirname, "logo.png"),
    path.join(__dirname, "..", "..", "logo.png"),
    path.join(__dirname, "..", "..", "..", "logo.png"),
    path.join(process.cwd(), "logo.png"),
    path.join(process.cwd(), "..", "logo.png"),
    path.join(process.cwd(), "dist", "utils", "logo.png"),
    path.join(process.cwd(), "src",  "utils", "logo.png"),
    path.join(process.cwd(), "..", "frontend", "public", "assets", "logo.svg"),
    path.join(process.cwd(), "..", "frontend", "public", "assets", "logo.png"),
  ]
  for (const p of candidates) {
    if (!fs.existsSync(p)) continue
    try {
      _logoBuf = await sharp(fs.readFileSync(p))
        .resize(140, 140, { fit: "contain", background: { r:255, g:255, b:255, alpha:1 } })
        .flatten({ background: { r:255, g:255, b:255 } })
        .png().toBuffer()
      return _logoBuf
    } catch (_) {}
  }
  return null
}

/* ─── FORMATTERS ───────────────────────────────────────── */
const INR = (v: number) =>
  `Rs. ${new Intl.NumberFormat("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(v)}`

const fDate = (d: Date) =>
  d.toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })

const methodLabel = (m: string): string =>
  ({ upi:"UPI Payment", card:"Card Payment", netbanking:"Net Banking",
     wallet:"Wallet", cash:"Cash", emi:"EMI" }[(m||"").toLowerCase()] ?? "Online Payment")

const methodTag = (m: string): string =>
  ({ upi:"UPI", card:"CARD", netbanking:"NB",
     wallet:"WLT", cash:"CASH", emi:"EMI" }[(m||"").toLowerCase()] ?? "PAY")

/* ─── INTERFACE ────────────────────────────────────────── */
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

/* ─── DRAWING HELPERS ──────────────────────────────────── */
type Doc = PDFKit.PDFDocument

const hRule = (doc: Doc, x: number, y: number, w: number, color = C.line, lw = 0.5) =>
  doc.save().moveTo(x,y).lineTo(x+w,y).strokeColor(color).lineWidth(lw).stroke().restore()

const vRule = (doc: Doc, x: number, y1: number, y2: number, color = C.lineDark) =>
  doc.save().moveTo(x,y1).lineTo(x,y2).strokeColor(color).lineWidth(0.5).stroke().restore()

const fillRect = (doc: Doc, x: number, y: number, w: number, h: number, color: string) =>
  doc.rect(x,y,w,h).fill(color)

const fillRRect = (doc: Doc, x: number, y: number, w: number, h: number,
  r: number, fill: string, stroke?: string, sw = 0.9) => {
  doc.roundedRect(x,y,w,h,r)
  stroke ? doc.lineWidth(sw).fillAndStroke(fill, stroke) : doc.fill(fill)
}

const label = (doc: Doc, txt: string, x: number, y: number, color = C.subtle) =>
  doc.fillColor(color).fontSize(6.5).font("Helvetica-Bold")
     .text(txt.toUpperCase(), x, y, { characterSpacing: 0.9, lineBreak: false })

/* ─── MAIN ─────────────────────────────────────────────── */
export const generateInvoice = async (data: InvoiceData): Promise<string> => {
  const logoBuf = await getLogoPng()

  return new Promise<string>((resolve, reject) => {
    try {
      const dir = path.join(os.tmpdir(), "metro-cool-invoices")
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
      const filePath = path.join(dir, `invoice_${data.booking_id}.pdf`)

      const doc = new PDFDocument({ size: "A4", margin: 0,
        info: { Title: `Invoice INV-${data.booking_id.slice(0,8).toUpperCase()}`,
                Author: "Metro Cool", Subject: "Service Invoice" },
      })
      const stream = fs.createWriteStream(filePath)
      doc.pipe(stream)

      /* ── Constants ── */
      const W  = 595
      const H  = 842
      const ML = 44           // left margin
      const MR = 44           // right margin
      const IW = W - ML - MR  // 507 usable width

      /* ── Data ── */
      const total   = Number(data.amount)
      const base    = +(total / 1.18).toFixed(2)
      const gst     = +(total - base).toFixed(2)
      const meth    = (data.payment_method || "card").toLowerCase()
      const invNo   = `INV-${data.booking_id.slice(0,8).toUpperCase()}`
      const isProd  = data.service_type === "product"
      const invDate = data.payment_date ? fDate(new Date(data.payment_date)) : fDate(new Date())

      /* ════════════════════════════════════════
         SECTION 1 — PAGE BACKGROUND + TOP BAR
      ════════════════════════════════════════ */
      fillRect(doc, 0, 0, W, H, C.white)
      fillRect(doc, 0, 0, W, 5, C.navy)   // top accent bar

      /* ════════════════════════════════════════
         SECTION 2 — HEADER BAND  y: 5 → 145
         Left half: logo + company info
         Right half: INVOICE title + meta
      ════════════════════════════════════════ */
      const HDR_Y = 5
      const HDR_H = 140
      fillRect(doc, 0, HDR_Y, W, HDR_H, C.headerBg)

      // --- Logo (44, 18) size 72x72 ---
      const LX = ML, LY = 18, LS = 72
      fillRRect(doc, LX-3, LY-3, LS+6, LS+6, 9, C.white, C.lineDark, 0.7)
      if (logoBuf) {
        try { doc.image(logoBuf, LX, LY, { width: LS, height: LS }) }
        catch (_) {
          fillRRect(doc, LX, LY, LS, LS, 8, C.blue)
          doc.fillColor(C.white).fontSize(22).font("Helvetica-Bold").text("MC", LX+14, LY+22)
        }
      } else {
        fillRRect(doc, LX, LY, LS, LS, 8, C.blue)
        doc.fillColor(C.white).fontSize(22).font("Helvetica-Bold").text("MC", LX+14, LY+22)
      }

      // --- Company text block (right of logo) ---
      // Left zone: ML → W/2-10  |  Right zone: W/2+10 → W-MR
      const TX  = LX + LS + 14    // company text left edge  (~130)
      const TXW = W/2 - 20 - TX   // max width for company text block (~168)

      doc.fillColor(C.navy).fontSize(17).font("Helvetica-Bold")
         .text("METRO COOL", TX, LY + 2, { width: TXW, lineBreak: false })
      doc.fillColor(C.subtle).fontSize(7.5).font("Helvetica")
         .text("Powered by Comfoty HVAC Solutions", TX, LY + 23, { width: TXW, lineBreak: false })
      doc.fillColor(C.muted).fontSize(8).font("Helvetica")
         .text("AC Repair & Maintenance Services", TX, LY + 35, { width: TXW, lineBreak: false })
      doc.fillColor(C.subtle).fontSize(7).font("Helvetica")
         .text("www.metro-cool.com", TX, LY + 47, { width: TXW, lineBreak: false })
      doc.fillColor(C.subtle).fontSize(7).font("Helvetica")
         .text("metrocool.official@gmail.com", TX, LY + 57, { width: TXW, lineBreak: false })

      // --- Right zone: INVOICE + Invoice No + Date + PAID badge ---
      const RZX = Math.round(W / 2) + 10   // right zone left edge (~308)
      const RZW = W - MR - RZX             // right zone width (~243)

      // "INVOICE" title — right-aligned in right zone
      doc.fillColor(C.navy).fontSize(30).font("Helvetica-Bold")
         .text("INVOICE", RZX, LY + 2, { width: RZW, align: "right", lineBreak: false })

      // Invoice No — below title
      const META_Y = LY + 40
      doc.fillColor(C.muted).fontSize(8.5).font("Helvetica")
         .text("Invoice No:", RZX, META_Y, { lineBreak: false })
      doc.fillColor(C.navy).fontSize(8.5).font("Helvetica-Bold")
         .text(invNo, RZX + 58, META_Y, { lineBreak: false })

      // Date
      doc.fillColor(C.muted).fontSize(8.5).font("Helvetica")
         .text("Date:", RZX, META_Y + 14, { lineBreak: false })
      doc.fillColor(C.navy).fontSize(8.5).font("Helvetica-Bold")
         .text(invDate, RZX + 58, META_Y + 14, { lineBreak: false })

      // PAID badge — bottom-right of header band
      const BW = 58, BH = 20
      const BX = W - MR - BW
      const BY = META_Y + 34
      fillRRect(doc, BX, BY, BW, BH, 10, C.tealLight, C.teal, 1)
      doc.fillColor(C.teal).fontSize(9).font("Helvetica-Bold")
         .text("PAID", BX, BY + 5, { width: BW, align: "center", lineBreak: false })

      // Band bottom border
      const HDR_END = HDR_Y + HDR_H    // y = 145
      hRule(doc, 0, HDR_END, W, C.lineDark, 1)

      /* ════════════════════════════════════════
         SECTION 3 — INFO ROW  y: HDR_END+14
         Three equal columns, fixed height 100
         FROM | BILLED TO | SERVICE DETAILS
      ════════════════════════════════════════ */
      const IR_Y  = HDR_END + 14     // ~159
      const IR_H  = 100              // fixed — enough for all content
      const CW    = Math.floor(IW / 3)  // ~169 each

      // Column X edges
      const C1X = ML                    // 44
      const C2X = ML + CW + 14          // 227
      const C3X = ML + CW * 2 + 14      // 396
      const C3W = W - MR - C3X          // right col available width

      // Row background (very light)
      fillRect(doc, ML, IR_Y - 4, IW, IR_H + 8, "#F8FAFC")
      hRule(doc, ML, IR_Y - 4,   IW, C.line, 0.5)
      hRule(doc, ML, IR_Y + IR_H + 4, IW, C.lineDark, 0.8)

      // Vertical dividers
      vRule(doc, ML + CW,     IR_Y - 4, IR_Y + IR_H + 4)
      vRule(doc, ML + CW * 2, IR_Y - 4, IR_Y + IR_H + 4)

      /* — COL 1: FROM — */
      label(doc, "From", C1X, IR_Y)
      doc.fillColor(C.text).fontSize(10).font("Helvetica-Bold")
         .text("Metro Cool", C1X, IR_Y + 12, { width: CW - 14, lineBreak: false })
      doc.fillColor(C.subtle).fontSize(7.5).font("Helvetica")
         .text("Powered by Comfoty HVAC Solutions", C1X, IR_Y + 25, { width: CW - 14, lineBreak: false })
      doc.fillColor(C.muted).fontSize(7.5).font("Helvetica")
         .text("A-401, Suvas Oram, Opp. Hotel Safari,", C1X, IR_Y + 37, { width: CW - 14, lineBreak: false })
      doc.fillColor(C.muted).fontSize(7.5).font("Helvetica")
         .text("Odhav Ring Road, Odhav,", C1X, IR_Y + 48, { width: CW - 14, lineBreak: false })
      doc.fillColor(C.muted).fontSize(7.5).font("Helvetica")
         .text("Ahmedabad - 382415", C1X, IR_Y + 59, { width: CW - 14, lineBreak: false })
      doc.fillColor(C.text).fontSize(7.5).font("Helvetica-Bold")
         .text("GSTIN: 24AALFC4976A1ZK", C1X, IR_Y + 72, { width: CW - 14, lineBreak: false })

      /* — COL 2: BILLED TO — */
      label(doc, "Billed To", C2X, IR_Y)
      doc.fillColor(C.text).fontSize(10).font("Helvetica-Bold")
         .text(data.customer_name || "Customer", C2X, IR_Y + 12, { width: CW - 22, lineBreak: false })
      if (data.customer_phone) {
        doc.fillColor(C.teal).fontSize(9).font("Helvetica")
           .text(data.customer_phone, C2X, IR_Y + 27, { width: CW - 22, lineBreak: false })
      }

      /* — COL 3: SERVICE DETAILS — */
      label(doc, isProd ? "Product Details" : "Service Details", C3X, IR_Y)

      // Service name: allow wrapping within column, max 2 lines
      const svcName = data.service_name || "AC Service"
      doc.fillColor(C.text).fontSize(9.5).font("Helvetica-Bold")
         .text(svcName, C3X, IR_Y + 12, { width: C3W, lineBreak: false, ellipsis: true })

      // Measure how many lines the name took (approx 13pt per line)
      const svcNameLines = Math.ceil(
        doc.widthOfString(svcName) / (C3W || 1)
      )
      const subY = IR_Y + 12 + (svcNameLines > 1 ? 26 : 14)

      doc.fillColor(C.muted).fontSize(8).font("Helvetica")
         .text(isProd ? "Product Purchase" : "Professional AC Service",
               C3X, subY, { width: C3W, lineBreak: false })
      if (data.booking_date) {
        const sd = fDate(new Date(data.booking_date)) + (data.time_slot ? "  |  " + data.time_slot : "")
        doc.fillColor(C.subtle).fontSize(7.5).font("Helvetica")
           .text(sd, C3X, subY + 13, { width: C3W, lineBreak: false })
      }

      /* ════════════════════════════════════════
         SECTION 4 — ITEMS TABLE
         y starts after info row
      ════════════════════════════════════════ */
      const TB_Y = IR_Y + IR_H + 12   // ~275

      // Column X anchors
      const xDesc  = ML + 8          // description (left-pad 8)
      const xDescW = 195             // description column width — strict cap
      const xHSN   = ML + 212        // HSN/SAC
      const xQty   = ML + 300        // QTY
      const xQtyW  = 44
      const xUnit  = ML + 360        // Unit Price
      const xAmt   = ML + 450        // Amount

      // Header row
      const TH_H = 26
      fillRect(doc, ML, TB_Y, IW, TH_H, C.tableBg)
      hRule(doc, ML, TB_Y,        IW, C.lineDark, 0.6)
      hRule(doc, ML, TB_Y+TH_H,   IW, C.lineDark, 0.6)
      const th_y = TB_Y + 8
      doc.fillColor(C.muted).fontSize(7.5).font("Helvetica-Bold")
         .text("DESCRIPTION", xDesc,  th_y, { width: xDescW, lineBreak: false })
         .text("HSN / SAC",   xHSN,   th_y, { lineBreak: false })
         .text("QTY",         xQty,   th_y, { width: xQtyW, align: "center", lineBreak: false })
         .text("UNIT PRICE",  xUnit,  th_y, { lineBreak: false })
         .text("AMOUNT",      xAmt,   th_y, { lineBreak: false })

      // Data row — fixed height 52
      const TR_H = 52
      const TR_Y = TB_Y + TH_H
      fillRect(doc, ML, TR_Y, IW, TR_H, C.white)
      hRule(doc, ML, TR_Y + TR_H, IW, C.line, 0.5)

      // Description — strict width, allows 2-line wrap
      doc.fillColor(C.text).fontSize(9.5).font("Helvetica-Bold")
         .text(svcName, xDesc, TR_Y + 9, { width: xDescW, lineBreak: true, ellipsis: true })
      doc.fillColor(C.muted).fontSize(8).font("Helvetica")
         .text(isProd ? "Product purchase" : "Professional AC Service",
               xDesc, TR_Y + 35, { width: xDescW, lineBreak: false })

      // HSN — centred vertically
      doc.fillColor(C.subtle).fontSize(8.5).font("Helvetica")
         .text("998719", xHSN, TR_Y + 20, { lineBreak: false })

      // QTY
      doc.fillColor(C.text).fontSize(9.5).font("Helvetica")
         .text("1", xQty, TR_Y + 20, { width: xQtyW, align: "center", lineBreak: false })

      // Unit price
      doc.fillColor(C.text).fontSize(9).font("Helvetica")
         .text(INR(base), xUnit, TR_Y + 20, { lineBreak: false })

      // Amount (bold)
      doc.fillColor(C.text).fontSize(9).font("Helvetica-Bold")
         .text(INR(base), xAmt, TR_Y + 20, { lineBreak: false })

      /* ════════════════════════════════════════
         SECTION 5 — PAYMENT + TOTALS
         y starts after table
      ════════════════════════════════════════ */
      const S5_Y   = TR_Y + TR_H + 18     // ~383 (approx)
      const PM_W   = 248                  // payment block width
      const TOT_X  = ML + PM_W + 16       // totals block left
      const TOT_W  = IW - PM_W - 16       // ~243

      /* — Payment method label — */
      label(doc, "Payment Method", ML, S5_Y, C.muted)

      /* — Badge — */
      const badgeCol = meth === "cash" ? C.green : meth === "upi" ? C.teal : C.blue
      fillRRect(doc, ML, S5_Y + 14, 50, 28, 5, badgeCol)
      doc.fillColor(C.white).fontSize(8.5).font("Helvetica-Bold")
         .text(methodTag(meth), ML, S5_Y + 22, { width: 50, align: "center", lineBreak: false })

      /* — Method name + detail — */
      doc.fillColor(C.text).fontSize(10.5).font("Helvetica-Bold")
         .text(methodLabel(meth), ML + 58, S5_Y + 19, { lineBreak: false })

      let detail = ""
      if      (meth === "card"       && data.payment_last4) detail = `Card ending  ....  ${data.payment_last4}`
      else if (meth === "upi"        && data.payment_vpa)   detail = `UPI: ${data.payment_vpa}`
      else if (meth === "netbanking" && data.payment_bank)  detail = `Bank: ${data.payment_bank}`
      else if (meth === "cash")                              detail = "Paid to technician"
      else if (meth === "wallet")                            detail = "Digital wallet"
      if (detail) {
        doc.fillColor(C.muted).fontSize(8).font("Helvetica")
           .text(detail, ML + 58, S5_Y + 33, { width: PM_W - 62, lineBreak: false })
      }

      /* — Verified banner — */
      const V_Y = S5_Y + 52
      const V_H = 26
      fillRRect(doc, ML, V_Y, PM_W, V_H, 6, C.greenLight, C.greenBdr, 0.8)
      doc.circle(ML + 15, V_Y + V_H / 2, 5).fill(C.green)
      const verTxt =
        meth === "card" && data.payment_last4 ? `Paid via CARD  ****  ${data.payment_last4}` :
        meth === "upi"  ? "Paid via UPI" :
        meth === "cash" ? "Paid in Cash" : "Payment Confirmed"
      doc.fillColor(C.green).fontSize(8.5).font("Helvetica-Bold")
         .text(`  ${verTxt}`, ML + 26, V_Y + 8, { width: PM_W - 32, lineBreak: false })

      /* — Totals — */
      const T_ROW = 25   // height of each total row
      const TL1_Y = S5_Y + 8

      // Subtotal row
      doc.fillColor(C.muted).fontSize(9).font("Helvetica")
         .text("Subtotal", TOT_X, TL1_Y, { lineBreak: false })
      doc.fillColor(C.text).fontSize(9).font("Helvetica")
         .text(INR(base), TOT_X, TL1_Y, { width: TOT_W, align: "right", lineBreak: false })
      hRule(doc, TOT_X, TL1_Y + T_ROW, TOT_W, C.line, 0.5)

      // GST row
      const TL2_Y = TL1_Y + T_ROW + 6
      doc.fillColor(C.muted).fontSize(9).font("Helvetica")
         .text("GST (18%)", TOT_X, TL2_Y, { lineBreak: false })
      doc.fillColor(C.text).fontSize(9).font("Helvetica")
         .text(INR(gst), TOT_X, TL2_Y, { width: TOT_W, align: "right", lineBreak: false })
      hRule(doc, TOT_X, TL2_Y + T_ROW, TOT_W, C.line, 0.5)

      // Total paid bar
      const TL3_Y = TL2_Y + T_ROW + 8
      const TL3_H = 38
      fillRRect(doc, TOT_X, TL3_Y, TOT_W, TL3_H, 7, C.navy)
      doc.fillColor(C.white).fontSize(9).font("Helvetica-Bold")
         .text("TOTAL PAID", TOT_X + 12, TL3_Y + 12, { lineBreak: false })
      doc.fillColor(C.white).fontSize(13).font("Helvetica-Bold")
         .text(INR(total), TOT_X, TL3_Y + 11, { width: TOT_W - 12, align: "right", lineBreak: false })

      /* ════════════════════════════════════════
         SECTION 6 — DIVIDER
      ════════════════════════════════════════ */
      const S5_BOT = Math.max(V_Y + V_H, TL3_Y + TL3_H) + 20
      hRule(doc, ML, S5_BOT, IW, C.lineDark, 0.7)

      /* ════════════════════════════════════════
         SECTION 7 — THANK YOU
      ════════════════════════════════════════ */
      const TY_Y = S5_BOT + 12

      doc.fillColor(C.navy).fontSize(12).font("Helvetica-Bold")
         .text("Thank you for choosing Metro Cool!", ML, TY_Y, { lineBreak: false })
      doc.fillColor(C.amber).fontSize(12).font("Helvetica-Bold")
         .text("* * * * *", ML, TY_Y, { width: IW, align: "right", lineBreak: false })

      doc.fillColor(C.muted).fontSize(8.5).font("Helvetica")
         .text("We appreciate your trust. For support or future bookings: www.metro-cool.com",
               ML, TY_Y + 18, { width: IW * 0.72, lineBreak: false })

      const pidTxt = String(data.payment_id).length > 40
        ? String(data.payment_id).slice(0, 40) + "…" : String(data.payment_id)
      doc.fillColor(C.subtle).fontSize(7.5).font("Helvetica")
         .text(`Payment Ref: ${pidTxt}`, ML, TY_Y + 32, { lineBreak: false })

      /* ════════════════════════════════════════
         SECTION 8 — FOOTER DIVIDER
      ════════════════════════════════════════ */
      const FD_Y = TY_Y + 52
      hRule(doc, ML, FD_Y, IW, C.lineDark, 0.7)

      /* ════════════════════════════════════════
         SECTION 9 — FOOTER
         Left block: company info   ~46% width
         Right block: terms         ~54% width
      ════════════════════════════════════════ */
      const FY     = FD_Y + 12
      const FL_W   = Math.floor(IW * 0.44)   // left block width ~223
      const FR_X   = ML + FL_W + 18           // right block starts
      const FR_W   = IW - FL_W - 18           // right block width

      // Left — company
      doc.fillColor(C.navy).fontSize(9.5).font("Helvetica-Bold")
         .text("Metro Cool", ML, FY, { width: FL_W, lineBreak: false })
      doc.fillColor(C.subtle).fontSize(7.5).font("Helvetica")
         .text("Powered by Comfoty HVAC Solutions", ML, FY + 12, { width: FL_W, lineBreak: false })
      doc.fillColor(C.muted).fontSize(7.5).font("Helvetica")
         .text("A-401, Suvas Oram, Opp. Hotel Safari,", ML, FY + 23, { width: FL_W, lineBreak: false })
      doc.fillColor(C.muted).fontSize(7.5).font("Helvetica")
         .text("Odhav Ring Road, Odhav, Ahmedabad - 382415", ML, FY + 33, { width: FL_W, lineBreak: false })
      doc.fillColor(C.text).fontSize(7.5).font("Helvetica-Bold")
         .text("GSTIN: 24AALFC4976A1ZK", ML, FY + 44, { width: FL_W, lineBreak: false })
      doc.fillColor(C.muted).fontSize(7).font("Helvetica")
         .text("metrocool.official@gmail.com  |  www.metro-cool.com",
               ML, FY + 55, { width: FL_W, lineBreak: false })

      // Right — terms
      doc.fillColor(C.muted).fontSize(7.5).font("Helvetica")
         .text(
           "- Computer-generated invoice, no signature required.\n" +
           "- Disputes: email metrocool.official@gmail.com within 7 days.",
           FR_X, FY, { width: FR_W, lineGap: 5 }
         )

      /* ════════════════════════════════════════
         SECTION 10 — BOTTOM GENERATED LINE
      ════════════════════════════════════════ */
      const GY = FY + 72
      hRule(doc, ML, GY, IW, C.line, 0.5)
      doc.fillColor(C.subtle).fontSize(7).font("Helvetica")
         .text(
           "Metro Cool Services  |  AC Repair & Maintenance  |  metrocool.official@gmail.com  |  www.metro-cool.com",
           ML, GY + 8, { width: IW, align: "center", lineBreak: false }
         )
         .text(
           `Generated on ${fDate(new Date())}  |  Page 1 of 1`,
           ML, GY + 19, { width: IW, align: "center", lineBreak: false }
         )

      // Bottom navy bar
      fillRect(doc, 0, H - 5, W, 5, C.navy)

      doc.end()
      stream.on("finish", () => resolve(filePath))
      stream.on("error", reject)

    } catch (err: any) {
      console.error("[generateInvoice] crash:", err?.message, err?.stack)
      reject(err)
    }
  })
}
