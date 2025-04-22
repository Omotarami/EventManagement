const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();

class UserController {
  async getUserProfile(req, res) {
    const { id } = req.params;

    try {
      const user = await prisma.user.findUnique({
        where: { id: parseInt(id) },
        select: {
          id: true,
          fullname: true,
          email: true,
          profile_picture: true,
          bio: true,
          account_type: true,
          profile_visibility: true,
          created_at: true,
        },
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({ message: "User profile retrieved successfully", data: user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "An error occurred while fetching user profile" });
    }
  }

  async updateProfileVisibility(req, res) {
    const { user_id, visibility } = req.body;

    if (!user_id || !visibility) {
      return res.status(400).json({
        message: "Missing required fields: user_id and visibility are required",
      });
    }

    if (!["public", "private"].includes(visibility)) {
      return res.status(400).json({
        message: "Invalid visibility value. Must be 'public' or 'private'",
      });
    }

    try {
      const user = await prisma.user.update({
        where: { id: parseInt(user_id) },
        data: { profile_visibility: visibility },
      });

      res.status(200).json({
        message: "Profile visibility updated successfully",
        data: {
          user_id: user.id,
          profile_visibility: user.profile_visibility,
        },
      });
    } catch (error) {
      console.error(error);
      if (error.code === "P2025") {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(500).json({ message: "An error occurred while updating profile visibility" });
    }
  }

  async getPublicUsers(req, res) {
    try {
      const users = await prisma.user.findMany({
        where: {
          profile_visibility: "public",
        },
        select: {
          id: true,
          fullname: true,
          profile_picture: true,
          bio: true,
          account_type: true,
        },
      });

      res.status(200).json({
        message: "Public users retrieved successfully",
        data: users,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "An error occurred while fetching public users" });
    }
  }

  async allUsers(req, res) {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          fullname: true,
          email: true,
          account_type: true,
          profile_visibility: true,
          created_at: true,
        },
      });

      res.status(200).json({
        message: "All users retrieved successfully",
        data: users,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "An error occurred while fetching users" });
    }
  }

  async searchUserByNameOrEmail(req, res) {
    const { query } = req.params;

    try {
      const users = await prisma.user.findMany({
        where: {
          OR: [
            { fullname: { contains: query, mode: 'insensitive' } },
            { email: { contains: query, mode: 'insensitive' } },
          ],
        },
        select: {
          id: true,
          fullname: true,
          email: true,
          profile_picture: true,
          account_type: true,
          profile_visibility: true,
        },
      });

      res.status(200).json({
        message: "Search completed successfully",
        data: users,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "An error occurred while searching users" });
    }
  }

  async passwordReset(req, res) {
    const { email, current_password, new_password } = req.body;

    if (!email || !current_password || !new_password) {
      return res.status(400).json({
        message: "Missing required fields: email, current_password, and new_password are required",
      });
    }

    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Verify current password
      const isPasswordValid = await bcrypt.compare(current_password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Current password is incorrect" });
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(new_password, 10);

      // Update password
      await prisma.user.update({
        where: { email },
        data: { password: hashedPassword },
      });

      res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "An error occurred while resetting password" });
    }
  }

  async forgotPassword(req, res) {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Generate reset token (you would typically send this via email)
      const resetToken = crypto.randomBytes(32).toString('hex');
      
      // Update user with reset token
      await prisma.user.update({
        where: { email },
        data: { reset_token: resetToken },
      });

      // In a real application, you would send an email here
      // For now, we'll just return the token
      res.status(200).json({ 
        message: "Reset token generated successfully",
        data: { reset_token: resetToken }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "An error occurred while processing forgot password request" });
    }
  }
}

module.exports = UserController;