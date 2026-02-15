import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import * as schedule from 'node-schedule';
import { VercelRequest, VercelResponse } from '@vercel/node';

dotenv.config();

interface WaitlistEntry {
  id: string;
  email: string;
  role: string;
  source: string;
  created_at: string;
}

interface TractionReportData {
  totalSignups: number;
  signupsByRole: Record<string, number>;
  signupsBySource: Record<string, number>;
  recentSignups: WaitlistEntry[];
}

/**
 * Validates required environment variables
 * @throws Error if any required variable is missing
 */
function validateEnvironmentVariables(): void {
  const requiredEnvVars = ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_SECRET_KEY'];
  const missingVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }
}

/**
 * Creates and configures the Supabase client
 * @returns Configured Supabase client
 */
function createSupabaseClient() {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_SECRET_KEY!
  );
}

/**
 * Creates and configures the email transporter
 * @returns Configured nodemailer transporter
 */
function createEmailTransporter() {
  return nodemailer.createTransport({
    service: 'Outlook',
    auth: {
      user: process.env.EMAIL_USER!,
      pass: process.env.EMAIL_PASS!,
    },
  });
}

/**
 * Fetches waitlist data from Supabase
 * @param supabase - Supabase client instance
 * @returns Array of waitlist entries
 */
async function fetchWaitlistData(supabase: any): Promise<WaitlistEntry[]> {
  const { data: waitlist, error } = await supabase
    .from('waitlist_signups') // Corrected table name
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch waitlist data: ${error.message}`);
  }

  return waitlist || [];
}

/**
 * Generates traction report data from waitlist entries
 * @param waitlist - Array of waitlist entries
 * @returns Processed traction report data
 */
function generateTractionData(waitlist: WaitlistEntry[]): TractionReportData {
  const totalSignups = waitlist.length;

  const signupsByRole: Record<string, number> = {};
  const signupsBySource: Record<string, number> = {};

  waitlist.forEach(entry => {
    signupsByRole[entry.role] = (signupsByRole[entry.role] || 0) + 1;
    signupsBySource[entry.source] = (signupsBySource[entry.source] || 0) + 1;
  });

  const recentSignups = waitlist.slice(0, 10); // Last 10 signups

  return {
    totalSignups,
    signupsByRole,
    signupsBySource,
    recentSignups,
  };
}

/**
 * Generates HTML email content for the traction report
 * @param data - Traction report data
 * @returns HTML string for email
 */
function generateEmailContent(data: TractionReportData): string {
  const roleBreakdown = Object.entries(data.signupsByRole)
    .map(([role, count]) => `<li>${role}: ${count}</li>`)
    .join('');

  const sourceBreakdown = Object.entries(data.signupsBySource)
    .map(([source, count]) => `<li>${source}: ${count}</li>`)
    .join('');

  const recentSignupsList = data.recentSignups
    .map(entry => `<li>${entry.email} (${entry.role}) - ${new Date(entry.created_at).toLocaleDateString()}</li>`)
    .join('');

  return `
    <h1>Monthly Traction Report</h1>
    <h2>Summary</h2>
    <p><strong>Total Waitlist Signups:</strong> ${data.totalSignups}</p>

    <h2>Signups by Role</h2>
    <ul>${roleBreakdown}</ul>

    <h2>Signups by Source</h2>
    <ul>${sourceBreakdown}</ul>

    <h2>Recent Signups (Last 10)</h2>
    <ul>${recentSignupsList}</ul>
  `;
}

/**
 * Sends the traction report email
 * @param transporter - Email transporter
 * @param emailContent - HTML content for the email
 */
async function sendTractionReportEmail(transporter: any, emailContent: string): Promise<void> {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'jmenichole007@outlook.com',
    subject: 'Monthly Traction Report',
    html: emailContent,
  };

  await transporter.sendMail(mailOptions);
}

/**
 * Generates and sends the monthly traction report
 * @returns Promise that resolves when report is sent
 */
export async function generateTractionReport(): Promise<void> {
  try {
    validateEnvironmentVariables();

    const supabase = createSupabaseClient();

    const waitlist = await fetchWaitlistData(supabase);
    const tractionData = generateTractionData(waitlist);

    // Only send email if email credentials are configured
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const transporter = createEmailTransporter();
      const emailContent = generateEmailContent(tractionData);
      await sendTractionReportEmail(transporter, emailContent);
      console.log('Traction report sent successfully!');
    } else {
      console.log('Traction report generated (email not configured):', tractionData);
    }
  } catch (error) {
    console.error('Error generating traction report:', error);
    // Don't re-throw for scheduled jobs to prevent crashes
  }
}

// Schedule the report to run on the 1st of every month at midnight
// Only run this if not in Vercel environment (where we use Vercel Crons)
if (!process.env.VERCEL) {
  schedule.scheduleJob('0 0 1 * *', async () => {
    try {
      await generateTractionReport();
    } catch (error) {
      console.error('Scheduled traction report failed:', error);
    }
  });
}

/**
 * Vercel Serverless Function handler
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Add basic authentication for the cron job (e.g., check for a secret header)
  const authHeader = req.headers.authorization;
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }

  try {
    await generateTractionReport();
    return res.status(200).json({ success: true, message: 'Traction report generated and sent' });
  } catch (error: any) {
    console.error('API traction report failed:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
