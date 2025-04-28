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
        ticket_id: { not: null },
      },
    });
    
    return !!attendee;
  } catch (error) {
    logger.error(`Error verifying ticket ownership: ${error.message}`);
    return false;
  }
}

/**
 * Verifies that both users have tickets for the same event
 * @param {number} user1Id - First user's ID
 * @param {number} user2Id - Second user's ID
 * @param {number} eventId - The event's ID
 * @returns {Promise<boolean>} - Whether both users have tickets
 */
async function verifyBothUsersHaveTickets(user1Id, user2Id, eventId) {
  try {
    const [user1HasTicket, user2HasTicket] = await Promise.all([
      verifyTicketOwnership(user1Id, eventId),
      verifyTicketOwnership(user2Id, eventId)
    ]);
    
    return user1HasTicket && user2HasTicket;
  } catch (error) {
    logger.error(`Error verifying both users have tickets: ${error.message}`);
    return false;
  }
}

/**
 * Verifies that a user has a public profile
 * @param {number} userId - The user's ID
 * @returns {Promise<boolean>} - Whether the user has a public profile
 */
async function verifyPublicProfile(userId) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      select: { profile_visibility: true }
    });
    
    return user?.profile_visibility === 'public';
  } catch (error) {
    logger.error(`Error verifying public profile: ${error.message}`);
    return false;
  }
}

/**
 * Verifies that both users have public profiles
 * @param {number} user1Id - First user's ID
 * @param {number} user2Id - Second user's ID
 * @returns {Promise<boolean>} - Whether both users have public profiles
 */
async function verifyBothUsersHavePublicProfiles(user1Id, user2Id) {
  try {
    const [user1Public, user2Public] = await Promise.all([
      verifyPublicProfile(user1Id),
      verifyPublicProfile(user2Id)
    ]);
    
    return user1Public && user2Public;
  } catch (error) {
    logger.error(`Error verifying both users have public profiles: ${error.message}`);
    return false;
  }
}

module.exports = {
  verifyTicketOwnership,
  verifyBothUsersHaveTickets,
  verifyPublicProfile,
  verifyBothUsersHavePublicProfiles
};