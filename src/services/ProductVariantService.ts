import { ProductVariant } from "../models/ProductVariant";
import { Product } from "../models/Product";
import { createError } from "../middlewares/errorHandler";
import { uploadToCloudinary, deleteFromCloudinary } from "../utils/upload";
import { IProductVariant, MulterFile } from "../types";

export class ProductVariantService {
  static async createVariant(
    productId: string,
    variantData: {
      size: string;
      color: string;
      sku: string;
      price: number;
      discountPrice?: number;
      stock: number;
    },
    imageFile?: MulterFile
  ) {
    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      throw createError("Product not found", 404);
    }

    // Check if variant with same SKU already exists
    const existingVariant = await ProductVariant.findOne({
      sku: variantData.sku,
    });
    if (existingVariant) {
      throw createError("Variant with this SKU already exists", 400);
    }

    // Check if variant with same size/color combination exists for this product
    const existingCombo = await ProductVariant.findOne({
      product: productId,
      size: variantData.size,
      color: variantData.color,
    });
    if (existingCombo) {
      throw createError(
        "Variant with this size/color combination already exists for this product",
        400
      );
    }

    let imageUrl: string | undefined;
    if (imageFile) {
      const uploadResult = await uploadToCloudinary(
        imageFile,
        "products/variants"
      );
      imageUrl = uploadResult.secure_url;
    }

    const variant = new ProductVariant({
      product: productId,
      ...variantData,
      image: imageUrl,
    });

    await variant.save();

    // Add variant reference to product
    await Product.findByIdAndUpdate(productId, {
      $push: { variants: variant._id },
    });

    return await ProductVariant.findById(variant._id)
      .populate("size", "name code")
      .populate("color", "name hexCode")
      .populate("product", "name slug");
  }

  static async getVariantsByProduct(productId: string, userRole?: string) {
    const filter: any = { product: productId };

    // Only admins can see inactive variants
    if (userRole !== "admin") {
      filter.isActive = true;
    }

    const variants = await ProductVariant.find(filter)
      .populate("size", "name code")
      .populate("color", "name hexCode")
      .populate("product", "name")
      .sort({ createdAt: -1 });

    return variants;
  }

  static async getVariantById(variantId: string, userRole?: string) {
    const filter: any = { _id: variantId };

    // Only admins can see inactive variants
    if (userRole !== "admin") {
      filter.isActive = true;
    }

    const variant = await ProductVariant.findOne(filter)
      .populate("size", "name code")
      .populate("color", "name hexCode")
      .populate("product", "name slug");

    if (!variant) {
      throw createError("Product variant not found", 404);
    }

    return variant;
  }

  static async updateVariant(
    variantId: string,
    updateData: IProductVariant,
    imageFile?: MulterFile
  ) {
    const variant = await ProductVariant.findById(variantId);
    if (!variant) {
      throw createError("Product variant not found", 404);
    }

    // Check for duplicate SKU if updating
    if (updateData.sku && updateData.sku !== variant.sku) {
      const existingVariant = await ProductVariant.findOne({
        _id: { $ne: variantId },
        sku: updateData.sku,
      });
      if (existingVariant) {
        throw createError("Variant with this SKU already exists", 400);
      }
    }

    // Check for duplicate size/color combination if updating
    if (updateData.size || updateData.color) {
      const existingCombo = await ProductVariant.findOne({
        _id: { $ne: variantId },
        product: variant.product,
        size: updateData.size || variant.size,
        color: updateData.color || variant.color,
      });
      if (existingCombo) {
        throw createError(
          "Variant with this size/color combination already exists for this product",
          400
        );
      }
    }

    if (imageFile) {
      // Delete old image if exists
      if (variant.image) {
        const publicId = variant.image.split("/").pop()?.split(".")[0];
        if (publicId) {
          await deleteFromCloudinary(`products/variants/${publicId}`);
        }
      }

      // Upload new image
      const uploadResult = await uploadToCloudinary(
        imageFile,
        "products/variants"
      );
      updateData.image = uploadResult.secure_url;
    }

    const updatedVariant = await ProductVariant.findByIdAndUpdate(
      variantId,
      updateData,
      { new: true, runValidators: true }
    )
      .populate("size", "name code")
      .populate("color", "name hexCode")
      .populate("product", "name slug");

    return updatedVariant;
  }

  static async deleteVariant(variantId: string) {
    const variant = await ProductVariant.findById(variantId);
    if (!variant) {
      throw createError("Product variant not found", 404);
    }

    // Delete image from Cloudinary if exists
    if (variant.image) {
      const publicId = variant.image.split("/").pop()?.split(".")[0];
      if (publicId) {
        await deleteFromCloudinary(`products/variants/${publicId}`);
      }
    }

    // Remove variant reference from product
    await Product.findByIdAndUpdate(variant.product, {
      $pull: { variants: variantId },
    });

    await ProductVariant.findByIdAndDelete(variantId);
    return { message: "Product variant deleted successfully" };
  }

  static async toggleVariantStatus(variantId: string) {
    const variant = await ProductVariant.findById(variantId);
    if (!variant) {
      throw createError("Product variant not found", 404);
    }

    variant.isActive = !variant.isActive;
    await variant.save();

    return variant;
  }

  static async updateStock(variantId: string, newStock: number) {
    const variant = await ProductVariant.findById(variantId);
    if (!variant) {
      throw createError("Product variant not found", 404);
    }

    variant.stock = newStock;
    await variant.save();

    return variant;
  }
}
