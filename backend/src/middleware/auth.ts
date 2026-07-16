import type { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwt";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No autenticado" });
  }

  const token = authHeader.slice("Bearer ".length);

  try {
    const payload = verifyToken(token);
    req.userId = payload.sub;
    req.userEmail = payload.email;
    return next();
  } catch (error) {
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
}
