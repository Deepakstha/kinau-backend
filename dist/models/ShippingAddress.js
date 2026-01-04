"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShippingAddress = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const shippingAddressSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User is required"],
    },
    firstName: {
        type: String,
        required: [true, "First name is required"],
        trim: true,
        maxlength: [50, "First name cannot exceed 50 characters"],
    },
    lastName: {
        type: String,
        required: [true, "Last name is required"],
        trim: true,
        maxlength: [50, "Last name cannot exceed 50 characters"],
    },
    company: {
        type: String,
        trim: true,
        maxlength: [100, "Company name cannot exceed 100 characters"],
    },
    addressLine1: {
        type: String,
        required: [true, "Address line 1 is required"],
        trim: true,
        maxlength: [200, "Address line 1 cannot exceed 200 characters"],
    },
    addressLine2: {
        type: String,
        trim: true,
        maxlength: [200, "Address line 2 cannot exceed 200 characters"],
    },
    city: {
        type: String,
        required: [true, "City is required"],
        trim: true,
        maxlength: [100, "City cannot exceed 100 characters"],
    },
    state: {
        type: String,
        required: [true, "State is required"],
        trim: true,
        maxlength: [100, "State cannot exceed 100 characters"],
    },
    postalCode: {
        type: String,
        required: [true, "Postal code is required"],
        trim: true,
        maxlength: [20, "Postal code cannot exceed 20 characters"],
    },
    country: {
        type: String,
        required: [true, "Country is required"],
        trim: true,
        maxlength: [100, "Country cannot exceed 100 characters"],
    },
    phone: {
        type: String,
        required: [true, "Phone number is required"],
        trim: true,
        match: [/^\+?[\d\s-()]+$/, "Please enter a valid phone number"],
    },
    isDefault: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
shippingAddressSchema.index({ user: 1 });
shippingAddressSchema.index({ user: 1, isDefault: 1 });
shippingAddressSchema.pre("save", async function (next) {
    if (this.isDefault) {
        await mongoose_1.default
            .model("ShippingAddress")
            .updateMany({ user: this.user, _id: { $ne: this._id } }, { isDefault: false });
    }
    next();
});
exports.ShippingAddress = mongoose_1.default.model("ShippingAddress", shippingAddressSchema);
//# sourceMappingURL=ShippingAddress.js.map