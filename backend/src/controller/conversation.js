const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class ConversationController {
  // Create or get a conversation between two users for an event
  async createOrGetConversation(req, res) {
    const { event_id, participant_ids } = req.body;

    if (!event_id || !participant_ids || participant_ids.length !== 2) {
      return res.status(400).json({
        message: "Missing required fields: event_id and exactly 2 participant_ids are required",
      });
    }

    try {
      // Check if both users have purchased tickets for the event
      const attendees = await prisma.attendee.findMany({
        where: {
          event_id: parseInt(event_id),
          user_id: { in: participant_ids.map(id => parseInt(id)) },
          ticket_id: { not: null },
        },
      });

      if (attendees.length !== 2) {
        return res.status(403).json({
          message: "Both users must have tickets for this event to start a conversation",
        });
      }

      // Check if both users have public profiles
      const users = await prisma.user.findMany({
        where: {
          id: { in: participant_ids.map(id => parseInt(id)) },
          profile_visibility: "public",
        },
      });

      if (users.length !== 2) {
        return res.status(403).json({
          message: "Both users must have public profiles to start a conversation",
        });
      }

      // Check if conversation already exists between these users for this event
      let conversation = await prisma.conversation.findFirst({
        where: {
          event_id: parseInt(event_id),
          participants: {
            every: {
              user_id: { in: participant_ids.map(id => parseInt(id)) },
            },
          },
        },
        include: {
          participants: {
            include: {
              user: {
                select: {
                  id: true,
                  fullname: true,
                  profile_picture: true,
                },
              },
            },
          },
        },
      });

      // If not, create a new conversation
      if (!conversation) {
        conversation = await prisma.conversation.create({
          data: {
            event_id: parseInt(event_id),
            participants: {
              create: participant_ids.map(user_id => ({
                user_id: parseInt(user_id),
              })),
            },
          },
          include: {
            participants: {
              include: {
                user: {
                  select: {
                    id: true,
                    fullname: true,
                    profile_picture: true,
                  },
                },
              },
            },
          },
        });
      }

      res.status(200).json({
        message: "Conversation retrieved successfully",
        data: conversation,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "An error occurred while creating/retrieving conversation",
      });
    }
  }

  // Get all conversations for a user in a specific event
  async getEventConversations(req, res) {
    const { event_id, user_id } = req.params;

    try {
      // Verify user has a ticket for this event
      const attendee = await prisma.attendee.findFirst({
        where: {
          user_id: parseInt(user_id),
          event_id: parseInt(event_id),
          ticket_id: { not: null },
        },
      });

      if (!attendee) {
        return res.status(403).json({
          message: "You must have a ticket for this event to view conversations",
        });
      }

      const conversations = await prisma.conversation.findMany({
        where: {
          event_id: parseInt(event_id),
          participants: {
            some: {
              user_id: parseInt(user_id),
              is_active: true,
            },
          },
        },
        include: {
          participants: {
            include: {
              user: {
                select: {
                  id: true,
                  fullname: true,
                  profile_picture: true,
                },
              },
            },
          },
          messages: {
            orderBy: {
              created_at: 'desc',
            },
            take: 1, // Get the latest message
          },
        },
      });

      // Get unread count for each conversation
      const conversationsWithUnread = await Promise.all(
        conversations.map(async (conv) => {
          const participant = conv.participants.find(p => p.user_id === parseInt(user_id));
          const unreadCount = await prisma.message.count({
            where: {
              conversation_id: conv.id,
              sender_id: { not: parseInt(user_id) },
              created_at: {
                gt: participant.last_read_at || new Date(0),
              },
            },
          });
          return {
            ...conv,
            unread_count: unreadCount,
          };
        })
      );

      res.status(200).json({
        message: "Conversations retrieved successfully",
        data: conversationsWithUnread,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "An error occurred while fetching conversations",
      });
    }
  }

  // Get all users with tickets to an event that can be messaged
  async getMessageableUsers(req, res) {
    const { event_id, user_id } = req.params;

    try {
      // Get all users with tickets to this event (excluding current user)
      const attendees = await prisma.attendee.findMany({
        where: {
          event_id: parseInt(event_id),
          ticket_id: { not: null },
          user_id: { not: parseInt(user_id) },
          user: {
            profile_visibility: "public",
          },
        },
        include: {
          user: {
            select: {
              id: true,
              fullname: true,
              profile_picture: true,
              bio: true,
            },
          },
        },
      });

      // Get existing conversations to show whether a conversation exists
      const conversations = await prisma.conversation.findMany({
        where: {
          event_id: parseInt(event_id),
          participants: {
            some: {
              user_id: parseInt(user_id),
            },
          },
        },
        include: {
          participants: true,
        },
      });

      const usersWithConversationStatus = attendees.map(attendee => {
        const hasConversation = conversations.some(conv => 
          conv.participants.some(p => p.user_id === attendee.user_id)
        );
        return {
          ...attendee.user,
          has_conversation: hasConversation,
        };
      });

      res.status(200).json({
        message: "Messageable users retrieved successfully",
        data: usersWithConversationStatus,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "An error occurred while fetching messageable users",
      });
    }
  }

  // Leave a conversation (soft delete)
  async leaveConversation(req, res) {
    const { conversation_id } = req.params;
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({
        message: "Missing required field: user_id is required",
      });
    }

    try {
      const participant = await prisma.conversationParticipant.findFirst({
        where: {
          conversation_id: parseInt(conversation_id),
          user_id: parseInt(user_id),
        },
      });

      if (!participant) {
        return res.status(404).json({
          message: "You are not a participant in this conversation",
        });
      }

      // Deactivate participation
      await prisma.conversationParticipant.update({
        where: { id: participant.id },
        data: { is_active: false },
      });

      res.status(200).json({
        message: "Successfully left conversation",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "An error occurred while leaving conversation",
      });
    }
  }
}

module.exports = ConversationController;