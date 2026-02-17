'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@/lib/supabase';
import { Plus, Search, Filter, MoreVertical, ExternalLink, Trash2, Mail, Phone, Calendar, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { OrderManagementModal } from '@/components/OrderManagementModal';

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const supabase = createBrowserClient();

  const fetchOrders = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('orders')
      .select(`
        *,
        cake_designs (title, image_url)
      `)
      .eq('baker_id', user.id)
      .order('created_at', { ascending: false });

    setOrders(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, [supabase]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'preparing': return 'bg-orange-50 text-orange-600 border-orange-100';
      case 'ready': return 'bg-purple-50 text-purple-600 border-purple-100';
      case 'delivered': return 'bg-green-50 text-green-600 border-green-100';
      case 'cancelled': return 'bg-red-50 text-red-600 border-red-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  return (
    <div className="animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-serif font-black text-secondary">Orders</h1>
          <p className="text-gray-500 mt-2 font-medium text-sm">Track and manage your customer orders.</p>
        </div>
        <Link href="/dashboard/designs/new" className="btn btn-primary px-8 py-4 flex items-center gap-3 shadow-xl shadow-pink-100">
          <Plus className="w-5 h-5" /> New Quote
        </Link>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-wrap gap-4 mb-10">
        <div className="flex-1 min-w-[300px] relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search orders by customer or design..."
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-100 bg-white focus:ring-4 focus:ring-primary/10 outline-none transition-all text-sm"
          />
        </div>
        <button className="btn btn-secondary py-3 px-5 flex items-center gap-2 text-sm">
          <Filter className="w-4 h-4" /> Filters
        </button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(n => (
            <div key={n} className="h-24 bg-white rounded-2xl animate-pulse border border-gray-50" />
          ))}
        </div>
      ) : orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="card-bake p-6 flex flex-col md:flex-row gap-6 items-start md:items-center">
              {/* Design Image */}
              <div className="w-20 h-20 bg-gray-50 rounded-2xl overflow-hidden flex-shrink-0">
                {order.cake_designs?.image_url ? (
                  <img src={order.cake_designs.image_url} alt={order.cake_designs.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl">🎂</div>
                )}
              </div>

              {/* Order Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <h3 className="font-bold text-secondary">{order.customer_name || 'Anonymous'}</h3>
                    <p className="text-xs text-gray-400 font-medium">{order.cake_designs?.title || 'Custom Design'}</p>
                  </div>
                  <span className={`text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest border ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-4 mt-3 text-xs text-gray-500">
                  {order.customer_email && (
                    <span className="flex items-center gap-1">
                      <Mail className="w-3 h-3" /> {order.customer_email}
                    </span>
                  )}
                  {order.customer_phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3" /> {order.customer_phone}
                    </span>
                  )}
                  {order.delivery_date && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {new Date(order.delivery_date).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>

              {/* Price & Actions */}
              <div className="flex items-center gap-4 flex-shrink-0">
                <div className="text-right">
                  <p className="text-xl font-black text-secondary">${order.total_price}</p>
                  {order.is_paid && (
                    <span className="text-[10px] flex items-center gap-1 text-green-600 font-bold">
                      <CreditCard className="w-3 h-3" /> PAID
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setSelectedOrder(order)}
                  className="p-2 hover:bg-gray-50 rounded-xl transition-colors"
                  title="Manage order"
                >
                  <MoreVertical className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 card-bake bg-white border-dashed border-gray-200">
          <div className="w-20 h-20 bg-pink-50 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <Plus className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-serif font-black text-secondary mb-2">No orders yet</h2>
          <p className="text-gray-500 mb-10 max-w-sm mx-auto">Create a design and send a quote to a client to start getting orders.</p>
          <Link href="/dashboard/designs/new" className="btn btn-primary px-8 py-4">Create Your First Quote</Link>
        </div>
      )}

      <OrderManagementModal
        isOpen={!!selectedOrder}
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onUpdate={() => {
          fetchOrders();
          setSelectedOrder(null);
        }}
      />
    </div>
  );
}
