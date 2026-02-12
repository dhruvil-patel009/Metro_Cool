import { Request,Response, NextFunction } from "express";
import { supabase } from "../utils/supabase.js";
// import { AuthRequest } from "./auth.middleware.js";

export const authorize =
  (...allowedRoles: ("user" | "technician" | "admin")[]) =>
  async (req: Request, res: Response, next: NextFunction) => {

     const userId = req.user.id;

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
  };
