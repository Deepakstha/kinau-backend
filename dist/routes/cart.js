"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const CartController_1 = require("../controllers/CartController");
const auth_1 = require("../middlewares/auth");
const validation_1 = require("../middlewares/validation");
const express_validator_1 = require("express-validator");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
const addToCartValidation = [
    (0, express_validator_1.body)("totalAmount")
        .isNumeric()
        .withMessage("Total amount must be a number")
        .isFloat({ min: 0 })
        .withMessage("Total amount cannot be negative"),
    (0, express_validator_1.body)("items")
        .isArray({ min: 1 })
        .withMessage("Items must be a non-empty array"),
    (0, express_validator_1.body)("items.*.product").isMongoId().withMessage("Product ID must be valid"),
    (0, express_validator_1.body)("items.*.variant")
        .optional()
        .isMongoId()
        .withMessage("Variant ID must be valid"),
    (0, express_validator_1.body)("items.*.quantity")
        .isInt({ min: 1 })
        .withMessage("Quantity must be at least 1"),
    (0, express_validator_1.body)("items.*.price")
        .isNumeric()
        .withMessage("Price must be a number")
        .isFloat({ min: 0 })
        .withMessage("Price cannot be negative"),
];
router.get("/", CartController_1.CartController.getCart);
router.get("/", CartController_1.CartController.getCart);
router.post("/add", addToCartValidation, validation_1.handleValidationErrors, CartController_1.CartController.addToCart);
router.put("/update", [
    ...addToCartValidation,
    (0, express_validator_1.body)("items.*.quantity")
        .isInt({ min: 0 })
        .withMessage("Quantity must be non-negative"),
], validation_1.handleValidationErrors, CartController_1.CartController.updateCartItem);
router.delete("/remove/:productId/:variantId", [
    (0, express_validator_1.param)("productId").isMongoId().withMessage("Product ID must be valid"),
    (0, express_validator_1.param)("variantId").isMongoId().withMessage("Variant ID must be valid"),
], validation_1.handleValidationErrors, CartController_1.CartController.removeFromCart);
router.delete("/remove/:productId", [(0, express_validator_1.param)("productId").isMongoId().withMessage("Product ID must be valid")], validation_1.handleValidationErrors, CartController_1.CartController.removeFromCartWithoutVariant);
router.delete("/clear", CartController_1.CartController.clearCart);
router.get("/summary", CartController_1.CartController.getCartSummary);
router.get("/validate", CartController_1.CartController.validateCart);
exports.default = router;
//# sourceMappingURL=cart.js.map