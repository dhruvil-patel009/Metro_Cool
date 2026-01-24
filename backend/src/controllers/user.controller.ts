import { Request, Response } from "express";
import { supabase } from "../utils/supabase.js";

/**
 * GET CURRENT USER PROFILE
 * GET /api/user/me
 */
export const getMyProfile = async (req: Request, res: Response) => {
  try {
    const userId = 1;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    

    const { data, error } = await supabase
      .from("users")
      .select(`
        id,
        first_name,
        last_name,
        phone,
        email,
        role,
        created_at
      `)
      .eq("id", userId)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      id: data.id,
      firstName: data.first_name,
      lastName: data.last_name,
      phone: data.phone,
      email: data.email,
      role: data.role,
      createdAt: data.created_at,
    });
  } catch (err) {
    console.error("GET PROFILE ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const getMe = async (req: any, res: Response) => {
    res.setHeader("Cache-Control", "no-store")

  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  const userId = req.user.id

  const { data: profile, error } = await supabase
    .from("profiles")
    .select(`
      id,
      role,
      first_name,
      last_name,
      phone
    `)
    .eq("id", userId)
    .eq("role", "user")
    .single()

  if (error || !profile) {
    return res.status(404).json({ message: "User not found" })
  }

  res.json(profile)
}