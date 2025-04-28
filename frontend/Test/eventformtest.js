import React from 'react';
import { render, screen, fireEvent, waitFor } from '../testUtils';
import EventForm from '../components/EventForm';
import { createEvent } from '../services/eventService';

// Mock the event service
jest.mock('../services/eventService');

describe('Event Creation Form', () => {
  beforeEach(() => {
    // Reset mocks between tests
    jest.clearAllMocks();
  });

  test('should validate required fields', async () => {
    render(<EventForm />);
    
    // Submit without filling required fields
    fireEvent.click(screen.getByRole('button', { name: /create event/i }));
    
    // Check for validation messages
    await waitFor(() => {
      expect(screen.getByText(/title is required/i)).toBeInTheDocument();
      expect(screen.getByText(/date is required/i)).toBeInTheDocument();
      expect(screen.getByText(/location is required/i)).toBeInTheDocument();
    });
    
    // Verify service not called with invalid data
    expect(createEvent).not.toHaveBeenCalled();
  });
  
  test('should successfully submit event with valid data', async () => {
    createEvent.mockResolvedValue({ id: '123', title: 'Test Event' });
    
    render(<EventForm />);
    
    // Fill in form fields
    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: 'Test Event' }
    });
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: 'Event description' }
    });
    fireEvent.change(screen.getByLabelText(/date/i), {
      target: { value: '2025-05-01' }
    });
    fireEvent.change(screen.getByLabelText(/location/i), {
      target: { value: 'Test Venue' }
    });
    
    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /create event/i }));
    
    // Verify service called with correct data
    await waitFor(() => {
      expect(createEvent).toHaveBeenCalledWith({
        title: 'Test Event',
        description: 'Event description',
        date: '2025-05-01',
        location: 'Test Venue',
      });
    });
    
    // Verify success message
    expect(screen.getByText(/event created successfully/i)).toBeInTheDocument();
  });
  
  test('should handle multi-step form navigation correctly', async () => {
    render(<EventForm />);
    
    // Verify first step is visible
    expect(screen.getByText(/event details/i)).toBeInTheDocument();
    
    // Fill first step and proceed
    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: 'Test Event' }
    });
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    
    // Verify second step is visible
    await waitFor(() => {
      expect(screen.getByText(/ticket options/i)).toBeInTheDocument();
    });
    
    // Test back button functionality
    fireEvent.click(screen.getByRole('button', { name: /back/i }));
    
    // Verify back on first step with data preserved
    await waitFor(() => {
      expect(screen.getByText(/event details/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/title/i).value).toBe('Test Event');
    });
  });
});