const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class MessageController {
  // Send a message in a conversation
  async sendMessage(req, res) {
    const { conversation_id, sender_id, content } = req.body;

    if (!conversation_id || !sender_id || !content) {
      return res.status(400).json({
        message: "Missing required fields: conversation_id, sender_id, and content are required",
      });
    }

    try {
      // Check if sender is a participant in the conversation
      const participant = await prisma.conversationParticipant.findFirst({
        where: {
          conversation_id: parseInt(conversation_id),
          user_id: parseInt(sender_id),
          is_active: true,
        },
      });

      if (!participant) {
        return res.status(403).json({
          message: "You are not a participant in this conversation",
        });
      }

      // Check if sender's profile is public
      const sender = await prisma.user.findUnique({
        where: { id: parseInt(sender_id) },
        select: { profile_visibility: true },
      });

      if (sender.profile_visibility !== "public") {
        return res.status(403).json({
          message: "You must have a public profile to send messages",
        });
      }

      // Create the message
      const message = await prisma.message.create({
        data: {
          conversation_id: parseInt(conversation_id),
          sender_id: parseInt(sender_id),
          content,
        },
        include: {
          sender: {
            select: {
              id: true,
              fullname: true,
              profile_picture: true,
            },
          },
        },
      });

      // Update participant's last read time
      await prisma.conversationParticipant.update({
        where: { id: participant.id },
        data: { last_read_at: new Date() },
      });

      res.status(201).json({
        message: "Message sent successfully",
        data: message,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "An error occurred while sending message",
      });
    }
  }

  // Get messages from a conversation (added to fix the error)
  async getConversationMessages(req, res) {
    const { conversation_id } = req.params;
    const { page = 1, limit = 50 } = req.query;
    const skip = (page - 1) * limit;

    try {
      // Get messages with pagination
      const messages = await prisma.message.findMany({
        where: {
          conversation_id: parseInt(conversation_id),
          is_deleted: false,
          sender: {
            profile_visibility: "public", // Only show messages from public profiles
          },
        },
        include: {
          sender: {
            select: {
              id: true,
              fullname: true,
              profile_picture: true,
            },
          },
        },
        orderBy: {
          created_at: "desc",
        },
        skip: parseInt(skip),
        take: parseInt(limit),
      });

      // Get total count for pagination
      const total = await prisma.message.count({
        where: {
          conversation_id: parseInt(conversation_id),
          is_deleted: false,
          sender: {
            profile_visibility: "public",
          },
        },
      });

      res.status(200).json({
        message: "Messages retrieved successfully",
        data: {
          messages: messages.reverse(), // Return in chronological order
          pagination: {
            current_page: parseInt(page),
            total_pages: Math.ceil(total / limit),
            total_messages: total,
          },
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "An error occurred while fetching messages",
      });
    }
  }

  // This method has been replaced by getConversationMessages
  // Keeping this stub for backwards compatibility
  async getChatMessages(req, res) {
    return res.status(410).json({
      message: "This endpoint is deprecated. Please use /conversation/:conversation_id/messages instead.",
    });
  }

  // Delete a message (soft delete)
  async deleteMessage(req, res) {
    const { id } = req.params;
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({
        message: "Missing required field: user_id is required",
      });
    }

    try {
      // Check if message exists and belongs to the user
      const message = await prisma.message.findUnique({
        where: { id: parseInt(id) },
      });

      if (!message) {
        return res.status(404).json({ message: "Message not found" });
      }

      if (message.sender_id !== parseInt(user_id)) {
        return res.status(403).json({
          message: "You can only delete your own messages",
        });
      }

      // Soft delete the message
      await prisma.message.update({
        where: { id: parseInt(id) },
        data: { is_deleted: true },
      });

      res.status(200).json({
        message: "Message deleted successfully",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "An error occurred while deleting message",
      });
    }
  }

  // Mark messages as read
  async markMessagesAsRead(req, res) {
    const { conversation_id } = req.params;
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({
        message: "Missing required field: user_id is required",
      });
    }

    try {
      // Update the last_read_at timestamp for the participant
      await prisma.conversationParticipant.updateMany({
        where: {
          conversation_id: parseInt(conversation_id),
          user_id: parseInt(user_id),
        },
        data: {
          last_read_at: new Date(),
        },
      });

      res.status(200).json({
        message: "Messages marked as read successfully",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "An error occurred while marking messages as read",
      });
    }
  }

  // Get unread message count for a user in a conversation
  async getUnreadCount(req, res) {
    const { conversation_id, user_id } = req.params;

    try {
      // Get participant's last read time
      const participant = await prisma.conversationParticipant.findFirst({
        where: {
          conversation_id: parseInt(conversation_id),
          user_id: parseInt(user_id),
        },
      });

      if (!participant) {
        return res.status(404).json({
          message: "User is not a participant in this conversation",
        });
      }

      // Count messages sent after last read time
      const unreadCount = await prisma.message.count({
        where: {
          conversation_id: parseInt(conversation_id),
          is_deleted: false,
          sender: {
            profile_visibility: "public",
          },
          created_at: {
            gt: participant.last_read_at || new Date(0),
          },
          sender_id: {
            not: parseInt(user_id), // Don't count user's own messages
          },
        },
      });

      res.status(200).json({
        message: "Unread count retrieved successfully",
        data: {
          unread_count: unreadCount,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "An error occurred while fetching unread count",
      });
    }
  }
}

module.exports = MessageController;