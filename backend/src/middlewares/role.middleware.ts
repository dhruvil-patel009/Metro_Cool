import { Response, NextFunction } from "express";
import { supabase } from "../utils/supabase.js";
import { AuthRequest } from "./auth.middleware.js";

export const authorize =
  (role: "user" | "technician" | "admin") =>
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { data } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", req.user.id)
      .single();

    if (data?.role !== role)
      return res.status(403).json({ error: "Forbidden" });

    next();
  };
