"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ColorController_1 = require("../controllers/ColorController");
const auth_1 = require("../middlewares/auth");
const validation_1 = require("../middlewares/validation");
const express_validator_1 = require("express-validator");
const router = (0, express_1.Router)();
const createColorValidation = [
    (0, express_validator_1.body)("name").notEmpty().withMessage("Color name is required"),
    (0, express_validator_1.body)("hexCode").isHexColor().withMessage("Valid hex color code is required"),
    (0, express_validator_1.body)("description")
        .optional()
        .isString()
        .withMessage("Description must be a string"),
];
const updateColorValidation = [
    (0, express_validator_1.param)("colorId").isMongoId().withMessage("Color ID must be valid"),
    (0, express_validator_1.body)("name").optional().notEmpty().withMessage("Color name cannot be empty"),
    (0, express_validator_1.body)("hexCode")
        .optional()
        .isHexColor()
        .withMessage("Valid hex color code is required"),
    (0, express_validator_1.body)("description")
        .optional()
        .isString()
        .withMessage("Description must be a string"),
    (0, express_validator_1.body)("isActive")
        .optional()
        .isBoolean()
        .withMessage("isActive must be a boolean"),
];
const colorIdValidation = [
    (0, express_validator_1.param)("colorId").isMongoId().withMessage("Color ID must be valid"),
];
router.get("/", auth_1.optionalAuth, ColorController_1.ColorController.getAllColors);
router.get("/:colorId", auth_1.optionalAuth, colorIdValidation, validation_1.handleValidationErrors, ColorController_1.ColorController.getColorById);
router.use(auth_1.authenticate, (0, auth_1.authorize)("admin"));
router.post("/", createColorValidation, validation_1.handleValidationErrors, ColorController_1.ColorController.createColor);
router.put("/:colorId", updateColorValidation, validation_1.handleValidationErrors, ColorController_1.ColorController.updateColor);
router.delete("/:colorId", colorIdValidation, validation_1.handleValidationErrors, ColorController_1.ColorController.deleteColor);
router.patch("/:colorId/toggle-status", colorIdValidation, validation_1.handleValidationErrors, ColorController_1.ColorController.toggleColorStatus);
exports.default = router;
//# sourceMappingURL=colors.js.map