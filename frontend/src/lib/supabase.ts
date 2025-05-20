import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Initialize the Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Type definition for user data
export type UserData = {
  id: string;
  email?: string;
  name?: string;
  avatar_url?: string;
};

// Create a singleton Supabase client
let supabase: SupabaseClient | null = null;

export const getSupabase = (): SupabaseClient => {
  if (supabase === null) {
    supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }
  return supabase;
};

// Hook to get the current user
export const getCurrentUser = async (): Promise<UserData | null> => {
  const supabase = getSupabase();
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      name: user.user_metadata?.name || user.email?.split('@')[0],
      avatar_url: user.user_metadata?.avatar_url,
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};
