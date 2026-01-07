// middleware/auth.middleware.ts
import { Request, Response, NextFunction } from "express";
import { supabase } from "../utils/supabase.js";

export interface AuthRequest extends Request {
  user?: any;
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
    const authHeader = req.headers.authorization;

  const token = authHeader?.split(" ")[1];


      // 🔐 Always check token first
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    /**
   * 🔹 DEV MODE TOKEN SUPPORT
   */
  if (token.startsWith("dev-token-")) {
    const userId = token.replace("dev-token-", "");

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error || !data) {
      return res.status(401).json({ error: "Invalid dev token" });
    }

    req.user = data;
    return next();
  }

   /**
   * 🔹 PROD MODE (REAL SUPABASE JWT)
   */

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  const { data, error } = await supabase.auth.getUser(token);

  if (error) {
    return res.status(401).json({ error: "Invalid token" });
  }

  req.user = data.user;
  next();
};
