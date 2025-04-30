const express = require("express");
const ConversationController = require("../controller/conversation");
const MessageController = require("../controller/message");
const useCatchErrors = require("../error/catchErrors");

class ConversationRoute {
  router = express.Router();
  conversationController = new ConversationController();
  messageController = new MessageController();
  path = "/conversation";

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    // Conversation routes
    this.router.post(
      `${this.path}/create`,
      useCatchErrors(this.conversationController.createOrGetConversation.bind(this.conversationController))
    );

    this.router.get(
      `${this.path}/event/:event_id/user/:user_id`,
      useCatchErrors(this.conversationController.getEventConversations.bind(this.conversationController))
    );

    this.router.get(
      `${this.path}/event/:event_id/messageable-users/:user_id`,
      useCatchErrors(this.conversationController.getMessageableUsers.bind(this.conversationController))
    );

    this.router.post(
      `${this.path}/:conversation_id/leave`,
      useCatchErrors(this.conversationController.leaveConversation.bind(this.conversationController))
    );

    // Message routes
    this.router.post(
      `${this.path}/message/send`,
      useCatchErrors(this.messageController.sendMessage.bind(this.messageController))
    );

    this.router.get(
      `${this.path}/:conversation_id/messages`,
      useCatchErrors(this.messageController.getConversationMessages.bind(this.messageController))
    );

    this.router.delete(
      `${this.path}/message/:id`,
      useCatchErrors(this.messageController.deleteMessage.bind(this.messageController))
    );

    this.router.post(
      `${this.path}/:conversation_id/mark-read`,
      useCatchErrors(this.messageController.markMessagesAsRead.bind(this.messageController))
    );

    this.router.get(
      `${this.path}/:conversation_id/unread/:user_id`,
      useCatchErrors(this.messageController.getUnreadCount.bind(this.messageController))
    );
  }
}

module.exports = ConversationRoute;