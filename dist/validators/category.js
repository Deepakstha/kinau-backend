"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryIdValidation = exports.updateCategoryValidation = exports.createCategoryValidation = void 0;
const express_validator_1 = require("express-validator");
exports.createCategoryValidation = [
    (0, express_validator_1.body)("name")
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage("Category name must be between 2 and 100 characters"),
    (0, express_validator_1.body)("description")
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage("Description cannot exceed 500 characters"),
    (0, express_validator_1.body)("parentCategory")
        .optional()
        .isMongoId()
        .withMessage("Parent category must be a valid ID"),
];
exports.updateCategoryValidation = [
    (0, express_validator_1.param)("id").isMongoId().withMessage("Category ID must be valid"),
    (0, express_validator_1.body)("name")
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage("Category name must be between 2 and 100 characters"),
    (0, express_validator_1.body)("description")
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage("Description cannot exceed 500 characters"),
    (0, express_validator_1.body)("parentCategory")
        .optional()
        .isMongoId()
        .withMessage("Parent category must be a valid ID"),
    (0, express_validator_1.body)("isActive")
        .optional()
        .isBoolean()
        .withMessage("isActive must be a boolean value"),
];
exports.categoryIdValidation = [
    (0, express_validator_1.param)("id").isMongoId().withMessage("Category ID must be valid"),
];
//# sourceMappingURL=category.js.map