import { Request, Response } from "express"
import { supabase } from "../utils/supabase.js"
import ExcelJS from "exceljs"
import nodemailer from "nodemailer"

/* =========================================================
   Build settlement rows from DB
========================================================= */

const buildSettlements = async () => {
  const { data: payments, error } = await supabase
    .from("payments")
    .select(`
      id,
      amount,
      status,
      payout_status,
      created_at,
      booking:bookings(
        booking_id,
        service_name,
        completed_at,
        technician_id,
        technician:profiles!bookings_technician_id_fkey(
          full_name
        )
      )
    `)
    .eq("status", "captured")
    .order("created_at", { ascending: false })

  if (error) throw error

  return payments.map((p: any) => {
    const price = Number(p.amount)
    const commission = +(price * 0.20).toFixed(2)
    const payable = +(price - commission).toFixed(2)

    return {
      id: p.id,
      bookingId: p.booking.booking_id,
      technician: {
        name: p.booking.technician?.full_name || "Unknown",
        techId: p.booking.technician_id,
      },
      service: {
        name: p.booking.service_name,
        category: "Service",
      },
      dateTime: {
        date: new Date(p.booking.completed_at).toLocaleDateString(),
        time: new Date(p.booking.completed_at).toLocaleTimeString(),
      },
      price,
      commission,
      payable,
      status: p.payout_status === "paid" ? "Paid" : "Pending",
    }
  })
}

/* =========================================================
   GET settlements (table data)
========================================================= */
export const getSettlements = async (req: Request, res: Response) => {
  try {

    /* STEP 1 — GET PAYMENTS */
    const { data: payments, error: paymentError } = await supabase
      .from("payments")
      .select("*")
      .eq("status", "captured")
      .order("created_at", { ascending: false })

    if (paymentError) throw paymentError

    if (!payments || payments.length === 0)
      return res.json({ settlements: [] })

    const settlements = []

    /* STEP 2 — FOR EACH PAYMENT GET BOOKING + TECHNICIAN */
    for (const payment of payments) {

      // booking
      const { data: booking } = await supabase
        .from("bookings")
        .select("*")
        .eq("booking_id", payment.booking_id)
        .single()

      if (!booking) continue

      // technician profile
      const { data: technician } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", booking.technician_id)
        .single()

      const price = Number(payment.amount)
      const commission = +(price * 0.20).toFixed(2)
      const payable = +(price - commission).toFixed(2)

      settlements.push({
        id: payment.id,
        bookingId: booking.booking_id,

        technician: {
          name: technician?.full_name || "Technician",
          techId: booking.technician_id,
        },

        service: {
          name: booking.service_name,
          category: "Service",
        },

        dateTime: {
          date: new Date(booking.completed_at || payment.created_at).toLocaleDateString(),
          time: new Date(booking.completed_at || payment.created_at).toLocaleTimeString(),
        },

        price,
        commission,
        payable,

        status: payment.payout_status === "pending" ? "Paid" : "Pending",
      })
    }

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

  await supabase
    .from("payments")
    .update({ payout_status: "paid" })
    .eq("id", paymentId)

  res.json({ success: true })
}

/* =========================================================
   MARK ALL PAID
========================================================= */
export const markAllPaid = async (_: Request, res: Response) => {
  await supabase
    .from("payments")
    .update({ payout_status: "paid" })
    .eq("status", "captured")

  res.json({ success: true })
}

/* =========================================================
   EXCEL DOWNLOAD
========================================================= */
export const downloadSettlementReport = async (req: Request, res: Response) => {
  const settlements = await buildSettlements()

  const workbook = new ExcelJS.Workbook()
  const sheet = workbook.addWorksheet("Settlements")

  sheet.columns = [
    { header: "Booking ID", key: "bookingId", width: 20 },
    { header: "Technician", key: "technician", width: 20 },
    { header: "Service", key: "service", width: 20 },
    { header: "Date", key: "date", width: 15 },
    { header: "Price", key: "price", width: 12 },
    { header: "Commission", key: "commission", width: 12 },
    { header: "Payable", key: "payable", width: 12 },
    { header: "Status", key: "status", width: 12 },
  ]

  settlements.forEach((s: any) => {
    sheet.addRow({
      bookingId: s.bookingId,
      technician: s.technician.name,
      service: s.service.name,
      date: s.dateTime.date,
      price: s.price,
      commission: s.commission,
      payable: s.payable,
      status: s.status,
    })
  })

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  )
  res.setHeader("Content-Disposition", "attachment; filename=settlements.xlsx")

  await workbook.xlsx.write(res)
  res.end()
}

/* =========================================================
   EMAIL REPORT
========================================================= */
export const emailSettlementReport = async (req: Request, res: Response) => {
  const { email } = req.body
  const settlements = await buildSettlements()

  const total = settlements.reduce((a, b) => a + b.payable, 0)

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  })

  await transporter.sendMail({
    from: `"Metro Cool" <${process.env.MAIL_USER}>`,
    to: email,
    subject: "Daily Settlement Report",
    html: `<h2>Daily Settlement</h2>
           <p>Total Jobs: ${settlements.length}</p>
           <p>Total Payable: ₹${total}</p>`,
  })

  res.json({ success: true })
}