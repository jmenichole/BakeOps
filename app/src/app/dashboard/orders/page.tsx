'use client';

import { useState, useEffect, useCallback } from 'react';
import { createBrowserClient } from '@/lib/supabase';
import { Plus, Search, Filter, MoreVertical, ExternalLink, Trash2, Mail, Phone, Calendar, CreditCard, ClipboardPlus, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { OrderManagementModal } from '@/components/OrderManagementModal';
import { NewOrderModal } from '@/components/NewOrderModal';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Order } from '@/types/database';


export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showNewOrderModal, setShowNewOrderModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const supabase = createBrowserClient();

  const fetchOrders = useCallback(async () => {
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

    setOrders((data as any) || []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const filteredOrders = orders.filter(order => {
    const searchString = searchQuery.toLowerCase();
    const customerName = (order.customer_name || '').toLowerCase();
    const designTitle = (order.cake_designs?.title || '').toLowerCase();
    const matchesSearch = customerName.includes(searchString) || designTitle.includes(searchString);
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusOptions = [
    { id: 'all', label: 'All Orders' },
    { id: 'pending', label: 'Pending' },
    { id: 'confirmed', label: 'Confirmed' },
    { id: 'preparing', label: 'Preparing' },
    { id: 'ready', label: 'Ready' },
    { id: 'delivered', label: 'Delivered' },
    { id: 'cancelled', label: 'Cancelled' }
  ];

  return (
    <div className="animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-serif font-black text-secondary">Orders</h1>
          <p className="text-gray-500 mt-2 font-medium text-sm">Track and manage your customer orders.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowNewOrderModal(true)}
            className="btn btn-secondary px-6 py-4 flex items-center gap-2"
          >
            <ClipboardPlus className="w-5 h-5" /> Manual Order
          </button>
          <Link href="/dashboard/designs/new" className="btn btn-primary px-6 py-4 flex items-center gap-3 shadow-xl shadow-pink-100">
            <Plus className="w-5 h-5" /> New Quote
          </Link>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-wrap gap-4 mb-10 relative">
        <div className="flex-1 min-w-[300px] relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search orders by customer or design..."
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-100 bg-white focus:ring-4 focus:ring-primary/10 outline-none transition-all text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="relative">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`btn py-3 px-5 flex items-center gap-2 text-sm transition-all ${statusFilter !== 'all' ? 'btn-primary shadow-md' : 'btn-secondary'}`}
          >
            <Filter className="w-4 h-4" />
            {statusFilter === 'all' ? 'Filters' : statusOptions.find(o => o.id === statusFilter)?.label}
          </button>

          {showFilters && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95">
              {statusOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => {
                    setStatusFilter(option.id);
                    setShowFilters(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-sm hover:bg-pink-50 transition-colors flex items-center justify-between ${statusFilter === option.id ? 'text-primary font-bold' : 'text-gray-600'}`}
                >
                  {option.label}
                  {statusFilter === option.id && <CheckCircle2 className="w-4 h-4" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(n => (
            <div key={n} className="h-24 bg-white rounded-2xl animate-pulse border border-gray-50" />
          ))}
        </div>
      ) : filteredOrders.length > 0 ? (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
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
                  <StatusBadge status={order.status} />
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
          <h2 className="text-2xl font-serif font-black text-secondary mb-2">
            {searchQuery ? 'No matching orders' : 'No orders yet'}
          </h2>
          <p className="text-gray-500 mb-10 max-w-sm mx-auto">
            {searchQuery ? 'Try adjusting your search terms.' : 'Create a design and send a quote to a client to start getting orders.'}
          </p>
          {!searchQuery && (
            <Link href="/dashboard/designs/new" className="btn btn-primary px-8 py-4">Create Your First Quote</Link>
          )}
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

      <NewOrderModal
        isOpen={showNewOrderModal}
        onClose={() => setShowNewOrderModal(false)}
        onCreated={() => {
          setShowNewOrderModal(false);
          fetchOrders();
        }}
      />
    </div>
  );
}
