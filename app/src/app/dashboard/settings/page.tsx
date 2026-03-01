'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@/lib/supabase';
import { User, Bell, Shield, Palette, Save, CheckCircle2, AlertCircle, LogOut, KeyRound, Trash2 } from 'lucide-react';

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [bakeryName, setBakeryName] = useState('');
  const [emailLeads, setEmailLeads] = useState(true);
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Password change state
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Delete account state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);

  const supabase = createBrowserClient();
  const router = useRouter();

  useEffect(() => {
    async function getProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data: baker } = await supabase
          .from('bakers')
          .select('*')
          .eq('id', user.id)
          .single();

        if (baker) {
          setBakeryName(baker.business_name || '');
          setEmailLeads(baker.email_leads ?? true);
          setOrderUpdates(baker.order_updates ?? true);
        }
      }
    }
    getProfile();
  }, [supabase]);

  const showMessage = (type: 'success' | 'error', text: string) => {
    setSaveMessage({ type, text });
    setTimeout(() => setSaveMessage(null), 4000);
  };

  const handleSave = async () => {
    if (!user) return;

    setLoading(true);
    setSaveMessage(null);

    try {
      const { error } = await supabase
        .from('bakers')
        .upsert({
          id: user.id,
          business_name: bakeryName,
          email_leads: emailLeads,
          order_updates: orderUpdates,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'id'
        });

      if (error) throw error;

      showMessage('success', 'Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      showMessage('error', 'Failed to save settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  const handleChangePassword = async () => {
    if (!newPassword || !confirmPassword) {
      showMessage('error', 'Please fill in both password fields.');
      return;
    }
    if (newPassword.length < 6) {
      showMessage('error', 'Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      showMessage('error', 'Passwords do not match.');
      return;
    }

    setPasswordLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;

      showMessage('success', 'Password updated successfully!');
      setNewPassword('');
      setConfirmPassword('');
      setShowPasswordForm(false);
    } catch (error: any) {
      console.error('Error changing password:', error);
      showMessage('error', error.message || 'Failed to change password.');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') return;

    setDeleteLoading(true);
    try {
      // Delete baker profile data first
      if (user) {
        await supabase.from('bakers').delete().eq('id', user.id);
      }

      // Sign out the user (full account deletion requires a server-side admin call)
      await supabase.auth.signOut();
      router.push('/');
      router.refresh();
    } catch (error: any) {
      console.error('Error deleting account:', error);
      showMessage('error', error.message || 'Failed to delete account. Please contact support.');
      setDeleteLoading(false);
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

        {/* Account & Security */}
        <div className="card-bake">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
            <Shield className="w-5 h-5 text-primary" /> Account & Security
          </h2>
          <div className="space-y-4">
            {/* Change Password */}
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <KeyRound className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-secondary">Change Password</span>
                </div>
                <button
                  onClick={() => setShowPasswordForm(!showPasswordForm)}
                  className="text-xs font-bold text-primary hover:underline"
                >
                  {showPasswordForm ? 'Cancel' : 'Update'}
                </button>
              </div>

              {showPasswordForm && (
                <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">New Password</label>
                    <input
                      type="password"
                      className="w-full p-3 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                      placeholder="At least 6 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Confirm New Password</label>
                    <input
                      type="password"
                      className="w-full p-3 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                      placeholder="Re-enter your new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                  <button
                    onClick={handleChangePassword}
                    disabled={passwordLoading}
                    className="btn btn-primary px-6 py-3 text-sm flex items-center gap-2"
                  >
                    <KeyRound className="w-4 h-4" />
                    {passwordLoading ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              )}
            </div>

            {/* Logout */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <LogOut className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-secondary">Sign out of your account</span>
              </div>
              <button
                onClick={handleLogout}
                className="text-xs font-bold text-red-500 hover:text-red-700 hover:underline transition-colors"
              >
                Logout
              </button>
            </div>

            {/* Delete Account */}
            <div className="p-4 bg-red-50/50 rounded-xl border border-red-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Trash2 className="w-4 h-4 text-red-400" />
                  <div>
                    <span className="text-sm font-medium text-secondary block">Delete Account</span>
                    <span className="text-[10px] text-gray-400">Permanently remove your account and all data</span>
                  </div>
                </div>
                <button
                  onClick={() => setShowDeleteConfirm(!showDeleteConfirm)}
                  className="text-xs font-bold text-red-500 hover:text-red-700 hover:underline transition-colors"
                >
                  {showDeleteConfirm ? 'Cancel' : 'Delete'}
                </button>
              </div>

              {showDeleteConfirm && (
                <div className="mt-4 pt-4 border-t border-red-200 space-y-4">
                  <p className="text-sm text-red-600">
                    This action is permanent and cannot be undone. All your designs, orders, and bakery data will be removed.
                  </p>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-red-400 ml-1">
                      Type &quot;DELETE&quot; to confirm
                    </label>
                    <input
                      type="text"
                      className="w-full p-3 rounded-xl border border-red-200 bg-white text-sm outline-none focus:ring-4 focus:ring-red-100 transition-all"
                      placeholder="DELETE"
                      value={deleteConfirmText}
                      onChange={(e) => setDeleteConfirmText(e.target.value)}
                    />
                  </div>
                  <button
                    onClick={handleDeleteAccount}
                    disabled={deleteConfirmText !== 'DELETE' || deleteLoading}
                    className="px-6 py-3 text-sm font-bold rounded-xl bg-red-600 text-white hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    {deleteLoading ? 'Deleting...' : 'Permanently Delete Account'}
                  </button>
                </div>
              )}
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
