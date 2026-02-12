import { Request, Response, NextFunction } from "express";

// export interface AuthRequest extends Request {
//   user?: { id: string };
// }

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  // DEV TOKEN FORMAT: dev-token-USER_ID
  if (!token.startsWith("dev-token-")) {
    return res.status(401).json({ error: "Invalid token" });
  }

  const userId = token.replace("dev-token-", "");

  req.user = { id: userId };
  next();
};
