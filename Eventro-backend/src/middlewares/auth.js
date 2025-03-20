const prisma = require("../config/prisma");
const {
  passwordManager,
  JwtTokenManager,
  genRandomIntId,
} = require("../helper");
const {
  UserSignupSchema,
  LoginSchema,
  passwordResetSchema,
} = require("../helper/validate");
const BaseController = require("./base");

class AuthController extends BaseController {
  constructor() {
    super();
  }

  async userSignup(req, res) {
    const payload = req.body;
    const { error } = UserSignupSchema.validate(payload);
    if (error) {
      return this.error(res, error.message, 400);
    }

    const { email, password, firstName, lastName, phone, role } = payload;

    // check if user exists or not
    const userExists = await prisma.user.findUnique({ 
      where: { email } 
    });

    if (userExists) {
      return this.error(res, "User with this email already exists.", 400);
    }

    // Generate profile image from name
    const profileImage = `https://api.dicebear.com/7.x/micah/svg?seed=${firstName}`;
    const passwordHash = passwordManager.hash(password);

    try {
      // Create a transaction to ensure all operations succeed or fail together
      const result = await prisma.$transaction(async (tx) => {
        // Create the user
        const user = await tx.user.create({
          data: {
            email,
            passwordHash,
            firstName,
            lastName,
            profileImage,
            phone,
            isVerified: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });

        // Determine which role to assign
        let roleId;
        if (role) {
          // Find the specified role
          const roleRecord = await tx.role.findUnique({
            where: { name: role.toLowerCase() },
          });
          roleId = roleRecord?.id;
        }

        if (!roleId) {
          // Default to attendee role if no valid role specified
          const attendeeRole = await tx.role.findUnique({
            where: { name: "attendee" },
          });
          roleId = attendeeRole.id;
        }

        // Assign the role to the user and set it as active
        await tx.userRole.create({
          data: {
            userId: user.id,
            roleId: roleId,
            active: true,
          },
        });

        // Generate tokens
        const tokens = this.generateTokens(user.id, roleId);

        // Create a session for the user
        await tx.session.create({
          data: {
            userId: user.id,
            token: tokens.refreshToken,
            ipAddress: req.ip,
            userAgent: req.headers["user-agent"],
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
          },
        });

        return { user, tokens };
      });

      this.success(res, "Successfully registered", 201, {
        accessToken: result.tokens.accessToken,
        refreshToken: result.tokens.refreshToken,
        user: {
          id: result.user.id,
          name: `${result.user.firstName} ${result.user.lastName}`,
          email: result.user.email,
          role: role || "attendee"
        }
      });
    } catch (error) {
      console.error("Registration error:", error);
      return this.error(res, "Failed to register user", 500);
    }
  }

  async login(req, res) {
    const payload = req.body;
    const { error } = LoginSchema.validate(payload);
    if (error) {
      return this.error(res, error.message, 400);
    }

    const { email, password } = payload;

    try {
      // Find user with email
      const user = await prisma.user.findUnique({ 
        where: { email },
        include: {
          userRoles: {
            include: {
              role: true
            }
          }
        }
      });

      if (!user) {
        return this.error(res, "Account not found", 400);
      }

      // Compare password
      if (!passwordManager.comparePwd(password, user.passwordHash)) {
        return this.error(res, "Invalid credentials", 400);
      }

      // Get active role or default to first role
      const activeRole = user.userRoles.find(ur => ur.active) || user.userRoles[0];
      
      if (!activeRole) {
        return this.error(res, "User has no assigned roles", 400);
      }

      // Generate tokens
      const tokens = this.generateTokens(user.id, activeRole.roleId);

      // Create or update session
      await prisma.session.create({
        data: {
          userId: user.id,
          token: tokens.refreshToken,
          ipAddress: req.ip,
          userAgent: req.headers["user-agent"],
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        },
      });

      // Send response
      this.success(res, "Successfully logged in", 200, {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        user: {
          id: user.id,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          role: activeRole.role.name
        }
      });
    } catch (error) {
      console.error("Login error:", error);
      return this.error(res, "Failed to log in", 500);
    }
  }

  async refreshToken(req, res) {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return this.error(res, "Refresh token is required", 400);
    }

    try {
      // Verify the token
      const decoded = JwtTokenManager.verifyRefreshToken(refreshToken);
      
      if (!decoded) {
        return this.error(res, "Invalid refresh token", 401);
      }

      // Find session with this token
      const session = await prisma.session.findFirst({
        where: { 
          token: refreshToken,
          userId: decoded.userId
        },
        include: {
          user: {
            include: {
              userRoles: {
                include: {
                  role: true
                }
              }
            }
          }
        }
      });

      if (!session || session.expiresAt < new Date()) {
        return this.error(res, "Session expired or invalid", 401);
      }

      // Get active role
      const activeRole = session.user.userRoles.find(ur => ur.active) || session.user.userRoles[0];
      
      // Generate new tokens
      const tokens = this.generateTokens(session.userId, activeRole.roleId);

      // Update session with new refresh token
      await prisma.session.update({
        where: { id: session.id },
        data: {
          token: tokens.refreshToken,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        }
      });

      // Send response
      this.success(res, "Token refreshed successfully", 200, {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      });
    } catch (error) {
      console.error("Token refresh error:", error);
      return this.error(res, "Failed to refresh token", 500);
    }
  }

  async logout(req, res) {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return this.error(res, "Refresh token is required", 400);
    }

    try {
      // Find and delete the session
      await prisma.session.deleteMany({
        where: { token: refreshToken }
      });

      this.success(res, "Successfully logged out", 200);
    } catch (error) {
      console.error("Logout error:", error);
      return this.error(res, "Failed to log out", 500);
    }
  }

  async resetPassword(req, res) {
    const { token, newPassword } = req.body;
    const { error } = passwordResetSchema.validate(req.body);
    
    if (error) {
      return this.error(res, error.message, 400);
    }

    try {
      // Find user with this reset token
      const user = await prisma.user.findFirst({
        where: { 
          resetToken: token,
          resetTokenExpiresAt: {
            gt: new Date()
          }
        }
      });

      if (!user) {
        return this.error(res, "Invalid or expired token", 400);
      }

      // Hash new password
      const passwordHash = passwordManager.hash(newPassword);

      // Update user's password and clear reset token
      await prisma.user.update({
        where: { id: user.id },
        data: {
          passwordHash,
          resetToken: null,
          resetTokenExpiresAt: null,
          updatedAt: new Date()
        }
      });

      // Invalidate all existing sessions
      await prisma.session.deleteMany({
        where: { userId: user.id }
      });

      this.success(res, "Password has been reset successfully", 200);
    } catch (error) {
      console.error("Password reset error:", error);
      return this.error(res, "Failed to reset password", 500);
    }
  }

  async requestPasswordReset(req, res) {
    const { email } = req.body;

    if (!email) {
      return this.error(res, "Email is required", 400);
    }

    try {
      // Find user with this email
      const user = await prisma.user.findUnique({
        where: { email }
      });

      if (!user) {
        // For security reasons, don't reveal that the email doesn't exist
        return this.success(res, "If your email exists in our system, you will receive a password reset link", 200);
      }

      // Generate reset token
      const resetToken = genRandomIntId().toString();
      
      // Set token expiration (1 hour)
      const resetTokenExpiresAt = new Date(Date.now() + 60 * 60 * 1000);

      // Update user with reset token
      await prisma.user.update({
        where: { id: user.id },
        data: {
          resetToken,
          resetTokenExpiresAt,
          updatedAt: new Date()
        }
      });

      // TODO: Send email with reset token
      // In a real application, you would send an email with a link containing the token
      // For now, we're just returning success

      this.success(res, "If your email exists in our system, you will receive a password reset link", 200);
    } catch (error) {
      console.error("Password reset request error:", error);
      return this.error(res, "Failed to process password reset request", 500);
    }
  }

  async switchRole(req, res) {
    const userId = req.user.id; // From auth middleware
    const { roleId } = req.body;

    if (!roleId) {
      return this.error(res, "Role ID is required", 400);
    }

    try {
      // Check if user has this role
      const userRole = await prisma.userRole.findFirst({
        where: {
          userId,
          roleId: parseInt(roleId)
        },
        include: {
          role: true
        }
      });

      if (!userRole) {
        return this.error(res, "User does not have the specified role", 400);
      }

      // Deactivate all roles
      await prisma.userRole.updateMany({
        where: { userId },
        data: { active: false }
      });

      // Activate the specified role
      await prisma.userRole.update({
        where: { id: userRole.id },
        data: { active: true }
      });

      // Generate new tokens with the new role
      const tokens = this.generateTokens(userId, parseInt(roleId));

      // Update user's session
      if (req.session) {
        await prisma.session.update({
          where: { id: req.session.id },
          data: {
            token: tokens.refreshToken
          }
        });
      }

      this.success(res, "Role switched successfully", 200, {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        role: userRole.role.name
      });
    } catch (error) {
      console.error("Role switch error:", error);
      return this.error(res, "Failed to switch role", 500);
    }
  }

  // Helper method to generate tokens
  generateTokens(userId, roleId) {
    const accessToken = JwtTokenManager.genAccessToken({
      userId,
      roleId
    });
    
    const refreshToken = JwtTokenManager.genRefreshToken({
      userId,
      roleId
    });

    return { accessToken, refreshToken };
  }
}

module.exports = AuthController;