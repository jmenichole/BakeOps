import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, getRequestIdentifier } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    // Rate limit: 10 referral tracks per minute per IP
    const ip = getRequestIdentifier(request);
    const limited = rateLimit(`track-referral:${ip}`, { maxRequests: 10, windowMs: 60_000 });
    if (limited) return limited;

    const { referralCode } = await request.json();

    if (!referralCode || typeof referralCode !== 'string') {
      return NextResponse.json({ error: 'Referral code is required' }, { status: 400 });
    }

    // Use service role key here since RLS may block anonymous inserts to referral_clicks
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_SECRET_KEY!
    );

    // Find the referrer
    const { data: baker } = await supabase
      .from('bakers')
      .select('id')
      .eq('referral_code', referralCode)
      .single();

    if (!baker) {
      return NextResponse.json({ error: 'Invalid referral code' }, { status: 404 });
    }

    // Track the click
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    await supabase.from('referral_clicks').insert({
      referral_code: referralCode,
      referrer_id: baker.id,
      ip_address: ipAddress,
      user_agent: userAgent,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking referral click:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
