const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const messageService = require('../socket/messageService');
const logger = require('../config/logger');

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

      // Remove profile visibility check - allow all participants to send messages

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
            }
          }
        }
      });

      // If Socket.IO is available, emit the message to connected clients
      if (req.app.get('io')) {
        const roomName = `conversation:${conversation_id}`;
        req.app.get('io').to(roomName).emit('receive_message', message);
      }

      // Update last read timestamp for the sender
      await prisma.conversationParticipant.update({
        where: { id: participant.id },
        data: { last_read_at: new Date() },
      });

      res.status(201).json({
        message: "Message sent successfully",
        data: message,
      });
    } catch (error) {
      logger.error(`Error in sendMessage: ${error.message}`);
      res.status(500).json({
        message: "An error occurred while sending message",
      });
    }
  }

  // Get messages from a conversation
  async getConversationMessages(req, res) {
    const { conversation_id } = req.params;
    const { page = 1, limit = 50, user_id } = req.query;
    const skip = (page - 1) * limit;

    if (!user_id) {
      return res.status(400).json({
        message: "Missing required query parameter: user_id",
      });
    }

    try {
      // Verify the user is a participant in this conversation
      const participant = await prisma.conversationParticipant.findFirst({
        where: {
          conversation_id: parseInt(conversation_id),
          user_id: parseInt(user_id),
          is_active: true,
        },
      });

      if (!participant) {
        return res.status(403).json({
          message: "You are not a participant in this conversation",
        });
      }

      // Get messages with pagination
      const messages = await prisma.message.findMany({
        where: {
          conversation_id: parseInt(conversation_id),
          is_deleted: false,
          // Remove profile visibility filter
        },
        include: {
          sender: {
            select: {
              id: true,
              fullname: true,
              profile_picture: true,
            }
          }
        },
        orderBy: {
          created_at: 'desc',
        },
        skip,
        take: parseInt(limit),
      });

      // Update last read timestamp
      await prisma.conversationParticipant.update({
        where: { id: participant.id },
        data: { last_read_at: new Date() },
      });

      // Get total count for pagination
      const total = await prisma.message.count({
        where: {
          conversation_id: parseInt(conversation_id),
          is_deleted: false,
          // Remove profile visibility filter
        },
      });

      // Return messages in chronological order
      const orderedMessages = messages.reverse();

      res.status(200).json({
        message: "Messages retrieved successfully",
        data: {
          messages: orderedMessages,
          pagination: {
            current_page: parseInt(page),
            total_pages: Math.ceil(total / limit),
            total_messages: total,
          },
        },
      });
    } catch (error) {
      logger.error(`Error in getConversationMessages: ${error.message}`);
      res.status(500).json({
        message: "An error occurred while fetching messages",
      });
    }
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
      // Check message exists and is owned by this user
      const message = await prisma.message.findUnique({
        where: { id: parseInt(id) },
      });
      
      if (!message) {
        return res.status(404).json({ message: "Message not found" });
      }
      
      if (message.sender_id !== parseInt(user_id)) {
        return res.status(403).json({ message: "Not authorized to delete this message" });
      }
      
      // Soft delete by setting is_deleted to true
      await prisma.message.update({
        where: { id: parseInt(id) },
        data: { is_deleted: true }
      });

      // If Socket.IO is available, notify connected clients
      if (req.app.get('io')) {
        const roomName = `conversation:${message.conversation_id}`;
        req.app.get('io').to(roomName).emit('message_deleted', { 
          messageId: parseInt(id) 
        });
      }

      res.status(200).json({
        message: "Message deleted successfully",
      });
    } catch (error) {
      logger.error(`Error in deleteMessage: ${error.message}`);
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
      // Find participant record
      const participant = await prisma.conversationParticipant.findFirst({
        where: {
          conversation_id: parseInt(conversation_id),
          user_id: parseInt(user_id),
          is_active: true,
        },
      });

      if (!participant) {
        return res.status(403).json({
          message: "You are not a participant in this conversation",
        });
      }

      // Update the last_read_at timestamp
      await prisma.conversationParticipant.update({
        where: { id: participant.id },
        data: { last_read_at: new Date() },
      });

      // If Socket.IO is available, notify other participants
      if (req.app.get('io')) {
        const roomName = `conversation:${conversation_id}`;
        req.app.get('io').to(roomName).emit('message_read', { 
          conversationId: parseInt(conversation_id), 
          userId: parseInt(user_id),
          timestamp: new Date()
        });
      }

      res.status(200).json({
        message: "Messages marked as read successfully",
      });
    } catch (error) {
      logger.error(`Error in markMessagesAsRead: ${error.message}`);
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
        }
      });
      
      if (!participant) {
        return res.status(404).json({
          message: "User is not a participant in this conversation",
        });
      }
      
      // Count messages after last read time that weren't sent by this user
      const unreadCount = await prisma.message.count({
        where: {
          conversation_id: parseInt(conversation_id),
          is_deleted: false,
          created_at: {
            gt: participant.last_read_at || new Date(0),
          },
          sender_id: {
            not: parseInt(user_id), // Don't count user's own messages
          }
        }
      });

      res.status(200).json({
        message: "Unread count retrieved successfully",
        data: {
          unread_count: unreadCount,
        },
      });
    } catch (error) {
      logger.error(`Error in getUnreadCount: ${error.message}`);
      res.status(500).json({
        message: "An error occurred while fetching unread count",
      });
    }
  }
}

module.exports = MessageController;