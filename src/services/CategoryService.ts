import { Category } from "../models/Category";
import { ICategory, PaginationQuery, MulterFile } from "../types";
import { createError } from "../middlewares/errorHandler";
import { uploadToCloudinary, deleteFromCloudinary } from "../utils/upload";

export class CategoryService {
  static async createCategory(
    categoryData: {
      name: string;
      description?: string;
      parentCategory?: string;
    },
    imageFile?: MulterFile
  ) {
    let imageUrl: string | undefined;

    if (imageFile) {
      const uploadResult = await uploadToCloudinary(imageFile, "categories");
      imageUrl = uploadResult.secure_url;
    }

    const category = new Category({
      ...categoryData,
      image: imageUrl,
    });

    await category.save();
    return category;
  }

  static async getAllCategories(
    query: PaginationQuery & { parentCategory?: string },
    userRole?: string
  ) {
    const { page = 1, limit = 10, search, parentCategory } = query;

    const filter: any = {};

    // Only admins can see inactive records, everyone else (including public) sees only active
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
      Category.find(filter)
        .populate("parentCategory", "name slug")
        .populate("subcategories")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Category.countDocuments(filter),
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

  static async getCategoryById(id: string, userRole?: string) {
    const filter: any = { _id: id };

    // Only admins can see inactive records, everyone else (including public) sees only active
    if (userRole !== "admin") {
      filter.isActive = true;
    }

    const category = await Category.findOne(filter)
      .populate("parentCategory", "name slug")
      .populate("subcategories");

    if (!category) {
      throw createError("Category not found", 404);
    }

    return category;
  }

  static async getCategoryBySlug(slug: string, userRole?: string) {
    const filter: any = { slug };

    // Only admins can see inactive records, everyone else (including public) sees only active
    if (userRole !== "admin") {
      filter.isActive = true;
    }

    const category = await Category.findOne(filter)
      .populate("parentCategory", "name slug")
      .populate("subcategories");

    if (!category) {
      throw createError("Category not found", 404);
    }

    return category;
  }

  static async updateCategory(
    id: string,
    updateData: Partial<ICategory>,
    imageFile?: MulterFile
  ) {
    const category = await Category.findById(id);
    if (!category) {
      throw createError("Category not found", 404);
    }

    if (imageFile) {
      // Delete old image if exists
      if (category.image) {
        const publicId = category.image.split("/").pop()?.split(".")[0];
        if (publicId) {
          await deleteFromCloudinary(`categories/${publicId}`);
        }
      }

      // Upload new image
      const uploadResult = await uploadToCloudinary(imageFile, "categories");
      updateData.image = uploadResult.secure_url;
    }

    const updatedCategory = await Category.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate("parentCategory", "name slug")
      .populate("subcategories");

    return updatedCategory;
  }

  static async deleteCategory(id: string) {
    const category = await Category.findById(id);
    if (!category) {
      throw createError("Category not found", 404);
    }

    // Check if category has subcategories
    const subcategories = await Category.find({ parentCategory: id });
    if (subcategories.length > 0) {
      throw createError("Cannot delete category with subcategories", 400);
    }

    // Delete image from Cloudinary if exists
    if (category.image) {
      const publicId = category.image.split("/").pop()?.split(".")[0];
      if (publicId) {
        await deleteFromCloudinary(`categories/${publicId}`);
      }
    }

    await Category.findByIdAndDelete(id);
    return { message: "Category deleted successfully" };
  }

  static async toggleCategoryStatus(id: string) {
    const category = await Category.findById(id);
    if (!category) {
      throw createError("Category not found", 404);
    }

    category.isActive = !category.isActive;
    await category.save();

    return category;
  }

  static async getCategoryTree(userRole?: string) {
    const filter: any = {};

    // Only admins can see inactive records, everyone else (including public) sees only active
    if (userRole !== "admin") {
      filter.isActive = true;
    }

    const categories = await Category.find(filter)
      .populate("subcategories")
      .sort({ name: 1 });

    // Build tree structure
    const rootCategories = categories.filter((cat) => !cat.parentCategory);
    return rootCategories;
  }
}
