"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateProductVariant = exports.handleValidationErrors = void 0;
const express_validator_1 = require("express-validator");
const response_1 = require("../utils/response");
const handleValidationErrors = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const formattedErrors = errors.array().map((error) => ({
            field: error.type === "field" ? error.path : "unknown",
            message: error.msg,
            value: error.type === "field" ? error.value : undefined,
        }));
        return response_1.ResponseUtil.validationError(res, formattedErrors);
    }
    next();
};
exports.handleValidationErrors = handleValidationErrors;
const validateProductVariant = (req, res, next) => {
    const { size, color, sku, price, stock } = req.body;
    const errors = [];
    if (!size) {
        errors.push({ field: "size", message: "Size is required" });
    }
    if (!color) {
        errors.push({ field: "color", message: "Color is required" });
    }
    if (!sku) {
        errors.push({ field: "sku", message: "SKU is required" });
    }
    if (!price || price <= 0) {
        errors.push({ field: "price", message: "Valid price is required" });
    }
    if (stock === undefined || stock < 0) {
        errors.push({
            field: "stock",
            message: "Valid stock quantity is required",
        });
    }
    if (req.body.discountPrice !== undefined) {
        const discountPrice = req.body.discountPrice;
        if (discountPrice < 0) {
            errors.push({
                field: "discountPrice",
                message: "Valid discount price is required",
            });
        }
        else if (Number(discountPrice) >= Number(price)) {
            errors.push({
                field: "discountPrice",
                message: "Discount price must be less than regular price",
            });
        }
    }
    if (errors.length > 0) {
        return response_1.ResponseUtil.validationError(res, errors);
    }
    next();
};
exports.validateProductVariant = validateProductVariant;
//# sourceMappingURL=validation.js.map