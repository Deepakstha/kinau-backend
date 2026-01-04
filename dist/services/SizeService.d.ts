export declare class SizeService {
    static getAllSizes(userRole?: string): Promise<(import("mongoose").Document<unknown, {}, import("../types").ISize> & import("../types").ISize & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    static getSizeById(sizeId: string): Promise<import("mongoose").Document<unknown, {}, import("../types").ISize> & import("../types").ISize & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    static createSize(sizeData: {
        name: string;
        code: string;
        description?: string;
        order?: number;
    }): Promise<import("mongoose").Document<unknown, {}, import("../types").ISize> & import("../types").ISize & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    static updateSize(sizeId: string, updateData: {
        name?: string;
        code?: string;
        description?: string;
        order?: number;
        isActive?: boolean;
    }): Promise<import("mongoose").Document<unknown, {}, import("../types").ISize> & import("../types").ISize & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    static deleteSize(sizeId: string): Promise<{
        message: string;
    }>;
    static toggleSizeStatus(sizeId: string): Promise<import("mongoose").Document<unknown, {}, import("../types").ISize> & import("../types").ISize & {
        _id: import("mongoose").Types.ObjectId;
    }>;
}
//# sourceMappingURL=SizeService.d.ts.map