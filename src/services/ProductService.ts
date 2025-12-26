import { createError } from "../middlewares/errorHandler";
import { Product } from "../models/Product";
import { ProductVariant } from "../models/ProductVariant";
import { IProduct, MulterFile, PaginationQuery } from "../types";
import {
  deleteFromCloudinary,
  uploadMultipleToCloudinary,
} from "../utils/upload";

interface ProductQuery extends PaginationQuery {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
  inStock?: boolean;
  brand?: string;
  tags?: string[];
}

export class ProductService {
  static async createProduct(
    productData: {
      name: string;
      description: string;
      shortDescription?: string;
      category: string;
      brand?: string;
      basePrice: number;
      tags?: string[];
      weight?: number;
      dimensions?: any;
      seoTitle?: string;
      seoDescription?: string;
    },
    mainImages?: MulterFile[]
  ) {
    // Upload main images (max 5)
    let mainImageUrls: string[] = [];
    if (mainImages && mainImages.length > 0) {
      if (mainImages.length > 5) {
        throw createError("Product can have maximum 5 images", 400);
      }
      const uploadResults = await uploadMultipleToCloudinary(
        mainImages,
        "products/main"
      );
      mainImageUrls = uploadResults.map((result) => result.secure_url);
    }

    const product = new Product({
      ...productData,
      mainImages: mainImageUrls,
      variants: [], // Will be populated when variants are added
    });

    await product.save();

    return await Product.findById(product._id).populate(
      "category",
      "name slug"
    );
  }

  static async getAllProducts(query: ProductQuery, userRole?: string) {
    const {
      page = 1,
      limit = 10,
      search,
      category,
      minPrice,
      maxPrice,
      featured,
      inStock,
      brand,
      tags,
      sort = "-createdAt",
    } = query;

    const filter: any = {};

    // Only admins can see inactive records, everyone else (including public) sees only active
    if (userRole !== "admin") {
      filter.isActive = true;
    }

    // Text search
    if (search) {
      filter.$text = { $search: search };
    }

    // Category filter
    if (category) {
      filter.category = category;
    }

    // Brand filter
    if (brand) {
      filter.brand = { $regex: brand, $options: "i" };
    }

    // Tags filter
    if (tags && tags.length > 0) {
      filter.tags = { $in: tags };
    }

    // Featured filter
    if (featured !== undefined) {
      filter.isFeatured = featured;
    }

    const skip = (page - 1) * limit;

    let products = await Product.find(filter)
      .populate("category", "name slug")
      .populate({
        path: "variants",
        populate: [
          { path: "size", select: "name code" },
          { path: "color", select: "name hexCode" },
        ],
        match: userRole === "admin" ? {} : { isActive: true },
      })
      .sort(sort)
      .skip(skip)
      .limit(limit);

    // Apply price and stock filters after population (since they depend on variants)
    if (minPrice !== undefined || maxPrice !== undefined || inStock) {
      products = products.filter((product) => {
        const productWithVariants = product as any;

        if (
          productWithVariants.variants &&
          productWithVariants.variants.length > 0
        ) {
          // Product has variants
          const activeVariants = productWithVariants.variants.filter(
            (v: any) => userRole === "admin" || v.isActive
          );

          if (inStock && activeVariants.every((v: any) => v.stock === 0)) {
            return false;
          }

          if (minPrice !== undefined || maxPrice !== undefined) {
            const prices = activeVariants.map(
              (v: any) => v.discountPrice || v.price
            );
            const minVariantPrice = Math.min(...prices);
            const maxVariantPrice = Math.max(...prices);

            if (minPrice !== undefined && maxVariantPrice < minPrice)
              return false;
            if (maxPrice !== undefined && minVariantPrice > maxPrice)
              return false;
          }
        } else {
          // Product without variants - use base price
          if (minPrice !== undefined && product.basePrice < minPrice)
            return false;
          if (maxPrice !== undefined && product.basePrice > maxPrice)
            return false;
          if (inStock) return false; // Products without variants don't have stock
        }

        return true;
      });
    }

    const total = await Product.countDocuments(filter);

    return {
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  static async getProductById(id: string, userRole?: string) {
    const filter: any = { _id: id };

    // Only admins can see inactive records, everyone else (including public) sees only active
    if (userRole !== "admin") {
      filter.isActive = true;
    }

    const product = await Product.findOne(filter)
      .populate("category", "name slug")
      .populate({
        path: "variants",
        populate: [
          { path: "size", select: "name code" },
          { path: "color", select: "name hexCode" },
        ],
        match: userRole === "admin" ? {} : { isActive: true },
      });

    if (!product) {
      throw createError("Product not found", 404);
    }

    return product;
  }

  static async getProductBySlug(slug: string, userRole?: string) {
    const filter: any = { slug };

    // Only admins can see inactive records, everyone else (including public) sees only active
    if (userRole !== "admin") {
      filter.isActive = true;
    }

    const product = await Product.findOne(filter)
      .populate("category", "name slug")
      .populate({
        path: "variants",
        populate: [
          { path: "size", select: "name code" },
          { path: "color", select: "name hexCode" },
        ],
        match: userRole === "admin" ? {} : { isActive: true },
      });

    if (!product) {
      throw createError("Product not found", 404);
    }

    return product;
  }

  static async updateProduct(
    id: string,
    updateData: Partial<IProduct>,
    mainImages?: MulterFile[]
  ) {
    const product = await Product.findById(id);
    if (!product) {
      throw createError("Product not found", 404);
    }

    if (mainImages && mainImages.length > 0) {
      if (mainImages.length > 5) {
        throw createError("Product can have maximum 5 images", 400);
      }

      // Delete old main images
      if (product.mainImages && product.mainImages.length > 0) {
        for (const imageUrl of product.mainImages) {
          const publicId = imageUrl.split("/").pop()?.split(".")[0];
          if (publicId) {
            await deleteFromCloudinary(`products/main/${publicId}`);
          }
        }
      }

      // Upload new main images
      const uploadResults = await uploadMultipleToCloudinary(
        mainImages,
        "products/main"
      );
      updateData.mainImages = uploadResults.map((result) => result.secure_url);
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate("category", "name slug")
      .populate({
        path: "variants",
        populate: [
          { path: "size", select: "name code" },
          { path: "color", select: "name hexCode" },
        ],
      });

    return updatedProduct;
  }

  static async deleteProduct(id: string) {
    const product = await Product.findById(id).populate("variants");
    if (!product) {
      throw createError("Product not found", 404);
    }

    // Delete main images from Cloudinary
    if (product.mainImages && product.mainImages.length > 0) {
      for (const imageUrl of product.mainImages) {
        const publicId = imageUrl.split("/").pop()?.split(".")[0];
        if (publicId) {
          await deleteFromCloudinary(`products/main/${publicId}`);
        }
      }
    }

    // Delete all variants and their images
    const productWithVariants = product as any;
    if (
      productWithVariants.variants &&
      productWithVariants.variants.length > 0
    ) {
      for (const variant of productWithVariants.variants) {
        if (variant.image) {
          const publicId = variant.image.split("/").pop()?.split(".")[0];
          if (publicId) {
            await deleteFromCloudinary(`products/variants/${publicId}`);
          }
        }
      }
      await ProductVariant.deleteMany({ product: id });
    }

    await Product.findByIdAndDelete(id);
    return { message: "Product deleted successfully" };
  }

  static async toggleProductStatus(id: string) {
    const product = await Product.findById(id);
    if (!product) {
      throw createError("Product not found", 404);
    }

    product.isActive = !product.isActive;
    await product.save();

    return product;
  }

  static async toggleFeaturedStatus(id: string) {
    const product = await Product.findById(id);
    if (!product) {
      throw createError("Product not found", 404);
    }

    product.isFeatured = !product.isFeatured;
    await product.save();

    return product;
  }

  static async getFeaturedProducts(limit: number = 10, userRole?: string) {
    const filter: any = { isFeatured: true };

    // Only admins can see inactive records, everyone else (including public) sees only active
    if (userRole !== "admin") {
      filter.isActive = true;
    }

    const products = await Product.find(filter)
      .populate("category", "name slug")
      .populate({
        path: "variants",
        populate: [
          { path: "size", select: "name code" },
          { path: "color", select: "name hexCode" },
        ],
        match: userRole === "admin" ? {} : { isActive: true },
      })
      .sort("-createdAt")
      .limit(limit);

    return products;
  }

  static async getRelatedProducts(
    productId: string,
    limit: number = 5,
    userRole?: string
  ) {
    const product = await Product.findById(productId);
    if (!product) {
      throw createError("Product not found", 404);
    }

    const filter: any = {
      _id: { $ne: productId },
      category: product.category,
    };

    // Only admins can see inactive records, everyone else (including public) sees only active
    if (userRole !== "admin") {
      filter.isActive = true;
    }

    const relatedProducts = await Product.find(filter)
      .populate("category", "name slug")
      .populate({
        path: "variants",
        populate: [
          { path: "size", select: "name code" },
          { path: "color", select: "name hexCode" },
        ],
        match: userRole === "admin" ? {} : { isActive: true },
      })
      .sort("-createdAt")
      .limit(limit);

    return relatedProducts;
  }

  static async searchProducts(
    searchTerm: string,
    limit: number = 10,
    userRole?: string
  ) {
    const filter: any = { $text: { $search: searchTerm } };

    // Only admins can see inactive records, everyone else (including public) sees only active
    if (userRole !== "admin") {
      filter.isActive = true;
    }

    const products = await Product.find(filter)
      .populate("category", "name slug")
      .populate({
        path: "variants",
        populate: [
          { path: "size", select: "name code" },
          { path: "color", select: "name hexCode" },
        ],
        match: userRole === "admin" ? {} : { isActive: true },
      })
      .sort({ score: { $meta: "textScore" } })
      .limit(limit);

    return products;
  }

  static async updateStock(productId: string, sku: string, stock: number) {
    const product = await Product.findById(productId).populate("variants");
    if (!product) {
      throw createError("Product not found", 404);
    }

    // Find the variant with the matching SKU
    const productWithVariants = product as any;
    if (
      !productWithVariants.variants ||
      productWithVariants.variants.length === 0
    ) {
      throw createError("Product has no variants", 400);
    }

    const variant = productWithVariants.variants.find(
      (v: any) => v.sku === sku
    );
    if (!variant) {
      throw createError(`Variant with SKU '${sku}' not found`, 404);
    }

    // Update the variant's stock
    await ProductVariant.findByIdAndUpdate(
      variant._id,
      { stock },
      { new: true, runValidators: true }
    );

    // Return the updated product with populated variants
    const updatedProduct = await Product.findById(productId)
      .populate("category", "name slug")
      .populate({
        path: "variants",
        populate: [
          { path: "size", select: "name code" },
          { path: "color", select: "name hexCode" },
        ],
      });

    return updatedProduct;
  }
}
