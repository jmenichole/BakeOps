'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { LogIn, LayoutDashboard } from 'lucide-react';
import { createBrowserClient } from '@/lib/supabase';

export function AuthButton() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const supabase = createBrowserClient();

  useEffect(() => {
    async function checkAuth() {
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
      setLoading(false);
    }
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  if (loading) {
    return (
      <div className="btn btn-secondary py-2.5 px-5 text-sm opacity-50">
        <LogIn className="w-4 h-4" />
      </div>
    );
  }

  if (isLoggedIn) {
    return (
      <Link href="/dashboard" className="btn btn-primary py-2.5 px-5 text-sm flex items-center gap-2 shadow-lg shadow-pink-200/40">
        <LayoutDashboard className="w-4 h-4" />
        Dashboard
      </Link>
    );
  }

  return (
    <Link href="/login" className="btn btn-secondary py-2.5 px-5 text-sm flex items-center gap-2">
      <LogIn className="w-4 h-4" />
      Login
    </Link>
  );
}
