const express = require("express");
const ChatController = require("../controller/chat");
const MessageController = require("../controller/message");
const useCatchErrors = require("../error/catchErrors");

class ChatRoute {
  router = express.Router();
  chatController = new ChatController();
  messageController = new MessageController();
  path = "/chat";

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    // Chat room routes
    this.router.post(
      `${this.path}/room/create`,
      useCatchErrors(this.chatController.createOrGetChatRoom.bind(this.chatController))
    );

    this.router.post(
      `${this.path}/room/:chat_room_id/join`,
      useCatchErrors(this.chatController.joinChatRoom.bind(this.chatController))
    );

    this.router.post(
      `${this.path}/room/:chat_room_id/leave`,
      useCatchErrors(this.chatController.leaveChatRoom.bind(this.chatController))
    );

    this.router.get(
      `${this.path}/room/:chat_room_id/participants`,
      useCatchErrors(this.chatController.getChatParticipants.bind(this.chatController))
    );

    this.router.get(
      `${this.path}/user/:user_id/rooms`,
      useCatchErrors(this.chatController.getUserChatRooms.bind(this.chatController))
    );

    // Message routes
    this.router.post(
      `${this.path}/message/send`,
      useCatchErrors(this.messageController.sendMessage.bind(this.messageController))
    );

    this.router.get(
      `${this.path}/room/:chat_room_id/messages`,
      useCatchErrors(this.messageController.getChatMessages.bind(this.messageController))
    );

    this.router.delete(
      `${this.path}/message/:id`,
      useCatchErrors(this.messageController.deleteMessage.bind(this.messageController))
    );

    this.router.post(
      `${this.path}/room/:chat_room_id/mark-read`,
      useCatchErrors(this.messageController.markMessagesAsRead.bind(this.messageController))
    );

    this.router.get(
      `${this.path}/room/:chat_room_id/unread/:user_id`,
      useCatchErrors(this.messageController.getUnreadCount.bind(this.messageController))
    );
  }
}

module.exports = ChatRoute;