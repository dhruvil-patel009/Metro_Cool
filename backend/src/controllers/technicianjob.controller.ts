import { Request, Response } from "express"
import { supabase } from "../utils/supabase.js"

/* ── ACCEPT JOB ── */
export const acceptJob = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const technicianId = req.user.id

    const { error } = await supabase
      .from("bookings")
      .update({ job_status: "assigned", technician_id: technicianId })
      .eq("id", id)
      .eq("job_status", "open")

    if (error) return res.status(500).json({ success: false })
    return res.json({ success: true })
  } catch (err) {
    console.error("Accept Job Error:", err)
    return res.status(500).json({ success: false })
  }
}

/* ── ON THE WAY ── */
export const onTheWay = async (req: Request, res: Response) => {
  try {
    await supabase.from("bookings").update({ job_status: "on_the_way" }).eq("id", req.params.id)
    return res.json({ success: true })
  } catch (err) {
    return res.status(500).json({ success: false })
  }
}

/* ── START WORK ── */
export const startWork = async (req: Request, res: Response) => {
  try {
    await supabase.from("bookings").update({ job_status: "working" }).eq("id", req.params.id)
    return res.json({ success: true })
  } catch (err) {
    return res.status(500).json({ success: false })
  }
}

/* ── SUBMIT REPORT ── */
export const submitReport = async (req: Request, res: Response) => {
  try {
    await supabase.from("bookings").update({ job_status: "report_submitted" }).eq("id", req.params.id)
    return res.json({ success: true })
  } catch (err) {
    return res.status(500).json({ success: false })
  }
}

/* ── COMPLETE JOB ── */
export const completeJob = async (req: Request, res: Response) => {
  try {
    await supabase.from("bookings").update({ job_status: "completed" }).eq("id", req.params.id)
    return res.json({ success: true })
  } catch (err) {
    return res.status(500).json({ success: false })
  }
}

/* ── VERIFY OTP AND CLOSE JOB ──
   The customer sees a 4-digit closure OTP on their
   payment completion screen. The technician asks for
   it verbally and types it here to close the job.
   No SMS is involved — it's screen-to-screen.
*/
export const verifyOtpAndCloseJob = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { otp } = req.body

    const entered = String(otp || "").trim()

    if (entered.length !== 4) {
      return res.status(400).json({
        success: false,
        message: "Please enter the 4-digit OTP shown on the customer's screen.",
      })
    }

    // Fetch booking
    const { data: booking, error } = await supabase
      .from("bookings")
      .select("closure_otp, payment_status, job_status")
      .eq("id", id)
      .single()

    if (error || !booking) {
      return res.status(404).json({ success: false, message: "Booking not found" })
    }

    // Payment must be complete before OTP exists
    if (booking.payment_status !== "completed") {
      return res.status(400).json({
        success: false,
        message: "Payment not completed yet. Ask the customer to pay first.",
      })
    }

    // Idempotent — already closed is fine
    if (booking.job_status === "completed") {
      return res.json({ success: true, alreadyClosed: true })
    }

    const stored = String(booking.closure_otp || "").trim()

    if (!stored) {
      return res.status(400).json({
        success: false,
        message: "No OTP found for this booking. Please contact support.",
      })
    }

    if (stored !== entered) {
      return res.status(400).json({
        success: false,
        message: "Incorrect OTP. Ask the customer to check the code on their payment completion screen.",
      })
    }

    // OTP matched — close the job
    await supabase
      .from("bookings")
      .update({ job_status: "completed", completed_at: new Date().toISOString() })
      .eq("id", id)

    return res.json({ success: true })
  } catch (err) {
    console.error("OTP Close Job Error:", err)
    return res.status(500).json({ success: false, message: "Server error" })
  }
}
