import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

// Socket.IO event types - must match backend
export const SOCKET_EVENTS = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  CONNECT_ERROR: 'connect_error',
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

// Create the socket context
const SocketContext = createContext(null);

// API URL for socket connection
const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);
  
  // Manage online users per conversation
  const [onlineUsers, setOnlineUsers] = useState({});
  
  // Manage typing indicators per conversation
  const [typingUsers, setTypingUsers] = useState({});
  
  // Connect to socket
  const connect = useCallback(() => {
    if (!user || !user.id || isConnecting || isConnected) return;
    
    setIsConnecting(true);
    setError(null);
    
    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication token not found');
        setIsConnecting(false);
        return;
      }
      
      // Initialize socket connection with auth token
      const socketInstance = io(SOCKET_URL, {
        auth: { token },
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        timeout: 20000,
      });
      
      // Set up event listeners
      socketInstance.on(SOCKET_EVENTS.CONNECT, () => {
        setIsConnected(true);
        setIsConnecting(false);
        console.log('Socket connected');
      });
      
      socketInstance.on(SOCKET_EVENTS.DISCONNECT, () => {
        setIsConnected(false);
        console.log('Socket disconnected');
      });
      
      socketInstance.on(SOCKET_EVENTS.CONNECT_ERROR, (err) => {
        console.error('Socket connection error:', err);
        setError(`Connection error: ${err.message}`);
        setIsConnecting(false);
        setIsConnected(false);
      });
      
      socketInstance.on(SOCKET_EVENTS.ERROR, (err) => {
        console.error('Socket error:', err);
        setError(err.message || 'An unknown error occurred');
        // Don't show toast for every error to avoid spamming the user
      });
      
      // Listen for user online/offline status
      socketInstance.on(SOCKET_EVENTS.USER_ONLINE, ({ userId }) => {
        setOnlineUsers(prev => ({
          ...prev,
          [userId]: true
        }));
      });
      
      socketInstance.on(SOCKET_EVENTS.USER_OFFLINE, ({ userId }) => {
        setOnlineUsers(prev => ({
          ...prev,
          [userId]: false
        }));
      });
      
      // Listen for typing indicators
      socketInstance.on(SOCKET_EVENTS.TYPING_START, ({ conversationId, userId }) => {
        setTypingUsers(prev => ({
          ...prev,
          [conversationId]: {
            ...(prev[conversationId] || {}),
            [userId]: true
          }
        }));
      });
      
      socketInstance.on(SOCKET_EVENTS.TYPING_STOP, ({ conversationId, userId }) => {
        setTypingUsers(prev => {
          const conversationTypers = { ...(prev[conversationId] || {}) };
          delete conversationTypers[userId];
          
          return {
            ...prev,
            [conversationId]: conversationTypers
          };
        });
      });
      
      setSocket(socketInstance);
    } catch (err) {
      console.error('Error initializing socket:', err);
      setError('Failed to initialize socket connection');
      setIsConnecting(false);
    }
  }, [user, isConnecting, isConnected]);
  
  // Disconnect from socket
  const disconnect = useCallback(() => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
      setIsConnected(false);
    }
  }, [socket]);
  
  // Reconnect to socket
  const reconnect = useCallback(() => {
    disconnect();
    connect();
  }, [disconnect, connect]);
  
  // Connect/disconnect based on auth status
  useEffect(() => {
    if (user && !isConnected && !isConnecting) {
      connect();
    } else if (!user && socket) {
      disconnect();
    }
    
    // Cleanup on unmount
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [user, socket, isConnected, isConnecting, connect, disconnect]);
  
  // Join a conversation
  const joinConversation = useCallback((conversationId) => {
    if (!socket || !isConnected) {
      console.error('Socket not connected');
      return;
    }
    
    socket.emit(SOCKET_EVENTS.JOIN_CONVERSATION, { conversationId });
  }, [socket, isConnected]);
  
  // Leave a conversation
  const leaveConversation = useCallback((conversationId) => {
    if (!socket || !isConnected) {
      console.error('Socket not connected');
      return;
    }
    
    socket.emit(SOCKET_EVENTS.LEAVE_CONVERSATION, { conversationId });
  }, [socket, isConnected]);
  
  // Send a message
  const sendMessage = useCallback((conversationId, content) => {
    if (!socket || !isConnected) {
      console.error('Socket not connected');
      return Promise.reject(new Error('Socket not connected'));
    }
    
    return new Promise((resolve, reject) => {
      // First stop typing indicator
      socket.emit(SOCKET_EVENTS.TYPING_STOP, { conversationId });
      
      // Send the message
      socket.emit(SOCKET_EVENTS.SEND_MESSAGE, { conversationId, content });
      
      // Set up a one-time listener for message delivered confirmation
      socket.once(SOCKET_EVENTS.MESSAGE_DELIVERED, (data) => {
        resolve(data);
      });
      
      // Set a timeout for the delivery confirmation
      setTimeout(() => {
        reject(new Error('Message delivery confirmation timed out'));
      }, 5000);
    });
  }, [socket, isConnected]);
  
  // Mark messages as read
  const markMessagesAsRead = useCallback((conversationId) => {
    if (!socket || !isConnected) {
      console.error('Socket not connected');
      return;
    }
    
    socket.emit(SOCKET_EVENTS.MESSAGE_READ, { conversationId });
  }, [socket, isConnected]);
  
  // Send typing indicator
  const sendTypingStart = useCallback((conversationId) => {
    if (!socket || !isConnected) return;
    
    socket.emit(SOCKET_EVENTS.TYPING_START, { conversationId });
  }, [socket, isConnected]);
  
  // Send typing stopped indicator
  const sendTypingStop = useCallback((conversationId) => {
    if (!socket || !isConnected) return;
    
    socket.emit(SOCKET_EVENTS.TYPING_STOP, { conversationId });
  }, [socket, isConnected]);
  
  // Handle debounced typing indicator
  const [typingTimeouts, setTypingTimeouts] = useState({});
  
  const handleTyping = useCallback((conversationId, isTyping) => {
    if (!socket || !isConnected) return;
    
    // Clear any existing timeout for this conversation
    if (typingTimeouts[conversationId]) {
      clearTimeout(typingTimeouts[conversationId]);
    }
    
    if (isTyping) {
      // Send typing start
      sendTypingStart(conversationId);
      
      // Set a timeout to automatically stop typing indicator after 3 seconds
      const timeout = setTimeout(() => {
        sendTypingStop(conversationId);
        
        // Remove this timeout from state
        setTypingTimeouts(prev => {
          const newTimeouts = { ...prev };
          delete newTimeouts[conversationId];
          return newTimeouts;
        });
      }, 3000);
      
      // Save timeout ID
      setTypingTimeouts(prev => ({
        ...prev,
        [conversationId]: timeout
      }));
    } else {
      // Send typing stop
      sendTypingStop(conversationId);
    }
  }, [socket, isConnected, typingTimeouts, sendTypingStart, sendTypingStop]);
  
  // Check if a user is online
  const isUserOnline = useCallback((userId) => {
    return !!onlineUsers[userId];
  }, [onlineUsers]);
  
  // Check if a user is typing in a conversation
  const isUserTyping = useCallback((conversationId, userId) => {
    return !!(typingUsers[conversationId] && typingUsers[conversationId][userId]);
  }, [typingUsers]);
  
  // Get list of typing users in a conversation
  const getTypingUsers = useCallback((conversationId) => {
    return Object.keys(typingUsers[conversationId] || {}).map(Number);
  }, [typingUsers]);
  
  // Add listener for receiving messages
  const addMessageListener = useCallback((callback) => {
    if (!socket) return () => {};
    
    socket.on(SOCKET_EVENTS.RECEIVE_MESSAGE, callback);
    return () => socket.off(SOCKET_EVENTS.RECEIVE_MESSAGE, callback);
  }, [socket]);
  
  // Add listener for message history
  const addMessageHistoryListener = useCallback((callback) => {
    if (!socket) return () => {};
    
    socket.on(SOCKET_EVENTS.MESSAGES_HISTORY, callback);
    return () => socket.off(SOCKET_EVENTS.MESSAGES_HISTORY, callback);
  }, [socket]);
  
  // Add listener for read receipts
  const addReadReceiptListener = useCallback((callback) => {
    if (!socket) return () => {};
    
    socket.on(SOCKET_EVENTS.MESSAGE_READ, callback);
    return () => socket.off(SOCKET_EVENTS.MESSAGE_READ, callback);
  }, [socket]);
  
  // Provide value to context consumers
  const value = {
    socket,
    isConnected,
    isConnecting,
    error,
    connect,
    disconnect,
    reconnect,
    joinConversation,
    leaveConversation,
    sendMessage,
    markMessagesAsRead,
    handleTyping,
    isUserOnline,
    isUserTyping,
    getTypingUsers,
    addMessageListener,
    addMessageHistoryListener,
    addReadReceiptListener,
  };
  
  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

// Custom hook for using socket context
export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};