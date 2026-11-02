import React, { useState } from 'react';
import { AppDatabase } from '../data/types';
import { storage } from '../services/storage';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  KeyRound, 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Tag,
  Zap,
  Globe
} from 'lucide-react';

interface LoginPanelViewProps {
  db: AppDatabase;
  navigate: (path: string) => void;
  onLoginSuccess: () => void;
}

export const LoginPanelView: React.FC<LoginPanelViewProps> = ({
  db,
  navigate,
  onLoginSuccess
}) => {
  const [loginMethod, setLoginMethod] = useState<'credentials' | 'pin'>('credentials');
  const [emailOrUser, setEmailOrUser] = useState('admin@couponbuz.com');
  const [password, setPassword] = useState('admin123');
  const [pin, setPin] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    setTimeout(() => {
      let isSuccess = false;

      if (loginMethod === 'credentials') {
        isSuccess = storage.verifyAdminCredentials(emailOrUser, password, rememberMe);
      } else {
        isSuccess = storage.verifyAdminPin(pin, rememberMe);
      }

      if (isSuccess) {
        setLoginSuccess(true);
        setTimeout(() => {
          onLoginSuccess();
        }, 400);
      } else {
        setIsLoading(false);
        setErrorMessage(
          loginMethod === 'credentials'
            ? 'Invalid username or password. Default password is: admin123'
            : 'Incorrect admin PIN. Default PIN is: admin123'
        );
      }
    }, 350);
  };

  const handleQuickDemoLogin = () => {
    setIsLoading(true);
    setErrorMessage(null);
    setTimeout(() => {
      storage.verifyAdminPin('admin123', true);
      setLoginSuccess(true);
      setTimeout(() => {
        onLoginSuccess();
      }, 300);
    }, 250);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-slate-100 flex flex-col justify-between p-4 sm:p-6 lg:p-8 font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Top Bar */}
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 px-4 py-2 rounded-xl transition-all cursor-pointer border border-slate-700/50 backdrop-blur-md"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Live Website</span>
        </button>

        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1.5 rounded-full backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Instant Sync Connected</span>
        </div>
      </div>

      {/* Main Login Panel Card */}
      <div className="max-w-md w-full mx-auto my-8">
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          
          {/* Subtle Top Accent Glow */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-amber-500 to-emerald-500"></div>

          {/* Header Brand */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-600/30">
              <Tag className="w-8 h-8" />
            </div>
            
            <div className="inline-flex items-center gap-1.5 bg-indigo-950/80 border border-indigo-500/30 text-indigo-300 text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              Staff CMS Portal
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              CouponBuz Admin Login
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1.5">
              Secure access to manage stores, coupons, categories & live settings.
            </p>
          </div>

          {/* Method Switcher Tabs */}
          <div className="bg-slate-950/80 p-1 rounded-2xl border border-slate-800 flex mb-6">
            <button
              type="button"
              onClick={() => {
                setLoginMethod('credentials');
                setErrorMessage(null);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                loginMethod === 'credentials'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email & Password</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setLoginMethod('pin');
                setErrorMessage(null);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                loginMethod === 'pin'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Quick PIN</span>
            </button>
          </div>

          {/* Error Alert */}
          {errorMessage && (
            <div className="mb-6 p-3.5 bg-rose-950/80 border border-rose-500/40 text-rose-300 rounded-2xl text-xs font-medium flex items-center gap-2.5 animate-in shake">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Success Banner */}
          {loginSuccess && (
            <div className="mb-6 p-3.5 bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 rounded-2xl text-xs font-bold flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Authentication successful! Launching CMS...</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {loginMethod === 'credentials' ? (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Admin Email / Username
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="admin@couponbuz.com"
                      value={emailOrUser}
                      onChange={(e) => setEmailOrUser(e.target.value)}
                      className="w-full bg-slate-950/90 border border-slate-800 text-white text-sm rounded-xl pl-10 pr-4 py-3 focus:outline-hidden focus:border-indigo-500 focus:bg-slate-950 transition-all placeholder-slate-600"
                    />
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Password / Master Key
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-slate-950/90 border border-slate-800 text-white text-sm rounded-xl pl-10 pr-11 py-3 focus:outline-hidden focus:border-indigo-500 focus:bg-slate-950 transition-all placeholder-slate-600 font-mono"
                    />
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="p-1.5 text-slate-500 hover:text-slate-300 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer rounded-lg"
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Admin Security PIN Code
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoFocus
                    placeholder="Enter PIN (e.g. admin123)"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    className="w-full bg-slate-950/90 border border-slate-800 text-white text-base tracking-widest text-center rounded-xl py-3.5 px-4 focus:outline-hidden focus:border-indigo-500 focus:bg-slate-950 transition-all font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-1.5 text-slate-500 hover:text-slate-300 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer rounded-lg"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* Remember Me Option */}
            <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded bg-slate-950 border-slate-700 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
                <span>Remember this session</span>
              </label>

              <span className="text-[11px] text-slate-500">
                Staff Only
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || loginSuccess}
              className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-sm py-3.5 px-6 rounded-2xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Verifying Credentials...</span>
                </>
              ) : loginSuccess ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                  <span>Access Granted</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Unlock Admin CMS</span>
                </>
              )}
            </button>
          </form>

          {/* Quick 1-Click Demo Login Button */}
          <div className="mt-5 pt-5 border-t border-slate-800 text-center space-y-3">
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              disabled={isLoading || loginSuccess}
              className="w-full py-2.5 px-4 bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-semibold border border-slate-700/60 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>1-Click Quick Demo Login (Auto-fill admin123)</span>
            </button>

            <div className="text-[11px] text-slate-500 leading-relaxed bg-slate-950/60 rounded-xl p-2.5 border border-slate-800/60">
              Default password/PIN: <code className="text-amber-400 font-mono">admin123</code>. You can change this anytime inside CMS Settings &gt; Security.
            </div>
          </div>

        </div>
      </div>

      {/* Security & Architecture Footer */}
      <div className="max-w-md w-full mx-auto text-center space-y-2 text-xs text-slate-500">
        <div className="flex items-center justify-center gap-4">
          <span className="flex items-center gap-1">
            <Lock className="w-3 h-3 text-slate-400" />
            256-bit Session Security
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-400" />
            Instant Live Publishing
          </span>
        </div>
        <p className="text-[11px] text-slate-600">
          CouponBuz Content Management System © {new Date().getFullYear()}
        </p>
      </div>

    </div>
  );
};
