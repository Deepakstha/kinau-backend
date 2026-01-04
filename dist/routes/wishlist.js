"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const WishlistController_1 = require("../controllers/WishlistController");
const auth_1 = require("../middlewares/auth");
const validation_1 = require("../middlewares/validation");
const express_validator_1 = require("express-validator");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
const productIdValidation = [
    (0, express_validator_1.param)("productId")
        .isMongoId()
        .withMessage("Product ID must be a valid MongoDB ID"),
];
router.get("/", WishlistController_1.WishlistController.getWishlist);
router.get("/count", WishlistController_1.WishlistController.getWishlistCount);
router.get("/check/:productId", productIdValidation, validation_1.handleValidationErrors, WishlistController_1.WishlistController.checkWishlistStatus);
router.post("/", WishlistController_1.WishlistController.addToWishlist);
router.delete("/remove/:productId", productIdValidation, validation_1.handleValidationErrors, WishlistController_1.WishlistController.removeFromWishlist);
router.delete("/clear", WishlistController_1.WishlistController.clearWishlist);
router.post("/move-to-cart/:productId", productIdValidation, validation_1.handleValidationErrors, WishlistController_1.WishlistController.moveToCart);
exports.default = router;
//# sourceMappingURL=wishlist.js.map