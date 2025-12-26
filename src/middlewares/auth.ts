import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { AuthRequest, JWTPayload } from "../types";
import { ResponseUtil } from "../utils/response";
import { config } from "../config";
import { asyncHandler } from "./errorHandler";

export const authenticate = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return ResponseUtil.unauthorized(res, "Access token required");
    }

    try {
      const decoded = jwt.verify(token, config.JWT_SECRET) as JWTPayload;
      const user = await User.findById(decoded.userId).select("-password");

      if (!user) {
        return ResponseUtil.unauthorized(res, "User not found");
      }

      if (!user.isActive) {
        return ResponseUtil.unauthorized(res, "Account is deactivated");
      }

      req.user = user;
      return next();
    } catch (error) {
      return ResponseUtil.unauthorized(res, "Invalid token");
    }
  }
);

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return ResponseUtil.unauthorized(res, "Authentication required");
    }

    if (!roles.includes(req.user.role)) {
      return ResponseUtil.forbidden(res, "Insufficient permissions");
    }

    return next();
  };
};

export const optionalAuth = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (token) {
      try {
        const decoded = jwt.verify(token, config.JWT_SECRET) as JWTPayload;
        const user = await User.findById(decoded.userId).select("-password");

        if (user && user.isActive) {
          req.user = user;
        }
      } catch (error) {
        // Ignore token errors for optional auth
      }
    }

    return next();
  }
);
