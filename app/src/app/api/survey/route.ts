import { Resend } from 'resend';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const body = await req.json();
    const { rating, valuableFeature, changeOneThing, estimatedValue, userEmail } = body;

    const { data, error } = await resend.emails.send({
      from: 'BakeBot Survey <onboarding@resend.dev>',
      to: ['jmenichole007@outlook.com'],
      subject: `Daily Beta Survey: ${userEmail}`,
      html: `
        <h1>Daily Feedback from ${userEmail}</h1>
        <p><strong>Rating:</strong> ${rating}/5</p>
        <p><strong>Most Valuable Feature:</strong> ${valuableFeature}</p>
        <p><strong>One Thing to Change:</strong> ${changeOneThing}</p>
        <p><strong>Suggested Lifetime Price:</strong> $${estimatedValue}</p>
        <hr />
        <p>Sent via BakeBot Beta Program</p>
      `,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
