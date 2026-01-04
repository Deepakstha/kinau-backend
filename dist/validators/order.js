"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderQueryValidation = exports.orderIdValidation = exports.cancelOrderValidation = exports.updateTrackingValidation = exports.updatePaymentStatusValidation = exports.updateOrderStatusValidation = exports.createOrderValidation = void 0;
const express_validator_1 = require("express-validator");
exports.createOrderValidation = [
    (0, express_validator_1.body)("items")
        .isArray({ min: 1 })
        .withMessage("Order must contain at least one item"),
    (0, express_validator_1.body)("items.*.product").isMongoId().withMessage("Product must be a valid ID"),
    (0, express_validator_1.body)("items.*.variant")
        .optional()
        .isMongoId()
        .withMessage("Variant must be a valid ID"),
    (0, express_validator_1.body)("items.*.quantity")
        .isInt({ min: 1, max: 100 })
        .withMessage("Quantity must be between 1 and 100"),
    (0, express_validator_1.body)("items.*.price")
        .isFloat({ min: 0 })
        .withMessage("Price must be a positive number"),
    (0, express_validator_1.body)("shippingAddress.firstName")
        .trim()
        .isLength({ min: 1, max: 50 })
        .withMessage("First name is required and must be less than 50 characters"),
    (0, express_validator_1.body)("shippingAddress.lastName")
        .trim()
        .isLength({ min: 1, max: 50 })
        .withMessage("Last name is required and must be less than 50 characters"),
    (0, express_validator_1.body)("shippingAddress.company")
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage("Company name cannot exceed 100 characters"),
    (0, express_validator_1.body)("shippingAddress.addressLine1")
        .trim()
        .isLength({ min: 1, max: 200 })
        .withMessage("Address line 1 is required and must be less than 200 characters"),
    (0, express_validator_1.body)("shippingAddress.addressLine2")
        .optional()
        .trim()
        .isLength({ max: 200 })
        .withMessage("Address line 2 cannot exceed 200 characters"),
    (0, express_validator_1.body)("shippingAddress.city")
        .trim()
        .isLength({ min: 1, max: 50 })
        .withMessage("City is required and must be less than 50 characters"),
    (0, express_validator_1.body)("shippingAddress.state")
        .trim()
        .isLength({ min: 1, max: 50 })
        .withMessage("State is required and must be less than 50 characters"),
    (0, express_validator_1.body)("shippingAddress.postalCode")
        .trim()
        .isLength({ min: 1, max: 20 })
        .withMessage("Postal code is required and must be less than 20 characters"),
    (0, express_validator_1.body)("shippingAddress.country")
        .trim()
        .isLength({ min: 1, max: 50 })
        .withMessage("Country is required and must be less than 50 characters"),
    (0, express_validator_1.body)("shippingAddress.phone")
        .trim()
        .isMobilePhone("any")
        .withMessage("Valid phone number is required"),
    (0, express_validator_1.body)("billingAddress")
        .optional()
        .isObject()
        .withMessage("Billing address must be an object"),
    (0, express_validator_1.body)("paymentMethod")
        .trim()
        .isLength({ min: 1, max: 50 })
        .withMessage("Payment method is required"),
    (0, express_validator_1.body)("shippingCost")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Shipping cost must be a positive number"),
    (0, express_validator_1.body)("tax")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Tax must be a positive number"),
];
exports.updateOrderStatusValidation = [
    (0, express_validator_1.param)("id").isMongoId().withMessage("Order ID must be valid"),
    (0, express_validator_1.body)("status")
        .isIn([
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
    ])
        .withMessage("Invalid order status"),
    (0, express_validator_1.body)("note")
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage("Note cannot exceed 500 characters"),
];
exports.updatePaymentStatusValidation = [
    (0, express_validator_1.param)("id").isMongoId().withMessage("Order ID must be valid"),
    (0, express_validator_1.body)("paymentStatus")
        .isIn(["pending", "paid", "failed", "refunded"])
        .withMessage("Invalid payment status"),
    (0, express_validator_1.body)("transactionId")
        .optional()
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage("Transaction ID must be between 1 and 100 characters"),
    (0, express_validator_1.body)("paidAt")
        .optional()
        .isISO8601()
        .withMessage("Paid at must be a valid date"),
];
exports.updateTrackingValidation = [
    (0, express_validator_1.param)("id").isMongoId().withMessage("Order ID must be valid"),
    (0, express_validator_1.body)("trackingNumber")
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage("Tracking number is required and must be less than 100 characters"),
    (0, express_validator_1.body)("shippedAt")
        .optional()
        .isISO8601()
        .withMessage("Shipped at must be a valid date"),
];
exports.cancelOrderValidation = [
    (0, express_validator_1.param)("id").isMongoId().withMessage("Order ID must be valid"),
    (0, express_validator_1.body)("cancelReason")
        .trim()
        .isLength({ min: 1, max: 500 })
        .withMessage("Cancel reason is required and must be less than 500 characters"),
];
exports.orderIdValidation = [
    (0, express_validator_1.param)("id").isMongoId().withMessage("Order ID must be valid"),
];
exports.orderQueryValidation = [
    (0, express_validator_1.query)("page")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Page must be a positive integer"),
    (0, express_validator_1.query)("limit")
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage("Limit must be between 1 and 100"),
    (0, express_validator_1.query)("status")
        .optional()
        .isIn([
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
    ])
        .withMessage("Invalid order status"),
    (0, express_validator_1.query)("paymentStatus")
        .optional()
        .isIn(["pending", "paid", "failed", "refunded"])
        .withMessage("Invalid payment status"),
    (0, express_validator_1.query)("startDate")
        .optional()
        .isISO8601()
        .withMessage("Start date must be a valid date"),
    (0, express_validator_1.query)("endDate")
        .optional()
        .isISO8601()
        .withMessage("End date must be a valid date"),
    (0, express_validator_1.query)("minAmount")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Minimum amount must be a positive number"),
    (0, express_validator_1.query)("maxAmount")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Maximum amount must be a positive number"),
];
//# sourceMappingURL=order.js.map