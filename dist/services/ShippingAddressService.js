"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShippingAddressService = void 0;
const ShippingAddress_1 = require("../models/ShippingAddress");
const errorHandler_1 = require("../middlewares/errorHandler");
class ShippingAddressService {
    static async getAddresses(userId) {
        const addresses = await ShippingAddress_1.ShippingAddress.find({ user: userId }).sort({
            isDefault: -1,
            createdAt: -1,
        });
        return addresses;
    }
    static async getAddressById(addressId, userId) {
        const address = await ShippingAddress_1.ShippingAddress.findOne({
            _id: addressId,
            user: userId,
        });
        if (!address) {
            throw (0, errorHandler_1.createError)("Shipping address not found", 404);
        }
        return address;
    }
    static async createAddress(userId, addressData) {
        if (addressData.isDefault) {
            await ShippingAddress_1.ShippingAddress.updateMany({ user: userId }, { $set: { isDefault: false } });
        }
        const address = new ShippingAddress_1.ShippingAddress({
            ...addressData,
            user: userId,
        });
        await address.save();
        return address;
    }
    static async updateAddress(addressId, userId, updateData) {
        const address = await ShippingAddress_1.ShippingAddress.findOne({
            _id: addressId,
            user: userId,
        });
        if (!address) {
            throw (0, errorHandler_1.createError)("Shipping address not found", 404);
        }
        if (updateData.isDefault) {
            await ShippingAddress_1.ShippingAddress.updateMany({ user: userId, _id: { $ne: addressId } }, { $set: { isDefault: false } });
        }
        Object.assign(address, updateData);
        await address.save();
        return address;
    }
    static async deleteAddress(addressId, userId) {
        const address = await ShippingAddress_1.ShippingAddress.findOne({
            _id: addressId,
            user: userId,
        });
        if (!address) {
            throw (0, errorHandler_1.createError)("Shipping address not found", 404);
        }
        if (address.isDefault) {
            const nextAddress = await ShippingAddress_1.ShippingAddress.findOne({
                user: userId,
                _id: { $ne: addressId },
            }).sort({ createdAt: -1 });
            if (nextAddress) {
                nextAddress.isDefault = true;
                await nextAddress.save();
            }
        }
        await ShippingAddress_1.ShippingAddress.findByIdAndDelete(addressId);
        return { message: "Address deleted successfully" };
    }
    static async setDefaultAddress(addressId, userId) {
        const address = await ShippingAddress_1.ShippingAddress.findOne({
            _id: addressId,
            user: userId,
        });
        if (!address) {
            throw (0, errorHandler_1.createError)("Shipping address not found", 404);
        }
        await ShippingAddress_1.ShippingAddress.updateMany({ user: userId }, { $set: { isDefault: false } });
        address.isDefault = true;
        await address.save();
        return address;
    }
    static async getDefaultAddress(userId) {
        const address = await ShippingAddress_1.ShippingAddress.findOne({
            user: userId,
            isDefault: true,
        });
        return address;
    }
}
exports.ShippingAddressService = ShippingAddressService;
//# sourceMappingURL=ShippingAddressService.js.map