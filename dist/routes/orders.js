"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const OrderController_1 = require("../controllers/OrderController");
const auth_1 = require("../middlewares/auth");
const validation_1 = require("../middlewares/validation");
const express_validator_1 = require("express-validator");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
const createOrderValidation = [
    (0, express_validator_1.body)("shippingAddressId")
        .isMongoId()
        .withMessage("Shipping address ID must be valid"),
    (0, express_validator_1.body)("paymentMethod").notEmpty().withMessage("Payment method is required"),
    (0, express_validator_1.body)("notes").optional().isString().withMessage("Notes must be a string"),
];
const orderIdValidation = [
    (0, express_validator_1.param)("orderId").isMongoId().withMessage("Order ID must be valid"),
];
const cancelOrderValidation = [
    (0, express_validator_1.param)("orderId").isMongoId().withMessage("Order ID must be valid"),
    (0, express_validator_1.body)("reason").notEmpty().withMessage("Cancellation reason is required"),
];
const orderQueryValidation = [
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
        .withMessage("Invalid status"),
];
const updateOrderStatusValidation = [
    (0, express_validator_1.param)("orderId").isMongoId().withMessage("Order ID must be valid"),
    (0, express_validator_1.body)("status")
        .isIn([
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
    ])
        .withMessage("Invalid status"),
];
const updatePaymentStatusValidation = [
    (0, express_validator_1.param)("orderId").isMongoId().withMessage("Order ID must be valid"),
    (0, express_validator_1.body)("paymentStatus")
        .isIn(["pending", "paid", "failed", "refunded"])
        .withMessage("Invalid payment status"),
    (0, express_validator_1.body)("transactionId")
        .optional()
        .isString()
        .withMessage("Transaction ID must be a string"),
];
router.post("/", createOrderValidation, validation_1.handleValidationErrors, OrderController_1.OrderController.createOrder);
router.post("/sales", OrderController_1.OrderController.getMonthlyOrdersAndSales);
router.get("/", orderQueryValidation, validation_1.handleValidationErrors, OrderController_1.OrderController.getOrders);
router.get("/stats", OrderController_1.OrderController.getOrderStats);
router.get("/:orderId", orderIdValidation, validation_1.handleValidationErrors, OrderController_1.OrderController.getOrderById);
router.patch("/:orderId/cancel", cancelOrderValidation, validation_1.handleValidationErrors, OrderController_1.OrderController.cancelOrder);
router.use((0, auth_1.authorize)("admin"));
router.get("/admin/all", orderQueryValidation, validation_1.handleValidationErrors, OrderController_1.OrderController.getAllOrders);
router.get("/admin/stats", OrderController_1.OrderController.getAdminOrderStats);
router.patch("/admin/:orderId/status", updateOrderStatusValidation, validation_1.handleValidationErrors, OrderController_1.OrderController.updateOrderStatus);
router.patch("/admin/:orderId/payment", updatePaymentStatusValidation, validation_1.handleValidationErrors, OrderController_1.OrderController.updatePaymentStatus);
exports.default = router;
//# sourceMappingURL=orders.js.map