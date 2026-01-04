"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const config_1 = require("../config");
const errorHandler_1 = require("../middlewares/errorHandler");
class AuthService {
    static generateTokens(user) {
        const payload = {
            userId: user._id,
            email: user.email,
            role: user.role,
        };
        const accessToken = jsonwebtoken_1.default.sign(payload, config_1.config.JWT_SECRET, {
            expiresIn: config_1.config.JWT_EXPIRES_IN,
        });
        const refreshToken = jsonwebtoken_1.default.sign(payload, config_1.config.JWT_REFRESH_SECRET, {
            expiresIn: config_1.config.JWT_REFRESH_EXPIRES_IN,
        });
        return { accessToken, refreshToken };
    }
    static async register(userData) {
        const existingUser = await User_1.User.findOne({ email: userData.email });
        if (existingUser) {
            throw (0, errorHandler_1.createError)("User with this email already exists", 400);
        }
        const user = new User_1.User(userData);
        await user.save();
        const tokens = this.generateTokens(user);
        return {
            user: user.toJSON(),
            tokens,
        };
    }
    static async login(email, password) {
        const user = await User_1.User.findOne({ email }).select("+password");
        if (!user) {
            throw (0, errorHandler_1.createError)("Invalid email or password", 401);
        }
        if (!user.isActive) {
            throw (0, errorHandler_1.createError)("Account is deactivated", 401);
        }
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            throw (0, errorHandler_1.createError)("Invalid email or password", 401);
        }
        const tokens = this.generateTokens(user);
        return {
            user: user.toJSON(),
            tokens,
        };
    }
    static async refreshToken(refreshToken) {
        try {
            if (!config_1.config.JWT_REFRESH_SECRET) {
                throw (0, errorHandler_1.createError)("JWT_REFRESH_SECRET is not configured", 500);
            }
            const decoded = jsonwebtoken_1.default.verify(refreshToken, config_1.config.JWT_REFRESH_SECRET);
            const user = await User_1.User.findById(decoded.userId);
            if (!user || !user.isActive) {
                throw (0, errorHandler_1.createError)("Invalid refresh token", 401);
            }
            const tokens = this.generateTokens(user);
            return tokens;
        }
        catch (error) {
            throw (0, errorHandler_1.createError)("Invalid refresh token", 401);
        }
    }
    static async changePassword(userId, currentPassword, newPassword) {
        const user = await User_1.User.findById(userId).select("+password");
        if (!user) {
            throw (0, errorHandler_1.createError)("User not found", 404);
        }
        const isCurrentPasswordValid = await user.comparePassword(currentPassword);
        if (!isCurrentPasswordValid) {
            throw (0, errorHandler_1.createError)("Current password is incorrect", 400);
        }
        user.password = newPassword;
        await user.save();
        return { message: "Password changed successfully" };
    }
    static async updateProfile(userId, updateData) {
        const user = await User_1.User.findByIdAndUpdate(userId, updateData, {
            new: true,
            runValidators: true,
        });
        if (!user) {
            throw (0, errorHandler_1.createError)("User not found", 404);
        }
        return user.toJSON();
    }
    static async getProfile(userId) {
        const user = await User_1.User.findById(userId);
        if (!user) {
            throw (0, errorHandler_1.createError)("User not found", 404);
        }
        return user.toJSON();
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=AuthService.js.map