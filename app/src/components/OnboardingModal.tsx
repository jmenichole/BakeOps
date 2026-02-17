'use client';

import { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Smartphone, 
  LayoutDashboard, 
  Palette, 
  Calendar, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft,
  Share,
  PlusSquare,
  MoreVertical
} from 'lucide-react';

export function OnboardingModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('bakebot_onboarding_seen');
    if (!hasSeenOnboarding) {
      setIsOpen(true);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem('bakebot_onboarding_seen', 'true');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-secondary/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl border border-pink-100 relative overflow-hidden animate-in zoom-in-95 duration-500">
        
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gray-50 flex">
          {[...Array(totalSteps)].map((_, i) => (
            <div 
              key={i}
              className={`flex-1 transition-all duration-500 ${i + 1 <= step ? 'bg-primary' : ''}`}
            />
          ))}
        </div>

        {/* Close Button */}
        <button 
          onClick={handleDismiss}
          className="absolute top-6 right-6 p-2 hover:bg-gray-50 rounded-full transition-colors z-10"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>

        <div className="p-8 sm:p-12">
          {step === 1 && (
            <div className="text-center space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="w-20 h-20 bg-pink-50 rounded-[2rem] flex items-center justify-center mx-auto border border-pink-100">
                <Sparkles className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-3xl font-serif font-black text-secondary">Welcome to BakeBot!</h2>
              <p className="text-gray-500 leading-relaxed">
                We're so excited to have you in our beta program. BakeBot is designed to help you spend less time on paperwork and more time decorating.
              </p>
              <button 
                onClick={() => setStep(2)}
                className="w-full btn btn-primary py-4 text-lg flex items-center justify-center gap-2 group"
              >
                Let's get started <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <h3 className="text-2xl font-serif font-black text-secondary">What's inside?</h3>
              <div className="space-y-4">
                <div className="flex gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <LayoutDashboard className="w-6 h-6 text-primary shrink-0" />
                  <div>
                    <h4 className="font-bold text-secondary text-sm">Dashboard Overview</h4>
                    <p className="text-xs text-gray-400">Track your active orders, revenue, and beta progress at a glance.</p>
                  </div>
                </div>
                <div className="flex gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <Palette className="w-6 h-6 text-primary shrink-0" />
                  <div>
                    <h4 className="font-bold text-secondary text-sm">AI Configurator</h4>
                    <p className="text-xs text-gray-400">Describe a cake theme and let AI generate a professional mockup and quote.</p>
                  </div>
                </div>
                <div className="flex gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <Calendar className="w-6 h-6 text-primary shrink-0" />
                  <div>
                    <h4 className="font-bold text-secondary text-sm">Production Planner</h4>
                    <p className="text-xs text-gray-400">Automatically generated baking and prep schedules for your week.</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button onClick={() => setStep(1)} className="w-1/3 btn btn-secondary py-4"><ChevronLeft className="w-5 h-5" /></button>
                <button onClick={() => setStep(3)} className="w-2/3 btn btn-primary py-4">Next: Mobile App</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="flex items-center gap-3 mb-2">
                <Smartphone className="w-8 h-8 text-primary" />
                <h3 className="text-2xl font-serif font-black text-secondary">Install the App</h3>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">
                BakeBot works best when installed as an app on your phone. It's fast, convenient, and takes up zero storage.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl border border-pink-50 bg-pink-50/30">
                  <h4 className="font-bold text-primary text-xs uppercase tracking-widest mb-4">iPhone (iOS)</h4>
                  <ol className="text-xs space-y-3 text-pink-900">
                    <li className="flex gap-2"><Share className="w-3 h-3 shrink-0" /> 1. Tap the Share button in Safari</li>
                    <li className="flex gap-2"><PlusSquare className="w-3 h-3 shrink-0" /> 2. Select "Add to Home Screen"</li>
                  </ol>
                </div>
                <div className="p-5 rounded-2xl border border-gray-100 bg-gray-50">
                  <h4 className="font-bold text-secondary text-xs uppercase tracking-widest mb-4">Android</h4>
                  <ol className="text-xs space-y-3 text-gray-500">
                    <li className="flex gap-2"><MoreVertical className="w-3 h-3 shrink-0" /> 1. Tap the three dots (menu)</li>
                    <li className="flex gap-2"><Smartphone className="w-3 h-3 shrink-0" /> 2. Tap "Install App" or "Add to Home"</li>
                  </ol>
                </div>
              </div>

              <div className="flex gap-4">
                <button onClick={() => setStep(2)} className="w-1/3 btn btn-secondary py-4"><ChevronLeft className="w-5 h-5" /></button>
                <button onClick={() => setStep(4)} className="w-2/3 btn btn-primary py-4">Final Step</button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="text-center space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto border-4 border-white shadow-lg">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <div className="space-y-3">
                <h3 className="text-3xl font-serif font-black text-secondary">You're All Set!</h3>
                <p className="text-gray-500 max-w-sm mx-auto">
                  We can't wait to see what you create. If you have any feedback, just use the widget in the corner.
                </p>
              </div>
              <button 
                onClick={handleDismiss}
                className="w-full btn btn-primary py-5 text-xl shadow-xl shadow-pink-200"
              >
                Start Baking!
              </button>
              <button 
                onClick={handleDismiss}
                className="text-gray-400 text-sm font-bold hover:text-secondary transition-colors"
              >
                Skip for now
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
