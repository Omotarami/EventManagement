const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class TicketController {
    
    // Get all tickets for an event
    async getEventTickets(req, res) {
        try {
            const { event_id } = req.params;
            
            if (!event_id) {
                return res.status(400).json({ 
                    error: "Missing required parameter: event_id" 
                });
            }
            
            // Get tickets for this event
            const tickets = await prisma.ticket.findMany({
                where: { 
                    event_id: parseInt(event_id) 
                }
            });
            
            // For each ticket, calculate sold count from OrderItems
            const ticketsWithStats = await Promise.all(
                tickets.map(async (ticket) => {
                    // Count sold tickets from order items
                    const orderItems = await prisma.orderItem.findMany({
                        where: {
                            ticket_id: ticket.id,
                            order: {
                                status: "completed"
                            }
                        }
                    });
                    
                    // Calculate total quantity sold
                    const soldQuantity = orderItems.reduce((total, item) => 
                        total + item.quantity, 0);
                    
                    // Return ticket with additional stats
                    return {
                        ...ticket,
                        sold: soldQuantity,
                        available: ticket.quantity !== null 
                            ? ticket.quantity - soldQuantity 
                            : null  // null means unlimited
                    };
                })
            );
            
            res.status(200).json({
                message: "Tickets retrieved successfully",
                data: ticketsWithStats
            });
            
        } catch (error) {
            console.error("Error getting event tickets:", error);
            res.status(500).json({ 
                error: "An error occurred while retrieving event tickets",
                details: error.message 
            });
        }
    }
    
    // Purchase a ticket for an event
    async purchaseTicket(req, res) {
        try {
            const { 
                event_id, 
                user_id, 
                ticket_id, 
                quantity = 1 
            } = req.body;
            
            // Validate required fields
            if (!event_id || !user_id || !ticket_id) {
                return res.status(400).json({ 
                    error: "Missing required fields: event_id, user_id, and ticket_id are required" 
                });
            }
            
            // Check if ticket exists
            const ticket = await prisma.ticket.findUnique({
                where: { id: parseInt(ticket_id) },
                include: { event: true }
            });
            
            if (!ticket) {
                return res.status(404).json({ error: "Ticket not found" });
            }
            
            // Check if there are enough tickets available
            if (ticket.quantity !== null) {
                const orderItems = await prisma.orderItem.findMany({
                    where: {
                        ticket_id: ticket.id,
                        order: {
                            status: "completed"
                        }
                    }
                });
                
                const soldQuantity = orderItems.reduce((total, item) => 
                    total + item.quantity, 0);
                
                if (soldQuantity + quantity > ticket.quantity) {
                    return res.status(400).json({ 
                        error: `Not enough tickets available. Only ${ticket.quantity - soldQuantity} remaining.` 
                    });
                }
            }
            
            // Create transaction for purchase
            const transaction = await prisma.$transaction(async (prisma) => {
                // Generate order number
                const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
                
                // Calculate total price
                const unitPrice = ticket.price || 0;
                const totalPrice = unitPrice * quantity;
                
                // Create order
                const order = await prisma.order.create({
                    data: {
                        user_id: parseInt(user_id),
                        event_id: parseInt(event_id),
                        order_number: orderNumber,
                        total_price: totalPrice,
                        status: "completed"
                    }
                });
                
                // Create order item
                const orderItem = await prisma.orderItem.create({
                    data: {
                        order_id: order.id,
                        ticket_id: parseInt(ticket_id),
                        quantity: quantity,
                        unit_price: unitPrice,
                        total_price: totalPrice
                    }
                });
                
                // Create or update attendee record
                let attendee = await prisma.attendee.findFirst({
                    where: {
                        user_id: parseInt(user_id),
                        event_id: parseInt(event_id)
                    }
                });
                
                if (!attendee) {
                    attendee = await prisma.attendee.create({
                        data: {
                            user_id: parseInt(user_id),
                            event_id: parseInt(event_id),
                            ticket_id: parseInt(ticket_id)
                        }
                    });
                } else {
                    attendee = await prisma.attendee.update({
                        where: { id: attendee.id },
                        data: { ticket_id: parseInt(ticket_id) }
                    });
                }
                
                return { order, orderItem, attendee };
            });
            
            res.status(201).json({
                message: "Ticket purchased successfully",
                data: {
                    order_id: transaction.order.id,
                    order_number: transaction.order.order_number,
                    ticket_type: ticket.ticket_name,
                    ticket_id: ticket.id,
                    event_id: ticket.event_id,
                    event_title: ticket.event.title,
                    quantity: transaction.orderItem.quantity,
                    unit_price: transaction.orderItem.unit_price,
                    total_price: transaction.orderItem.total_price,
                    purchase_date: transaction.order.id, // Using the created timestamp
                    check_in_status: "not-checked-in"
                }
            });
            
        } catch (error) {
            console.error("Error purchasing ticket:", error);
            res.status(500).json({ 
                error: "An error occurred while purchasing ticket",
                details: error.message 
            });
        }
    }
    
    // Get tickets for a user
    async getUserTickets(req, res) {
        try {
            const { user_id } = req.params;
            
            if (!user_id) {
                return res.status(400).json({ 
                    error: "Missing required parameter: user_id" 
                });
            }
            
            // Get all orders for user
            const orders = await prisma.order.findMany({
                where: {
                    user_id: parseInt(user_id),
                    status: "completed"
                },
                include: {
                    event: {
                        include: {
                            images: true,
                        }
                    },
                    orderItems: {
                        include: {
                            ticket: true
                        }
                    }
                },
                orderBy: {
                    id: 'desc'
                }
            });
            
            // Format the data for the frontend
            const tickets = orders.flatMap(order => {
                return order.orderItems.map(item => {
                    return {
                        id: `${order.id}-${item.id}`,
                        orderId: order.order_number,
                        eventId: order.event_id,
                        eventTitle: order.event.title,
                        eventImage: order.event.images && order.event.images.length > 0 
                            ? order.event.images[0].image_url
                            : null,
                        userId: order.user_id,
                        ticketId: item.ticket_id,
                        ticketType: item.ticket.ticket_name,
                        price: item.unit_price,
                        quantity: item.quantity,
                        totalAmount: item.total_price,
                        purchaseDate: new Date(order.id).toISOString(), // Using order ID as timestamp
                        checkInStatus: "not-checked-in" // Default status
                    };
                });
            });
            
            res.status(200).json({
                message: "User tickets retrieved successfully",
                data: tickets
            });
            
        } catch (error) {
            console.error("Error getting user tickets:", error);
            res.status(500).json({ 
                error: "An error occurred while retrieving user tickets",
                details: error.message 
            });
        }
    }
    
    // Get attendees for an event
    async getEventAttendees(req, res) {
        try {
            const { event_id } = req.params;
            
            if (!event_id) {
                return res.status(400).json({ 
                    error: "Missing required parameter: event_id" 
                });
            }
            
            // Get all attendees for this event
            const attendees = await prisma.attendee.findMany({
                where: {
                    event_id: parseInt(event_id)
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            fullname: true,
                            email: true,
                            profile_picture: true
                        }
                    },
                    ticket: true
                }
            });
            
            const formattedAttendees = attendees.map(attendee => ({
                id: attendee.id,
                userId: attendee.user_id,
                name: attendee.user.fullname,
                email: attendee.user.email,
                profilePicture: attendee.user.profile_picture,
                ticketId: attendee.ticket_id,
                ticketType: attendee.ticket?.ticket_name || "Unknown Ticket",
                ticketPrice: attendee.ticket?.price || 0,
                checkInStatus: attendee.comment === "checked-in" ? "checked-in" : "not-checked-in"
            }));
            
            res.status(200).json({
                message: "Event attendees retrieved successfully",
                data: formattedAttendees
            });
            
        } catch (error) {
            console.error("Error getting event attendees:", error);
            res.status(500).json({ 
                error: "An error occurred while retrieving event attendees",
                details: error.message 
            });
        }
    }
    
    // Check in an attendee
    async checkInAttendee(req, res) {
        try {
            const { attendee_id } = req.params;
            const { check_in = true } = req.body;
            
            if (!attendee_id) {
                return res.status(400).json({ 
                    error: "Missing required parameter: attendee_id" 
                });
            }
            
            // Update the attendee record
            const attendee = await prisma.attendee.update({
                where: { id: parseInt(attendee_id) },
                data: {
                    comment: check_in ? "checked-in" : null
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            fullname: true,
                            email: true
                        }
                    },
                    event: {
                        select: {
                            id: true,
                            title: true
                        }
                    },
                    ticket: true
                }
            });
            
            res.status(200).json({
                message: check_in ? "Attendee checked in successfully" : "Attendee check-in reverted",
                data: {
                    attendeeId: attendee.id,
                    userId: attendee.user_id,
                    userName: attendee.user.fullname,
                    userEmail: attendee.user.email,
                    eventId: attendee.event_id,
                    eventTitle: attendee.event.title,
                    ticketType: attendee.ticket?.ticket_name || "Unknown Ticket",
                    checkInStatus: check_in ? "checked-in" : "not-checked-in",
                    checkInTime: check_in ? new Date().toISOString() : null
                }
            });
            
        } catch (error) {
            console.error("Error checking in attendee:", error);
            res.status(500).json({ 
                error: "An error occurred while checking in attendee",
                details: error.message 
            });
        }
    }
}

module.exports = TicketController;