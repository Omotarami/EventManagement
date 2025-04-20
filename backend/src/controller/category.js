const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class CategoryController {
  async createCategory(req, res) {
    const {
      user_id,
      event_id,
      comment
    } = req.body;

    if (!user_id || !event_id) {
      return res.status(400).json({ 
        message: "Missing required fields: user_id and event_id are required" 
      });
    }

    try {
      // Check if user exists
      const userExists = await prisma.user.findUnique({
        where: { id: parseInt(user_id) }
      });

      if (!userExists) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if event exists
      const eventExists = await prisma.event.findUnique({
        where: { id: parseInt(event_id) }
      });

      if (!eventExists) {
        return res.status(404).json({ message: "Event not found" });
      }

      const category = await prisma.category.create({
        data: {
          user_id: parseInt(user_id),
          event_id: parseInt(event_id),
          comment
        },
      });

      res.status(201).json({ message: "Category created successfully", data: category });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "An error occurred while creating the category" });
    }
  }

  async updateCategory(req, res) {
    const { id } = req.params;
    const { comment } = req.body;

    try {
      const existingCategory = await prisma.category.findUnique({
        where: { id: parseInt(id) }
      });

      if (!existingCategory) {
        return res.status(404).json({ message: "Category not found" });
      }

      const updatedCategory = await prisma.category.update({
        where: { id: parseInt(id) },
        data: { comment },
      });

      res.status(200).json({ message: "Category updated successfully", data: updatedCategory });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "An error occurred while updating the category" });
    }
  }

  async deleteCategory(req, res) {
    const { id } = req.params;

    try {
      const existingCategory = await prisma.category.findUnique({
        where: { id: parseInt(id) }
      });

      if (!existingCategory) {
        return res.status(404).json({ message: "Category not found" });
      }

      await prisma.category.delete({
        where: { id: parseInt(id) }
      });

      res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "An error occurred while deleting the category" });
    }
  }

  async getCategoryById(req, res) {
    const { id } = req.params;

    try {
      const category = await prisma.category.findUnique({
        where: { id: parseInt(id) }
      });

      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }

      res.status(200).json({ message: "Category retrieved successfully", data: category });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "An error occurred while fetching the category" });
    }
  }

  async getCategoriesByUserId(req, res) {
    const { user_id } = req.params;

    try {
      const categories = await prisma.category.findMany({
        where: { user_id: parseInt(user_id) }
      });

      res.status(200).json({ message: "Categories retrieved successfully", data: categories });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "An error occurred while fetching categories" });
    }
  }

  async getCategoriesByEventId(req, res) {
    const { event_id } = req.params;

    try {
      const categories = await prisma.category.findMany({
        where: { event_id: parseInt(event_id) }
      });

      res.status(200).json({ message: "Categories retrieved successfully", data: categories });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "An error occurred while fetching categories" });
    }
  }

  async getAllCategories(req, res) {
    try {
      const categories = await prisma.category.findMany();
      res.status(200).json({ message: "Categories retrieved successfully", data: categories });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "An error occurred while fetching categories" });
    }
  }
}

module.exports = CategoryController;