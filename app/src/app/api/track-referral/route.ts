import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_SECRET_KEY!;

export async function POST(request: NextRequest) {
  try {
    const { referralCode } = await request.json();

    if (!referralCode) {
      return NextResponse.json({ error: 'Referral code is required' }, { status: 400 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

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
