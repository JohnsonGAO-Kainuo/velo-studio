import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

/**
 * Handles Supabase auth redirects:
 * - Email confirmation
 * - OAuth callbacks (Google)
 * - Magic link logins
 * 
 * Supabase redirects to this page with hash fragments containing tokens.
 * We exchange them for a session and redirect to the dashboard.
 */
export function AuthCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Check for error in URL params
        const params = new URLSearchParams(window.location.search);
        const errorParam = params.get('error');
        const errorDescription = params.get('error_description');

        if (errorParam) {
          setError(errorDescription || errorParam);
          return;
        }

        // Check for checkout success
        const checkout = params.get('checkout');
        if (checkout === 'success') {
          // User came back from Stripe checkout - refresh profile and go to dashboard
          navigate('/dashboard', { replace: true });
          return;
        }

        // Supabase handles the hash fragment automatically with getSession
        // The @supabase/supabase-js client will detect the tokens in the URL hash
        const { data, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error('Auth callback error:', sessionError);
          setError(sessionError.message);
          return;
        }

        if (data.session) {
          // Successfully authenticated - go to dashboard
          navigate('/dashboard', { replace: true });
        } else {
          // No session found - try to exchange code if present
          const code = params.get('code');
          if (code) {
            const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
            if (exchangeError) {
              setError(exchangeError.message);
              return;
            }
            navigate('/dashboard', { replace: true });
          } else {
            // No session and no code - redirect to auth page
            navigate('/auth', { replace: true });
          }
        }
      } catch (err) {
        console.error('Unexpected auth callback error:', err);
        setError('An unexpected error occurred');
      }
    };

    handleCallback();
  }, [navigate]);

  if (error) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-[#202020] mb-3">Authentication Error</h2>
          <p className="text-[#5c5c5c] mb-6">{error}</p>
          <button
            onClick={() => navigate('/auth', { replace: true })}
            className="text-sm text-[#202020] font-semibold hover:underline"
          >
            Back to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="flex items-center gap-3">
        <svg className="animate-spin w-5 h-5 text-[#202020]" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <span className="text-[#5c5c5c]">Verifying your account...</span>
      </div>
    </div>
  );
}
