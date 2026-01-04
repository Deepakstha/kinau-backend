"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const package_json_1 = require("../../package.json");
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "E-commerce API Documentation",
            version: package_json_1.version,
            description: "Comprehensive API documentation for the E-commerce backend",
            contact: {
                name: "API Support",
                email: "support@example.com",
                url: "https://example.com/support",
            },
            license: {
                name: "MIT",
                url: "https://opensource.org/licenses/MIT",
            },
        },
        servers: [
            {
                url: "http://localhost:3000",
                description: "Development server",
            },
            {
                url: "https://ecommerce-nodejs-production-6c25.up.railway.app",
                description: "Production server",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                    description: "Enter JWT token in the format: Bearer <token>",
                },
            },
            schemas: {
                ErrorResponse: {
                    type: "object",
                    properties: {
                        success: { type: "boolean", example: false },
                        message: { type: "string", example: "Error message" },
                        errors: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    field: { type: "string" },
                                    message: { type: "string" },
                                },
                            },
                        },
                    },
                },
                LoginRequest: {
                    type: "object",
                    required: ["email", "password"],
                    properties: {
                        email: {
                            type: "string",
                            format: "email",
                            example: "user@example.com",
                        },
                        password: {
                            type: "string",
                            format: "password",
                            example: "password123",
                        },
                    },
                },
                RegisterRequest: {
                    type: "object",
                    required: ["name", "email", "password", "confirmPassword"],
                    properties: {
                        name: { type: "string", example: "John Doe" },
                        email: {
                            type: "string",
                            format: "email",
                            example: "user@example.com",
                        },
                        password: {
                            type: "string",
                            format: "password",
                            minLength: 8,
                            example: "password123",
                        },
                        confirmPassword: {
                            type: "string",
                            format: "password",
                            example: "password123",
                        },
                    },
                },
                Product: {
                    type: "object",
                    properties: {
                        _id: { type: "string", example: "64d5f7a5c4b3e1f5c8d9e0f1" },
                        name: { type: "string", example: "Product Name" },
                        description: { type: "string", example: "Product description" },
                        price: { type: "number", example: 99.99 },
                        category: { type: "string", example: "64d5f7a5c4b3e1f5c8d9e0f2" },
                        images: {
                            type: "array",
                            items: { type: "string" },
                            example: ["image1.jpg", "image2.jpg"],
                        },
                        isActive: { type: "boolean", example: true },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" },
                    },
                },
                CartItem: {
                    type: "object",
                    required: ["product", "quantity", "price"],
                    properties: {
                        product: {
                            type: "string",
                            description: "ID of the product",
                            example: "64d5f7a5c4b3e1f5c8d9e0f1",
                        },
                        variant: {
                            type: "string",
                            description: "ID of the product variant (if applicable)",
                            example: "64d5f7a5c4b3e1f5c8d9e0f2",
                        },
                        quantity: {
                            type: "integer",
                            minimum: 1,
                            description: "Quantity of the product",
                            example: 2,
                        },
                        price: {
                            type: "number",
                            minimum: 0,
                            description: "Price per unit",
                            example: 99.99,
                        },
                    },
                },
                OrderItem: {
                    type: "object",
                    properties: {
                        product: { type: "string", example: "64d5f7a5c4b3e1f5c8d9e0fe" },
                        variant: { type: "string", example: "64d5f7a5c4b3e1f5c8d9e0f2" },
                        quantity: { type: "integer", example: 2 },
                        price: { type: "number", example: 99.99 },
                    },
                },
                Order: {
                    type: "object",
                    properties: {
                        _id: { type: "string", example: "64d5f7a5c4b3e1f5c8d9e0f1" },
                        user: { type: "string", example: "64d5f7a5c4b3e1f5c8d9e0f3" },
                        items: {
                            type: "array",
                            items: { $ref: "#/components/schemas/OrderItem" },
                        },
                        totalAmount: { type: "number", example: 199.98 },
                        status: {
                            type: "string",
                            enum: [
                                "pending",
                                "processing",
                                "shipped",
                                "delivered",
                                "cancelled",
                            ],
                            example: "pending",
                        },
                        shippingAddress: { type: "object" },
                        paymentStatus: {
                            type: "string",
                            enum: ["pending", "paid", "failed", "refunded"],
                            example: "pending",
                        },
                        paymentMethod: {
                            type: "string",
                            enum: ["credit_card", "paypal", "cod"],
                            example: "credit_card",
                        },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" },
                    },
                },
                Category: {
                    type: "object",
                    properties: {
                        _id: { type: "string", example: "64d5f7a5c4b3e1f5c8d9e0f1" },
                        name: { type: "string", example: "Electronics" },
                        slug: { type: "string", example: "electronics" },
                        description: {
                            type: "string",
                            example: "Electronic devices and accessories",
                        },
                        image: { type: "string", example: "category-image.jpg" },
                        isActive: { type: "boolean", example: true },
                        parent: { type: "string", example: null },
                        children: {
                            type: "array",
                            items: { $ref: "#/components/schemas/Category" },
                        },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" },
                    },
                },
                ShippingAddress: {
                    type: "object",
                    properties: {
                        _id: { type: "string", example: "64d5f7a5c4b3e1f5c8d9e0f1" },
                        user: { type: "string", example: "64d5f7a5c4b3e1f5c8d9e0f2" },
                        fullName: { type: "string", example: "John Doe" },
                        phoneNumber: { type: "string", example: "+1234567890" },
                        addressLine1: { type: "string", example: "123 Main St" },
                        addressLine2: { type: "string", example: "Apt 4B" },
                        city: { type: "string", example: "New York" },
                        state: { type: "string", example: "NY" },
                        postalCode: { type: "string", example: "10001" },
                        country: { type: "string", example: "United States" },
                        isDefault: { type: "boolean", example: true },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" },
                    },
                },
                Pagination: {
                    type: "object",
                    properties: {
                        total: { type: "integer", example: 100 },
                        page: { type: "integer", example: 1 },
                        limit: { type: "integer", example: 10 },
                        totalPages: { type: "integer", example: 10 },
                        hasNext: { type: "boolean", example: true },
                        hasPrev: { type: "boolean", example: false },
                    },
                },
            },
            responses: {
                UnauthorizedError: {
                    description: "Access token is missing or invalid",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/ErrorResponse",
                            },
                            example: {
                                success: false,
                                message: "Please authenticate",
                                code: "UNAUTHORIZED",
                            },
                        },
                    },
                },
                ForbiddenError: {
                    description: "Insufficient permissions",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/ErrorResponse",
                            },
                            example: {
                                success: false,
                                message: "Insufficient permissions",
                                code: "FORBIDDEN",
                            },
                        },
                    },
                },
                NotFoundError: {
                    description: "Resource not found",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/ErrorResponse",
                            },
                            example: {
                                success: false,
                                message: "Resource not found",
                                code: "NOT_FOUND",
                            },
                        },
                    },
                },
                ValidationError: {
                    description: "Validation error",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/ErrorResponse",
                            },
                            example: {
                                success: false,
                                message: "Validation failed",
                                errors: [
                                    { field: "email", message: "Invalid email format" },
                                    {
                                        field: "password",
                                        message: "Password must be at least 8 characters long",
                                    },
                                ],
                            },
                        },
                    },
                },
            },
            parameters: {
                pageParam: {
                    in: "query",
                    name: "page",
                    schema: { type: "integer", default: 1, minimum: 1 },
                    description: "Page number",
                    required: false,
                },
                limitParam: {
                    in: "query",
                    name: "limit",
                    schema: { type: "integer", default: 10, minimum: 1, maximum: 100 },
                    description: "Number of items per page",
                    required: false,
                },
                sortParam: {
                    in: "query",
                    name: "sort",
                    schema: { type: "string", default: "-createdAt" },
                    description: "Sort by field. Prefix with - for descending order",
                    required: false,
                },
                searchParam: {
                    in: "query",
                    name: "search",
                    schema: { type: "string" },
                    description: "Search query",
                    required: false,
                },
                categoryParam: {
                    in: "query",
                    name: "category",
                    schema: { type: "string" },
                    description: "Filter by category ID",
                    required: false,
                },
                statusParam: {
                    in: "query",
                    name: "status",
                    schema: {
                        type: "string",
                        enum: ["active", "inactive", "featured", "on-sale"],
                    },
                    description: "Filter by status",
                    required: false,
                },
                priceMinParam: {
                    in: "query",
                    name: "minPrice",
                    schema: { type: "number", minimum: 0 },
                    description: "Minimum price",
                    required: false,
                },
                priceMaxParam: {
                    in: "query",
                    name: "maxPrice",
                    schema: { type: "number", minimum: 0 },
                    description: "Maximum price",
                    required: false,
                },
                inStockParam: {
                    in: "query",
                    name: "inStock",
                    schema: { type: "boolean" },
                    description: "Filter by stock availability",
                    required: false,
                },
                dateFromParam: {
                    in: "query",
                    name: "from",
                    schema: { type: "string", format: "date" },
                    description: "Filter by start date (YYYY-MM-DD)",
                    required: false,
                },
                dateToParam: {
                    in: "query",
                    name: "to",
                    schema: { type: "string", format: "date" },
                    description: "Filter by end date (YYYY-MM-DD)",
                    required: false,
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: [
        "./src/routes/*.ts",
        "./src/controllers/*.ts",
        "./src/models/*.ts",
        "./src/validators/*.ts",
    ],
};
const specs = (0, swagger_jsdoc_1.default)(options);
exports.default = specs;
//# sourceMappingURL=swagger.js.map