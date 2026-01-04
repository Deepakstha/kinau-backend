"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductVariantService = void 0;
const ProductVariant_1 = require("../models/ProductVariant");
const Product_1 = require("../models/Product");
const errorHandler_1 = require("../middlewares/errorHandler");
const upload_1 = require("../utils/upload");
class ProductVariantService {
    static async createVariant(productId, variantData, imageFile) {
        const product = await Product_1.Product.findById(productId);
        if (!product) {
            throw (0, errorHandler_1.createError)("Product not found", 404);
        }
        const existingVariant = await ProductVariant_1.ProductVariant.findOne({
            sku: variantData.sku,
        });
        if (existingVariant) {
            throw (0, errorHandler_1.createError)("Variant with this SKU already exists", 400);
        }
        const existingCombo = await ProductVariant_1.ProductVariant.findOne({
            product: productId,
            size: variantData.size,
            color: variantData.color,
        });
        if (existingCombo) {
            throw (0, errorHandler_1.createError)("Variant with this size/color combination already exists for this product", 400);
        }
        let imageUrl;
        if (imageFile) {
            const uploadResult = await (0, upload_1.uploadToCloudinary)(imageFile, "products/variants");
            imageUrl = uploadResult.secure_url;
        }
        const variant = new ProductVariant_1.ProductVariant({
            product: productId,
            ...variantData,
            image: imageUrl,
        });
        await variant.save();
        await Product_1.Product.findByIdAndUpdate(productId, {
            $push: { variants: variant._id },
        });
        return await ProductVariant_1.ProductVariant.findById(variant._id)
            .populate("size", "name code")
            .populate("color", "name hexCode")
            .populate("product", "name slug");
    }
    static async getVariantsByProduct(productId, userRole) {
        const filter = { product: productId };
        if (userRole !== "admin") {
            filter.isActive = true;
        }
        const variants = await ProductVariant_1.ProductVariant.find(filter)
            .populate("size", "name code")
            .populate("color", "name hexCode")
            .populate("product", "name")
            .sort({ createdAt: -1 });
        return variants;
    }
    static async getVariantById(variantId, userRole) {
        const filter = { _id: variantId };
        if (userRole !== "admin") {
            filter.isActive = true;
        }
        const variant = await ProductVariant_1.ProductVariant.findOne(filter)
            .populate("size", "name code")
            .populate("color", "name hexCode")
            .populate("product", "name slug");
        if (!variant) {
            throw (0, errorHandler_1.createError)("Product variant not found", 404);
        }
        return variant;
    }
    static async updateVariant(variantId, updateData, imageFile) {
        const variant = await ProductVariant_1.ProductVariant.findById(variantId);
        if (!variant) {
            throw (0, errorHandler_1.createError)("Product variant not found", 404);
        }
        if (updateData.sku && updateData.sku !== variant.sku) {
            const existingVariant = await ProductVariant_1.ProductVariant.findOne({
                _id: { $ne: variantId },
                sku: updateData.sku,
            });
            if (existingVariant) {
                throw (0, errorHandler_1.createError)("Variant with this SKU already exists", 400);
            }
        }
        if (updateData.size || updateData.color) {
            const existingCombo = await ProductVariant_1.ProductVariant.findOne({
                _id: { $ne: variantId },
                product: variant.product,
                size: updateData.size || variant.size,
                color: updateData.color || variant.color,
            });
            if (existingCombo) {
                throw (0, errorHandler_1.createError)("Variant with this size/color combination already exists for this product", 400);
            }
        }
        if (imageFile) {
            if (variant.image) {
                const publicId = variant.image.split("/").pop()?.split(".")[0];
                if (publicId) {
                    await (0, upload_1.deleteFromCloudinary)(`products/variants/${publicId}`);
                }
            }
            const uploadResult = await (0, upload_1.uploadToCloudinary)(imageFile, "products/variants");
            updateData.image = uploadResult.secure_url;
        }
        const updatedVariant = await ProductVariant_1.ProductVariant.findByIdAndUpdate(variantId, updateData, { new: true, runValidators: true })
            .populate("size", "name code")
            .populate("color", "name hexCode")
            .populate("product", "name slug");
        return updatedVariant;
    }
    static async deleteVariant(variantId) {
        const variant = await ProductVariant_1.ProductVariant.findById(variantId);
        if (!variant) {
            throw (0, errorHandler_1.createError)("Product variant not found", 404);
        }
        if (variant.image) {
            const publicId = variant.image.split("/").pop()?.split(".")[0];
            if (publicId) {
                await (0, upload_1.deleteFromCloudinary)(`products/variants/${publicId}`);
            }
        }
        await Product_1.Product.findByIdAndUpdate(variant.product, {
            $pull: { variants: variantId },
        });
        await ProductVariant_1.ProductVariant.findByIdAndDelete(variantId);
        return { message: "Product variant deleted successfully" };
    }
    static async toggleVariantStatus(variantId) {
        const variant = await ProductVariant_1.ProductVariant.findById(variantId);
        if (!variant) {
            throw (0, errorHandler_1.createError)("Product variant not found", 404);
        }
        variant.isActive = !variant.isActive;
        await variant.save();
        return variant;
    }
    static async updateStock(variantId, newStock) {
        const variant = await ProductVariant_1.ProductVariant.findById(variantId);
        if (!variant) {
            throw (0, errorHandler_1.createError)("Product variant not found", 404);
        }
        variant.stock = newStock;
        await variant.save();
        return variant;
    }
}
exports.ProductVariantService = ProductVariantService;
//# sourceMappingURL=ProductVariantService.js.map