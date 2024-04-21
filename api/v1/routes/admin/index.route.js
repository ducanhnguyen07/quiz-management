const systemConfig = require("../../../../config/system");

const courseRoutes = require("./course.route");
const examRoutes = require("./exam.route");
const userRoutes = require("./user.route");
const accountRoutes = require("./account.route");
const authRoutes = require("./auth.route");
const myAccountRoutes = require("./my-account.route");
const dashboardRoutes = require("./dashboard.route");
const statisticRoutes = require("./statistic.route");

const authMiddleware = require("../../middlewares/admin/auth.middleware");

module.exports = (app) => {
  const version = "/api/v1";

  const PATH_ADMIN = systemConfig.prefixAdmin;

  app.use(
    version + PATH_ADMIN + "/courses",
    authMiddleware.requireAuth,
    courseRoutes
  );

  app.use(
    version + PATH_ADMIN + "/exams",
    authMiddleware.requireAuth,
    examRoutes
  );

  app.use(
    version + PATH_ADMIN + "/users",
    authMiddleware.requireAuth,
    userRoutes
  );

  app.use(
    version + PATH_ADMIN + "/accounts",
    authMiddleware.requireAuth,
    accountRoutes
  );

  app.use(
    version + PATH_ADMIN + "/my-account",
    authMiddleware.requireAuth,
    myAccountRoutes
  );

  app.use(
    version + PATH_ADMIN + "/dashboard",
    authMiddleware.requireAuth,
    dashboardRoutes
  );

  app.use(
    version + PATH_ADMIN + "/statistic",
    authMiddleware.requireAuth,
    statisticRoutes
  );

  app.use(version + PATH_ADMIN + "/auth", authRoutes);
};
