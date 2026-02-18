import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { escapeHtml } from '@/lib/auth';

export const dynamic = 'force-dynamic';

interface TractionReportData {
  totalBakers: number;
  totalOrders: number;
  totalDesigns: number;
  totalRevenue: number;
  ordersByStatus: Record<string, number>;
  recentOrders: { customer_name: string; status: string; total_price: number; created_at: string }[];
}

function generateEmailContent(data: TractionReportData): string {
  const statusBreakdown = Object.entries(data.ordersByStatus)
    .map(([status, count]) => `<li>${escapeHtml(status)}: ${count}</li>`)
    .join('');

  const recentList = data.recentOrders
    .map(o => `<li>${escapeHtml(o.customer_name)} - $${o.total_price.toFixed(2)} (${escapeHtml(o.status)}) - ${new Date(o.created_at).toLocaleDateString()}</li>`)
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

export async function GET(req: Request) {
  // Fail closed: always require CRON_SECRET
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    console.error('CRON_SECRET is not configured');
    return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
  }

  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_SECRET_KEY!
  );

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const [bakersRes, ordersRes, designsRes] = await Promise.all([
      supabase.from('bakers').select('id', { count: 'exact', head: true }),
      supabase.from('orders').select('*').order('created_at', { ascending: false }),
      supabase.from('cake_designs').select('id', { count: 'exact', head: true }),
    ]);

    if (bakersRes.error) throw bakersRes.error;
    if (ordersRes.error) throw ordersRes.error;
    if (designsRes.error) throw designsRes.error;

    const orders = ordersRes.data || [];
    const ordersByStatus: Record<string, number> = {};
    let totalRevenue = 0;

    orders.forEach((o: any) => {
      ordersByStatus[o.status] = (ordersByStatus[o.status] || 0) + 1;
      totalRevenue += Number(o.total_price) || 0;
    });

    const tractionData: TractionReportData = {
      totalBakers: bakersRes.count || 0,
      totalOrders: orders.length,
      totalDesigns: designsRes.count || 0,
      totalRevenue,
      ordersByStatus,
      recentOrders: orders.slice(0, 10).map((o: any) => ({
        customer_name: o.customer_name || 'Unknown',
        status: o.status,
        total_price: Number(o.total_price) || 0,
        created_at: o.created_at,
      })),
    };

    const emailContent = generateEmailContent(tractionData);

    await resend.emails.send({
      from: 'Bake Ops Traction <onboarding@resend.dev>',
      to: ['jmenichole007@outlook.com'],
      subject: 'Monthly Traction Report',
      html: emailContent,
    });

    return NextResponse.json({ success: true, data: tractionData });
  } catch (error: any) {
    console.error('Traction report failed:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
