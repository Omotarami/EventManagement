/**
 * Format a timestamp for display in messages
 * 
 * @param {string} timestamp - ISO timestamp string
 * @param {Object} options - Formatting options
 * @returns {string} Formatted time string
 */
export const formatMessageTime = (timestamp, options = {}) => {
    try {
      const date = new Date(timestamp);
      
      // Default options
      const defaultOptions = {
        showDate: false,
        showSeconds: false,
        ...options
      };
      
      // Time formatting options
      const timeOptions = {
        hour: '2-digit',
        minute: '2-digit',
        ...(defaultOptions.showSeconds ? { second: '2-digit' } : {})
      };
      
      // If same day, just show time
      const today = new Date();
      const isToday = date.getDate() === today.getDate() &&
                      date.getMonth() === today.getMonth() &&
                      date.getFullYear() === today.getFullYear();
      
      // If yesterday, show "Yesterday at HH:MM"
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const isYesterday = date.getDate() === yesterday.getDate() &&
                           date.getMonth() === yesterday.getMonth() &&
                           date.getFullYear() === yesterday.getFullYear();
      
      if (isToday && !defaultOptions.showDate) {
        return date.toLocaleTimeString([], timeOptions);
      } else if (isYesterday && !defaultOptions.showDate) {
        return `Yesterday at ${date.toLocaleTimeString([], timeOptions)}`;
      } else {
        // Show full date and time
        return date.toLocaleString([], {
          ...timeOptions,
          month: 'short',
          day: 'numeric',
          year: today.getFullYear() !== date.getFullYear() ? 'numeric' : undefined
        });
      }
    } catch (error) {
      console.error('Error formatting message time:', error);
      return 'Invalid time';
    }
  };
  
  /**
   * Get a list of participants excluding the current user
   * 
   * @param {Array} participants - List of conversation participants
   * @param {number|string} currentUserId - ID of the current user
   * @returns {Array} List of other participants
   */
  export const getOtherParticipants = (participants, currentUserId) => {
    if (!participants || !Array.isArray(participants)) {
      return [];
    }
    
    return participants.filter(p => 
      p.user_id !== parseInt(currentUserId) && 
      p.user_id !== currentUserId
    );
  };
  
  /**
   * Get the other user in a one-to-one conversation
   * 
   * @param {Object} conversation - Conversation object with participants
   * @param {number|string} currentUserId - ID of the current user
   * @returns {Object|null} The other user or null if not found
   */
  export const getOtherUser = (conversation, currentUserId) => {
    if (!conversation || !conversation.participants) {
      return null;
    }
    
    const otherParticipant = conversation.participants.find(p => 
      p.user_id !== parseInt(currentUserId) && 
      p.user_id !== currentUserId
    );
    
    return otherParticipant?.user || null;
  };
  
  /**
   * Get conversation display name (for group chats)
   * 
   * @param {Object} conversation - Conversation object
   * @param {number|string} currentUserId - ID of the current user
   * @returns {string} Display name for the conversation
   */
  export const getConversationName = (conversation, currentUserId) => {
    if (!conversation) {
      return 'New Conversation';
    }
    
    // For one-to-one conversations, use the other user's name
    const otherUser = getOtherUser(conversation, currentUserId);
    if (otherUser) {
      return otherUser.fullname || 'Unknown User';
    }
    
    // For group conversations, list participants or use event name
    if (conversation.event?.title) {
      return conversation.event.title;
    }
    
    // Default fallback
    return `Conversation #${conversation.id}`;
  };
  
  /**
   * Handle sending a message with optimistic UI update
   * 
   * @param {Function} sendMessageFn - Function to send message
   * @param {string} content - Message content
   * @param {Object} conversation - Current conversation
   * @param {Object} user - Current user
   * @param {Function} setMessages - State setter for messages
   * @param {Function} setInputValue - State setter for input field
   * @returns {Promise<Object>} Result of the operation
   */
  export const sendMessageWithOptimisticUpdate = async (
    sendMessageFn,
    content,
    conversation,
    user,
    setMessages,
    setInputValue
  ) => {
    if (!content.trim() || !conversation || !user) {
      return { success: false, error: 'Invalid message or conversation' };
    }
    
    // Create optimistic message
    const optimisticMessage = {
      id: `temp-${Date.now()}`,
      conversation_id: conversation.id,
      sender_id: user.id,
      content: content.trim(),
      created_at: new Date().toISOString(),
      sender: {
        id: user.id,
        fullname: user.name || user.fullname,
        profile_picture: user.profile_picture
      },
      _optimistic: true
    };
    
    // Add optimistic message to state
    setMessages(prev => [...prev, optimisticMessage]);
    
    // Clear input
    setInputValue('');
    
    try {
      // Send the real message
      const result = await sendMessageFn(conversation.id, content.trim());
      
      // Update messages by replacing optimistic message with real one
      setMessages(prev => 
        prev.map(msg => 
          msg.id === optimisticMessage.id ? result : msg
        )
      );
      
      return { success: true, message: result };
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Remove optimistic message on failure
      setMessages(prev => 
        prev.filter(msg => msg.id !== optimisticMessage.id)
      );
      
      return { success: false, error: error.message || 'Failed to send message' };
    }
  };
  
  /**
   * Generate a conversation ID for client-side use
   * 
   * @param {number|string} userId - Current user ID
   * @param {number|string} otherUserId - Other user ID
   * @param {number|string} eventId - Event ID
   * @returns {string} Client-side conversation ID
   */
  export const generateClientConversationId = (userId, otherUserId, eventId) => {
    // Sort the user IDs to ensure the same ID is generated regardless of order
    const sortedUserIds = [userId, otherUserId].sort().join('-');
    return `conversation-${sortedUserIds}-event-${eventId}`;
  };