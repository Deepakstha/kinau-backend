import { Response } from "express";
import { AuthRequest } from "../types";
import { WishlistService } from "../services/WishlistService";
import { ResponseUtil } from "../utils/response";
import { asyncHandler, createError } from "../middlewares/errorHandler";

export class WishlistController {
  static getWishlist = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!._id;
    const wishlist = await WishlistService.getWishlist(userId.toString());

    return ResponseUtil.success(
      res,
      wishlist,
      "Wishlist retrieved successfully"
    );
  });

  static addToWishlist = asyncHandler(
    async (req: AuthRequest, res: Response) => {
      const userId = req.user!._id;
      const { productId } = req.body;

      if (!productId) {
        throw createError("Product ID is required", 400);
      }

      const wishlist = await WishlistService.addToWishlist(
        userId.toString(),
        productId
      );

      return ResponseUtil.success(
        res,
        wishlist,
        "Product added to wishlist successfully"
      );
    }
  );

  static removeFromWishlist = asyncHandler(
    async (req: AuthRequest, res: Response) => {
      const userId = req.user!._id;
      const { productId } = req.params;

      if (!productId) {
        throw createError("Product ID is required", 400);
      }

      const wishlist = await WishlistService.removeFromWishlist(
        userId.toString(),
        productId
      );

      return ResponseUtil.success(
        res,
        wishlist,
        "Product removed from wishlist successfully"
      );
    }
  );

  static clearWishlist = asyncHandler(
    async (req: AuthRequest, res: Response) => {
      const userId = req.user!._id;
      const wishlist = await WishlistService.clearWishlist(userId.toString());

      return ResponseUtil.success(
        res,
        wishlist,
        "Wishlist cleared successfully"
      );
    }
  );

  static checkWishlistStatus = asyncHandler(
    async (req: AuthRequest, res: Response) => {
      const userId = req.user!._id;
      const { productId } = req.params;

      if (!productId) {
        throw createError("Product ID is required", 400);
      }
      const isInWishlist = await WishlistService.isInWishlist(
        userId.toString(),
        productId
      );

      return ResponseUtil.success(
        res,
        { isInWishlist },
        "Wishlist status checked successfully"
      );
    }
  );

  static getWishlistCount = asyncHandler(
    async (req: AuthRequest, res: Response) => {
      const userId = req.user!._id;
      const count = await WishlistService.getWishlistCount(userId.toString());

      return ResponseUtil.success(
        res,
        { count },
        "Wishlist count retrieved successfully"
      );
    }
  );

  // TODO: need to implement deletion of wishlist
  static deleteWishlist = asyncHandler(
    async (req: AuthRequest, res: Response) => {
      const userId = req.user!._id;
      const { productId } = req.params;

      if (!productId) {
        throw createError("Product ID is required", 400);
      }

      const wishlist = await WishlistService.deleteWishlist(
        userId.toString(),
        productId
      );

      return ResponseUtil.success(
        res,
        wishlist,
        "Wishlist deleted successfully"
      );
    }
  );

  static moveToCart = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!._id;
    const { productId } = req.params;
    const { size, color, sku } = req.body;

    if (!productId) {
      throw createError("Product ID is required", 400);
    }

    const result = await WishlistService.moveToCart(
      userId.toString(),
      productId,
      {
        size,
        color,
        sku,
      }
    );

    return ResponseUtil.success(
      res,
      result,
      "Product moved to cart successfully"
    );
  });
}
