import { Response } from "express";
import { AuthRequest } from "../types";
import { SizeService } from "../services/SizeService";
import { ResponseUtil } from "../utils/response";
import { asyncHandler, createError } from "../middlewares/errorHandler";

export class SizeController {
  static getAllSizes = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userRole = req.user?.role;
    const sizes = await SizeService.getAllSizes(userRole);

    return ResponseUtil.success(res, sizes, "Sizes retrieved successfully");
  });

  static getSizeById = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { sizeId } = req.params;
    if (!sizeId) {
      throw createError("Size ID is required", 400);
    }
    const userRole = req.user?.role;
    const size = await SizeService.getSizeById(sizeId);

    return ResponseUtil.success(res, size, "Size retrieved successfully");
  });

  static createSize = asyncHandler(async (req: AuthRequest, res: Response) => {
    const sizeData = req.body;
    const size = await SizeService.createSize(sizeData);

    return ResponseUtil.success(res, size, "Size created successfully", 201);
  });

  static updateSize = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { sizeId } = req.params;
    const updateData = req.body;

    if (!sizeId) {
      throw createError("Size ID is required", 400);
    }
    const userRole = req.user?.role;
    const size = await SizeService.updateSize(sizeId, updateData);

    return ResponseUtil.success(res, size, "Size updated successfully");
  });

  static deleteSize = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { sizeId } = req.params;
    if (!sizeId) {
      throw createError("Size ID is required", 400);
    }
    const result = await SizeService.deleteSize(sizeId);

    return ResponseUtil.success(res, result, "Size deleted successfully");
  });

  static toggleSizeStatus = asyncHandler(
    async (req: AuthRequest, res: Response) => {
      const { sizeId } = req.params;
      if (!sizeId) {
        throw createError("Size ID is required", 400);
      }
      const userRole = req.user?.role;
      const size = await SizeService.toggleSizeStatus(sizeId);

      return ResponseUtil.success(
        res,
        size,
        "Size status updated successfully"
      );
    }
  );
}
