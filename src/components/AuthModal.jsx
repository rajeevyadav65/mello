// File: src/components/AuthModal.jsx
import React, { useState } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff, CheckCircle, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import MelloLogo from './MelloLogo.jsx';
import { authenticate } from '../utils/melodiaApi.js';

export default function AuthModal({
  isOpen,
  onClose,
  onLoginSuccess,
  currentUser
}) {
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup' | 'google-picker' | 'apple-picker'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);

    try {
      const user = await authenticate(mode, email.toLowerCase(), password, name || email.split('@')[0]);
      setIsLoading(false);
      onLoginSuccess(user);
      onClose();
    } catch (requestError) {
      setIsLoading(false);
      setError(requestError.message || 'Unable to sign in. Please try again.');
    }
  };

  const handleGoogleLogin = (chosenEmail, chosenName) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const user = {
        id: `user-google-${Date.now()}`,
        name: chosenName || "Rajeev Ranjan",
        email: chosenEmail || "rajeevranjanyadav611@gmail.com",
        provider: "google",
        avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
        createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      };
      onLoginSuccess(user);
      onClose();
    }, 500);
  };

  const handleAppleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const user = {
        id: `user-apple-${Date.now()}`,
        name: "Apple User",
        email: "user_privaterelay@appleid.com",
        provider: "apple",
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      };
      onLoginSuccess(user);
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: "spring", stiffness: 400, damping: 28 }}
        className="relative w-full max-w-md rounded-3xl bg-white border border-orange-200 shadow-2xl shadow-orange-500/15 p-6 sm:p-8 text-stone-800 overflow-hidden"
      >
        {/* Ambient Top Sunset Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-24 bg-gradient-to-b from-orange-400/20 to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <motion.button
          whileTap={{ scale: 0.88 }}
          whileHover={{ scale: 1.1 }}
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-orange-50 transition"
        >
          <X className="w-5 h-5" />
        </motion.button>

        {/* Mode: Google Account Selector Simulator */}
        {mode === 'google-picker' ? (
          <div className="space-y-5">
            <div className="flex items-center space-x-2 text-left">
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <h3 className="text-base font-bold text-stone-900">Sign in with Google</h3>
            </div>

            <p className="text-xs text-stone-500">
              Choose an account to continue to <strong className="text-orange-600">Mello Music</strong>.
            </p>

            <div className="space-y-2">
              <motion.div
                whileHover={{ scale: 1.01, x: 2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleGoogleLogin("rajeevranjanyadav611@gmail.com", "Rajeev Ranjan")}
                className="flex items-center space-x-3 p-3 rounded-2xl bg-orange-50/50 hover:bg-orange-50 border border-orange-200/80 cursor-pointer transition shadow-xs"
              >
                <img
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"
                  alt="Rajeev"
                  className="w-10 h-10 rounded-full object-cover border-2 border-orange-300"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-stone-900">Rajeev Ranjan</p>
                  <p className="text-xs text-stone-500 truncate">rajeevranjanyadav611@gmail.com</p>
                </div>
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.01, x: 2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleGoogleLogin("user@google.com", "Music Explorer")}
                className="flex items-center space-x-3 p-3 rounded-2xl bg-stone-50 hover:bg-stone-100 border border-stone-200 cursor-pointer transition"
              >
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center font-bold text-orange-600">
                  G
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-stone-800">Use Another Google Account</p>
                  <p className="text-xs text-stone-500">Sign in with a different workspace</p>
                </div>
              </motion.div>
            </div>

            <button
              type="button"
              onClick={() => setMode('signin')}
              className="w-full text-xs text-stone-500 hover:text-stone-800 text-center py-2 font-medium"
            >
              Back to options
            </button>
          </div>
        ) : mode === 'apple-picker' ? (
          <div className="space-y-5 text-center">
            <div className="w-12 h-12 rounded-2xl bg-stone-900 text-white mx-auto flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 fill-current" viewBox="0 0 170 170">
                <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.05-7.62-7.85-11.77-14.4-6.42-10.13-11.53-21.68-15.34-34.65-3.81-12.96-5.72-25.04-5.72-36.23 0-14.48 3.59-26.68 10.78-36.6 7.19-9.92 16.48-15.01 27.87-15.28 4.8 0 10.22 1.25 16.27 3.75 6.05 2.5 10.02 3.8 11.91 3.92 1.63 0 5.88-1.42 12.74-4.25 6.86-2.83 12.74-4.08 17.65-3.75 14.15.87 25.15 6.42 33 16.65-12.41 7.51-18.45 17.91-18.13 31.18.33 10.23 4.19 18.73 11.59 25.49 7.4 6.75 16.12 10.61 26.17 11.59-2.28 7.07-5.12 14.7-8.52 22.88zM119.22 31.84c0-7.72 2.77-14.86 8.33-21.43 5.55-6.58 12.36-10.41 20.43-11.5 1.09 7.84-1.63 15.24-8.17 22.21-6.53 6.96-13.4 10.72-20.59 10.72z" />
              </svg>
            </div>

            <div>
              <h3 className="text-lg font-bold text-stone-900">Sign in with Apple</h3>
              <p className="text-xs text-stone-500 mt-1">
                Use Face ID or your Apple ID password to sign into Mello.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-left space-y-2">
              <div className="flex items-center justify-between text-xs text-stone-700 font-medium">
                <span>Account</span>
                <span className="text-stone-500">rajeev.apple@icloud.com</span>
              </div>
              <div className="flex items-center justify-between text-xs text-stone-700 font-medium">
                <span>Privacy</span>
                <span className="text-emerald-600 font-semibold">Hide My Email Enabled</span>
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={handleAppleLogin}
              disabled={isLoading}
              className="w-full py-3 rounded-full bg-stone-900 hover:bg-stone-800 text-white font-bold text-sm transition shadow-md"
            >
              {isLoading ? "Authenticating..." : "Continue with Apple ID"}
            </motion.button>

            <button
              type="button"
              onClick={() => setMode('signin')}
              className="text-xs text-stone-500 hover:text-stone-800"
            >
              Back
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Header */}
            <div className="text-center space-y-1">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-xs font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Mello Account Sync</span>
              </div>
              <h2 className="text-2xl font-black text-stone-900 tracking-tight">
                {mode === 'signin' ? 'Welcome to Mello' : 'Join Mello Music'}
              </h2>
              <p className="text-xs text-stone-500">
                {mode === 'signin'
                  ? 'Sign in to access your personal playlists & audio preferences'
                  : 'Experience global trending sounds across all genres'}
              </p>
            </div>

            {/* Social Logins */}
            <div className="space-y-2.5">
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.96 }}
                type="button"
                onClick={() => setMode('google-picker')}
                className="w-full flex items-center justify-center space-x-3 py-2.5 px-4 rounded-2xl bg-white hover:bg-orange-50/50 border border-stone-200 font-semibold text-sm text-stone-800 shadow-xs transition"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Continue with Google</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.96 }}
                type="button"
                onClick={() => setMode('apple-picker')}
                className="w-full flex items-center justify-center space-x-3 py-2.5 px-4 rounded-2xl bg-stone-900 hover:bg-stone-800 font-semibold text-sm text-white shadow-xs transition"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 170 170">
                  <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.05-7.62-7.85-11.77-14.4-6.42-10.13-11.53-21.68-15.34-34.65-3.81-12.96-5.72-25.04-5.72-36.23 0-14.48 3.59-26.68 10.78-36.6 7.19-9.92 16.48-15.01 27.87-15.28 4.8 0 10.22 1.25 16.27 3.75 6.05 2.5 10.02 3.8 11.91 3.92 1.63 0 5.88-1.42 12.74-4.25 6.86-2.83 12.74-4.08 17.65-3.75 14.15.87 25.15 6.42 33 16.65-12.41 7.51-18.45 17.91-18.13 31.18.33 10.23 4.19 18.73 11.59 25.49 7.4 6.75 16.12 10.61 26.17 11.59-2.28 7.07-5.12 14.7-8.52 22.88zM119.22 31.84c0-7.72 2.77-14.86 8.33-21.43 5.55-6.58 12.36-10.41 20.43-11.5 1.09 7.84-1.63 15.24-8.17 22.21-6.53 6.96-13.4 10.72-20.59 10.72z" />
                </svg>
                <span>Continue with Apple</span>
              </motion.button>
            </div>

            {/* Divider */}
            <div className="relative flex items-center justify-center">
              <div className="border-t border-stone-200 w-full" />
              <span className="bg-white px-3 text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                Or with email
              </span>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                {error}
              </div>
            )}

            {/* Email/Password Form */}
            <form onSubmit={handleEmailSubmit} className="space-y-3.5">
              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Full Name</label>
                  <div className="relative flex items-center">
                    <User className="w-4 h-4 text-stone-400 absolute left-3.5" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Rajeev Ranjan"
                      className="w-full bg-stone-50 border border-stone-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-stone-900 placeholder-stone-400 outline-none transition"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Email Address</label>
                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3.5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full bg-stone-50 border border-stone-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-stone-900 placeholder-stone-400 outline-none transition"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-stone-700">Password</label>
                  {mode === 'signin' && (
                    <button
                      type="button"
                      onClick={() => alert("Password reset link sent to " + (email || "your email"))}
                      className="text-[11px] text-orange-600 hover:text-orange-700 font-semibold"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    required
                    className="w-full bg-stone-50 border border-stone-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-xl pl-10 pr-10 py-2.5 text-sm text-stone-900 placeholder-stone-400 outline-none transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-stone-400 hover:text-stone-700"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.96 }}
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-sm shadow-md shadow-orange-500/25 transition flex items-center justify-center space-x-2"
              >
                <span>{isLoading ? "Processing..." : mode === 'signin' ? "Sign In" : "Create Account"}</span>
                {!isLoading && <ArrowRight className="w-4 h-4" />}
              </motion.button>
            </form>

            {/* Switch Mode Footer */}
            <div className="pt-2 text-center text-xs text-stone-500 font-medium">
              {mode === 'signin' ? (
                <span>
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => { setMode('signup'); setError(''); }}
                    className="text-orange-600 font-bold hover:underline"
                  >
                    Sign up
                  </button>
                </span>
              ) : (
                <span>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => { setMode('signin'); setError(''); }}
                    className="text-orange-600 font-bold hover:underline"
                  >
                    Sign in
                  </button>
                </span>
              )}
            </div>

            {/* Quick Demo Login Option */}
            <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
              <span className="text-[11px] text-stone-400">Testing credentials?</span>
              <button
                type="button"
                onClick={() => handleGoogleLogin("rajeevranjanyadav611@gmail.com", "Rajeev Ranjan")}
                className="inline-flex items-center space-x-1 text-xs text-orange-600 hover:text-orange-700 font-bold"
              >
                <Sparkles className="w-3 h-3" />
                <span>Quick Sign-In as Rajeev</span>
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
