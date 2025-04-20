const express = require("express");
const CategoryController = require("../controller/category");
const useCatchErrors = require("../error/catchErrors");

class CategoryRoute {
  router = express.Router();
  categoryController = new CategoryController();

  path = "/category";

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post(
      `${this.path}/create`,
      useCatchErrors(this.categoryController.createCategory)
    );
    this.router.put(
      `${this.path}/update/:id`,
      useCatchErrors(this.categoryController.updateCategory)
    );
    this.router.delete(
      `${this.path}/delete/:id`,
      useCatchErrors(this.categoryController.deleteCategory)
    );
    this.router.get(
      `${this.path}/:id`,
      useCatchErrors(this.categoryController.getCategoryById)
    );
    this.router.get(
      `${this.path}/user/:user_id`,
      useCatchErrors(this.categoryController.getCategoriesByUserId)
    );
    this.router.get(
      `${this.path}/event/:event_id`,
      useCatchErrors(this.categoryController.getCategoriesByEventId)
    );
    this.router.get(
      `${this.path}/all`,
      useCatchErrors(this.categoryController.getAllCategories)
    );
  }
}

module.exports = CategoryRoute;