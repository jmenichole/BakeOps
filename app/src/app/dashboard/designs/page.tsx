'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@/lib/supabase';
import { Plus, Search, Filter, MoreVertical, ExternalLink, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function DesignListPage() {
  const [designs, setDesigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createBrowserClient();

  useEffect(() => {
    async function fetchDesigns() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('cake_designs')
        .select('*')
        .eq('baker_id', user.id)
        .order('created_at', { ascending: false });

      setDesigns(data || []);
      setLoading(false);
    }
    fetchDesigns();
  }, [supabase]);

  const deleteDesign = async (id: string) => {
    if (!confirm('Are you sure you want to delete this design?')) return;
    const { error } = await supabase.from('cake_designs').delete().eq('id', id);
    if (!error) {
      setDesigns(designs.filter(d => d.id !== id));
    }
  };

  return (
    <div className="animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-serif font-black text-secondary">My Designs</h1>
          <p className="text-gray-500 mt-2 font-medium text-sm">Review and manage your AI-generated cake concepts.</p>
        </div>
        <Link href="/dashboard/designs/new" className="btn btn-primary px-8 py-4 flex items-center gap-3 shadow-xl shadow-pink-100">
          <Plus className="w-5 h-5" /> New Design
        </Link>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-wrap gap-4 mb-10">
        <div className="flex-1 min-w-[300px] relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search designs by theme or client..."
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-100 bg-white focus:ring-4 focus:ring-primary/10 outline-none transition-all text-sm"
          />
        </div>
        <button className="btn btn-secondary py-3 px-5 flex items-center gap-2 text-sm">
          <Filter className="w-4 h-4" /> Filters
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map(n => (
            <div key={n} className="aspect-[4/5] bg-white rounded-[2rem] animate-pulse border border-gray-50" />
          ))}
        </div>
      ) : designs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {designs.map((design) => (
            <div key={design.id} className="card-bake group overflow-hidden p-0">
              <div className="aspect-square relative overflow-hidden bg-gray-50">
                {design.image_url ? (
                  <img src={design.image_url} alt={design.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-200">
                    <Plus className="w-12 h-12" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                  <div className="flex gap-2 w-full">
                    <button className="flex-1 btn glass text-secondary bg-white py-2 text-xs font-bold">View Detail</button>
                    <button onClick={() => deleteDesign(design.id)} className="p-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-secondary truncate pr-4">{design.title}</h3>
                  <span className="text-primary font-black text-sm">${design.estimated_price}</span>
                </div>
                <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                  {design.description || 'No description provided.'}
                </p>
                <div className="mt-6 pt-4 border-t border-gray-50 flex justify-between items-center">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    {new Date(design.created_at).toLocaleDateString()}
                  </span>
                  <ExternalLink className="w-4 h-4 text-gray-300" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 card-bake bg-white border-dashed border-gray-200">
          <div className="w-20 h-20 bg-pink-50 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <Plus className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-serif font-black text-secondary mb-2">No designs yet</h2>
          <p className="text-gray-500 mb-10 max-w-sm mx-auto">Start using our AI Configurator to turn your ideas into beautiful cake mockups and accurate quotes.</p>
          <Link href="/dashboard/designs/new" className="btn btn-primary px-8 py-4">Create Your First Design</Link>
        </div>
      )}
    </div>
  );
}
