// src/context/WebSocketContext.jsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useAuth } from "./AuthContext";
import webSocketService from "../services/WebSocketService";

// Create context
const WebSocketContext = createContext(null);

// WebSocket provider component
export const WebSocketProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [typingUsers, setTypingUsers] = useState({});
  const [onlineUsers, setOnlineUsers] = useState({});

  // Connect to WebSocket when authenticated
  useEffect(() => {
    if (isAuthenticated() && user?.id) {
      // Get token from localStorage
      const token = localStorage.getItem("token");
      if (!token) return;

      // Connect WebSocket
      webSocketService.connect(user.id, token);

      // Set up status listener
      const removeStatusListener = webSocketService.addStatusListener(
        (connected) => {
          setIsConnected(connected);
        }
      );

      // Set up typing indicator listener
      const removeTypingListener = webSocketService.addTypingListener(
        (data) => {
          const { conversationId, userId, isTyping } = data;

          setTypingUsers((prev) => {
            const conversationTypers = { ...(prev[conversationId] || {}) };

            if (isTyping) {
              conversationTypers[userId] = true;
            } else {
              delete conversationTypers[userId];
            }

            return {
              ...prev,
              [conversationId]: conversationTypers,
            };
          });
        }
      );

      // Set up online status listener
      const removeOnlineStatusListener =
        webSocketService.addOnlineStatusListener((data) => {
          const { userId, isOnline } = data;

          setOnlineUsers((prev) => ({
            ...prev,
            [userId]: isOnline,
          }));
        });

      // Clean up on unmount
      return () => {
        removeStatusListener();
        removeTypingListener();
        removeOnlineStatusListener();
        webSocketService.disconnect();
      };
    }
  }, [user, isAuthenticated]);

  // Join a conversation
  const joinConversation = useCallback(
    (conversationId) => {
      if (!isConnected) return;
      webSocketService.joinConversation(conversationId);
    },
    [isConnected]
  );

  // Leave a conversation
  const leaveConversation = useCallback(
    (conversationId) => {
      if (!isConnected) return;
      webSocketService.leaveConversation(conversationId);
    },
    [isConnected]
  );

  // Send a message
  const sendMessage = useCallback(
    async (conversationId, content) => {
      if (!isConnected) {
        throw new Error("WebSocket not connected");
      }

      const success = webSocketService.sendChatMessage(conversationId, content);
      if (!success) {
        throw new Error("Failed to send message");
      }

      // Return a promise to match API expectations
      return new Promise((resolve) => {
        // The real message will come back through the socket
        // This is just a temporary object for optimistic UI
        resolve({
          id: `temp-${Date.now()}`,
          conversation_id: conversationId,
          content,
          sender_id: user.id,
          created_at: new Date().toISOString(),
        });
      });
    },
    [isConnected, user]
  );

  // Handle typing indicator
  const handleTyping = useCallback(
    (conversationId, isTyping) => {
      if (!isConnected) return;
      webSocketService.sendTypingIndicator(conversationId, isTyping);
    },
    [isConnected]
  );

  // Mark messages as read
  const markMessagesAsRead = useCallback(
    (conversationId) => {
      if (!isConnected) return;
      webSocketService.markMessagesAsRead(conversationId);
    },
    [isConnected]
  );

  // Add message listener
  const addMessageListener = useCallback((callback) => {
    return webSocketService.addMessageListener(callback);
  }, []);

  // Check if a user is online
  const isUserOnline = useCallback(
    (userId) => {
      return !!onlineUsers[userId];
    },
    [onlineUsers]
  );

  // Check if a user is typing
  const isUserTyping = useCallback(
    (conversationId, userId) => {
      return !!(
        typingUsers[conversationId] && typingUsers[conversationId][userId]
      );
    },
    [typingUsers]
  );

  // Get typing users for a conversation
  const getTypingUsers = useCallback(
    (conversationId) => {
      return Object.keys(typingUsers[conversationId] || {}).map((id) =>
        parseInt(id)
      );
    },
    [typingUsers]
  );

  // Context value
  const contextValue = {
    isConnected,
    joinConversation,
    leaveConversation,
    sendMessage,
    handleTyping,
    markMessagesAsRead,
    addMessageListener,
    isUserOnline,
    isUserTyping,
    getTypingUsers,
  };

  return (
    <WebSocketContext.Provider value={contextValue}>
      {children}
    </WebSocketContext.Provider>
  );
};

// Custom hook for using WebSocket context
export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
};
