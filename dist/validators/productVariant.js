"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productVariantQueryValidation = exports.toggleStatusValidation = exports.updateStockValidation = exports.productIdValidation = exports.productVariantIdValidation = exports.updateProductVariantValidation = exports.createProductVariantValidation = void 0;
const express_validator_1 = require("express-validator");
exports.createProductVariantValidation = [
    (0, express_validator_1.param)("productId").isMongoId().withMessage("Product ID must be valid"),
    (0, express_validator_1.body)("size").isMongoId().withMessage("Size must be a valid ID"),
    (0, express_validator_1.body)("color").isMongoId().withMessage("Color must be a valid ID"),
    (0, express_validator_1.body)("sku")
        .trim()
        .isLength({ min: 3, max: 50 })
        .withMessage("SKU must be between 3 and 50 characters")
        .matches(/^[A-Z0-9-_]+$/)
        .withMessage("SKU can only contain uppercase letters, numbers, hyphens, and underscores"),
    (0, express_validator_1.body)("price")
        .isFloat({ min: 0 })
        .withMessage("Price must be a positive number"),
    (0, express_validator_1.body)("discountPrice")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Discount price must be a positive number")
        .custom((value, { req }) => {
        if (value && req.body.price && value >= req.body.price) {
            throw new Error("Discount price must be less than regular price");
        }
        return true;
    }),
    (0, express_validator_1.body)("stock")
        .isInt({ min: 0 })
        .withMessage("Stock must be a non-negative integer"),
    (0, express_validator_1.body)("images")
        .optional()
        .isArray({ max: 10 })
        .withMessage("Variant can have maximum 10 images"),
    (0, express_validator_1.body)("images.*")
        .optional()
        .isURL()
        .withMessage("Each image must be a valid URL"),
    (0, express_validator_1.body)("isActive")
        .optional()
        .isBoolean()
        .withMessage("isActive must be a boolean value"),
];
exports.updateProductVariantValidation = [
    (0, express_validator_1.param)("variantId").isMongoId().withMessage("Variant ID must be valid"),
    (0, express_validator_1.body)("size").optional().isMongoId().withMessage("Size must be a valid ID"),
    (0, express_validator_1.body)("color").optional().isMongoId().withMessage("Color must be a valid ID"),
    (0, express_validator_1.body)("sku")
        .optional()
        .trim()
        .isLength({ min: 3, max: 50 })
        .withMessage("SKU must be between 3 and 50 characters")
        .matches(/^[A-Z0-9-_]+$/)
        .withMessage("SKU can only contain uppercase letters, numbers, hyphens, and underscores"),
    (0, express_validator_1.body)("price")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Price must be a positive number"),
    (0, express_validator_1.body)("discountPrice")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Discount price must be a positive number"),
    (0, express_validator_1.body)("stock")
        .optional()
        .isInt({ min: 0 })
        .withMessage("Stock must be a non-negative integer"),
    (0, express_validator_1.body)("images")
        .optional()
        .isArray({ max: 10 })
        .withMessage("Variant can have maximum 10 images"),
    (0, express_validator_1.body)("images.*")
        .optional()
        .isURL()
        .withMessage("Each image must be a valid URL"),
    (0, express_validator_1.body)("isActive")
        .optional()
        .isBoolean()
        .withMessage("isActive must be a boolean value"),
];
exports.productVariantIdValidation = [
    (0, express_validator_1.param)("variantId").isMongoId().withMessage("Variant ID must be valid"),
];
exports.productIdValidation = [
    (0, express_validator_1.param)("productId").isMongoId().withMessage("Product ID must be valid"),
];
exports.updateStockValidation = [
    (0, express_validator_1.param)("variantId").isMongoId().withMessage("Variant ID must be valid"),
    (0, express_validator_1.body)("stock")
        .isInt({ min: 0 })
        .withMessage("Stock must be a non-negative integer"),
];
exports.toggleStatusValidation = [
    (0, express_validator_1.param)("variantId").isMongoId().withMessage("Variant ID must be valid"),
];
exports.productVariantQueryValidation = [
    (0, express_validator_1.query)("page")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Page must be a positive integer"),
    (0, express_validator_1.query)("limit")
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage("Limit must be between 1 and 100"),
    (0, express_validator_1.query)("size").optional().isMongoId().withMessage("Size must be a valid ID"),
    (0, express_validator_1.query)("color").optional().isMongoId().withMessage("Color must be a valid ID"),
    (0, express_validator_1.query)("minPrice")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Minimum price must be a positive number"),
    (0, express_validator_1.query)("maxPrice")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Maximum price must be a positive number"),
    (0, express_validator_1.query)("inStock")
        .optional()
        .isBoolean()
        .withMessage("inStock must be a boolean value"),
    (0, express_validator_1.query)("active")
        .optional()
        .isBoolean()
        .withMessage("active must be a boolean value"),
];
//# sourceMappingURL=productVariant.js.map