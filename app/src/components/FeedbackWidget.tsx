'use client';

import { useState } from 'react';
import { MessageSquarePlus, X, Send, Check } from 'lucide-react';

export function FeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log('Feedback submitted:', feedback);
    setIsSuccess(true);
    setIsSubmitting(false);
    setFeedback('');
    
    setTimeout(() => {
      setIsSuccess(false);
      setIsOpen(false);
    }, 3000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-secondary text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center gap-2 group"
        >
          <MessageSquarePlus className="w-6 h-6" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 font-bold text-sm whitespace-nowrap">
            Beta Feedback
          </span>
        </button>
      ) : (
        <div className="bg-white w-80 rounded-3xl shadow-2xl border border-pink-50 overflow-hidden animate-in slide-in-from-bottom-4">
          <div className="bg-secondary p-4 text-white flex items-center justify-between">
            <h3 className="font-bold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-pink-400" /> Beta Feedback
            </h3>
            <button onClick={() => setIsOpen(false)} className="hover:text-pink-400">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-4">
            {isSuccess ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-6 h-6" />
                </div>
                <p className="font-bold text-gray-900">Thank you!</p>
                <p className="text-sm text-gray-500">Your feedback helps us bake a better BOT.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <p className="text-sm text-gray-600">
                  What could be better? Any bugs or feature ideas?
                </p>
                <textarea
                  required
                  autoFocus
                  className="w-full p-3 rounded-xl border border-gray-100 bg-gray-50 text-sm outline-none focus:ring-2 focus:ring-primary/20 min-h-[120px] resize-none"
                  placeholder="Type your feedback here..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn btn-primary py-3 text-sm flex items-center justify-center gap-2"
                >
                  {isSubmitting ? 'Sending...' : (
                    <>
                      <Send className="w-4 h-4" /> Send Feedback
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Sparkles({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
      <path d="M5 3v4"/>
      <path d="M19 17v4"/>
      <path d="M3 5h4"/>
      <path d="M17 19h4"/>
    </svg>
  );
}
