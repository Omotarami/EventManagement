// src/pages/Messages.jsx
import React, { useState, useContext, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
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
  MessageCircle,
  Loader,
  WifiOff,
} from "lucide-react";
import DashboardNavbar from "../components/DashboardNavbar";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import { EventContext } from "../context/EventContext";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import { useWebSocket } from "../context/WebSocketContext";
import api from "../api/axios";

const Messages = () => {
  const { user } = useAuth();
  const { events } = useContext(EventContext);
  const {
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
  } = useWebSocket();

  const location = useLocation();
  const messagesEndRef = useRef(null);

  // Get query parameters
  const searchParams = new URLSearchParams(location.search);
  const urlEventId = searchParams.get("event");
  const urlAttendeeId = searchParams.get("attendee");

  // State
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [messageableUsers, setMessageableUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState({
    conversations: false,
    messageableUsers: false,
    messages: false,
    sendingMessage: false,
  });

  // Track if component is mounted
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Set up message listeners
  useEffect(() => {
    // Listen for new messages
    const removeMessageListener = addMessageListener((message) => {
      console.log("WebSocket message received:", message);

      if (isMounted.current) {
        // If this is a message for our current conversation, add it
        if (
          selectedConversation &&
          String(message.conversation_id) === String(selectedConversation.id)
        ) {
          setMessages((prevMessages) => {
            // Check if this is replacing an optimistic message
            const isReplacement = prevMessages.some(
              (m) => m._optimistic && m.content === message.content
            );

            if (isReplacement) {
              // Replace the optimistic message with the real one
              return prevMessages.map((m) =>
                m._optimistic && m.content === message.content ? message : m
              );
            }

            // Check if we already have this message by id
            if (prevMessages.some((m) => m.id === message.id)) {
              return prevMessages;
            }

            // Add new message
            return [...prevMessages, message];
          });

          // Scroll to bottom on new message
          setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
          }, 100);
        }
        // Update conversation list for messages in other conversations
        else if (
          conversations.some(
            (c) => String(c.id) === String(message.conversation_id)
          )
        ) {
          console.log("Updating unread count for other conversation");
          setConversations((prevConvs) =>
            prevConvs.map((conv) => {
              if (String(conv.id) === String(message.conversation_id)) {
                return {
                  ...conv,
                  unread_count: (conv.unread_count || 0) + 1,
                  // Add latest message to conversation preview
                  messages: [message, ...(conv.messages || [])],
                };
              }
              return conv;
            })
          );
        }
      }
    });

    return () => {
      removeMessageListener();
    };
  }, [addMessageListener, selectedConversation, conversations]);

  // Set initial event from URL parameter if present
  useEffect(() => {
    if (urlEventId && events.length > 0) {
      // Convert to string for comparison
      const event = events.find((e) => String(e.id) === String(urlEventId));
      if (event) {
        console.log("Found event from URL:", event);
        setSelectedEvent(event);
      }
    }
  }, [urlEventId, events]);

  // Fetch conversations when an event is selected
  useEffect(() => {
    if (selectedEvent && user) {
      fetchConversations(selectedEvent.id);
      fetchMessageableUsers(selectedEvent.id);
    }
  }, [selectedEvent, user]);

  // Join/leave conversation room when a conversation is selected
  // Update the useEffect that handles conversation selection and message loading
  useEffect(() => {
    if (selectedConversation) {
      // Always fetch messages regardless of WebSocket connection status
      fetchMessages(selectedConversation.id);

      if (isConnected) {
        // Join the conversation via WebSocket
        joinConversation(selectedConversation.id);
        // Mark messages as read
        markMessagesAsRead(selectedConversation.id);
      }

      // If there's a URL attendee ID, auto select that conversation
      if (urlAttendeeId && conversations.length > 0) {
        const matchingConversation = conversations.find((conv) => {
          const otherParticipant = getOtherParticipant(conv);
          return (
            otherParticipant &&
            String(otherParticipant.id) === String(urlAttendeeId)
          );
        });

        if (
          matchingConversation &&
          matchingConversation.id !== selectedConversation.id
        ) {
          setSelectedConversation(matchingConversation);
        }
      }
    }

    // Clean up when changing conversations
    return () => {
      if (selectedConversation && isConnected) {
        leaveConversation(selectedConversation.id);
      }
    };
  }, [
    selectedConversation,
    isConnected,
    joinConversation,
    leaveConversation,
    markMessagesAsRead,
    urlAttendeeId,
    conversations,
  ]);

  useEffect(() => {
    if (loading.messages) {
      // If loading state is true for more than 15 seconds, reset it
      const timeout = setTimeout(() => {
        if (loading.messages) {
          console.log("Loading timeout - forcing reset");
          setLoading((prev) => ({ ...prev, messages: false }));
        }
      }, 15000);

      return () => clearTimeout(timeout);
    }
  }, [loading.messages]);

  useEffect(() => {
    console.log("Current messages:", messages);
    console.log("Loading state:", loading);
  }, [messages, loading]);

  // Additional check to verify messages for the selected conversation
  useEffect(() => {
    if (selectedConversation && messages.length === 0 && !loading.messages) {
      console.log(
        "No messages found for the selected conversation. Trying again..."
      );
      // Maybe the API call failed silently - try one more time after a delay
      const retryTimeout = setTimeout(() => {
        fetchMessages(selectedConversation.id);
      }, 1000);

      return () => clearTimeout(retryTimeout);
    }
  }, [selectedConversation, messages, loading.messages]);

  // Fetch user's event conversations
  const fetchConversations = async (eventId) => {
    try {
      setLoading((prev) => ({ ...prev, conversations: true }));

      const response = await api.get(
        `/conversation/event/${eventId}/user/${user.id}`
      );

      if (response.status === 200) {
        setConversations(response.data.data);

        // If there's a URL attendee ID, check if we need to create a new conversation
        if (
          urlAttendeeId &&
          !response.data.data.some((conv) =>
            conv.participants.some(
              (p) => String(p.user_id) === String(urlAttendeeId)
            )
          )
        ) {
          // Need to create a new conversation with this attendee
          startConversation(urlAttendeeId);
        }
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
      toast.error("Failed to load conversations");
    } finally {
      if (isMounted.current) {
        setLoading((prev) => ({ ...prev, conversations: false }));
      }
    }
  };

  // Fetch messageable users for the event
  const fetchMessageableUsers = async (eventId) => {
    try {
      setLoading((prev) => ({ ...prev, messageableUsers: true }));

      const response = await api.get(
        `/conversation/event/${eventId}/messageable-users/${user.id}`
      );

      if (response.status === 200) {
        setMessageableUsers(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching messageable users:", error);
    } finally {
      if (isMounted.current) {
        setLoading((prev) => ({ ...prev, messageableUsers: false }));
      }
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      // Set loading state
      setLoading((prev) => ({ ...prev, messages: true }));

      // Add a timeout to prevent infinite loading
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Request timeout")), 10000);
      });

      const response = await Promise.race([
        api.get(`/conversation/${conversationId}/messages?user_id=${user.id}`),
        timeoutPromise,
      ]);

      console.log("Message response:", response.data); // Debug response structure

      // More robust handling of response structure
      if (response.status === 200) {
        // Try to handle different response structures
        let messageData = [];
        if (response.data.data && Array.isArray(response.data.data.messages)) {
          messageData = response.data.data.messages;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          messageData = response.data.data;
        } else if (Array.isArray(response.data.messages)) {
          messageData = response.data.messages;
        } else if (Array.isArray(response.data)) {
          messageData = response.data;
        }

        console.log("Processed message data:", messageData); // Debug processed data
        setMessages(messageData);
      } else {
        throw new Error("Failed to fetch messages");
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to load messages");

      // Make sure we clear loading state on error
      setLoading((prev) => ({ ...prev, messages: false }));

      // For debugging only: display some placeholder messages instead of staying in loading
      setMessages([]); // At least exit loading state
    } finally {
      // Make sure loading is set to false
      setLoading((prev) => ({ ...prev, messages: false }));
    }
  };

  // Start a new conversation
  const startConversation = async (otherUserId) => {
    if (!selectedEvent) {
      toast.error("Please select an event first");
      return;
    }

    try {
      const response = await api.post("/conversation/create", {
        event_id: selectedEvent.id,
        participant_ids: [user.id, parseInt(otherUserId)],
      });

      if (response.status === 200) {
        // Add the new conversation to our list
        const newConversation = response.data.data;

        setConversations((prev) => {
          // Avoid duplicates
          if (prev.some((c) => c.id === newConversation.id)) {
            return prev;
          }
          return [...prev, newConversation];
        });

        // Select this new conversation
        setSelectedConversation(newConversation);
      } else {
        toast.error(response.data.message || "Failed to start conversation");
      }
    } catch (error) {
      console.error("Error starting conversation:", error);
      toast.error("Failed to start conversation");
    }
  };

  // Send a message using WebSocket
  const handleSendMessage = async (e) => {
    e.preventDefault();

    const trimmedMessage = message.trim();
    if (!trimmedMessage || !selectedConversation) return;

    setLoading((prev) => ({ ...prev, sendingMessage: true }));

    // Optimistically add message to UI
    const optimisticMessage = {
      id: `temp-${Date.now()}`,
      conversation_id: selectedConversation.id,
      sender_id: user.id,
      content: trimmedMessage,
      is_deleted: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      sender: {
        id: user.id,
        fullname: user.name,
        profile_picture: null,
      },
      _optimistic: true, // Flag for identifying optimistic updates
    };

    setMessages((prev) => [...prev, optimisticMessage]);
    setMessage(""); // Clear input

    try {
      if (isConnected) {
        // Send via WebSocket
        await sendMessage(selectedConversation.id, trimmedMessage);
      } else {
        // Fallback to REST API
        const response = await api.post("/conversation/message/send", {
          conversation_id: selectedConversation.id,
          sender_id: user.id,
          content: trimmedMessage,
        });

        if (response.status !== 201) {
          throw new Error("Failed to send message");
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");

      // Remove optimistic message on failure
      setMessages((prev) =>
        prev.filter((msg) => msg.id !== optimisticMessage.id)
      );
    } finally {
      if (isMounted.current) {
        setLoading((prev) => ({ ...prev, sendingMessage: false }));
      }
    }
  };

  // Handle input change with typing indicators
  const handleMessageInputChange = (e) => {
    setMessage(e.target.value);

    // Only send typing indicators when connected via WebSocket
    if (isConnected && selectedConversation) {
      handleTyping(selectedConversation.id, e.target.value.length > 0);
    }
  };

  // Get the other participant in a conversation
  const getOtherParticipant = (conversation) => {
    if (!conversation || !conversation.participants) return null;
    const otherParticipant = conversation.participants.find(
      (p) => p.user_id !== user.id
    );
    return otherParticipant?.user;
  };

  // Show typing indicator for selected conversation
  const showTypingIndicator = () => {
    if (!selectedConversation) return null;

    const typingUsers = getTypingUsers(selectedConversation.id) || [];
    if (typingUsers.length === 0) return null;

    // Get user names from participants
    const typingNames = typingUsers
      .map((userId) => {
        const participant = selectedConversation.participants.find(
          (p) => p.user_id === userId
        );
        return participant?.user?.fullname || "Someone";
      })
      .filter(Boolean);

    if (typingNames.length === 0) return null;

    return (
      <div className="text-xs text-gray-500 italic animate-pulse px-4 py-1">
        {typingNames.length === 1
          ? `${typingNames[0]} is typing...`
          : `${typingNames.length} people are typing...`}
      </div>
    );
  };

  // Display online status for a user
  const renderOnlineStatus = (userId) => {
    const online = isUserOnline(userId);

    return (
      <span
        className={`inline-flex items-center ${
          online ? "text-green-500" : "text-gray-400"
        }`}
      >
        <span
          className={`w-2 h-2 rounded-full ${
            online ? "bg-green-500" : "bg-gray-400"
          } mr-1`}
        ></span>
        {online ? "Online" : "Offline"}
      </span>
    );
  };

  // Filter events based on search term and user role
  const filteredEvents = events.filter((event) => {
    // Match search term
    const matchesSearch = event.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;

    // Filter by role
    if (user?.role === "organizer") {
      return String(event.user_id) === String(user.id);
    } else {
      // For attendees, show all events
      return true;
    }
  });

  console.log("Filtered events:", filteredEvents); // Debug

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-center" />
      <DashboardNavbar />
      <Sidebar userType={user?.role} />

      {/* Socket connection status indicator */}
      {!isConnected && (
        <div className="fixed top-20 right-4 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-md flex items-center text-sm shadow-md">
          <WifiOff size={16} className="mr-2" />
          Using basic chat mode
        </div>
      )}

      <div className="pl-24 pr-6 pt-6 pb-12">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Messages</h1>

          <div className="flex h-[calc(100vh-160px)] bg-white rounded-lg shadow">
            {/* Events Sidebar */}
            <div className="w-80 border-r border-gray-200 flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">
                  Your Events
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Connect with other attendees
                </p>
              </div>

              <div className="p-4">
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
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
                      selectedEvent?.id === event.id ? "bg-orange-50" : ""
                    }`}
                  >
                    <div className="flex items-center">
                      <img
                        src={
                          event.imageSrc ||
                          "http://localhost:8080/api/placeholder/80/80"
                        }
                        alt={event.title}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="ml-3 flex-1">
                        <h3 className="font-medium text-gray-800">
                          {event.title}
                        </h3>
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

                {filteredEvents.length === 0 && !loading.conversations && (
                  <div className="p-8 text-center text-gray-500">
                    <Users size={24} className="mx-auto mb-2 text-gray-400" />
                    <p>No events found</p>
                  </div>
                )}
                {loading.conversations && (
                  <div className="flex justify-center items-center py-8">
                    <Loader size={24} className="animate-spin text-gray-400" />
                  </div>
                )}
              </div>
            </div>

            {/* Conversations List */}
            <div className="w-80 border-r border-gray-200 flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <h2 className="font-semibold text-gray-800">
                  Chat with Attendees
                </h2>
                <p className="text-sm text-gray-500">
                  {selectedEvent
                    ? `${selectedEvent.soldTickets || 0} people attending`
                    : "Select an event"}
                </p>
              </div>

              <div className="p-4">
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="Search attendees..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-400"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto ">
                {/* Existing Conversations */}
                {conversations.map((conversation) => {
                  const otherUser = getOtherParticipant(conversation);
                  const lastMessage = conversation.messages?.[0];

                  return (
                    <div
                      key={conversation.id}
                      onClick={() => setSelectedConversation(conversation)}
                      className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                        selectedConversation?.id === conversation.id
                          ? "bg-orange-50"
                          : ""
                      }`}
                    >
                      <div className="flex items-center">
                        <div className="relative">
                          <img
                            src={
                              otherUser?.profile_picture ||
                              "http://localhost:8080/api/placeholder/40/40"
                            }
                            alt={otherUser?.fullname}
                            className="w-10 h-10 rounded-full"
                          />
                          {isUserOnline(otherUser?.id) && (
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                          )}
                        </div>
                        <div className="ml-3 flex-1">
                          <div className="flex justify-between items-center">
                            <h3 className="font-medium text-gray-800">
                              {otherUser?.fullname}
                            </h3>
                            {lastMessage && (
                              <span className="text-xs text-gray-500">
                                {new Date(
                                  lastMessage.created_at
                                ).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 truncate ">
                            {lastMessage?.content || "Start a conversation"}
                          </p>
                        </div>
                        {conversation.unread_count > 0 && (
                          <div className="w-5 h-5 bg-orange-400 rounded-full flex items-center justify-center ml-2">
                            <span className="text-xs text-white font-medium">
                              {conversation.unread_count}
                            </span>
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
                {messageableUsers
                  .filter((u) => !u.has_conversation)
                  .map((messageableUser) => (
                    <div
                      key={messageableUser.id}
                      onClick={() => startConversation(messageableUser.id)}
                      className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center">
                        <div className="relative">
                          <img
                            src={
                              messageableUser.profile_picture ||
                              "http://localhost:8080/api/placeholder/40/40"
                            }
                            alt={messageableUser.fullname}
                            className="w-10 h-10 rounded-full"
                          />
                        </div>
                        <div className="ml-3 flex-1">
                          <h3 className="font-medium text-gray-800">
                            {messageableUser.fullname}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Click to start messaging
                          </p>
                        </div>
                        <MessageCircle size={16} className="text-black" />
                      </div>
                    </div>
                  ))}

                {/* Loading state */}
                {loading.messageableUsers && (
                  <div className="flex justify-center items-center py-8">
                    <Loader size={24} className="animate-spin text-gray-400" />
                  </div>
                )}

                {/* Empty state */}
                {selectedEvent &&
                  conversations.length === 0 &&
                  messageableUsers.length === 0 &&
                  !loading.messageableUsers && (
                    <div className="p-4 text-center text-gray-500">
                      <Users size={24} className="mx-auto mb-2 text-gray-400" />
                      <p>No attendees with public profiles yet</p>
                    </div>
                  )}
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col text-gray-500">
              {selectedConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="h-16 px-6 flex items-center justify-between border-b border-gray-200">
                    <div className="flex items-center">
                      <img
                        src={
                          getOtherParticipant(selectedConversation)
                            ?.profile_picture ||
                          "http://localhost:8080/api/placeholder/40/40"
                        }
                        alt={
                          getOtherParticipant(selectedConversation)?.fullname
                        }
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="ml-3">
                        <h3 className="font-medium text-gray-800">
                          {getOtherParticipant(selectedConversation)?.fullname}
                        </h3>
                        <p className="text-sm text-gray-500 flex items-center">
                          {renderOnlineStatus(
                            getOtherParticipant(selectedConversation)?.id
                          )}
                          <span className="mx-2">•</span>
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
                    {loading.messages ? (
                      <div className="flex justify-center items-center py-8">
                        <Loader
                          size={24}
                          className="animate-spin text-gray-400"
                        />
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <MessageCircle
                          size={32}
                          className="mx-auto mb-2 text-gray-300"
                        />
                        <p>No messages yet</p>
                        <p className="text-sm">
                          Send a message to start the conversation!
                        </p>
                      </div>
                    ) : (
                      messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${
                            msg.sender_id === user.id
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-md px-4 py-2 rounded-2xl ${
                              msg.sender_id === user.id
                                ? "bg-orange-400 text-white"
                                : "bg-gray-100 text-gray-800"
                            } ${
                              msg._optimistic ? "opacity-70" : "opacity-100"
                            }`}
                          >
                            <p>{msg.content}</p>
                            <div
                              className={`flex items-center justify-end mt-1 space-x-1 ${
                                msg.sender_id === user.id
                                  ? "text-orange-100"
                                  : "text-gray-400"
                              }`}
                            >
                              <span className="text-xs">
                                {new Date(msg.created_at).toLocaleTimeString(
                                  [],
                                  { hour: "2-digit", minute: "2-digit" }
                                )}
                              </span>
                              {msg.sender_id === user.id &&
                                !msg._optimistic && <CheckCheck size={14} />}
                              {msg.sender_id === user.id && msg._optimistic && (
                                <Check size={14} />
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}

                    {/* Typing indicator */}
                    {showTypingIndicator()}

                    {/* Invisible div for scrolling to the bottom */}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-200">
                    <form
                      onSubmit={handleSendMessage}
                      className="flex items-center space-x-2"
                    >
                      <button
                        type="button"
                        className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                      >
                        <Paperclip size={20} />
                      </button>
                      <button
                        type="button"
                        className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                      >
                        <Image size={20} />
                      </button>
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          placeholder="Type a message..."
                          className="w-full pl-4 pr-10 py-2 border border-gray-200 rounded-full focus:outline-none focus:border-orange-400"
                          value={message}
                          onChange={handleMessageInputChange}
                          disabled={loading.sendingMessage}
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
                        disabled={!message.trim() || loading.sendingMessage}
                      >
                        {loading.sendingMessage ? (
                          <Loader size={20} className="animate-spin" />
                        ) : (
                          <Send size={20} />
                        )}
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
                      {selectedEvent
                        ? "Select a conversation"
                        : "Select an event"}
                    </h3>
                    <p className="text-gray-500 mt-1">
                      {selectedEvent
                        ? "Choose an attendee to start chatting"
                        : "Choose an event to see attendees you can message"}
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
