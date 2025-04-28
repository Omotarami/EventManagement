// const EventController = require('../../controllers/EventController');
// const { PrismaClient } = require('@prisma/client');

// // Mock Prisma
// jest.mock('@prisma/client', () => {
//   const mockPrisma = {
//     event: {
//       create: jest.fn(),
//       findUnique: jest.fn(),
//     },
//   };
//   return { PrismaClient: jest.fn(() => mockPrisma) };
// });

// const prisma = new PrismaClient();
// const eventController = new EventController();

// describe('Event Controller', () => {
//   let req, res;

//   beforeEach(() => {
//     req = {
//       body: {},
//       params: {},
//       user: { id: '123', role: 'organizer' },
//     };
//     res = {
//       status: jest.fn().mockReturnThis(),
//       json: jest.fn(),
//     };
//     jest.clearAllMocks();
//   });

//   test('createEvent should validate required fields', async () => {
//     req.body = { title: 'Test Event' }; // Missing required fields
    
//     await eventController.createEvent(req, res);
    
//     expect(res.status).toHaveBeenCalledWith(400);
//     expect(res.json).toHaveBeenCalledWith(
//       expect.objectContaining({
//         message: expect.stringContaining('required fields')
//       })
//     );
//     expect(prisma.event.create).not.toHaveBeenCalled();
//   });

//   test('createEvent should successfully create event with valid data', async () => {
//     const eventData = {
//       title: 'Test Event',
//       description: 'Description',
//       start_date: '2025-05-01',
//       location: 'Test Venue',
//       category: 'Conference',
//       event_type: 'physical',
//     };
    
//     prisma.event.create.mockResolvedValue({ id: '456', ...eventData });
//     req.body = eventData;
    
//     await eventController.createEvent(req, res);
    
//     expect(prisma.event.create).toHaveBeenCalledWith({
//       data: expect.objectContaining({
//         title: 'Test Event',
//         organizer_id: '123',
//       }),
//     });
//     expect(res.status).toHaveBeenCalledWith(201);
//     expect(res.json).toHaveBeenCalledWith(
//       expect.objectContaining({
//         message: 'Event created successfully',
//         data: expect.objectContaining({ id: '456' }),
//       })
//     );
//   });
// });