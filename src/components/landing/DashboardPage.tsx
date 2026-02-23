import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase, supabaseUrl } from '@/lib/supabase';
import { CreditCard, LogOut, Clock, CheckCircle, AlertTriangle, Download, User, ChevronRight } from 'lucide-react';

export function DashboardPage() {
  const { user, profile, loading, signOut, isTrialActive, hasAccess, trialDaysLeft } = useAuth();
  const navigate = useNavigate();
  const [billingLoading, setBillingLoading] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

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

  const handleManageBilling = async () => {
    setBillingLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      if (profile.subscription_status === 'active' || profile.subscription_status === 'past_due') {
        // Open Stripe Customer Portal
        const res = await fetch(`${supabaseUrl}/functions/v1/create-portal`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
        });
        const data = await res.json();
        if (data.url) window.location.href = data.url;
      } else {
        // Create new checkout session
        const res = await fetch(`${supabaseUrl}/functions/v1/create-checkout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ plan: 'monthly' }),
        });
        const data = await res.json();
        if (data.url) window.location.href = data.url;
      }
    } catch (err) {
      console.error('Billing error:', err);
    } finally {
      setBillingLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const statusConfig = {
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

        {/* Trial / Subscription Info */}
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
          {/* Billing */}
          <button
            onClick={handleManageBilling}
            disabled={billingLoading}
            className="w-full rounded-2xl bg-white border border-black/5 p-5 flex items-center gap-4 hover:bg-neutral-50 transition-colors text-left disabled:opacity-50"
          >
            <div className="w-10 h-10 rounded-xl bg-[#f2f2f2] flex items-center justify-center flex-shrink-0">
              <CreditCard className="w-5 h-5 text-[#202020]" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-[#202020]">
                {hasAccess() && !isTrialActive() ? 'Manage Subscription' : 'Upgrade to Pro'}
              </h3>
              <p className="text-xs text-[#5c5c5c] mt-0.5">
                {hasAccess() && !isTrialActive()
                  ? 'Update payment method, change plan, or cancel'
                  : '$8/month • Full access to all features'}
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-[#999] flex-shrink-0" />
          </button>

          {/* Download App */}
          <a
            href="https://github.com/JohnsonGAO-Kainuo/velo-studio/releases"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full rounded-2xl bg-white border border-black/5 p-5 flex items-center gap-4 hover:bg-neutral-50 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-[#f2f2f2] flex items-center justify-center flex-shrink-0">
              <Download className="w-5 h-5 text-[#202020]" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-[#202020]">Download Velo Studio</h3>
              <p className="text-xs text-[#5c5c5c] mt-0.5">macOS • Apple Silicon & Intel</p>
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
      </div>
    </div>
  );
}
