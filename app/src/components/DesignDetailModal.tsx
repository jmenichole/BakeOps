'use client';

import { X, Calendar, Download, Share2, ShoppingBag } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { createBrowserClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

interface Design {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  configuration: Record<string, unknown> | null;
  estimated_price: number | null;
  created_at: string;
  baker_id: string;
}

interface DesignDetailModalProps {
  design: Design | null;
  isOpen: boolean;
  onClose: () => void;
}

export function DesignDetailModal({ design, isOpen, onClose }: DesignDetailModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createBrowserClient();

  // Handle escape key to close modal
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' && isOpen) {
      onClose();
    }
  }, [isOpen, onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Create Order - converts design to draft order
  const handleCreateOrder = async () => {
    if (!design) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('You must be logged in to create an order');
      }

      const { data, error: insertError } = await supabase
        .from('orders')
        .insert({
          baker_id: user.id,
          status: 'draft',
          total_price: design.estimated_price || 0,
          cake_details: {
            design_id: design.id,
            title: design.title,
            description: design.description,
            configuration: design.configuration,
            image_url: design.image_url,
          },
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // Navigate to the new order
      router.push(`/dashboard/orders/${data.id}`);
    } catch (err) {
      console.error('Error creating order:', err);
      setError(err instanceof Error ? err.message : 'Failed to create order');
    } finally {
      setIsLoading(false);
    }
  };

  // Share - copy URL to clipboard
  const handleShare = async () => {
    if (!design) return;
    
    try {
      const shareUrl = `${window.location.origin}/designs/${design.id}`;
      await navigator.clipboard.writeText(shareUrl);
      setNotification('Link copied to clipboard!');
      setTimeout(() => setNotification(null), 3000);
    } catch (err) {
      console.error('Error sharing:', err);
      setError('Failed to copy link');
    }
  };

  // Save - download the image
  const handleSave = () => {
    if (!design?.image_url) return;
    
    try {
      const link = document.createElement('a');
      link.href = design.image_url;
      link.download = `${design.title || 'design'}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Error saving:', err);
      setError('Failed to download image');
    }
  };

  // Close on backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen || !design) return null;

  // Safely format price
  const formattedPrice = design.estimated_price 
    ? `$${design.estimated_price.toFixed(2)}` 
    : '$0.00';

  // Safely format date
  const formattedDate = design.created_at 
    ? new Date(design.created_at).toLocaleDateString(undefined, { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    : 'Unknown date';

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col md:flex-row animate-in zoom-in-95 duration-200">
        
        {/* Image Section */}
        <div className="w-full md:w-1/2 bg-gray-100 relative min-h-[300px] md:min-h-full">
          {design.image_url ? (
            <img 
              src={design.image_url} 
              alt={design.title || 'Design image'} 
              className="w-full h-full object-cover absolute inset-0"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50">
              No Image Available
            </div>
          )}
          <button 
            onClick={onClose}
            className="absolute top-4 left-4 md:hidden p-2 bg-white/90 rounded-full shadow-sm text-gray-800"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Section */}
        <div className="w-full md:w-1/2 flex flex-col bg-white h-full max-h-[60vh] md:max-h-[90vh]">
          <div className="p-6 border-b border-gray-100 flex justify-between items-start shrink-0">
            <div>
              <h2 id="modal-title" className="text-2xl font-serif font-bold text-secondary mb-1">{design.title}</h2>
              <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                <Calendar className="w-3 h-3" />
                {formattedDate}
              </div>
            </div>
            <button 
              onClick={onClose}
              className="hidden md:block p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          <div className="p-6 overflow-y-auto flex-1 space-y-6">
            {/* Error/Notification Messages */}
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            {notification && (
              <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm">
                {notification}
              </div>
            )}

            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                {design.description || 'No description provided for this design.'}
              </p>
            </div>

            {design.configuration && typeof design.configuration === 'object' && (
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-3">Specifications</h3>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(design.configuration).map(([key, value]) => (
                    <div key={key} className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                      <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                        {key.replace(/_/g, ' ')}
                      </span>
                      <span className="text-sm font-medium text-gray-900 truncate block">
                        {String(value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-pink-50 p-4 rounded-xl border border-pink-100 flex items-center justify-between mt-4">
              <div>
                <span className="block text-xs font-bold text-pink-800 uppercase tracking-wider">Estimated Quote</span>
                <span className="text-2xl font-black text-primary">{formattedPrice}</span>
              </div>
              <button 
                onClick={handleCreateOrder}
                disabled={isLoading}
                className="btn btn-primary py-2 px-4 text-sm shadow-none flex items-center gap-2 disabled:opacity-50"
              >
                <ShoppingBag className="w-4 h-4" /> 
                {isLoading ? 'Creating...' : 'Create Order'}
              </button>
            </div>
          </div>

          <div className="p-4 border-t border-gray-100 bg-gray-50 flex gap-2 shrink-0">
            <button 
              onClick={handleSave}
              disabled={!design.image_url}
              className="flex-1 btn bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 flex items-center justify-center gap-2 text-sm font-bold disabled:opacity-50"
            >
              <Download className="w-4 h-4" /> Save
            </button>
            <button 
              onClick={handleShare}
              className="flex-1 btn bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 flex items-center justify-center gap-2 text-sm font-bold"
            >
              <Share2 className="w-4 h-4" /> Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
