const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');
const ENV = require('../config/env');
const logger = require('../config/logger');

/**
 * Verifies that a user has a ticket for an event
 * @param {number} userId - The user's ID
 * @param {number} eventId - The event's ID
 * @returns {Promise<boolean>} - Whether the user has a ticket
 */
async function verifyTicketOwnership(userId, eventId) {
  try {
    const attendee = await prisma.attendee.findFirst({
      where: {
        user_id: parseInt(userId),
        event_id: parseInt(eventId),
      },
    });
    
    return !!attendee;
  } catch (error) {
    logger.error(`Error verifying ticket ownership: ${error.message}`);
    return false;
  }
}

/**
 * Verifies that at least one user has a ticket for the event
 * More permissive than requiring both users to have tickets
 * 
 * @param {number} user1Id - First user's ID
 * @param {number} user2Id - Second user's ID
 * @param {number} eventId - The event's ID
 * @returns {Promise<boolean>} - Whether at least one user has a ticket
 */
async function verifyAtLeastOneUserHasTicket(user1Id, user2Id, eventId) {
  try {
    const [user1HasTicket, user2HasTicket] = await Promise.all([
      verifyTicketOwnership(user1Id, eventId),
      verifyTicketOwnership(user2Id, eventId)
    ]);
    
    return user1HasTicket || user2HasTicket;
  } catch (error) {
    logger.error(`Error verifying user tickets: ${error.message}`);
    return false;
  }
}

/**
 * Verifies that a user is eligible to participate in event communications
 * @param {number} userId - The user's ID
 * @param {number} eventId - The event's ID
 * @returns {Promise<boolean>} - Whether the user can participate
 */
async function canParticipateInEvent(userId, eventId) {
  try {
    // Check if user has a ticket or is the event organizer
    const attendee = await prisma.attendee.findFirst({
      where: {
        user_id: parseInt(userId),
        event_id: parseInt(eventId),
      },
    });
    
    if (attendee) return true;
    
    // Check if user is the organizer
    const event = await prisma.event.findUnique({
      where: { id: parseInt(eventId) },
      select: { user_id: true }
    });
    
    return event?.user_id === parseInt(userId);
  } catch (error) {
    logger.error(`Error checking event participation: ${error.message}`);
    return false;
  }
}

/**
 * Verifies that a user is a participant in a conversation
 * @param {number} userId - The user's ID
 * @param {number} conversationId - The conversation ID
 * @returns {Promise<boolean>} - Whether the user is a participant
 */
async function isConversationParticipant(userId, conversationId) {
  try {
    const participant = await prisma.conversationParticipant.findFirst({
      where: {
        conversation_id: parseInt(conversationId),
        user_id: parseInt(userId),
        is_active: true,
      },
    });
    
    return !!participant;
  } catch (error) {
    logger.error(`Error checking conversation participant: ${error.message}`);
    return false;
  }
}

module.exports = {
  verifyTicketOwnership,
  verifyAtLeastOneUserHasTicket,
  canParticipateInEvent,
  isConversationParticipant
};