import React, { useState } from 'react';
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
  CheckCheck
} from 'lucide-react';

const EventMessagingUI = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  
  const events = [
    {
      id: 1,
      title: "Tech Conference 2025",
      date: "Apr 25, 2025",
      attendees: 48,
      unreadMessages: 5,
      image: "/api/placeholder/80/80"
    },
    {
      id: 2,
      title: "AI Workshop",
      date: "May 10, 2025",
      attendees: 32,
      unreadMessages: 0,
      image: "/api/placeholder/80/80"
    },
    {
      id: 3,
      title: "Developer Meetup",
      date: "May 15, 2025",
      attendees: 25,
      unreadMessages: 2,
      image: "/api/placeholder/80/80"
    }
  ];

  const conversations = [
    {
      id: 1,
      name: "Sarah Johnson",
      avatar: "/api/placeholder/40/40",
      lastMessage: "Hi, are you attending the session on AI?",
      timestamp: "10:30 AM",
      unread: 2,
      online: true
    },
    {
      id: 2,
      name: "Michael Chen",
      avatar: "/api/placeholder/40/40",
      lastMessage: "Let's meet at the networking area",
      timestamp: "9:45 AM",
      unread: 0,
      online: false
    },
    {
      id: 3,
      name: "Emma Davis",
      avatar: "/api/placeholder/40/40",
      lastMessage: "Thank you for the information!",
      timestamp: "Yesterday",
      unread: 0,
      online: true
    }
  ];

  const messages = [
    {
      id: 1,
      sender: "Sarah Johnson",
      content: "Hi, are you attending the session on AI?",
      timestamp: "10:28 AM",
      isSender: false,
      status: "read"
    },
    {
      id: 2,
      sender: "You",
      content: "Hi Sarah! Yes, I'll be there. It starts at 2 PM, right?",
      timestamp: "10:29 AM",
      isSender: true,
      status: "read"
    },
    {
      id: 3,
      sender: "Sarah Johnson",
      content: "That's right! I'm really excited about the keynote speaker.",
      timestamp: "10:30 AM",
      isSender: false,
      status: "read"
    }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Events Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800">Messages</h1>
          <p className="text-sm text-gray-500 mt-1">Connect with other attendees</p>
        </div>

        {/* Event Selector */}
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search events..."
              className="w-full pl-10 pr-4 py-2 border text-black border-gray-200 rounded-lg focus:outline-none focus:border-orange-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Event List */}
        <div className="flex-1 overflow-y-auto">
          {events.map((event) => (
            <div
              key={event.id}
              onClick={() => setSelectedEvent(event)}
              className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                selectedEvent?.id === event.id ? 'bg-orange-50' : ''
              }`}
            >
              <div className="flex items-center">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="ml-3 flex-1">
                  <h3 className="font-medium text-gray-800">{event.title}</h3>
                  <div className="flex items-center mt-1">
                    <Calendar size={14} className="text-gray-400 mr-1" />
                    <span className="text-sm text-gray-500">{event.date}</span>
                    <span className="mx-2 text-gray-300">•</span>
                    <Users size={14} className="text-gray-400 mr-1" />
                    <span className="text-sm text-gray-500">{event.attendees}</span>
                  </div>
                </div>
                {event.unreadMessages > 0 && (
                  <div className="w-5 h-5 bg-orange-400 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-medium">{event.unreadMessages}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Conversations List */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-800">Event Attendees</h2>
          <p className="text-sm text-gray-500">
            {selectedEvent ? `${selectedEvent.attendees} people attending` : 'Select an event'}
          </p>
        </div>

        {/* Search Attendees */}
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search attendees..."
              className="w-full pl-10 pr-4 py-2 text-black border border-gray-200 rounded-lg focus:outline-none focus:border-orange-400"
            />
          </div>
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto">
          {conversations.map((conversation) => (
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
                    src={conversation.avatar}
                    alt={conversation.name}
                    className="w-10 h-10 rounded-full"
                  />
                  {conversation.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className="ml-3 flex-1">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-gray-800">{conversation.name}</h3>
                    <span className="text-xs text-gray-500">{conversation.timestamp}</span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">{conversation.lastMessage}</p>
                </div>
                {conversation.unread > 0 && (
                  <div className="w-5 h-5 bg-orange-400 rounded-full flex items-center justify-center ml-2">
                    <span className="text-xs text-white font-medium">{conversation.unread}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="h-16 px-6 flex items-center justify-between border-b border-gray-200">
              <div className="flex items-center">
                <img
                  src={selectedConversation.avatar}
                  alt={selectedConversation.name}
                  className="w-10 h-10 rounded-full"
                />
                <div className="ml-3">
                  <h3 className="font-medium text-gray-800">{selectedConversation.name}</h3>
                  <p className="text-sm text-gray-500">
                    {selectedConversation.online ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>
              <button className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
                <MoreHorizontal size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.isSender ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-md px-4 py-2 rounded-2xl ${
                      msg.isSender
                        ? 'bg-orange-400 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <p>{msg.content}</p>
                    <div className={`flex items-center justify-end mt-1 space-x-1 ${
                      msg.isSender ? 'text-orange-100' : 'text-gray-400'
                    }`}>
                      <span className="text-xs">{msg.timestamp}</span>
                      {msg.isSender && msg.status === 'read' && (
                        <CheckCheck size={14} />
                      )}
                      {msg.isSender && msg.status === 'delivered' && (
                        <Check size={14} />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
                  <Paperclip size={20} />
                </button>
                <button className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
                  <Image size={20} />
                </button>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="w-full pl-4 pr-10 py-2 border text-black border-gray-200 rounded-full focus:outline-none focus:border-orange-400"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700">
                    <Smile size={20} />
                  </button>
                </div>
                <button className="p-2 bg-orange-400 text-white rounded-full hover:bg-orange-500">
                  <Send size={20} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-800">Select a conversation</h3>
              <p className="text-gray-500 mt-1">Choose an attendee to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventMessagingUI;