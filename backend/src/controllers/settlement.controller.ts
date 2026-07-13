import { Request, Response } from "express"
import { supabase } from "../utils/supabase.js"
import { transporter } from "../utils/mailer.js"
import ExcelJS from "exceljs"
import { consumeReferralDiscount } from "./referral.controller.js"

const formatINR = (v: number) => {
  const formatted = new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(v)
  return `\u20B9${formatted}`
}

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
    // Use UTC+5:30 (IST) aware range to avoid missing records stored in UTC
    const now = new Date()
    // Start of today in IST → subtract IST offset to get UTC equivalent
    const istOffsetMs = 5.5 * 60 * 60 * 1000 // 5h 30m in ms
    const istNow = new Date(now.getTime() + istOffsetMs)
    const todayIST = istNow.toISOString().slice(0, 10) // YYYY-MM-DD in IST
    // Convert IST midnight/end-of-day back to UTC ISO strings
    const startUTC = new Date(`${todayIST}T00:00:00+05:30`).toISOString()
    const endUTC = new Date(`${todayIST}T23:59:59+05:30`).toISOString()
    query = query.gte("created_at", startUTC).lte("created_at", endUTC)
  }

  const { data: payments, error } = await query
  if (error) throw error
  if (!payments?.length) return []

  const settlements = []

  for (const payment of payments) {
    // Fetch booking + service title & commission config
    const { data: booking } = await supabase
      .from("bookings")
      .select("*, services(title, commission_type, commission_value)")
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

    // Per-service commission: read from the linked service record, fallback to 20%
    const serviceData = (booking as any)?.services
    const commissionType: string = serviceData?.commission_type || "percentage"
    const commissionValue: number = serviceData?.commission_value ?? 20
    let commission: number

    if (commissionType === "flat") {
      commission = +Math.min(commissionValue, price).toFixed(2)
    } else {
      // percentage (default)
      commission = +(price * (commissionValue / 100)).toFixed(2)
    }

    // ── Check for active referral/promo discount for this technician ──
    let promoDiscount = 0
    let promoCode: string | null = null
    let promoReferrerName: string | null = null

    if (technicianId) {
      // Get technician's promo_code used during registration
      const { data: techDetails } = await supabase
        .from("technician_details")
        .select("promo_code")
        .eq("id", technicianId)
        .maybeSingle()

      if (techDetails?.promo_code) {
        promoCode = techDetails.promo_code
      }

      // Check if this technician has active referral rewards (as referrer)
      const { data: activeRewards } = await supabase
        .from("referral_rewards")
        .select("id, reward_value, jobs_remaining, referral_code_id")
        .eq("referrer_id", technicianId)
        .eq("reward_status", "active")
        .gt("jobs_remaining", 0)
        .order("created_at", { ascending: true })
        .limit(1)

      if (activeRewards && activeRewards.length > 0) {
        const reward = activeRewards[0]
        // reward_value is the percentage discount on commission (e.g. 5 = 5% off commission)
        promoDiscount = +(commission * (Number(reward.reward_value) / 100)).toFixed(2)

        // Get the referral code text for display
        if (reward.referral_code_id) {
          const { data: refCode } = await supabase
            .from("referral_codes")
            .select("code, technician_id")
            .eq("id", reward.referral_code_id)
            .maybeSingle()

          if (refCode) {
            promoCode = refCode.code
            // Get the referrer's name
            const { data: referrerProfile } = await supabase
              .from("profiles")
              .select("first_name, last_name")
              .eq("id", refCode.technician_id)
              .maybeSingle()

            if (referrerProfile) {
              promoReferrerName = `${referrerProfile.first_name} ${referrerProfile.last_name}`.trim()
            }
          }
        }
      }
    }

    const effectiveCommission = +(commission - promoDiscount).toFixed(2)
    const payable = +(price - effectiveCommission).toFixed(2)

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
      commissionType,
      commissionValue,
      commission: effectiveCommission,
      originalCommission: commission,
      promoDiscount,
      promoCode,
      promoReferrerName,
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
   GET PROMO CODE SUMMARY — Admin view of all promo/referral activity
   Shows which technician used which promo, who referred them,
   and how much discount has been applied vs remaining
========================================================= */
export const getPromoCodeSummary = async (_req: Request, res: Response) => {
  try {
    // 1. Get all technicians who registered with a promo code
    const { data: techsWithPromo, error: techError } = await supabase
      .from("technician_details")
      .select(`
        id,
        promo_code,
        profiles!technician_details_id_fkey (
          first_name,
          last_name,
          phone
        )
      `)
      .not("promo_code", "is", null)

    if (techError) throw techError

    // 2. Get all referral rewards
    const { data: rewards, error: rewardsError } = await supabase
      .from("referral_rewards")
      .select(`
        id,
        referrer_id,
        referred_id,
        reward_value,
        reward_status,
        jobs_remaining,
        created_at,
        expires_at
      `)
      .order("created_at", { ascending: false })

    if (rewardsError) throw rewardsError

    // 3. Enrich with names
    const summary = []
    for (const reward of rewards || []) {
      const { data: referrer } = await supabase
        .from("profiles")
        .select("first_name, last_name, phone")
        .eq("id", reward.referrer_id)
        .maybeSingle()

      const { data: referred } = await supabase
        .from("profiles")
        .select("first_name, last_name, phone")
        .eq("id", reward.referred_id)
        .maybeSingle()

      // Get the promo code used by the referred technician
      const { data: referredTech } = await supabase
        .from("technician_details")
        .select("promo_code")
        .eq("id", reward.referred_id)
        .maybeSingle()

      summary.push({
        id: reward.id,
        referrer: {
          id: reward.referrer_id,
          name: referrer ? `${referrer.first_name} ${referrer.last_name}`.trim() : "Unknown",
          phone: referrer?.phone || "",
        },
        referred: {
          id: reward.referred_id,
          name: referred ? `${referred.first_name} ${referred.last_name}`.trim() : "Unknown",
          phone: referred?.phone || "",
          promoCodeUsed: referredTech?.promo_code || null,
        },
        discountPercent: reward.reward_value,
        status: reward.reward_status,
        jobsRemaining: reward.jobs_remaining,
        createdAt: reward.created_at,
        expiresAt: reward.expires_at,
      })
    }

    // 4. Calculate totals
    const activeRewards = summary.filter(s => s.status === "active")
    const usedRewards = summary.filter(s => s.status === "used")

    res.json({
      totalReferrals: summary.length,
      activeReferrals: activeRewards.length,
      usedReferrals: usedRewards.length,
      techniciansWithPromo: (techsWithPromo || []).map(t => ({
        id: t.id,
        name: (t as any).profiles ? `${(t as any).profiles.first_name} ${(t as any).profiles.last_name}`.trim() : "Unknown",
        phone: (t as any).profiles?.phone || "",
        promoCode: t.promo_code,
      })),
      referralRewards: summary,
    })
  } catch (err) {
    console.error("PROMO SUMMARY ERROR:", err)
    res.status(500).json({ error: "Failed to load promo code summary" })
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
      <tr style="background:${i % 2 === 0 ? "#f8faff" : "#ffffff"};border-bottom:1px solid #f1f5f9;">
        <td style="padding:11px 14px;">
          <span style="font-family:monospace;color:#2563eb;font-size:11px;
                       background:#eff6ff;padding:3px 8px;border-radius:6px;
                       font-weight:700;white-space:nowrap;">
            #${String(s.bookingId).slice(0, 8).toUpperCase()}
          </span>
        </td>
        <td style="padding:11px 14px;font-size:13px;font-weight:600;color:#111827;
                   white-space:nowrap;">${s.technician.name}</td>
        <td style="padding:11px 14px;font-size:12px;color:#374151;">${s.service.name}</td>
        <td style="padding:11px 14px;font-size:12px;color:#6b7280;
                   white-space:nowrap;">${s.dateTime.date}</td>
        <td style="padding:11px 14px;font-size:13px;text-align:right;
                   font-weight:600;color:#111827;">${formatINR(s.price)}</td>
        <td style="padding:11px 14px;font-size:13px;text-align:right;
                   color:#dc2626;font-weight:600;">&#8722;${formatINR(s.commission)}</td>
        <td style="padding:11px 14px;font-size:13px;text-align:right;
                   font-weight:700;color:#15803d;">${formatINR(s.payable)}</td>
        <td style="padding:11px 14px;text-align:center;">
          <span style="background:${s.status === "Paid" ? "#dcfce7" : "#fef9c3"};
                       color:${s.status === "Paid" ? "#15803d" : "#b45309"};
                       border:1px solid ${s.status === "Paid" ? "#86efac" : "#fde68a"};
                       padding:3px 10px;border-radius:999px;font-size:10px;
                       font-weight:700;white-space:nowrap;">
            ${s.status === "Paid" ? "✓ Paid" : "⏳ Pending"}
          </span>
        </td>
      </tr>
    `).join("")

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Daily Settlement Report — Metro Cool</title>
</head>
<body style="margin:0;padding:0;background:#eef2f7;font-family:'Segoe UI',Arial,Helvetica,sans-serif;-webkit-font-smoothing:antialiased;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#eef2f7;padding:40px 16px;">
    <tr><td align="center">

      <table width="640" cellpadding="0" cellspacing="0"
        style="background:#ffffff;border-radius:20px;overflow:hidden;
               box-shadow:0 8px 40px rgba(15,23,42,0.12);max-width:640px;">

        <!-- ═══ HEADER BANNER ═══ -->
        <tr>
          <td style="background:linear-gradient(135deg,#1e3a8a 0%,#2563eb 60%,#3b82f6 100%);
                     padding:32px 36px 28px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="vertical-align:middle;">
                  <p style="color:#93c5fd;font-size:11px;font-weight:600;
                             text-transform:uppercase;letter-spacing:1px;margin:0 0 6px;">Daily Settlement Report</p>
                  <h1 style="color:#ffffff;font-size:26px;font-weight:800;
                             margin:0;letter-spacing:-0.3px;line-height:1.2;">Metro Cool</h1>
                  <p style="color:#bfdbfe;font-size:12px;margin:6px 0 0;">Automated payout summary</p>
                </td>
                <td align="right" style="vertical-align:middle;">
                  <div style="background:rgba(255,255,255,0.12);border-radius:12px;
                               padding:12px 16px;display:inline-block;text-align:right;">
                    <p style="color:#bfdbfe;font-size:11px;margin:0 0 4px;
                               font-weight:500;">${reportDate}</p>
                    <p style="color:#ffffff;font-size:13px;font-weight:700;margin:0;">Auto-generated · 8:00 PM</p>
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- ═══ DIVIDER ACCENT ═══ -->
        <tr>
          <td style="height:4px;background:linear-gradient(90deg,#3b82f6,#8b5cf6,#ec4899);"></td>
        </tr>

        <!-- ═══ BODY ═══ -->
        <tr>
          <td style="padding:32px 36px 0;">

            <!-- Greeting -->
            <p style="font-size:15px;color:#374151;margin:0 0 4px;">Hello 👋,</p>
            <p style="font-size:14px;color:#6b7280;margin:0 0 28px;line-height:1.6;">
              Here is your <strong style="color:#111827;">daily settlement summary</strong> for today.
              The detailed Excel file is attached below.
            </p>

            <!-- ─── Summary KPI Cards ─── -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
              <tr>
                <!-- Total Jobs -->
                <td width="24%" style="padding-right:8px;vertical-align:top;">
                  <table width="100%" cellpadding="0" cellspacing="0"
                    style="background:#eff6ff;border:1.5px solid #bfdbfe;
                           border-radius:14px;overflow:hidden;">
                    <tr>
                      <td style="padding:6px 12px 0;">
                        <p style="font-size:9px;color:#93c5fd;font-weight:700;
                                   text-transform:uppercase;letter-spacing:.8px;margin:0;">Total Jobs</p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:4px 12px 14px;">
                        <p style="font-size:32px;font-weight:900;color:#1d4ed8;
                                   margin:0;line-height:1;">${settlements.length}</p>
                        <p style="font-size:10px;color:#93c5fd;margin:4px 0 0;">bookings today</p>
                      </td>
                    </tr>
                  </table>
                </td>
                <!-- Revenue -->
                <td width="25%" style="padding-right:8px;vertical-align:top;">
                  <table width="100%" cellpadding="0" cellspacing="0"
                    style="background:#f0fdf4;border:1.5px solid #86efac;
                           border-radius:14px;overflow:hidden;">
                    <tr>
                      <td style="padding:6px 12px 0;">
                        <p style="font-size:9px;color:#4ade80;font-weight:700;
                                   text-transform:uppercase;letter-spacing:.8px;margin:0;">Revenue</p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:4px 12px 14px;">
                        <p style="font-size:18px;font-weight:800;color:#15803d;
                                   margin:0;line-height:1.2;">${formatINR(totalRevenue)}</p>
                        <p style="font-size:10px;color:#86efac;margin:4px 0 0;">gross service value</p>
                      </td>
                    </tr>
                  </table>
                </td>
                <!-- Commission -->
                <td width="25%" style="padding-right:8px;vertical-align:top;">
                  <table width="100%" cellpadding="0" cellspacing="0"
                    style="background:#faf5ff;border:1.5px solid #d8b4fe;
                           border-radius:14px;overflow:hidden;">
                    <tr>
                      <td style="padding:6px 12px 0;">
                        <p style="font-size:9px;color:#c084fc;font-weight:700;
                                   text-transform:uppercase;letter-spacing:.8px;margin:0;">Commission 20%</p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:4px 12px 14px;">
                        <p style="font-size:18px;font-weight:800;color:#7e22ce;
                                   margin:0;line-height:1.2;">${formatINR(totalCommission)}</p>
                        <p style="font-size:10px;color:#d8b4fe;margin:4px 0 0;">platform earnings</p>
                      </td>
                    </tr>
                  </table>
                </td>
                <!-- Payable -->
                <td width="26%" style="vertical-align:top;">
                  <table width="100%" cellpadding="0" cellspacing="0"
                    style="background:#fff7ed;border:1.5px solid #fdba74;
                           border-radius:14px;overflow:hidden;">
                    <tr>
                      <td style="padding:6px 12px 0;">
                        <p style="font-size:9px;color:#fb923c;font-weight:700;
                                   text-transform:uppercase;letter-spacing:.8px;margin:0;">Net Payable</p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:4px 12px 14px;">
                        <p style="font-size:18px;font-weight:800;color:#c2410c;
                                   margin:0;line-height:1.2;">${formatINR(totalPayable)}</p>
                        <p style="font-size:10px;color:#fdba74;margin:4px 0 0;">technician payout</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

            <!-- ─── Status Alert Banner ─── -->
            ${pendingCount > 0 ? `
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
              <tr>
                <td style="background:#fffbeb;border:1.5px solid #fde68a;border-radius:12px;
                           padding:14px 18px;">
                  <table width="100%" cellpadding="0" cellspacing="0"><tr>
                    <td width="30" style="vertical-align:middle;font-size:20px;">⚠️</td>
                    <td style="vertical-align:middle;padding-left:10px;">
                      <p style="margin:0;font-size:13px;font-weight:700;color:#92400e;">
                        ${pendingCount} payout${pendingCount > 1 ? "s" : ""} still pending
                      </p>
                      <p style="margin:4px 0 0;font-size:12px;color:#b45309;">
                        Please review and mark as paid in the admin panel.
                      </p>
                    </td>
                  </tr></table>
                </td>
              </tr>
            </table>` : `
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
              <tr>
                <td style="background:#f0fdf4;border:1.5px solid #86efac;border-radius:12px;
                           padding:14px 18px;">
                  <table width="100%" cellpadding="0" cellspacing="0"><tr>
                    <td width="30" style="vertical-align:middle;font-size:20px;">✅</td>
                    <td style="vertical-align:middle;padding-left:10px;">
                      <p style="margin:0;font-size:13px;font-weight:700;color:#166534;">
                        All ${settlements.length} payout${settlements.length !== 1 ? "s" : ""} settled for today
                      </p>
                      <p style="margin:4px 0 0;font-size:12px;color:#15803d;">
                        No pending disbursements — great job!
                      </p>
                    </td>
                  </tr></table>
                </td>
              </tr>
            </table>`}

          </td>
        </tr>

        <!-- ═══ SETTLEMENT TABLE ═══ -->
        <tr>
          <td style="padding:0 36px 32px;">
            ${settlements.length === 0 ? `
            <table width="100%" cellpadding="0" cellspacing="0"
              style="background:#f8fafc;border:1.5px dashed #e2e8f0;border-radius:14px;">
              <tr>
                <td style="padding:48px 32px;text-align:center;">
                  <p style="font-size:40px;margin:0;">📋</p>
                  <p style="font-size:15px;font-weight:600;color:#64748b;margin:12px 0 4px;">No settlements recorded today</p>
                  <p style="font-size:13px;color:#94a3b8;margin:0;">
                    Completed bookings with captured payments will appear here.
                  </p>
                </td>
              </tr>
            </table>` : `
            <p style="font-size:12px;font-weight:700;color:#6b7280;text-transform:uppercase;
                       letter-spacing:.6px;margin:0 0 10px;">Settlement Breakdown</p>
            <table width="100%" cellpadding="0" cellspacing="0"
              style="border-collapse:collapse;border-radius:12px;overflow:hidden;
                     border:1px solid #e5e7eb;">
              <!-- Table Header -->
              <thead>
                <tr style="background:linear-gradient(90deg,#1e3a8a,#2563eb);">
                  <th style="padding:11px 14px;text-align:left;font-size:10px;font-weight:700;
                             color:#bfdbfe;text-transform:uppercase;letter-spacing:.6px;
                             white-space:nowrap;border-right:1px solid rgba(255,255,255,0.1);">Booking</th>
                  <th style="padding:11px 14px;text-align:left;font-size:10px;font-weight:700;
                             color:#bfdbfe;text-transform:uppercase;letter-spacing:.6px;
                             border-right:1px solid rgba(255,255,255,0.1);">Technician</th>
                  <th style="padding:11px 14px;text-align:left;font-size:10px;font-weight:700;
                             color:#bfdbfe;text-transform:uppercase;letter-spacing:.6px;
                             border-right:1px solid rgba(255,255,255,0.1);">Service</th>
                  <th style="padding:11px 14px;text-align:left;font-size:10px;font-weight:700;
                             color:#bfdbfe;text-transform:uppercase;letter-spacing:.6px;
                             border-right:1px solid rgba(255,255,255,0.1);">Date</th>
                  <th style="padding:11px 14px;text-align:right;font-size:10px;font-weight:700;
                             color:#bfdbfe;text-transform:uppercase;letter-spacing:.6px;
                             border-right:1px solid rgba(255,255,255,0.1);">Price</th>
                  <th style="padding:11px 14px;text-align:right;font-size:10px;font-weight:700;
                             color:#bfdbfe;text-transform:uppercase;letter-spacing:.6px;
                             border-right:1px solid rgba(255,255,255,0.1);">Comm.</th>
                  <th style="padding:11px 14px;text-align:right;font-size:10px;font-weight:700;
                             color:#bfdbfe;text-transform:uppercase;letter-spacing:.6px;
                             border-right:1px solid rgba(255,255,255,0.1);">Payable</th>
                  <th style="padding:11px 14px;text-align:center;font-size:10px;font-weight:700;
                             color:#bfdbfe;text-transform:uppercase;letter-spacing:.6px;">Status</th>
                </tr>
              </thead>
              <tbody>
                ${tableRows}
                <!-- Totals Row -->
                <tr style="background:#dbeafe;border-top:2px solid #bfdbfe;">
                  <td colspan="4" style="padding:13px 14px;font-weight:800;font-size:12px;
                                        color:#1e40af;">TOTAL (${settlements.length} job${settlements.length !== 1 ? "s" : ""})</td>
                  <td style="padding:13px 14px;text-align:right;font-weight:800;
                             font-size:12px;color:#1e40af;">${formatINR(totalRevenue)}</td>
                  <td style="padding:13px 14px;text-align:right;font-weight:800;
                             font-size:12px;color:#7c3aed;">&#8722;${formatINR(totalCommission)}</td>
                  <td style="padding:13px 14px;text-align:right;font-weight:800;
                             font-size:12px;color:#15803d;">${formatINR(totalPayable)}</td>
                  <td></td>
                </tr>
              </tbody>
            </table>`}
          </td>
        </tr>

        <!-- ═══ EXCEL NOTICE ═══ -->
        <tr>
          <td style="padding:0 36px 32px;">
            <table width="100%" cellpadding="0" cellspacing="0"
              style="background:#f0f9ff;border:1.5px solid #bae6fd;
                     border-radius:12px;">
              <tr>
                <td style="padding:14px 18px;">
                  <table cellpadding="0" cellspacing="0"><tr>
                    <td style="font-size:22px;vertical-align:middle;padding-right:12px;">📎</td>
                    <td style="vertical-align:middle;">
                      <p style="font-size:13px;font-weight:700;color:#0369a1;margin:0;">
                        Excel report attached
                      </p>
                      <p style="font-size:12px;color:#0284c7;margin:4px 0 0;">
                        Open the attached <strong>.xlsx</strong> file for the full breakdown, sortable columns, and printable layout.
                      </p>
                    </td>
                  </tr></table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- ═══ FOOTER ═══ -->
        <tr>
          <td style="background:#f8fafc;border-top:1px solid #e5e7eb;
                     padding:22px 36px;text-align:center;">
            <p style="font-size:12px;color:#9ca3af;margin:0;">
              Metro Cool Admin System &nbsp;·&nbsp; Auto-generated report &nbsp;·&nbsp; Do not reply
            </p>
            <p style="font-size:11px;color:#d1d5db;margin:6px 0 0;">
              © ${new Date().getFullYear()} Metro Cool. All rights reserved.
            </p>
          </td>
        </tr>

      </table>

    </td></tr>
  </table>

</body>
</html>`

    await transporter.sendMail({
      from: `"Metro Cool" <${process.env.MAIL_USER}>`,
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
