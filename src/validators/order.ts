import { body, param, query } from "express-validator";

export const createOrderValidation = [
  body("items")
    .isArray({ min: 1 })
    .withMessage("Order must contain at least one item"),
  body("items.*.product").isMongoId().withMessage("Product must be a valid ID"),
  body("items.*.variant")
    .optional()
    .isMongoId()
    .withMessage("Variant must be a valid ID"),
  body("items.*.quantity")
    .isInt({ min: 1, max: 100 })
    .withMessage("Quantity must be between 1 and 100"),
  body("items.*.price")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),
  body("shippingAddress.firstName")
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("First name is required and must be less than 50 characters"),
  body("shippingAddress.lastName")
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Last name is required and must be less than 50 characters"),
  body("shippingAddress.company")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Company name cannot exceed 100 characters"),
  body("shippingAddress.addressLine1")
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage(
      "Address line 1 is required and must be less than 200 characters"
    ),
  body("shippingAddress.addressLine2")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Address line 2 cannot exceed 200 characters"),
  body("shippingAddress.city")
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("City is required and must be less than 50 characters"),
  body("shippingAddress.state")
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("State is required and must be less than 50 characters"),
  body("shippingAddress.postalCode")
    .trim()
    .isLength({ min: 1, max: 20 })
    .withMessage("Postal code is required and must be less than 20 characters"),
  body("shippingAddress.country")
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Country is required and must be less than 50 characters"),
  body("shippingAddress.phone")
    .trim()
    .isMobilePhone("any")
    .withMessage("Valid phone number is required"),
  body("billingAddress")
    .optional()
    .isObject()
    .withMessage("Billing address must be an object"),
  body("paymentMethod")
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Payment method is required"),
  body("shippingCost")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Shipping cost must be a positive number"),
  body("tax")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Tax must be a positive number"),
];

export const updateOrderStatusValidation = [
  param("id").isMongoId().withMessage("Order ID must be valid"),
  body("status")
    .isIn([
      "pending",
      "confirmed",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ])
    .withMessage("Invalid order status"),
  body("note")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Note cannot exceed 500 characters"),
];

export const updatePaymentStatusValidation = [
  param("id").isMongoId().withMessage("Order ID must be valid"),
  body("paymentStatus")
    .isIn(["pending", "paid", "failed", "refunded"])
    .withMessage("Invalid payment status"),
  body("transactionId")
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Transaction ID must be between 1 and 100 characters"),
  body("paidAt")
    .optional()
    .isISO8601()
    .withMessage("Paid at must be a valid date"),
];

export const updateTrackingValidation = [
  param("id").isMongoId().withMessage("Order ID must be valid"),
  body("trackingNumber")
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage(
      "Tracking number is required and must be less than 100 characters"
    ),
  body("shippedAt")
    .optional()
    .isISO8601()
    .withMessage("Shipped at must be a valid date"),
];

export const cancelOrderValidation = [
  param("id").isMongoId().withMessage("Order ID must be valid"),
  body("cancelReason")
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage(
      "Cancel reason is required and must be less than 500 characters"
    ),
];

export const orderIdValidation = [
  param("id").isMongoId().withMessage("Order ID must be valid"),
];

export const orderQueryValidation = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
  query("status")
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
  query("paymentStatus")
    .optional()
    .isIn(["pending", "paid", "failed", "refunded"])
    .withMessage("Invalid payment status"),
  query("startDate")
    .optional()
    .isISO8601()
    .withMessage("Start date must be a valid date"),
  query("endDate")
    .optional()
    .isISO8601()
    .withMessage("End date must be a valid date"),
  query("minAmount")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Minimum amount must be a positive number"),
  query("maxAmount")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Maximum amount must be a positive number"),
];
