'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import {
  CheckCircle2,
  Clock,
  Package,
  Truck,
  ChefHat,
  XCircle,
  Info,
  Loader2,
  Calendar,
  DollarSign,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface TrackingOrder {
  id: string;
  status: string;
  customer_name: string | null;
  customer_email: string;
  total_price: number;
  delivery_date: string | null;
  notes: string | null;
  tracking_token: string;
  cake_designs: {
    title: string | null;
    image_url: string | null;
  } | null;
}

const STATUS_STEPS = [
  { key: 'pending', label: 'Order Received', icon: Clock },
  { key: 'confirmed', label: 'Confirmed', icon: CheckCircle2 },
  { key: 'preparing', label: 'Being Made', icon: ChefHat },
  { key: 'ready', label: 'Ready', icon: Package },
  { key: 'delivered', label: 'Delivered', icon: Truck },
];

const STATUS_MESSAGES: Record<string, { headline: string; body: string }> = {
  pending: {
    headline: "We've received your order!",
    body: 'Your baker is reviewing the details. You can confirm your order below to let them know you\'re ready to proceed.',
  },
  confirmed: {
    headline: 'Your order is confirmed 🎉',
    body: 'Your baker has confirmed and will be in touch to finalise any details before getting started.',
  },
  paid: {
    headline: 'Payment received — thank you!',
    body: "Your baker has recorded your payment and will now get started on creating your custom cake.",
  },
  preparing: {
    headline: "Your cake is being made! 🎂",
    body: 'Your baker is hard at work crafting your custom creation. We\'ll update you when it\'s ready.',
  },
  ready: {
    headline: 'Your order is ready! 🥳',
    body: "Your cake is finished and ready for pickup or delivery. Your baker will be in touch to arrange next steps.",
  },
  delivered: {
    headline: 'Delivered — enjoy every slice! 🍰',
    body: 'Your order has been delivered. We hope everything is perfect. Thank you for choosing a custom cake!',
  },
  cancelled: {
    headline: 'Order cancelled',
    body: 'This order has been cancelled. If you have any questions please contact your baker.',
  },
};

function getStepIndex(status: string): number {
  const idx = STATUS_STEPS.findIndex((s) => s.key === status);
  return idx === -1 ? 0 : idx;
}

export default function OrderTrackingPage() {
  const { token } = useParams<{ token: string }>();
  const [order, setOrder] = useState<TrackingOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const fetchOrder = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(`/api/order-tracking/${token}`);
      if (!res.ok) {
        setNotFound(true);
        return;
      }
      const { order: data } = await res.json();
      setOrder(data);
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  const handleAction = async (action: 'confirm' | 'cancel') => {
    setActionError(null);
    setActionSuccess(null);
    setActionLoading(true);
    try {
      const res = await fetch('/api/order-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, action }),
      });
      const json = await res.json();
      if (!res.ok) {
        setActionError(json.error || 'Something went wrong. Please try again.');
        return;
      }
      setActionSuccess(
        action === 'confirm'
          ? 'Order confirmed! Your baker has been notified.'
          : 'Cancellation request sent. Your baker will be in touch.'
      );
      await fetchOrder();
    } catch {
      setActionError('Something went wrong. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF9F9]">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  if (notFound || !order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#FFF9F9] text-center">
        <div className="w-20 h-20 bg-pink-50 rounded-3xl flex items-center justify-center mb-8">
          <Info className="w-10 h-10 text-pink-300" />
        </div>
        <h1 className="text-3xl font-serif font-black text-secondary mb-4">Order Not Found</h1>
        <p className="text-gray-500 mb-8 max-w-sm">
          This order tracking link may be invalid or expired. Please contact your baker directly.
        </p>
        <Link href="/" className="btn btn-primary px-8">
          Back to Home
        </Link>
      </div>
    );
  }

  const isCancelled = order.status === 'cancelled';
  const message = STATUS_MESSAGES[order.status] ?? STATUS_MESSAGES['pending'];
  const currentStepIndex = getStepIndex(order.status);
  const canConfirm = order.status === 'pending';
  const canCancel = order.status === 'pending' || order.status === 'confirmed';

  return (
    <main className="min-h-screen bg-[#FFF9F9] pb-16 selection:bg-pink-100">
      {/* Header */}
      <nav className="bg-white/80 backdrop-blur-xl border-b border-gray-100/50 sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-serif font-black text-secondary">
            Bake Ops
          </Link>
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-pink-50 px-3 py-1.5 rounded-full border border-pink-100">
            Order Tracking
          </span>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 pt-10 space-y-8">
        {/* Status Headline */}
        <div>
          <h1 className="text-3xl font-serif font-black text-secondary leading-tight">
            {message.headline}
          </h1>
          <p className="text-gray-500 mt-3 leading-relaxed">{message.body}</p>
        </div>

        {/* Progress Timeline */}
        {!isCancelled && (
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6">
            <h2 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-6">Order Progress</h2>
            <div className="flex items-start gap-0">
              {STATUS_STEPS.map((step, idx) => {
                const isDone = idx < currentStepIndex;
                const isCurrent = idx === currentStepIndex;
                const Icon = step.icon;
                return (
                  <div key={step.key} className="flex-1 flex flex-col items-center gap-2">
                    <div className="flex items-center w-full">
                      {idx > 0 && (
                        <div
                          className={`flex-1 h-0.5 transition-colors ${
                            isDone || isCurrent ? 'bg-primary' : 'bg-gray-100'
                          }`}
                        />
                      )}
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all ${
                          isDone
                            ? 'bg-primary text-white'
                            : isCurrent
                            ? 'bg-primary/10 text-primary ring-2 ring-primary ring-offset-2'
                            : 'bg-gray-50 text-gray-300'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      {idx < STATUS_STEPS.length - 1 && (
                        <div
                          className={`flex-1 h-0.5 transition-colors ${
                            isDone ? 'bg-primary' : 'bg-gray-100'
                          }`}
                        />
                      )}
                    </div>
                    <span
                      className={`text-[10px] font-bold text-center leading-tight ${
                        isCurrent ? 'text-primary' : isDone ? 'text-secondary' : 'text-gray-300'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {isCancelled && (
          <div className="bg-red-50 border border-red-100 rounded-[2rem] p-6 flex items-center gap-4">
            <XCircle className="w-8 h-8 text-red-400 shrink-0" />
            <div>
              <p className="font-bold text-red-700">This order has been cancelled</p>
              <p className="text-sm text-red-500 mt-1">
                If you believe this is a mistake, please contact your baker directly.
              </p>
            </div>
          </div>
        )}

        {/* Order Details */}
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
          {order.cake_designs?.image_url && (
            <div className="relative h-48 w-full">
              <Image
                src={order.cake_designs.image_url}
                alt={order.cake_designs.title || 'Cake design'}
                fill
                className="object-cover"
                unoptimized={order.cake_designs.image_url.startsWith('data:')}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              {order.cake_designs.title && (
                <p className="absolute bottom-4 left-6 text-white font-bold text-lg">
                  {order.cake_designs.title}
                </p>
              )}
            </div>
          )}

          <div className="p-6 space-y-4">
            <h2 className="text-xs font-black uppercase tracking-widest text-gray-400">Order Summary</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-2xl">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1 mb-1">
                  <DollarSign className="w-3 h-3" /> Total
                </p>
                <p className="text-xl font-black text-secondary">${Number(order.total_price).toFixed(2)}</p>
              </div>
              {order.delivery_date && (
                <div className="p-4 bg-gray-50 rounded-2xl">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1 mb-1">
                    <Calendar className="w-3 h-3" /> Delivery
                  </p>
                  <p className="text-sm font-black text-secondary">
                    {new Date(order.delivery_date).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              )}
            </div>
            {order.notes && (
              <div className="p-4 bg-pink-50 rounded-2xl">
                <p className="text-[10px] font-bold text-pink-400 uppercase tracking-widest mb-1">Notes</p>
                <p className="text-sm text-pink-900">{order.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Action Feedback */}
        {actionSuccess && (
          <div className="bg-green-50 border border-green-100 text-green-700 rounded-2xl p-4 flex items-center gap-3 text-sm font-medium">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            {actionSuccess}
          </div>
        )}
        {actionError && (
          <div className="bg-red-50 border border-red-100 text-red-700 rounded-2xl p-4 flex items-center gap-3 text-sm font-medium">
            <XCircle className="w-5 h-5 shrink-0" />
            {actionError}
          </div>
        )}

        {/* Customer Actions */}
        {(canConfirm || canCancel) && (
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6 space-y-4">
            <h2 className="text-xs font-black uppercase tracking-widest text-gray-400">Actions</h2>
            <div className="flex gap-3 flex-wrap">
              {canConfirm && (
                <button
                  onClick={() => handleAction('confirm')}
                  disabled={actionLoading}
                  className="flex-1 btn btn-primary py-3 flex items-center justify-center gap-2 min-w-[140px]"
                >
                  {actionLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                  Accept Order
                </button>
              )}
              {canCancel && (
                <button
                  onClick={() => handleAction('cancel')}
                  disabled={actionLoading}
                  className="flex-1 btn btn-secondary py-3 flex items-center justify-center gap-2 text-red-500 border-red-100 hover:bg-red-50 min-w-[140px]"
                >
                  {actionLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <XCircle className="w-4 h-4" />
                  )}
                  Cancel Order
                </button>
              )}
            </div>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              {canConfirm
                ? 'Accepting notifies your baker you\'re ready to proceed. You can still cancel before baking begins.'
                : 'You can cancel your order before preparation begins. Contact your baker for further assistance.'}
            </p>
          </div>
        )}

        <p className="text-center text-xs text-gray-400 pb-4">
          Order ID: {order.id.slice(0, 8).toUpperCase()} &middot; Questions?{' '}
          <a href="mailto:support@bakeops.com" className="text-primary hover:underline">
            Contact support
          </a>
        </p>
      </div>
    </main>
  );
}
