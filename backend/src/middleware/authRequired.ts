import type { NextFunction, Request, Response } from "express";

import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      auth?: { userId: number };
    }
  }
}

export const authRequired = (req: Request, res: Response, next: NextFunction) => {
  const header = req.header("authorization");
  if (!header || !header.toLowerCase().startsWith("bearer ")) {
    res.status(401).json({ status: "error", message: "Missing bearer token" });
    return;
  }

  const token = header.slice("bearer ".length).trim();
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    res.status(500).json({ status: "error", message: "Server misconfigured (JWT_SECRET)" });
    return;
  }

  try {
    const payload = jwt.verify(token, secret) as jwt.JwtPayload;
    const sub = payload?.sub;
    const userId = typeof sub === "string" ? Number(sub) : typeof sub === "number" ? sub : NaN;
    if (!Number.isFinite(userId)) {
      res.status(401).json({ status: "error", message: "Invalid token" });
      return;
    }

    req.auth = { userId };
    next();
  } catch {
    res.status(401).json({ status: "error", message: "Invalid token" });
  }
};
