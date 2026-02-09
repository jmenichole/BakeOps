'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@/lib/supabase';
import { Share2, Copy, Gift, Users, CheckCircle2 } from 'lucide-react';

export default function ReferralsPage() {
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState({ referrals: 0, rewards: 0 });
  const supabase = createBrowserClient();

  useEffect(() => {
    async function getReferralData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: baker } = await supabase
        .from('bakers')
        .select('referral_code')
        .eq('id', user.id)
        .single();

      if (baker?.referral_code) {
        setReferralCode(baker.referral_code);
      } else {
        // Generate new code if missing
        const newCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        await supabase.from('bakers').update({ referral_code: newCode }).eq('id', user.id);
        setReferralCode(newCode);
      }

      const { count } = await supabase
        .from('referrals')
        .select('*', { count: 'exact', head: true })
        .eq('referrer_id', user.id);
      
      setStats({ referrals: count || 0, rewards: Math.floor((count || 0) / 1) }); // 1 month per referral
    }
    getReferralData();
  }, [supabase]);

  const referralLink = `${typeof window !== 'undefined' ? window.location.origin : ''}/signup?ref=${referralCode}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-bold">Affiliate Program</h1>
        <p className="text-gray-500 mt-1">Spread the word and get rewarded for every baker you bring to BOT.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm text-center">
          <div className="w-12 h-12 bg-pink-50 text-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Gift className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-black">{stats.rewards} Months</h3>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Free Service Earned</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm text-center">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-black">{stats.referrals}</h3>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Total Referrals</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm text-center">
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-black">Active</h3>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Account Status</p>
        </div>
      </div>

      <div className="bg-secondary text-white p-10 rounded-[3rem] shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Share2 className="w-48 h-48" />
        </div>

        <div className="relative z-10 max-w-xl">
          <h2 className="text-3xl font-bold mb-4">Give a Trial, Get a Month.</h2>
          <p className="text-gray-300 mb-8 leading-relaxed">
            Invite your baker friends! When they sign up using your link, they get an extended <strong>14-day Beta Trial</strong>, and you get <strong>1 Month of Premium</strong> for free when they activate.
          </p>

          <div className="space-y-4">
            <label className="block text-xs font-bold uppercase tracking-widest text-pink-400">Your Unique Share Link</label>
            <div className="flex gap-2 p-2 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20">
              <input 
                readOnly
                className="bg-transparent flex-1 px-4 py-2 outline-none text-sm font-medium"
                value={referralLink}
              />
              <button 
                onClick={copyToClipboard}
                className="bg-white text-secondary px-6 py-2 rounded-xl font-bold text-sm hover:bg-pink-50 transition-colors flex items-center gap-2"
              >
                {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h3 className="font-bold mb-6">Recent Referrals</h3>
        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-bold">Date</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold text-right">Reward</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 text-gray-500">No referrals yet. Start sharing!</td>
                <td className="px-6 py-4"></td>
                <td className="px-6 py-4 text-right"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
