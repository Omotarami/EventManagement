const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class EventController {    
   
    async createFullEvent(req, res) {
        const {
            // Main event details
            user_id,
            title,
            description,
            schedule_type = "one-time",
            schedule_details,
            capacity,
            category,

            // Optional associated data
            images = [],
            schedules = [],
            agendas = [],
            tickets = []
        } = req.body;

        // Validate required fields
        if (!user_id || !title || !description) {
            return res.status(400).json({ 
                error: "Missing required fields: user_id, title, and description are required" 
            });
        }

        try {
            // Start a transaction to ensure data consistency
            const result = await prisma.$transaction(async (prisma) => {
                // Create the main event
                const event = await prisma.event.create({
                    data: {
                        user_id,
                        title,
                        description,
                        schedule_type,
                        schedule_details,
                        capacity,
                        category
                    }
                });

                // Create associated images (if any)
                if (images.length > 0) {
                    await prisma.eventImage.createMany({
                        data: images.map(image => ({
                            event_id: event.id,
                            image_url: image.url,
                            description: image.description || null
                        }))
                    });
                }

                // Create event schedules (if any)
                if (schedules.length > 0) {
                    await prisma.eventSchedule.createMany({
                        data: schedules.map(schedule => ({
                            event_id: event.id,
                            day: schedule.day,
                            start_time: schedule.start_time,
                            end_time: schedule.end_time,
                            comment: schedule.comment || null,
                            location_type: schedule.location_type || null,
                            location_details: schedule.location_details || null
                        }))
                    });
                }

                // Create event agendas (if any)
                if (agendas.length > 0) {
                    await prisma.eventAgenda.createMany({
                        data: agendas.map(agenda => ({
                            event_id: event.id,
                            name: agenda.name,
                            description: agenda.description || null,
                            speakers: agenda.speakers ? JSON.stringify(agenda.speakers) : null,
                            time: agenda.time || null
                        }))
                    });
                }

                // Create tickets (if any)
                if (tickets.length > 0) {
                    await prisma.ticket.createMany({
                        data: tickets.map(ticket => ({
                            event_id: event.id,
                            ticket_type: ticket.type || 'standard',
                            ticket_name: ticket.name,
                            is_free: ticket.type === 'free',
                            description: ticket.description || null,
                            price: ticket.type === 'paid' ? parseFloat(ticket.price) : null,
                            quantity: parseInt(ticket.quantity) || null
                        }))
                    });
                }

                return event;
            });

            // Return the created event with a 201 status
            res.status(201).json({
                message: "Event created successfully",
                event: result
            });
        } catch (error) {
            console.error("Event creation error:", error);
            res.status(500).json({ 
                error: "An error occurred while creating the event",
                details: error.message 
            });
        }
    }

    // Existing methods remain the same (update, delete, get methods)
    async updateEvent(req, res) {
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
    }

    async deleteEvent(req, res) {
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
    }

    async getEventById(req, res) {
        try {
            const { id } = req.params;

            const event = await prisma.event.findUnique({
                where: { id: parseInt(id) },
                include: {
                    images: true,
                    schedules: true,
                    agendas: true,
                    tickets: true
                }
            });

            if (!event) {
                return res.status(404).json({ error: "Event not found" });
            }

            res.status(200).json(event);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "An error occurred while fetching the event" });
        }
    }

    async getEventsByUserId(req, res) {
        try {
            const { user_id } = req.params;

            const events = await prisma.event.findMany({
                where: { user_id: parseInt(user_id) },
                include: {
                    images: true,
                    tickets: true
                }
            });

            res.status(200).json(events);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "An error occurred while fetching events" });
        }
    }

    async getAllEvents(req, res) {
        try {
            const events = await prisma.event.findMany({
                include: {
                    images: true,
                    tickets: true
                }
            });

            res.status(200).json(events);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "An error occurred while fetching events" });
        }
    }
}

module.exports = EventController;