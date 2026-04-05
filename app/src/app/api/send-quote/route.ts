import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { getAuthUser } from '@/lib/auth';
import { rateLimit } from '@/lib/rate-limit';

export async function POST(req: Request) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Rate limit: 20 quote emails per hour per baker
    const limited = rateLimit(`send-quote:${user.id}`, { maxRequests: 20, windowMs: 60 * 60_000 });
    if (limited) return limited;

    const body = await req.json();
    const { customerEmail, customerName, quoteLink, total, designTitle } = body as {
      customerEmail: string;
      customerName: string;
      quoteLink: string;
      total: number;
      designTitle: string;
    };

    if (!customerEmail || !quoteLink) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const resendKey = process.env.RESEND_API_KEY;
    if (!resendKey) {
      // Resend not configured — skip silently so the order flow still completes
      return NextResponse.json({ success: true, skipped: true });
    }

    const resend = new Resend(resendKey);

    await resend.emails.send({
      from: 'Bake Ops <quotes@resend.dev>',
      to: [customerEmail],
      replyTo: user.email ?? undefined,
      subject: `Your custom cake quote is ready — $${total.toFixed(2)}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #fff; border: 1px solid #f3e8f0; border-radius: 16px; overflow: hidden;">
          <div style="background: #1a1a2e; padding: 32px 32px 24px; text-align: center;">
            <h1 style="color: #fff; font-size: 28px; margin: 0; font-family: Georgia, serif;">Bake Ops</h1>
            <p style="color: #f472b6; font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; margin: 8px 0 0;">Custom Quote Ready</p>
          </div>

          <div style="padding: 40px 32px;">
            <p style="color: #374151; font-size: 16px; margin: 0 0 8px;">Hi ${customerName || 'there'},</p>
            <p style="color: #6b7280; font-size: 15px; line-height: 1.6; margin: 0 0 32px;">
              Your baker has prepared a personalised quote for <strong>${designTitle}</strong>.
              Click below to view the full design, ingredients, and pricing breakdown.
            </p>

            <div style="text-align: center; margin-bottom: 32px;">
              <a href="${quoteLink}"
                 style="display: inline-block; background: #f43f8c; color: #fff; font-weight: 700; font-size: 16px; padding: 16px 40px; border-radius: 12px; text-decoration: none;">
                View My Quote →
              </a>
            </div>

            <div style="background: #fdf2f8; border-radius: 12px; padding: 20px 24px; display: flex; justify-content: space-between; align-items: center;">
              <span style="color: #6b7280; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em;">Total Quote</span>
              <span style="color: #1a1a2e; font-size: 28px; font-weight: 900;">$${total.toFixed(2)}</span>
            </div>

            <p style="color: #9ca3af; font-size: 12px; margin: 24px 0 0; line-height: 1.6;">
              This is an estimated quote. The final invoice may vary depending on any design refinements agreed with your baker.
            </p>
          </div>

          <div style="border-top: 1px solid #f3f4f6; padding: 20px 32px; text-align: center;">
            <p style="color: #d1d5db; font-size: 11px; margin: 0;">
              Powered by <a href="https://bakeops.com" style="color: #f472b6; text-decoration: none;">Bake Ops</a>
            </p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('send-quote API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
