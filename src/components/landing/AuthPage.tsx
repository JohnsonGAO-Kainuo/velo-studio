import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { HiOutlineMail } from 'react-icons/hi';
import { RiLockPasswordLine } from 'react-icons/ri';
import { FiUser, FiEye, FiEyeOff } from 'react-icons/fi';

export function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmationSent, setConfirmationSent] = useState(false);

  const { signIn, signUp, signInWithGoogle, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (!authLoading && user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, authLoading, navigate]);

  // Check for checkout success
  useEffect(() => {
    if (searchParams.get('checkout') === 'success') {
      navigate('/dashboard', { replace: true });
    }
  }, [searchParams, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        const { error: err } = await signUp(email, password, fullName);
        if (err) {
          setError(err);
        } else {
          setConfirmationSent(true);
        }
      } else {
        const { error: err } = await signIn(email, password);
        if (err) {
          setError(err);
        } else {
          navigate('/');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    const { error: err } = await signInWithGoogle();
    if (err) setError(err);
  };

  if (confirmationSent) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <HiOutlineMail className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-[#202020] mb-3">Check your email</h2>
          <p className="text-[#5c5c5c] mb-6">
            We've sent a confirmation link to <span className="font-semibold text-[#202020]">{email}</span>. 
            Click the link to activate your account and start your 14-day free trial.
          </p>
          <button
            onClick={() => { setConfirmationSent(false); setIsSignUp(false); }}
            className="text-sm text-[#202020] font-medium hover:underline"
          >
            Back to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#202020] mb-2">
            {isSignUp ? 'Start your free trial' : 'Welcome back'}
          </h1>
          <p className="text-[#5c5c5c]">
            {isSignUp 
              ? '14 days free. No credit card required.' 
              : 'Sign in to your Velo Studio account'}
          </p>
        </div>

        {/* Google Sign In */}
        <button
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-black/10 bg-white hover:bg-neutral-50 transition-colors mb-4"
        >
          <FcGoogle className="w-5 h-5" />
          <span className="text-sm font-medium text-[#202020]">
            Continue with Google
          </span>
        </button>

        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-black/10" />
          <span className="text-xs text-[#5c5c5c] font-medium">or</span>
          <div className="flex-1 h-px bg-black/10" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#999]" />
              <input
                type="text"
                placeholder="Full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-black/10 bg-white text-[#202020] text-sm placeholder:text-[#999] focus:outline-none focus:ring-2 focus:ring-[#202020]/20 focus:border-[#202020]/30 transition-all"
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
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-black/10 bg-white text-[#202020] text-sm placeholder:text-[#999] focus:outline-none focus:ring-2 focus:ring-[#202020]/20 focus:border-[#202020]/30 transition-all"
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
              className="w-full pl-10 pr-11 py-3 rounded-xl border border-black/10 bg-white text-[#202020] text-sm placeholder:text-[#999] focus:outline-none focus:ring-2 focus:ring-[#202020]/20 focus:border-[#202020]/30 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999] hover:text-[#202020] transition-colors"
            >
              {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
            </button>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[#202020] text-white font-semibold text-sm hover:bg-[#333] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

        {/* Toggle */}
        <p className="text-center mt-6 text-sm text-[#5c5c5c]">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
            className="text-[#202020] font-semibold hover:underline"
          >
            {isSignUp ? 'Sign In' : 'Start Free Trial'}
          </button>
        </p>

        {/* Trial badge */}
        {isSignUp && (
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 border border-green-100">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-xs text-green-700 font-medium">14-day free trial • Full access • No credit card</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
