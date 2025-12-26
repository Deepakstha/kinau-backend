import { Response } from "express";
import { AuthRequest } from "../types";
import { ColorService } from "../services/ColorService";
import { ResponseUtil } from "../utils/response";
import { asyncHandler } from "../middlewares/errorHandler";

export class ColorController {
  static getAllColors = asyncHandler(
    async (req: AuthRequest, res: Response) => {
      const userRole = req.user?.role;
      const colors = await ColorService.getAllColors(userRole);

      return ResponseUtil.success(res, colors, "Colors retrieved successfully");
    }
  );

  static getColorById = asyncHandler(
    async (req: AuthRequest, res: Response) => {
      const { colorId } = req.params;

      if (!colorId) {
        return ResponseUtil.error(res, "Color ID is required", 400);
      }

      const color = await ColorService.getColorById(colorId);

      return ResponseUtil.success(res, color, "Color retrieved successfully");
    }
  );

  static createColor = asyncHandler(async (req: AuthRequest, res: Response) => {
    const colorData = req.body;
    const color = await ColorService.createColor(colorData);

    return ResponseUtil.success(res, color, "Color created successfully", 201);
  });

  static updateColor = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { colorId } = req.params;

    if (!colorId) {
      return ResponseUtil.error(res, "Color ID is required", 400);
    }

    const updateData = req.body;

    const color = await ColorService.updateColor(colorId, updateData);

    return ResponseUtil.success(res, color, "Color updated successfully");
  });

  static deleteColor = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { colorId } = req.params;

    if (!colorId) {
      return ResponseUtil.error(res, "Color ID is required", 400);
    }

    const result = await ColorService.deleteColor(colorId);

    return ResponseUtil.success(res, result, "Color deleted successfully");
  });

  static toggleColorStatus = asyncHandler(
    async (req: AuthRequest, res: Response) => {
      const { colorId } = req.params;

      if (!colorId) {
        return ResponseUtil.error(res, "Color ID is required", 400);
      }

      const userRole = req.user?.role;
      const color = await ColorService.toggleColorStatus(colorId);

      return ResponseUtil.success(
        res,
        color,
        "Color status updated successfully"
      );
    }
  );
}
