const express = require("express");
const UserController = require("../controller/user");
const useCatchErrors = require("../error/catchErrors");
const { isAuthenticated } = require("../middlewares/auth");

class UserRoute {
  router = express.Router();
  userController = new UserController();
  path = "/user";

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    // route for getting user profile information
    this.router.get(
      `${this.path}/profile/:id`,
      isAuthenticated,
      useCatchErrors(
        this.userController.getUserProfile.bind(this.userController)
      )
    );

    this.router.post(
      `${this.path}/profile/visibility`,
      isAuthenticated,
      useCatchErrors(
        this.userController.updateProfileVisibility.bind(this.userController)
      )
    );

    this.router.get(
      `${this.path}/public`,
      isAuthenticated,
      useCatchErrors(
        this.userController.getPublicUsers.bind(this.userController)
      )
    );

    // Endpoint Route to get all users
    this.router.get(
      `${this.path}/all`,
      isAuthenticated,
      useCatchErrors(this.userController.allUsers.bind(this.userController))
    );
    
    // Search User
    this.router.get(
      `${this.path}/search/:query`,
      isAuthenticated,
      useCatchErrors(
        this.userController.searchUserByNameOrEmail.bind(this.userController)
      )
    );

    this.router.post(
      `${this.path}/reset-password`,
      useCatchErrors(
        this.userController.passwordReset.bind(this.userController)
      )
    );

    this.router.post(
      `${this.path}/forgot-password`,
      useCatchErrors(
        this.userController.forgotPassword.bind(this.userController)
      )
    );
  }
}

module.exports = UserRoute;