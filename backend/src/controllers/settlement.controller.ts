import ExcelJS from "exceljs"
import nodemailer from "nodemailer"
import { Request, Response } from "express"

/* ---------------- CREATE EXCEL ---------------- */
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

/* ---------------- DOWNLOAD EXCEL ---------------- */
export const downloadSettlementReport = async (req: Request, res: Response) => {
  try {
    const settlements = req.body.settlements

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
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Failed to generate report" })
  }
}

/* ---------------- EMAIL EXCEL ---------------- */
export const emailSettlementReport = async (req: Request, res: Response) => {
  try {
    const { settlements, email } = req.body

    const workbook = await generateSettlementExcel(settlements)
    const buffer = await workbook.xlsx.writeBuffer()

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    })

    transporter.sendMail({
          from: `"Metro Cool" <${process.env.MAIL_USER}>`,
          to: email,
          subject: "Daily Settlement Report",
          text: "Please find attached today’s settlement report.",
          attachments: [
              {
                  filename: "settlements-report.xlsx",
                  content: buffer,
              },
          ],
      })

    res.json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Failed to send email" })
  }
}
