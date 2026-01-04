export declare class ColorService {
    static getAllColors(userRole?: string): Promise<(import("mongoose").Document<unknown, {}, import("../types").IColor> & import("../types").IColor & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    static getColorById(colorId: string): Promise<import("mongoose").Document<unknown, {}, import("../types").IColor> & import("../types").IColor & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    static createColor(colorData: {
        name: string;
        hexCode: string;
        description?: string;
    }): Promise<import("mongoose").Document<unknown, {}, import("../types").IColor> & import("../types").IColor & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    static updateColor(colorId: string, updateData: {
        name?: string;
        hexCode?: string;
        description?: string;
        isActive?: boolean;
    }): Promise<import("mongoose").Document<unknown, {}, import("../types").IColor> & import("../types").IColor & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    static deleteColor(colorId: string): Promise<{
        message: string;
    }>;
    static toggleColorStatus(colorId: string): Promise<import("mongoose").Document<unknown, {}, import("../types").IColor> & import("../types").IColor & {
        _id: import("mongoose").Types.ObjectId;
    }>;
}
//# sourceMappingURL=ColorService.d.ts.map