import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { IUser, JWTPayload } from "../types";
import { config } from "../config";
import { createError } from "../middlewares/errorHandler";

export class AuthService {
  static generateTokens(user: IUser) {
    const payload: JWTPayload = {
      userId: user._id,
      email: user.email,
      role: user.role,
    };

    //@ts-ignore
    const accessToken = jwt.sign(payload, config.JWT_SECRET, {
      expiresIn: config.JWT_EXPIRES_IN,
    });

    //@ts-ignore
    const refreshToken = jwt.sign(payload, config.JWT_REFRESH_SECRET, {
      expiresIn: config.JWT_REFRESH_EXPIRES_IN,
    });

    return { accessToken, refreshToken };
  }

  static async register(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }) {
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw createError("User with this email already exists", 400);
    }

    const user = new User(userData);
    await user.save();

    const tokens = this.generateTokens(user);

    return {
      user: user.toJSON(),
      tokens,
    };
  }

  static async login(email: string, password: string) {
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      throw createError("Invalid email or password", 401);
    }

    if (!user.isActive) {
      throw createError("Account is deactivated", 401);
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw createError("Invalid email or password", 401);
    }

    const tokens = this.generateTokens(user);

    return {
      user: user.toJSON(),
      tokens,
    };
  }

  static async refreshToken(refreshToken: string) {
    try {
      if (!config.JWT_REFRESH_SECRET) {
        throw createError("JWT_REFRESH_SECRET is not configured", 500);
      }

      const decoded = jwt.verify(
        refreshToken,
        config.JWT_REFRESH_SECRET
      ) as JWTPayload;
      const user = await User.findById(decoded.userId);

      if (!user || !user.isActive) {
        throw createError("Invalid refresh token", 401);
      }

      const tokens = this.generateTokens(user);
      return tokens;
    } catch (error) {
      throw createError("Invalid refresh token", 401);
    }
  }

  static async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ) {
    const user = await User.findById(userId).select("+password");
    if (!user) {
      throw createError("User not found", 404);
    }

    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      throw createError("Current password is incorrect", 400);
    }

    user.password = newPassword;
    await user.save();

    return { message: "Password changed successfully" };
  }

  static async updateProfile(
    userId: string,
    updateData: {
      firstName?: string;
      lastName?: string;
      phone?: string;
    }
  ) {
    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      throw createError("User not found", 404);
    }

    return user.toJSON();
  }

  static async getProfile(userId: string) {
    const user = await User.findById(userId);
    if (!user) {
      throw createError("User not found", 404);
    }

    return user.toJSON();
  }
}
