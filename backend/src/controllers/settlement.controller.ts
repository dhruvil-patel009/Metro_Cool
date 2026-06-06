import { Request, Response } from "express"
import { supabase } from "../utils/supabase.js"
import { transporter } from "../utils/mailer.js"
import ExcelJS from "exceljs"

const formatINR = (v: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(v)

/* =========================================================
   Build settlement rows — optionally filter to today only
========================================================= */
const buildSettlements = async (todayOnly = false) => {
  let query = supabase
    .from("payments")
    .select(`
      id,
      amount,
      status,
      payout_status,
      created_at,
      booking_id,
      closure_otp
    `)
    .eq("status", "captured")
    .order("created_at", { ascending: false })

  if (todayOnly) {
    const today = new Date().toLocaleDateString("en-CA") // YYYY-MM-DD
    query = query.gte("created_at", `${today}T00:00:00`).lte("created_at", `${today}T23:59:59`)
  }

  const { data: payments, error } = await query
  if (error) throw error
  if (!payments?.length) return []

  const settlements = []

  for (const payment of payments) {
    // Fetch booking + service title
    const { data: booking } = await supabase
      .from("bookings")
      .select("*, services(title)")
      .eq("id", payment.booking_id)
      .maybeSingle()

    // Fetch technician profile
    let technicianName = "Unassigned"
    let technicianId = null

    if (booking?.technician_id) {
      technicianId = booking.technician_id
      const { data: tech } = await supabase
        .from("profiles")
        .select("first_name, last_name")
        .eq("id", booking.technician_id)
        .maybeSingle()

      if (tech) {
        technicianName = `${tech.first_name} ${tech.last_name}`.trim()
      }
    }

    const price = Number(payment.amount)
    const commission = +(price * 0.2).toFixed(2)
    const payable = +(price - commission).toFixed(2)

    const dateStr = booking?.completed_at || payment.created_at
    settlements.push({
      id: payment.id,
      bookingId: payment.booking_id,
      technician: {
        name: technicianName,
        techId: technicianId,
      },
      service: {
        name: (booking as any)?.services?.title || "AC Service",
        category: "Service",
      },
      dateTime: {
        date: new Date(dateStr).toLocaleDateString("en-IN"),
        time: new Date(dateStr).toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
      price,
      commission,
      payable,
      status: payment.payout_status === "paid" ? "Paid" : "Pending",
    })
  }

  return settlements
}

/* =========================================================
   GET settlements (table data)
========================================================= */
export const getSettlements = async (req: Request, res: Response) => {
  try {
    const settlements = await buildSettlements(false)
    res.setHeader("Cache-Control", "no-store")
    res.json({ settlements })
  } catch (err) {
    console.error("SETTLEMENT ERROR:", err)
    res.status(500).json({ error: "Failed to load settlements" })
  }
}

/* =========================================================
   MARK ONE PAID
========================================================= */
export const markPaid = async (req: Request, res: Response) => {
  const { paymentId } = req.params

  const { error } = await supabase
    .from("payments")
    .update({ payout_status: "paid" })
    .eq("id", paymentId)

  if (error) return res.status(500).json({ error: "Failed to update" })
  res.json({ success: true })
}

/* =========================================================
   MARK ALL PAID
========================================================= */
export const markAllPaid = async (_: Request, res: Response) => {
  const { error } = await supabase
    .from("payments")
    .update({ payout_status: "paid" })
    .eq("status", "captured")
    .eq("payout_status", "pending")

  if (error) return res.status(500).json({ error: "Failed to update" })
  res.json({ success: true })
}

/* =========================================================
   BUILD EXCEL WORKBOOK (reusable)
========================================================= */
const buildExcelWorkbook = async (settlements: any[], reportDate: string) => {
  const workbook = new ExcelJS.Workbook()
  workbook.creator = "Metro Cool"
  workbook.created = new Date()

  const sheet = workbook.addWorksheet("Settlements", {
    pageSetup: { fitToPage: true, orientation: "landscape" },
  })

  // Title row
  sheet.mergeCells("A1:H1")
  const titleCell = sheet.getCell("A1")
  titleCell.value = `Metro Cool — Daily Settlement Report (${reportDate})`
  titleCell.font = { bold: true, size: 14, color: { argb: "FF1E3A5F" } }
  titleCell.alignment = { horizontal: "center" }
  titleCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFE8F0FE" } }
  sheet.getRow(1).height = 28

  // Empty row
  sheet.addRow([])

  // Header row
  const headerRow = sheet.addRow([
    "Booking ID", "Technician", "Service", "Date", "Time",
    "Price (₹)", "Commission 20% (₹)", "Payable (₹)", "Status",
  ])
  headerRow.eachCell(cell => {
    cell.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 11 }
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF2563EB" } }
    cell.alignment = { horizontal: "center", vertical: "middle" }
    cell.border = {
      bottom: { style: "thin", color: { argb: "FF1D4ED8" } },
    }
  })
  headerRow.height = 22

  // Columns width
  sheet.columns = [
    { key: "bookingId",   width: 22 },
    { key: "technician",  width: 22 },
    { key: "service",     width: 24 },
    { key: "date",        width: 14 },
    { key: "time",        width: 12 },
    { key: "price",       width: 14 },
    { key: "commission",  width: 18 },
    { key: "payable",     width: 14 },
    { key: "status",      width: 12 },
  ]

  // Data rows
  settlements.forEach((s, i) => {
    const row = sheet.addRow([
      `#${String(s.bookingId).slice(0, 8).toUpperCase()}`,
      s.technician.name,
      s.service.name,
      s.dateTime.date,
      s.dateTime.time,
      s.price,
      s.commission,
      s.payable,
      s.status,
    ])

    const isEven = i % 2 === 0
    row.eachCell((cell, colNo) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: isEven ? "FFF8FAFF" : "FFFFFFFF" },
      }
      cell.alignment = { horizontal: colNo >= 6 ? "right" : "left", vertical: "middle" }
      if (s.status === "Paid") {
        if (colNo === 9) {
          cell.font = { color: { argb: "FF16A34A" }, bold: true }
        }
      } else {
        if (colNo === 9) {
          cell.font = { color: { argb: "FFD97706" }, bold: true }
        }
      }
    })
    row.height = 20
  })

  // Summary rows
  sheet.addRow([])
  const totalPrice = settlements.reduce((s, r) => s + r.price, 0)
  const totalComm = settlements.reduce((s, r) => s + r.commission, 0)
  const totalPayable = settlements.reduce((s, r) => s + r.payable, 0)

  const summaryRow = sheet.addRow([
    "TOTAL", "", "", "", "",
    totalPrice, totalComm, totalPayable, "",
  ])
  summaryRow.eachCell(cell => {
    cell.font = { bold: true, size: 11 }
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFDBEAFE" } }
    cell.alignment = { horizontal: "right" }
  })
  summaryRow.getCell(1).alignment = { horizontal: "left" }

  return workbook
}

/* =========================================================
   EXCEL DOWNLOAD
========================================================= */
export const downloadSettlementReport = async (req: Request, res: Response) => {
  try {
    const settlements = await buildSettlements(false)
    const reportDate = new Date().toLocaleDateString("en-IN", {
      day: "numeric", month: "long", year: "numeric",
    })
    const workbook = await buildExcelWorkbook(settlements, reportDate)

    const fileName = `settlements-${new Date().toLocaleDateString("en-CA")}.xlsx`
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`)

    await workbook.xlsx.write(res)
    res.end()
  } catch (err) {
    console.error("Excel download error:", err)
    res.status(500).json({ error: "Failed to generate report" })
  }
}

/* =========================================================
   EMAIL REPORT — send today's settlement with Excel attachment
========================================================= */
export const emailSettlementReport = async (req: Request, res: Response) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ error: "Email address is required" })
    }

    // Today only for email
    const settlements = await buildSettlements(true)

    const reportDate = new Date().toLocaleDateString("en-IN", {
      weekday: "long", day: "numeric", month: "long", year: "numeric",
    })

    const totalRevenue = settlements.reduce((s, r) => s + r.price, 0)
    const totalPayable = settlements.reduce((s, r) => s + r.payable, 0)
    const totalCommission = settlements.reduce((s, r) => s + r.commission, 0)
    const pendingCount = settlements.filter(s => s.status === "Pending").length

    // Build Excel buffer for attachment
    const workbook = await buildExcelWorkbook(
      settlements,
      new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
    )
    const excelBuffer = await workbook.xlsx.writeBuffer()

    // Build HTML table rows
    const tableRows = settlements.map((s, i) => `
      <tr style="background:${i % 2 === 0 ? "#f8faff" : "#ffffff"}">
        <td style="padding:10px 14px;font-family:monospace;color:#2563eb;font-size:12px">#${String(s.bookingId).slice(0, 8).toUpperCase()}</td>
        <td style="padding:10px 14px;font-size:13px">${s.technician.name}</td>
        <td style="padding:10px 14px;font-size:13px">${s.service.name}</td>
        <td style="padding:10px 14px;font-size:13px">${s.dateTime.date}</td>
        <td style="padding:10px 14px;font-size:13px;text-align:right">${formatINR(s.price)}</td>
        <td style="padding:10px 14px;font-size:13px;text-align:right;color:#dc2626">-${formatINR(s.commission)}</td>
        <td style="padding:10px 14px;font-size:13px;text-align:right;font-weight:700">${formatINR(s.payable)}</td>
        <td style="padding:10px 14px;font-size:12px;text-align:center">
          <span style="background:${s.status === "Paid" ? "#dcfce7" : "#fef9c3"};color:${s.status === "Paid" ? "#16a34a" : "#d97706"};padding:3px 10px;border-radius:999px;font-size:11px;font-weight:600">
            ${s.status}
          </span>
        </td>
      </tr>
    `).join("")

    const html = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:Arial,Helvetica,sans-serif">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 0">
    <tr><td align="center">
      <table width="680" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08)">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#1e40af,#2563eb);padding:28px 32px">
            <table width="100%"><tr>
              <td>
                <p style="color:#bfdbfe;font-size:12px;margin:0 0 4px">Daily Settlement Report</p>
                <h1 style="color:#ffffff;font-size:22px;margin:0;font-weight:700">Metro Cool</h1>
              </td>
              <td align="right">
                <p style="color:#bfdbfe;font-size:12px;margin:0">${reportDate}</p>
                <p style="color:#ffffff;font-size:13px;font-weight:600;margin:4px 0 0">Auto-generated at 8:00 PM</p>
              </td>
            </tr></table>
          </td>
        </tr>

        <!-- Summary Cards -->
        <tr>
          <td style="padding:24px 32px 0">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td width="25%" style="padding-right:10px">
                  <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:12px;padding:16px;text-align:center">
                    <p style="font-size:11px;color:#6b7280;margin:0 0 6px;font-weight:600;text-transform:uppercase;letter-spacing:.5px">Total Jobs</p>
                    <p style="font-size:28px;font-weight:800;color:#1e40af;margin:0">${settlements.length}</p>
                  </div>
                </td>
                <td width="25%" style="padding-right:10px">
                  <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:16px;text-align:center">
                    <p style="font-size:11px;color:#6b7280;margin:0 0 6px;font-weight:600;text-transform:uppercase;letter-spacing:.5px">Revenue</p>
                    <p style="font-size:20px;font-weight:800;color:#16a34a;margin:0">${formatINR(totalRevenue)}</p>
                  </div>
                </td>
                <td width="25%" style="padding-right:10px">
                  <div style="background:#faf5ff;border:1px solid #e9d5ff;border-radius:12px;padding:16px;text-align:center">
                    <p style="font-size:11px;color:#6b7280;margin:0 0 6px;font-weight:600;text-transform:uppercase;letter-spacing:.5px">Commission</p>
                    <p style="font-size:20px;font-weight:800;color:#7c3aed;margin:0">${formatINR(totalCommission)}</p>
                  </div>
                </td>
                <td width="25%">
                  <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:12px;padding:16px;text-align:center">
                    <p style="font-size:11px;color:#6b7280;margin:0 0 6px;font-weight:600;text-transform:uppercase;letter-spacing:.5px">Payable</p>
                    <p style="font-size:20px;font-weight:800;color:#ea580c;margin:0">${formatINR(totalPayable)}</p>
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        ${pendingCount > 0 ? `
        <!-- Alert -->
        <tr>
          <td style="padding:16px 32px 0">
            <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:10px;padding:12px 16px;display:flex;align-items:center">
              <span style="font-size:18px;margin-right:10px">⚠️</span>
              <p style="margin:0;font-size:13px;color:#92400e"><strong>${pendingCount} payout${pendingCount > 1 ? "s" : ""} pending</strong> — please review and mark as paid in the admin panel.</p>
            </div>
          </td>
        </tr>` : `
        <tr>
          <td style="padding:16px 32px 0">
            <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:12px 16px">
              <p style="margin:0;font-size:13px;color:#166534">✅ All ${settlements.length} payouts are settled for today.</p>
            </div>
          </td>
        </tr>`}

        <!-- Table -->
        <tr>
          <td style="padding:24px 32px">
            ${settlements.length === 0 ? `
              <div style="text-align:center;padding:40px 0;color:#9ca3af">
                <p style="font-size:32px;margin:0">📋</p>
                <p style="margin:8px 0 0;font-size:14px">No settlements recorded for today.</p>
              </div>
            ` : `
            <p style="font-size:13px;font-weight:600;color:#374151;margin:0 0 12px">Settlement Breakdown</p>
            <div style="overflow-x:auto;border-radius:10px;border:1px solid #e5e7eb">
              <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse">
                <thead>
                  <tr style="background:#1e40af">
                    <th style="padding:10px 14px;text-align:left;font-size:11px;font-weight:600;color:#bfdbfe;text-transform:uppercase;letter-spacing:.5px;white-space:nowrap">Booking</th>
                    <th style="padding:10px 14px;text-align:left;font-size:11px;font-weight:600;color:#bfdbfe;text-transform:uppercase;letter-spacing:.5px">Technician</th>
                    <th style="padding:10px 14px;text-align:left;font-size:11px;font-weight:600;color:#bfdbfe;text-transform:uppercase;letter-spacing:.5px">Service</th>
                    <th style="padding:10px 14px;text-align:left;font-size:11px;font-weight:600;color:#bfdbfe;text-transform:uppercase;letter-spacing:.5px">Date</th>
                    <th style="padding:10px 14px;text-align:right;font-size:11px;font-weight:600;color:#bfdbfe;text-transform:uppercase;letter-spacing:.5px">Price</th>
                    <th style="padding:10px 14px;text-align:right;font-size:11px;font-weight:600;color:#bfdbfe;text-transform:uppercase;letter-spacing:.5px">Comm.</th>
                    <th style="padding:10px 14px;text-align:right;font-size:11px;font-weight:600;color:#bfdbfe;text-transform:uppercase;letter-spacing:.5px">Payable</th>
                    <th style="padding:10px 14px;text-align:center;font-size:11px;font-weight:600;color:#bfdbfe;text-transform:uppercase;letter-spacing:.5px">Status</th>
                  </tr>
                </thead>
                <tbody>
                  ${tableRows}
                  <!-- Total row -->
                  <tr style="background:#dbeafe">
                    <td colspan="4" style="padding:12px 14px;font-weight:700;font-size:13px;color:#1e40af">TOTAL</td>
                    <td style="padding:12px 14px;text-align:right;font-weight:700;font-size:13px;color:#1e40af">${formatINR(totalRevenue)}</td>
                    <td style="padding:12px 14px;text-align:right;font-weight:700;font-size:13px;color:#7c3aed">-${formatINR(totalCommission)}</td>
                    <td style="padding:12px 14px;text-align:right;font-weight:700;font-size:13px;color:#16a34a">${formatINR(totalPayable)}</td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
            `}
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f8fafc;border-top:1px solid #e5e7eb;padding:20px 32px;text-align:center">
            <p style="font-size:12px;color:#9ca3af;margin:0">Metro Cool Admin System &nbsp;·&nbsp; Auto-generated report &nbsp;·&nbsp; Do not reply to this email</p>
            <p style="font-size:11px;color:#d1d5db;margin:6px 0 0">© ${new Date().getFullYear()} Metro Cool. All rights reserved.</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>

</body>
</html>`

    await transporter.sendMail({
      from: `"Metro Cool Admin" <${process.env.MAIL_USER}>`,
      to: email,
      subject: `Daily Settlement Report — ${new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}`,
      html,
      attachments: [
        {
          filename: `settlement-${new Date().toLocaleDateString("en-CA")}.xlsx`,
          content: Buffer.from(excelBuffer),
          contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        },
      ],
    })

    res.json({ success: true, message: `Report sent to ${email}` })
  } catch (err) {
    console.error("Settlement email error:", err)
    res.status(500).json({ error: "Failed to send settlement email" })
  }
}
