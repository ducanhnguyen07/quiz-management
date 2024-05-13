const express = require('express');
const router = express.Router();

const authMiddleware = require("../../middlewares/client/auth.middleware");

const controller = require("../../controllers/client/user.controller");

const validate = require("../../validate/client/user.validate");

router.post("/register", validate.register, controller.register);

router.post("/login", validate.login, controller.login);

router.post("/password/forgot", validate.forgotPassword, controller.forgotPassword);

router.post("/password/otp", validate.otpPassword, controller.otpPassword);

router.post("/password/reset", validate.resetPassword, controller.resetPassword);

router.get("/detail", authMiddleware.requireAuth, controller.detail);

router.get("/validate", controller.validateAuth);

router.get("/result", authMiddleware.requireAuth, controller.result);

module.exports = router;