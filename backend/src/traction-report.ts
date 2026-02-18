import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import * as schedule from 'node-schedule';
import { VercelRequest, VercelResponse } from '@vercel/node';

dotenv.config();

interface TractionReportData {
  totalBakers: number;
  totalOrders: number;
  totalDesigns: number;
  totalRevenue: number;
  recentOrders: { customer_name: string; status: string; total_price: number; created_at: string }[];
  ordersByStatus: Record<string, number>;
}

function validateEnvironmentVariables(): void {
  const requiredEnvVars = ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_SECRET_KEY'];
  const missingVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }
}

function createSupabaseClient() {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_SECRET_KEY!
  );
}

function createEmailTransporter() {
  return nodemailer.createTransport({
    service: 'Outlook',
    auth: {
      user: process.env.EMAIL_USER!,
      pass: process.env.EMAIL_PASS!,
    },
  });
}

async function fetchTractionData(supabase: any): Promise<TractionReportData> {
  const [bakersRes, ordersRes, designsRes] = await Promise.all([
    supabase.from('bakers').select('id', { count: 'exact', head: true }),
    supabase.from('orders').select('*').order('created_at', { ascending: false }),
    supabase.from('cake_designs').select('id', { count: 'exact', head: true }),
  ]);

  if (bakersRes.error) throw new Error(`Failed to fetch bakers: ${bakersRes.error.message}`);
  if (ordersRes.error) throw new Error(`Failed to fetch orders: ${ordersRes.error.message}`);
  if (designsRes.error) throw new Error(`Failed to fetch designs: ${designsRes.error.message}`);

  const orders = ordersRes.data || [];
  const ordersByStatus: Record<string, number> = {};
  let totalRevenue = 0;

  orders.forEach((o: any) => {
    ordersByStatus[o.status] = (ordersByStatus[o.status] || 0) + 1;
    totalRevenue += Number(o.total_price) || 0;
  });

  return {
    totalBakers: bakersRes.count || 0,
    totalOrders: orders.length,
    totalDesigns: designsRes.count || 0,
    totalRevenue,
    recentOrders: orders.slice(0, 10).map((o: any) => ({
      customer_name: o.customer_name || 'Unknown',
      status: o.status,
      total_price: Number(o.total_price) || 0,
      created_at: o.created_at,
    })),
    ordersByStatus,
  };
}

function generateEmailContent(data: TractionReportData): string {
  const statusBreakdown = Object.entries(data.ordersByStatus)
    .map(([status, count]) => `<li>${status}: ${count}</li>`)
    .join('');

  const recentList = data.recentOrders
    .map(o => `<li>${o.customer_name} - $${o.total_price} (${o.status}) - ${new Date(o.created_at).toLocaleDateString()}</li>`)
    .join('');

  return `
    <h1>Monthly Traction Report</h1>
    <h2>Summary</h2>
    <p><strong>Total Bakers:</strong> ${data.totalBakers}</p>
    <p><strong>Total Orders:</strong> ${data.totalOrders}</p>
    <p><strong>Total Designs:</strong> ${data.totalDesigns}</p>
    <p><strong>Total Revenue:</strong> $${data.totalRevenue.toFixed(2)}</p>

    <h2>Orders by Status</h2>
    <ul>${statusBreakdown || '<li>No orders yet</li>'}</ul>

    <h2>Recent Orders (Last 10)</h2>
    <ul>${recentList || '<li>No orders yet</li>'}</ul>
  `;
}

async function sendTractionReportEmail(transporter: any, emailContent: string): Promise<void> {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'jmenichole007@outlook.com',
    subject: 'Monthly Traction Report',
    html: emailContent,
  };

  await transporter.sendMail(mailOptions);
}

export async function generateTractionReport(): Promise<void> {
  try {
    validateEnvironmentVariables();

    const supabase = createSupabaseClient();
    const tractionData = await fetchTractionData(supabase);

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
  }
}

// Schedule the report to run on the 1st of every month at midnight
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
