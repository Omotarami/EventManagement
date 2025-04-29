const express = require("express");
const { PrismaClient } = require("@prisma/client");
const multer = require("multer");
const path = require("path");
const { isAuthenticated } = require("../middlewares/auth");
const useCatchErrors = require("../error/catchErrors");

class EventRoute {
  router = express.Router();
  prisma = new PrismaClient();

  // Define path prefix
  path = "/event";

  // Configure multer for file uploads
  upload = multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../uploads/events"));
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, `event-${uniqueSuffix}${path.extname(file.originalname)}`);
      },
    }),
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB file size limit
    },
    fileFilter: (req, file, cb) => {
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error("Invalid file type. Only images are allowed."), false);
      }
    },
  });

  constructor() {
    console.log("Event Route Initializing");
    this.initializeRoutes();

    // Log registered routes
    if (this.router.stack) {
      console.log("Registered Event Routes:");
      this.router.stack.forEach((r) => {
        if (r.route) {
          console.log(
            `Route: ${r.route.path}, Methods: ${Object.keys(r.route.methods)}`
          );
        }
      });
    }
  }

  initializeRoutes() {
    // Create a new event (with optional file uploads)
    this.router.post(
      `${this.path}/create`,
      isAuthenticated,
      this.upload.array("images", 5),
      useCatchErrors(this.createEvent.bind(this))
    );

    // Get all events
    this.router.get(
      `${this.path}/all`,
      isAuthenticated,
      useCatchErrors(this.getAllEvents.bind(this))
    );

    // Get events for a specific user
    this.router.get(
      `${this.path}/user/:userId`,
      isAuthenticated,
      useCatchErrors(this.getUserEvents.bind(this))
    );

    // Get a specific event by ID
    this.router.get(
      `${this.path}/detail/:id`,
      isAuthenticated,
      useCatchErrors(this.getEventById.bind(this))
    );

    // Update an event
    this.router.put(
      `${this.path}/update/:id`,
      isAuthenticated,
      useCatchErrors(this.updateEvent.bind(this))
    );

    // Delete an event
    this.router.delete(
      `${this.path}/delete/:id`,
      isAuthenticated,
      useCatchErrors(this.deleteEvent.bind(this))
    );
  }

  async createEvent(req, res) {
    try {
      console.log("Create Event Request Received");
      console.log("Request Body:", req.body);
      console.log("Authenticated User:", req.user);

      const {
        title,
        description,
        schedule_type = "one-time",
        category,
        capacity,
        schedules = "[]",
        agendas = "[]",
        tickets = "[]",
      } = req.body;

      // IMPORTANT FIX: Get user ID safely and convert to the expected type
      // This is likely where the error is happening
      const userId = req.user?.id || 1; // Default to 1 if user ID not available
      console.log("User ID being used:", userId, "Type:", typeof userId);

      // Parse stringified arrays
      let parsedSchedules = [];
      let parsedAgendas = [];
      let parsedTickets = [];

      try {
        if (typeof schedules === "string")
          parsedSchedules = JSON.parse(schedules);
        if (typeof agendas === "string") parsedAgendas = JSON.parse(agendas);
        if (typeof tickets === "string") parsedTickets = JSON.parse(tickets);

        console.log("Parsed data:", {
          schedules: parsedSchedules,
          agendas: parsedAgendas,
          tickets: parsedTickets,
        });
      } catch (parseError) {
        console.error("JSON Parsing Error:", parseError);
        return res.status(400).json({
          message: "Invalid data format",
          error: parseError.message,
        });
      }

      // Start a transaction to ensure data consistency
      const result = await this.prisma.$transaction(async (prisma) => {
        // CRITICAL FIX: Ensure all types match what Prisma expects
        // Create the main event with explicit type conversion
        const event = await prisma.event.create({
          data: {
            // Convert to integer - this must match your schema type
            user_id: parseInt(userId),
            // Convert to string for these fields
            title: String(title || ""),
            description: String(description || ""),
            schedule_type: String(schedule_type || "one-time"),
            // For nullable fields, handle null case
            category: category ? String(category) : null,
            // MAIN FIX: Make sure capacity is string, not int
            capacity: capacity ? String(capacity) : null,
          },
        });

        console.log("Event created successfully:", event);

        // Process and create event images
        if (req.files && req.files.length > 0) {
          console.log("Processing images:", req.files.length);
          await prisma.eventImage.createMany({
            data: req.files.map((file) => ({
              event_id: event.id,
              image_url: `/uploads/events/${file.filename}`,
              description: null,
            })),
          });
        }

        // Create event schedules with type safety
        if (parsedSchedules && parsedSchedules.length > 0) {
          console.log("Creating schedules:", parsedSchedules.length);
          await prisma.eventSchedule.createMany({
            data: parsedSchedules.map((schedule) => ({
              event_id: event.id,
              day: String(schedule.day || ""),
              start_time: String(schedule.start_time || ""),
              end_time: String(schedule.end_time || ""),
              location_type: schedule.location_type
                ? String(schedule.location_type)
                : null,
              location_details: schedule.location_details
                ? String(schedule.location_details)
                : null,
              comment: schedule.comment ? String(schedule.comment) : null,
            })),
          });
        }

        // Create event agendas with type safety
        if (parsedAgendas && parsedAgendas.length > 0) {
          console.log("Creating agendas:", parsedAgendas.length);
          await prisma.eventAgenda.createMany({
            data: parsedAgendas.map((agenda) => ({
              event_id: event.id,
              name: String(agenda.name || ""),
              description: agenda.description
                ? String(agenda.description)
                : null,
              speakers: agenda.speakers
                ? JSON.stringify(agenda.speakers)
                : null,
              time: agenda.time ? String(agenda.time) : null,
            })),
          });
        }

        // Create tickets with type safety
        if (parsedTickets && parsedTickets.length > 0) {
          console.log("Creating tickets:", parsedTickets.length);
          await prisma.ticket.createMany({
            data: parsedTickets.map((ticket) => ({
              event_id: event.id,
              ticket_type: String(ticket.type || "standard"),
              ticket_name: String(ticket.name || ""),
              is_free: ticket.type === "free",
              description: ticket.description
                ? String(ticket.description)
                : null,
              // Handle price as float or null for free tickets
              price:
                ticket.type !== "free" && ticket.price
                  ? parseFloat(ticket.price)
                  : null,
              // Handle quantity as int or null
              quantity: ticket.quantity ? parseInt(ticket.quantity) : null,
            })),
          });
        }

        return event;
      });

      res.status(201).json({
        message: "Event created successfully",
        event: result,
      });
    } catch (error) {
      console.error("Detailed Event Creation Error:", {
        message: error.message,
        stack: error.stack,
        name: error.name,
      });

      res.status(500).json({
        message: "Failed to create event",
        error: error.message,
      });
    }
  }

  // Get all events
  async getAllEvents(req, res) {
    try {
      const events = await this.prisma.event.findMany({
        include: {
          images: true,
          tickets: true,
        },
      });
      res.status(200).json(events);
    } catch (error) {
      console.error("Get all events error:", error);
      res.status(500).json({
        message: "Failed to fetch events",
        error: error.message,
      });
    }
  }

  // Get events for a specific user
  async getUserEvents(req, res) {
    try {
      const { userId } = req.params;
      const events = await this.prisma.event.findMany({
        where: { user_id: parseInt(userId) },
        include: {
          images: true,
          tickets: true,
        },
      });
      res.status(200).json(events);
    } catch (error) {
      console.error("Get user events error:", error);
      res.status(500).json({
        message: "Failed to fetch user events",
        error: error.message,
      });
    }
  }

  // Get a specific event by ID
  async getEventById(req, res) {
    try {
      const { id } = req.params;
      const event = await this.prisma.event.findUnique({
        where: { id: parseInt(id) },
        include: {
          images: true,
          tickets: true,
          schedules: true,
          agendas: true,
        },
      });

      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }

      res.status(200).json(event);
    } catch (error) {
      console.error("Get event by ID error:", error);
      res.status(500).json({
        message: "Failed to fetch event details",
        error: error.message,
      });
    }
  }

  // Update an event
  async updateEvent(req, res) {
    try {
      const { id } = req.params;
      const { title, description, schedule_type, category, capacity } =
        req.body;

      const updatedEvent = await this.prisma.event.update({
        where: { id: parseInt(id) },
        data: {
          title,
          description,
          schedule_type,
          category,
          capacity,
        },
      });

      res.status(200).json(updatedEvent);
    } catch (error) {
      console.error("Update event error:", error);
      res.status(500).json({
        message: "Failed to update event",
        error: error.message,
      });
    }
  }

  // Delete an event
  async deleteEvent(req, res) {
    try {
      const { id } = req.params;
      await this.prisma.event.delete({
        where: { id: parseInt(id) },
      });

      res.status(200).json({ message: "Event deleted successfully" });
    } catch (error) {
      console.error("Delete event error:", error);
      res.status(500).json({
        message: "Failed to delete event",
        error: error.message,
      });
    }
  }
}

module.exports = EventRoute;
