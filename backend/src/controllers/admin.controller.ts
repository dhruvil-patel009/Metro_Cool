import { Request, Response } from "express"
import { supabase } from "../utils/supabase.js"

export const approveTechnician = async (req: Request, res: Response) => {
  await supabase.from("technician_details").update({
    approval_status: "approved",
    status: "active",
  }).eq("id", req.params.id)

  res.json({ message: "Approved" })
}

export const rejectTechnician = async (req: Request, res: Response) => {
  await supabase.from("technician_details").update({
    approval_status: "rejected",
    status: "inactive",
  }).eq("id", req.params.id)

  res.json({ message: "Rejected" })
}

export const deactivateTechnician = async (req: Request, res: Response) => {
  await supabase.from("technician_details")
    .update({ status: "inactive" })
    .eq("id", req.params.id)

  res.json({ message: "Deactivated" })
}
