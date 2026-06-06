import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import { env } from "../config/env.js"

export const protect = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" })
    }

    const token = authHeader.split(" ")[1]

    if (!token || token === "null" || token === "undefined") {
      return res.status(401).json({ error: "Invalid token" })
    }

    // Use env.JWT_SECRET — single source of truth for the secret
    const decoded = jwt.verify(token, env.JWT_SECRET) as {
      id: string
      role: string
    }

    req.user = decoded
    next()
  } catch (err: any) {
    if (err?.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired — please log in again" })
    }
    return res.status(401).json({ error: "Invalid or expired token" })
  }
}
