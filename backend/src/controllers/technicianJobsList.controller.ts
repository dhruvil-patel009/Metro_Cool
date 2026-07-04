import { Request, Response } from "express";
import { supabase } from "../utils/supabase.js";

/* NEW JOBS (available to accept) */
export const getOpenJobs = async (req: Request, res: Response) => {
  const { data, error } = await supabase
    .from("bookings")
    .select("*,services (*)")
    .eq("job_status", "open")
    .order("created_at", { ascending: false });

  if (error) return res.status(500).json({ success: false });

  res.json({ success: true, bookings: data });
};

/* MY JOBS (accepted, in-progress — excludes completed) */
export const getMyJobs = async (req: Request, res: Response) => {
  try {
  const { data, error } = await supabase
    .from("bookings")
    .select("*,services (*)")
    .eq("technician_id", (req as any).user.id)
    .neq("job_status", "completed")
    .order("booking_date", { ascending: true });

    if (error) {
      console.log("SUPABASE ERROR:", error);
      return res.status(500).json({ success: false });
    }

  res.json({
    success: true,
    serverTime: new Date().toISOString(),
    bookings: data,
  });
}
   catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};

/* ALL MY JOBS (includes completed — for schedule/calendar) */
export const getAllMyJobs = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from("bookings")
      .select("*,services (*)")
      .eq("technician_id", (req as any).user.id)
      .order("booking_date", { ascending: false });

    if (error) {
      console.log("SUPABASE ERROR:", error);
      return res.status(500).json({ success: false });
    }

    res.json({ success: true, bookings: data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};

