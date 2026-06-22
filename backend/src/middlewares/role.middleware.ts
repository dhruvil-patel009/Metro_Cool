import { Request,Response, NextFunction } from "express";
import { supabase } from "../utils/supabase.js";

export const authorize =
  (...allowedRoles: ("user" | "technician" | "admin")[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", req.user!.id)
        .single();

      if (error || !data) {
        return res.status(401).json({ error: "User not found" });
      }

      if (!allowedRoles.includes(data.role)) {
        return res.status(403).json({ error: "Forbidden" });
      }

      next();
    } catch (err) {
      console.error("AUTHORIZE ERROR:", err);
      return res.status(500).json({ error: "Authorization check failed" });
    }
  };
