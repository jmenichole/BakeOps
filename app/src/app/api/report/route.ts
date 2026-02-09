import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
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

    // 3. Send Report Email
    await resend.emails.send({
      from: 'BakeBot Reports <reports@resend.dev>',
      to: ['jmenichole007@outlook.com'],
      subject: `Daily BakeBot Report - ${new Date().toLocaleDateString()}`,
      html: `
        <h1>Daily Beta Report</h1>
        <p><strong>Unique Active Users:</strong> ${uniqueUsers}</p>
        <p><strong>Total Interactions:</strong> ${totalClicks}</p>
        <p><strong>Average User Rating:</strong> ${averageRating}/5</p>
        <hr />
        <h2>Daily Survey Highlights</h2>
        ${surveys?.map(s => `
          <div style="margin-bottom: 10px; padding: 10px; border: 1px solid #eee;">
            <p><strong>Valuable:</strong> ${s.question_2}</p>
            <p><strong>Improve:</strong> ${s.question_3}</p>
            <p><strong>Valuation:</strong> $${s.value_rating}</p>
          </div>
        `).join('') || '<p>No surveys today.</p>'}
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 });
  }
}
