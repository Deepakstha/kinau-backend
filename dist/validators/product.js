"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productQueryValidation = exports.productIdValidation = exports.updateProductValidation = exports.createProductValidation = void 0;
const express_validator_1 = require("express-validator");
exports.createProductValidation = [
    (0, express_validator_1.body)("name")
        .trim()
        .isLength({ min: 2, max: 200 })
        .withMessage("Product name must be between 2 and 200 characters"),
    (0, express_validator_1.body)("description")
        .trim()
        .isLength({ min: 10, max: 2000 })
        .withMessage("Description must be between 10 and 2000 characters"),
    (0, express_validator_1.body)("shortDescription")
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage("Short description cannot exceed 500 characters"),
    (0, express_validator_1.body)("category").isMongoId().withMessage("Category must be a valid ID"),
    (0, express_validator_1.body)("brand")
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage("Brand name cannot exceed 100 characters"),
    (0, express_validator_1.body)("basePrice")
        .isFloat({ min: 0 })
        .withMessage("Base price must be a positive number"),
    (0, express_validator_1.body)("mainImages")
        .optional()
        .isArray({ max: 5 })
        .withMessage("Product can have maximum 5 main images"),
    (0, express_validator_1.body)("mainImages.*")
        .optional()
        .isURL()
        .withMessage("Each image must be a valid URL"),
    (0, express_validator_1.body)("tags").optional().isArray().withMessage("Tags must be an array"),
    (0, express_validator_1.body)("tags.*")
        .optional()
        .trim()
        .isLength({ min: 1, max: 50 })
        .withMessage("Each tag must be between 1 and 50 characters"),
    (0, express_validator_1.body)("weight")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Weight must be a positive number"),
    (0, express_validator_1.body)("dimensions.length")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Length must be a positive number"),
    (0, express_validator_1.body)("dimensions.width")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Width must be a positive number"),
    (0, express_validator_1.body)("dimensions.height")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Height must be a positive number"),
    (0, express_validator_1.body)("seoTitle")
        .optional()
        .trim()
        .isLength({ max: 60 })
        .withMessage("SEO title cannot exceed 60 characters"),
    (0, express_validator_1.body)("seoDescription")
        .optional()
        .trim()
        .isLength({ max: 160 })
        .withMessage("SEO description cannot exceed 160 characters"),
];
exports.updateProductValidation = [
    (0, express_validator_1.param)("id").isMongoId().withMessage("Product ID must be valid"),
    (0, express_validator_1.body)("name")
        .optional()
        .trim()
        .isLength({ min: 2, max: 200 })
        .withMessage("Product name must be between 2 and 200 characters"),
    (0, express_validator_1.body)("description")
        .optional()
        .trim()
        .isLength({ min: 10, max: 2000 })
        .withMessage("Description must be between 10 and 2000 characters"),
    (0, express_validator_1.body)("category")
        .optional()
        .isMongoId()
        .withMessage("Category must be a valid ID"),
    (0, express_validator_1.body)("basePrice")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Base price must be a positive number"),
    (0, express_validator_1.body)("isActive")
        .optional()
        .isBoolean()
        .withMessage("isActive must be a boolean value"),
    (0, express_validator_1.body)("isFeatured")
        .optional()
        .isBoolean()
        .withMessage("isFeatured must be a boolean value"),
];
exports.productIdValidation = [
    (0, express_validator_1.param)("id").isMongoId().withMessage("Product ID must be valid"),
];
exports.productQueryValidation = [
    (0, express_validator_1.query)("page")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Page must be a positive integer"),
    (0, express_validator_1.query)("limit")
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage("Limit must be between 1 and 100"),
    (0, express_validator_1.query)("category")
        .optional()
        .isMongoId()
        .withMessage("Category must be a valid ID"),
    (0, express_validator_1.query)("minPrice")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Minimum price must be a positive number"),
    (0, express_validator_1.query)("maxPrice")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Maximum price must be a positive number"),
    (0, express_validator_1.query)("featured")
        .optional()
        .isBoolean()
        .withMessage("Featured must be a boolean value"),
];
//# sourceMappingURL=product.js.map