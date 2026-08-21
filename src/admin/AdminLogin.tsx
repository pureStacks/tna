import { useState, FormEvent } from 'react';
import toast from 'react-hot-toast';
import { Shield, KeyRound, ArrowLeft, Mail, CheckCircle2, Lock, Key } from 'lucide-react';
import { apiFetch, parseApiResponse } from '../lib/api';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Forgot password states
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [forgotStep, setForgotStep] = useState<'request' | 'reset'>('request');
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [maskedEmail, setMaskedEmail] = useState('');
  const [recoveryCode, setRecoveryCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [devCodeNotice, setDevCodeNotice] = useState<string | null>(null);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await apiFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ password })
      });
      const result = await parseApiResponse(res);
      if (result.ok && result.data?.success) {
        if (result.data.token) {
          localStorage.setItem('adminToken', result.data.token);
        }
        toast.success('Logged in successfully');
        window.location.href = '/admin'; // Force full reload to update layout/auth state
      } else {
        toast.error(result.error || 'Login failed');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error?.message || 'Login request failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestCode = async (e: FormEvent) => {
    e.preventDefault();
    if (!recoveryEmail || !recoveryEmail.includes('@')) {
      return toast.error('Please enter a valid backup email address');
    }

    setLoading(true);
    setDevCodeNotice(null);
    try {
      const res = await apiFetch('/api/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email: recoveryEmail })
      });
      const result = await parseApiResponse(res);
      if (result.ok && result.data?.success) {
        toast.success(result.data.message || 'Recovery code generated!');
        setMaskedEmail(result.data.maskedEmail || recoveryEmail);
        if (result.data.devCode) {
          setDevCodeNotice(result.data.devCode);
          setRecoveryCode(result.data.devCode); // Auto-fill for developer/admin convenience
        }
        setForgotStep('reset');
      } else {
        toast.error(result.error || 'Recovery request failed');
      }
    } catch (err: any) {
      toast.error(err?.message || 'Recovery request failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: FormEvent) => {
    e.preventDefault();
    if (!recoveryCode || recoveryCode.trim().length !== 6) {
      return toast.error('Please enter the 6-digit recovery code');
    }
    if (newPassword.length < 6) {
      return toast.error('New password must be at least 6 characters');
    }
    if (newPassword !== confirmPassword) {
      return toast.error('Passwords do not match');
    }

    setLoading(true);
    try {
      const res = await apiFetch('/api/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({
          email: recoveryEmail,
          code: recoveryCode.trim(),
          newPassword
        })
      });
      const result = await parseApiResponse(res);
      if (result.ok && result.data?.success) {
        toast.success('Password reset successfully! Please sign in with your new password.');
        setIsForgotMode(false);
        setForgotStep('request');
        setPassword(newPassword); // Pre-fill with newly set password
        setNewPassword('');
        setConfirmPassword('');
        setRecoveryCode('');
        setDevCodeNotice(null);
      } else {
        toast.error(result.error || 'Password reset failed');
      }
    } catch (err: any) {
      toast.error(err?.message || 'Password reset request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center text-green-700">
          <Shield size={48} />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          TNA Catfish CMS
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {isForgotMode ? 'Admin Password Recovery' : 'Secure Administration Portal'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm border border-gray-200 sm:rounded-xl sm:px-10">
          
          {!isForgotMode ? (
            /* Regular Login Form */
            <form className="space-y-6" onSubmit={handleLogin}>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Admin Password
                </label>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter admin password"
                    className="appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotMode(true);
                      setForgotStep('request');
                    }}
                    className="font-medium text-green-700 hover:text-green-800 hover:underline flex items-center space-x-1"
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>Forgot password?</span>
                  </button>
                </div>
                <span className="text-xs text-gray-400">Default: @admin123</span>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 transition-colors"
                >
                  {loading ? 'Authenticating...' : 'Sign in to Dashboard'}
                </button>
              </div>
            </form>
          ) : (
            /* Forgot Password Flow */
            <div>
              {forgotStep === 'request' ? (
                <form className="space-y-6" onSubmit={handleRequestCode}>
                  <div className="bg-green-50/70 border border-green-100 p-4 rounded-lg text-sm text-green-900">
                    <p className="font-semibold mb-1">Recover Admin Access</p>
                    <p className="text-xs text-green-800 leading-relaxed">
                      Enter the registered <strong>Admin Backup Email</strong>. A 6-digit recovery verification code will be generated to reset your password.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Backup / Recovery Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        required
                        value={recoveryEmail}
                        onChange={(e) => setRecoveryEmail(e.target.value)}
                        placeholder="e.g. nurudeenayobami37@gmail.com"
                        className="appearance-none block w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 transition-colors"
                    >
                      {loading ? 'Verifying Email...' : 'Send Recovery Code'}
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsForgotMode(false)}
                      className="w-full flex items-center justify-center py-2 px-4 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4 mr-1.5" />
                      Back to Sign In
                    </button>
                  </div>
                </form>
              ) : (
                /* Step 2: Code Verification & Reset Password */
                <form className="space-y-5" onSubmit={handleResetPassword}>
                  <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-900 flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <span>Verification code active for <strong>{maskedEmail}</strong>.</span>
                      {devCodeNotice && (
                        <div className="mt-1 font-mono text-emerald-950 font-bold bg-emerald-100/70 px-2 py-0.5 rounded inline-block">
                          Code: {devCodeNotice}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      6-Digit Recovery Code
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <Key className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        maxLength={6}
                        required
                        value={recoveryCode}
                        onChange={(e) => setRecoveryCode(e.target.value.replace(/\D/g, ''))}
                        placeholder="123456"
                        className="appearance-none block w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg font-mono text-lg tracking-widest text-center shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      New Admin Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type="password"
                        required
                        placeholder="At least 6 characters"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="appearance-none block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type="password"
                        required
                        placeholder="Re-enter new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="appearance-none block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 transition-colors"
                    >
                      {loading ? 'Resetting Password...' : 'Reset Password & Sign In'}
                    </button>

                    <div className="flex justify-between items-center pt-2 text-xs">
                      <button
                        type="button"
                        onClick={() => setForgotStep('request')}
                        className="text-gray-500 hover:text-gray-800"
                      >
                        Change email
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsForgotMode(false)}
                        className="text-green-700 hover:text-green-900 font-medium"
                      >
                        Back to Login
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
