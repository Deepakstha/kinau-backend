import { Router } from "express";
import { ColorController } from "../controllers/ColorController";
import { authenticate, authorize, optionalAuth } from "../middlewares/auth";
import { handleValidationErrors } from "../middlewares/validation";
import { body, param } from "express-validator";

const router = Router();

// Color validation middleware
const createColorValidation = [
  body("name").notEmpty().withMessage("Color name is required"),
  body("hexCode").isHexColor().withMessage("Valid hex color code is required"),
  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),
];

const updateColorValidation = [
  param("colorId").isMongoId().withMessage("Color ID must be valid"),
  body("name").optional().notEmpty().withMessage("Color name cannot be empty"),
  body("hexCode")
    .optional()
    .isHexColor()
    .withMessage("Valid hex color code is required"),
  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),
  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean"),
];

const colorIdValidation = [
  param("colorId").isMongoId().withMessage("Color ID must be valid"),
];

// Public routes with optional authentication
/**
 * @swagger
 * /api/colors:
 *   get:
 *     summary: Get all colors
 *     tags: [Colors]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns a list of colors
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Color'
 */
router.get("/", optionalAuth, ColorController.getAllColors);
router.get(
  "/:colorId",
  optionalAuth,
  colorIdValidation,
  handleValidationErrors,
  ColorController.getColorById
);

// Admin only routes
/**
 * @swagger
 * /api/colors:
 *   post:
 *     summary: Create a new color
 *     tags: [Colors]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Color'
 *     responses:
 *       201:
 *         description: Color created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Color'
 */
router.use(authenticate, authorize("admin"));
router.post(
  "/",
  createColorValidation,
  handleValidationErrors,
  ColorController.createColor
);

/**
 * @swagger
 * /api/colors/{id}:
 *   put:
 *     summary: Update a color
 *     tags: [Colors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the color
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Color'
 *     responses:
 *       200:
 *         description: Color updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Color'
 */
router.put(
  "/:colorId",
  updateColorValidation,
  handleValidationErrors,
  ColorController.updateColor
);

/**
 * @swagger
 * /api/colors/{id}:
 *   delete:
 *     summary: Delete a color
 *     tags: [Colors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the color
 *     responses:
 *       200:
 *         description: Color deleted successfully
 */
router.delete(
  "/:colorId",
  colorIdValidation,
  handleValidationErrors,
  ColorController.deleteColor
);

/**
 * @swagger
 * /api/colors/{id}/toggle-status:
 *   patch:
 *     summary: Toggle color status
 *     tags: [Colors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the color
 *     responses:
 *       200:
 *         description: Color status toggled successfully
 */
router.patch(
  "/:colorId/toggle-status",
  colorIdValidation,
  handleValidationErrors,
  ColorController.toggleColorStatus
);

export default router;
