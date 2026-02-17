'use client';

import { useState } from 'react';
import { createBrowserClient } from '@/lib/supabase';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const supabase = createBrowserClient();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (loginError) throw loginError;
      
      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#FFF9F9] selection:bg-pink-200">
      <Link href="/" className="text-4xl font-serif font-black mb-10 text-secondary hover:scale-105 transition-transform">BOT</Link>
      
      <div className="max-w-md w-full bg-white p-10 rounded-[2.5rem] shadow-2xl border border-pink-50 relative overflow-hidden">
        <h1 className="text-3xl font-serif font-black mb-2 text-secondary">Welcome back</h1>
        <p className="text-gray-500 mb-8 text-sm">Manage your bakery and designs.</p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-xs border border-red-100 flex items-center gap-3 animate-in slide-in-from-top-2">
            <span className="shrink-0 font-bold bg-red-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px]">✕</span> {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">Email Address</label>
            <input
              type="email"
              required
              className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-sm"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Password</label>
              <Link href="/forgot-password" university-font-medium className="text-[10px] text-primary font-bold hover:underline">
                Forgot password?
              </Link>
            </div>
            <input
              type="password"
              required
              className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-sm"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn btn-primary py-5 text-lg shadow-xl shadow-pink-200"
          >
            {loading ? 'Logging in...' : 'Log In to Bakery'}
          </button>
        </form>

        <p className="mt-10 text-center text-gray-500 text-sm">
          New to BakeBot?{' '}
          <Link href="/signup" className="text-primary font-bold hover:underline">
            Join the Beta
          </Link>
        </p>
      </div>
    </div>
  );
}
