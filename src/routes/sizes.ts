import { Router } from "express";
import { SizeController } from "../controllers/SizeController";
import { authenticate, authorize, optionalAuth } from "../middlewares/auth";
import { handleValidationErrors } from "../middlewares/validation";
import { body, param } from "express-validator";

const router = Router();

// Size validation middleware
const createSizeValidation = [
  body("name").notEmpty().withMessage("Size name is required"),
  body("code").notEmpty().withMessage("Size code is required"),
  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),
  body("order")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Order must be a non-negative integer"),
];

const updateSizeValidation = [
  param("sizeId").isMongoId().withMessage("Size ID must be valid"),
  body("name").optional().notEmpty().withMessage("Size name cannot be empty"),
  body("code").optional().notEmpty().withMessage("Size code cannot be empty"),
  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),
  body("order")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Order must be a non-negative integer"),
  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean"),
];

const sizeIdValidation = [
  param("sizeId").isMongoId().withMessage("Size ID must be valid"),
];

// Public routes with optional authentication
/**
 * @swagger
 * /api/sizes:
 *   get:
 *     summary: Get all sizes
 *     tags: [Sizes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of sizes
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Size'
 */
router.get("/", optionalAuth, SizeController.getAllSizes);
router.get(
  "/:sizeId",
  optionalAuth,
  sizeIdValidation,
  handleValidationErrors,
  SizeController.getSizeById
);

// Admin only routes
/**
 * @swagger
 * /api/sizes:
 *   post:
 *     summary: Create a new size
 *     tags: [Sizes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/Size'
 *     responses:
 *       201:
 *         description: Size created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Size'
 */
router.use(authenticate, authorize("admin"));
router.post(
  "/",
  createSizeValidation,
  handleValidationErrors,
  SizeController.createSize
);
/**
 * @swagger
 * /api/sizes/{sizeId}:
 *   put:
 *     summary: Update a size
 *     tags: [Sizes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sizeId
 *         required: true
 *         schema:
 *           type: string
 *         description: Size ID
 *       - in: body
 *         name: body
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/Size'
 *     responses:
 *       200:
 *         description: Size updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Size'
 */
router.put(
  "/:sizeId",
  updateSizeValidation,
  handleValidationErrors,
  SizeController.updateSize
);
/**
 * @swagger
 * /api/sizes/{sizeId}:
 *   delete:
 *     summary: Delete a size
 *     tags: [Sizes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sizeId
 *         required: true
 *         schema:
 *           type: string
 *         description: Size ID
 *     responses:
 *       200:
 *         description: Size deleted successfully
 */
router.delete(
  "/:sizeId",
  sizeIdValidation,
  handleValidationErrors,
  SizeController.deleteSize
);
/**
 * @swagger
 * /api/sizes/{sizeId}/toggle-status:
 *   patch:
 *     summary: Toggle size status
 *     tags: [Sizes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sizeId
 *         required: true
 *         schema:
 *           type: string
 *         description: Size ID
 *     responses:
 *       200:
 *         description: Size status toggled successfully
 */
router.patch(
  "/:sizeId/toggle-status",
  sizeIdValidation,
  handleValidationErrors,
  SizeController.toggleSizeStatus
);

export default router;
