import { useState, useEffect, useCallback } from 'react';
import { supabase, supabaseUrl, type UserProfile } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';
import { FcGoogle } from 'react-icons/fc';
import { HiOutlineMail } from 'react-icons/hi';
import { RiLockPasswordLine } from 'react-icons/ri';
import { FiUser, FiEye, FiEyeOff } from 'react-icons/fi';

/**
 * ElectronAuth - Authentication gate for the Electron desktop app.
 * Shows a login/register form. After successful auth + access check,
 * signals the main process to switch to the HUD overlay.
 */
export function ElectronAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [checking, setChecking] = useState(true);

  // Form state
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmationSent, setConfirmationSent] = useState(false);

  const fetchProfile = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (!error && data) {
      setProfile(data as UserProfile);
      return data as UserProfile;
    }
    return null;
  }, []);

  const checkAccess = useCallback((p: UserProfile | null): boolean => {
    if (!p) return false;
    const isTrial = new Date(p.trial_end) > new Date() && p.subscription_status === 'trialing';
    const isActive = p.subscription_status === 'active';
    return isTrial || isActive;
  }, []);

  // Check existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          const p = await fetchProfile(session.user.id);
          if (checkAccess(p)) {
            // Has access - signal main process to switch to HUD
            (window as any).electronAPI?.authReady();
          }
        }
      } catch (err) {
        console.error('Session check error:', err);
      } finally {
        setChecking(false);
      }
    };
    checkSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        const p = await fetchProfile(session.user.id);
        if (checkAccess(p)) {
          (window as any).electronAPI?.authReady();
        }
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchProfile, checkAccess]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        const { error: err } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName || '' } },
        });
        if (err) {
          setError(err.message);
        } else {
          setConfirmationSent(true);
        }
      } else {
        const { error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) {
          setError(err.message);
        }
        // onAuthStateChange will handle the rest
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    // For Electron, open Google OAuth in external browser
    (window as any).electronAPI?.openExternalUrl(
      `${supabaseUrl}/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(supabaseUrl + '/auth/v1/callback')}`
    );
  };

  // Loading state
  if (checking) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#f2f2f2]">
        <div className="flex flex-col items-center gap-4">
          <svg className="animate-spin w-8 h-8 text-[#202020]" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-sm text-[#5c5c5c]">Checking login status...</p>
        </div>
      </div>
    );
  }

  // User is logged in but no access
  if (user && profile && !checkAccess(profile)) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#f2f2f2] p-6">
        <div className="w-full max-w-sm text-center">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-[#202020] mb-2">
            {profile.subscription_status === 'canceled' ? 'Subscription Ended' : 'Trial Expired'}
          </h2>
          <p className="text-[#5c5c5c] text-sm mb-6">
            Subscribe to continue using Velo Studio. Plans start at $8/month.
          </p>
          <button
            onClick={() => (window as any).electronAPI?.openExternalUrl('https://velo-studio.kainuotech.com/pricing')}
            className="w-full py-3 rounded-xl bg-[#202020] text-white font-semibold text-sm hover:bg-[#333] transition-colors mb-3"
          >
            View Plans
          </button>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              setUser(null);
              setProfile(null);
            }}
            className="text-sm text-[#5c5c5c] hover:text-[#202020] font-medium"
          >
            Sign in with a different account
          </button>
        </div>
      </div>
    );
  }

  // Confirmation email sent
  if (confirmationSent) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#f2f2f2] p-6">
        <div className="w-full max-w-sm text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <HiOutlineMail className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-[#202020] mb-2">Check your email</h2>
          <p className="text-[#5c5c5c] text-sm mb-6">
            We sent a confirmation link to <span className="font-semibold text-[#202020]">{email}</span>. 
            Click it to activate your account.
          </p>
          <button
            onClick={() => { setConfirmationSent(false); setIsSignUp(false); }}
            className="text-sm text-[#202020] font-semibold hover:underline"
          >
            Back to Sign In
          </button>
        </div>
      </div>
    );
  }

  // Login / Register form
  return (
    <div className="h-screen flex items-center justify-center bg-[#f2f2f2] p-6">
      <div className="w-full max-w-sm">
        {/* Logo + Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-[#202020] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <svg viewBox="0 0 132 95" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
              <path d="M54.2871 83.816L55.3736 83.8112C55.9723 83.8112 58.4157 83.8643 60.8059 83.9319C66.2431 84.0864 70.7918 82.2712 74.5679 77.0574H75.0508L77.5859 73.316C78.9814 71.2595 80.1741 69.3043 80.3624 68.3678C84.38 62.1209 104.023 19.9905 104.023 18.7643C104.023 18.0498 103.203 18.074 100.523 18.8753L99.6775 19.1264L97.8667 19.7588C92.2798 21.7188 86.6205 25.5084 74.0851 37.4712C83.704 17.8229 97.7846 7.9119 112.739 7.1781C120.103 6.81603 120.04 6.21258 113.937 18.7933C111.131 24.5816 105.033 37.6547 100.392 47.836C87.1227 76.956 83.0376 82.9567 74.3893 86.0512C69.2997 87.8712 61.7234 87.5526 57.3051 85.3319L54.2871 83.816Z" fill="#89A389"/>
              <path d="M61.0469 63.0575C46.9179 31.0313 43.813 27.203 35.0923 25.0596L32.5571 24.4368C28.2547 19.223 26.7337 17.1616 26.4005 16.4858L25.7969 15.2644C47.1642 17.3596 55.064 25.2672 63.5482 47.4885L66.3585 54.8506L64.5043 58.592C63.4854 60.6485 62.2879 62.4975 61.0469 63.0575Z" fill="#89A389"/>
              <path d="M54.2877 83.8161C47.455 77.8202 42.293 68.6767 34.4318 50.9885C22.6834 24.5526 18.9701 19.0057 11.2006 16.3071C6.29456 14.6029 6 14.3133 6 11.2236C6 5.72984 10.5294 5.59467 19.2405 10.8229C21.9156 12.4305 24.4894 14.0864 24.9529 14.5016L25.7979 15.2643L26.4015 16.4857C26.7347 17.1616 28.2558 19.2229 32.5582 24.4367L32.6789 25.4891C32.9059 27.454 48.5801 61.334 52.1002 67.4698C57.5133 76.9029 61.8785 79.4085 74.5685 77.0574C70.7924 82.2712 66.2437 84.0864 60.8065 83.9319C58.4163 83.8643 55.9729 83.8112 55.3741 83.8112L54.2877 83.8161Z" fill="#595B60"/>
              <path d="M74.0861 37.4713C86.6216 25.5085 92.2809 21.7189 97.8678 19.7589L99.6786 19.1265C99.6786 19.8941 98.6452 20.734 97.3849 21.4823C91.3876 25.0596 84.5935 34.4299 79.4605 46.2237C75.6748 54.9182 74.4531 56.6175 72.3719 56.0961C70.875 55.7196 68.6972 51.2444 69.1173 49.4099C69.9092 45.9872 72.6857 38.4658 73.328 38.012L74.0861 37.4713Z" fill="#595B60"/>
              <path d="M75.0503 77.0575C74.6495 76.3092 73.8962 76.092 73.114 76.092C70.3761 76.092 66.8945 72.9733 63.8234 67.7644L61.0469 63.0575C62.2879 62.4975 63.4854 60.6485 64.5043 58.592L66.3585 54.8506C72.7132 66.4513 74.4708 68.0589 78.0683 68.2471L80.3619 68.3678C80.1736 69.3044 78.9809 71.2596 77.5854 73.3161L75.0503 77.0575Z" fill="#667266"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-[#202020] mb-1">
            {isSignUp ? 'Create your account' : 'Welcome to Velo'}
          </h1>
          <p className="text-sm text-[#5c5c5c]">
            {isSignUp ? '14 days free. No credit card required.' : 'Sign in to start recording'}
          </p>
        </div>

        {/* Google Sign In */}
        <button
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-black/10 bg-white hover:bg-neutral-50 transition-colors mb-4"
        >
          <FcGoogle className="w-5 h-5" />
          <span className="text-sm font-medium text-[#202020]">Continue with Google</span>
        </button>

        <div className="flex items-center gap-4 my-5">
          <div className="flex-1 h-px bg-black/10" />
          <span className="text-xs text-[#5c5c5c]">or</span>
          <div className="flex-1 h-px bg-black/10" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {isSignUp && (
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#999]" />
              <input
                type="text"
                placeholder="Full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-black/10 bg-white text-[#202020] text-sm placeholder:text-[#999] focus:outline-none focus:ring-2 focus:ring-[#202020]/20 transition-all"
              />
            </div>
          )}

          <div className="relative">
            <HiOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#999]" />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-black/10 bg-white text-[#202020] text-sm placeholder:text-[#999] focus:outline-none focus:ring-2 focus:ring-[#202020]/20 transition-all"
            />
          </div>

          <div className="relative">
            <RiLockPasswordLine className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#999]" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-black/10 bg-white text-[#202020] text-sm placeholder:text-[#999] focus:outline-none focus:ring-2 focus:ring-[#202020]/20 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999] hover:text-[#202020]"
            >
              {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
            </button>
          </div>

          {error && (
            <div className="p-2.5 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-[#202020] text-white font-semibold text-sm hover:bg-[#333] transition-colors disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Processing...
              </span>
            ) : isSignUp ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <p className="text-center mt-5 text-xs text-[#5c5c5c]">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
            className="text-[#202020] font-semibold hover:underline"
          >
            {isSignUp ? 'Sign In' : 'Start Free Trial'}
          </button>
        </p>
      </div>
    </div>
  );
}
