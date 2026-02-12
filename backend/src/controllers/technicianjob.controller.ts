import { Request, Response } from "express";
import { supabase } from "../utils/supabase.js";

/* ================= ACCEPT JOB ================= */
export const acceptJob = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const technicianId = req.user.id;

    // ATOMIC UPDATE (no race condition)
    const { data, error } = await supabase
      .from("bookings")
      .update({
        job_status: "assigned",
        // technician_id: technicianId,
      })
      .eq("id", id)
      .eq("job_status", "open")
      .select();

    // if no row updated
    // if (!data || data.length === 0) {

    //   // check if already mine
    //   const { data: existing } = await supabase
    //     .from("bookings")
    //     .select("technician_id, job_status")
    //     .eq("id", id)
    //     .single();

    //   if (existing?.technician_id === technicianId) {
    //     // already accepted by same technician
    //     return res.json({ success: true, alreadyAccepted: true });
    //   }

    //   return res.status(400).json({
    //     success: false,
    //     message: "Job already accepted by another technician",
    //   });
    // }

    return res.json({ success: true });

  } catch (err) {
    console.error("Accept Job Error:", err);
    return res.status(500).json({ success: false });
  }
};


/* ================= ON THE WAY ================= */
export const onTheWay = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await supabase
      .from("bookings")
      .update({ job_status: "on_the_way" })
      .eq("id", id)
    //   .eq("technician_id", req.user.id);

    return res.json({ success: true });
  } catch (err) {
    console.error("On The Way Error:", err);
    return res.status(500).json({ success: false });
  }
};

/* ================= START WORK ================= */
export const startWork = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await supabase
      .from("bookings")
      .update({ job_status: "working" })
      .eq("id", id)
    //   .eq("technician_id", req.user.id);

    return res.json({ success: true });
  } catch (err) {
    console.error("Start Work Error:", err);
    return res.status(500).json({ success: false });
  }
};

/* ================= REPORT ================= */
export const submitReport = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await supabase
      .from("bookings")
      .update({ job_status: "report_submitted" })
      .eq("id", id)
    //   .eq("technician_id", req.user.id);

    return res.json({ success: true });
  } catch (err) {
    console.error("Report Error:", err);
    return res.status(500).json({ success: false });
  }
};

/* ================= COMPLETE ================= */
export const completeJob = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await supabase
      .from("bookings")
      .update({ job_status: "completed" })
      .eq("id", id)
    //   .eq("technician_id", req.user.id);

    return res.json({ success: true });
  } catch (err) {
    console.error("Complete Job Error:", err);
    return res.status(500).json({ success: false });
  }
};


export const verifyOtpAndCloseJob = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const technicianId = req.user.id;

    // Here you will later check OTP (SMS provider)
    // For now we just trust it

    const { data, error } = await supabase
      .from("bookings")
      .update({
        job_status: "completed",
        completed_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("technician_id", technicianId)
      .select();

    // if (error || !data?.length) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Unable to close job",
    //   });
    // }

    return res.json({ success: true });

  } catch (err) {
    console.error("OTP Close Job Error:", err);
    return res.status(500).json({ success: false });
  }
};
