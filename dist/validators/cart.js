"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.moveToWishlistValidation = exports.removeFromCartValidation = exports.updateCartItemValidation = exports.addToCartValidation = void 0;
const express_validator_1 = require("express-validator");
exports.addToCartValidation = [
    (0, express_validator_1.body)("product").isMongoId().withMessage("Product must be a valid ID"),
    (0, express_validator_1.body)("variant")
        .optional()
        .isMongoId()
        .withMessage("Variant must be a valid ID"),
    (0, express_validator_1.body)("quantity")
        .isInt({ min: 1, max: 100 })
        .withMessage("Quantity must be between 1 and 100"),
];
exports.updateCartItemValidation = [
    (0, express_validator_1.body)("product").isMongoId().withMessage("Product must be a valid ID"),
    (0, express_validator_1.body)("variant")
        .optional()
        .isMongoId()
        .withMessage("Variant must be a valid ID"),
    (0, express_validator_1.body)("quantity")
        .isInt({ min: 1, max: 100 })
        .withMessage("Quantity must be between 1 and 100"),
];
exports.removeFromCartValidation = [
    (0, express_validator_1.body)("product").isMongoId().withMessage("Product must be a valid ID"),
    (0, express_validator_1.body)("variant")
        .optional()
        .isMongoId()
        .withMessage("Variant must be a valid ID"),
];
exports.moveToWishlistValidation = [
    (0, express_validator_1.body)("product").isMongoId().withMessage("Product must be a valid ID"),
    (0, express_validator_1.body)("variant")
        .optional()
        .isMongoId()
        .withMessage("Variant must be a valid ID"),
];
//# sourceMappingURL=cart.js.map