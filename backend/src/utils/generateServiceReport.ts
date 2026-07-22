import PDFDocument from "pdfkit"
import fs from "fs"
import path from "path"
import os from "os"
import { fileURLToPath } from "url"
import https from "https"
import http from "http"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const C = {
  navy: "#0D2137",
  blue: "#1B4F8A",
  headerBg: "#EBF3FF",
  teal: "#0D9488",
  text: "#1E293B",
  muted: "#64748B",
  subtle: "#94A3B8",
  tableBg: "#F1F5F9",
  line: "#E2E8F0",
  white: "#FFFFFF",
  green: "#16A34A",
  greenLight: "#F0FDF4",
  red: "#DC2626",
}

interface ServiceReportData {
  report_id: string
  job_id: string
  issue_description: string
  fix_applied: string
  additional_notes?: string
  photos?: string[]
  created_at: string
  customer_name: string
  customer_phone: string
  technician_name: string
  technician_phone: string
  booking_date: string
  address?: string
  service_title?: string
}

/* Helper to download an image from URL and return as Buffer */
function downloadImage(url: string): Promise<Buffer | null> {
  return new Promise((resolve) => {
    const protocol = url.startsWith("https") ? https : http
    const request = protocol.get(url, { timeout: 10000 }, (response) => {
      // Follow redirects
      if (response.statusCode && response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        downloadImage(response.headers.location).then(resolve)
        return
      }

      if (response.statusCode !== 200) {
        resolve(null)
        return
      }

      const chunks: Buffer[] = []
      response.on("data", (chunk: Buffer) => chunks.push(chunk))
      response.on("end", () => resolve(Buffer.concat(chunks)))
      response.on("error", () => resolve(null))
    })

    request.on("error", () => resolve(null))
    request.on("timeout", () => {
      request.destroy()
      resolve(null)
    })
  })
}

export const generateServiceReportPDF = async (data: ServiceReportData): Promise<string> => {
  const outputDir = path.join(os.tmpdir(), "service-reports")
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true })

  const filePath = path.join(outputDir, `service-report-${data.job_id}.pdf`)

  // Pre-download all images before PDF generation
  const imageBuffers: (Buffer | null)[] = []
  if (data.photos && data.photos.length > 0) {
    for (const url of data.photos) {
      const buf = await downloadImage(url)
      imageBuffers.push(buf)
    }
  }

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 50 })
    const stream = fs.createWriteStream(filePath)

    doc.pipe(stream)

    const pageWidth = doc.page.width - 100 // margins

    // ═══ HEADER ═══
    doc
      .rect(0, 0, doc.page.width, 100)
      .fill(C.headerBg)

    doc
      .fontSize(22)
      .font("Helvetica-Bold")
      .fillColor(C.navy)
      .text("Service Completion Report", 50, 35)

    doc
      .fontSize(10)
      .font("Helvetica")
      .fillColor(C.muted)
      .text(`Report ID: ${data.report_id.slice(0, 8).toUpperCase()}`, 50, 65)
      .text(`Generated: ${new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}`, 50, 80)

    doc
      .fontSize(10)
      .fillColor(C.blue)
      .text("Metro Cool", doc.page.width - 200, 35, { align: "right", width: 150 })
      .fillColor(C.muted)
      .font("Helvetica")
      .text("AC Repair & Maintenance", doc.page.width - 200, 50, { align: "right", width: 150 })
      .text("www.metro-cool.com", doc.page.width - 200, 65, { align: "right", width: 150 })

    let y = 120

    // ═══ JOB DETAILS ═══
    doc
      .fontSize(12)
      .font("Helvetica-Bold")
      .fillColor(C.navy)
      .text("Job Details", 50, y)

    y += 25

    const details = [
      { label: "Job ID", value: `#${data.job_id.slice(0, 8).toUpperCase()}` },
      { label: "Service", value: data.service_title || "AC Service" },
      { label: "Booking Date", value: data.booking_date },
      { label: "Report Date", value: new Date(data.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) },
    ]

    if (data.address) {
      details.push({ label: "Address", value: data.address })
    }

    details.forEach((item) => {
      doc
        .fontSize(9)
        .font("Helvetica")
        .fillColor(C.muted)
        .text(item.label, 50, y, { width: 120 })
        .font("Helvetica-Bold")
        .fillColor(C.text)
        .text(item.value, 170, y, { width: pageWidth - 120 })
      y += 18
    })

    y += 15

    // ═══ CUSTOMER & TECHNICIAN ═══
    doc
      .rect(50, y, pageWidth, 1)
      .fill(C.line)
    y += 15

    // Two columns
    doc
      .fontSize(11)
      .font("Helvetica-Bold")
      .fillColor(C.navy)
      .text("Customer", 50, y)
      .text("Technician", 300, y)

    y += 20

    doc
      .fontSize(10)
      .font("Helvetica")
      .fillColor(C.text)
      .text(data.customer_name, 50, y)
      .text(data.technician_name, 300, y)

    y += 15

    doc
      .fontSize(9)
      .fillColor(C.muted)
      .text(data.customer_phone, 50, y)
      .text(data.technician_phone, 300, y)

    y += 30

    // ═══ ISSUE DESCRIPTION ═══
    doc
      .rect(50, y, pageWidth, 1)
      .fill(C.line)
    y += 15

    doc
      .fontSize(11)
      .font("Helvetica-Bold")
      .fillColor(C.navy)
      .text("Issue Reported", 50, y)
    y += 18

    doc
      .fontSize(10)
      .font("Helvetica")
      .fillColor(C.text)
      .text(data.issue_description || "No issue description provided", 50, y, { width: pageWidth })

    y = doc.y + 20

    // ═══ FIX APPLIED ═══
    doc
      .fontSize(11)
      .font("Helvetica-Bold")
      .fillColor(C.green)
      .text("Fix Applied", 50, y)
    y += 18

    doc
      .fontSize(10)
      .font("Helvetica")
      .fillColor(C.text)
      .text(data.fix_applied || "No fix description provided", 50, y, { width: pageWidth })

    y = doc.y + 20

    // ═══ ADDITIONAL NOTES ═══
    if (data.additional_notes) {
      doc
        .fontSize(11)
        .font("Helvetica-Bold")
        .fillColor(C.navy)
        .text("Additional Notes", 50, y)
      y += 18

      doc
        .fontSize(10)
        .font("Helvetica")
        .fillColor(C.text)
        .text(data.additional_notes, 50, y, { width: pageWidth })

      y = doc.y + 20
    }

    // ═══ PHOTOS ═══
    if (data.photos && data.photos.length > 0) {
      // Check if we need a new page
      if (y > 550) {
        doc.addPage()
        y = 50
      }

      doc
        .rect(50, y, pageWidth, 1)
        .fill(C.line)
      y += 15

      doc
        .fontSize(11)
        .font("Helvetica-Bold")
        .fillColor(C.navy)
        .text(`Photos Attached (${data.photos.length})`, 50, y)
      y += 20

      doc
        .fontSize(9)
        .font("Helvetica")
        .fillColor(C.muted)
        .text("Photo evidence of the completed work:", 50, y)
      y += 20

      // Embed pre-downloaded images
      for (let i = 0; i < data.photos.length; i++) {
        const imgBuffer = imageBuffers[i]
        const url = data.photos[i]

        if (imgBuffer) {
          // Check if we need a new page for this image
          if (y > 500) {
            doc.addPage()
            y = 50
          }

          // Add image label
          doc
            .fontSize(8)
            .font("Helvetica")
            .fillColor(C.muted)
            .text(`Photo ${i + 1}`, 50, y)
          y += 14

          // Embed the image — fit within page width, max height 200
          const imgWidth = Math.min(pageWidth, 400)
          const imgHeight = 180

          try {
            doc.image(imgBuffer, 50, y, {
              fit: [imgWidth, imgHeight],
              align: "center",
            })
            y += imgHeight + 15
          } catch {
            doc
              .fontSize(8)
              .fillColor(C.blue)
              .text(`${i + 1}. ${url}`, 50, y, { width: pageWidth, link: url })
            y += 14
          }
        } else {
          // Fallback: show URL as link
          doc
            .fontSize(8)
            .fillColor(C.blue)
            .text(`${i + 1}. ${url}`, 50, y, { width: pageWidth, link: url })
          y += 14
        }
      }
    }

    // ═══ FOOTER ═══
    y = doc.page.height - 80

    doc
      .rect(50, y, pageWidth, 1)
      .fill(C.line)

    y += 12

    doc
      .fontSize(8)
      .font("Helvetica")
      .fillColor(C.subtle)
      .text("This is a digitally generated service completion report by Metro Cool.", 50, y, { align: "center", width: pageWidth })
      .text("For queries, contact metrocool.official@gmail.com", 50, y + 12, { align: "center", width: pageWidth })

    doc.end()

    stream.on("finish", () => resolve(filePath))
    stream.on("error", reject)
  })
}
