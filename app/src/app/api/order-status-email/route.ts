import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { getAuthUser } from '@/lib/auth';
import { escapeHtml } from '@/lib/auth';
import { rateLimit } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://bakebot-sigma.vercel.app';

const STATUS_LABELS: Record<string, { subject: string; headline: string; body: string }> = {
  created: {
    subject: 'Your order has been received — Bake Ops',
    headline: "We've received your order!",
    body: "Thank you for placing your order. Your baker is reviewing the details and will be in touch to confirm everything shortly.",
  },
  pending: {
    subject: 'Your order has been received — Bake Ops',
    headline: "We've received your order!",
    body: "Thank you for placing your order. Your baker is reviewing the details and will be in touch to confirm everything shortly.",
  },
  confirmed: {
    subject: 'Your order has been confirmed — Bake Ops',
    headline: 'Your order is confirmed! 🎉',
    body: "Great news — your baker has confirmed your order and the magic is about to begin.",
  },
  paid: {
    subject: 'Payment received for your order — Bake Ops',
    headline: 'Payment received — thank you!',
    body: "We've recorded your payment. Your baker will now get started on your order.",
  },
  preparing: {
    subject: "We're baking your cake! — Bake Ops",
    headline: "Your cake is being made! 🎂",
    body: "Exciting news — your baker has started preparing your order. Stay tuned for updates.",
  },
  ready: {
    subject: 'Your order is ready — Bake Ops',
    headline: "Your order is ready! 🥳",
    body: "Your cake is finished and ready for pickup or delivery. Your baker will be in touch to arrange the next steps.",
  },
  delivered: {
    subject: 'Your order has been delivered — Bake Ops',
    headline: "Delivered! Enjoy every slice 🍰",
    body: "Your order has been marked as delivered. We hope everything is perfect! If you have any questions please contact your baker.",
  },
  cancelled: {
    subject: 'Your order has been cancelled — Bake Ops',
    headline: 'Your order has been cancelled',
    body: "Your order has been cancelled. If you have any questions or this was a mistake, please contact your baker directly.",
  },
};

function serviceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_SECRET_KEY!
  );
}

export async function POST(req: Request) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const limited = rateLimit(`order-status-email:${user.id}`, { maxRequests: 60, windowMs: 60 * 60_000 });
    if (limited) return limited;

    const body = await req.json();
    const { orderId, event } = body as { orderId: string; event: string };

    if (!orderId || !event) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const resendKey = process.env.RESEND_API_KEY;
    if (!resendKey) {
      return NextResponse.json({ success: true, skipped: true });
    }

    const supabase = serviceClient();

    // Fetch order and verify it belongs to the authenticated baker
    const { data: order, error: fetchError } = await supabase
      .from('orders')
      .select('id, status, customer_name, customer_email, total_price, delivery_date, tracking_token')
      .eq('id', orderId)
      .eq('baker_id', user.id)
      .single();

    if (fetchError || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const template = STATUS_LABELS[event] ?? STATUS_LABELS[order.status];
    if (!template) {
      return NextResponse.json({ success: true, skipped: true });
    }

    const customerName = escapeHtml(order.customer_name || 'there');
    const trackingUrl = `${BASE_URL}/order/${order.tracking_token}`;
    const deliveryLine = order.delivery_date
      ? `<p style="color:#6b7280;font-size:14px;margin:8px 0 0"><strong>Delivery / Pickup:</strong> ${escapeHtml(new Date(order.delivery_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }))}</p>`
      : '';

    const resend = new Resend(resendKey);

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? 'Bake Ops <quotes@resend.dev>',
      to: [order.customer_email],
      replyTo: user.email ?? undefined,
      subject: template.subject,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#fff;border:1px solid #f3e8f0;border-radius:16px;overflow:hidden">
          <div style="background:#1a1a2e;padding:32px 32px 24px;text-align:center">
            <h1 style="color:#fff;font-size:28px;margin:0;font-family:Georgia,serif">Bake Ops</h1>
            <p style="color:#f472b6;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;margin:8px 0 0">Order Update</p>
          </div>

          <div style="padding:40px 32px">
            <p style="color:#374151;font-size:16px;margin:0 0 8px">Hi ${customerName},</p>
            <h2 style="color:#1a1a2e;font-size:22px;margin:16px 0 8px">${template.headline}</h2>
            <p style="color:#6b7280;font-size:15px;line-height:1.6;margin:0 0 24px">${template.body}</p>

            <div style="background:#fdf2f8;border-radius:12px;padding:20px 24px;margin-bottom:28px">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
                <span style="color:#6b7280;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.1em">Order Total</span>
                <span style="color:#1a1a2e;font-size:24px;font-weight:900">$${Number(order.total_price).toFixed(2)}</span>
              </div>
              ${deliveryLine}
            </div>

            <div style="text-align:center;margin-bottom:24px">
              <a href="${trackingUrl}"
                 style="display:inline-block;background:#f43f8c;color:#fff;font-weight:700;font-size:15px;padding:14px 36px;border-radius:12px;text-decoration:none">
                Track Your Order →
              </a>
            </div>

            <p style="color:#9ca3af;font-size:12px;margin:0;line-height:1.6">
              You can track your order status at any time by visiting your order page.
            </p>
          </div>

          <div style="border-top:1px solid #f3f4f6;padding:20px 32px;text-align:center">
            <p style="color:#d1d5db;font-size:11px;margin:0">
              Powered by <a href="https://bakeops.com" style="color:#f472b6;text-decoration:none">Bake Ops</a>
            </p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('order-status-email error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
