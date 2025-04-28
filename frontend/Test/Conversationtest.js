// const ConversationController = require('../../controllers/ConversationController');
// const { PrismaClient } = require('@prisma/client');

// jest.mock('@prisma/client');
// const prisma = new PrismaClient();
// const conversationController = new ConversationController();

// describe('Conversation Controller', () => {
//   let req, res;

//   beforeEach(() => {
//     req = {
//       body: {},
//       params: {},
//     };
    
//     res = {
//       status: jest.fn().mockReturnThis(),
//       json: jest.fn(),
//     };
    
//     jest.clearAllMocks();
//   });

//   test('createOrGetConversation should validate ticket ownership', async () => {
//     req.body = {
//       event_id: '123',
//       participant_ids: ['456', '789'],
//     };
    
//     // Mock only one user having a ticket
//     prisma.attendee.findMany.mockResolvedValue([
//       { user_id: 456, event_id: 123, ticket_id: 'ticket-1' },
//       // Second user missing
//     ]);
    
//     await conversationController.createOrGetConversation(req, res);
    
//     expect(res.status).toHaveBeenCalledWith(403);
//     expect(res.json).toHaveBeenCalledWith(
//       expect.objectContaining({
//         message: expect.stringContaining('must have tickets'),
//       })
//     );
//   });

//   test('createOrGetConversation should validate profile visibility', async () => {
//     req.body = {
//       event_id: '123',
//       participant_ids: ['456', '789'],
//     };
    
//     // Mock both users having tickets
//     prisma.attendee.findMany.mockResolvedValue([
//       { user_id: 456, event_id: 123, ticket_id: 'ticket-1' },
//       { user_id: 789, event_id: 123, ticket_id: 'ticket-2' },
//     ]);
    
//     // But only one user has public profile
//     prisma.user.findMany.mockResolvedValue([
//       { id: 456, profile_visibility: 'public' },
//       // Second user missing (not public)
//     ]);
    
//     await conversationController.createOrGetConversation(req, res);
    
//     expect(res.status).toHaveBeenCalledWith(403);
//     expect(res.json).toHaveBeenCalledWith(
//       expect.objectContaining({
//         message: expect.stringContaining('public profiles'),
//       })
//     );
//   });

//   test('createOrGetConversation should return existing conversation if found', async () => {
//     req.body = {
//       event_id: '123',
//       participant_ids: ['456', '789'],
//     };
    
//     // Mock valid ticket ownership and profiles
//     prisma.attendee.findMany.mockResolvedValue([
//       { user_id: 456, event_id: 123, ticket_id: 'ticket-1' },
//       { user_id: 789, event_id: 123, ticket_id: 'ticket-2' },
//     ]);
    
//     prisma.user.findMany.mockResolvedValue([
//       { id: 456, profile_visibility: 'public' },
//       { id: 789, profile_visibility: 'public' },
//     ]);
    
//     // Mock existing conversation
//     const mockConversation = {
//       id: 'conv-123',
//       event_id: 123,
//       participants: [
//         { user_id: 456, user: { id: 456, fullname: 'User 1' } },
//         { user_id: 789, user: { id: 789, fullname: 'User 2' } },
//       ],
//     };
    
//     prisma.conversation.findFirst.mockResolvedValue(mockConversation);
    
//     await conversationController.createOrGetConversation(req, res);
    
//     // Should not create new conversation
//     expect(prisma.conversation.create).not.toHaveBeenCalled();
    
//     // Should return existing conversation
//     expect(res.status).toHaveBeenCalledWith(200);
//     expect(res.json).toHaveBeenCalledWith(
//       expect.objectContaining({
//         message: 'Conversation retrieved successfully',
//         data: mockConversation,
//       })
//     );
//   });

//   test('createOrGetConversation should create new conversation if none exists', async () => {
//     req.body = {
//       event_id: '123',
//       participant_ids: ['456', '789'],
//     };
    
//     // Mock valid ticket ownership and profiles
//     prisma.attendee.findMany.mockResolvedValue([
//       { user_id: 456, event_id: 123, ticket_id: 'ticket-1' },
//       { user_id: 789, event_id: 123, ticket_id: 'ticket-2' },
//     ]);
    
//     prisma.user.findMany.mockResolvedValue([
//       { id: 456, profile_visibility: 'public' },
//       { id: 789, profile_visibility: 'public' },
//     ]);
    
//     // Mock no existing conversation
//     prisma.conversation.findFirst.mockResolvedValue(null);
    
//     // Mock conversation creation
//     const mockNewConversation = {
//       id: 'conv-new',
//       event_id: 123,
//       participants: [
//         { user_id: 456, user: { id: 456, fullname: 'User 1' } },
//         { user_id: 789, user: { id: 789, fullname: 'User 2' } },
//       ],
//     };
    
//     prisma.conversation.create.mockResolvedValue(mockNewConversation);
    
//     await conversationController.createOrGetConversation(req, res);
    
//     // Should create new conversation
//     expect(prisma.conversation.create).toHaveBeenCalledWith(
//       expect.objectContaining({
//         data: expect.objectContaining({
//           event_id: 123,
//         }),
//       })
//     );
    
//     // Should return new conversation
//     expect(res.status).toHaveBeenCalledWith(200);
//     expect(res.json).toHaveBeenCalledWith(
//       expect.objectContaining({
//         message: 'Conversation retrieved successfully',
//         data: mockNewConversation,
//       })
//     );
//   });
// });