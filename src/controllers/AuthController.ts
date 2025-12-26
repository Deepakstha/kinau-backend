import { Response } from "express";
import { AuthRequest } from "../types";
import { AuthService } from "../services/AuthService";
import { ResponseUtil } from "../utils/response";
import { asyncHandler } from "../middlewares/errorHandler";

export class AuthController {
  static register = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { email, password, firstName, lastName, phone } = req.body;

    const result = await AuthService.register({
      email,
      password,
      firstName,
      lastName,
      phone,
    });

    return ResponseUtil.success(
      res,
      result,
      "User registered successfully",
      201
    );
  });

  static login = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { email, password } = req.body;

    const result = await AuthService.login(email, password);

    return ResponseUtil.success(res, result, "Login successful");
  });

  static refreshToken = asyncHandler(
    async (req: AuthRequest, res: Response) => {
      const { refreshToken } = req.body;

      const tokens = await AuthService.refreshToken(refreshToken);

      return ResponseUtil.success(res, tokens, "Token refreshed successfully");
    }
  );

  static getProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!._id;

    const user = await AuthService.getProfile(userId.toString());

    return ResponseUtil.success(res, user, "Profile retrieved successfully");
  });

  static updateProfile = asyncHandler(
    async (req: AuthRequest, res: Response) => {
      const userId = req.user!._id;
      const { firstName, lastName, phone } = req.body;

      const user = await AuthService.updateProfile(userId.toString(), {
        firstName,
        lastName,
        phone,
      });

      return ResponseUtil.success(res, user, "Profile updated successfully");
    }
  );

  static changePassword = asyncHandler(
    async (req: AuthRequest, res: Response) => {
      const userId = req.user!._id;
      const { currentPassword, newPassword } = req.body;

      const result = await AuthService.changePassword(
        userId.toString(),
        currentPassword,
        newPassword
      );

      return ResponseUtil.success(res, result, "Password changed successfully");
    }
  );

  static logout = asyncHandler(async (req: AuthRequest, res: Response) => {
    // In a real application, you might want to blacklist the token
    // For now, we'll just return a success message
    return ResponseUtil.success(res, null, "Logout successful");
  });
}
