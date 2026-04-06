import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { escapeHtml } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const ALLOWED_ACTIONS: Record<string, string[]> = {
  confirm: ['pending'],
  cancel: ['pending', 'confirmed'],
};

function serviceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_SECRET_KEY!
  );
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { token, action } = body as { token: string; action: string };

    if (!token || !/^[0-9a-f-]{36}$/.test(token)) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 400 });
    }

    if (!action || !ALLOWED_ACTIONS[action]) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    const supabase = serviceClient();

    // Fetch order by tracking token
    const { data: order, error: fetchError } = await supabase
      .from('orders')
      .select('id, status, customer_name, customer_email, tracking_token')
      .eq('tracking_token', token)
      .single();

    if (fetchError || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Validate the current status allows this action
    const allowedFromStatuses = ALLOWED_ACTIONS[action];
    if (!allowedFromStatuses.includes(order.status)) {
      return NextResponse.json(
        { error: `Cannot ${action} an order with status "${order.status}"` },
        { status: 409 }
      );
    }

    const newStatus = action === 'confirm' ? 'confirmed' : 'cancelled';

    const { error: updateError } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', order.id);

    if (updateError) throw updateError;

    // Send confirmation email to customer
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      const resend = new Resend(resendKey);
      const name = escapeHtml(order.customer_name || 'there');
      const subject =
        action === 'confirm'
          ? 'Your order has been confirmed — Bake Ops'
          : 'Your order cancellation request received — Bake Ops';

      const bodyHtml =
        action === 'confirm'
          ? `<p>Hi ${name},</p><p>You've confirmed your order. Your baker has been notified and will be in touch to finalise details.</p>`
          : `<p>Hi ${name},</p><p>We've received your cancellation request. Your baker will be in contact to confirm.</p>`;

      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL ?? 'Bake Ops <quotes@resend.dev>',
        to: [order.customer_email],
        subject,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
            <div style="background:#1a1a2e;padding:32px;text-align:center">
              <h1 style="color:#fff;font-size:24px;margin:0;font-family:Georgia,serif">Bake Ops</h1>
            </div>
            <div style="padding:32px">${bodyHtml}</div>
            <div style="border-top:1px solid #f3f4f6;padding:16px 32px;text-align:center">
              <p style="color:#d1d5db;font-size:11px;margin:0">Powered by <a href="https://bakeops.com" style="color:#f472b6">Bake Ops</a></p>
            </div>
          </div>
        `,
      });
    }

    return NextResponse.json({ success: true, newStatus });
  } catch (error) {
    console.error('order-action error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
