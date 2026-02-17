import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

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

function generateTractionData(waitlist: WaitlistEntry[]): TractionReportData {
  const totalSignups = waitlist.length;
  const signupsByRole: Record<string, number> = {};
  const signupsBySource: Record<string, number> = {};

  waitlist.forEach(entry => {
    signupsByRole[entry.role] = (signupsByRole[entry.role] || 0) + 1;
    signupsBySource[entry.source] = (signupsBySource[entry.source] || 0) + 1;
  });

  const recentSignups = waitlist.slice(0, 10);

  return {
    totalSignups,
    signupsByRole,
    signupsBySource,
    recentSignups,
  };
}

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

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_SECRET_KEY!
  );

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const { data: waitlist, error } = await supabase
      .from('waitlist_signups')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const tractionData = generateTractionData(waitlist || []);
    const emailContent = generateEmailContent(tractionData);

    await resend.emails.send({
      from: 'BakeBot Traction <onboarding@resend.dev>',
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
