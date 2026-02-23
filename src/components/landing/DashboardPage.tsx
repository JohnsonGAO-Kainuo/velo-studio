import { useAuth } from '@/hooks/useAuth';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase, supabaseUrl } from '@/lib/supabase';
import { CreditCard, LogOut, Clock, CheckCircle, AlertTriangle, Download, User, ChevronRight, Zap } from 'lucide-react';

type PlanChoice = 'monthly' | 'yearly';

export function DashboardPage() {
  const { user, profile, loading, signOut, isTrialActive, isSubscriptionActive, hasAccess, trialDaysLeft } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [billingLoading, setBillingLoading] = useState(false);
  const [showPlanSelector, setShowPlanSelector] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  // Handle checkout success
  useEffect(() => {
    if (searchParams.get('checkout') === 'success') {
      setCheckoutSuccess(true);
      window.history.replaceState({}, '', '/dashboard');
      const timer = setTimeout(() => {
        window.location.reload();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="flex items-center gap-3">
          <svg className="animate-spin w-5 h-5 text-[#202020]" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span className="text-[#5c5c5c]">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user || !profile) return null;

  const handleSubscribe = async (plan: PlanChoice) => {
    setBillingLoading(true);
    try {
      // refreshSession() guarantees a fresh access_token (getSession can return stale/expired)
      const { data: { session } } = await supabase.auth.refreshSession();
      if (!session) return;

      const res = await fetch(`${supabaseUrl}/functions/v1/create-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (data.error) {
        console.error('Checkout error:', data.error);
        return;
      }
      if (data.url) window.location.href = data.url;
    } catch (err) {
      console.error('Billing error:', err);
    } finally {
      setBillingLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    setBillingLoading(true);
    try {
      const { data: { session } } = await supabase.auth.refreshSession();
      if (!session) return;

      const res = await fetch(`${supabaseUrl}/functions/v1/create-portal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (err) {
      console.error('Portal error:', err);
    } finally {
      setBillingLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const statusConfig: Record<string, { label: string; color: string; bg: string; border: string; icon: typeof Clock }> = {
    trialing: { label: 'Free Trial', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', icon: Clock },
    active: { label: 'Active', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-100', icon: CheckCircle },
    canceled: { label: 'Canceled', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100', icon: AlertTriangle },
    expired: { label: 'Expired', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100', icon: AlertTriangle },
    past_due: { label: 'Past Due', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100', icon: AlertTriangle },
  };

  const status = statusConfig[profile.subscription_status] || statusConfig.expired;
  const StatusIcon = status.icon;

  return (
    <div className="min-h-[80vh] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-2xl font-bold text-[#202020]">Dashboard</h1>
            <p className="text-sm text-[#5c5c5c] mt-1">Manage your account and subscription</p>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-[#5c5c5c] hover:text-[#202020] hover:bg-black/5 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>

        {/* Checkout Success Banner */}
        {checkoutSuccess && (
          <div className="rounded-2xl bg-green-50 border border-green-100 p-5 mb-4 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-green-900">Payment successful!</p>
              <p className="text-xs text-green-700">Your subscription is being activated. This page will refresh automatically.</p>
            </div>
          </div>
        )}

        {/* Profile Card */}
        <div className="rounded-2xl bg-white border border-black/5 p-6 mb-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#202020] flex items-center justify-center text-white font-bold text-lg">
              {(profile.full_name || profile.email || '?')[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-semibold text-[#202020] truncate">
                {profile.full_name || 'Velo User'}
              </h2>
              <p className="text-sm text-[#5c5c5c] truncate">{profile.email}</p>
            </div>
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${status.bg} ${status.border} border`}>
              <StatusIcon className={`w-3.5 h-3.5 ${status.color}`} />
              <span className={`text-xs font-semibold ${status.color}`}>{status.label}</span>
            </div>
          </div>
        </div>

        {/* Trial Info */}
        {isTrialActive() && (
          <div className="rounded-2xl bg-blue-50 border border-blue-100 p-6 mb-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-blue-900 mb-1">Free Trial Active</h3>
                <p className="text-sm text-blue-700">
                  You have <span className="font-bold">{trialDaysLeft()} days</span> remaining in your free trial.
                  Enjoy full access to all features!
                </p>
                <div className="mt-3 w-full bg-blue-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${Math.max(5, ((14 - trialDaysLeft()) / 14) * 100)}%` }}
                  />
                </div>
                <p className="text-xs text-blue-600 mt-1.5">
                  Trial ends on {new Date(profile.trial_end).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Active Subscription Info */}
        {isSubscriptionActive() && profile.subscription_end && (
          <div className="rounded-2xl bg-green-50 border border-green-100 p-6 mb-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-green-900 mb-1">Subscription Active</h3>
                <p className="text-sm text-green-700">
                  Your subscription renews on{' '}
                  <span className="font-bold">
                    {new Date(profile.subscription_end).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* No Access Warning */}
        {!hasAccess() && (
          <div className="rounded-2xl bg-orange-50 border border-orange-100 p-6 mb-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-orange-900 mb-1">
                  {profile.subscription_status === 'canceled' ? 'Subscription Canceled' : 'Trial Expired'}
                </h3>
                <p className="text-sm text-orange-700">
                  Subscribe to continue using Velo Studio with all features.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Cards */}
        <div className="space-y-3">
          {/* Manage Subscription - for active subscribers */}
          {isSubscriptionActive() && (
            <button
              onClick={handleManageSubscription}
              disabled={billingLoading}
              className="w-full rounded-2xl bg-white border border-black/5 p-5 flex items-center gap-4 hover:bg-neutral-50 transition-colors text-left disabled:opacity-50"
            >
              <div className="w-10 h-10 rounded-xl bg-[#f2f2f2] flex items-center justify-center flex-shrink-0">
                <CreditCard className="w-5 h-5 text-[#202020]" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-[#202020]">Manage Subscription</h3>
                <p className="text-xs text-[#5c5c5c] mt-0.5">Update payment method, change plan, or cancel</p>
              </div>
              <ChevronRight className="w-4 h-4 text-[#999] flex-shrink-0" />
            </button>
          )}

          {/* Subscribe - for trial users or expired */}
          {!isSubscriptionActive() && (
            <>
              {!showPlanSelector ? (
                <button
                  onClick={() => setShowPlanSelector(true)}
                  disabled={billingLoading}
                  className="w-full rounded-2xl bg-[#202020] border border-black/5 p-5 flex items-center gap-4 hover:bg-[#333] transition-colors text-left disabled:opacity-50"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-white">
                      {isTrialActive() ? 'Upgrade to Pro' : 'Subscribe Now'}
                    </h3>
                    <p className="text-xs text-white/60 mt-0.5">
                      Starting at $8/month - All features included
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-white/40 flex-shrink-0" />
                </button>
              ) : (
                <div className="rounded-2xl bg-white border border-black/5 p-6">
                  <h3 className="text-base font-semibold text-[#202020] mb-4">Choose your plan</h3>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <button
                      onClick={() => handleSubscribe('monthly')}
                      disabled={billingLoading}
                      className="p-4 rounded-xl border-2 border-black/10 hover:border-[#202020] transition-colors text-left disabled:opacity-50"
                    >
                      <p className="text-xs text-[#5c5c5c] font-medium mb-1">Monthly</p>
                      <p className="text-2xl font-bold text-[#202020]">$8<span className="text-sm font-normal text-[#5c5c5c]">/mo</span></p>
                      <p className="text-xs text-[#5c5c5c] mt-2">Billed monthly</p>
                    </button>
                    <button
                      onClick={() => handleSubscribe('yearly')}
                      disabled={billingLoading}
                      className="p-4 rounded-xl border-2 border-green-200 hover:border-green-500 transition-colors text-left disabled:opacity-50 relative"
                    >
                      <div className="absolute -top-2.5 right-3">
                        <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">SAVE 29%</span>
                      </div>
                      <p className="text-xs text-[#5c5c5c] font-medium mb-1">Yearly</p>
                      <p className="text-2xl font-bold text-[#202020]">$68<span className="text-sm font-normal text-[#5c5c5c]">/yr</span></p>
                      <p className="text-xs text-green-600 font-medium mt-2">~$5.67/month</p>
                    </button>
                  </div>
                  {billingLoading && (
                    <div className="flex items-center justify-center gap-2 py-2">
                      <svg className="animate-spin w-4 h-4 text-[#202020]" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      <span className="text-sm text-[#5c5c5c]">Redirecting to checkout...</span>
                    </div>
                  )}
                  <button
                    onClick={() => setShowPlanSelector(false)}
                    className="text-xs text-[#5c5c5c] hover:text-[#202020] font-medium mt-2"
                  >
                    Back
                  </button>
                </div>
              )}
            </>
          )}

          {/* Past Due Warning */}
          {profile.subscription_status === 'past_due' && (
            <button
              onClick={handleManageSubscription}
              disabled={billingLoading}
              className="w-full rounded-2xl bg-red-50 border border-red-100 p-5 flex items-center gap-4 hover:bg-red-100/50 transition-colors text-left disabled:opacity-50"
            >
              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-red-900">Payment Failed</h3>
                <p className="text-xs text-red-700 mt-0.5">Update your payment method to restore access</p>
              </div>
              <ChevronRight className="w-4 h-4 text-red-400 flex-shrink-0" />
            </button>
          )}

          {/* Download App */}
          <a
            href="https://github.com/JohnsonGAO-Kainuo/velo-studio/releases"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full rounded-2xl bg-white border border-black/5 p-5 flex items-center gap-4 hover:bg-neutral-50 transition-colors block"
          >
            <div className="w-10 h-10 rounded-xl bg-[#f2f2f2] flex items-center justify-center flex-shrink-0">
              <Download className="w-5 h-5 text-[#202020]" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-[#202020]">Download Velo Studio</h3>
              <p className="text-xs text-[#5c5c5c] mt-0.5">macOS - Apple Silicon and Intel</p>
            </div>
            <ChevronRight className="w-4 h-4 text-[#999] flex-shrink-0" />
          </a>

          {/* Account */}
          <div className="rounded-2xl bg-white border border-black/5 p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#f2f2f2] flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-[#202020]" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-[#202020]">Account Details</h3>
              <p className="text-xs text-[#5c5c5c] mt-0.5">
                Member since {new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>
        </div>

        {/* Sync info */}
        <div className="mt-8 text-center">
          <p className="text-xs text-[#999]">
            Your subscription syncs automatically with the desktop app.
            <br />
            Sign in with the same account on any device.
          </p>
        </div>
      </div>
    </div>
  );
}
