import React, { useState, useContext, useEffect } from "react";
import { 
  Search, 
  Send, 
  Calendar, 
  Users, 
  MoreHorizontal, 
  Image,
  Paperclip,
  Smile,
  Check,
  CheckCheck,
  MessageCircle
} from 'lucide-react';
import DashboardNavbar from "../components/DashboardNavbar";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import { EventContext } from "../context/EventContext";
import { Toaster } from "react-hot-toast";

const Messages = () => {
  const { user } = useAuth();
  const { events } = useContext(EventContext);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [messageableUsers, setMessageableUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch conversations when an event is selected
  useEffect(() => {
    if (selectedEvent && user) {
      fetchConversations(selectedEvent.id);
      fetchMessageableUsers(selectedEvent.id);
    }
  }, [selectedEvent, user]);

  // Fetch messages when a conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.id);
    }
  }, [selectedConversation]);

  // Fetch user's event conversations
  const fetchConversations = async (eventId) => {
    try {
      const response = await fetch(`/api/conversation/event/${eventId}/user/${user.id}`);
      const data = await response.json();
      if (response.ok) {
        setConversations(data.data);
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  };

  // Fetch messageable users for the event
  const fetchMessageableUsers = async (eventId) => {
    try {
      const response = await fetch(`/api/conversation/event/${eventId}/messageable-users/${user.id}`);
      const data = await response.json();
      if (response.ok) {
        setMessageableUsers(data.data);
      }
    } catch (error) {
      console.error("Error fetching messageable users:", error);
    }
  };

  // Fetch messages for a conversation
  const fetchMessages = async (conversationId) => {
    try {
      const response = await fetch(`/api/conversation/${conversationId}/messages?user_id=${user.id}`);
      const data = await response.json();
      if (response.ok) {
        setMessages(data.data.messages);
        // Mark messages as read
        markMessagesAsRead(conversationId);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  // Start a new conversation
  const startConversation = async (otherUserId) => {
    try {
      const response = await fetch("/api/conversation/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          event_id: selectedEvent.id,
          participant_ids: [user.id, otherUserId],
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setSelectedConversation(data.data);
        fetchConversations(selectedEvent.id);
      }
    } catch (error) {
      console.error("Error starting conversation:", error);
    }
  };

  // Send a message
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !selectedConversation) return;

    try {
      const response = await fetch("/api/conversation/message/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversation_id: selectedConversation.id,
          sender_id: user.id,
          content: message.trim(),
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessages([...messages, data.data]);
        setMessage("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Mark messages as read
  const markMessagesAsRead = async (conversationId) => {
    try {
      await fetch(`/api/conversation/${conversationId}/mark-read`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user.id,
        }),
      });
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  };

  // Get the other participant in a conversation
  const getOtherParticipant = (conversation) => {
    if (!conversation || !conversation.participants) return null;
    return conversation.participants.find(p => p.user_id !== user.id)?.user;
  };

  // Filter events based on user role and attendance
  const filteredEvents = events.filter(event => {
    if (user?.role === 'organizer') {
      return event.organizerId === user.id;
    } else {
      // For attendees, check if they have a ticket for the event
      return event.attendees?.includes(user?.id) || event.soldTickets > 0;
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-center" />
      <DashboardNavbar />
      <Sidebar userType={user?.role} />
      
      <div className="pl-24 pr-6 pt-6 pb-12">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Messages</h1>
          
          <div className="flex h-[calc(100vh-160px)] bg-white rounded-lg shadow">
            {/* Events Sidebar */}
            <div className="w-80 border-r border-gray-200 flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">Your Events</h2>
                <p className="text-sm text-gray-500 mt-1">Connect with other attendees</p>
              </div>

              <div className="p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search events..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-400"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                {filteredEvents.map((event) => (
                  <div
                    key={event.id}
                    onClick={() => setSelectedEvent(event)}
                    className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                      selectedEvent?.id === event.id ? 'bg-orange-50' : ''
                    }`}
                  >
                    <div className="flex items-center">
                      <img
                        src={event.imageSrc || "/api/placeholder/80/80"}
                        alt={event.title}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="ml-3 flex-1">
                        <h3 className="font-medium text-gray-800">{event.title}</h3>
                        <div className="flex items-center mt-1">
                          <Calendar size={14} className="text-gray-400 mr-1" />
                          <span className="text-sm text-gray-500">
                            {new Date(event.startDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Conversations List */}
            <div className="w-80 border-r border-gray-200 flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <h2 className="font-semibold text-gray-800">Chat with Attendees</h2>
                <p className="text-sm text-gray-500">
                  {selectedEvent ? `${selectedEvent.soldTickets || 0} people attending` : 'Select an event'}
                </p>
              </div>

              <div className="p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search attendees..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-400"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                {/* Existing Conversations */}
                {conversations.map((conversation) => {
                  const otherUser = getOtherParticipant(conversation);
                  const lastMessage = conversation.messages?.[0];
                  
                  return (
                    <div
                      key={conversation.id}
                      onClick={() => setSelectedConversation(conversation)}
                      className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                        selectedConversation?.id === conversation.id ? 'bg-orange-50' : ''
                      }`}
                    >
                      <div className="flex items-center">
                        <div className="relative">
                          <img
                            src={otherUser?.profile_picture || "/api/placeholder/40/40"}
                            alt={otherUser?.fullname}
                            className="w-10 h-10 rounded-full"
                          />
                        </div>
                        <div className="ml-3 flex-1">
                          <div className="flex justify-between items-center">
                            <h3 className="font-medium text-gray-800">{otherUser?.fullname}</h3>
                            {lastMessage && (
                              <span className="text-xs text-gray-500">
                                {new Date(lastMessage.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 truncate">
                            {lastMessage?.content || "Start a conversation"}
                          </p>
                        </div>
                        {conversation.unread_count > 0 && (
                          <div className="w-5 h-5 bg-orange-400 rounded-full flex items-center justify-center ml-2">
                            <span className="text-xs text-white font-medium">{conversation.unread_count}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Divider if there are both conversations and messageable users */}
                {conversations.length > 0 && messageableUsers.length > 0 && (
                  <div className="border-t border-gray-200 my-2 mx-4"></div>
                )}

                {/* Messageable Users */}
                {messageableUsers.filter(u => !u.has_conversation).map((messageableUser) => (
                  <div
                    key={messageableUser.id}
                    onClick={() => startConversation(messageableUser.id)}
                    className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center">
                      <div className="relative">
                        <img
                          src={messageableUser.profile_picture || "/api/placeholder/40/40"}
                          alt={messageableUser.fullname}
                          className="w-10 h-10 rounded-full"
                        />
                      </div>
                      <div className="ml-3 flex-1">
                        <h3 className="font-medium text-gray-800">{messageableUser.fullname}</h3>
                        <p className="text-sm text-gray-500">Click to start messaging</p>
                      </div>
                      <MessageCircle size={16} className="text-gray-400" />
                    </div>
                  </div>
                ))}

                {/* Empty state */}
                {selectedEvent && conversations.length === 0 && messageableUsers.length === 0 && (
                  <div className="p-4 text-center text-gray-500">
                    <Users size={24} className="mx-auto mb-2 text-gray-400" />
                    <p>No attendees with public profiles yet</p>
                  </div>
                )}
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
              {selectedConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="h-16 px-6 flex items-center justify-between border-b border-gray-200">
                    <div className="flex items-center">
                      <img
                        src={getOtherParticipant(selectedConversation)?.profile_picture || "/api/placeholder/40/40"}
                        alt={getOtherParticipant(selectedConversation)?.fullname}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="ml-3">
                        <h3 className="font-medium text-gray-800">
                          {getOtherParticipant(selectedConversation)?.fullname}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Attending {selectedEvent?.title}
                        </p>
                      </div>
                    </div>
                    <button className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
                      <MoreHorizontal size={20} />
                    </button>
                  </div>

                  {/* Messages Area */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.sender_id === user.id ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-md px-4 py-2 rounded-2xl ${
                            msg.sender_id === user.id
                              ? 'bg-orange-400 text-white'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          <p>{msg.content}</p>
                          <div className={`flex items-center justify-end mt-1 space-x-1 ${
                            msg.sender_id === user.id ? 'text-orange-100' : 'text-gray-400'
                          }`}>
                            <span className="text-xs">
                              {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-200">
                    <form onSubmit={sendMessage} className="flex items-center space-x-2">
                      <button type="button" className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
                        <Paperclip size={20} />
                      </button>
                      <button type="button" className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
                        <Image size={20} />
                      </button>
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          placeholder="Type a message..."
                          className="w-full pl-4 pr-10 py-2 border border-gray-200 rounded-full focus:outline-none focus:border-orange-400"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                        />
                        <button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700">
                          <Smile size={20} />
                        </button>
                      </div>
                      <button 
                        type="submit" 
                        className="p-2 bg-orange-400 text-white rounded-full hover:bg-orange-500 disabled:opacity-50"
                        disabled={!message.trim()}
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
                      <Users size={32} className="text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-800">
                      {selectedEvent ? 'Select a conversation' : 'Select an event'}
                    </h3>
                    <p className="text-gray-500 mt-1">
                      {selectedEvent 
                        ? 'Choose an attendee to start chatting' 
                        : 'Choose an event to see attendees you can message'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;