const express = require("express");
const router = express.Router();

const controller = require("../../controllers/admin/statistic.controller");

router.get("/", controller.statistic);

module.exports = router;