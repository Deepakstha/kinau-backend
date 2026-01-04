"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const SizeController_1 = require("../controllers/SizeController");
const auth_1 = require("../middlewares/auth");
const validation_1 = require("../middlewares/validation");
const express_validator_1 = require("express-validator");
const router = (0, express_1.Router)();
const createSizeValidation = [
    (0, express_validator_1.body)("name").notEmpty().withMessage("Size name is required"),
    (0, express_validator_1.body)("code").notEmpty().withMessage("Size code is required"),
    (0, express_validator_1.body)("description")
        .optional()
        .isString()
        .withMessage("Description must be a string"),
    (0, express_validator_1.body)("order")
        .optional()
        .isInt({ min: 0 })
        .withMessage("Order must be a non-negative integer"),
];
const updateSizeValidation = [
    (0, express_validator_1.param)("sizeId").isMongoId().withMessage("Size ID must be valid"),
    (0, express_validator_1.body)("name").optional().notEmpty().withMessage("Size name cannot be empty"),
    (0, express_validator_1.body)("code").optional().notEmpty().withMessage("Size code cannot be empty"),
    (0, express_validator_1.body)("description")
        .optional()
        .isString()
        .withMessage("Description must be a string"),
    (0, express_validator_1.body)("order")
        .optional()
        .isInt({ min: 0 })
        .withMessage("Order must be a non-negative integer"),
    (0, express_validator_1.body)("isActive")
        .optional()
        .isBoolean()
        .withMessage("isActive must be a boolean"),
];
const sizeIdValidation = [
    (0, express_validator_1.param)("sizeId").isMongoId().withMessage("Size ID must be valid"),
];
router.get("/", auth_1.optionalAuth, SizeController_1.SizeController.getAllSizes);
router.get("/:sizeId", auth_1.optionalAuth, sizeIdValidation, validation_1.handleValidationErrors, SizeController_1.SizeController.getSizeById);
router.use(auth_1.authenticate, (0, auth_1.authorize)("admin"));
router.post("/", createSizeValidation, validation_1.handleValidationErrors, SizeController_1.SizeController.createSize);
router.put("/:sizeId", updateSizeValidation, validation_1.handleValidationErrors, SizeController_1.SizeController.updateSize);
router.delete("/:sizeId", sizeIdValidation, validation_1.handleValidationErrors, SizeController_1.SizeController.deleteSize);
router.patch("/:sizeId/toggle-status", sizeIdValidation, validation_1.handleValidationErrors, SizeController_1.SizeController.toggleSizeStatus);
exports.default = router;
//# sourceMappingURL=sizes.js.map