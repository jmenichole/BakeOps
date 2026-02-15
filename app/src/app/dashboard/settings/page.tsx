'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@/lib/supabase';
import { User, Bell, Shield, Palette, Save } from 'lucide-react';

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const supabase = createBrowserClient();

  useEffect(() => {
    async function getProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    }
    getProfile();
  }, [supabase]);

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <div className="animate-in fade-in duration-700 max-w-4xl">
      <div className="mb-10">
        <h1 className="text-3xl font-serif font-black text-secondary">Settings</h1>
        <p className="text-gray-500 mt-2">Manage your bakery profile and platform preferences.</p>
      </div>

      <div className="space-y-6">
        {/* Profile Section */}
        <div className="card-bake">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
            <User className="w-5 h-5 text-primary" /> Bakery Profile
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Bakery Name</label>
              <input type="text" className="w-full p-4 rounded-xl border border-gray-100 bg-gray-50 text-sm outline-none focus:ring-4 focus:ring-primary/10 transition-all" placeholder="Sweet Delights Bakery" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Email Address</label>
              <input type="email" readOnly className="w-full p-4 rounded-xl border border-gray-100 bg-gray-100 text-sm outline-none text-gray-500" value={user?.email || ''} />
            </div>
          </div>
        </div>

        {/* AI Preferences */}
        <div className="card-bake">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
            <Palette className="w-5 h-5 text-primary" /> AI Design Style
          </h2>
          <p className="text-sm text-gray-500 mb-6 leading-relaxed">
            Configure how the AI generates mockups. You can upload reference images of your past work to train a custom style (Coming Soon).
          </p>
          <div className="p-8 border-2 border-dashed border-pink-50 rounded-2xl bg-pink-50/20 text-center">
            <p className="text-xs text-pink-800 font-bold uppercase tracking-widest mb-2">Beta Feature</p>
            <p className="text-sm text-gray-500">Custom style training will be available in the next release.</p>
          </div>
        </div>

        {/* Notifications */}
        <div className="card-bake">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
            <Bell className="w-5 h-5 text-primary" /> Notifications
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <span className="text-sm font-medium text-secondary">Email me new leads</span>
              <div className="w-12 h-6 bg-primary rounded-full relative"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div></div>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <span className="text-sm font-medium text-secondary">Order status updates</span>
              <div className="w-12 h-6 bg-primary rounded-full relative"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div></div>
            </div>
          </div>
        </div>

        <button 
          onClick={handleSave}
          disabled={loading}
          className="btn btn-primary px-10 py-4 flex items-center gap-3"
        >
          <Save className="w-5 h-5" /> {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
