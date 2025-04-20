const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class AttendeeController {
  async registerAttendee(req, res) {
    const { user_id, event_id, ticket_id, comment } = req.body;

    if (!user_id || !event_id) {
      return res.status(400).json({
        message: "Missing required fields: user_id and event_id are required",
      });
    }

    try {
      // Check if user exists
      const userExists = await prisma.user.findUnique({
        where: { id: parseInt(user_id) },
      });

      if (!userExists) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if event exists
      const eventExists = await prisma.event.findUnique({
        where: { id: parseInt(event_id) },
      });

      if (!eventExists) {
        return res.status(404).json({ message: "Event not found" });
      }

      // Check if ticket exists if provided
      if (ticket_id) {
        const ticketExists = await prisma.ticket.findUnique({
          where: { id: parseInt(ticket_id) },
        });

        if (!ticketExists) {
          return res.status(404).json({ message: "Ticket not found" });
        }

        // Verify ticket belongs to the event
        if (ticketExists.event_id !== parseInt(event_id)) {
          return res.status(400).json({ 
            message: "Ticket does not belong to this event" 
          });
        }
      }

      // Check if user is already registered for this event
      const existingRegistration = await prisma.attendee.findFirst({
        where: {
          user_id: parseInt(user_id),
          event_id: parseInt(event_id),
        },
      });

      if (existingRegistration) {
        return res.status(400).json({ 
          message: "User already registered for this event" 
        });
      }

      const attendee = await prisma.attendee.create({
        data: {
          user_id: parseInt(user_id),
          event_id: parseInt(event_id),
          ticket_id: ticket_id ? parseInt(ticket_id) : null,
          comment,
        },
      });

      res.status(201).json({ 
        message: "Successfully registered for event", 
        data: attendee 
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ 
        message: "An error occurred while registering for event" 
      });
    }
  }

  async updateAttendee(req, res) {
    const { id } = req.params;
    const { ticket_id, comment } = req.body;

    try {
      const existingAttendee = await prisma.attendee.findUnique({
        where: { id: parseInt(id) },
        include: { event: true },
      });

      if (!existingAttendee) {
        return res.status(404).json({ message: "Attendee record not found" });
      }

      // Validate ticket if being updated
      if (ticket_id) {
        const ticketExists = await prisma.ticket.findUnique({
          where: { id: parseInt(ticket_id) },
        });

        if (!ticketExists) {
          return res.status(404).json({ message: "Ticket not found" });
        }

        // Verify ticket belongs to the same event
        if (ticketExists.event_id !== existingAttendee.event_id) {
          return res.status(400).json({ 
            message: "Ticket does not belong to this event" 
          });
        }
      }

      const updatedAttendee = await prisma.attendee.update({
        where: { id: parseInt(id) },
        data: {
          ticket_id: ticket_id ? parseInt(ticket_id) : existingAttendee.ticket_id,
          comment: comment || existingAttendee.comment,
        },
      });

      res.status(200).json({ 
        message: "Attendee record updated successfully",
        data: updatedAttendee,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ 
        message: "An error occurred while updating attendee record" 
      });
    }
  }

  async unregisterAttendee(req, res) {
    const { id } = req.params;

    try {
      const existingAttendee = await prisma.attendee.findUnique({
        where: { id: parseInt(id) },
      });

      if (!existingAttendee) {
        return res.status(404).json({ message: "Attendee record not found" });
      }

      await prisma.attendee.delete({
        where: { id: parseInt(id) },
      });

      res.status(200).json({ 
        message: "Successfully unregistered from event" 
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ 
        message: "An error occurred while unregistering from event" 
      });
    }
  }

  async getAttendeeById(req, res) {
    const { id } = req.params;

    try {
      const attendee = await prisma.attendee.findUnique({
        where: { id: parseInt(id) },
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
            },
          },
          event: true,
          ticket: true,
        },
      });

      if (!attendee) {
        return res.status(404).json({ message: "Attendee record not found" });
      }

      res.status(200).json({ 
        message: "Attendee record retrieved successfully",
        data: attendee,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ 
        message: "An error occurred while fetching attendee record" 
      });
    }
  }

  async getEventAttendees(req, res) {
    const { event_id } = req.params;

    try {
      const eventExists = await prisma.event.findUnique({
        where: { id: parseInt(event_id) },
      });

      if (!eventExists) {
        return res.status(404).json({ message: "Event not found" });
      }

      const attendees = await prisma.attendee.findMany({
        where: { event_id: parseInt(event_id) },
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
            },
          },
          ticket: true,
        },
        orderBy: {
          user: {
            fullName: 'asc',
          },
        },
      });

      res.status(200).json({ 
        message: "Event attendees retrieved successfully",
        data: attendees,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ 
        message: "An error occurred while fetching event attendees" 
      });
    }
  }

  async getUserAttendances(req, res) {
    const { user_id } = req.params;

    try {
      const userExists = await prisma.user.findUnique({
        where: { id: parseInt(user_id) },
      });

      if (!userExists) {
        return res.status(404).json({ message: "User not found" });
      }

      const attendances = await prisma.attendee.findMany({
        where: { user_id: parseInt(user_id) },
        include: {
          event: true,
          ticket: true,
        },
        orderBy: {
          event: {
            startDate: 'asc',
          },
        },
      });

      res.status(200).json({ 
        message: "User event attendances retrieved successfully",
        data: attendances,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ 
        message: "An error occurred while fetching user attendances" 
      });
    }
  }
}

module.exports = AttendeeController;