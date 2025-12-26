import { Response } from "express";
import { AuthRequest } from "../types";
import { ShippingAddressService } from "../services/ShippingAddressService";
import { ResponseUtil } from "../utils/response";
import { asyncHandler, createError } from "../middlewares/errorHandler";

export class ShippingAddressController {
  static getAddresses = asyncHandler(
    async (req: AuthRequest, res: Response) => {
      const userId = req.user!._id;
      const addresses = await ShippingAddressService.getAddresses(
        userId.toString()
      );

      return ResponseUtil.success(
        res,
        addresses,
        "Shipping addresses retrieved successfully"
      );
    }
  );

  static getAddressById = asyncHandler(
    async (req: AuthRequest, res: Response) => {
      const userId = req.user!._id;
      const { addressId } = req.params;

      if (!addressId) {
        throw createError("Address ID is required", 400);
      }
      const address = await ShippingAddressService.getAddressById(
        addressId,
        userId.toString()
      );

      return ResponseUtil.success(
        res,
        address,
        "Shipping address retrieved successfully"
      );
    }
  );

  static createAddress = asyncHandler(
    async (req: AuthRequest, res: Response) => {
      const userId = req.user!._id;
      const addressData = req.body;

      const address = await ShippingAddressService.createAddress(
        userId.toString(),
        addressData
      );

      return ResponseUtil.success(
        res,
        address,
        "Shipping address created successfully",
        201
      );
    }
  );

  static updateAddress = asyncHandler(
    async (req: AuthRequest, res: Response) => {
      const userId = req.user!._id;
      const { addressId } = req.params;
      const updateData = req.body;

      if (!addressId) {
        throw createError("Address ID is required", 400);
      }

      const address = await ShippingAddressService.updateAddress(
        addressId,
        userId.toString(),
        updateData
      );

      return ResponseUtil.success(
        res,
        address,
        "Shipping address updated successfully"
      );
    }
  );

  static deleteAddress = asyncHandler(
    async (req: AuthRequest, res: Response) => {
      const userId = req.user!._id;
      const { addressId } = req.params;

      if (!addressId) {
        throw createError("Address ID is required", 400);
      }

      const result = await ShippingAddressService.deleteAddress(
        addressId,
        userId.toString()
      );

      return ResponseUtil.success(
        res,
        result,
        "Shipping address deleted successfully"
      );
    }
  );

  static setDefaultAddress = asyncHandler(
    async (req: AuthRequest, res: Response) => {
      const userId = req.user!._id;
      const { addressId } = req.params;

      if (!addressId) {
        throw createError("Address ID is required", 400);
      }

      const address = await ShippingAddressService.setDefaultAddress(
        addressId,
        userId.toString()
      );

      return ResponseUtil.success(
        res,
        address,
        "Default address updated successfully"
      );
    }
  );

  static getDefaultAddress = asyncHandler(
    async (req: AuthRequest, res: Response) => {
      const userId = req.user!._id;
      const address = await ShippingAddressService.getDefaultAddress(
        userId.toString()
      );

      return ResponseUtil.success(
        res,
        address,
        "Default address retrieved successfully"
      );
    }
  );
}
