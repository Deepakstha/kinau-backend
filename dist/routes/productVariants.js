"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ProductVariantController_1 = require("../controllers/ProductVariantController");
const auth_1 = require("../middlewares/auth");
const upload_1 = require("../utils/upload");
const validation_1 = require("../middlewares/validation");
const router = (0, express_1.Router)();
router.get("/product/:productId", auth_1.optionalAuth, ProductVariantController_1.ProductVariantController.getVariantsByProduct);
router.get("/:variantId", auth_1.optionalAuth, ProductVariantController_1.ProductVariantController.getVariantById);
router.post("/product/:productId", auth_1.authenticate, (0, auth_1.authorize)("admin"), upload_1.upload.single("image"), validation_1.validateProductVariant, ProductVariantController_1.ProductVariantController.createVariant);
router.put("/:variantId", auth_1.authenticate, (0, auth_1.authorize)("admin"), upload_1.upload.single("image"), validation_1.validateProductVariant, ProductVariantController_1.ProductVariantController.updateVariant);
router.delete("/:variantId", auth_1.authenticate, (0, auth_1.authorize)("admin"), ProductVariantController_1.ProductVariantController.deleteVariant);
router.patch("/:variantId/toggle-status", auth_1.authenticate, (0, auth_1.authorize)("admin"), ProductVariantController_1.ProductVariantController.toggleVariantStatus);
router.patch("/:variantId/stock", auth_1.authenticate, (0, auth_1.authorize)("admin"), ProductVariantController_1.ProductVariantController.updateStock);
exports.default = router;
//# sourceMappingURL=productVariants.js.map