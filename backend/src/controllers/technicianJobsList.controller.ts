import { Request, Response } from "express";
import { supabase } from "../utils/supabase.js";

/* NEW JOBS (available to accept) */
export const getOpenJobs = async (req: Request, res: Response) => {
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("job_status", "open")
    .order("created_at", { ascending: false });

  if (error) return res.status(500).json({ success: false });

  res.json({ success: true, bookings: data });
};

/* MY JOBS (accepted jobs) */
export const getMyJobs = async (req: Request, res: Response) => {
  try {
  const { data, error } = await supabase
    .from("bookings")
    .select("*,services (*)")
    // .eq("technician_id", req.user.id)
    .neq("job_status", "completed")
    // .order("scheduled_date", { ascending: true });

    if (error) {
      console.log("SUPABASE ERROR:", error);
      return res.status(500).json({ success: false });
    }

  res.json({
    success: true,
    serverTime: new Date().toISOString(), // ⭐ IMPORTANT
    bookings: data,
  });
}
   catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};

