"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryController = void 0;
const CategoryService_1 = require("../services/CategoryService");
const response_1 = require("../utils/response");
const errorHandler_1 = require("../middlewares/errorHandler");
class CategoryController {
}
exports.CategoryController = CategoryController;
_a = CategoryController;
CategoryController.createCategory = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { name, description, parentCategory } = req.body;
    const imageFile = req.file;
    const category = await CategoryService_1.CategoryService.createCategory({ name, description, parentCategory }, imageFile);
    return response_1.ResponseUtil.success(res, category, "Category created successfully", 201);
});
CategoryController.getAllCategories = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { page, limit, search, parentCategory } = req.query;
    const userRole = req.user?.role;
    const result = await CategoryService_1.CategoryService.getAllCategories({
        page: page ? parseInt(page) : undefined,
        limit: limit ? parseInt(limit) : undefined,
        search: search,
        parentCategory: parentCategory,
    }, userRole);
    return response_1.ResponseUtil.paginated(res, result.categories, result.pagination.page, result.pagination.limit, result.pagination.total, "Categories retrieved successfully");
});
CategoryController.getCategoryById = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return response_1.ResponseUtil.error(res, "Category ID is required", 400);
    }
    const userRole = req.user?.role;
    const category = await CategoryService_1.CategoryService.getCategoryById(id, userRole);
    return response_1.ResponseUtil.success(res, category, "Category retrieved successfully");
});
CategoryController.getCategoryBySlug = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { slug } = req.params;
    if (!slug) {
        return response_1.ResponseUtil.error(res, "Category slug is required", 400);
    }
    const userRole = req.user?.role;
    const category = await CategoryService_1.CategoryService.getCategoryBySlug(slug, userRole);
    return response_1.ResponseUtil.success(res, category, "Category retrieved successfully");
});
CategoryController.updateCategory = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    const imageFile = req.file;
    if (!id) {
        return response_1.ResponseUtil.error(res, "Category ID is required", 400);
    }
    const category = await CategoryService_1.CategoryService.updateCategory(id, updateData, imageFile);
    return response_1.ResponseUtil.success(res, category, "Category updated successfully");
});
CategoryController.deleteCategory = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return response_1.ResponseUtil.error(res, "Category ID is required", 400);
    }
    const result = await CategoryService_1.CategoryService.deleteCategory(id);
    return response_1.ResponseUtil.success(res, result, "Category deleted successfully");
});
CategoryController.toggleCategoryStatus = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return response_1.ResponseUtil.error(res, "Category ID is required", 400);
    }
    const category = await CategoryService_1.CategoryService.toggleCategoryStatus(id);
    return response_1.ResponseUtil.success(res, category, "Category status updated successfully");
});
CategoryController.getCategoryTree = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const userRole = req.user?.role;
    const categories = await CategoryService_1.CategoryService.getCategoryTree(userRole);
    return response_1.ResponseUtil.success(res, categories, "Category tree retrieved successfully");
});
//# sourceMappingURL=CategoryController.js.map