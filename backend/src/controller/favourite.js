const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class FavouriteController {
  async addFavourite(req, res) {
    const { user_id, event_id, comment } = req.body;

    if (!user_id || !event_id) {
      return res.status(400).json({
        message: "Missing required fields: user_id and event_id are required",
      });
    }

    try {
      // Check if user exists
      const userExists = await prisma.user.findUnique({
        where: { id: parseInt(user_id) },
      });

      if (!userExists) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if event exists
      const eventExists = await prisma.event.findUnique({
        where: { id: parseInt(event_id) },
      });

      if (!eventExists) {
        return res.status(404).json({ message: "Event not found" });
      }

      // Check if favourite already exists
      const existingFavourite = await prisma.favourite.findFirst({
        where: {
          user_id: parseInt(user_id),
          event_id: parseInt(event_id),
        },
      });

      if (existingFavourite) {
        return res.status(400).json({ 
          message: "Event already added to favourites" 
        });
      }

      const favourite = await prisma.favourite.create({
        data: {
          user_id: parseInt(user_id),
          event_id: parseInt(event_id),
          comment,
        },
      });

      res.status(201).json({ 
        message: "Event added to favourites successfully", 
        data: favourite 
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ 
        message: "An error occurred while adding to favourites" 
      });
    }
  }

  async removeFavourite(req, res) {
    const { id } = req.params;

    try {
      const existingFavourite = await prisma.favourite.findUnique({
        where: { id: parseInt(id) },
      });

      if (!existingFavourite) {
        return res.status(404).json({ message: "Favourite not found" });
      }

      await prisma.favourite.delete({
        where: { id: parseInt(id) },
      });

      res.status(200).json({ 
        message: "Removed from favourites successfully" 
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ 
        message: "An error occurred while removing from favourites" 
      });
    }
  }

  async updateFavouriteComment(req, res) {
    const { id } = req.params;
    const { comment } = req.body;

    try {
      const existingFavourite = await prisma.favourite.findUnique({
        where: { id: parseInt(id) },
      });

      if (!existingFavourite) {
        return res.status(404).json({ message: "Favourite not found" });
      }

      const updatedFavourite = await prisma.favourite.update({
        where: { id: parseInt(id) },
        data: { comment },
      });

      res.status(200).json({ 
        message: "Favourite comment updated successfully",
        data: updatedFavourite,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ 
        message: "An error occurred while updating favourite comment" 
      });
    }
  }

  async getUserFavourites(req, res) {
    const { user_id } = req.params;

    try {
      const userExists = await prisma.user.findUnique({
        where: { id: parseInt(user_id) },
      });

      if (!userExists) {
        return res.status(404).json({ message: "User not found" });
      }

      const favourites = await prisma.favourite.findMany({
        where: { user_id: parseInt(user_id) },
        include: {
          event: true, // Include event details
        },
      });

      res.status(200).json({ 
        message: "Favourites retrieved successfully",
        data: favourites,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ 
        message: "An error occurred while fetching favourites" 
      });
    }
  }

  async checkIfFavourite(req, res) {
    const { user_id, event_id } = req.params;

    try {
      const favourite = await prisma.favourite.findFirst({
        where: {
          user_id: parseInt(user_id),
          event_id: parseInt(event_id),
        },
      });

      res.status(200).json({ 
        message: "Favourite check completed",
        data: {
          isFavourite: !!favourite,
          favouriteDetails: favourite || null,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ 
        message: "An error occurred while checking favourite status" 
      });
    }
  }
}

module.exports = FavouriteController;