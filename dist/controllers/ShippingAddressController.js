"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShippingAddressController = void 0;
const ShippingAddressService_1 = require("../services/ShippingAddressService");
const response_1 = require("../utils/response");
const errorHandler_1 = require("../middlewares/errorHandler");
class ShippingAddressController {
}
exports.ShippingAddressController = ShippingAddressController;
_a = ShippingAddressController;
ShippingAddressController.getAddresses = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user._id;
    const addresses = await ShippingAddressService_1.ShippingAddressService.getAddresses(userId.toString());
    return response_1.ResponseUtil.success(res, addresses, "Shipping addresses retrieved successfully");
});
ShippingAddressController.getAddressById = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user._id;
    const { addressId } = req.params;
    if (!addressId) {
        throw (0, errorHandler_1.createError)("Address ID is required", 400);
    }
    const address = await ShippingAddressService_1.ShippingAddressService.getAddressById(addressId, userId.toString());
    return response_1.ResponseUtil.success(res, address, "Shipping address retrieved successfully");
});
ShippingAddressController.createAddress = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user._id;
    const addressData = req.body;
    const address = await ShippingAddressService_1.ShippingAddressService.createAddress(userId.toString(), addressData);
    return response_1.ResponseUtil.success(res, address, "Shipping address created successfully", 201);
});
ShippingAddressController.updateAddress = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user._id;
    const { addressId } = req.params;
    const updateData = req.body;
    if (!addressId) {
        throw (0, errorHandler_1.createError)("Address ID is required", 400);
    }
    const address = await ShippingAddressService_1.ShippingAddressService.updateAddress(addressId, userId.toString(), updateData);
    return response_1.ResponseUtil.success(res, address, "Shipping address updated successfully");
});
ShippingAddressController.deleteAddress = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user._id;
    const { addressId } = req.params;
    if (!addressId) {
        throw (0, errorHandler_1.createError)("Address ID is required", 400);
    }
    const result = await ShippingAddressService_1.ShippingAddressService.deleteAddress(addressId, userId.toString());
    return response_1.ResponseUtil.success(res, result, "Shipping address deleted successfully");
});
ShippingAddressController.setDefaultAddress = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user._id;
    const { addressId } = req.params;
    if (!addressId) {
        throw (0, errorHandler_1.createError)("Address ID is required", 400);
    }
    const address = await ShippingAddressService_1.ShippingAddressService.setDefaultAddress(addressId, userId.toString());
    return response_1.ResponseUtil.success(res, address, "Default address updated successfully");
});
ShippingAddressController.getDefaultAddress = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user._id;
    const address = await ShippingAddressService_1.ShippingAddressService.getDefaultAddress(userId.toString());
    return response_1.ResponseUtil.success(res, address, "Default address retrieved successfully");
});
//# sourceMappingURL=ShippingAddressController.js.map