import PDFDocument from "pdfkit"
import fs from "fs"
import path from "path"

export const generateInvoice = async ({
  booking_id,
  payment_id,
  amount,
  customer_name,
  service_name,
  otp,
}: any) => {
  return new Promise<string>((resolve, reject) => {
    try {
      const fileName = `invoice_${booking_id}.pdf`
      const filePath = path.join(process.cwd(), "invoices", fileName)

      const doc = new PDFDocument({ margin: 50 })
      const stream = fs.createWriteStream(filePath)

      doc.pipe(stream)

      // HEADER
      doc
        .fontSize(22)
        .text("METRO COOL SERVICES", { align: "center" })
        .moveDown()

      doc
        .fontSize(14)
        .text("AC Repair & Maintenance Services", { align: "center" })
        .moveDown(2)

      // Invoice Info
      doc.fontSize(12)
      doc.text(`Invoice ID: ${booking_id}`)
      doc.text(`Payment ID: ${payment_id}`)
      doc.text(`Date: ${new Date().toLocaleDateString()}`)
      doc.moveDown()

      // Customer
      doc.text(`Customer: ${customer_name}`)
      doc.text(`Service: ${service_name}`)
      doc.moveDown()

      // Table
      doc.text("---------------------------------------------")
      doc.text(`Service Charge: ₹${amount}`)
      doc.text("---------------------------------------------")

      doc.fontSize(16).text(`TOTAL: ₹${amount}`, { align: "right" })
      doc.moveDown(2)

      // OTP
      doc
        .fontSize(14)
        .fillColor("red")
        .text(`Service Closure OTP: ${otp}`, { align: "center" })

      doc.moveDown(3)

      doc
        .fillColor("black")
        .fontSize(10)
        .text("Thank you for choosing Metro Cool!", { align: "center" })

      doc.end()

      stream.on("finish", () => resolve(filePath))
    } catch (err) {
      reject(err)
    }
  })
}