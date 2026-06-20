import fs from "fs"
import { supabase } from "./supabase.js"

export const uploadInvoice = async (filePath: string, booking_id: string) => {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Invoice PDF not found at: ${filePath}`)
  }

  const file = fs.readFileSync(filePath)
  console.log(`[uploadInvoice] uploading ${file.length} bytes for booking: ${booking_id}`)

  const fileName = `invoice_${booking_id}.pdf`

  const { data, error } = await supabase.storage
    .from("invoices")
    .upload(fileName, file, {
      contentType: "application/pdf",
      upsert: true,
    })

  if (error) {
    console.error("[uploadInvoice] upload failed:", error.message, error)
    throw new Error(`Invoice upload failed: ${error.message}`)
  }

  console.log("[uploadInvoice] upload success:", data?.path)

  const { data: publicUrl } = supabase.storage
    .from("invoices")
    .getPublicUrl(fileName)

  console.log("[uploadInvoice] public URL:", publicUrl.publicUrl)
  return publicUrl.publicUrl
}