const express = require("express");
const router = express.Router();

const controller = require("../../controllers/admin/exam.controller");

router.get("/", controller.index);

router.get("/detail/:id", controller.detail);

router.get("/detail/:id/questions", controller.detailQuestions);

router.post("/create", controller.create);

router.patch("/edit/:id", controller.edit);

router.delete("/delete/:id", controller.delete);

module.exports = router;