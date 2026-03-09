import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

/**
 * Handles Supabase auth redirects:
 * - Email confirmation
 * - OAuth callbacks (Google)
 * - Magic link logins
 * - Electron deep link OAuth flow (source=electron)
 * 
 * Supabase redirects to this page with hash fragments containing tokens.
 * For web: exchange tokens and redirect to dashboard.
 * For Electron: extract tokens and redirect to velostudio:// deep link.
 */
export function AuthCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [electronRedirect, setElectronRedirect] = useState(false);
  const [electronTokens, setElectronTokens] = useState<{ accessToken: string; refreshToken: string } | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const errorParam = params.get('error');
        const errorDescription = params.get('error_description');

        if (errorParam) {
          setError(errorDescription || errorParam);
          return;
        }

        // Check if this callback is from Electron app OAuth
        const source = params.get('source');
        if (source === 'electron') {
          await handleElectronCallback();
          return;
        }

        // Check for checkout success
        const checkout = params.get('checkout');
        if (checkout === 'success') {
          navigate('/dashboard', { replace: true });
          return;
        }

        // Standard web OAuth callback
        const { data, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error('Auth callback error:', sessionError);
          setError(sessionError.message);
          return;
        }

        if (data.session) {
          navigate('/dashboard', { replace: true });
        } else {
          const code = params.get('code');
          if (code) {
            const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
            if (exchangeError) {
              setError(exchangeError.message);
              return;
            }
            navigate('/dashboard', { replace: true });
          } else {
            navigate('/auth', { replace: true });
          }
        }
      } catch (err) {
        console.error('Unexpected auth callback error:', err);
        setError('An unexpected error occurred');
      }
    };

    const handleElectronCallback = async () => {
      // Extract tokens from URL hash (implicit OAuth flow)
      const hash = window.location.hash.substring(1);
      const hashParams = new URLSearchParams(hash);
      let accessToken = hashParams.get('access_token');
      let refreshToken = hashParams.get('refresh_token');

      // If no hash tokens, try getting session (Supabase might have auto-processed)
      if (!accessToken || !refreshToken) {
        await new Promise(resolve => setTimeout(resolve, 500));
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          accessToken = data.session.access_token;
          refreshToken = data.session.refresh_token;
        }
      }

      if (accessToken && refreshToken) {
        // Redirect to Electron app via deep link
        const deepLinkUrl = `velostudio://auth/callback?access_token=${encodeURIComponent(accessToken)}&refresh_token=${encodeURIComponent(refreshToken)}`;
        setElectronRedirect(true);
        setElectronTokens({ accessToken, refreshToken });
        window.location.href = deepLinkUrl;
      } else {
        setError('Failed to get authentication tokens. Please try again.');
      }
    };

    handleCallback();
  }, [navigate]);

  // Electron redirect: show "Return to app" UI
  if (electronRedirect) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-[#202020] mb-3">Login Successful!</h2>
          <p className="text-[#5c5c5c] mb-6">Redirecting you back to Velo Studio...</p>
          <button
            onClick={() => {
              if (electronTokens) {
                window.location.href = `velostudio://auth/callback?access_token=${encodeURIComponent(electronTokens.accessToken)}&refresh_token=${encodeURIComponent(electronTokens.refreshToken)}`;
              }
            }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#202020] text-white font-semibold text-sm hover:bg-[#333] transition-colors"
          >
            Open Velo Studio
          </button>
          <p className="text-xs text-[#999] mt-4">You can close this tab after the app opens.</p>
        </div>
      </div>
    );
  }

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
