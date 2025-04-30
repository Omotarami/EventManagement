const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

class EventController {    
    // Create a new event
    async createEvent(req, res) {
        try {
          console.log('Create Event Request Received');
          console.log('Request Body:', req.body);
          
          const {
            title,
            description,
            schedule_type = "one-time",
            category,
            capacity,
            schedules = '[]',
            agendas = '[]',
            tickets = '[]'
          } = req.body;
      
          // Explicitly handle types
          const eventData = {
            user_id: req.user.id,
            title: String(title || ''),
            description: String(description || ''),
            schedule_type: String(schedule_type || 'one-time'),
            category: category ? String(category) : null,
            capacity: capacity ? String(capacity) : null
          };
      
          console.log('Prepared Event Data:', eventData);
      
          // Parse JSON strings properly
          let parsedSchedules = [];
          let parsedAgendas = [];
          let parsedTickets = [];
      
          try {
            if (schedules && typeof schedules === 'string') {
              parsedSchedules = JSON.parse(schedules);
            }
            
            if (agendas && typeof agendas === 'string') {
              parsedAgendas = JSON.parse(agendas);
            }
            
            if (tickets && typeof tickets === 'string') {
              parsedTickets = JSON.parse(tickets);
            }
          } catch (parseError) {
            console.error('JSON Parsing Error:', parseError);
            return res.status(400).json({
              message: 'Invalid data format',
              error: parseError.message
            });
          }
      
          // Start transaction with explicit type handling
          const result = await this.prisma.$transaction(async (prisma) => {
            // Create the main event with properly typed data
            const event = await prisma.event.create({
              data: eventData
            });
      
            // Process additional data...
            return event;
          });
      
          res.status(201).json({
            message: "Event created successfully",
            event: result
          });
        } catch (error) {
          console.error("Detailed Event Creation Error:", {
            message: error.message,
            stack: error.stack
          });
      
          res.status(500).json({ 
            message: "Failed to create event",
            error: error.message
          });
        }
      }
    
    // Update an existing event
    async updateEvent (req, res) {
        try {
            const { id } = req.params;
            const {
                title,
                description,
                schedule_type,
                schedule_details,
                capacity,
                category
            } = req.body;
    
            // Check if event exists
            const existingEvent = await prisma.event.findUnique({
                where: { id: parseInt(id) }
            });
    
            if (!existingEvent) {
                return res.status(404).json({ error: "Event not found" });
            }
    
            // Update the event
            const updatedEvent = await prisma.event.update({
                where: { id: parseInt(id) },
                data: {
                    title,
                    description,
                    schedule_type,
                    schedule_details,
                    capacity,
                    category
                },
            });
    
            res.status(200).json(updatedEvent);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "An error occurred while updating the event" });
        }
    };
    
    // Delete an event
    async deleteEvent (req, res) {
        try {
            const { id } = req.params;
    
            // Check if event exists
            const existingEvent = await prisma.event.findUnique({
                where: { id: parseInt(id) }
            });
    
            if (!existingEvent) {
                return res.status(404).json({ error: "Event not found" });
            }
    
            // Delete the event
            await prisma.event.delete({
                where: { id: parseInt(id) }
            });
    
            res.status(200).json({ message: "Event deleted successfully" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "An error occurred while deleting the event" });
        }
    };
    
    // Get a single event by ID
    async getEventById (req, res) {
        try {
            const { id } = req.params;
    
            const event = await prisma.event.findUnique({
                where: { id: parseInt(id) }
            });
    
            if (!event) {
                return res.status(404).json({ error: "Event not found" });
            }
    
            res.status(200).json(event);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "An error occurred while fetching the event" });
        }
    };
    
    // Get all events for a specific user
    async getEventsByUserId (req, res) {
        try {
            const { user_id } = req.params;
    
            const events = await prisma.event.findMany({
                where: { user_id: parseInt(user_id) }
            });
    
            res.status(200).json(events);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "An error occurred while fetching events" });
        }
    };
    
    // Get all events
    async getAllEvents (req, res) {
        try {
            const events = await prisma.event.findMany();
    
            res.status(200).json(events);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "An error occurred while fetching events" });
        }
    };
}

module.exports = EventController;