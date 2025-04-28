// import React from 'react';
// import { render, screen, fireEvent, waitFor } from '../testUtils';
// import TicketPurchaseForm from '../components/TicketPurchaseForm';
// import { purchaseTicket } from '../services/ticketService';

// jest.mock('../services/ticketService');

// describe('Ticket Purchase Flow', () => {
//   const mockEvent = {
//     id: 'event-123',
//     title: 'Test Conference',
//     ticketTypes: [
//       { id: 'ticket-1', name: 'Early Bird', price: 49.99, available: 10 },
//       { id: 'ticket-2', name: 'VIP Pass', price: 149.99, available: 5 },
//     ],
//   };

//   beforeEach(() => {
//     purchaseTicket.mockReset();
//   });

//   test('should correctly calculate total based on ticket selection', async () => {
//     render(<TicketPurchaseForm event={mockEvent} />);
    
//     // Select 2 early bird tickets
//     fireEvent.change(screen.getByTestId('ticket-1-quantity'), {
//       target: { value: '2' },
//     });
    
//     // Check updated price calculation
//     expect(screen.getByTestId('subtotal')).toHaveTextContent('99.98');
    
//     // Add 1 VIP ticket
//     fireEvent.change(screen.getByTestId('ticket-2-quantity'), {
//       target: { value: '1' },
//     });
    
//     // Check updated total with both ticket types
//     expect(screen.getByTestId('subtotal')).toHaveTextContent('249.97');
//   });

//   test('should submit purchase request with correct data', async () => {
//     purchaseTicket.mockResolvedValue({
//       success: true,
//       orderId: 'order-123',
//     });
    
//     render(<TicketPurchaseForm event={mockEvent} />);
    
//     // Select tickets
//     fireEvent.change(screen.getByTestId('ticket-1-quantity'), {
//       target: { value: '2' },
//     });
    
//     // Fill in buyer details
//     fireEvent.change(screen.getByLabelText(/full name/i), {
//       target: { value: 'John Doe' },
//     });
//     fireEvent.change(screen.getByLabelText(/email/i), {
//       target: { value: 'john@example.com' },
//     });
    
//     // Submit purchase
//     fireEvent.click(screen.getByRole('button', { name: /complete purchase/i }));
    
//     // Verify service called with correct data
//     await waitFor(() => {
//       expect(purchaseTicket).toHaveBeenCalledWith({
//         eventId: 'event-123',
//         tickets: [{ id: 'ticket-1', quantity: 2 }],
//         buyerInfo: {
//           name: 'John Doe',
//           email: 'john@example.com',
//         },
//       });
//     });
    
//     // Verify success confirmation shown
//     expect(screen.getByText(/purchase successful/i)).toBeInTheDocument();
//     expect(screen.getByText(/order-123/i)).toBeInTheDocument();
//   });

//   test('should enforce maximum ticket limits', async () => {
//     render(<TicketPurchaseForm event={mockEvent} />);
    
//     // Try to select more than available tickets
//     fireEvent.change(screen.getByTestId('ticket-2-quantity'), {
//       target: { value: '10' }, // Only 5 available
//     });
    
//     // Verify error message
//     expect(screen.getByText(/maximum 5 tickets available/i)).toBeInTheDocument();
    
//     // Verify purchase button disabled
//     expect(screen.getByRole('button', { name: /complete purchase/i })).toBeDisabled();
//   });
// });