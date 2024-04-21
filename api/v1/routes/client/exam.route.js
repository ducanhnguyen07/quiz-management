const express = require('express');
const router = express.Router();

const controller = require("../../controllers/client/exam.controller");

router.get("/", controller.index);

router.get("/detail/:id", controller.detail);

router.get("/detail/:id/questions", controller.detailQuestions);

router.post("/detail/:id/result", controller.result);

module.exports = router;