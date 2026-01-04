"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const ProductService_1 = require("../services/ProductService");
const response_1 = require("../utils/response");
const errorHandler_1 = require("../middlewares/errorHandler");
class ProductController {
}
exports.ProductController = ProductController;
_a = ProductController;
ProductController.createProduct = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const productData = req.body;
    const files = req.files;
    const mainImages = files?.mainImages;
    const product = await ProductService_1.ProductService.createProduct(productData, mainImages);
    return response_1.ResponseUtil.success(res, product, "Product created successfully", 201);
});
ProductController.getAllProducts = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { page, limit, search, category, minPrice, maxPrice, featured, inStock, brand, tags, sort, } = req.query;
    const userRole = req.user?.role;
    const result = await ProductService_1.ProductService.getAllProducts({
        page: page ? parseInt(page) : undefined,
        limit: limit ? parseInt(limit) : undefined,
        search: search,
        category: category,
        minPrice: minPrice ? parseFloat(minPrice) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
        featured: featured ? featured === "true" : undefined,
        inStock: inStock ? inStock === "true" : undefined,
        brand: brand,
        tags: tags ? tags.split(",") : undefined,
        sort: sort,
    }, userRole);
    return response_1.ResponseUtil.paginated(res, result.products, result.pagination.page, result.pagination.limit, result.pagination.total, "Products retrieved successfully");
});
ProductController.getProductById = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return response_1.ResponseUtil.error(res, "Product ID is required", 400);
    }
    const userRole = req.user?.role;
    const product = await ProductService_1.ProductService.getProductById(id, userRole);
    return response_1.ResponseUtil.success(res, product, "Product retrieved successfully");
});
ProductController.getProductBySlug = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { slug } = req.params;
    if (!slug) {
        return response_1.ResponseUtil.error(res, "Product slug is required", 400);
    }
    const userRole = req.user?.role;
    const product = await ProductService_1.ProductService.getProductBySlug(slug, userRole);
    return response_1.ResponseUtil.success(res, product, "Product retrieved successfully");
});
ProductController.updateProduct = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return response_1.ResponseUtil.error(res, "Product ID is required", 400);
    }
    const updateData = req.body;
    const files = req.files;
    const mainImages = files?.mainImages;
    const product = await ProductService_1.ProductService.updateProduct(id, updateData, mainImages);
    return response_1.ResponseUtil.success(res, product, "Product updated successfully");
});
ProductController.deleteProduct = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return response_1.ResponseUtil.error(res, "Product ID is required", 400);
    }
    const result = await ProductService_1.ProductService.deleteProduct(id);
    return response_1.ResponseUtil.success(res, result, "Product deleted successfully");
});
ProductController.toggleProductStatus = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return response_1.ResponseUtil.error(res, "Product ID is required", 400);
    }
    const product = await ProductService_1.ProductService.toggleProductStatus(id);
    return response_1.ResponseUtil.success(res, product, "Product status updated successfully");
});
ProductController.toggleFeaturedStatus = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return response_1.ResponseUtil.error(res, "Product ID is required", 400);
    }
    const product = await ProductService_1.ProductService.toggleFeaturedStatus(id);
    return response_1.ResponseUtil.success(res, product, "Product featured status updated successfully");
});
ProductController.updateStock = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return response_1.ResponseUtil.error(res, "Product ID is required", 400);
    }
    const { sku, stock } = req.body;
    const product = await ProductService_1.ProductService.updateStock(id, sku, stock);
    return response_1.ResponseUtil.success(res, product, "Product stock updated successfully");
});
ProductController.getFeaturedProducts = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { limit } = req.query;
    const userRole = req.user?.role;
    const products = await ProductService_1.ProductService.getFeaturedProducts(limit ? parseInt(limit) : undefined, userRole);
    return response_1.ResponseUtil.success(res, products, "Featured products retrieved successfully");
});
ProductController.getRelatedProducts = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return response_1.ResponseUtil.error(res, "Product ID is required", 400);
    }
    const { limit } = req.query;
    const userRole = req.user?.role;
    const products = await ProductService_1.ProductService.getRelatedProducts(id, limit ? parseInt(limit) : undefined, userRole);
    return response_1.ResponseUtil.success(res, products, "Related products retrieved successfully");
});
ProductController.searchProducts = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { q, limit } = req.query;
    if (!q) {
        return response_1.ResponseUtil.error(res, "Search query is required", 400);
    }
    const userRole = req.user?.role;
    const products = await ProductService_1.ProductService.searchProducts(q, limit ? parseInt(limit) : undefined, userRole);
    return response_1.ResponseUtil.success(res, products, "Search results retrieved successfully");
});
//# sourceMappingURL=ProductController.js.map