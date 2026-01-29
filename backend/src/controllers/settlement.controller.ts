import ExcelJS from "exceljs"
import nodemailer from "nodemailer"
import { Request, Response } from "express"
import fs from "fs"
import path from "path"

/* ================= CREATE EXCEL ================= */
const generateSettlementExcel = async (settlements: any[]) => {
  const workbook = new ExcelJS.Workbook()
  const sheet = workbook.addWorksheet("Settlements")

  sheet.columns = [
    { header: "Booking ID", key: "bookingId", width: 15 },
    { header: "Technician", key: "technician", width: 20 },
    { header: "Service", key: "service", width: 20 },
    { header: "Date", key: "date", width: 15 },
    { header: "Time", key: "time", width: 15 },
    { header: "Price", key: "price", width: 12 },
    { header: "Commission", key: "commission", width: 12 },
    { header: "Payable", key: "payable", width: 12 },
    { header: "Status", key: "status", width: 12 },
  ]

  settlements.forEach((s) => {
    sheet.addRow({
      bookingId: s.bookingId,
      technician: s.technician.name,
      service: s.service.name,
      date: s.dateTime.date,
      time: s.dateTime.time,
      price: s.price,
      commission: s.commission,
      payable: s.payable,
      status: s.status,
    })
  })

  return workbook
}

/* ================= HTML TEMPLATE ================= */
const getEmailTemplate = (data: {
  date: string
  totalBookings: number
  totalAmount: number
}) => {
  const templatePath = path.join(
    process.cwd(),
    "templates",
    "settlement-report.html"
  )

  let html = fs.readFileSync(templatePath, "utf-8")

  html = html.replace("{{date}}", data.date)
  html = html.replace("{{totalBookings}}", String(data.totalBookings))
  html = html.replace("{{totalAmount}}", String(data.totalAmount))

  return html
}

/* ================= DOWNLOAD EXCEL ================= */
export const downloadSettlementReport = async (
  req: Request,
  res: Response
) => {
  try {
    const { settlements } = req.body

    const workbook = await generateSettlementExcel(settlements)

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=settlements-report.xlsx"
    )

    await workbook.xlsx.write(res)
    res.end()
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Failed to download settlement report" })
  }
}

/* ================= EMAIL SETTLEMENT ================= */
export const emailSettlementReport = async (
  req: Request,
  res: Response
) => {
  try {
    const { settlements, email } = req.body

    const workbook = await generateSettlementExcel(settlements)
    const arrayBuffer = await workbook.xlsx.writeBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const totalAmount = settlements.reduce(
      (sum: number, s: any) => sum + s.payable,
      0
    )

    const html = getEmailTemplate({
      date: new Date().toLocaleDateString(),
      totalBookings: settlements.length,
      totalAmount,
    })

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
      html,
attachments: [
  {
    filename: "settlements-report.xlsx", // ✅ correct filename
    content: buffer,                     // ✅ excel buffer
    contentType:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  },
],
    })

    res.json({
      success: true,
      message: "Settlement report sent successfully",
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Failed to send settlement report" })
  }
}
