import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

// Socket event types
export const SOCKET_EVENTS = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  
  // Conversation
  JOIN_CONVERSATION: 'join_conversation',
  LEAVE_CONVERSATION: 'leave_conversation',
  
  // Messages
  SEND_MESSAGE: 'send_message',
  RECEIVE_MESSAGE: 'receive_message',
  MESSAGE_READ: 'message_read',
  
  // Typing Indicators
  TYPING_START: 'typing_start',
  TYPING_STOP: 'typing_stop',
  
  // Online Status
  USER_ONLINE: 'user_online',
  USER_OFFLINE: 'user_offline',
};

// Create context
const SocketContext = createContext(null);

// Mock socket implementation using localStorage
export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  
  // Online users state
  const [onlineUsers, setOnlineUsers] = useState({});
  
  // Typing indicators state
  const [typingUsers, setTypingUsers] = useState({});
  
  // Message listeners
  const [messageListeners, setMessageListeners] = useState([]);
  
  // Connect to mock socket
  useEffect(() => {
    if (!user) return;
    
    // Set connected status
    setIsConnected(true);
    
    // Set user as online
    setOnlineUsers(prev => ({
      ...prev,
      [user.id]: true
    }));
    
    // Mock online status for some users
    setOnlineUsers(prev => ({
      ...prev,
      'att1': true,
      'att3': true
    }));
    
    // Cleanup on unmount
    return () => {
      setIsConnected(false);
      
      // Remove user from online list
      if (user) {
        setOnlineUsers(prev => {
          const newState = { ...prev };
          delete newState[user.id];
          return newState;
        });
      }
    };
  }, [user]);
  
  // Join a conversation
  const joinConversation = useCallback((conversationId) => {
    console.log(`Joined conversation: ${conversationId}`);
    
    // Get messages for this conversation
    const key = `conversation_${conversationId}_messages`;
    const storedMessages = localStorage.getItem(key);
    const messages = storedMessages ? JSON.parse(storedMessages) : [];
    
    // Notify listeners
    messageListeners.forEach(listener => {
      listener({ 
        type: SOCKET_EVENTS.RECEIVE_MESSAGE, 
        conversationId, 
        messages 
      });
    });
  }, [messageListeners]);
  
  // Leave a conversation
  const leaveConversation = useCallback((conversationId) => {
    console.log(`Left conversation: ${conversationId}`);
  }, []);
  
  // Send a message
  const sendMessage = useCallback((conversationId, content) => {
    if (!user) return Promise.reject(new Error('Not authenticated'));
    
    return new Promise((resolve) => {
      // Create message object
      const newMessage = {
        id: `msg_${Date.now()}`,
        conversation_id: conversationId,
        sender_id: user.id,
        content,
        created_at: new Date().toISOString(),
        sender: {
          id: user.id,
          fullname: user.name,
          profile_picture: null
        }
      };
      
      // Get existing messages
      const key = `conversation_${conversationId}_messages`;
      const storedMessages = localStorage.getItem(key);
      const messages = storedMessages ? JSON.parse(storedMessages) : [];
      
      // Add new message
      const updatedMessages = [...messages, newMessage];
      localStorage.setItem(key, JSON.stringify(updatedMessages));
      
      // Notify listeners
      messageListeners.forEach(listener => {
        listener({ 
          type: SOCKET_EVENTS.RECEIVE_MESSAGE, 
          message: newMessage 
        });
      });
      
      // Resolve with the new message
      resolve(newMessage);
      
      // Update conversation last message
      const convKey = `conversations`;
      const storedConversations = localStorage.getItem(convKey);
      if (storedConversations) {
        const conversations = JSON.parse(storedConversations);
        const updatedConversations = conversations.map(conv => {
          if (conv.id === conversationId) {
            return {
              ...conv,
              lastMessage: {
                content,
                timestamp: new Date().toISOString()
              }
            };
          }
          return conv;
        });
        
        localStorage.setItem(convKey, JSON.stringify(updatedConversations));
      }
    });
  }, [user]);
  
  // Mark messages as read
  const markMessagesAsRead = useCallback((conversationId) => {
    if (!user) return;
    
    const key = `conversation_${conversationId}_messages`;
    const storedMessages = localStorage.getItem(key);
    
    if (storedMessages) {
      const messages = JSON.parse(storedMessages);
      
      // Mark all messages from other users as read
      const updatedMessages = messages.map(msg => {
        if (msg.sender_id !== user.id) {
          return { ...msg, read: true };
        }
        return msg;
      });
      
      localStorage.setItem(key, JSON.stringify(updatedMessages));
      
      // Notify other participants
      messageListeners.forEach(listener => {
        listener({ 
          type: SOCKET_EVENTS.MESSAGE_READ, 
          conversationId, 
          userId: user.id 
        });
      });
    }
  }, [user]);
  
  // Handle typing indicator
  const handleTyping = useCallback((conversationId, isTyping) => {
    if (!user) return;
    
    if (isTyping) {
      // Add user to typing list for this conversation
      setTypingUsers(prev => ({
        ...prev,
        [conversationId]: {
          ...(prev[conversationId] || {}),
          [user.id]: true
        }
      }));
      
      // Auto-clear after 3 seconds
      setTimeout(() => {
        setTypingUsers(prev => {
          const conversationTypers = { ...(prev[conversationId] || {}) };
          delete conversationTypers[user.id];
          
          return {
            ...prev,
            [conversationId]: conversationTypers
          };
        });
      }, 3000);
    } else {
      // Remove user from typing list
      setTypingUsers(prev => {
        const conversationTypers = { ...(prev[conversationId] || {}) };
        delete conversationTypers[user.id];
        
        return {
          ...prev,
          [conversationId]: conversationTypers
        };
      });
    }
  }, [user]);
  
  // Check if a user is online
  const isUserOnline = useCallback((userId) => {
    return !!onlineUsers[userId];
  }, [onlineUsers]);
  
  // Check if a user is typing in a conversation
  const isUserTyping = useCallback((conversationId, userId) => {
    return !!(typingUsers[conversationId] && typingUsers[conversationId][userId]);
  }, [typingUsers]);
  
  // Get typing users for a conversation
  const getTypingUsers = useCallback((conversationId) => {
    return Object.keys(typingUsers[conversationId] || {}).map(Number);
  }, [typingUsers]);
  
  // Add message listener
  const addMessageListener = useCallback((callback) => {
    setMessageListeners(prev => [...prev, callback]);
    
    return () => {
      setMessageListeners(prev => prev.filter(cb => cb !== callback));
    };
  }, []);
  
  // Message history listener (same implementation for simplicity)
  const addMessageHistoryListener = useCallback((callback) => {
    setMessageListeners(prev => [...prev, callback]);
    
    return () => {
      setMessageListeners(prev => prev.filter(cb => cb !== callback));
    };
  }, []);
  
  // Read receipt listener (same implementation for simplicity)
  const addReadReceiptListener = useCallback((callback) => {
    setMessageListeners(prev => [...prev, callback]);
    
    return () => {
      setMessageListeners(prev => prev.filter(cb => cb !== callback));
    };
  }, []);
  
  // Provide context value
  const value = {
    isConnected,
    error: null,
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
    addReadReceiptListener
  };
  
  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

// Custom hook for using the socket context
export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};