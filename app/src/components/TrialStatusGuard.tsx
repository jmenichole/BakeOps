'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { createBrowserClient } from '@/lib/supabase';
import { getTrialStatus, TrialStatus } from '@/lib/trial';

export function TrialStatusGuard({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<TrialStatus | null>(null);
  const supabase = createBrowserClient();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    async function checkTrial() {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setLoading(false);
        return;
      }

      const { data: baker } = await supabase
        .from('bakers')
        .select('trial_ends_at, is_premium')
        .eq('id', user.id)
        .single();

      if (baker) {
        if (baker.is_premium) {
          setLoading(false);
          return;
        }

        const trialStatus = getTrialStatus(baker.trial_ends_at);
        setStatus(trialStatus);

        if (trialStatus.isExpired && pathname !== '/trial-expired') {
          router.push('/trial-expired');
        }
      }
      
      setLoading(false);
    }

    checkTrial();
  }, [supabase, router, pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF9F9]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
