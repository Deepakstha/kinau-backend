import { Response } from "express";
import { AuthRequest, MulterFile } from "../types";
import { ProductService } from "../services/ProductService";
import { ResponseUtil } from "../utils/response";
import { asyncHandler } from "../middlewares/errorHandler";

export class ProductController {
  static createProduct = asyncHandler(
    async (req: AuthRequest, res: Response) => {
      const productData = req.body;
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };

      const mainImages = files?.mainImages;

      const product = await ProductService.createProduct(
        productData,
        mainImages
      );

      return ResponseUtil.success(
        res,
        product,
        "Product created successfully",
        201
      );
    }
  );

  static getAllProducts = asyncHandler(
    async (req: AuthRequest, res: Response) => {
      const {
        page,
        limit,
        search,
        category,
        minPrice,
        maxPrice,
        featured,
        inStock,
        brand,
        tags,
        sort,
      } = req.query;

      const userRole = req.user?.role;
      const result = await ProductService.getAllProducts(
        {
          page: page ? parseInt(page as string) : undefined,
          limit: limit ? parseInt(limit as string) : undefined,
          search: search as string,
          category: category as string,
          minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
          maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
          featured: featured ? featured === "true" : undefined,
          inStock: inStock ? inStock === "true" : undefined,
          brand: brand as string,
          tags: tags ? (tags as string).split(",") : undefined,
          sort: sort as string,
        },
        userRole
      );

      return ResponseUtil.paginated(
        res,
        result.products,
        result.pagination.page,
        result.pagination.limit,
        result.pagination.total,
        "Products retrieved successfully"
      );
    }
  );

  static getProductById = asyncHandler(
    async (req: AuthRequest, res: Response) => {
      const { id } = req.params;

      if (!id) {
        return ResponseUtil.error(res, "Product ID is required", 400);
      }

      const userRole = req.user?.role;
      const product = await ProductService.getProductById(id, userRole);

      return ResponseUtil.success(
        res,
        product,
        "Product retrieved successfully"
      );
    }
  );

  static getProductBySlug = asyncHandler(
    async (req: AuthRequest, res: Response) => {
      const { slug } = req.params;

      if (!slug) {
        return ResponseUtil.error(res, "Product slug is required", 400);
      }

      const userRole = req.user?.role;
      const product = await ProductService.getProductBySlug(slug, userRole);

      return ResponseUtil.success(
        res,
        product,
        "Product retrieved successfully"
      );
    }
  );

  static updateProduct = asyncHandler(
    async (req: AuthRequest, res: Response) => {
      const { id } = req.params;

      if (!id) {
        return ResponseUtil.error(res, "Product ID is required", 400);
      }

      const updateData = req.body;

      const files = req.files as { [fieldname: string]: Express.Multer.File[] };

      const mainImages = files?.mainImages;

      const product = await ProductService.updateProduct(
        id,
        updateData,
        mainImages
      );

      return ResponseUtil.success(res, product, "Product updated successfully");
    }
  );

  static deleteProduct = asyncHandler(
    async (req: AuthRequest, res: Response) => {
      const { id } = req.params;

      if (!id) {
        return ResponseUtil.error(res, "Product ID is required", 400);
      }

      const result = await ProductService.deleteProduct(id);

      return ResponseUtil.success(res, result, "Product deleted successfully");
    }
  );

  static toggleProductStatus = asyncHandler(
    async (req: AuthRequest, res: Response) => {
      const { id } = req.params;

      if (!id) {
        return ResponseUtil.error(res, "Product ID is required", 400);
      }

      const product = await ProductService.toggleProductStatus(id);

      return ResponseUtil.success(
        res,
        product,
        "Product status updated successfully"
      );
    }
  );

  static toggleFeaturedStatus = asyncHandler(
    async (req: AuthRequest, res: Response) => {
      const { id } = req.params;

      if (!id) {
        return ResponseUtil.error(res, "Product ID is required", 400);
      }

      const product = await ProductService.toggleFeaturedStatus(id);

      return ResponseUtil.success(
        res,
        product,
        "Product featured status updated successfully"
      );
    }
  );

  static updateStock = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    if (!id) {
      return ResponseUtil.error(res, "Product ID is required", 400);
    }

    const { sku, stock } = req.body;

    const product = await ProductService.updateStock(id, sku, stock);

    return ResponseUtil.success(
      res,
      product,
      "Product stock updated successfully"
    );
  });

  static getFeaturedProducts = asyncHandler(
    async (req: AuthRequest, res: Response) => {
      const { limit } = req.query;
      const userRole = req.user?.role;
      const products = await ProductService.getFeaturedProducts(
        limit ? parseInt(limit as string) : undefined,
        userRole
      );

      return ResponseUtil.success(
        res,
        products,
        "Featured products retrieved successfully"
      );
    }
  );

  static getRelatedProducts = asyncHandler(
    async (req: AuthRequest, res: Response) => {
      const { id } = req.params;

      if (!id) {
        return ResponseUtil.error(res, "Product ID is required", 400);
      }

      const { limit } = req.query;
      const userRole = req.user?.role;

      const products = await ProductService.getRelatedProducts(
        id,
        limit ? parseInt(limit as string) : undefined,
        userRole
      );

      return ResponseUtil.success(
        res,
        products,
        "Related products retrieved successfully"
      );
    }
  );

  static searchProducts = asyncHandler(
    async (req: AuthRequest, res: Response) => {
      const { q, limit } = req.query;

      if (!q) {
        return ResponseUtil.error(res, "Search query is required", 400);
      }

      const userRole = req.user?.role;
      const products = await ProductService.searchProducts(
        q as string,
        limit ? parseInt(limit as string) : undefined,
        userRole
      );

      return ResponseUtil.success(
        res,
        products,
        "Search results retrieved successfully"
      );
    }
  );
}
