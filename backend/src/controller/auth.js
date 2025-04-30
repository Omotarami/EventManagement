const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const ENV = require("../config/env");

const prisma = new PrismaClient();

class AuthController {
  async userRegister(req, res) {
    const { fullname, email, password } = req.body;

    if (!fullname || !email || !password) {
      return res.status(400).json({
        message: "All fields are required: fullname, email, password",
      });
    }

    try {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return res
          .status(400)
          .json({ message: "User with this email already exists." });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await prisma.user.create({
        data: {
          fullname,
          email,
          password: hashedPassword,
          account_type: "attendee", // Default to attendee
        },
      });

      res.status(201).json({ message: "User registered successfully." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error." });
    }
  }
  
  async organizerRegister(req, res) {
    const { fullname, email, password } = req.body;

    if (!fullname || !email || !password) {
      return res.status(400).json({
        message: "All fields are required: fullname, email, password",
      });
    }

    try {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return res
          .status(400)
          .json({ message: "User with this email already exists." });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await prisma.user.create({
        data: {
          fullname,
          email,
          password: hashedPassword,
          account_type: "organizer",
        },
      });
      
      res.status(201).json({ message: "Organizer registered successfully." });
    } catch (error) {
      console.error("Error details:", error);
      res.status(500).json({
        message: "Server error during registration",
        details: error.message || "Unknown error",
      });
    }
  }
  
  async login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return res.status(400).json({ message: "Invalid credentials." });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid credentials." });
      }

      // Create token payload with user info
      const tokenPayload = {
        userId: user.id,
        email: user.email,
        accountType: user.account_type,
      };

      // Generate JWT token
      const token = jwt.sign(
        tokenPayload,
        ENV.jwtSecret,
        { expiresIn: "24h" }
      );

      // Create or update user session - updated to match your schema
      await prisma.session.upsert({
        where: {
          // Use token as unique identifier
          token: token,
        },
        update: {
          is_active: true,
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
        },
        create: {
          user_id: user.id, // Changed from userId to user_id
          token: token,
          is_active: true,
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
        },
      });

      // Return user data (without password)
      const userResponse = {
        id: user.id,
        email: user.email,
        fullname: user.fullname,
        account_type: user.account_type,
      };

      res.status(200).json({
        message: "Login successful.",
        token,
        user: userResponse
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error." });
    }
  }
  
  async logout(req, res) {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      
      if (!token) {
        return res.status(400).json({ message: "No token provided" });
      }
      
      // Verify the token to get user ID
      const decoded = jwt.verify(token, ENV.jwtSecret);
      
      // Deactivate the session
      await prisma.session.update({
        where: {
          token: token,
        },
        data: {
          is_active: false,
        },
      });
      
      res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
      console.error("Logout error:", error);
      res.status(500).json({ message: "Error during logout" });
    }
  }
  
  async getUserProfile(req, res) {
    try {
      const userId = req.user.id;
      
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          fullname: true,
          account_type: true,
          created_at: true,
          updated_at: true,
        },
      });
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.status(200).json({ user });
    } catch (error) {
      console.error("Get user profile error:", error);
      res.status(500).json({ message: "Error retrieving user profile" });
    }
  }
}

module.exports = AuthController;