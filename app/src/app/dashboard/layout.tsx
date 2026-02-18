'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Palette, 
  Calendar, 
  LogOut, 
  Menu, 
  X,
  Plus,
  Clock,
  Gift
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { createBrowserClient } from '@/lib/supabase';
import { TrialStatusGuard } from '@/components/TrialStatusGuard';
import { FeedbackWidget } from '@/components/FeedbackWidget';
import { OnboardingModal } from '@/components/OnboardingModal';
import { getTrialStatus } from '@/lib/trial';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [trialDays, setTrialDays] = useState<number | null>(null);
  const supabase = createBrowserClient();
  const router = useRouter();

  useEffect(() => {
    async function fetchTrialInfo() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: baker } = await supabase
          .from('bakers')
          .select('trial_ends_at')
          .eq('id', user.id)
          .single();
        
        if (baker?.trial_ends_at) {
          const status = getTrialStatus(baker.trial_ends_at);
          setTrialDays(status.daysRemaining);
        }
      }
    }
    fetchTrialInfo();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  const navItems = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Orders', href: '/dashboard/orders', icon: ShoppingBag },
    { name: 'Designs', href: '/dashboard/designs', icon: Palette },
    { name: 'Production', href: '/dashboard/production', icon: Calendar },
    { name: 'Affiliates', href: '/dashboard/referrals', icon: Gift },
  ];

  return (
    <TrialStatusGuard>
      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar - Desktop */}
        <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200">
          <div className="p-6">
            <Link href="/" className="text-2xl font-serif font-black text-secondary">BOT</Link>
          </div>
          
          <nav className="flex-1 px-4 space-y-2 py-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive 
                      ? 'bg-pink-50 text-primary font-semibold' 
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Trial Status Card */}
          <div className="px-4 mb-4">
            <div className="bg-pink-50 p-4 rounded-2xl border border-pink-100">
              <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider mb-2">
                <Clock className="w-3 h-3" /> 
                {trialDays !== null ? `${trialDays} Days Left` : 'Beta Trial'}
              </div>
              <p className="text-[10px] text-pink-800 leading-tight mb-3">
                You&apos;re in the 14-day beta period. Enjoy full access!
              </p>
              <button className="w-full py-2 bg-primary text-white text-[10px] font-bold rounded-lg hover:bg-primary-hover transition-colors">
                UPGRADE NOW
              </button>
            </div>
          </div>

          <div className="p-4 border-t border-gray-100">
            <button 
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 w-full text-gray-500 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </aside>

        {/* Mobile Header */}
        <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-50">
          <Link href="/" className="text-xl font-serif font-black text-secondary">BOT</Link>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 bg-black/50 z-40 pt-16">
            <div className="bg-white h-full p-4">
              <nav className="space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-4 rounded-xl text-gray-900 font-medium border-b border-gray-50"
                  >
                    <item.icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                ))}
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-4 w-full text-red-600 font-medium"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </nav>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 pt-16 md:pt-0 overflow-y-auto">
          <div className="max-w-5xl mx-auto p-4 md:p-8">
            {children}
          </div>
        </main>
      </div>
      <FeedbackWidget />
      <OnboardingModal />
    </TrialStatusGuard>
  );
}
