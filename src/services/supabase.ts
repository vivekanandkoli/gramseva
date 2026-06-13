import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// Lazy — only create the real client when credentials are set
let _supabase: ReturnType<typeof import('@supabase/supabase-js').createClient> | null = null;

export function getSupabase() {
  if (!isSupabaseConfigured) return null;
  if (!_supabase) {
    // Dynamic require so the import doesn't crash on startup when unconfigured
    const { createClient } = require('@supabase/supabase-js');
    _supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    });
  }
  return _supabase;
}

// Named export kept for compatibility — returns null when unconfigured
export const supabase = new Proxy({} as NonNullable<ReturnType<typeof getSupabase>>, {
  get(_target, prop) {
    const client = getSupabase();
    if (!client) {
      // Return a no-op stub so callers don't crash
      if (prop === 'from') return () => ({ select: () => Promise.resolve({ data: [], error: null }), insert: () => Promise.resolve({ data: null, error: null }), update: () => Promise.resolve({ data: null, error: null }), eq: function() { return this; }, single: () => Promise.resolve({ data: null, error: null }) });
      if (prop === 'auth') return { signInWithOtp: () => Promise.resolve({ error: null }), verifyOtp: () => Promise.resolve({ data: { user: null }, error: null }), getUser: () => Promise.resolve({ data: { user: null } }) };
      return () => Promise.resolve({ data: null, error: null });
    }
    return (client as any)[prop];
  },
});
