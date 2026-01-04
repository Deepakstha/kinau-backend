"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const AuthService_1 = require("../services/AuthService");
const response_1 = require("../utils/response");
const errorHandler_1 = require("../middlewares/errorHandler");
class AuthController {
}
exports.AuthController = AuthController;
_a = AuthController;
AuthController.register = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { email, password, firstName, lastName, phone } = req.body;
    const result = await AuthService_1.AuthService.register({
        email,
        password,
        firstName,
        lastName,
        phone,
    });
    return response_1.ResponseUtil.success(res, result, "User registered successfully", 201);
});
AuthController.login = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { email, password } = req.body;
    const result = await AuthService_1.AuthService.login(email, password);
    return response_1.ResponseUtil.success(res, result, "Login successful");
});
AuthController.refreshToken = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { refreshToken } = req.body;
    const tokens = await AuthService_1.AuthService.refreshToken(refreshToken);
    return response_1.ResponseUtil.success(res, tokens, "Token refreshed successfully");
});
AuthController.getProfile = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user._id;
    const user = await AuthService_1.AuthService.getProfile(userId.toString());
    return response_1.ResponseUtil.success(res, user, "Profile retrieved successfully");
});
AuthController.updateProfile = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user._id;
    const { firstName, lastName, phone } = req.body;
    const user = await AuthService_1.AuthService.updateProfile(userId.toString(), {
        firstName,
        lastName,
        phone,
    });
    return response_1.ResponseUtil.success(res, user, "Profile updated successfully");
});
AuthController.changePassword = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user._id;
    const { currentPassword, newPassword } = req.body;
    const result = await AuthService_1.AuthService.changePassword(userId.toString(), currentPassword, newPassword);
    return response_1.ResponseUtil.success(res, result, "Password changed successfully");
});
AuthController.logout = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    return response_1.ResponseUtil.success(res, null, "Logout successful");
});
//# sourceMappingURL=AuthController.js.map