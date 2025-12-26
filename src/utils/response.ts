import { Response } from "express";
import { ApiResponse } from "@/types";

export class ResponseUtil {
  static success<T>(
    res: Response,
    data: T,
    message: string = "Success",
    statusCode: number = 200
  ): Response {
    const response: ApiResponse<T> = {
      success: true,
      message,
      data,
    };
    return res.status(statusCode).json(response);
  }

  static error(
    res: Response,
    message: string = "Internal Server Error",
    statusCode: number = 500,
    errors?: any[]
  ): Response {
    const response: ApiResponse = {
      success: false,
      message,
      error: message,
      ...(errors && { errors }),
    };
    return res.status(statusCode).json(response);
  }

  static validationError(
    res: Response,
    errors: any[],
    message: string = "Validation failed"
  ): Response {
    const response: ApiResponse = {
      success: false,
      message,
      errors,
    };
    return res.status(400).json(response);
  }

  static notFound(
    res: Response,
    message: string = "Resource not found"
  ): Response {
    return this.error(res, message, 404);
  }

  static unauthorized(
    res: Response,
    message: string = "Unauthorized access"
  ): Response {
    return this.error(res, message, 401);
  }

  static forbidden(
    res: Response,
    message: string = "Access forbidden"
  ): Response {
    return this.error(res, message, 403);
  }

  static paginated<T>(
    res: Response,
    data: T[],
    page: number,
    limit: number,
    total: number,
    message: string = "Success"
  ): Response {
    const pages = Math.ceil(total / limit);
    const response: ApiResponse<T[]> = {
      success: true,
      message,
      data,
      pagination: {
        page,
        limit,
        total,
        pages,
      },
    };
    return res.status(200).json(response);
  }
}
