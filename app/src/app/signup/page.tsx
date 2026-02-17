'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@/lib/supabase';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('baker');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const supabase = createBrowserClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const referralCode = searchParams.get('ref');

  // Track referral click when page loads
  useEffect(() => {
    if (referralCode) {
      fetch('/api/track-referral', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ referralCode }),
      }).catch(err => console.error('Failed to track referral:', err));
    }
  }, [referralCode]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!acceptedTerms) {
      setError('Please accept the Terms of Service to continue.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: signupError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role,
            is_beta_tester: true,
            signup_date: new Date().toISOString(),
            referral_code: referralCode || null,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (signupError) throw signupError;

      // If there's a referral code, create a referral record
      if (referralCode && data.user) {
        const { data: referrer } = await supabase
          .from('bakers')
          .select('id')
          .eq('referral_code', referralCode)
          .single();

        if (referrer) {
          await supabase.from('referrals').insert({
            referrer_id: referrer.id,
            referred_email: email,
            referred_user_id: data.user.id,
            referral_code: referralCode,
            status: 'pending',
          });
        }
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'An error occurred during signup');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#FFF9F9] animate-in fade-in duration-700">
        <div className="max-w-md w-full bg-white p-10 rounded-[2.5rem] shadow-2xl border border-pink-50 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-pink-300"></div>
          <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center text-3xl mx-auto mb-8 animate-bounce border-4 border-white shadow-sm">✓</div>
          <h1 className="text-3xl font-serif font-black mb-4 text-secondary">BakeBot Welcome!</h1>
          <p className="text-gray-600 mb-6 leading-relaxed">
            We've sent a confirmation link to <span className="text-secondary font-bold">{email}</span>. 
          </p>
          <div className="bg-pink-50/50 p-6 rounded-2xl mb-10 border border-pink-100/50">
            <p className="text-xs text-pink-800 font-medium leading-relaxed">
              <strong>Note:</strong> The email may appear from "Supabase" or "BakeBot Support". Please check your spam folder if you don't see it in 2 minutes.
            </p>
          </div>
          <Link href="/login" className="btn btn-primary w-full py-4 text-lg">
            Back to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#FFF9F9] selection:bg-pink-200">
      <Link href="/" className="text-4xl font-serif font-black mb-10 text-secondary hover:scale-105 transition-transform">BOT</Link>
      
      <div className="max-w-md w-full bg-white p-10 rounded-[2.5rem] shadow-2xl border border-pink-50 relative overflow-hidden">
        {/* Beta Badge */}
        <div className="absolute top-0 right-0 bg-secondary text-white px-6 py-2 rounded-bl-2xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
          <Sparkles className="w-3 h-3 text-pink-400" /> Beta Access
        </div>

        <h1 className="text-3xl font-serif font-black mb-2 text-secondary">Join the Beta</h1>
        <p className="text-gray-500 mb-8 text-sm">Help us build the future of custom baking.</p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-xs border border-red-100 flex items-center gap-3 animate-in slide-in-from-top-2">
            <span className="shrink-0 font-bold bg-red-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px]">✕</span> {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">Email Address</label>
            <input
              type="email"
              required
              className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-sm"
              placeholder="baker@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">Password</label>
            <input
              type="password"
              required
              minLength={6}
              className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-sm"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">My Primary Role</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className={`py-4 rounded-2xl border-2 transition-all font-bold text-sm ${role === 'baker' ? 'border-primary bg-pink-50 text-primary shadow-inner' : 'border-gray-50 text-gray-400 hover:border-pink-100'}`}
                onClick={() => setRole('baker')}
              >
                I am a Baker
              </button>
              <button
                type="button"
                className={`py-4 rounded-2xl border-2 transition-all font-bold text-sm ${role === 'customer' ? 'border-primary bg-pink-50 text-primary shadow-inner' : 'border-gray-50 text-gray-400 hover:border-pink-100'}`}
                onClick={() => setRole('customer')}
              >
                I am a Customer
              </button>
            </div>
          </div>

          {/* TOS Checkbox */}
          <div className="flex items-start gap-3 px-1 group cursor-pointer" onClick={() => setAcceptedTerms(!acceptedTerms)}>
            <div className={`mt-1 w-5 h-5 rounded-md border-2 shrink-0 flex items-center justify-center transition-all ${acceptedTerms ? 'bg-primary border-primary' : 'border-gray-200 group-hover:border-primary'}`}>
              {acceptedTerms && <ShieldCheck className="w-4 h-4 text-white" />}
            </div>
            <p className="text-xs text-gray-500 leading-relaxed select-none">
              I agree to the <Link href="/terms" className="text-primary font-bold hover:underline">Terms of Service</Link> and understand that I am participating in a <strong>Beta Testing</strong> period.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn btn-primary py-5 text-lg shadow-xl shadow-pink-200 flex items-center justify-center gap-3 group"
          >
            {loading ? 'Creating account...' : (
              <>
                Join Beta Now <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <p className="mt-10 text-center text-gray-500 text-sm">
          Already a tester?{' '}
          <Link href="/login" className="text-primary font-bold hover:underline">
            Log in
          </Link>
        </p>
      </div>
      
      <p className="mt-12 text-gray-400 text-xs text-center max-w-xs">
        By joining, you help us refine the platform. Thank you for being an early partner.
      </p>
    </div>
  );
}
