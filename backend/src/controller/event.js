const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

class EventController {    
    // Create a new event
    async createEvent (req, res) {
        try {
            const {
                user_id,
                title,
                description,
                schedule_type = "one-time",
                schedule_details,
                capacity,
                category
            } = req.body;
    
            // Validate required fields
            if (!user_id || !title || !description) {
                return res.status(400).json({ error: "Missing required fields: user_id, title, and description are required" });
            }
    
            // Create the event in the database
            const event = await prisma.event.create({
                data: {
                    user_id,
                    title,
                    description,
                    schedule_type,
                    schedule_details,
                    capacity,
                    category
                },
            });
            // Return the created event
            res.status(201).json(event);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "An error occurred while creating the event" });
        }
    };
    
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