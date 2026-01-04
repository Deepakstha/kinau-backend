import multer from "multer";
import { MulterFile, CloudinaryUploadResult } from "../types";
export declare const upload: multer.Multer;
export declare const uploadToCloudinary: (file: MulterFile, folder?: string) => Promise<CloudinaryUploadResult>;
export declare const uploadMultipleToCloudinary: (files: MulterFile[], folder?: string) => Promise<CloudinaryUploadResult[]>;
export declare const deleteFromCloudinary: (publicId: string) => Promise<void>;
export declare const validateImage: (file: MulterFile) => boolean;
export declare const uploadSingle: (fieldName: string) => import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
export declare const uploadMultiple: (fieldName: string, maxCount?: number) => import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
export declare const uploadFields: (fields: {
    name: string;
    maxCount: number;
}[]) => import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
//# sourceMappingURL=upload.d.ts.map