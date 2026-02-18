import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';
import { generateTractionReport } from './traction-report';

// Mock dependencies
jest.mock('@supabase/supabase-js');
jest.mock('nodemailer');

const mockSupabase = createClient as jest.MockedFunction<typeof createClient>;
const mockTransporter = {
  sendMail: jest.fn().mockResolvedValue({}),
};

(nodemailer.createTransport as jest.Mock).mockReturnValue(mockTransporter);

describe('generateTractionReport', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.SUPABASE_URL = 'test-url';
    process.env.SUPABASE_SERVICE_ROLE_SECRET_KEY = 'test-key';
    process.env.EMAIL_USER = 'test@example.com';
    process.env.EMAIL_PASS = 'test-pass';
  });

  it('should send traction report email successfully', async () => {
    const mockOrders = [
      { customer_name: 'Alice', status: 'pending', total_price: 50, created_at: '2024-01-01' },
      { customer_name: 'Bob', status: 'delivered', total_price: 75, created_at: '2024-01-02' },
    ];

    const mockFrom = jest.fn().mockImplementation((table: string) => {
      if (table === 'bakers') {
        return { select: jest.fn().mockResolvedValue({ count: 3, error: null }) };
      }
      if (table === 'orders') {
        return {
          select: jest.fn().mockReturnValue({
            order: jest.fn().mockResolvedValue({ data: mockOrders, error: null }),
          }),
        };
      }
      if (table === 'cake_designs') {
        return { select: jest.fn().mockResolvedValue({ count: 10, error: null }) };
      }
      return { select: jest.fn().mockResolvedValue({ data: [], error: null }) };
    });

    mockSupabase.mockReturnValue({ from: mockFrom } as any);

    await generateTractionReport();

    expect(mockTransporter.sendMail).toHaveBeenCalledWith({
      from: 'test@example.com',
      to: 'jmenichole007@outlook.com',
      subject: 'Monthly Traction Report',
      html: expect.stringContaining('<strong>Total Bakers:</strong> 3'),
    });
  });

  it('should handle Supabase errors', async () => {
    const mockError = new Error('Database error');

    const mockFrom = jest.fn().mockImplementation(() => ({
      select: jest.fn().mockResolvedValue({ data: null, count: null, error: mockError }),
    }));

    mockSupabase.mockReturnValue({ from: mockFrom } as any);

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    await generateTractionReport();

    expect(consoleSpy).toHaveBeenCalledWith('Error generating traction report:', expect.any(Error));
    consoleSpy.mockRestore();
  });

  it('should handle email sending errors', async () => {
    const mockOrders = [{ customer_name: 'Alice', status: 'pending', total_price: 50, created_at: '2024-01-01' }];

    const mockFrom = jest.fn().mockImplementation((table: string) => {
      if (table === 'bakers') {
        return { select: jest.fn().mockResolvedValue({ count: 1, error: null }) };
      }
      if (table === 'orders') {
        return {
          select: jest.fn().mockReturnValue({
            order: jest.fn().mockResolvedValue({ data: mockOrders, error: null }),
          }),
        };
      }
      if (table === 'cake_designs') {
        return { select: jest.fn().mockResolvedValue({ count: 5, error: null }) };
      }
      return { select: jest.fn().mockResolvedValue({ data: [], error: null }) };
    });

    mockSupabase.mockReturnValue({ from: mockFrom } as any);
    mockTransporter.sendMail.mockRejectedValueOnce(new Error('Email error'));

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    await generateTractionReport();

    expect(consoleSpy).toHaveBeenCalledWith('Error generating traction report:', expect.any(Error));
    consoleSpy.mockRestore();
  });
});
