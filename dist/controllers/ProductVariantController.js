"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductVariantController = void 0;
const ProductVariantService_1 = require("../services/ProductVariantService");
const response_1 = require("../utils/response");
const errorHandler_1 = require("../middlewares/errorHandler");
class ProductVariantController {
}
exports.ProductVariantController = ProductVariantController;
_a = ProductVariantController;
ProductVariantController.createVariant = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { productId } = req.params;
    const variantData = req.body;
    const imageFile = req.file;
    if (!productId) {
        throw (0, errorHandler_1.createError)("Product ID is required", 400);
    }
    const variant = await ProductVariantService_1.ProductVariantService.createVariant(productId, variantData, imageFile);
    return response_1.ResponseUtil.success(res, variant, "Product variant created successfully", 201);
});
ProductVariantController.getVariantsByProduct = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { productId } = req.params;
    const userRole = req.user?.role;
    if (!productId) {
        throw (0, errorHandler_1.createError)("Product ID is required", 400);
    }
    const variants = await ProductVariantService_1.ProductVariantService.getVariantsByProduct(productId, userRole);
    return response_1.ResponseUtil.success(res, variants, "Product variants retrieved successfully");
});
ProductVariantController.getVariantById = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { variantId } = req.params;
    const userRole = req.user?.role;
    if (!variantId) {
        throw (0, errorHandler_1.createError)("Variant ID is required", 400);
    }
    const variant = await ProductVariantService_1.ProductVariantService.getVariantById(variantId, userRole);
    return response_1.ResponseUtil.success(res, variant, "Product variant retrieved successfully");
});
ProductVariantController.updateVariant = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { variantId } = req.params;
    const updateData = req.body;
    const imageFile = req.file;
    if (!variantId) {
        throw (0, errorHandler_1.createError)("Variant ID is required", 400);
    }
    const variant = await ProductVariantService_1.ProductVariantService.updateVariant(variantId, updateData, imageFile);
    return response_1.ResponseUtil.success(res, variant, "Product variant updated successfully");
});
ProductVariantController.deleteVariant = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { variantId } = req.params;
    if (!variantId) {
        throw (0, errorHandler_1.createError)("Variant ID is required", 400);
    }
    const result = await ProductVariantService_1.ProductVariantService.deleteVariant(variantId);
    return response_1.ResponseUtil.success(res, result, "Product variant deleted successfully");
});
ProductVariantController.toggleVariantStatus = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { variantId } = req.params;
    if (!variantId) {
        throw (0, errorHandler_1.createError)("Variant ID is required", 400);
    }
    const variant = await ProductVariantService_1.ProductVariantService.toggleVariantStatus(variantId);
    return response_1.ResponseUtil.success(res, variant, "Product variant status updated successfully");
});
ProductVariantController.updateStock = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { variantId } = req.params;
    const { stock } = req.body;
    if (!variantId) {
        throw (0, errorHandler_1.createError)("Variant ID is required", 400);
    }
    if (typeof stock !== "number" || stock < 0) {
        throw (0, errorHandler_1.createError)("Valid stock quantity is required", 400);
    }
    const variant = await ProductVariantService_1.ProductVariantService.updateStock(variantId, stock);
    return response_1.ResponseUtil.success(res, variant, "Product variant stock updated successfully");
});
//# sourceMappingURL=ProductVariantController.js.map