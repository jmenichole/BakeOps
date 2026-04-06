import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

function serviceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_SECRET_KEY!
  );
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;

  if (!token || !/^[0-9a-f-]{36}$/.test(token)) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 400 });
  }

  const supabase = serviceClient();

  const { data, error } = await supabase
    .from('orders')
    .select(`
      id,
      status,
      customer_name,
      customer_email,
      total_price,
      delivery_date,
      notes,
      tracking_token,
      created_at,
      cake_designs (
        title,
        image_url
      )
    `)
    .eq('tracking_token', token)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }

  return NextResponse.json({ order: data });
}
