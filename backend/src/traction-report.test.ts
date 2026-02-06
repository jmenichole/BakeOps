import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';
import { generateTractionReport } from './traction-report';

// Mock dependencies
jest.mock('@supabase/supabase-js');
jest.mock('nodemailer');

const mockSupabase = createClient as jest.MockedFunction<typeof createClient>;
const mockTransporter = {
  sendMail: jest.fn(),
};

describe('generateTractionReport', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.SUPABASE_URL = 'test-url';
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-key';
    process.env.EMAIL_USER = 'test@example.com';
    process.env.EMAIL_PASS = 'test-pass';
  });

  it('should send traction report email successfully', async () => {
    const mockWaitlist = [
      { email: 'user1@example.com' },
      { email: 'user2@example.com' },
    ];

    mockSupabase.mockReturnValue({
      from: jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue({ data: mockWaitlist, error: null }),
      }),
    } as any);

    (nodemailer.createTransport as jest.Mock).mockReturnValue(mockTransporter);
    mockTransporter.sendMail.mockResolvedValue({});

    await generateTractionReport();

    expect(mockTransporter.sendMail).toHaveBeenCalledWith({
      from: 'test@example.com',
      to: 'jmenichole007@outlook.com',
      subject: 'Monthly Traction Report',
      html: expect.stringContaining('Total Waitlist Signups: 2'),
    });
  });

  it('should handle Supabase errors', async () => {
    const mockError = new Error('Database error');

    mockSupabase.mockReturnValue({
      from: jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue({ data: null, error: mockError }),
      }),
    } as any);

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    await generateTractionReport();

    expect(consoleSpy).toHaveBeenCalledWith('Error generating traction report:', mockError);
    consoleSpy.mockRestore();
  });

  it('should handle email sending errors', async () => {
    const mockWaitlist = [{ email: 'user1@example.com' }];

    mockSupabase.mockReturnValue({
      from: jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue({ data: mockWaitlist, error: null }),
      }),
    } as any);

    (nodemailer.createTransport as jest.Mock).mockReturnValue(mockTransporter);
    mockTransporter.sendMail.mockRejectedValue(new Error('Email error'));

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    await generateTractionReport();

    expect(consoleSpy).toHaveBeenCalledWith('Error generating traction report:', expect.any(Error));
    consoleSpy.mockRestore();
  });
});
