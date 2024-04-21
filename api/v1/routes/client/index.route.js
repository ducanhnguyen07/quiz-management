const courseRoutes = require("./course.route");
const examRoutes = require("./exam.route");
const userRoutes = require("./user.route");

const authMiddleware = require("../../middlewares/client/auth.middleware");

module.exports = (app) => {
  const version = "/api/v1";

  app.use(version + "/courses", authMiddleware.requireAuth, courseRoutes);

  app.use(version + "/exams", authMiddleware.requireAuth, examRoutes);

  app.use(version + "/users", userRoutes);
};