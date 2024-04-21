const express = require("express");
const router = express.Router();

const controller = require("../../controllers/admin/auth.controller");

const validate = require("../../validate/admin/auth.validate");

router.post("/login", validate.login, controller.login);

module.exports = router;