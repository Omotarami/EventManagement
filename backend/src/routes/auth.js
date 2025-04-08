const express = require("express");
const AuthController = require("../controller/auth");
const useCatchErrors = require("../error/catchErrors");
class AuthRoute {
  router = express.Router();
  authController = new AuthController();

  path = "/auth";

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    // test endpoint
    this.router.post(
      `${this.path}/user/signup`,
      useCatchErrors(this.authController.organizerRegister)
    );
    this.router.post(
      `${this.path}/login`,
      useCatchErrors(this.authController.login)
    );
    // Organizer signup
    this.router.post(
      `${this.path}/user/signin`,
      useCatchErrors(this.authController.login)
    );
  }
}

module.exports = AuthRoute;
