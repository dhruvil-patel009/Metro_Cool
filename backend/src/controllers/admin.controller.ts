import { Request, Response } from "express";
import { supabase } from "../utils/supabase.js";

/* ================= GET ALL TECHNICIANS (PAGINATED) ================= */

export const getTechnicians = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, count, error } = await supabase
      .from("technician_details")
      .select(
        `
        id,
        services,
        status,
        approval_status,
        experience_years,
        profiles (
          first_name,
          last_name,
          phone,
          email,
          profile_photo
        )
      `,
        { count: "exact" }
      )
      .range(from, to);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({
      data,
      total: count,
      page,
      limit,
    });
  } catch (err) {
    console.error("GET TECHNICIANS ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
};

/* ================= GET PENDING TECHNICIAN REQUESTS ================= */

export const getPendingRequests = async (_req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from("technician_details")
      .select(
        `
        id,
        services,
        experience_years,
        profiles (
          first_name,
          last_name,
          phone,
          email,
          profile_photo
        )
      `
      )
      .eq("approval_status", "pending");

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json(data);
  } catch (err) {
    console.error("GET PENDING REQUESTS ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
};

/* ================= APPROVE TECHNICIAN ================= */

export const approveTechnician = async (req: Request, res: Response) => {
  await supabase
    .from("technician_details")
    .update({
      approval_status: "approved",
      status: "active",
    })
    .eq("id", req.params.id);

  res.json({ message: "Approved" });
};

/* ================= REJECT TECHNICIAN ================= */

export const rejectTechnician = async (req: Request, res: Response) => {
  await supabase
    .from("technician_details")
    .update({
      approval_status: "rejected",
      status: "inactive",
    })
    .eq("id", req.params.id);

  res.json({ message: "Rejected" });
};

/* ================= DEACTIVATE TECHNICIAN ================= */

export const deactivateTechnician = async (req: Request, res: Response) => {
  await supabase
    .from("technician_details")
    .update({ status: "inactive" })
    .eq("id", req.params.id);

  res.json({ message: "Deactivated" });
};


// VIEW
export const getTechnicianById = async (req: Request, res: Response) => {
  const { data, error } = await supabase
    .from("technician_details")
    .select(`
      id,
      services,
      status,
      approval_status,
      experience_years,
      promo_code,
      profiles (
        first_name,
        last_name,
        phone,
        email,
        profile_photo
      )
    `)
    .eq("id", req.params.id)
    .single();

  if (error) return res.status(404).json({ error: "Technician not found" });

  res.json(data);
};

// UPDATE
export const updateTechnician = async (req: Request, res: Response) => {
  const { services, status } = req.body;

  await supabase
    .from("technician_details")
    .update({ services, status })
    .eq("id", req.params.id);

  res.json({ message: "Technician updated" });
};

// DELETE
export const deleteTechnician = async (req: Request, res: Response) => {
  await supabase.from("technician_details").delete().eq("id", req.params.id);
  await supabase.from("profiles").delete().eq("id", req.params.id);

  res.json({ message: "Technician deleted" });
};