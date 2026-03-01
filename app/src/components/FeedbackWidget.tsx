'use client';

import { useState, useEffect } from 'react';
import {
  MessageSquarePlus, X, Send, Check, Sparkles,
  Bug, Lightbulb, MousePointer2, HelpCircle,
  Smile, Meh, Frown, Angry, Heart
} from 'lucide-react';
import { createBrowserClient } from '@/lib/supabase';
import { toast } from '@/hooks/useToast';

type FeedbackCategory = 'bug' | 'feature_request' | 'ui_ux' | 'other';

const categories: { value: FeedbackCategory; label: string; icon: any; color: string }[] = [
  { value: 'bug', label: 'Report Bug', icon: Bug, color: 'text-red-500' },
  { value: 'feature_request', label: 'Feature Idea', icon: Lightbulb, color: 'text-amber-500' },
  { value: 'ui_ux', label: 'Improvement', icon: MousePointer2, color: 'text-blue-500' },
  { value: 'other', label: 'General Info', icon: HelpCircle, color: 'text-purple-500' },
];

const ratings = [
  { value: 1, icon: Angry, color: 'hover:bg-red-50 hover:text-red-500' },
  { value: 2, icon: Frown, color: 'hover:bg-orange-50 hover:text-orange-500' },
  { value: 3, icon: Meh, color: 'hover:bg-amber-50 hover:text-amber-500' },
  { value: 4, icon: Smile, color: 'hover:bg-green-50 hover:text-green-500' },
  { value: 5, icon: Heart, color: 'hover:bg-pink-50 hover:text-pink-500' },
];

export function FeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [category, setCategory] = useState<FeedbackCategory>('other');
  const [rating, setRating] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const supabase = createBrowserClient();

  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
    }
    checkAuth();
  }, [supabase]);

  // Close on escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  if (isAuthenticated === false) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating && !feedback) return;

    setIsSubmitting(true);

    try {
      // Get current user and browser info
      const { data: { user } } = await supabase.auth.getUser();
      const meta = {
        viewport: `${window.innerWidth}x${window.innerHeight}`,
        userAgent: navigator.userAgent,
        os: navigator.platform,
        language: navigator.language,
        referrer: document.referrer,
      };

      const payload = {
        user_id: user?.id,
        category,
        rating,
        message: feedback,
        page_url: window.location.href,
        browser_info: meta,
      };

      // Submit feedback to database
      const { error } = await supabase.from('feedback').insert(payload);

      if (error) throw error;

      // Also call API endpoint for server-side processing (e.g., Slack notifications, emails)
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...payload,
          userEmail: user?.email,
        }),
      });

      setIsSuccess(true);
      setFeedback('');
      setCategory('other');
      setRating(null);

      setTimeout(() => {
        setIsSuccess(false);
        setIsOpen(false);
      }, 3000);
    } catch (error) {
      console.error('Feedback submission error:', error);
      toast.error('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] font-sans">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-secondary text-white p-4 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2 group border-2 border-white/20 backdrop-blur-sm"
        >
          <MessageSquarePlus className="w-6 h-6" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 font-bold text-sm whitespace-nowrap">
            Feedback
          </span>
        </button>
      ) : (
        <div className="bg-white/95 backdrop-blur-md w-96 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-pink-50 overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 fade-in duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-secondary to-secondary/80 p-5 text-white flex items-center justify-between">
            <div>
              <h3 className="font-bold flex items-center gap-2 text-lg">
                <Sparkles className="w-5 h-5 text-pink-300 animate-pulse" />
                Shape Bake Ops
              </h3>
              <p className="text-white/70 text-xs font-medium">Your feedback drives our daily updates.</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
              aria-label="Close feedback form"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6">
            {isSuccess ? (
              <div className="text-center py-10">
                <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 scale-in duration-500">
                  <Check className="w-10 h-10" strokeWidth={3} />
                </div>
                <h4 className="font-bold text-xl text-gray-900 mb-2">You&apos;re Awesome!</h4>
                <p className="text-sm text-gray-500">Your feedback has been beamed to the kitchen. We&apos;ll start cooking right away!</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Category Selection */}
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => setCategory(cat.value)}
                      className={`flex items-center gap-2 p-3 rounded-2xl text-xs font-bold transition-all border ${category === cat.value
                        ? 'bg-secondary/5 border-secondary text-secondary shadow-sm'
                        : 'bg-gray-50 border-gray-100 text-gray-500 hover:bg-gray-100'
                        }`}
                    >
                      <cat.icon className={`w-4 h-4 ${cat.color}`} />
                      {cat.label}
                    </button>
                  ))}
                </div>

                {/* Feedback Input */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider pl-1">What&apos;s on your mind?</label>
                  <textarea
                    required
                    autoFocus
                    className="w-full p-4 rounded-[1.5rem] border border-gray-100 bg-gray-50/50 text-sm outline-none focus:ring-4 focus:ring-secondary/5 focus:border-secondary/20 min-h-[140px] resize-none transition-all placeholder:text-gray-300"
                    placeholder={
                      category === 'bug' ? "What broke? Tell us exactly how to find it..." :
                        category === 'feature_request' ? "What's your dream feature for BOT?" :
                          category === 'ui_ux' ? "What part of the app feels slow or clunky?" :
                            "Tell us anything - we're listening!"
                    }
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                  />
                </div>

                {/* Rating */}
                <div className="space-y-3">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider pl-1 text-center block">How&apos;s your experience?</label>
                  <div className="flex justify-between px-2">
                    {ratings.map((r) => (
                      <button
                        key={r.value}
                        type="button"
                        onClick={() => setRating(r.value)}
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${rating === r.value
                          ? 'bg-secondary text-white scale-110 shadow-lg'
                          : `bg-gray-50 text-gray-400 ${r.color}`
                          }`}
                      >
                        <r.icon className="w-6 h-6" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || (!feedback.trim() && !rating)}
                  className="w-full py-4 text-white rounded-2xl font-bold bg-secondary hover:bg-secondary-dark active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 shadow-lg shadow-secondary/20 flex items-center justify-center gap-2 group"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      Send to BOT Kitchen
                    </>
                  )}
                </button>

                <p className="text-[10px] text-gray-400 text-center px-4 leading-relaxed">
                  Bake Ops Beta collects page info and browser context to help us fix issues faster.
                </p>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

