'use client';

import { useState } from 'react';
import { createBrowserClient } from '@/lib/supabase';
import { X, ShoppingBag, Calendar, DollarSign, User, Mail, Phone, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

interface NewOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export function NewOrderModal({ isOpen, onClose, onCreated }: NewOrderModalProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [form, setForm] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    description: '',
    totalPrice: '',
    deliveryDate: '',
    notes: '',
    status: 'pending' as string,
  });

  const supabase = createBrowserClient();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!form.customerName.trim()) {
      setMessage({ type: 'error', text: 'Customer name is required.' });
      return;
    }
    if (!form.customerEmail.trim()) {
      setMessage({ type: 'error', text: 'Customer email is required.' });
      return;
    }
    if (!form.totalPrice || parseFloat(form.totalPrice) <= 0) {
      setMessage({ type: 'error', text: 'Please enter a valid price.' });
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setMessage({ type: 'error', text: 'You must be logged in.' });
        return;
      }

      const { error } = await supabase.from('orders').insert({
        baker_id: user.id,
        customer_name: form.customerName.trim(),
        customer_email: form.customerEmail.trim(),
        customer_phone: form.customerPhone.trim() || null,
        total_price: parseFloat(form.totalPrice),
        delivery_date: form.deliveryDate ? new Date(form.deliveryDate).toISOString() : null,
        notes: form.notes.trim() || null,
        status: form.status,
      });

      if (error) throw error;

      setForm({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        description: '',
        totalPrice: '',
        deliveryDate: '',
        notes: '',
        status: 'pending',
      });
      onCreated();
    } catch (error: any) {
      console.error('Error creating order:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to create order.' });
    } finally {
      setLoading(false);
    }
  };

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'paid', label: 'Paid' },
    { value: 'preparing', label: 'Preparing' },
    { value: 'ready', label: 'Ready' },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-[2rem] max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 p-6 rounded-t-[2rem] flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black text-secondary flex items-center gap-3">
              <ShoppingBag className="w-6 h-6 text-primary" /> New Order
            </h2>
            <p className="text-xs text-gray-400 mt-1">Add a manual order without a design</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Customer Info */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
              <User className="w-3.5 h-3.5" /> Customer Info
            </h3>
            <input
              type="text"
              value={form.customerName}
              onChange={(e) => setForm({ ...form, customerName: e.target.value })}
              placeholder="Customer name *"
              className="w-full p-3 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              required
            />
            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                <input
                  type="email"
                  value={form.customerEmail}
                  onChange={(e) => setForm({ ...form, customerEmail: e.target.value })}
                  placeholder="Email *"
                  className="w-full pl-10 pr-3 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  required
                />
              </div>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                <input
                  type="tel"
                  value={form.customerPhone}
                  onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
                  placeholder="Phone (optional)"
                  className="w-full pl-10 pr-3 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
              <FileText className="w-3.5 h-3.5" /> Order Details
            </h3>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="What are they ordering? (e.g. 3-tier vanilla wedding cake with pink roses)"
              rows={3}
              className="w-full p-3 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
            />
            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.totalPrice}
                  onChange={(e) => setForm({ ...form, totalPrice: e.target.value })}
                  placeholder="Total price *"
                  className="w-full pl-10 pr-3 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  required
                />
              </div>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                <input
                  type="date"
                  value={form.deliveryDate}
                  onChange={(e) => setForm({ ...form, deliveryDate: e.target.value })}
                  className="w-full pl-10 pr-3 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1 mb-2 block">Status</label>
              <div className="flex flex-wrap gap-2">
                {statusOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setForm({ ...form, status: opt.value })}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                      form.status === opt.value
                        ? 'bg-primary border-primary text-white shadow-md'
                        : 'bg-white border-gray-100 text-gray-400 hover:border-pink-200 hover:text-primary'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Internal notes (allergies, special requests, etc.)"
              rows={2}
              className="w-full p-3 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
            />
          </div>

          {/* Message */}
          {message && (
            <div className={`p-3 rounded-xl flex items-center gap-2 text-sm ${
              message.type === 'success'
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              {message.text}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn btn-secondary py-3 text-sm"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 btn btn-primary py-3 text-sm shadow-lg shadow-pink-100 flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              {loading ? 'Creating...' : 'Create Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
