import { useState, useEffect, useCallback, useRef } from 'react';
import { useSocket } from '../context/SocketContext';

/**
 * Hook to handle typing indicator with debounce
 * 
 * @param {string|number} conversationId - The ID of the current conversation
 * @param {number} delay - Debounce delay in milliseconds
 * @returns {Object} - An object containing typing utility functions and state
 */
export default function useTypingIndicator(conversationId, delay = 1000) {
  const [isTyping, setIsTyping] = useState(false);
  const { isConnected, handleTyping } = useSocket();
  const typingTimeoutRef = useRef(null);
  
  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);
  
  // Reset typing state when conversation changes
  useEffect(() => {
    setIsTyping(false);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // If we're connected and in a conversation, send stopped typing signal
    if (isConnected && conversationId) {
      handleTyping(conversationId, false);
    }
  }, [conversationId, isConnected, handleTyping]);
  
  /**
   * Handle input changes and send typing indicators
   * @param {string} text - The current input text
   */
  const handleInputChange = useCallback((text) => {
    // Only proceed if we're in a valid conversation and connected
    if (!conversationId || !isConnected) return;
    
    const hasText = text && text.trim().length > 0;
    
    // Clear any existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Only send typing indicator if we're not already typing
    // or if we're stopping typing (text is empty)
    if (!isTyping && hasText) {
      setIsTyping(true);
      handleTyping(conversationId, true);
    } else if (isTyping && !hasText) {
      setIsTyping(false);
      handleTyping(conversationId, false);
    }
    
    // Set timeout to stop typing indicator after delay
    if (hasText) {
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        handleTyping(conversationId, false);
      }, delay);
    }
  }, [conversationId, isConnected, isTyping, handleTyping, delay]);
  
  /**
   * Reset typing indicator when sending a message
   */
  const resetTypingIndicator = useCallback(() => {
    if (isTyping && conversationId && isConnected) {
      setIsTyping(false);
      handleTyping(conversationId, false);
      
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }
  }, [conversationId, isConnected, isTyping, handleTyping]);
  
  return {
    isTyping,
    handleInputChange,
    resetTypingIndicator
  };
}