export declare class ShippingAddressService {
    static getAddresses(userId: string): Promise<(import("mongoose").Document<unknown, {}, import("../types").IShippingAddress> & import("../types").IShippingAddress & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    static getAddressById(addressId: string, userId: string): Promise<import("mongoose").Document<unknown, {}, import("../types").IShippingAddress> & import("../types").IShippingAddress & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    static createAddress(userId: string, addressData: {
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
    }): Promise<import("mongoose").Document<unknown, {}, import("../types").IShippingAddress> & import("../types").IShippingAddress & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    static updateAddress(addressId: string, userId: string, updateData: {
        fullName?: string;
        phoneNumber?: string;
        addressLine1?: string;
        addressLine2?: string;
        city?: string;
        state?: string;
        postalCode?: string;
        country?: string;
        isDefault?: boolean;
    }): Promise<import("mongoose").Document<unknown, {}, import("../types").IShippingAddress> & import("../types").IShippingAddress & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    static deleteAddress(addressId: string, userId: string): Promise<{
        message: string;
    }>;
    static setDefaultAddress(addressId: string, userId: string): Promise<import("mongoose").Document<unknown, {}, import("../types").IShippingAddress> & import("../types").IShippingAddress & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    static getDefaultAddress(userId: string): Promise<(import("mongoose").Document<unknown, {}, import("../types").IShippingAddress> & import("../types").IShippingAddress & {
        _id: import("mongoose").Types.ObjectId;
    }) | null>;
}
//# sourceMappingURL=ShippingAddressService.d.ts.map