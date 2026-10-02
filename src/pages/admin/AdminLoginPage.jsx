import React, { useState } from 'react';
import { Shield, Lock, User, AlertCircle, Loader2, ArrowLeft, KeyRound } from 'lucide-react';
import { adminLogin } from '../../services/adminService';

/**
 * AdminLoginPage: Secure authentication gateway for the read-only Admin Portal.
 * 
 * Security Features:
 * - Direct authentication against backend admin service
 * - No credentials exposed or written into frontend bundles
 * - Session stored in sessionStorage (cleared on browser/tab close)
 * - Clean error normalization without leaking server internals
 */
export function AdminLoginPage({ onLoginSuccess, onNavigate }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!username.trim() || !password) {
      setErrorMessage('Please enter both your administrator username/email and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      await adminLogin(username, password);
      if (onLoginSuccess) {
        onLoginSuccess();
      } else if (onNavigate) {
        onNavigate('/admin');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/40 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-[#050505] selection:bg-[#2563EB] selection:text-white">
      {/* Back to public pledge link */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4 mb-4">
        <button
          type="button"
          onClick={() => onNavigate && onNavigate('/')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#0B1F4D] transition-colors p-1 rounded-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Campaign Site</span>
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        {/* Card Header */}
        <div className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-[0_12px_40px_rgba(11,31,77,0.08)]">
          <div className="text-center mb-8">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-[#0B1F4D] flex items-center justify-center text-white mb-4 shadow-md shadow-blue-900/20">
              <Shield className="w-7 h-7 text-blue-400" />
            </div>

            <span className="font-heading text-[11px] font-bold tracking-widest text-[#2563EB] uppercase block mb-1">
              Protected Administrative Area
            </span>
            <h1 className="font-heading text-2xl font-extrabold text-[#0B1F4D] tracking-tight">
              Admin Portal Login
            </h1>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Sign in with your verified administrator credentials to view pledge records and campaign telemetry.
            </p>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div
              role="alert"
              className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-start gap-2.5 animate-shake"
            >
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <span className="font-bold block">Access Denied</span>
                {errorMessage}
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="admin-username"
                className="block text-xs font-bold text-[#0B1F4D] uppercase tracking-wider mb-1.5"
              >
                Username or Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="admin-username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isSubmitting}
                  placeholder="admin@ncsam.org"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-300 rounded-xl text-sm text-[#050505] placeholder-slate-400 focus:bg-white focus:outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-blue-50 transition-all"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="admin-password"
                className="block text-xs font-bold text-[#0B1F4D] uppercase tracking-wider mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="admin-password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSubmitting}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-300 rounded-xl text-sm text-[#050505] placeholder-slate-400 focus:bg-white focus:outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-blue-50 transition-all"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 px-4 rounded-xl font-heading font-bold text-sm tracking-wide text-white bg-[#0B1F4D] hover:bg-blue-900 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-md shadow-blue-950/20 focus-visible-ring ${
                  isSubmitting ? 'opacity-80 cursor-wait' : ''
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-blue-300" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4 text-blue-300" />
                    <span>Enter Admin Portal</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Security Notice */}
          <div className="mt-8 pt-5 border-t border-slate-100 text-center">
            <p className="text-[11px] text-slate-400 leading-relaxed">
              National Cyber Security Awareness Month 2026.
              All administrative access requests are monitored and logged.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLoginPage;
