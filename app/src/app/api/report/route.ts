import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { getAuthUser, escapeHtml } from '@/lib/auth';
import { rateLimit } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

export async function GET() {
  // Auth check — only authenticated users can trigger reports
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Rate limit: 2 reports per hour per user
  const limited = rateLimit(`report:${user.id}`, { maxRequests: 2, windowMs: 60 * 60_000 });
  if (limited) return limited;

  const resend = new Resend(process.env.RESEND_API_KEY);
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_SECRET_KEY!
  );

  try {
    // 1. Fetch Analytics for last 24h
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    const { data: events } = await supabase
      .from('analytics_events')
      .select('*')
      .gte('created_at', yesterday);

    const { data: surveys } = await supabase
      .from('survey_responses')
      .select('*')
      .gte('created_at', yesterday);

    // 2. Aggregate Data
    const totalClicks = events?.length || 0;
    const uniqueUsers = new Set(events?.map(e => e.user_id)).size;
    const averageRating = surveys?.length
      ? (surveys.reduce((acc, s) => acc + parseInt(s.question_1.split(': ')[1]), 0) / surveys.length).toFixed(1)
      : 'N/A';

    // 3. Send Report Email (with escaped user content)
    await resend.emails.send({
      from: 'Bake Ops Reports <reports@resend.dev>',
      to: ['jmenichole007@outlook.com'],
      subject: `Daily Bake Ops Report - ${new Date().toLocaleDateString()}`,
      html: `
        <h1>Daily Beta Report</h1>
        <p><strong>Unique Active Users:</strong> ${uniqueUsers}</p>
        <p><strong>Total Interactions:</strong> ${totalClicks}</p>
        <p><strong>Average User Rating:</strong> ${escapeHtml(averageRating)}/5</p>
        <hr />
        <h2>Daily Survey Highlights</h2>
        ${surveys?.map(s => `
          <div style="margin-bottom: 10px; padding: 10px; border: 1px solid #eee;">
            <p><strong>Valuable:</strong> ${escapeHtml(s.question_2)}</p>
            <p><strong>Improve:</strong> ${escapeHtml(s.question_3)}</p>
            <p><strong>Valuation:</strong> $${escapeHtml(s.value_rating)}</p>
          </div>
        `).join('') || '<p>No surveys today.</p>'}
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 });
  }
}
