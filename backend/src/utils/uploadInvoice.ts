import fs from "fs"
import { supabase } from "./supabase.js"

export const uploadInvoice = async (filePath: string, booking_id: string) => {
  const file = fs.readFileSync(filePath)

  const { data, error } = await supabase.storage
    .from("invoices")
    .upload(`invoice_${booking_id}.pdf`, file, {
      contentType: "application/pdf",
      upsert: true,
    })

  if (error) throw error

  const { data: publicUrl } = supabase.storage
    .from("invoices")
    .getPublicUrl(`invoice_${booking_id}.pdf`)

  return publicUrl.publicUrl
}