'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@/lib/supabase';
import { Star, Send, CheckCircle2, Info, X, Sparkles } from 'lucide-react';
import Link from 'next/link';

export function DailySurveyModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [hasCompletedToday, setHasCompletedToday] = useState(false);
  const [formData, setFormData] = useState({
    rating: 0,
    valuableFeature: '',
    changeOneThing: '',
    estimatedValue: ''
  });

  const supabase = createBrowserClient();

  useEffect(() => {
    async function checkToday() {
      // Don't show if dismissed in this session
      if (sessionStorage.getItem('survey_dismissed')) return;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('survey_responses')
        .select('created_at')
        .eq('user_id', user.id)
        .gte('created_at', new Date().toISOString().split('T')[0]);

      if (data && data.length > 0) {
        setHasCompletedToday(true);
      } else {
        // Show popup after 5 seconds to be less intrusive
        const timer = setTimeout(() => setIsOpen(true), 5000);
        return () => clearTimeout(timer);
      }
    }
    checkToday();
  }, [supabase]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.from('survey_responses').insert({
        user_id: user.id,
        question_1: `Rating: ${formData.rating}/5`,
        question_2: formData.valuableFeature,
        question_3: formData.changeOneThing,
        value_rating: parseInt(formData.estimatedValue) || 0
      });

      if (error) throw error;

      await fetch('/api/survey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, userEmail: user.email })
      });

      setSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || hasCompletedToday) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-secondary/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg rounded-t-[2rem] sm:rounded-[2.5rem] shadow-2xl border-t sm:border border-pink-100 relative overflow-hidden animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-500">
        
        {/* Close Button */}
        <button 
          onClick={() => {
            setIsOpen(false);
            sessionStorage.setItem('survey_dismissed', 'true');
          }}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 hover:bg-gray-50 rounded-full transition-colors z-10"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>

        <div className="p-6 sm:p-10">
          {!submitted ? (
            <>
              <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-widest mb-4 sm:mb-6">
                <Sparkles className="w-3 h-3 fill-current" /> Beta Feedback Program
              </div>

              {step === 1 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                  <h2 className="text-xl sm:text-2xl font-serif font-black text-secondary leading-tight">Did the AI designs meet your professional standards?</h2>
                  <p className="text-sm sm:text-base text-gray-500">Would you feel confident showing these mockups to a real paying client?</p>
                  <div className="flex justify-between gap-2 sm:gap-3">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        onClick={() => setFormData({ ...formData, rating: num })}
                        className={`flex-1 aspect-square rounded-xl sm:rounded-2xl border-2 transition-all font-black text-lg sm:text-xl ${formData.rating === num ? 'border-primary bg-pink-50 text-primary shadow-inner scale-105' : 'border-gray-50 text-gray-300 hover:border-pink-100 hover:text-primary'}`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                  <button 
                    disabled={formData.rating === 0}
                    onClick={() => setStep(2)}
                    className="w-full btn btn-primary py-4 text-base sm:text-lg disabled:opacity-50"
                  >
                    Next Question
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                  <h2 className="text-xl sm:text-2xl font-serif font-black text-secondary">Any technical friction?</h2>
                  <p className="text-sm sm:text-base text-gray-500">Did you encounter any bugs, slow loading, or confusing buttons today?</p>
                  <textarea 
                    autoFocus
                    className="w-full p-4 rounded-xl sm:rounded-2xl border border-gray-100 bg-gray-50 text-base outline-none focus:ring-4 focus:ring-primary/10 transition-all min-h-[100px]"
                    placeholder="e.g. The 'Create' button didn't respond at first..."
                    value={formData.valuableFeature}
                    onChange={(e) => setFormData({ ...formData, valuableFeature: e.target.value })}
                  />
                  <div className="flex gap-4">
                    <button onClick={() => setStep(1)} className="w-1/3 btn btn-secondary py-4">Back</button>
                    <button 
                      disabled={!formData.valuableFeature}
                      onClick={() => setStep(3)}
                      className="w-2/3 btn btn-primary py-4"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                  <h2 className="text-xl sm:text-2xl font-serif font-black text-secondary">What&apos;s the #1 missing feature?</h2>
                  <p className="text-sm sm:text-base text-gray-500">What is the one thing keeping you from using Bake Ops for your entire business?</p>
                  <textarea 
                    autoFocus
                    className="w-full p-4 rounded-xl sm:rounded-2xl border border-gray-100 bg-gray-50 text-base outline-none focus:ring-4 focus:ring-primary/10 transition-all min-h-[120px]"
                    placeholder="e.g. I need a way to track ingredient costs..."
                    value={formData.changeOneThing}
                    onChange={(e) => setFormData({ ...formData, changeOneThing: e.target.value })}
                  />
                  <div className="flex gap-4">
                    <button onClick={() => setStep(2)} className="w-1/3 btn btn-secondary py-4">Back</button>
                    <button 
                      disabled={!formData.changeOneThing}
                      onClick={() => setStep(4)}
                      className="w-2/3 btn btn-primary py-4"
                    >
                      Final Step
                    </button>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="bg-pink-50 p-5 sm:p-6 rounded-xl sm:rounded-2xl flex gap-4 mb-2 border border-pink-100">
                    <Info className="w-5 h-5 sm:w-6 sm:h-6 text-primary shrink-0" />
                    <p className="text-xs sm:text-sm text-pink-800 leading-relaxed font-medium">
                      Your trial is ending soon. What <strong>monthly or yearly price</strong> would make Bake Ops a &quot;no-brainer&quot; for your bakery?
                    </p>
                  </div>
                  <div className="relative">
                    <span className="absolute left-4 top-4 text-gray-400 text-lg">$</span>
                    <input 
                      type="number"
                      autoFocus
                      className="w-full pl-8 p-4 rounded-xl sm:rounded-2xl border border-gray-100 bg-gray-50 text-lg font-bold outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                      placeholder="0.00"
                      value={formData.estimatedValue}
                      onChange={(e) => setFormData({ ...formData, estimatedValue: e.target.value })}
                    />
                  </div>
                  <div className="flex gap-4">
                    <button onClick={() => setStep(3)} className="w-1/3 btn btn-secondary py-4">Back</button>
                    <button 
                      disabled={loading || !formData.estimatedValue}
                      onClick={handleSubmit}
                      className="w-2/3 btn btn-primary py-4 text-base sm:text-lg flex items-center justify-center gap-2"
                    >
                      {loading ? 'Sending...' : <><Send className="w-5 h-5" /> Submit Feedback</>}
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-6 sm:py-10 animate-in zoom-in-95 duration-500">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-3xl sm:text-4xl mx-auto mb-6 sm:mb-8 animate-bounce">
                <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-black text-secondary mb-3 sm:mb-4">Feedback Received!</h2>
              <p className="text-sm sm:text-base text-gray-500 mb-8 sm:mb-10 leading-relaxed">
                Thank you for helping us build the future of bakery management. Your insights are invaluable.
              </p>
              
              <div className="bg-secondary text-white p-6 sm:p-8 rounded-[2rem] relative overflow-hidden mb-8 sm:mb-10 text-left">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Sparkles className="w-16 h-16 sm:w-20 sm:h-20" />
                </div>
                <h3 className="font-bold text-lg sm:text-xl mb-2 text-pink-400">Exclusive Beta Offer</h3>
                <p className="text-xs sm:text-sm text-gray-300 mb-6">
                  Upgrade today and lock in our <strong>Founder&apos;s Rate</strong> of $149 for lifetime access before we move to monthly subscriptions.
                </p>
                <Link 
                  href="/pricing"
                  className="inline-block bg-white text-secondary font-black px-6 sm:px-8 py-3 rounded-xl text-xs sm:text-sm hover:bg-pink-50 transition-colors"
                >
                  Claim Discount
                </Link>
              </div>

              <button 
                onClick={() => setIsOpen(false)}
                className="text-gray-400 text-sm font-bold hover:text-secondary transition-colors"
              >
                Return to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
