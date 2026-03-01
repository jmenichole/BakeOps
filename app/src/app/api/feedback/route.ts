import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { getAuthUser } from '@/lib/auth';
import { rateLimit } from '@/lib/rate-limit';

export async function POST(req: Request) {
  try {
    // 1. Auth check
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Rate limit: 5 submissions per hour per user
    const limited = rateLimit(`feedback:${user.id}`, { maxRequests: 5, windowMs: 60 * 60_000 });
    if (limited) return limited;

    const body = await req.json();
    const {
      category,
      rating,
      message,
      page_url,
      browser_info,
      user_id
    } = body;

    const currentUserEmail = user.email; // Use verified session email

    // 1. Send Email Notification via Resend
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey && currentUserEmail) {
      const resend = new Resend(resendKey);

      const categoryEmoji = {
        bug: '🐞',
        feature_request: '💡',
        ui_ux: '🎨',
        other: '💬'
      }[category as string] || '💬';

      const ratingEmoji = ['😠', '☹️', '😐', '🙂', '❤️'][(rating as number) - 1] || '❓';

      await resend.emails.send({
        from: 'Bake Ops Feedback <feedback@resend.dev>',
        to: ['jmenichole007@outlook.com'], // Owner email
        subject: `${categoryEmoji} Beta Feedback: ${category} (${ratingEmoji})`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 12px; padding: 24px;">
            <h2 style="color: #FF1CF7; margin-top: 0;">New Beta Feedback</h2>
            <p><strong>User:</strong> ${currentUserEmail}</p>
            <p><strong>Category:</strong> ${category} ${categoryEmoji}</p>
            <p><strong>Rating:</strong> ${rating}/5 ${ratingEmoji}</p>
            <p><strong>Page:</strong> <a href="${page_url}">${page_url}</a></p>
            
            <div style="background: #f9f9f9; padding: 16px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; font-style: italic;">"${message}"</p>
            </div>
            
            <details>
              <summary style="cursor: pointer; color: #666; font-size: 12px;">Browser Context</summary>
              <pre style="font-size: 10px; background: #eee; padding: 10px; border-radius: 4px; overflow: auto;">
${JSON.stringify(browser_info, null, 2)}
              </pre>
            </details>
            
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
            <p style="font-size: 10px; color: #999; text-align: center;">Sent from Bake Ops Beta Program</p>
          </div>
        `,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Feedback API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
