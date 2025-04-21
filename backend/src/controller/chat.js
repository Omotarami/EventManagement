const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class ChatController {
  // Create or get a chat room for an event
  async createOrGetChatRoom(req, res) {
    const { event_id } = req.body;

    if (!event_id) {
      return res.status(400).json({
        message: "Missing required field: event_id is required",
      });
    }

    try {
      // Check if event exists
      const event = await prisma.event.findUnique({
        where: { id: parseInt(event_id) },
      });

      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }

      // Check if chat room already exists for this event
      let chatRoom = await prisma.chatRoom.findUnique({
        where: { event_id: parseInt(event_id) },
      });

      // If not, create a new chat room
      if (!chatRoom) {
        chatRoom = await prisma.chatRoom.create({
          data: {
            event_id: parseInt(event_id),
            name: `Chat for ${event.title}`,
          },
        });
      }

      res.status(200).json({
        message: "Chat room retrieved successfully",
        data: chatRoom,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "An error occurred while creating/retrieving chat room",
      });
    }
  }

  // Join a chat room (must have purchased a ticket)
  async joinChatRoom(req, res) {
    const { chat_room_id } = req.params;
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({
        message: "Missing required field: user_id is required",
      });
    }

    try {
      // Check if chat room exists
      const chatRoom = await prisma.chatRoom.findUnique({
        where: { id: parseInt(chat_room_id) },
        include: { event: true },
      });

      if (!chatRoom) {
        return res.status(404).json({ message: "Chat room not found" });
      }

      // Check if user has purchased a ticket for this event
      const attendee = await prisma.attendee.findFirst({
        where: {
          user_id: parseInt(user_id),
          event_id: chatRoom.event_id,
          ticket_id: { not: null }, // Must have a ticket
        },
      });

      if (!attendee) {
        return res.status(403).json({
          message: "You must purchase a ticket to join this chat room",
        });
      }

      // Check if user is already a participant
      let participant = await prisma.chatParticipant.findFirst({
        where: {
          chat_room_id: parseInt(chat_room_id),
          user_id: parseInt(user_id),
        },
      });

      if (!participant) {
        // Add user as a chat participant
        participant = await prisma.chatParticipant.create({
          data: {
            chat_room_id: parseInt(chat_room_id),
            user_id: parseInt(user_id),
          },
        });
      } else if (!participant.is_active) {
        // Reactivate participation if previously deactivated
        participant = await prisma.chatParticipant.update({
          where: { id: participant.id },
          data: { is_active: true },
        });
      }

      res.status(200).json({
        message: "Successfully joined chat room",
        data: participant,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "An error occurred while joining chat room",
      });
    }
  }

  // Leave a chat room
  async leaveChatRoom(req, res) {
    const { chat_room_id } = req.params;
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({
        message: "Missing required field: user_id is required",
      });
    }

    try {
      const participant = await prisma.chatParticipant.findFirst({
        where: {
          chat_room_id: parseInt(chat_room_id),
          user_id: parseInt(user_id),
        },
      });

      if (!participant) {
        return res.status(404).json({
          message: "You are not a participant in this chat room",
        });
      }

      // Deactivate participation
      await prisma.chatParticipant.update({
        where: { id: participant.id },
        data: { is_active: false },
      });

      res.status(200).json({
        message: "Successfully left chat room",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "An error occurred while leaving chat room",
      });
    }
  }

  // Get chat room participants (only public profiles)
  async getChatParticipants(req, res) {
    const { chat_room_id } = req.params;

    try {
      const participants = await prisma.chatParticipant.findMany({
        where: {
          chat_room_id: parseInt(chat_room_id),
          is_active: true,
          user: {
            profile_visibility: "public", // Only show public profiles
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

      res.status(200).json({
        message: "Chat participants retrieved successfully",
        data: participants,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "An error occurred while fetching chat participants",
      });
    }
  }

  // Get chat rooms for a user
  async getUserChatRooms(req, res) {
    const { user_id } = req.params;

    try {
      const chatRooms = await prisma.chatParticipant.findMany({
        where: {
          user_id: parseInt(user_id),
          is_active: true,
        },
        include: {
          chatRoom: {
            include: {
              event: {
                select: {
                  id: true,
                  title: true,
                },
              },
            },
          },
        },
      });

      res.status(200).json({
        message: "User chat rooms retrieved successfully",
        data: chatRooms,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "An error occurred while fetching user chat rooms",
      });
    }
  }
}

module.exports = ChatController;