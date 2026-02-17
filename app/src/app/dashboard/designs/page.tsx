'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { createBrowserClient } from '@/lib/supabase';
import { Plus, Search, Filter, MoreVertical, ExternalLink, Trash2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { DesignDetailModal } from '@/components/DesignDetailModal';

// TypeScript interfaces
interface Design {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  estimated_price: number;
  baker_id: string;
  created_at: string;
  updated_at: string | null;
}

interface User {
  id: string;
  email: string;
}

export default function DesignListPage() {
  const [designs, setDesigns] = useState<Design[]>([]);
  const [selectedDesign, setSelectedDesign] = useState<Design | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);

  // Memoize the Supabase client to prevent recreation on every render
  const supabase = useMemo(() => createBrowserClient(), []);

  // Filtered designs based on search query
  const filteredDesigns = useMemo(() => {
    if (!searchQuery.trim()) return designs;
    
    const query = searchQuery.toLowerCase();
    return designs.filter((design) => 
      design.title?.toLowerCase().includes(query) ||
      design.description?.toLowerCase().includes(query)
    );
  }, [designs, searchQuery]);

  useEffect(() => {
    async function fetchDesigns() {
      try {
        setError(null);
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          setError('Please log in to view your designs.');
          setLoading(false);
          return;
        }

        // Calculate date 30 days ago
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const thirtyDaysAgoISO = thirtyDaysAgo.toISOString();

        const { data, error: fetchError } = await supabase
          .from('cake_designs')
          .select('*')
          .eq('baker_id', user.id)
          .gte('created_at', thirtyDaysAgoISO)
          .order('created_at', { ascending: false })
          .limit(20);

        if (fetchError) {
          throw new Error(fetchError.message);
        }

        setDesigns(data || []);
      } catch (err) {
        console.error('Error fetching designs:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch designs');
      } finally {
        setLoading(false);
      }
    }
    fetchDesigns();
  }, [supabase]);

  // Authorization check before deletion - verify design belongs to current user
  const deleteDesign = async (id: string) => {
    if (!confirm('Are you sure you want to delete this design?')) return;
    
    try {
      // First, get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        alert('You must be logged in to delete a design.');
        return;
      }

      // Fetch the design to verify ownership
      const { data: design, error: fetchError } = await supabase
        .from('cake_designs')
        .select('baker_id')
        .eq('id', id)
        .single();

      if (fetchError) {
        throw new Error('Design not found');
      }

      // Authorization check - verify the design belongs to the current user
      if (design.baker_id !== user.id) {
        alert('You are not authorized to delete this design.');
        return;
      }

      // Proceed with deletion
      const { error: deleteError } = await supabase
        .from('cake_designs')
        .delete()
        .eq('id', id);

      if (deleteError) {
        throw new Error(deleteError.message);
      }

      // Update local state
      setDesigns(designs.filter(d => d.id !== id));
    } catch (err) {
      console.error('Error deleting design:', err);
      alert(err instanceof Error ? err.message : 'Failed to delete design');
    }
  };

  // Search handler
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  // Filter toggle handler
  const handleFilterToggle = useCallback(() => {
    setFilterOpen(!filterOpen);
  }, [filterOpen]);

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
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-100 bg-white focus:ring-4 focus:ring-primary/10 outline-none transition-all text-sm"
            aria-label="Search designs"
          />
        </div>
        <button 
          onClick={handleFilterToggle}
          className={`btn py-3 px-5 flex items-center gap-2 text-sm ${filterOpen ? 'btn-primary' : 'btn-secondary'}`}
          aria-pressed={filterOpen}
        >
          <Filter className="w-4 h-4" /> Filters
        </button>
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map(n => (
            <div key={n} className="aspect-[4/5] bg-white rounded-[2rem] animate-pulse border border-gray-50" />
          ))}
        </div>
      ) : filteredDesigns.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDesigns.map((design) => (
            <div key={design.id} className="card-bake group overflow-hidden p-0">
              <div className="aspect-square relative overflow-hidden bg-gray-50">
                {design.image_url ? (
                  <img 
                    src={design.image_url} 
                    alt={design.title || 'Cake design'} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-200">
                    <Plus className="w-12 h-12" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                  <div className="flex gap-2 w-full">
                    <button 
                      onClick={() => setSelectedDesign(design)}
                      className="flex-1 btn glass text-secondary bg-white py-2 text-xs font-bold"
                    >
                      View Detail
                    </button>
                    <button 
                      onClick={() => deleteDesign(design.id)} 
                      className="p-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
                      aria-label={`Delete ${design.title || 'design'}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-secondary truncate pr-4">{design.title}</h3>
                  <span className="text-primary font-black text-sm">
                    {typeof design.estimated_price === 'number' ? `$${design.estimated_price.toFixed(2)}` : 'N/A'}
                  </span>
                </div>
                <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                  {design.description || 'No description provided.'}
                </p>
                <div className="mt-6 pt-4 border-t border-gray-50 flex justify-between items-center">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    {design.created_at ? new Date(design.created_at).toLocaleDateString() : 'N/A'}
                  </span>
                  <ExternalLink className="w-4 h-4 text-gray-300" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : searchQuery ? (
        <div className="text-center py-20 card-bake bg-white border-dashed border-gray-200">
          <div className="w-20 h-20 bg-pink-50 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-serif font-black text-secondary mb-2">No results found</h2>
          <p className="text-gray-500 mb-10 max-w-sm mx-auto">No designs match "{searchQuery}". Try a different search term.</p>
          <button 
            onClick={() => setSearchQuery('')} 
            className="btn btn-primary px-8 py-4"
          >
            Clear Search
          </button>
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

      <DesignDetailModal 
        isOpen={!!selectedDesign}
        design={selectedDesign}
        onClose={() => setSelectedDesign(null)}
      />
    </div>
  );
}
