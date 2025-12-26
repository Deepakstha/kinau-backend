import { Response } from "express";
import { AuthRequest } from "../types";
import { CategoryService } from "../services/CategoryService";
import { ResponseUtil } from "../utils/response";
import { asyncHandler } from "../middlewares/errorHandler";

export class CategoryController {
  static createCategory = asyncHandler(
    async (req: AuthRequest, res: Response) => {
      const { name, description, parentCategory } = req.body;
      const imageFile = req.file;

      const category = await CategoryService.createCategory(
        { name, description, parentCategory },
        imageFile
      );

      return ResponseUtil.success(
        res,
        category,
        "Category created successfully",
        201
      );
    }
  );

  static getAllCategories = asyncHandler(
    async (req: AuthRequest, res: Response) => {
      const { page, limit, search, parentCategory } = req.query;
      const userRole = req.user?.role;

      const result = await CategoryService.getAllCategories(
        {
          page: page ? parseInt(page as string) : undefined,
          limit: limit ? parseInt(limit as string) : undefined,
          search: search as string,
          parentCategory: parentCategory as string,
        },
        userRole
      );

      return ResponseUtil.paginated(
        res,
        result.categories,
        result.pagination.page,
        result.pagination.limit,
        result.pagination.total,
        "Categories retrieved successfully"
      );
    }
  );

  static getCategoryById = asyncHandler(
    async (req: AuthRequest, res: Response) => {
      const { id } = req.params;

      if (!id) {
        return ResponseUtil.error(res, "Category ID is required", 400);
      }

      const userRole = req.user?.role;
      const category = await CategoryService.getCategoryById(id, userRole);

      return ResponseUtil.success(
        res,
        category,
        "Category retrieved successfully"
      );
    }
  );

  static getCategoryBySlug = asyncHandler(
    async (req: AuthRequest, res: Response) => {
      const { slug } = req.params;

      if (!slug) {
        return ResponseUtil.error(res, "Category slug is required", 400);
      }
      const userRole = req.user?.role;
      const category = await CategoryService.getCategoryBySlug(slug, userRole);

      return ResponseUtil.success(
        res,
        category,
        "Category retrieved successfully"
      );
    }
  );

  static updateCategory = asyncHandler(
    async (req: AuthRequest, res: Response) => {
      const { id } = req.params;
      const updateData = req.body;
      const imageFile = req.file;

      if (!id) {
        return ResponseUtil.error(res, "Category ID is required", 400);
      }

      const category = await CategoryService.updateCategory(
        id,
        updateData,
        imageFile
      );

      return ResponseUtil.success(
        res,
        category,
        "Category updated successfully"
      );
    }
  );

  static deleteCategory = asyncHandler(
    async (req: AuthRequest, res: Response) => {
      const { id } = req.params;

      if (!id) {
        return ResponseUtil.error(res, "Category ID is required", 400);
      }

      const result = await CategoryService.deleteCategory(id);

      return ResponseUtil.success(res, result, "Category deleted successfully");
    }
  );

  static toggleCategoryStatus = asyncHandler(
    async (req: AuthRequest, res: Response) => {
      const { id } = req.params;

      if (!id) {
        return ResponseUtil.error(res, "Category ID is required", 400);
      }

      const category = await CategoryService.toggleCategoryStatus(id);

      return ResponseUtil.success(
        res,
        category,
        "Category status updated successfully"
      );
    }
  );

  static getCategoryTree = asyncHandler(
    async (req: AuthRequest, res: Response) => {
      const userRole = req.user?.role;
      const categories = await CategoryService.getCategoryTree(userRole);

      return ResponseUtil.success(
        res,
        categories,
        "Category tree retrieved successfully"
      );
    }
  );
}
