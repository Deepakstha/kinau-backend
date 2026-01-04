"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloudinary = void 0;
const cloudinary_1 = require("cloudinary");
Object.defineProperty(exports, "cloudinary", { enumerable: true, get: function () { return cloudinary_1.v2; } });
const index_1 = require("./index");
cloudinary_1.v2.config({
    cloud_name: index_1.config.CLOUDINARY_CLOUD_NAME,
    api_key: index_1.config.CLOUDINARY_API_KEY,
    api_secret: index_1.config.CLOUDINARY_API_SECRET,
    secure: true,
});
//# sourceMappingURL=cloudinary.js.map