// Socket.IO Server Setup
const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');
const ENV = require('../config/env');
const logger = require('../config/logger');

// Socket.IO Event Types
const EVENTS = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  ERROR: 'error',
  
  // Authentication
  AUTHENTICATE: 'authenticate',
  AUTHENTICATION_ERROR: 'authentication_error',
  AUTHENTICATION_SUCCESS: 'authentication_success',
  
  // Conversation
  JOIN_CONVERSATION: 'join_conversation',
  LEAVE_CONVERSATION: 'leave_conversation',
  
  // Messages
  SEND_MESSAGE: 'send_message',
  RECEIVE_MESSAGE: 'receive_message',
  MESSAGES_HISTORY: 'messages_history',
  MESSAGE_DELIVERED: 'message_delivered',
  MESSAGE_READ: 'message_read',
  
  // Typing Indicators
  TYPING_START: 'typing_start',
  TYPING_STOP: 'typing_stop',
  
  // Online Status
  USER_ONLINE: 'user_online',
  USER_OFFLINE: 'user_offline',
};

class SocketServer {
  constructor(server) {
    this.io = socketIO(server, {
      cors: {
        origin: process.env.NODE_ENV === 'development' 
          ? 'http://localhost:5173' 
          : process.env.FRONTEND_URL,
        methods: ['GET', 'POST'],
        credentials: true
      }
    });
    
    this.userSockets = new Map(); // userId -> socket
    
    // Initialize Socket.IO middleware and event handlers
    this.init();
  }
  
  init() {
    // Add authentication middleware
    this.io.use(this.authenticateSocket.bind(this));
    
    // Set up connection handler
    this.io.on(EVENTS.CONNECT, this.handleConnection.bind(this));
    
    logger.info('Socket.IO server initialized');
  }
  
  // Authentication middleware
  async authenticateSocket(socket, next) {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication token is required'));
      }
      
      // Verify JWT token
      const decoded = jwt.verify(token, ENV.jwtSecret);
      
      if (!decoded || !decoded.userId) {
        return next(new Error('Invalid authentication token'));
      }
      
      // Check if user exists
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          fullname: true,
          email: true,
          profile_visibility: true,
          profile_picture: true,
        }
      });
      
      if (!user) {
        return next(new Error('User not found'));
      }
      
      // Attach user to socket
      socket.user = user;
      next();
    } catch (error) {
      logger.error('Socket authentication error:', error);
      next(new Error('Authentication failed'));
    }
  }
  
  // Handle new connections
  handleConnection(socket) {
    const userId = socket.user.id;
    
    logger.info(`User ${userId} connected via WebSocket`);
    
    // Add socket to user map
    this.userSockets.set(userId, socket);
    
    // Broadcast user online status
    this.broadcastUserStatus(userId, true);
    
    // Set up event listeners for this socket
    this.setupEventListeners(socket);
    
    // Handle disconnection
    socket.on(EVENTS.DISCONNECT, () => this.handleDisconnect(socket));
  }
  
  // Handle disconnections
  handleDisconnect(socket) {
    const userId = socket.user.id;
    
    logger.info(`User ${userId} disconnected`);
    
    // Remove from user map
    this.userSockets.delete(userId);
    
    // Broadcast user offline status
    this.broadcastUserStatus(userId, false);
  }
  
  // Setup event listeners for individual socket
  setupEventListeners(socket) {
    const userId = socket.user.id;
    
    // Join conversation room
    socket.on(EVENTS.JOIN_CONVERSATION, async (data) => {
      try {
        const { conversationId } = data;
        
        if (!conversationId) {
          return this.emitError(socket, 'Conversation ID is required');
        }
        
        // Verify user is a participant in this conversation
        const isParticipant = await this.verifyConversationParticipant(userId, conversationId);
        
        if (!isParticipant) {
          return this.emitError(socket, 'Not authorized to join this conversation');
        }
        
        // Create a room name based on conversation ID
        const roomName = `conversation:${conversationId}`;
        
        // Join the room
        socket.join(roomName);
        
        logger.info(`User ${userId} joined conversation ${conversationId}`);
        
        // Get the most recent messages for this conversation
        const messages = await this.getRecentMessages(conversationId);
        
        // Send messages history to the user
        socket.emit(EVENTS.MESSAGES_HISTORY, { conversationId, messages });
        
        // Update last read timestamp for this user
        await this.markMessagesAsRead(userId, conversationId);
      } catch (error) {
        logger.error(`Error joining conversation: ${error.message}`);
        this.emitError(socket, 'Failed to join conversation');
      }
    });
    
    // Leave conversation room
    socket.on(EVENTS.LEAVE_CONVERSATION, (data) => {
      try {
        const { conversationId } = data;
        
        if (!conversationId) {
          return this.emitError(socket, 'Conversation ID is required');
        }
        
        // Leave the room
        const roomName = `conversation:${conversationId}`;
        socket.leave(roomName);
        
        logger.info(`User ${userId} left conversation ${conversationId}`);
      } catch (error) {
        logger.error(`Error leaving conversation: ${error.message}`);
        this.emitError(socket, 'Failed to leave conversation');
      }
    });
    
    // Send a message
    socket.on(EVENTS.SEND_MESSAGE, async (data) => {
      try {
        const { conversationId, content } = data;
        
        if (!conversationId || !content) {
          return this.emitError(socket, 'Conversation ID and content are required');
        }
        
        // Verify user is a participant and has public profile
        const canSendMessage = await this.canSendMessage(userId, conversationId);
        
        if (!canSendMessage) {
          return this.emitError(socket, 'Not authorized to send messages in this conversation');
        }
        
        // Save message to database
        const message = await this.saveMessage(userId, conversationId, content);
        
        // Broadcast message to all participants in the conversation
        const roomName = `conversation:${conversationId}`;
        this.io.to(roomName).emit(EVENTS.RECEIVE_MESSAGE, message);
        
        // Acknowledge message receipt to sender
        socket.emit(EVENTS.MESSAGE_DELIVERED, { messageId: message.id });
        
        // Update sender's last read timestamp
        await this.markMessagesAsRead(userId, conversationId);
      } catch (error) {
        logger.error(`Error sending message: ${error.message}`);
        this.emitError(socket, 'Failed to send message');
      }
    });
    
    // Mark messages as read
    socket.on(EVENTS.MESSAGE_READ, async (data) => {
      try {
        const { conversationId } = data;
        
        if (!conversationId) {
          return this.emitError(socket, 'Conversation ID is required');
        }
        
        // Verify user is a participant
        const isParticipant = await this.verifyConversationParticipant(userId, conversationId);
        
        if (!isParticipant) {
          return this.emitError(socket, 'Not authorized for this conversation');
        }
        
        // Update last read timestamp
        await this.markMessagesAsRead(userId, conversationId);
        
        // Notify other participants
        const roomName = `conversation:${conversationId}`;
        socket.to(roomName).emit(EVENTS.MESSAGE_READ, { 
          conversationId, 
          userId,
          timestamp: new Date()
        });
      } catch (error) {
        logger.error(`Error marking messages as read: ${error.message}`);
        this.emitError(socket, 'Failed to mark messages as read');
      }
    });
    
    // Typing indicators
    socket.on(EVENTS.TYPING_START, (data) => {
      try {
        const { conversationId } = data;
        
        if (!conversationId) {
          return this.emitError(socket, 'Conversation ID is required');
        }
        
        // Broadcast typing indicator to conversation participants
        const roomName = `conversation:${conversationId}`;
        socket.to(roomName).emit(EVENTS.TYPING_START, { 
          conversationId, 
          userId,
          user: {
            id: socket.user.id,
            fullname: socket.user.fullname
          }
        });
      } catch (error) {
        logger.error(`Error with typing indicator: ${error.message}`);
      }
    });
    
    socket.on(EVENTS.TYPING_STOP, (data) => {
      try {
        const { conversationId } = data;
        
        if (!conversationId) {
          return this.emitError(socket, 'Conversation ID is required');
        }
        
        // Broadcast typing stopped to conversation participants
        const roomName = `conversation:${conversationId}`;
        socket.to(roomName).emit(EVENTS.TYPING_STOP, { 
          conversationId, 
          userId,
          user: {
            id: socket.user.id,
            fullname: socket.user.fullname
          }
        });
      } catch (error) {
        logger.error(`Error with typing indicator: ${error.message}`);
      }
    });
  }
  
  // Helper to verify a user is a participant in a conversation
  async verifyConversationParticipant(userId, conversationId) {
    try {
      const participant = await prisma.conversationParticipant.findFirst({
        where: {
          user_id: parseInt(userId),
          conversation_id: parseInt(conversationId),
          is_active: true
        }
      });
      
      return !!participant;
    } catch (error) {
      logger.error(`Error verifying conversation participant: ${error.message}`);
      return false;
    }
  }
  
  // Helper to check if a user can send messages (is participant + has public profile)
  async canSendMessage(userId, conversationId) {
    try {
      // First check if user is a participant
      const isParticipant = await this.verifyConversationParticipant(userId, conversationId);
      
      if (!isParticipant) {
        return false;
      }
      
      // Check if user has public profile
      const user = await prisma.user.findUnique({
        where: { id: parseInt(userId) },
        select: { profile_visibility: true }
      });
      
      return user?.profile_visibility === 'public';
    } catch (error) {
      logger.error(`Error checking message permissions: ${error.message}`);
      return false;
    }
  }
  
  // Import message service
  messageService = require('./messageService');
  
  // Helper to save a message to the database
  async saveMessage(userId, conversationId, content) {
    try {
      return await this.messageService.createMessage(userId, conversationId, content);
    } catch (error) {
      logger.error(`Error saving message: ${error.message}`);
      throw error;
    }
  }
  
  // Helper to fetch recent messages for a conversation
  async getRecentMessages(conversationId, limit = 50) {
    try {
      return await this.messageService.getRecentMessages(conversationId, limit);
    } catch (error) {
      logger.error(`Error fetching messages: ${error.message}`);
      return [];
    }
  }
  
  // Helper to mark messages as read for a user
  async markMessagesAsRead(userId, conversationId) {
    try {
      await this.messageService.updateLastReadTime(userId, conversationId);
    } catch (error) {
      logger.error(`Error marking messages as read: ${error.message}`);
      throw error;
    }
  }
  
  // Helper to broadcast user online status
  broadcastUserStatus(userId, isOnline) {
    // Get all conversation IDs this user is part of
    this.getUserConversations(userId)
      .then(conversationIds => {
        // For each conversation, broadcast status to other participants
        conversationIds.forEach(conversationId => {
          const roomName = `conversation:${conversationId}`;
          this.io.to(roomName).emit(
            isOnline ? EVENTS.USER_ONLINE : EVENTS.USER_OFFLINE, 
            { userId }
          );
        });
      })
      .catch(error => {
        logger.error(`Error broadcasting user status: ${error.message}`);
      });
  }
  
  // Helper to get all conversations for a user
  async getUserConversations(userId) {
    try {
      const participants = await prisma.conversationParticipant.findMany({
        where: {
          user_id: parseInt(userId),
          is_active: true
        },
        select: {
          conversation_id: true
        }
      });
      
      return participants.map(p => p.conversation_id);
    } catch (error) {
      logger.error(`Error fetching user conversations: ${error.message}`);
      return [];
    }
  }
  
  // Helper to emit an error to a socket
  emitError(socket, message) {
    socket.emit(EVENTS.ERROR, { message });
  }
}

module.exports = {
  SocketServer,
  EVENTS
};