// const TicketController = require('../../controllers/TicketController');
// const { PrismaClient } = require('@prisma/client');

// jest.mock('@prisma/client');
// const prisma = new PrismaClient();
// const ticketController = new TicketController();

// describe('Ticket Controller', () => {
//   let req, res, mockTransaction;

//   beforeEach(() => {
//     mockTransaction = {
//       ticket: { create: jest.fn() },
//       event: { update: jest.fn() },
//     };
    
//     prisma.$transaction = jest.fn().mockImplementation(callback => 
//       callback(mockTransaction)
//     );
    
//     req = {
//       body: {},
//       params: {},
//       user: { id: '123' },
//     };
    
//     res = {
//       status: jest.fn().mockReturnThis(),
//       json: jest.fn(),
//     };
    
//     jest.clearAllMocks();
//   });

//   test('createTicketType should create new ticket type with valid data', async () => {
//     req.body = {
//       event_id: '456',
//       name: 'VIP Pass',
//       price: 99.99,
//       quantity: 50,
//       description: 'Premium access',
//     };
    
//     mockTransaction.ticket.create.mockResolvedValue({
//       id: 'ticket-123',
//       ...req.body,
//     });
    
//     await ticketController.createTicketType(req, res);
    
//     expect(mockTransaction.ticket.create).toHaveBeenCalledWith({
//       data: expect.objectContaining({
//         event_id: '456',
//         name: 'VIP Pass',
//         price: 99.99,
//         quantity: 50,
//       }),
//     });
    
//     expect(res.status).toHaveBeenCalledWith(201);
//     expect(res.json).toHaveBeenCalledWith(
//       expect.objectContaining({
//         message: 'Ticket type created successfully',
//       })
//     );
//   });

//   test('purchaseTicket should validate ticket availability before purchase', async () => {
//     // Mock finding ticket with no available quantity
//     prisma.ticket.findUnique.mockResolvedValue({
//       id: 'ticket-123',
//       quantity: 10,
//       sold: 10, // Sold out
//       price: 99.99,
//     });
    
//     req.body = {
//       ticket_id: 'ticket-123',
//       quantity: 1,
//     };
    
//     await ticketController.purchaseTicket(req, res);
    
//     expect(res.status).toHaveBeenCalledWith(400);
//     expect(res.json).toHaveBeenCalledWith(
//       expect.objectContaining({
//         message: expect.stringContaining('sold out'),
//       })
//     );
//   });

//   test('purchaseTicket should successfully process valid purchase', async () => {
//     // Mock finding available ticket
//     prisma.ticket.findUnique.mockResolvedValue({
//       id: 'ticket-123',
//       event_id: '456',
//       quantity: 10,
//       sold: 5,
//       price: 99.99,
//     });
    
//     // Mock event data
//     prisma.event.findUnique.mockResolvedValue({
//       id: '456',
//       title: 'Test Event',
//     });
    
//     req.body = {
//       ticket_id: 'ticket-123',
//       quantity: 2,
//     };
    
//     // Mock transaction success
//     mockTransaction.attendee.create.mockResolvedValue({ id: 'att-123' });
//     mockTransaction.ticket.update.mockResolvedValue({
//       id: 'ticket-123',
//       sold: 7,
//     });
//     mockTransaction.payment.create.mockResolvedValue({
//       id: 'pay-123',
//       amount: 199.98,
//     });
    
//     await ticketController.purchaseTicket(req, res);
    
//     // Verify ticket update called with correct sold count
//     expect(mockTransaction.ticket.update).toHaveBeenCalledWith({
//       where: { id: 'ticket-123' },
//       data: { sold: 7 },
//     });
    
//     // Verify attendee record created
//     expect(mockTransaction.attendee.create).toHaveBeenCalled();
    
//     // Verify payment record created with correct amount
//     expect(mockTransaction.payment.create).toHaveBeenCalledWith(
//       expect.objectContaining({
//         data: expect.objectContaining({
//           amount: 199.98, // 99.99 * 2
//         }),
//       })
//     );
    
//     expect(res.status).toHaveBeenCalledWith(200);
//     expect(res.json).toHaveBeenCalledWith(
//       expect.objectContaining({
//         message: 'Ticket purchased successfully',
//       })
//     );
//   });
// });
