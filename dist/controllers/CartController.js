"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartController = void 0;
const CartService_1 = require("../services/CartService");
const response_1 = require("../utils/response");
const errorHandler_1 = require("../middlewares/errorHandler");
class CartController {
}
exports.CartController = CartController;
_a = CartController;
CartController.getCart = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const user = req.user;
    const cart = await CartService_1.CartService.getCart(user);
    return response_1.ResponseUtil.success(res, cart, "Cart retrieved successfully");
});
CartController.addToCart = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const user = req.user;
    const { totalAmount, items } = req.body;
    const cart = await CartService_1.CartService.addToCart(user, totalAmount, items);
    return response_1.ResponseUtil.success(res, cart, "Items added to cart successfully");
});
CartController.updateCartItem = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const user = req.user;
    const { totalAmount, items } = req.body;
    const cart = await CartService_1.CartService.updateCartItem(user, totalAmount, items);
    return response_1.ResponseUtil.success(res, cart, "Cart item updated successfully");
});
CartController.removeFromCart = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const user = req.user;
    const { productId, variantId } = req.params;
    if (!productId) {
        return response_1.ResponseUtil.error(res, "Product ID is required", 400);
    }
    if (!variantId) {
        return response_1.ResponseUtil.error(res, "Variant ID is required", 400);
    }
    const cart = await CartService_1.CartService.removeFromCart(user, productId, variantId);
    return response_1.ResponseUtil.success(res, cart, "Item removed from cart successfully");
});
CartController.removeFromCartWithoutVariant = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const user = req.user;
    const { productId } = req.params;
    if (!productId) {
        return response_1.ResponseUtil.error(res, "Product ID is required", 400);
    }
    const cart = await CartService_1.CartService.removeFromCart(user, productId);
    return response_1.ResponseUtil.success(res, cart, "Item removed from cart successfully");
});
CartController.clearCart = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const user = req.user;
    const cart = await CartService_1.CartService.clearCart(user);
    return response_1.ResponseUtil.success(res, cart, "Cart cleared successfully");
});
CartController.getCartSummary = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const user = req.user;
    const summary = await CartService_1.CartService.getCartSummary(user);
    return response_1.ResponseUtil.success(res, summary, "Cart summary retrieved successfully");
});
CartController.validateCart = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const user = req.user;
    const validation = await CartService_1.CartService.validateCartItems(user);
    return response_1.ResponseUtil.success(res, validation, "Cart validation completed");
});
//# sourceMappingURL=CartController.js.map