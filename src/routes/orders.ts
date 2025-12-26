import { Router } from "express";
import { OrderController } from "../controllers/OrderController";
import { authenticate, authorize } from "../middlewares/auth";
import { handleValidationErrors } from "../middlewares/validation";
import { body, param, query } from "express-validator";

const router = Router();

// All order routes require authentication
router.use(authenticate);

// Order validation middleware
const createOrderValidation = [
  body("shippingAddressId")
    .isMongoId()
    .withMessage("Shipping address ID must be valid"),
  body("paymentMethod").notEmpty().withMessage("Payment method is required"),
  body("notes").optional().isString().withMessage("Notes must be a string"),
];

const orderIdValidation = [
  param("orderId").isMongoId().withMessage("Order ID must be valid"),
];

const cancelOrderValidation = [
  param("orderId").isMongoId().withMessage("Order ID must be valid"),
  body("reason").notEmpty().withMessage("Cancellation reason is required"),
];

const orderQueryValidation = [
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
    .withMessage("Invalid status"),
];

const updateOrderStatusValidation = [
  param("orderId").isMongoId().withMessage("Order ID must be valid"),
  body("status")
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
  param("orderId").isMongoId().withMessage("Order ID must be valid"),
  body("paymentStatus")
    .isIn(["pending", "paid", "failed", "refunded"])
    .withMessage("Invalid payment status"),
  body("transactionId")
    .optional()
    .isString()
    .withMessage("Transaction ID must be a string"),
];

// Customer routes
/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 */
router.post(
  "/",
  createOrderValidation,
  handleValidationErrors,
  OrderController.createOrder
);

router.post("/sales",OrderController.getMonthlyOrdersAndSales)

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get all orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns a list of orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 */
router.get(
  "/",
  orderQueryValidation,
  handleValidationErrors,
  OrderController.getOrders
);

/**
 * @swagger
 * /api/orders/stats:
 *   get:
 *     summary: Get order statistics
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns order statistics
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderStats'
 */
router.get("/stats", OrderController.getOrderStats);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get order by ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the order
 *     responses:
 *       200:
 *         description: Returns an order
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 */
router.get(
  "/:orderId",
  orderIdValidation,
  handleValidationErrors,
  OrderController.getOrderById
);

/**
 * @swagger
 * /api/orders/{id}/cancel:
 *   patch:
 *     summary: Cancel an order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the order
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CancelOrder'
 *     responses:
 *       200:
 *         description: Order cancelled successfully
 */
router.patch(
  "/:orderId/cancel",
  cancelOrderValidation,
  handleValidationErrors,
  OrderController.cancelOrder
);

/**
 * @swagger
 * /api/orders/admin/all:
 *   get:
 *     summary: Get all orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the order
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CancelOrder'
 *     responses:
 *       200:
 *         description: Order cancelled successfully
 */
router.use(authorize("admin"));

/**
 * @swagger
 * /api/orders/admin/all:
 *   get:
 *     summary: Get all orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the order
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CancelOrder'
 *     responses:
 *       200:
 *         description: Order cancelled successfully
 */
router.get(
  "/admin/all",
  orderQueryValidation,
  handleValidationErrors,
  OrderController.getAllOrders
);

/**
 * @swagger
 * /api/orders/admin/stats:
 *   get:
 *     summary: Get all orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the order
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CancelOrder'
 *     responses:
 *       200:
 *         description: Order cancelled successfully
 */
router.get("/admin/stats", OrderController.getAdminOrderStats);

/**
 * @swagger
 * /api/orders/admin/{id}/status:
 *   patch:
 *     summary: Cancel an order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the order
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CancelOrder'
 *     responses:
 *       200:
 *         description: Order cancelled successfully
 */
router.patch(
  "/admin/:orderId/status",
  updateOrderStatusValidation,
  handleValidationErrors,
  OrderController.updateOrderStatus
);

/**
 * @swagger
 * /api/orders/admin/{id}/payment:
 *   patch:
 *     summary: Cancel an order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the order
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CancelOrder'
 *     responses:
 *       200:
 *         description: Order cancelled successfully
 */
router.patch(
  "/admin/:orderId/payment",
  updatePaymentStatusValidation,
  handleValidationErrors,
  OrderController.updatePaymentStatus
);

export default router;
