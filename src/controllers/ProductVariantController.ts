import { Response } from "express";
import { AuthRequest } from "../types";
import { ProductVariantService } from "../services/ProductVariantService";
import { ResponseUtil } from "../utils/response";
import { asyncHandler, createError } from "../middlewares/errorHandler";

export class ProductVariantController {
  static createVariant = asyncHandler(
    async (req: AuthRequest, res: Response) => {
      const { productId } = req.params;
      const variantData = req.body;
      const imageFile = req.file;

      if (!productId) {
        throw createError("Product ID is required", 400);
      }

      const variant = await ProductVariantService.createVariant(
        productId,
        variantData,
        imageFile
      );

      return ResponseUtil.success(
        res,
        variant,
        "Product variant created successfully",
        201
      );
    }
  );

  static getVariantsByProduct = asyncHandler(
    async (req: AuthRequest, res: Response) => {
      const { productId } = req.params;
      const userRole = req.user?.role;

      if (!productId) {
        throw createError("Product ID is required", 400);
      }

      const variants = await ProductVariantService.getVariantsByProduct(
        productId,
        userRole
      );

      return ResponseUtil.success(
        res,
        variants,
        "Product variants retrieved successfully"
      );
    }
  );

  static getVariantById = asyncHandler(
    async (req: AuthRequest, res: Response) => {
      const { variantId } = req.params;
      const userRole = req.user?.role;

      if (!variantId) {
        throw createError("Variant ID is required", 400);
      }

      const variant = await ProductVariantService.getVariantById(
        variantId,
        userRole
      );

      return ResponseUtil.success(
        res,
        variant,
        "Product variant retrieved successfully"
      );
    }
  );

  static updateVariant = asyncHandler(
    async (req: AuthRequest, res: Response) => {
      const { variantId } = req.params;
      const updateData = req.body;
      const imageFile = req.file;

      if (!variantId) {
        throw createError("Variant ID is required", 400);
      }

      const variant = await ProductVariantService.updateVariant(
        variantId,
        updateData,
        imageFile
      );

      return ResponseUtil.success(
        res,
        variant,
        "Product variant updated successfully"
      );
    }
  );

  static deleteVariant = asyncHandler(
    async (req: AuthRequest, res: Response) => {
      const { variantId } = req.params;

      if (!variantId) {
        throw createError("Variant ID is required", 400);
      }

      const result = await ProductVariantService.deleteVariant(variantId);

      return ResponseUtil.success(
        res,
        result,
        "Product variant deleted successfully"
      );
    }
  );

  static toggleVariantStatus = asyncHandler(
    async (req: AuthRequest, res: Response) => {
      const { variantId } = req.params;

      if (!variantId) {
        throw createError("Variant ID is required", 400);
      }

      const variant = await ProductVariantService.toggleVariantStatus(
        variantId
      );

      return ResponseUtil.success(
        res,
        variant,
        "Product variant status updated successfully"
      );
    }
  );

  static updateStock = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { variantId } = req.params;
    const { stock } = req.body;

    if (!variantId) {
      throw createError("Variant ID is required", 400);
    }

    if (typeof stock !== "number" || stock < 0) {
      throw createError("Valid stock quantity is required", 400);
    }

    const variant = await ProductVariantService.updateStock(variantId, stock);

    return ResponseUtil.success(
      res,
      variant,
      "Product variant stock updated successfully"
    );
  });
}
