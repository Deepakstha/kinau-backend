"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuth = exports.authorize = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const response_1 = require("../utils/response");
const config_1 = require("../config");
const errorHandler_1 = require("./errorHandler");
exports.authenticate = (0, errorHandler_1.asyncHandler)(async (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
        return response_1.ResponseUtil.unauthorized(res, "Access token required");
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, config_1.config.JWT_SECRET);
        const user = await User_1.User.findById(decoded.userId).select("-password");
        if (!user) {
            return response_1.ResponseUtil.unauthorized(res, "User not found");
        }
        if (!user.isActive) {
            return response_1.ResponseUtil.unauthorized(res, "Account is deactivated");
        }
        req.user = user;
        return next();
    }
    catch (error) {
        return response_1.ResponseUtil.unauthorized(res, "Invalid token");
    }
});
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return response_1.ResponseUtil.unauthorized(res, "Authentication required");
        }
        if (!roles.includes(req.user.role)) {
            return response_1.ResponseUtil.forbidden(res, "Insufficient permissions");
        }
        return next();
    };
};
exports.authorize = authorize;
exports.optionalAuth = (0, errorHandler_1.asyncHandler)(async (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, config_1.config.JWT_SECRET);
            const user = await User_1.User.findById(decoded.userId).select("-password");
            if (user && user.isActive) {
                req.user = user;
            }
        }
        catch (error) {
        }
    }
    return next();
});
//# sourceMappingURL=auth.js.map