"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WishlistController = void 0;
const WishlistService_1 = require("../services/WishlistService");
const response_1 = require("../utils/response");
const errorHandler_1 = require("../middlewares/errorHandler");
class WishlistController {
}
exports.WishlistController = WishlistController;
_a = WishlistController;
WishlistController.getWishlist = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user._id;
    const wishlist = await WishlistService_1.WishlistService.getWishlist(userId.toString());
    return response_1.ResponseUtil.success(res, wishlist, "Wishlist retrieved successfully");
});
WishlistController.addToWishlist = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user._id;
    const { productId } = req.body;
    if (!productId) {
        throw (0, errorHandler_1.createError)("Product ID is required", 400);
    }
    const wishlist = await WishlistService_1.WishlistService.addToWishlist(userId.toString(), productId);
    return response_1.ResponseUtil.success(res, wishlist, "Product added to wishlist successfully");
});
WishlistController.removeFromWishlist = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user._id;
    const { productId } = req.params;
    if (!productId) {
        throw (0, errorHandler_1.createError)("Product ID is required", 400);
    }
    const wishlist = await WishlistService_1.WishlistService.removeFromWishlist(userId.toString(), productId);
    return response_1.ResponseUtil.success(res, wishlist, "Product removed from wishlist successfully");
});
WishlistController.clearWishlist = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user._id;
    const wishlist = await WishlistService_1.WishlistService.clearWishlist(userId.toString());
    return response_1.ResponseUtil.success(res, wishlist, "Wishlist cleared successfully");
});
WishlistController.checkWishlistStatus = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user._id;
    const { productId } = req.params;
    if (!productId) {
        throw (0, errorHandler_1.createError)("Product ID is required", 400);
    }
    const isInWishlist = await WishlistService_1.WishlistService.isInWishlist(userId.toString(), productId);
    return response_1.ResponseUtil.success(res, { isInWishlist }, "Wishlist status checked successfully");
});
WishlistController.getWishlistCount = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user._id;
    const count = await WishlistService_1.WishlistService.getWishlistCount(userId.toString());
    return response_1.ResponseUtil.success(res, { count }, "Wishlist count retrieved successfully");
});
WishlistController.deleteWishlist = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user._id;
    const { productId } = req.params;
    if (!productId) {
        throw (0, errorHandler_1.createError)("Product ID is required", 400);
    }
    const wishlist = await WishlistService_1.WishlistService.deleteWishlist(userId.toString(), productId);
    return response_1.ResponseUtil.success(res, wishlist, "Wishlist deleted successfully");
});
WishlistController.moveToCart = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user._id;
    const { productId } = req.params;
    const { size, color, sku } = req.body;
    if (!productId) {
        throw (0, errorHandler_1.createError)("Product ID is required", 400);
    }
    const result = await WishlistService_1.WishlistService.moveToCart(userId.toString(), productId, {
        size,
        color,
        sku,
    });
    return response_1.ResponseUtil.success(res, result, "Product moved to cart successfully");
});
//# sourceMappingURL=WishlistController.js.map