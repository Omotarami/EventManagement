const express = require("express");
const FavouriteController = require("../controller/favourite");
const useCatchErrors = require("../error/catchErrors");

class FavouriteRoute {
  router = express.Router();
  favouriteController = new FavouriteController();

  path = "/favourite";

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    // Add to favourites
    this.router.post(
      `${this.path}/add`,
      useCatchErrors(this.favouriteController.addFavourite)
    );

    // Remove from favourites
    this.router.delete(
      `${this.path}/remove/:id`,
      useCatchErrors(this.favouriteController.removeFavourite)
    );

    // Update favourite comment
    this.router.put(
      `${this.path}/update-comment/:id`,
      useCatchErrors(this.favouriteController.updateFavouriteComment)
    );

    // Get user's favourites
    this.router.get(
      `${this.path}/user/:user_id`,
      useCatchErrors(this.favouriteController.getUserFavourites)
    );

    // Check if event is favourite
    this.router.get(
      `${this.path}/check/:user_id/:event_id`,
      useCatchErrors(this.favouriteController.checkIfFavourite)
    );
  }
}

module.exports = FavouriteRoute;