'use client';

import { Plus, TrendingUp, Users, ShoppingBag, Clock, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { DailySurveyModal } from '@/components/DailySurveyModal';

export default function DashboardPage() {
  return (
    <div className="animate-in fade-in duration-700">
      <DailySurveyModal />
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-serif font-black text-secondary">Welcome back, Baker! 🍰</h1>
          <p className="text-gray-500 mt-2 font-medium">Your bakery is looking sweet today. Here's your overview.</p>
        </div>
        <Link href="/dashboard/designs/new" className="btn btn-primary px-8 py-4 text-lg shadow-xl shadow-pink-100 flex items-center gap-3 group">
          <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
          Create New Design
        </Link>
      </div>

      {/* Stats & Survey Grid */}
      <div className="grid lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <StatCard 
            icon={<ShoppingBag className="w-6 h-6 text-blue-600" />}
            label="Active Orders"
            value="12"
            change="+2 this week"
            bgColor="bg-blue-50"
          />
          <StatCard 
            icon={<Clock className="w-6 h-6 text-orange-600" />}
            label="Pending Quotes"
            value="5"
            change="3 urgent"
            bgColor="bg-orange-50"
          />
          <StatCard 
            icon={<TrendingUp className="w-6 h-6 text-green-600" />}
            label="Revenue (Feb)"
            value="$2,450"
            change="+15% vs Jan"
            bgColor="bg-green-50"
          />
          <StatCard 
            icon={<Users className="w-6 h-6 text-purple-600" />}
            label="New Leads"
            value="24"
            change="Last 30 days"
            bgColor="bg-purple-50"
          />
        </div>
        <div className="lg:col-span-1">
          {/* Support / Quick Help Card */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
            <h3 className="text-xl font-bold mb-4 text-secondary">Need Help?</h3>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
              Stuck on a design? Our beta support team is active 9am-5pm EST.
            </p>
            <a href="mailto:jmenichole007@outlook.com" className="btn btn-secondary w-full py-3 text-sm">
              Contact Support
            </a>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Orders */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-serif font-black text-secondary">Upcoming Orders</h2>
              <Link href="/dashboard/orders" className="text-primary text-sm font-bold hover:underline flex items-center gap-1">
                View Schedule <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="space-y-4">
              <OrderRow 
                customer="Sarah Miller"
                cake="Floral Birthday Cake"
                date="Feb 12"
                status="Preparing"
                statusColor="bg-orange-100 text-orange-700"
              />
              <OrderRow 
                customer="John Doe"
                cake="Dinosaur Tiered Cake"
                date="Feb 14"
                status="Confirmed"
                statusColor="bg-blue-100 text-blue-700"
              />
              <OrderRow 
                customer="Emma Watson"
                cake="Minimalist Wedding"
                date="Feb 18"
                status="Paid"
                statusColor="bg-green-100 text-green-700"
              />
            </div>
          </div>
        </div>

        {/* Quick Tips / AI Status */}
        <div className="space-y-8">
          <div className="bg-secondary text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-pink-500 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity" />
            <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-pink-400" /> AI Training
            </h3>
            <p className="text-sm text-gray-300 leading-relaxed mb-6">
              Upload 5 more photos of your "Vintage Style" cakes to improve mockup accuracy.
            </p>
            <Link href="/dashboard/settings" className="btn bg-white/10 hover:bg-white/20 text-white w-full py-3 text-sm rounded-2xl font-bold">
              Improve AI Style
            </Link>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
            <h3 className="text-xl font-bold mb-6 text-secondary">Production Flow</h3>
            <div className="space-y-6">
              <ProgressItem label="Baking" progress={80} color="bg-orange-400" />
              <ProgressItem label="Decorating" progress={30} color="bg-pink-400" />
              <ProgressItem label="Deliveries" progress={10} color="bg-blue-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Sparkles({ className }: any) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
    </svg>
  );
}

function StatCard({ icon, label, value, change, bgColor }: any) {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className={`w-14 h-14 ${bgColor} rounded-2xl flex items-center justify-center mb-6`}>
        {icon}
      </div>
      <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{label}</p>
      <h3 className="text-3xl font-black mt-2 text-secondary">{value}</h3>
      <p className="text-[10px] text-gray-400 mt-3 font-bold bg-gray-50 inline-block px-2 py-1 rounded-lg italic">{change}</p>
    </div>
  );
}

function OrderRow({ customer, cake, date, status, statusColor }: any) {
  return (
    <div className="flex items-center justify-between p-6 rounded-[2rem] border border-gray-50 hover:bg-gray-50 hover:border-pink-50 transition-all duration-300 group">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-pink-50 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">🎂</div>
        <div>
          <h4 className="font-bold text-secondary">{customer}</h4>
          <p className="text-xs text-gray-400 font-medium">{cake}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm font-bold text-secondary mb-1">{date}</p>
        <span className={`text-[9px] px-3 py-1 rounded-full font-black uppercase tracking-widest ${statusColor}`}>
          {status}
        </span>
      </div>
    </div>
  );
}

function ProgressItem({ label, progress, color }: any) {
  return (
    <div>
      <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
        <span>{label}</span>
        <span>{progress}%</span>
      </div>
      <div className="w-full h-2.5 bg-gray-50 rounded-full overflow-hidden p-0.5 border border-gray-100">
        <div 
          className={`h-full ${color} rounded-full transition-all duration-1000 shadow-sm`} 
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
