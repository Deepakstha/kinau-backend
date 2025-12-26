import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { ResponseUtil } from "../utils/response";

export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
): Response | void => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((error) => ({
      field: error.type === "field" ? error.path : "unknown",
      message: error.msg,
      value: error.type === "field" ? error.value : undefined,
    }));

    return ResponseUtil.validationError(res, formattedErrors);
  }

  next();
};

export const validateProductVariant = (
  req: Request,
  res: Response,
  next: NextFunction
): Response | void => {
  const { size, color, sku, price, stock } = req.body;

  const errors: any[] = [];

  // Validate required fields
  if (!size) {
    errors.push({ field: "size", message: "Size is required" });
  }

  if (!color) {
    errors.push({ field: "color", message: "Color is required" });
  }

  if (!sku) {
    errors.push({ field: "sku", message: "SKU is required" });
  }

  if (!price || price <= 0) {
    errors.push({ field: "price", message: "Valid price is required" });
  }

  if (stock === undefined || stock < 0) {
    errors.push({
      field: "stock",
      message: "Valid stock quantity is required",
    });
  }

  // Validate optional discount price
  if (req.body.discountPrice !== undefined) {
    const discountPrice = req.body.discountPrice;
    if (discountPrice < 0) {
      errors.push({
        field: "discountPrice",
        message: "Valid discount price is required",
      });
    } else if (Number(discountPrice) >= Number(price)) {
      errors.push({
        field: "discountPrice",
        message: "Discount price must be less than regular price",
      });
    }
  }

  if (errors.length > 0) {
    return ResponseUtil.validationError(res, errors);
  }

  next();
};
