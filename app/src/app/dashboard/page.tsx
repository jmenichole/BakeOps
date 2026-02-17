'use client';

import { useState, useEffect } from 'react';
import { Plus, TrendingUp, Users, ShoppingBag, Clock, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { DailySurveyModal } from '@/components/DailySurveyModal';
import { createBrowserClient } from '@/lib/supabase';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    activeOrders: 0,
    pendingQuotes: 0,
    revenue: 0,
    newLeads: 0
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createBrowserClient();

  useEffect(() => {
    async function fetchDashboardData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch Stats
      const [ordersRes, designsRes, signupsRes] = await Promise.all([
        supabase.from('orders').select('*').eq('baker_id', user.id),
        supabase.from('cake_designs').select('*').eq('baker_id', user.id),
        supabase.from('waitlist_signups').select('id', { count: 'exact' }) // Placeholder for "leads"
      ]);

      const active = ordersRes.data?.filter(o => !['delivered', 'cancelled'].includes(o.status)).length || 0;
      const rev = ordersRes.data?.reduce((sum, o) => sum + (Number(o.total_price) || 0), 0) || 0;
      
      setStats({
        activeOrders: active,
        pendingQuotes: designsRes.data?.length || 0,
        revenue: rev,
        newLeads: signupsRes.count || 0
      });

      // Fetch Recent Orders
      const { data: orders } = await supabase
        .from('orders')
        .select(`
          id,
          customer_name,
          status,
          delivery_date,
          cake_designs (title)
        `)
        .eq('baker_id', user.id)
        .order('delivery_date', { ascending: true })
        .limit(3);

      setRecentOrders(orders || []);
      setLoading(false);
    }

    fetchDashboardData();
  }, [supabase]);

  return (
    <div className="animate-in fade-in duration-700 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <DailySurveyModal />
      
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10 sm:mb-16">
        <div>
          <span className="text-primary font-bold text-[10px] uppercase tracking-[0.2em] mb-2 block">Bakery Overview</span>
          <h1 className="text-3xl sm:text-5xl font-serif font-black text-secondary leading-tight">Welcome back, Baker.</h1>
          <p className="text-gray-500 mt-3 font-medium text-sm sm:text-base">Everything is rising perfectly. Ready to create today?</p>
        </div>
        <Link href="/dashboard/designs/new" className="btn btn-primary px-8 py-4 sm:py-5 text-base sm:text-lg shadow-xl shadow-pink-100 flex items-center justify-center gap-3 group whitespace-nowrap">
          <Plus className="w-5 h-5 sm:w-6 sm:h-6 group-hover:rotate-90 transition-transform duration-300" />
          New Cake Design
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-20">
        <StatCard 
          icon={<ShoppingBag className="w-6 h-6 text-primary" />}
          label="Active Orders"
          value={loading ? '...' : stats.activeOrders.toString()}
          change="+0 this week"
          bgColor="bg-pink-50"
        />
        <StatCard 
          icon={<Clock className="w-6 h-6 text-secondary" />}
          label="Live Designs"
          value={loading ? '...' : stats.pendingQuotes.toString()}
          change="Awaiting client"
          bgColor="bg-gray-100"
        />
        <StatCard 
          icon={<TrendingUp className="w-6 h-6 text-green-600" />}
          label="Total Revenue"
          value={loading ? '...' : `$${stats.revenue.toLocaleString()}`}
          change="All-time earnings"
          bgColor="bg-green-50"
        />
        <StatCard 
          icon={<Users className="w-6 h-6 text-blue-600" />}
          label="Network Reach"
          value={loading ? '...' : stats.newLeads.toString()}
          change="Community signups"
          bgColor="bg-blue-50"
        />
      </div>

      <div className="grid lg:grid-cols-12 gap-8 sm:gap-12">
        {/* Recent Orders */}
        <div className="lg:col-span-8 space-y-8 sm:space-y-12">
          <div className="card-bake">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 sm:mb-10">
              <div>
                <h2 className="text-2xl font-serif font-black text-secondary">Upcoming Schedule</h2>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Delivery Roadmap</p>
              </div>
              <Link href="/dashboard/production" className="text-primary text-sm font-bold hover:opacity-70 flex items-center gap-2 group">
                Full Calendar <ArrowUpRight className="w-4 h-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
            
            <div className="space-y-3 sm:space-y-4">
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <OrderRow 
                    key={order.id}
                    customer={order.customer_name || 'Anonymous'}
                    cake={order.cake_designs?.title || 'Custom Cake'}
                    date={new Date(order.delivery_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    status={order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    statusColor={getStatusColor(order.status)}
                  />
                ))
              ) : (
                <div className="text-center py-16 sm:py-24 border-2 border-dashed border-pink-50 rounded-[2rem] bg-pink-50/20">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm text-2xl">🍰</div>
                  <h3 className="text-secondary font-black text-lg mb-2">No orders in the oven</h3>
                  <p className="text-gray-400 font-medium mb-8 max-w-xs mx-auto text-sm">Create a design and send it to a client to get your first order confirmed.</p>
                  <Link href="/dashboard/designs/new" className="btn btn-secondary px-6 py-3 text-sm">Start Designing →</Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-8 sm:space-y-10">
          <div className="bg-secondary text-white p-8 sm:p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-48 h-48 bg-primary rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity" />
            <div className="relative z-10">
              <h3 className="text-xl sm:text-2xl font-bold mb-4 flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-primary" /> AI Mastery
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed mb-8 font-medium">
                Upload your portfolio to train our AI on your unique decorating style.
              </p>
              <Link href="/dashboard/settings" className="btn glass text-secondary bg-white w-full py-4 text-sm font-black hover:bg-pink-50 border-none">
                Improve My Style
              </Link>
            </div>
          </div>

          <div className="card-bake">
            <h3 className="text-xl font-bold mb-8 text-secondary">Beta Progress</h3>
            <div className="space-y-8">
              <ProgressItem label="Profile Setup" progress={40} color="bg-secondary" />
              <ProgressItem label="AI Training" progress={0} color="bg-primary" />
              <ProgressItem label="Order Proof" progress={stats.activeOrders > 0 ? 100 : 0} color="bg-green-500" />
            </div>
            <div className="mt-10 pt-8 border-t border-gray-50">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-4">Support</p>
              <a href="mailto:jmenichole007@outlook.com" className="text-sm font-bold text-secondary hover:text-primary transition-colors flex items-center gap-2">
                Contact Founder <Plus className="w-4 h-4 rotate-45" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getStatusColor(status: string) {
  switch (status) {
    case 'preparing': return 'bg-orange-50 text-orange-600 border border-orange-100';
    case 'confirmed': return 'bg-blue-50 text-blue-600 border border-blue-100';
    case 'paid': return 'bg-green-50 text-green-600 border border-green-100';
    default: return 'bg-gray-50 text-gray-600 border border-gray-100';
  }
}

function Sparkles({ className }: any) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
    </svg>
  );
}

function StatCard({ icon, label, value, change, bgColor }: any) {
  return (
    <div className="card-bake p-8">
      <div className={`w-14 h-14 ${bgColor} rounded-2xl flex items-center justify-center mb-6 border border-white shadow-sm`}>
        {icon}
      </div>
      <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.15em]">{label}</p>
      <h3 className="text-3xl font-black mt-2 text-secondary">{value}</h3>
      <p className="text-[10px] text-gray-400 mt-4 font-bold bg-gray-50/50 inline-block px-2 py-1 rounded-md border border-gray-100">{change}</p>
    </div>
  );
}

function OrderRow({ customer, cake, date, status, statusColor }: any) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 sm:p-6 rounded-2xl border border-gray-50 hover:border-pink-100 hover:bg-pink-50/30 transition-all duration-300 group gap-4">
      <div className="flex items-center gap-5">
        <div className="w-14 h-14 bg-white rounded-2xl border border-gray-100 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform shadow-sm">🎂</div>
        <div>
          <h4 className="font-black text-secondary group-hover:text-primary transition-colors">{customer}</h4>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">{cake}</p>
        </div>
      </div>
      <div className="flex items-center justify-between sm:justify-end sm:text-right gap-6 px-1 sm:px-0">
        <div>
          <p className="text-sm font-black text-secondary mb-1">{date}</p>
          <span className={`text-[9px] px-3 py-1 rounded-full font-black uppercase tracking-widest border ${statusColor}`}>
            {status}
          </span>
        </div>
        <ArrowUpRight className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors" />
      </div>
    </div>
  );
}

function ProgressItem({ label, progress, color }: any) {
  return (
    <div>
      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2.5">
        <span>{label}</span>
        <span>{progress}%</span>
      </div>
      <div className="w-full h-3 bg-gray-50 rounded-full overflow-hidden p-0.5 border border-gray-100">
        <div 
          className={`h-full ${color} rounded-full transition-all duration-1000 shadow-sm`} 
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
