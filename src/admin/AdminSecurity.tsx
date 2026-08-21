import { useState, useEffect, FormEvent } from 'react';
import toast from 'react-hot-toast';
import { Mail, Shield, Key, CheckCircle2, Lock } from 'lucide-react';
import { useCMS } from '../context/CMSContext';

export default function AdminSecurity() {
  const { refreshData } = useCMS();
  const [backupEmail, setBackupEmail] = useState('');
  const [savedBackupEmail, setSavedBackupEmail] = useState('');
  const [emailLoading, setEmailLoading] = useState(false);
  const [fetchingEmail, setFetchingEmail] = useState(true);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    fetch('/api/auth/backup-email')
      .then(res => res.json())
      .then(data => {
        if (data.backupEmail) {
          setBackupEmail(data.backupEmail);
          setSavedBackupEmail(data.backupEmail);
        }
      })
      .catch(err => console.error('Failed to load backup email:', err))
      .finally(() => setFetchingEmail(false));
  }, []);

  const handleBackupEmailSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!backupEmail || !backupEmail.includes('@')) {
      return toast.error('Please enter a valid email address');
    }

    setEmailLoading(true);
    try {
      const res = await fetch('/api/auth/backup-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ backupEmail })
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || 'Backup email updated successfully');
        setSavedBackupEmail(backupEmail);
        refreshData();
      } else {
        toast.error(data.error || 'Failed to update backup email');
      }
    } catch (err) {
      toast.error('Network error while updating backup email');
    } finally {
      setEmailLoading(false);
    }
  };

  const handlePasswordChange = async (e: FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      return toast.error('New password must be at least 6 characters long');
    }
    if (newPassword !== confirmPassword) {
      return toast.error('New passwords do not match');
    }
    
    setPasswordLoading(true);
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || 'Password updated successfully');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        toast.error(data.error || 'Failed to change password');
      }
    } catch (err) {
      toast.error('Network error');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-8">
      {/* Backup Recovery Email Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2.5 bg-green-50 text-green-700 rounded-lg">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Admin Backup & Recovery Email</h3>
            <p className="text-sm text-gray-500">
              This email is used to verify your identity and reset your admin password if you ever forget it.
            </p>
          </div>
        </div>

        {savedBackupEmail && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span className="text-sm font-medium text-emerald-900">
                Active Recovery Email: <strong className="text-emerald-950 font-bold">{savedBackupEmail}</strong>
              </span>
            </div>
            <span className="text-xs bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full font-semibold">
              Configured
            </span>
          </div>
        )}

        <form onSubmit={handleBackupEmailSave} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Backup / Recovery Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Mail className="w-5 h-5" />
              </div>
              <input
                type="email"
                required
                disabled={fetchingEmail}
                value={backupEmail}
                onChange={(e) => setBackupEmail(e.target.value)}
                placeholder="e.g. yourname@gmail.com"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              When resetting a forgotten password, the 6-digit verification code will be authorized against this address.
            </p>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={emailLoading || fetchingEmail}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg font-medium shadow-sm transition-colors disabled:opacity-50 flex items-center space-x-2"
            >
              <Shield className="w-4 h-4" />
              <span>{emailLoading ? 'Saving Email...' : 'Save Backup Email'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Change Password Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2.5 bg-gray-100 text-gray-700 rounded-lg">
            <Key className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Change Admin Password</h3>
            <p className="text-sm text-gray-500">Update your current administrator login password.</p>
          </div>
        </div>
        
        <form onSubmit={handlePasswordChange} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Lock className="w-5 h-5" />
              </div>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
              <input
                type="password"
                required
                placeholder="At least 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={passwordLoading}
              className="bg-gray-900 hover:bg-black text-white px-6 py-2.5 rounded-lg font-medium shadow-sm transition-colors disabled:opacity-50 flex items-center space-x-2"
            >
              <Key className="w-4 h-4" />
              <span>{passwordLoading ? 'Updating Password...' : 'Update Password'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
