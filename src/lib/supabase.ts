import { createClient } from '@supabase/supabase-js';

export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ncqhyutgoackqjrttkcm.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5jcWh5dXRnb2Fja3FqcnR0a2NtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4Mjg3MTMsImV4cCI6MjA4NzQwNDcxM30.7ZxNiWm7tNV11I8Bm8FSJ5t4XF-OcE81RX4GxdTvsD4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type SubscriptionStatus = 'trialing' | 'active' | 'canceled' | 'expired' | 'past_due';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  trial_start: string;
  trial_end: string;
  stripe_customer_id: string | null;
  subscription_status: SubscriptionStatus;
  subscription_id: string | null;
  subscription_end: string | null;
  created_at: string;
  updated_at: string;
}
