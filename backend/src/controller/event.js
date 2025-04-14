const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Controller function to create an event
const createEvent = async (req, res) => {
    try {
        const {
            title,
            description,
            shortDescription,
            organizerId,
            categoryId,
            startDate,
            endDate,
            timezone = "UTC",
            isVirtual = false,
            locationName,
            address,
            city,
            state,
            country,
            postalCode,
            latitude,
            longitude,
            virtualMeetingLink,
            virtualMeetingPassword,
            bannerImage,
            featuredImage,
            capacity,
        } = req.body;

        // Validate required fields
        if (!title || !organizerId || !startDate || !endDate) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Create the event in the database
        const event = await prisma.event.create({
            data: {
                title,
                description,
                shortDescription,
                organizerId,
                categoryId,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                timezone,
                isVirtual,
                locationName,
                address,
                city,
                state,
                country,
                postalCode,
                latitude,
                longitude,
                virtualMeetingLink,
                virtualMeetingPassword,
                bannerImage,
                featuredImage,
                capacity,
            },
        });

        // Return the created event
        res.status(201).json(event);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while creating the event" });
    }
};

module.exports = { createEvent };