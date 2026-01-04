"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryService = void 0;
const Category_1 = require("../models/Category");
const errorHandler_1 = require("../middlewares/errorHandler");
const upload_1 = require("../utils/upload");
class CategoryService {
    static async createCategory(categoryData, imageFile) {
        let imageUrl;
        if (imageFile) {
            const uploadResult = await (0, upload_1.uploadToCloudinary)(imageFile, "categories");
            imageUrl = uploadResult.secure_url;
        }
        const category = new Category_1.Category({
            ...categoryData,
            image: imageUrl,
        });
        await category.save();
        return category;
    }
    static async getAllCategories(query, userRole) {
        const { page = 1, limit = 10, search, parentCategory } = query;
        const filter = {};
        if (userRole !== "admin") {
            filter.isActive = true;
        }
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
            ];
        }
        if (parentCategory !== undefined) {
            filter.parentCategory = parentCategory || null;
        }
        const skip = (page - 1) * limit;
        const [categories, total] = await Promise.all([
            Category_1.Category.find(filter)
                .populate("parentCategory", "name slug")
                .populate("subcategories")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Category_1.Category.countDocuments(filter),
        ]);
        return {
            categories,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        };
    }
    static async getCategoryById(id, userRole) {
        const filter = { _id: id };
        if (userRole !== "admin") {
            filter.isActive = true;
        }
        const category = await Category_1.Category.findOne(filter)
            .populate("parentCategory", "name slug")
            .populate("subcategories");
        if (!category) {
            throw (0, errorHandler_1.createError)("Category not found", 404);
        }
        return category;
    }
    static async getCategoryBySlug(slug, userRole) {
        const filter = { slug };
        if (userRole !== "admin") {
            filter.isActive = true;
        }
        const category = await Category_1.Category.findOne(filter)
            .populate("parentCategory", "name slug")
            .populate("subcategories");
        if (!category) {
            throw (0, errorHandler_1.createError)("Category not found", 404);
        }
        return category;
    }
    static async updateCategory(id, updateData, imageFile) {
        const category = await Category_1.Category.findById(id);
        if (!category) {
            throw (0, errorHandler_1.createError)("Category not found", 404);
        }
        if (imageFile) {
            if (category.image) {
                const publicId = category.image.split("/").pop()?.split(".")[0];
                if (publicId) {
                    await (0, upload_1.deleteFromCloudinary)(`categories/${publicId}`);
                }
            }
            const uploadResult = await (0, upload_1.uploadToCloudinary)(imageFile, "categories");
            updateData.image = uploadResult.secure_url;
        }
        const updatedCategory = await Category_1.Category.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        })
            .populate("parentCategory", "name slug")
            .populate("subcategories");
        return updatedCategory;
    }
    static async deleteCategory(id) {
        const category = await Category_1.Category.findById(id);
        if (!category) {
            throw (0, errorHandler_1.createError)("Category not found", 404);
        }
        const subcategories = await Category_1.Category.find({ parentCategory: id });
        if (subcategories.length > 0) {
            throw (0, errorHandler_1.createError)("Cannot delete category with subcategories", 400);
        }
        if (category.image) {
            const publicId = category.image.split("/").pop()?.split(".")[0];
            if (publicId) {
                await (0, upload_1.deleteFromCloudinary)(`categories/${publicId}`);
            }
        }
        await Category_1.Category.findByIdAndDelete(id);
        return { message: "Category deleted successfully" };
    }
    static async toggleCategoryStatus(id) {
        const category = await Category_1.Category.findById(id);
        if (!category) {
            throw (0, errorHandler_1.createError)("Category not found", 404);
        }
        category.isActive = !category.isActive;
        await category.save();
        return category;
    }
    static async getCategoryTree(userRole) {
        const filter = {};
        if (userRole !== "admin") {
            filter.isActive = true;
        }
        const categories = await Category_1.Category.find(filter)
            .populate("subcategories")
            .sort({ name: 1 });
        const rootCategories = categories.filter((cat) => !cat.parentCategory);
        return rootCategories;
    }
}
exports.CategoryService = CategoryService;
//# sourceMappingURL=CategoryService.js.map