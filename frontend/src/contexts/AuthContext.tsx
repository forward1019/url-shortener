'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { getSupabase, UserData } from '@/lib/supabase';

type AuthContextType = {
  user: UserData | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  token?: string | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
};

// Create the context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  signInWithGoogle: async () => {},
  signOut: async () => {},
});

// Hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const supabase = getSupabase();

  useEffect(() => {
    // Check active session on mount
    const checkSession = async () => {
      setIsLoading(true);

      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (session) {
          setToken(session.access_token);
          const { data: { user } } = await supabase.auth.getUser();

          if (user) {
            setUser({
              id: user.id,
              email: user.email,
              name: user.user_metadata?.name || user.email?.split('@')[0],
              avatar_url: user.user_metadata?.avatar_url,
            });
          }
        } else {
         setToken(null);
        }
      } catch (error) {
        console.error('Error checking session:', error);
         setToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setToken(session.access_token);
          setUser({
            id: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0],
            avatar_url: session.user.user_metadata?.avatar_url,
          });
        } else {
          setUser(null);
          setToken(null);
        }
        setIsLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        token,
        signInWithGoogle,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
