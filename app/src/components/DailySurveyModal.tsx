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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('survey_responses')
        .select('created_at')
        .eq('user_id', user.id)
        .gte('created_at', new Date().toISOString().split('T')[0])
        .single();

      if (data) {
        setHasCompletedToday(true);
      } else {
        // Show popup after 2 seconds if not completed
        const timer = setTimeout(() => setIsOpen(true), 2000);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-secondary/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl border border-pink-100 relative overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Close Button */}
        <button 
          onClick={() => setIsOpen(false)}
          className="absolute top-6 right-6 p-2 hover:bg-gray-50 rounded-full transition-colors z-10"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>

        <div className="p-10">
          {!submitted ? (
            <>
              <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-widest mb-6">
                <Star className="w-3 h-3 fill-current" /> Daily Tester Survey
              </div>

              {step === 1 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                  <h2 className="text-2xl font-serif font-black text-secondary">How was your experience today?</h2>
                  <p className="text-gray-500">Your feedback helps us refine the AI and tools for everyone.</p>
                  <div className="flex justify-between gap-2">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        onClick={() => setFormData({ ...formData, rating: num })}
                        className={`flex-1 aspect-square rounded-2xl border-2 transition-all font-black text-xl ${formData.rating === num ? 'border-primary bg-pink-50 text-primary shadow-inner scale-105' : 'border-gray-50 text-gray-300 hover:border-pink-100 hover:text-primary'}`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                  <button 
                    disabled={formData.rating === 0}
                    onClick={() => setStep(2)}
                    className="w-full btn btn-primary py-4 text-lg disabled:opacity-50"
                  >
                    Next Question
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                  <h2 className="text-2xl font-serif font-black text-secondary">What was most helpful?</h2>
                  <p className="text-gray-500">Which feature saved you the most time or felt the most "magic"?</p>
                  <input 
                    autoFocus
                    className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50 text-base outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                    placeholder="e.g. The AI generating the 3-tier mockup..."
                    value={formData.valuableFeature}
                    onChange={(e) => setFormData({ ...formData, valuableFeature: e.target.value })}
                  />
                  <button 
                    disabled={!formData.valuableFeature}
                    onClick={() => setStep(3)}
                    className="w-full btn btn-primary py-4 text-lg"
                  >
                    Next Question
                  </button>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                  <h2 className="text-2xl font-serif font-black text-secondary">One thing to improve?</h2>
                  <p className="text-gray-500">If you had a magic wand, what would you change about BakeBot right now?</p>
                  <textarea 
                    autoFocus
                    className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50 text-base outline-none focus:ring-4 focus:ring-primary/10 transition-all min-h-[120px]"
                    placeholder="Be as honest as possible! We can take it."
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
                  <div className="bg-pink-50 p-6 rounded-2xl flex gap-4 mb-2 border border-pink-100">
                    <Info className="w-6 h-6 text-primary shrink-0" />
                    <p className="text-sm text-pink-800 leading-relaxed font-medium">
                      We're finalizing our launch pricing. As a tester, what would you consider a fair price for <strong>Lifetime Access</strong>?
                    </p>
                  </div>
                  <div className="relative">
                    <span className="absolute left-4 top-4 text-gray-400 text-lg">$</span>
                    <input 
                      type="number"
                      autoFocus
                      className="w-full pl-8 p-4 rounded-2xl border border-gray-100 bg-gray-50 text-lg font-bold outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                      placeholder="0.00"
                      value={formData.estimatedValue}
                      onChange={(e) => setFormData({ ...formData, estimatedValue: e.target.value })}
                    />
                  </div>
                  <button 
                    disabled={loading || !formData.estimatedValue}
                    onClick={handleSubmit}
                    className="w-full btn btn-primary py-4 text-lg flex items-center justify-center gap-2 shadow-xl shadow-pink-100"
                  >
                    {loading ? 'Submitting...' : <><Send className="w-5 h-5" /> Submit & Get Reward</>}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-10 animate-in zoom-in-95 duration-500">
              <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-8 animate-bounce">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <h2 className="text-3xl font-serif font-black text-secondary mb-4">You're Amazing!</h2>
              <p className="text-gray-500 mb-10 leading-relaxed">
                Thank you for being such a dedicated tester. Your feedback is being reviewed by our team right now.
              </p>
              
              <div className="bg-secondary text-white p-8 rounded-3xl relative overflow-hidden mb-10">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Sparkles className="w-20 h-20" />
                </div>
                <h3 className="font-bold text-xl mb-2 text-pink-400">Exclusive Reward</h3>
                <p className="text-sm text-gray-300 mb-6">
                  Get Lifetime Access for only <strong>$149</strong> (Normal price $299) as a thank you for testing.
                </p>
                <Link 
                  href="/pricing"
                  className="inline-block bg-white text-secondary font-black px-8 py-3 rounded-xl text-sm hover:bg-pink-50 transition-colors"
                >
                  Claim Founder Discount
                </Link>
              </div>

              <button 
                onClick={() => setIsOpen(false)}
                className="text-gray-400 font-bold hover:text-secondary transition-colors"
              >
                Continue to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
