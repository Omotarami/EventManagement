const prisma = require('../config/prisma');
const logger = require('../config/logger');

/**
 * Service for handling message persistence and synchronization
 */
class MessageService {
  /**
   * Create and persist a new message
   * @param {number} senderId - The sender's user ID
   * @param {number} conversationId - The conversation ID
   * @param {string} content - The message content
   * @returns {Promise<Object>} - The created message with sender info
   */
  async createMessage(senderId, conversationId, content) {
    try {
      const message = await prisma.message.create({
        data: {
          conversation_id: parseInt(conversationId),
          sender_id: parseInt(senderId),
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
      
      // Update sender's last read time
      await this.updateLastReadTime(senderId, conversationId);
      
      return message;
    } catch (error) {
      logger.error(`Error creating message: ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Get recent messages for a conversation
   * @param {number} conversationId - The conversation ID
   * @param {number} limit - Maximum number of messages to return
   * @returns {Promise<Array>} - Array of messages
   */
  async getRecentMessages(conversationId, limit = 50) {
    try {
      const messages = await prisma.message.findMany({
        where: {
          conversation_id: parseInt(conversationId),
          is_deleted: false,
          sender: {
            profile_visibility: 'public',
          }
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
        take: limit,
      });
      
      // Return in chronological order
      return messages.reverse();
    } catch (error) {
      logger.error(`Error fetching messages: ${error.message}`);
      return [];
    }
  }
  
  /**
   * Update last read timestamp for a user in a conversation
   * @param {number} userId - The user ID
   * @param {number} conversationId - The conversation ID
   * @returns {Promise<void>}
   */
  async updateLastReadTime(userId, conversationId) {
    try {
      await prisma.conversationParticipant.updateMany({
        where: {
          user_id: parseInt(userId),
          conversation_id: parseInt(conversationId),
        },
        data: {
          last_read_at: new Date(),
        }
      });
    } catch (error) {
      logger.error(`Error updating last read time: ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Get unread message count for a user in a conversation
   * @param {number} userId - The user ID
   * @param {number} conversationId - The conversation ID
   * @returns {Promise<number>} - Number of unread messages
   */
  async getUnreadCount(userId, conversationId) {
    try {
      // Get participant's last read time
      const participant = await prisma.conversationParticipant.findFirst({
        where: {
          conversation_id: parseInt(conversationId),
          user_id: parseInt(userId),
        }
      });
      
      if (!participant) {
        throw new Error('User is not a participant in this conversation');
      }
      
      // Count messages after last read time that weren't sent by this user
      return await prisma.message.count({
        where: {
          conversation_id: parseInt(conversationId),
          is_deleted: false,
          created_at: {
            gt: participant.last_read_at || new Date(0),
          },
          sender_id: {
            not: parseInt(userId), // Don't count user's own messages
          }
        }
      });
    } catch (error) {
      logger.error(`Error getting unread count: ${error.message}`);
      return 0;
    }
  }
  
  /**
   * Soft delete a message
   * @param {number} messageId - The message ID
   * @param {number} userId - The user ID (for authorization)
   * @returns {Promise<boolean>} - Success indicator
   */
  async deleteMessage(messageId, userId) {
    try {
      // Check message exists and is owned by this user
      const message = await prisma.message.findUnique({
        where: { id: parseInt(messageId) },
      });
      
      if (!message) {
        throw new Error('Message not found');
      }
      
      if (message.sender_id !== parseInt(userId)) {
        throw new Error('Not authorized to delete this message');
      }
      
      // Soft delete by setting is_deleted to true
      await prisma.message.update({
        where: { id: parseInt(messageId) },
        data: { is_deleted: true }
      });
      
      return true;
    } catch (error) {
      logger.error(`Error deleting message: ${error.message}`);
      return false;
    }
  }
  
  /**
   * Get all participants for a conversation
   * @param {number} conversationId - The conversation ID
   * @returns {Promise<Array>} - Array of participant objects
   */
  async getConversationParticipants(conversationId) {
    try {
      const participants = await prisma.conversationParticipant.findMany({
        where: {
          conversation_id: parseInt(conversationId),
          is_active: true,
        },
        include: {
          user: {
            select: {
              id: true,
              fullname: true,
              profile_picture: true,
            }
          }
        }
      });
      
      return participants;
    } catch (error) {
      logger.error(`Error fetching conversation participants: ${error.message}`);
      return [];
    }
  }
  
  /**
   * Get all conversations for a user
   * @param {number} userId - The user ID
   * @returns {Promise<Array>} - Array of conversation IDs
   */
  async getUserConversations(userId) {
    try {
      const participations = await prisma.conversationParticipant.findMany({
        where: {
          user_id: parseInt(userId),
          is_active: true,
        },
        select: {
          conversation_id: true,
        }
      });
      
      return participations.map(p => p.conversation_id);
    } catch (error) {
      logger.error(`Error fetching user conversations: ${error.message}`);
      return [];
    }
  }
}

module.exports = new MessageService();