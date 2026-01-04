"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const errorHandler_1 = require("../middlewares/errorHandler");
const Product_1 = require("../models/Product");
const ProductVariant_1 = require("../models/ProductVariant");
const upload_1 = require("../utils/upload");
class ProductService {
    static async createProduct(productData, mainImages) {
        let mainImageUrls = [];
        if (mainImages && mainImages.length > 0) {
            if (mainImages.length > 5) {
                throw (0, errorHandler_1.createError)("Product can have maximum 5 images", 400);
            }
            const uploadResults = await (0, upload_1.uploadMultipleToCloudinary)(mainImages, "products/main");
            mainImageUrls = uploadResults.map((result) => result.secure_url);
        }
        const product = new Product_1.Product({
            ...productData,
            mainImages: mainImageUrls,
            variants: [],
        });
        await product.save();
        return await Product_1.Product.findById(product._id).populate("category", "name slug");
    }
    static async getAllProducts(query, userRole) {
        const { page = 1, limit = 10, search, category, minPrice, maxPrice, featured, inStock, brand, tags, sort = "-createdAt", } = query;
        const filter = {};
        if (userRole !== "admin") {
            filter.isActive = true;
        }
        if (search) {
            filter.$text = { $search: search };
        }
        if (category) {
            filter.category = category;
        }
        if (brand) {
            filter.brand = { $regex: brand, $options: "i" };
        }
        if (tags && tags.length > 0) {
            filter.tags = { $in: tags };
        }
        if (featured !== undefined) {
            filter.isFeatured = featured;
        }
        const skip = (page - 1) * limit;
        let products = await Product_1.Product.find(filter)
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
        if (minPrice !== undefined || maxPrice !== undefined || inStock) {
            products = products.filter((product) => {
                const productWithVariants = product;
                if (productWithVariants.variants &&
                    productWithVariants.variants.length > 0) {
                    const activeVariants = productWithVariants.variants.filter((v) => userRole === "admin" || v.isActive);
                    if (inStock && activeVariants.every((v) => v.stock === 0)) {
                        return false;
                    }
                    if (minPrice !== undefined || maxPrice !== undefined) {
                        const prices = activeVariants.map((v) => v.discountPrice || v.price);
                        const minVariantPrice = Math.min(...prices);
                        const maxVariantPrice = Math.max(...prices);
                        if (minPrice !== undefined && maxVariantPrice < minPrice)
                            return false;
                        if (maxPrice !== undefined && minVariantPrice > maxPrice)
                            return false;
                    }
                }
                else {
                    if (minPrice !== undefined && product.basePrice < minPrice)
                        return false;
                    if (maxPrice !== undefined && product.basePrice > maxPrice)
                        return false;
                    if (inStock)
                        return false;
                }
                return true;
            });
        }
        const total = await Product_1.Product.countDocuments(filter);
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
    static async getProductById(id, userRole) {
        const filter = { _id: id };
        if (userRole !== "admin") {
            filter.isActive = true;
        }
        const product = await Product_1.Product.findOne(filter)
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
            throw (0, errorHandler_1.createError)("Product not found", 404);
        }
        return product;
    }
    static async getProductBySlug(slug, userRole) {
        const filter = { slug };
        if (userRole !== "admin") {
            filter.isActive = true;
        }
        const product = await Product_1.Product.findOne(filter)
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
            throw (0, errorHandler_1.createError)("Product not found", 404);
        }
        return product;
    }
    static async updateProduct(id, updateData, mainImages) {
        const product = await Product_1.Product.findById(id);
        if (!product) {
            throw (0, errorHandler_1.createError)("Product not found", 404);
        }
        if (mainImages && mainImages.length > 0) {
            if (mainImages.length > 5) {
                throw (0, errorHandler_1.createError)("Product can have maximum 5 images", 400);
            }
            if (product.mainImages && product.mainImages.length > 0) {
                for (const imageUrl of product.mainImages) {
                    const publicId = imageUrl.split("/").pop()?.split(".")[0];
                    if (publicId) {
                        await (0, upload_1.deleteFromCloudinary)(`products/main/${publicId}`);
                    }
                }
            }
            const uploadResults = await (0, upload_1.uploadMultipleToCloudinary)(mainImages, "products/main");
            updateData.mainImages = uploadResults.map((result) => result.secure_url);
        }
        const updatedProduct = await Product_1.Product.findByIdAndUpdate(id, updateData, {
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
    static async deleteProduct(id) {
        const product = await Product_1.Product.findById(id).populate("variants");
        if (!product) {
            throw (0, errorHandler_1.createError)("Product not found", 404);
        }
        if (product.mainImages && product.mainImages.length > 0) {
            for (const imageUrl of product.mainImages) {
                const publicId = imageUrl.split("/").pop()?.split(".")[0];
                if (publicId) {
                    await (0, upload_1.deleteFromCloudinary)(`products/main/${publicId}`);
                }
            }
        }
        const productWithVariants = product;
        if (productWithVariants.variants &&
            productWithVariants.variants.length > 0) {
            for (const variant of productWithVariants.variants) {
                if (variant.image) {
                    const publicId = variant.image.split("/").pop()?.split(".")[0];
                    if (publicId) {
                        await (0, upload_1.deleteFromCloudinary)(`products/variants/${publicId}`);
                    }
                }
            }
            await ProductVariant_1.ProductVariant.deleteMany({ product: id });
        }
        await Product_1.Product.findByIdAndDelete(id);
        return { message: "Product deleted successfully" };
    }
    static async toggleProductStatus(id) {
        const product = await Product_1.Product.findById(id);
        if (!product) {
            throw (0, errorHandler_1.createError)("Product not found", 404);
        }
        product.isActive = !product.isActive;
        await product.save();
        return product;
    }
    static async toggleFeaturedStatus(id) {
        const product = await Product_1.Product.findById(id);
        if (!product) {
            throw (0, errorHandler_1.createError)("Product not found", 404);
        }
        product.isFeatured = !product.isFeatured;
        await product.save();
        return product;
    }
    static async getFeaturedProducts(limit = 10, userRole) {
        const filter = { isFeatured: true };
        if (userRole !== "admin") {
            filter.isActive = true;
        }
        const products = await Product_1.Product.find(filter)
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
    static async getRelatedProducts(productId, limit = 5, userRole) {
        const product = await Product_1.Product.findById(productId);
        if (!product) {
            throw (0, errorHandler_1.createError)("Product not found", 404);
        }
        const filter = {
            _id: { $ne: productId },
            category: product.category,
        };
        if (userRole !== "admin") {
            filter.isActive = true;
        }
        const relatedProducts = await Product_1.Product.find(filter)
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
    static async searchProducts(searchTerm, limit = 10, userRole) {
        const filter = { $text: { $search: searchTerm } };
        if (userRole !== "admin") {
            filter.isActive = true;
        }
        const products = await Product_1.Product.find(filter)
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
    static async updateStock(productId, sku, stock) {
        const product = await Product_1.Product.findById(productId).populate("variants");
        if (!product) {
            throw (0, errorHandler_1.createError)("Product not found", 404);
        }
        const productWithVariants = product;
        if (!productWithVariants.variants ||
            productWithVariants.variants.length === 0) {
            throw (0, errorHandler_1.createError)("Product has no variants", 400);
        }
        const variant = productWithVariants.variants.find((v) => v.sku === sku);
        if (!variant) {
            throw (0, errorHandler_1.createError)(`Variant with SKU '${sku}' not found`, 404);
        }
        await ProductVariant_1.ProductVariant.findByIdAndUpdate(variant._id, { stock }, { new: true, runValidators: true });
        const updatedProduct = await Product_1.Product.findById(productId)
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
exports.ProductService = ProductService;
//# sourceMappingURL=ProductService.js.map