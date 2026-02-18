import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getAuthUser } from '@/lib/auth';
import { rateLimit } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    // Auth check
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Rate limit: 5 surveys per hour per user
    const limited = rateLimit(`survey:${user.id}`, { maxRequests: 5, windowMs: 60 * 60_000 });
    if (limited) return limited;

    const body = await req.json();
    const { rating, valuableFeature, changeOneThing, estimatedValue, userEmail, userId } = body;

    if (!rating || !userEmail) {
      return NextResponse.json({ error: 'Rating and email are required' }, { status: 400 });
    }

    // 1. Persist to database
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_SECRET_KEY;

    if (supabaseUrl && supabaseServiceKey) {
      const supabase = createClient(supabaseUrl, supabaseServiceKey);

      await supabase.from('survey_responses').insert({
        user_id: userId || null,
        question_1: `Rating: ${rating}`,
        question_2: typeof valuableFeature === 'string' ? valuableFeature.slice(0, 1000) : null,
        question_3: typeof changeOneThing === 'string' ? changeOneThing.slice(0, 1000) : null,
        value_rating: typeof estimatedValue === 'number' ? Math.min(Math.max(estimatedValue, 0), 1000) : null,
      });
    }

    // 2. Send email notification
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      const resend = new Resend(resendKey);

      const sanitize = (val: unknown) =>
        typeof val === 'string' ? val.replace(/[<>&"']/g, (c) => `&#${c.charCodeAt(0)};`) : String(val ?? '');

      await resend.emails.send({
        from: 'Bake Ops Survey <onboarding@resend.dev>',
        to: ['jmenichole007@outlook.com'],
        subject: `Daily Beta Survey: ${sanitize(userEmail)}`,
        html: `
          <h1>Daily Feedback from ${sanitize(userEmail)}</h1>
          <p><strong>Professional Quality Rating:</strong> ${sanitize(rating)}/5</p>
          <p><strong>Technical Friction/Bugs:</strong> ${sanitize(valuableFeature)}</p>
          <p><strong>#1 Missing Feature:</strong> ${sanitize(changeOneThing)}</p>
          <p><strong>Suggested Lifetime Price:</strong> $${sanitize(estimatedValue)}</p>
          <hr />
          <p>Sent via Bake Ops Beta Program</p>
        `,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Survey route error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
