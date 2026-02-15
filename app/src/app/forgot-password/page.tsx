'use client';

import { useState } from 'react';
import { createBrowserClient } from '@/lib/supabase';
import Link from 'next/link';
import { ArrowLeft, Mail, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const supabase = createBrowserClient();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/dashboard/settings`,
      });

      if (resetError) throw resetError;
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#FFF9F9]">
      <Link href="/login" className="mb-10 flex items-center gap-2 text-gray-500 hover:text-secondary transition-colors font-bold text-sm">
        <ArrowLeft className="w-4 h-4" /> Back to Login
      </Link>
      
      <div className="max-w-md w-full bg-white p-10 rounded-[2.5rem] shadow-2xl border border-pink-50 relative overflow-hidden">
        {!success ? (
          <>
            <h1 className="text-3xl font-serif font-black mb-2 text-secondary">Reset Password</h1>
            <p className="text-gray-500 mb-8 text-sm">Enter your email and we'll send you a link to reset your password.</p>

            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-xs border border-red-100 flex items-center gap-3">
                <span className="shrink-0 font-bold bg-red-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px]">✕</span> {error}
              </div>
            )}

            <form onSubmit={handleReset} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                  <input
                    type="email"
                    required
                    className="w-full pl-12 pr-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-sm"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn btn-primary py-5 text-lg shadow-xl shadow-pink-200"
              >
                {loading ? 'Sending link...' : 'Send Reset Link'}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-6">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-serif font-black text-secondary mb-4">Check your email</h2>
            <p className="text-gray-500 leading-relaxed mb-10">
              We've sent a password reset link to <span className="font-bold text-secondary">{email}</span>. Please check your inbox and spam folder.
            </p>
            <Link href="/login" className="btn btn-secondary w-full py-4">
              Return to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
