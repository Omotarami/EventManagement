// src/services/WebSocketService.js
class WebSocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectTimeout = null;
    this.messageListeners = [];
    this.statusListeners = [];
    this.typingListeners = [];
    this.readReceiptListeners = [];
    this.onlineStatusListeners = [];
    this.baseUrl = "ws://localhost:8080/ws"; // Change to your WebSocket server URL
  }

  // Connect to WebSocket server
  connect(userId, authToken) {
    // Close existing connection if any
    if (this.socket) {
      this.socket.close();
    }

    // Initialize WebSocket connection with auth token
    this.socket = new WebSocket(
      `${this.baseUrl}?token=${authToken}&userId=${userId}`
    );

    // Connection opened
    this.socket.addEventListener("open", () => {
      console.log("WebSocket connection established");
      this.isConnected = true;
      this.reconnectAttempts = 0;
      this._notifyStatusChange(true);
    });

    // Listen for messages
    this.socket.addEventListener("message", (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("WebSocket message received:", data);

        // Handle different message types
        switch (data.type) {
          case "NEW_MESSAGE":
            this._notifyMessageListeners(data.payload);
            break;
          case "TYPING_INDICATOR":
            this._notifyTypingListeners(data.payload);
            break;
          case "READ_RECEIPT":
            this._notifyReadReceiptListeners(data.payload);
            break;
          case "ONLINE_STATUS":
            this._notifyOnlineStatusListeners(data.payload);
            break;
          case "ERROR":
            console.error("WebSocket error:", data.payload);
            break;
          default:
            // Handle other message types or generic messages
            this._notifyMessageListeners(data);
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    });

    // Connection closed
    this.socket.addEventListener("close", (event) => {
      console.log("WebSocket connection closed:", event.code, event.reason);
      this.isConnected = false;
      this._notifyStatusChange(false);

      // Attempt to reconnect unless closed intentionally
      if (event.code !== 1000) {
        this._attemptReconnect(userId, authToken);
      }
    });

    // Connection error
    this.socket.addEventListener("error", (error) => {
      console.error("WebSocket error:", error);
      this.isConnected = false;
      this._notifyStatusChange(false);
    });
  }

  // Attempt to reconnect
  _attemptReconnect(userId, authToken) {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error("Max reconnection attempts reached");
      return;
    }

    this.reconnectAttempts++;
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);

    console.log(
      `Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`
    );

    this.reconnectTimeout = setTimeout(() => {
      console.log("Reconnecting...");
      this.connect(userId, authToken);
    }, delay);
  }

  // Disconnect WebSocket
  disconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.socket) {
      this.socket.close(1000, "User disconnected");
      this.socket = null;
      this.isConnected = false;
    }
  }

  // Send a message through WebSocket
  sendMessage(type, payload) {
    if (!this.isConnected) {
      console.error("Cannot send message: WebSocket not connected");
      return false;
    }

    try {
      const message = JSON.stringify({
        type,
        payload,
      });

      this.socket.send(message);
      return true;
    } catch (error) {
      console.error("Error sending WebSocket message:", error);
      return false;
    }
  }

  // Join a conversation
  joinConversation(conversationId) {
    return this.sendMessage("JOIN_CONVERSATION", { conversationId });
  }

  // Leave a conversation
  leaveConversation(conversationId) {
    return this.sendMessage("LEAVE_CONVERSATION", { conversationId });
  }

  // Send a chat message
  sendChatMessage(conversationId, content) {
    return this.sendMessage("SEND_MESSAGE", { conversationId, content });
  }

  // Send typing indicator
  sendTypingIndicator(conversationId, isTyping) {
    return this.sendMessage("TYPING_INDICATOR", { conversationId, isTyping });
  }

  // Mark messages as read
  markMessagesAsRead(conversationId) {
    return this.sendMessage("MARK_READ", { conversationId });
  }

  // Add message listener
  addMessageListener(callback) {
    this.messageListeners.push(callback);
    return () => {
      this.messageListeners = this.messageListeners.filter(
        (cb) => cb !== callback
      );
    };
  }

  // Add connection status listener
  addStatusListener(callback) {
    this.statusListeners.push(callback);
    callback(this.isConnected); // Immediate call with current status
    return () => {
      this.statusListeners = this.statusListeners.filter(
        (cb) => cb !== callback
      );
    };
  }

  // Add typing indicator listener
  addTypingListener(callback) {
    this.typingListeners.push(callback);
    return () => {
      this.typingListeners = this.typingListeners.filter(
        (cb) => cb !== callback
      );
    };
  }

  // Add read receipt listener
  addReadReceiptListener(callback) {
    this.readReceiptListeners.push(callback);
    return () => {
      this.readReceiptListeners = this.readReceiptListeners.filter(
        (cb) => cb !== callback
      );
    };
  }

  // Add online status listener
  addOnlineStatusListener(callback) {
    this.onlineStatusListeners.push(callback);
    return () => {
      this.onlineStatusListeners = this.onlineStatusListeners.filter(
        (cb) => cb !== callback
      );
    };
  }

  // Notify message listeners
  _notifyMessageListeners(message) {
    this.messageListeners.forEach((listener) => {
      try {
        listener(message);
      } catch (error) {
        console.error("Error in message listener:", error);
      }
    });
  }

  // Notify status listeners
  _notifyStatusChange(isConnected) {
    this.statusListeners.forEach((listener) => {
      try {
        listener(isConnected);
      } catch (error) {
        console.error("Error in status listener:", error);
      }
    });
  }

  // Notify typing listeners
  _notifyTypingListeners(data) {
    this.typingListeners.forEach((listener) => {
      try {
        listener(data);
      } catch (error) {
        console.error("Error in typing listener:", error);
      }
    });
  }

  // Notify read receipt listeners
  _notifyReadReceiptListeners(data) {
    this.readReceiptListeners.forEach((listener) => {
      try {
        listener(data);
      } catch (error) {
        console.error("Error in read receipt listener:", error);
      }
    });
  }

  // Notify online status listeners
  _notifyOnlineStatusListeners(data) {
    this.onlineStatusListeners.forEach((listener) => {
      try {
        listener(data);
      } catch (error) {
        console.error("Error in online status listener:", error);
      }
    });
  }
}

// Create singleton instance
const webSocketService = new WebSocketService();
export default webSocketService;
