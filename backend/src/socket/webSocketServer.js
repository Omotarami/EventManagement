// backend/src/socket/webSocketServer.js
const WebSocket = require("ws");
const jwt = require("jsonwebtoken");
const url = require("url");
const prisma = require("../config/prisma");
const ENV = require("../config/env");
const logger = require("../config/logger");

class WebSocketServer {
  constructor(server) {
    // Initialize WebSocket server
    this.wss = new WebSocket.Server({ server });
    this.clients = new Map(); // userId -> WebSocket
    this.conversationClients = new Map(); // conversationId -> Set of userIds

    // Set up connection handling
    this.wss.on("connection", this.handleConnection.bind(this));

    logger.info("WebSocket server initialized");
  }

  // Handle new WebSocket connections
  async handleConnection(ws, req) {
    try {
      // Parse URL parameters
      const { query } = url.parse(req.url, true);
      const { token, userId } = query;

      // Validate token
      if (!token) {
        this.sendError(ws, "No authentication token provided");
        ws.close(4001, "Authentication required");
        return;
      }

      // Verify JWT token
      let decoded;
      try {
        decoded = jwt.verify(token, ENV.jwtSecret);
      } catch (error) {
        this.sendError(ws, "Invalid token");
        ws.close(4002, "Invalid token");
        return;
      }

      // Validate user ID from token matches the one in query
      if (String(decoded.userId) !== String(userId)) {
        this.sendError(ws, "User ID mismatch");
        ws.close(4003, "User ID mismatch");
        return;
      }

      // Store user ID with WebSocket
      ws.userId = parseInt(userId);

      // Add client to map
      this.clients.set(ws.userId, ws);

      // Send welcome message
      this.send(ws, {
        type: "CONNECTED",
        payload: { userId: ws.userId },
      });

      // Broadcast online status
      this.broadcastOnlineStatus(ws.userId, true);

      // Set up message handling
      ws.on("message", (messageData) => {
        this.handleMessage(ws, messageData);
      });

      // Handle disconnection
      ws.on("close", () => {
        this.handleDisconnection(ws);
      });

      logger.info(`User ${ws.userId} connected via WebSocket`);
    } catch (error) {
      logger.error("WebSocket connection error:", error);
      ws.close(4000, "Connection error");
    }
  }

  // Handle incoming messages
  async handleMessage(ws, messageData) {
    try {
      const message = JSON.parse(messageData.toString());
      logger.info(
        `Received WebSocket message from user ${ws.userId}:`,
        message
      );

      const { type, payload } = message;

      switch (type) {
        case "JOIN_CONVERSATION":
          await this.handleJoinConversation(ws, payload);
          break;

        case "LEAVE_CONVERSATION":
          await this.handleLeaveConversation(ws, payload);
          break;

        case "SEND_MESSAGE":
          await this.handleSendMessage(ws, payload);
          break;

        case "TYPING_INDICATOR":
          await this.handleTypingIndicator(ws, payload);
          break;

        case "MARK_READ":
          await this.handleMarkRead(ws, payload);
          break;

        default:
          this.sendError(ws, `Unknown message type: ${type}`);
      }
    } catch (error) {
      logger.error("Error handling WebSocket message:", error);
      this.sendError(ws, "Error processing message");
    }
  }

  // Handle client joining a conversation
  async handleJoinConversation(ws, payload) {
    try {
      const { conversationId } = payload;

      if (!conversationId) {
        return this.sendError(ws, "Conversation ID is required");
      }

      // Verify user is a participant in this conversation
      const participant = await prisma.conversationParticipant.findFirst({
        where: {
          conversation_id: parseInt(conversationId),
          user_id: ws.userId,
          is_active: true,
        },
      });

      if (!participant) {
        return this.sendError(ws, "Not authorized to join this conversation");
      }

      // Add user to conversation clients map
      if (!this.conversationClients.has(conversationId)) {
        this.conversationClients.set(conversationId, new Set());
      }

      this.conversationClients.get(conversationId).add(ws.userId);

      // Store current conversation ID on the socket
      ws.currentConversationId = conversationId;

      // Send confirmation
      this.send(ws, {
        type: "JOINED_CONVERSATION",
        payload: { conversationId },
      });

      // Get recent messages
      const messages = await prisma.message.findMany({
        where: {
          conversation_id: parseInt(conversationId),
          is_deleted: false,
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
        take: 30,
      });

      // Send message history
      this.send(ws, {
        type: "MESSAGE_HISTORY",
        payload: {
          conversationId,
          messages: messages.reverse(),
        },
      });

      // Update last read timestamp for this user
      await prisma.conversationParticipant.updateMany({
        where: {
          conversation_id: parseInt(conversationId),
          user_id: ws.userId,
        },
        data: {
          last_read_at: new Date(),
        },
      });

      logger.info(`User ${ws.userId} joined conversation ${conversationId}`);
    } catch (error) {
      logger.error(`Error joining conversation:`, error);
      this.sendError(ws, "Error joining conversation");
    }
  }

  // Handle client leaving a conversation
  async handleLeaveConversation(ws, payload) {
    try {
      const { conversationId } = payload;

      if (!conversationId) {
        return this.sendError(ws, "Conversation ID is required");
      }

      // Remove user from conversation clients map
      if (this.conversationClients.has(conversationId)) {
        this.conversationClients.get(conversationId).delete(ws.userId);
      }

      // Clear current conversation ID
      ws.currentConversationId = null;

      // Send confirmation
      this.send(ws, {
        type: "LEFT_CONVERSATION",
        payload: { conversationId },
      });

      logger.info(`User ${ws.userId} left conversation ${conversationId}`);
    } catch (error) {
      logger.error(`Error leaving conversation:`, error);
      this.sendError(ws, "Error leaving conversation");
    }
  }

  // Handle sending a message
  async handleSendMessage(ws, payload) {
    try {
      const { conversationId, content } = payload;

      if (!conversationId || !content) {
        return this.sendError(ws, "Conversation ID and content are required");
      }

      // Verify user is a participant
      const participant = await prisma.conversationParticipant.findFirst({
        where: {
          conversation_id: parseInt(conversationId),
          user_id: ws.userId,
          is_active: true,
        },
      });

      if (!participant) {
        return this.sendError(
          ws,
          "Not authorized to send messages in this conversation"
        );
      }

      // Create message in database
      const message = await prisma.message.create({
        data: {
          conversation_id: parseInt(conversationId),
          sender_id: ws.userId,
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

      // Update sender's last read time
      await prisma.conversationParticipant.updateMany({
        where: {
          conversation_id: parseInt(conversationId),
          user_id: ws.userId,
        },
        data: {
          last_read_at: new Date(),
        },
      });

      // Send message to all participants in the conversation
      this.broadcastToConversation(conversationId, {
        type: "NEW_MESSAGE",
        payload: message,
      });

      logger.info(
        `User ${ws.userId} sent message to conversation ${conversationId}`
      );
    } catch (error) {
      logger.error(`Error sending message:`, error);
      this.sendError(ws, "Error sending message");
    }
  }

  // Handle typing indicator
  async handleTypingIndicator(ws, payload) {
    try {
      const { conversationId, isTyping } = payload;

      if (!conversationId) {
        return this.sendError(ws, "Conversation ID is required");
      }

      // Broadcast typing indicator to other participants
      this.broadcastToConversation(
        conversationId,
        {
          type: "TYPING_INDICATOR",
          payload: {
            conversationId,
            userId: ws.userId,
            isTyping,
          },
        },
        ws.userId
      ); // Exclude sender
    } catch (error) {
      logger.error(`Error with typing indicator:`, error);
    }
  }

  // Handle marking messages as read
  async handleMarkRead(ws, payload) {
    try {
      const { conversationId } = payload;

      if (!conversationId) {
        return this.sendError(ws, "Conversation ID is required");
      }

      // Verify user is a participant
      const participant = await prisma.conversationParticipant.findFirst({
        where: {
          conversation_id: parseInt(conversationId),
          user_id: ws.userId,
        },
      });

      if (!participant) {
        return this.sendError(ws, "Not authorized for this conversation");
      }

      // Update last read timestamp
      await prisma.conversationParticipant.updateMany({
        where: {
          conversation_id: parseInt(conversationId),
          user_id: ws.userId,
        },
        data: {
          last_read_at: new Date(),
        },
      });

      // Notify other participants
      this.broadcastToConversation(
        conversationId,
        {
          type: "READ_RECEIPT",
          payload: {
            conversationId,
            userId: ws.userId,
            timestamp: new Date(),
          },
        },
        ws.userId
      ); // Exclude sender
    } catch (error) {
      logger.error(`Error marking messages as read:`, error);
    }
  }

  // Handle client disconnection
  handleDisconnection(ws) {
    // Remove from clients map
    if (ws.userId) {
      this.clients.delete(ws.userId);

      // Remove from conversation clients
      if (ws.currentConversationId) {
        const conversationClients = this.conversationClients.get(
          ws.currentConversationId
        );
        if (conversationClients) {
          conversationClients.delete(ws.userId);
        }
      }

      // Broadcast offline status
      this.broadcastOnlineStatus(ws.userId, false);

      logger.info(`User ${ws.userId} disconnected`);
    }
  }

  // Send a message to a WebSocket client
  send(ws, data) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(data));
    }
  }

  // Send an error to a WebSocket client
  sendError(ws, message) {
    this.send(ws, {
      type: "ERROR",
      payload: { message },
    });
  }

  // Broadcast a message to all clients in a conversation
  broadcastToConversation(conversationId, data, excludeUserId = null) {
    const conversationClients = this.conversationClients.get(conversationId);
    if (!conversationClients) return;

    conversationClients.forEach((userId) => {
      // Skip excluded user
      if (excludeUserId && userId === excludeUserId) return;

      const clientWs = this.clients.get(userId);
      if (clientWs && clientWs.readyState === WebSocket.OPEN) {
        this.send(clientWs, data);
      }
    });
  }

  // Broadcast online status to all clients
  broadcastOnlineStatus(userId, isOnline) {
    const data = {
      type: "ONLINE_STATUS",
      payload: { userId, isOnline },
    };

    // Broadcast to all connected clients
    this.clients.forEach((clientWs) => {
      if (clientWs.readyState === WebSocket.OPEN) {
        this.send(clientWs, data);
      }
    });
  }
}

module.exports = WebSocketServer;
