import { Response } from "express";
import { AuthRequest } from "../types";
import { CartService } from "../services/CartService";
import { ResponseUtil } from "../utils/response";
import { asyncHandler } from "../middlewares/errorHandler";

export class CartController {
  static getCart = asyncHandler(async (req: AuthRequest, res: Response) => {
    const user = req.user;
    const cart = await CartService.getCart(user);

    return ResponseUtil.success(res, cart, "Cart retrieved successfully");
  });

  static addToCart = asyncHandler(async (req: AuthRequest, res: Response) => {
    const user = req.user;
    const { totalAmount, items } = req.body;

    const cart = await CartService.addToCart(user!, totalAmount, items);

    return ResponseUtil.success(res, cart, "Items added to cart successfully");
  });

  // TODO: update the cartItem
  static updateCartItem = asyncHandler(
    async (req: AuthRequest, res: Response) => {
      const user = req.user;
      const { totalAmount, items } = req.body;

      const cart = await CartService.updateCartItem(user!, totalAmount, items);

      return ResponseUtil.success(res, cart, "Cart item updated successfully");
    }
  );

  static removeFromCart = asyncHandler(
    async (req: AuthRequest, res: Response) => {
      const user = req.user;
      const { productId, variantId } = req.params;

      if (!productId) {
        return ResponseUtil.error(res, "Product ID is required", 400);
      }

      if (!variantId) {
        return ResponseUtil.error(res, "Variant ID is required", 400);
      }

      const cart = await CartService.removeFromCart(
        user!,
        productId,
        variantId
      );

      return ResponseUtil.success(
        res,
        cart,
        "Item removed from cart successfully"
      );
    }
  );

  static removeFromCartWithoutVariant = asyncHandler(
    async (req: AuthRequest, res: Response) => {
      const user = req.user;
      const { productId } = req.params;

      if (!productId) {
        return ResponseUtil.error(res, "Product ID is required", 400);
      }

      const cart = await CartService.removeFromCart(user!, productId);

      return ResponseUtil.success(
        res,
        cart,
        "Item removed from cart successfully"
      );
    }
  );

  static clearCart = asyncHandler(async (req: AuthRequest, res: Response) => {
    const user = req.user;
    const cart = await CartService.clearCart(user!);

    return ResponseUtil.success(res, cart, "Cart cleared successfully");
  });

  static getCartSummary = asyncHandler(
    async (req: AuthRequest, res: Response) => {
      const user = req.user;
      const summary = await CartService.getCartSummary(user!);

      return ResponseUtil.success(
        res,
        summary,
        "Cart summary retrieved successfully"
      );
    }
  );

  static validateCart = asyncHandler(
    async (req: AuthRequest, res: Response) => {
      const user = req.user;
      const validation = await CartService.validateCartItems(user!);

      return ResponseUtil.success(res, validation, "Cart validation completed");
    }
  );
}
