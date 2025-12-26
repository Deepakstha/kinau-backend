# Ecommerce Backend API

A comprehensive Node.js TypeScript backend for an ecommerce platform built with Express.js, MongoDB, and following NestJS-style architecture patterns.

## 🚀 Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **Product Management**: Products with variations (size, color), multiple images, inventory tracking
- **Category Management**: Hierarchical categories with image support
- **Shopping Cart**: Persistent cart functionality
- **Wishlist**: User wishlist management
- **Order Management**: Complete order lifecycle with status tracking
- **Image Upload**: Cloudinary integration for image storage
- **Validation**: Comprehensive input validation with express-validator
- **Error Handling**: Global error handling with custom error classes
- **Security**: Helmet, CORS, rate limiting, and input sanitization
- **Database**: MongoDB with Mongoose ODM

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT
- **File Upload**: Multer + Cloudinary
- **Validation**: express-validator
- **Security**: Helmet, CORS, express-rate-limit
- **Development**: ts-node-dev, ESLint

## 📁 Project Structure

```
src/
├── config/           # Configuration files
│   ├── index.ts      # Environment variables
│   ├── database.ts   # Database connection
│   └── cloudinary.ts # Cloudinary config
├── controllers/      # Route controllers
├── middlewares/      # Custom middleware
├── models/          # Mongoose models
├── routes/          # API routes
├── services/        # Business logic
├── types/           # TypeScript interfaces
├── utils/           # Utility functions
├── validators/      # Input validation schemas
└── app.ts           # Main application file
```

## 🔧 Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd ecommerce-backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
```bash
cp .env.example .env
```

4. **Configure environment variables**
```env
# Database
MONGODB_URI=mongodb://localhost:27017/ecommerce

# JWT
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Server
PORT=3000
NODE_ENV=development
```

5. **Start the development server**
```bash
npm run dev
```

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api/v1
```

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password123"
}
```

#### Get Profile
```http
GET /auth/profile
Authorization: Bearer <access_token>
```

### Category Endpoints

#### Get All Categories
```http
GET /categories?page=1&limit=10&search=electronics
```

#### Create Category (Admin Only)
```http
POST /categories
Authorization: Bearer <admin_token>
Content-Type: multipart/form-data

name: Electronics
description: Electronic products
image: <file>
```

#### Update Category (Admin Only)
```http
PUT /categories/:id
Authorization: Bearer <admin_token>
Content-Type: multipart/form-data

name: Updated Electronics
image: <file>
```

### Product Endpoints (To be implemented)

#### Get Products
```http
GET /products?page=1&limit=10&category=<category_id>&minPrice=10&maxPrice=100
```

#### Create Product (Admin Only)
```http
POST /products
Authorization: Bearer <admin_token>
Content-Type: multipart/form-data

{
  "name": "iPhone 15",
  "description": "Latest iPhone model",
  "category": "<category_id>",
  "basePrice": 999,
  "variations": [
    {
      "size": "<size_id>",
      "color": "<color_id>",
      "sku": "IPH15-128-BLK",
      "price": 999,
      "stock": 50
    }
  ]
}
```

## 🔒 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### User Roles
- **customer**: Can browse products, manage cart, place orders
- **admin**: Full access to all endpoints including product/category management

## 📝 Data Models

### User
- email, password, firstName, lastName, phone
- role (admin/customer), isActive, emailVerified
- Timestamps

### Category
- name, slug, description, image
- parentCategory (for hierarchical structure)
- isActive, timestamps

### Product
- name, slug, description, category, brand
- basePrice, variations[], mainImages[]
- tags, weight, dimensions, SEO fields
- isActive, isFeatured, timestamps

### Product Variation
- size, color, sku, price, discountPrice
- stock, images[]

### Cart
- user, items[], totalAmount
- Timestamps

### Order
- orderNumber, user, items[], addresses
- subtotal, shippingCost, tax, total
- status, paymentStatus, paymentMethod
- trackingNumber, timestamps

## 🛡️ Security Features

- **Helmet**: Sets various HTTP headers for security
- **CORS**: Configurable cross-origin resource sharing
- **Rate Limiting**: Prevents abuse with configurable limits
- **Input Validation**: Comprehensive validation with express-validator
- **Password Hashing**: bcrypt with salt rounds
- **JWT**: Secure token-based authentication
- **File Upload Security**: File type and size validation

## 🚦 Error Handling

The API uses a standardized error response format:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message",
  "errors": [] // Validation errors array
}
```

## 📊 Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Paginated Response
```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server with hot reload

# Production
npm run build        # Build TypeScript to JavaScript
npm start           # Start production server

# Code Quality
npm run lint        # Run ESLint
npm test           # Run tests (when implemented)
```

### Code Style

The project follows TypeScript best practices with:
- Strict TypeScript configuration
- ESLint for code linting
- Path aliases for clean imports
- Consistent error handling patterns

## 🚀 Deployment

1. **Build the project**
```bash
npm run build
```

2. **Set production environment variables**

3. **Start the production server**
```bash
npm start
```

## 📈 Future Enhancements

- [ ] Payment gateway integration
- [ ] Email notifications
- [ ] Advanced search with Elasticsearch
- [ ] Caching with Redis
- [ ] API documentation with Swagger
- [ ] Unit and integration tests
- [ ] Docker containerization
- [ ] CI/CD pipeline

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.
