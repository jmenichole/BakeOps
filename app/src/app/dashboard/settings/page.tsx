'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@/lib/supabase';
import { User, Bell, Shield, Palette, Save, CheckCircle2, AlertCircle } from 'lucide-react';

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [bakeryName, setBakeryName] = useState('');
  const [emailLeads, setEmailLeads] = useState(true);
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const supabase = createBrowserClient();

  useEffect(() => {
    async function getProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        // Fetch baker profile from database
        const { data: baker } = await supabase
          .from('bakers')
          .select('*')
          .eq('id', user.id)
          .single();

        if (baker) {
          setBakeryName(baker.business_name || '');
          // For now, we'll store notification preferences in metadata or keep them local
          // In a future update, we can add columns to the bakers table
        }
      }
    }
    getProfile();
  }, [supabase]);

  const handleSave = async () => {
    if (!user) return;

    setLoading(true);
    setSaveMessage(null);

    try {
      // Update baker profile
      const { error } = await supabase
        .from('bakers')
        .upsert({
          id: user.id,
          business_name: bakeryName,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'id'
        });

      if (error) throw error;

      setSaveMessage({ type: 'success', text: 'Settings saved successfully!' });
    } catch (error) {
      console.error('Error saving settings:', error);
      setSaveMessage({ type: 'error', text: 'Failed to save settings. Please try again.' });
    } finally {
      setLoading(false);
      // Clear message after 3 seconds
      setTimeout(() => setSaveMessage(null), 3000);
    }
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
              <input
                type="text"
                className="w-full p-4 rounded-xl border border-gray-100 bg-gray-50 text-sm outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                placeholder="Sweet Delights Bakery"
                value={bakeryName}
                onChange={(e) => setBakeryName(e.target.value)}
              />
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
              <button
                onClick={() => setEmailLeads(!emailLeads)}
                className={`w-12 h-6 rounded-full relative transition-colors ${emailLeads ? 'bg-primary' : 'bg-gray-300'}`}
                aria-label="Toggle email leads"
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${emailLeads ? 'right-1' : 'left-1'}`}></div>
              </button>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <span className="text-sm font-medium text-secondary">Order status updates</span>
              <button
                onClick={() => setOrderUpdates(!orderUpdates)}
                className={`w-12 h-6 rounded-full relative transition-colors ${orderUpdates ? 'bg-primary' : 'bg-gray-300'}`}
                aria-label="Toggle order updates"
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${orderUpdates ? 'right-1' : 'left-1'}`}></div>
              </button>
            </div>
          </div>
        </div>

        {/* Save Message */}
        {saveMessage && (
          <div className={`p-4 rounded-xl flex items-center gap-3 ${saveMessage.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {saveMessage.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <span className="text-sm font-medium">{saveMessage.text}</span>
          </div>
        )}

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
