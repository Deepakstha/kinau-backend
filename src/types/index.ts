import { Request } from "express";
import { Document, Types } from "mongoose";

// User related types
export interface IUser extends Document {
  _id: Types.ObjectId;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: "admin" | "customer";
  isActive: boolean;
  emailVerified: boolean;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Auth related types
export interface AuthRequest extends Request {
  user?: IUser;
}

export interface JWTPayload {
  userId: Types.ObjectId;
  email: string;
  role: string;
}

// Category types
export interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive: boolean;
  parentCategory?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Size and Color types
export interface ISize extends Document {
  name: string;
  code: string;
  isActive: boolean;
}

export interface IColor extends Document {
  name: string;
  hexCode: string;
  isActive: boolean;
}

// Product types
export interface IProductVariant extends Document {
  _id: Types.ObjectId;
  product: Types.ObjectId;
  size: Types.ObjectId;
  color: Types.ObjectId;
  sku: string;
  price: number;
  discountPrice?: number;
  stock: number;
  image: string; // Changed from image?: string to images?: string[]
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  category: Types.ObjectId;
  brand?: string;
  basePrice: number;
  variants: IProductVariant[]; // References to ProductVariant documents
  mainImages: string[]; // Max 5 images for the product itself
  tags: string[];
  isActive: boolean;
  isFeatured: boolean;
  isWeeklyDeals: boolean;
  isBestSeller: boolean;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  seoTitle?: string;
  seoDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Cart types
export interface ICartItem {
  product: IProduct | Types.ObjectId;
  variant?: IProductVariant | Types.ObjectId; // Optional - for products with variants
  quantity: number;
  price: number;
}

export interface IPopulatedCartItem {
  product: IProduct;
  variant?: IProductVariant; // Optional - for products with variants
  quantity: number;
  price: number;
}

export interface ICart extends Document {
  user: Types.ObjectId;
  items: ICartItem[];
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

// Wishlist types
export interface IWishlistItem {
  product: Types.ObjectId;
  addedAt: Date;
}

export interface IWishlist extends Document {
  user: Types.ObjectId;
  items: IWishlistItem[];
  createdAt: Date;
  updatedAt: Date;
}

// Shipping Address types
export interface IShippingAddress extends Document {
  user: Types.ObjectId;
  firstName: string;
  lastName: string;
  company?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Order types
export type IOrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type IPaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface IStatusHistoryEntry {
  status: IOrderStatus;
  timestamp: Date;
  note?: string;
}

export interface IOrderItem {
  product: IProduct | Types.ObjectId;
  variant?: IProductVariant | Types.ObjectId; // Optional - for products with variants
  name: string;
  sku?: string; // SKU for the variant
  size?: Types.ObjectId;
  color?: Types.ObjectId;
  quantity: number;
  price: number;
  total: number;
  image?: string;
}

export interface IPopulatedOrderItem {
  product: IProduct;
  variant?: IProductVariant; // Optional - for products with variants
  name: string;
  sku?: string; // SKU for the variant
  size?: Types.ObjectId;
  color?: Types.ObjectId;
  quantity: number;
  price: number;
  total: number;
  image?: string;
}

export interface IOrder extends Document {
  orderNumber: string;
  user: Types.ObjectId;
  items: IOrderItem[];
  shippingAddress: IShippingAddress;
  billingAddress?: IShippingAddress;
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  status: IOrderStatus;
  paymentStatus: IPaymentStatus;
  paymentMethod: string;
  transactionId?: string;
  statusHistory: IStatusHistoryEntry[];
  trackingNumber?: string;
  shippedAt?: Date;
  deliveredAt?: Date;
  paidAt?: Date;
  cancelReason?: string;
  cancelledAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Cancel Reason types
export interface ICancelReason extends Document {
  reason: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Media types
export interface IMedia extends Document {
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  url: string;
  cloudinaryId: string;
  uploadedBy: Types.ObjectId;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  errors?: any[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Pagination types
export interface PaginationQuery {
  page?: number;
  limit?: number;
  sort?: string;
  search?: string;
}

// File upload types
export interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}
