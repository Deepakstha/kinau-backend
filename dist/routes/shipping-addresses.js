"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ShippingAddressController_1 = require("../controllers/ShippingAddressController");
const auth_1 = require("../middlewares/auth");
const validation_1 = require("../middlewares/validation");
const express_validator_1 = require("express-validator");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
const createAddressValidation = [
    (0, express_validator_1.body)("firstName").notEmpty().withMessage("First name is required"),
    (0, express_validator_1.body)("lastName").notEmpty().withMessage("Last name is required"),
    (0, express_validator_1.body)("phone").notEmpty().withMessage("Phone number is required"),
    (0, express_validator_1.body)("addressLine1").notEmpty().withMessage("Address line 1 is required"),
    (0, express_validator_1.body)("addressLine2")
        .optional()
        .isString()
        .withMessage("Address line 2 must be a string"),
    (0, express_validator_1.body)("city").notEmpty().withMessage("City is required"),
    (0, express_validator_1.body)("state").notEmpty().withMessage("State is required"),
    (0, express_validator_1.body)("postalCode").notEmpty().withMessage("Postal code is required"),
    (0, express_validator_1.body)("country").notEmpty().withMessage("Country is required"),
    (0, express_validator_1.body)("isDefault")
        .optional()
        .isBoolean()
        .withMessage("isDefault must be a boolean"),
];
const updateAddressValidation = [
    (0, express_validator_1.param)("addressId").isMongoId().withMessage("Address ID must be valid"),
    (0, express_validator_1.body)("fullName")
        .optional()
        .notEmpty()
        .withMessage("Full name cannot be empty"),
    (0, express_validator_1.body)("phoneNumber")
        .optional()
        .notEmpty()
        .withMessage("Phone number cannot be empty"),
    (0, express_validator_1.body)("addressLine1")
        .optional()
        .notEmpty()
        .withMessage("Address line 1 cannot be empty"),
    (0, express_validator_1.body)("addressLine2")
        .optional()
        .isString()
        .withMessage("Address line 2 must be a string"),
    (0, express_validator_1.body)("city").optional().notEmpty().withMessage("City cannot be empty"),
    (0, express_validator_1.body)("state").optional().notEmpty().withMessage("State cannot be empty"),
    (0, express_validator_1.body)("postalCode")
        .optional()
        .notEmpty()
        .withMessage("Postal code cannot be empty"),
    (0, express_validator_1.body)("country").optional().notEmpty().withMessage("Country cannot be empty"),
    (0, express_validator_1.body)("isDefault")
        .optional()
        .isBoolean()
        .withMessage("isDefault must be a boolean"),
];
const addressIdValidation = [
    (0, express_validator_1.param)("addressId").isMongoId().withMessage("Address ID must be valid"),
];
router.get("/", ShippingAddressController_1.ShippingAddressController.getAddresses);
router.get("/default", ShippingAddressController_1.ShippingAddressController.getDefaultAddress);
router.get("/:addressId", addressIdValidation, validation_1.handleValidationErrors, ShippingAddressController_1.ShippingAddressController.getAddressById);
router.post("/", createAddressValidation, validation_1.handleValidationErrors, ShippingAddressController_1.ShippingAddressController.createAddress);
router.put("/:addressId", updateAddressValidation, validation_1.handleValidationErrors, ShippingAddressController_1.ShippingAddressController.updateAddress);
router.delete("/:addressId", addressIdValidation, validation_1.handleValidationErrors, ShippingAddressController_1.ShippingAddressController.deleteAddress);
router.patch("/:addressId/default", addressIdValidation, validation_1.handleValidationErrors, ShippingAddressController_1.ShippingAddressController.setDefaultAddress);
exports.default = router;
//# sourceMappingURL=shipping-addresses.js.map