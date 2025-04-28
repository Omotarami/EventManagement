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

      // Create the message using the message service
      const message = await messageService.createMessage(
        sender_id,
        conversation_id,
        content
      );

      // If Socket.IO is available, emit the message to connected clients
      if (req.app.get('io')) {
        const roomName = `conversation:${conversation_id}`;
        req.app.get('io').to(roomName).emit('receive_message', message);
      }

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

      // Get messages with pagination using the message service
      const messages = await messageService.getRecentMessages(
        conversation_id, 
        parseInt(limit)
      );

      // Update last read timestamp
      await messageService.updateLastReadTime(user_id, conversation_id);

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
          messages,
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
      // Delete message using the message service
      const success = await messageService.deleteMessage(id, user_id);
      
      if (!success) {
        return res.status(404).json({ 
          message: "Message not found or you're not authorized to delete it" 
        });
      }

      // If Socket.IO is available, notify connected clients
      if (req.app.get('io')) {
        // Get the conversation for this message to emit to the right room
        const message = await prisma.message.findUnique({
          where: { id: parseInt(id) },
          select: { conversation_id: true }
        });
        
        if (message) {
          const roomName = `conversation:${message.conversation_id}`;
          req.app.get('io').to(roomName).emit('message_deleted', { 
            messageId: parseInt(id) 
          });
        }
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
      // Update the last_read_at timestamp using the message service
      await messageService.updateLastReadTime(user_id, conversation_id);

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
      // Get unread count using the message service
      const unreadCount = await messageService.getUnreadCount(
        user_id, 
        conversation_id
      );

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