const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

class AuthController {
  async userRegister(req, res) {
    const { fullname, email, password } = req.body;

    if (!fullname || !email || !password) {
      return res.status(400).json({
        message: "All fields are required: fullname, email, password user",
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
        },
      });

      res.status(201).json({ message: "User registered successfully." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error });
    }
  }
  async organizerRegister(req, res) {
    const { fullname, email, password } = req.body;

    if (!fullname || !email || !password) {
      return res.status(400).json({
        message: "All fields are required: fullname, email, password organizer",
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
      const account_type = "organizer";

      await prisma.user.create({
        data: {
          fullname,
          email,
          password: hashedPassword,
          account_type: account_type,
        },
      });
      res.status(201).json({ message: "User registered successfully." });
    } catch (error) {
      console.error("Error details:", error);
      // Return a more informative error message
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

      const token = jwt.sign({ username: user.username }, "your_jwt_secret", {
        expiresIn: "1h",
      });
      res.status(200).json({ message: "Login successful.", token, user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error." });
    }
  }
}

module.exports = AuthController;
