import { ShippingAddress } from "../models/ShippingAddress";
import { createError } from "../middlewares/errorHandler";

export class ShippingAddressService {
  static async getAddresses(userId: string) {
    const addresses = await ShippingAddress.find({ user: userId }).sort({
      isDefault: -1,
      createdAt: -1,
    });

    return addresses;
  }

  static async getAddressById(addressId: string, userId: string) {
    const address = await ShippingAddress.findOne({
      _id: addressId,
      user: userId,
    });
    if (!address) {
      throw createError("Shipping address not found", 404);
    }
    return address;
  }

  static async createAddress(
    userId: string,
    addressData: {
      firstName: string;
      lastName: string;
      company?: string;
      phone: string;
      addressLine1: string;
      addressLine2?: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
      isDefault?: boolean;
    }
  ) {
    // If this is set as default, unset other default addresses
    if (addressData.isDefault) {
      await ShippingAddress.updateMany(
        { user: userId },
        { $set: { isDefault: false } }
      );
    }

    const address = new ShippingAddress({
      ...addressData,
      user: userId,
    });

    await address.save();
    return address;
  }

  static async updateAddress(
    addressId: string,
    userId: string,
    updateData: {
      fullName?: string;
      phoneNumber?: string;
      addressLine1?: string;
      addressLine2?: string;
      city?: string;
      state?: string;
      postalCode?: string;
      country?: string;
      isDefault?: boolean;
    }
  ) {
    const address = await ShippingAddress.findOne({
      _id: addressId,
      user: userId,
    });
    if (!address) {
      throw createError("Shipping address not found", 404);
    }

    // If setting as default, unset other default addresses
    if (updateData.isDefault) {
      await ShippingAddress.updateMany(
        { user: userId, _id: { $ne: addressId } },
        { $set: { isDefault: false } }
      );
    }

    Object.assign(address, updateData);
    await address.save();

    return address;
  }

  static async deleteAddress(addressId: string, userId: string) {
    const address = await ShippingAddress.findOne({
      _id: addressId,
      user: userId,
    });
    if (!address) {
      throw createError("Shipping address not found", 404);
    }

    // If deleting default address, set another as default
    if (address.isDefault) {
      const nextAddress = await ShippingAddress.findOne({
        user: userId,
        _id: { $ne: addressId },
      }).sort({ createdAt: -1 });

      if (nextAddress) {
        nextAddress.isDefault = true;
        await nextAddress.save();
      }
    }

    await ShippingAddress.findByIdAndDelete(addressId);
    return { message: "Address deleted successfully" };
  }

  static async setDefaultAddress(addressId: string, userId: string) {
    const address = await ShippingAddress.findOne({
      _id: addressId,
      user: userId,
    });
    if (!address) {
      throw createError("Shipping address not found", 404);
    }

    // Unset all other default addresses
    await ShippingAddress.updateMany(
      { user: userId },
      { $set: { isDefault: false } }
    );

    // Set this address as default
    address.isDefault = true;
    await address.save();

    return address;
  }

  static async getDefaultAddress(userId: string) {
    const address = await ShippingAddress.findOne({
      user: userId,
      isDefault: true,
    });
    return address;
  }
}
