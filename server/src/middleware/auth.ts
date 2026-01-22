import type { Request, Response, NextFunction } from "express";
import { AppError } from "./errorHandler.js";
import { verifyToken } from "../services/userService.js";

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      userId?: string;
      userEmail?: string;
    }
  }
}

export function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AppError(401, "Authentication required");
  }

  const token = authHeader.substring(7); // Remove "Bearer " prefix
  const decoded = verifyToken(token);

  if (!decoded) {
    throw new AppError(401, "Invalid or expired token");
  }

  req.userId = decoded.userId;
  req.userEmail = decoded.email;
  next();
}

