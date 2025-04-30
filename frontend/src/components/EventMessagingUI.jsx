import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Send, 
  Search, 
  Users, 
  MessageCircle, 
  Check, 
  CheckCheck, 
  MoreHorizontal, 
  Smile
} from 'lucide-react';
import toast from 'react-hot-toast';

/**
 * EventMessagingUI - A simplified messaging component for event attendees
 * Uses localStorage for persistence and mocks real-time functionality
 * 
 * @param {Object} props
 * @param {string} props.eventId - The ID of the event for this messaging interface
 */
const EventMessagingUI = ({ eventId }) => {
  const { user } = useAuth();
  const [attendees, setAttendees] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef(null);
  
  // Load data on component mount
  useEffect(() => {
    if (!eventId || !user) return;
    
    // Load mock attendees for this event
    loadAttendees();
    
    // Load conversations from localStorage
    loadConversations();
    
    // Set up mock "real-time" message checking
    const interval = setInterval(() => {
      if (selectedConversation) {
        loadMessages(selectedConversation.id);
      }
    }, 2000);
    
    return () => clearInterval(interval);
  }, [eventId, user]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Load messages when conversation changes
  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id);
      
      // Mark conversation as read
      markConversationAsRead(selectedConversation.id);
    }
  }, [selectedConversation]);
  
  // Simulate loading attendees for this event
  const loadAttendees = () => {
    // In a real app, this would be an API call
    // For now, generate some mock attendees
    const mockAttendees = [
      { id: 'att1', name: 'Sarah Johnson', avatar: null, online: true },
      { id: 'att2', name: 'Michael Chen', avatar: null, online: false },
      { id: 'att3', name: 'Emma Rodriguez', avatar: null, online: true },
      { id: 'att4', name: 'David Kim', avatar: null, online: false },
    ];
    
    // Filter out the current user
    const filteredAttendees = mockAttendees.filter(a => a.id !== user.id);
    setAttendees(filteredAttendees);
  };
  
  // Load conversations from localStorage
  const loadConversations = () => {
    try {
      const storedConversations = localStorage.getItem(`event_${eventId}_conversations`);
      if (storedConversations) {
        setConversations(JSON.parse(storedConversations));
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  };
  
  // Load messages for a specific conversation
  const loadMessages = (conversationId) => {
    try {
      const key = `event_${eventId}_conversation_${conversationId}_messages`;
      const storedMessages = localStorage.getItem(key);
      if (storedMessages) {
        setMessages(JSON.parse(storedMessages));
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };
  
  // Start a new conversation
  const startConversation = (attendee) => {
    // Check if conversation already exists
    const existingConv = conversations.find(c => 
      c.participantIds.includes(user.id) && 
      c.participantIds.includes(attendee.id)
    );
    
    if (existingConv) {
      setSelectedConversation(existingConv);
      return;
    }
    
    // Create a new conversation
    const newConversation = {
      id: `conv_${Date.now()}`,
      participantIds: [user.id, attendee.id],
      participants: [
        { id: user.id, name: user.name, avatar: null },
        { id: attendee.id, name: attendee.name, avatar: attendee.avatar }
      ],
      lastMessage: null,
      unreadCount: 0,
      created: new Date().toISOString()
    };
    
    // Update state and localStorage
    const updatedConversations = [...conversations, newConversation];
    setConversations(updatedConversations);
    localStorage.setItem(`event_${eventId}_conversations`, JSON.stringify(updatedConversations));
    
    // Select the new conversation
    setSelectedConversation(newConversation);
  };
  
  // Send a message
  const sendMessage = (e) => {
    e.preventDefault();
    
    if (!messageInput.trim() || !selectedConversation) return;
    
    // Create message object
    const newMessage = {
      id: `msg_${Date.now()}`,
      conversationId: selectedConversation.id,
      senderId: user.id,
      content: messageInput.trim(),
      timestamp: new Date().toISOString(),
      read: false
    };
    
    // Update messages in state and localStorage
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    
    const messageKey = `event_${eventId}_conversation_${selectedConversation.id}_messages`;
    localStorage.setItem(messageKey, JSON.stringify(updatedMessages));
    
    // Update conversation with last message
    const updatedConversations = conversations.map(conv => {
      if (conv.id === selectedConversation.id) {
        return {
          ...conv,
          lastMessage: {
            content: newMessage.content,
            timestamp: newMessage.timestamp
          }
        };
      }
      return conv;
    });
    
    setConversations(updatedConversations);
    localStorage.setItem(`event_${eventId}_conversations`, JSON.stringify(updatedConversations));
    
    // Clear input
    setMessageInput('');
  };
  
  // Mark a conversation as read
  const markConversationAsRead = (conversationId) => {
    const updatedConversations = conversations.map(conv => {
      if (conv.id === conversationId) {
        return { ...conv, unreadCount: 0 };
      }
      return conv;
    });
    
    setConversations(updatedConversations);
    localStorage.setItem(`event_${eventId}_conversations`, JSON.stringify(updatedConversations));
    
    // Also mark all messages as read
    const messageKey = `event_${eventId}_conversation_${conversationId}_messages`;
    const updatedMessages = messages.map(msg => {
      if (msg.senderId !== user.id) {
        return { ...msg, read: true };
      }
      return msg;
    });
    
    setMessages(updatedMessages);
    localStorage.setItem(messageKey, JSON.stringify(updatedMessages));
  };
  
  // Get the other participant in a conversation
  const getOtherParticipant = (conversation) => {
    if (!conversation || !conversation.participants) return null;
    return conversation.participants.find(p => p.id !== user.id);
  };
  
  // Filter attendees based on search term
  const filteredAttendees = attendees.filter(attendee => 
    attendee.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden h-full flex flex-col">
      <div className="grid grid-cols-3 h-full">
        {/* Participants List */}
        <div className="border-r border-gray-200 flex flex-col h-full">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-medium text-gray-800">Attendees</h3>
            <p className="text-sm text-gray-500">Connect with event participants</p>
          </div>
          
          {/* Search */}
          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search attendees..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          {/* Conversations list */}
          <div className="flex-1 overflow-y-auto">
            {conversations.length > 0 && (
              <>
                <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Your Conversations
                </div>
                
                {conversations.map(conversation => {
                  const otherParticipant = getOtherParticipant(conversation);
                  
                  return (
                    <div
                      key={conversation.id}
                      onClick={() => setSelectedConversation(conversation)}
                      className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                        selectedConversation?.id === conversation.id ? 'bg-orange-50' : ''
                      }`}
                    >
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          {otherParticipant?.avatar ? (
                            <img 
                              src={otherParticipant.avatar} 
                              alt={otherParticipant.name} 
                              className="w-10 h-10 rounded-full" 
                            />
                          ) : (
                            <span className="text-gray-500 font-medium">
                              {otherParticipant?.name.substring(0, 1)}
                            </span>
                          )}
                        </div>
                        <div className="ml-3 flex-1">
                          <div className="flex justify-between items-center">
                            <h4 className="font-medium text-gray-800">{otherParticipant?.name}</h4>
                            {conversation.lastMessage && (
                              <span className="text-xs text-gray-500">
                                {new Date(conversation.lastMessage.timestamp).toLocaleTimeString([], { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 truncate">
                            {conversation.lastMessage 
                              ? conversation.lastMessage.content 
                              : "No messages yet"}
                          </p>
                        </div>
                        {conversation.unreadCount > 0 && (
                          <div className="ml-2 bg-orange-400 text-white text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center">
                            {conversation.unreadCount}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
                
                <div className="border-t border-gray-100 mt-2 mb-2"></div>
              </>
            )}
            
            {/* Attendees list */}
            <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
              Event Attendees
            </div>
            
            {filteredAttendees.length > 0 ? (
              filteredAttendees.map(attendee => (
                <div
                  key={attendee.id}
                  onClick={() => startConversation(attendee)}
                  className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      {attendee.avatar ? (
                        <img 
                          src={attendee.avatar} 
                          alt={attendee.name} 
                          className="w-10 h-10 rounded-full" 
                        />
                      ) : (
                        <span className="text-gray-500 font-medium">
                          {attendee.name.substring(0, 1)}
                        </span>
                      )}
                    </div>
                    <div className="ml-3">
                      <h4 className="font-medium text-gray-800">{attendee.name}</h4>
                      <div className="flex items-center text-xs">
                        <span className={`inline-block w-2 h-2 rounded-full mr-1 ${
                          attendee.online ? 'bg-green-500' : 'bg-gray-300'
                        }`}></span>
                        <span className="text-gray-500">
                          {attendee.online ? 'Online' : 'Offline'}
                        </span>
                      </div>
                    </div>
                    <MessageCircle size={18} className="ml-auto text-gray-400" />
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">
                <Users size={20} className="mx-auto mb-2" />
                <p className="text-sm">No attendees found</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Chat Area */}
        <div className="col-span-2 flex flex-col h-full">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="h-16 px-6 flex items-center justify-between border-b border-gray-200">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    {getOtherParticipant(selectedConversation)?.avatar ? (
                      <img 
                        src={getOtherParticipant(selectedConversation)?.avatar} 
                        alt={getOtherParticipant(selectedConversation)?.name} 
                        className="w-10 h-10 rounded-full" 
                      />
                    ) : (
                      <span className="text-gray-500 font-medium">
                        {getOtherParticipant(selectedConversation)?.name.substring(0, 1)}
                      </span>
                    )}
                  </div>
                  <div className="ml-3">
                    <h4 className="font-medium text-gray-800">
                      {getOtherParticipant(selectedConversation)?.name}
                    </h4>
                    <p className="text-xs text-gray-500">Attending this event</p>
                  </div>
                </div>
                <button className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
                  <MoreHorizontal size={20} />
                </button>
              </div>
              
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <MessageCircle size={32} className="mx-auto mb-2 text-gray-300" />
                    <p>No messages yet</p>
                    <p className="text-sm">Send a message to start the conversation!</p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.senderId === user.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-md px-4 py-2 rounded-2xl ${
                          msg.senderId === user.id
                            ? 'bg-orange-400 text-white'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <p>{msg.content}</p>
                        <div className={`flex items-center justify-end mt-1 space-x-1 ${
                          msg.senderId === user.id ? 'text-orange-100' : 'text-gray-400'
                        }`}>
                          <span className="text-xs">
                            {new Date(msg.timestamp).toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                          {msg.senderId === user.id && (
                            msg.read ? <CheckCheck size={14} /> : <Check size={14} />
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
                
                {/* For auto-scrolling to bottom */}
                <div ref={messagesEndRef} />
              </div>
              
              {/* Message Input */}
              <div className="p-4 border-t border-gray-200">
                <form onSubmit={sendMessage} className="flex items-center space-x-2">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="Type a message..."
                      className="w-full pl-4 pr-10 py-2 border border-gray-200 rounded-full focus:outline-none focus:border-orange-400"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                    />
                    <button 
                      type="button" 
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      <Smile size={20} />
                    </button>
                  </div>
                  <button 
                    type="submit" 
                    className="p-2 bg-orange-400 text-white rounded-full hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!messageInput.trim()}
                  >
                    <Send size={20} />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle size={32} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-800">
                  Select a Conversation
                </h3>
                <p className="text-gray-500 mt-1">
                  Choose an attendee to start chatting
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventMessagingUI;