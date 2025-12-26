import { Router } from "express";
import { ShippingAddressController } from "../controllers/ShippingAddressController";
import { authenticate } from "../middlewares/auth";
import { handleValidationErrors } from "../middlewares/validation";
import { body, param } from "express-validator";

const router = Router();

// All shipping address routes require authentication
router.use(authenticate);

// Shipping address validation middleware
const createAddressValidation = [
  body("firstName").notEmpty().withMessage("First name is required"),
  body("lastName").notEmpty().withMessage("Last name is required"),
  body("phone").notEmpty().withMessage("Phone number is required"),
  body("addressLine1").notEmpty().withMessage("Address line 1 is required"),
  body("addressLine2")
    .optional()
    .isString()
    .withMessage("Address line 2 must be a string"),
  body("city").notEmpty().withMessage("City is required"),
  body("state").notEmpty().withMessage("State is required"),
  body("postalCode").notEmpty().withMessage("Postal code is required"),
  body("country").notEmpty().withMessage("Country is required"),
  body("isDefault")
    .optional()
    .isBoolean()
    .withMessage("isDefault must be a boolean"),
];

const updateAddressValidation = [
  param("addressId").isMongoId().withMessage("Address ID must be valid"),
  body("fullName")
    .optional()
    .notEmpty()
    .withMessage("Full name cannot be empty"),
  body("phoneNumber")
    .optional()
    .notEmpty()
    .withMessage("Phone number cannot be empty"),
  body("addressLine1")
    .optional()
    .notEmpty()
    .withMessage("Address line 1 cannot be empty"),
  body("addressLine2")
    .optional()
    .isString()
    .withMessage("Address line 2 must be a string"),
  body("city").optional().notEmpty().withMessage("City cannot be empty"),
  body("state").optional().notEmpty().withMessage("State cannot be empty"),
  body("postalCode")
    .optional()
    .notEmpty()
    .withMessage("Postal code cannot be empty"),
  body("country").optional().notEmpty().withMessage("Country cannot be empty"),
  body("isDefault")
    .optional()
    .isBoolean()
    .withMessage("isDefault must be a boolean"),
];

const addressIdValidation = [
  param("addressId").isMongoId().withMessage("Address ID must be valid"),
];

// Shipping address routes
/**
 * @swagger
 * /api/shipping-addresses:
 *   get:
 *     summary: Get all shipping addresses
 *     tags: [Shipping Addresses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of shipping addresses
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ShippingAddress'
 */
router.get("/", ShippingAddressController.getAddresses);

/**
 * @swagger
 * /api/shipping-addresses/default:
 *   get:
 *     summary: Get default shipping address
 *     tags: [Shipping Addresses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Default shipping address
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ShippingAddress'
 */
router.get("/default", ShippingAddressController.getDefaultAddress);

/**
 * @swagger
 * /api/shipping-addresses/{addressId}:
 *   get:
 *     summary: Get shipping address by ID
 *     tags: [Shipping Addresses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: addressId
 *         required: true
 *         schema:
 *           type: string
 *         description: Shipping address ID
 *     responses:
 *       200:
 *         description: Shipping address details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ShippingAddress'
 */
router.get(
  "/:addressId",
  addressIdValidation,
  handleValidationErrors,
  ShippingAddressController.getAddressById
);

/**
 * @swagger
 * /api/shipping-addresses:
 *   post:
 *     summary: Create a new shipping address
 *     tags: [Shipping Addresses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/ShippingAddress'
 *     responses:
 *       201:
 *         description: Shipping address created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ShippingAddress'
 */
router.post(
  "/",
  createAddressValidation,
  handleValidationErrors,
  ShippingAddressController.createAddress
);

/**
 * @swagger
 * /api/shipping-addresses/{addressId}:
 *   put:
 *     summary: Update a shipping address
 *     tags: [Shipping Addresses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: addressId
 *         required: true
 *         schema:
 *           type: string
 *         description: Shipping address ID
 *       - in: body
 *         name: body
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/ShippingAddress'
 *     responses:
 *       200:
 *         description: Shipping address updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ShippingAddress'
 */
router.put(
  "/:addressId",
  updateAddressValidation,
  handleValidationErrors,
  ShippingAddressController.updateAddress
);

/**
 * @swagger
 * /api/shipping-addresses/{addressId}:
 *   delete:
 *     summary: Delete a shipping address
 *     tags: [Shipping Addresses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: addressId
 *         required: true
 *         schema:
 *           type: string
 *         description: Shipping address ID
 *     responses:
 *       200:
 *         description: Shipping address deleted successfully
 */
router.delete(
  "/:addressId",
  addressIdValidation,
  handleValidationErrors,
  ShippingAddressController.deleteAddress
);

/**
 * @swagger
 * /api/shipping-addresses/{addressId}/default:
 *   patch:
 *     summary: Set default shipping address
 *     tags: [Shipping Addresses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: addressId
 *         required: true
 *         schema:
 *           type: string
 *         description: Shipping address ID
 *     responses:
 *       200:
 *         description: Default shipping address set successfully
 */
router.patch(
  "/:addressId/default",
  addressIdValidation,
  handleValidationErrors,
  ShippingAddressController.setDefaultAddress
);

export default router;
