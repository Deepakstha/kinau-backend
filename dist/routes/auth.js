"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthController_1 = require("../controllers/AuthController");
const auth_1 = require("../middlewares/auth");
const validation_1 = require("../middlewares/validation");
const auth_2 = require("../validators/auth");
const router = (0, express_1.Router)();
router.post("/register", auth_2.registerValidation, validation_1.handleValidationErrors, AuthController_1.AuthController.register);
router.post("/login", auth_2.loginValidation, validation_1.handleValidationErrors, AuthController_1.AuthController.login);
router.get("/me", auth_1.authenticate, AuthController_1.AuthController.getProfile);
router.put("/me", auth_1.authenticate, AuthController_1.AuthController.updateProfile);
router.post("/change-password", auth_2.changePasswordValidation, validation_1.handleValidationErrors, auth_1.authenticate, AuthController_1.AuthController.changePassword);
router.post("/logout", auth_1.authenticate, AuthController_1.AuthController.logout);
exports.default = router;
//# sourceMappingURL=auth.js.map