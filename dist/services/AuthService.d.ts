import { IUser } from "../types";
export declare class AuthService {
    static generateTokens(user: IUser): {
        accessToken: never;
        refreshToken: never;
    };
    static register(userData: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        phone?: string;
    }): Promise<{
        user: import("mongoose").FlattenMaps<IUser & Required<{
            _id: import("mongoose").Types.ObjectId;
        }>>;
        tokens: {
            accessToken: never;
            refreshToken: never;
        };
    }>;
    static login(email: string, password: string): Promise<{
        user: import("mongoose").FlattenMaps<IUser & Required<{
            _id: import("mongoose").Types.ObjectId;
        }>>;
        tokens: {
            accessToken: never;
            refreshToken: never;
        };
    }>;
    static refreshToken(refreshToken: string): Promise<{
        accessToken: never;
        refreshToken: never;
    }>;
    static changePassword(userId: string, currentPassword: string, newPassword: string): Promise<{
        message: string;
    }>;
    static updateProfile(userId: string, updateData: {
        firstName?: string;
        lastName?: string;
        phone?: string;
    }): Promise<import("mongoose").FlattenMaps<IUser & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>>;
    static getProfile(userId: string): Promise<import("mongoose").FlattenMaps<IUser & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>>;
}
//# sourceMappingURL=AuthService.d.ts.map