const express = require("express");
const AuthController = require("../controller/auth");
const { isAuthenticated } = require("../middlewares/auth");
const useCatchErrors = require("../error/catchErrors");

class AuthRoute {
  router = express.Router();
  authController = new AuthController();

  path = "/auth";

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    // Public authentication routes
    this.router.post(
      `${this.path}/user/signup`,
      useCatchErrors(this.authController.userRegister)
    );
    
    this.router.post(
      `${this.path}/organizer/signup`,
      useCatchErrors(this.authController.organizerRegister)
    );
    
    this.router.post(
      `${this.path}/login`,
      useCatchErrors(this.authController.login)
    );

    // Protected authentication routes
    this.router.post(
      `${this.path}/logout`,
      isAuthenticated,
      useCatchErrors(this.authController.logout)
    );
    
    this.router.get(
      `${this.path}/profile`,
      isAuthenticated,
      useCatchErrors(this.authController.getUserProfile)
    );
  }
}

module.exports = AuthRoute;