import { Request, Response, NextFunction } from "express";
import { ResponseUtil } from "../utils/response";
import { config } from "../config";

export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const createError = (
  message: string,
  statusCode: number = 500
): AppError => {
  return new AppError(message, statusCode);
};

export const globalErrorHandler = (
  error: any,
  res: Response
): Response | void => {
  let { statusCode = 500, message } = error;

  // Handle specific error types
  if (error.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(error.errors)
      .map((err: any) => err.message)
      .join(", ");
  }

  if (error.name === "CastError") {
    statusCode = 400;
    message = "Invalid ID format";
  }

  if (error.code === 11000) {
    statusCode = 400;
    const field = Object.keys(error.keyValue)[0];
    message = `${field} already exists`;
  }

  if (error.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  }

  if (error.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired";
  }

  // Log error in development
  if (config.NODE_ENV === "development") {
    console.error("Error:", error);
  }

  return ResponseUtil.error(res, message, statusCode);
};

export const notFoundHandler = (req: Request, res: Response): Response => {
  return ResponseUtil.notFound(res, `Route ${req.originalUrl} not found`);
};

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
