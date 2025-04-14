const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

class AuthController {
  async userRegister(req, res) {
    const { fullName, email, passwordHash, phone } = req.body;

    if (!fullName || !email || !passwordHash || !phone) {
      return res.status(400).json({
        message:
          "All fields are required: fullName, email, password, and phone number.",
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

      const hashedPassword = await bcrypt.hash(passwordHash, 10);

      await prisma.user.create({
        data: {
          fullName,
          email,
          passwordHash: hashedPassword,
          phone,
        },
      });

      res.status(201).json({ message: "User registered successfully." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error });
    }
  }
  async organizerRegister(req, res) {
    const { fullName, email, passwordHash, phone } = req.body;

    if (!fullName || !email || !passwordHash || !phone) {
      return res.status(400).json({
        message:
          "All fields are required: fullName, email, password, and phone number.",
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

      const hashedPassword = await bcrypt.hash(passwordHash, 10);
      const account_type = "organizer";

      await prisma.user.create({
        data: {
          fullName,
          email,
          passwordHash: hashedPassword,
          phone,
          account_type: account_type,
        },
      });

      res.status(201).json({ message: "User registered successfully." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error });
    }
  }
  async login(req, res) {
    const { email, passwordHash } = req.body;

    if (!email || !passwordHash) {
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

      const isPasswordValid = await bcrypt.compare(
        passwordHash,
        user.passwordHash
      );
      if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid credentials." });
      }

      const token = jwt.sign({ username: user.username }, "your_jwt_secret", {
        expiresIn: "1h",
      });
      res.status(200).json({ message: "Login successful.", token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error." });
    }
  }
}

module.exports = AuthController;
