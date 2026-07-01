import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext({
  user: null,
  session: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  refreshProfile: async () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch student profile details from the public.users table
  const fetchProfile = async (userId, email) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        // Fallback for newly signed up users if trigger hasn't completed or errored
        console.warn('Profile fetch error, user may be new:', error.message);
        return {
          id: userId,
          email: email,
          full_name: 'Student',
          roll: 'N/A',
          role: 'student',
          status: 'pending',
        };
      }
      return data;
    } catch (err) {
      console.error('Failed to load profile:', err);
      return null;
    }
  };

  const handleUserSession = async (currentSession) => {
    setSession(currentSession);
    
    if (currentSession?.user) {
      const profile = await fetchProfile(currentSession.user.id, currentSession.user.email);
      setUser(profile);
    } else {
      setUser(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    // 1. Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleUserSession(session);
    });

    // 2. Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        handleUserSession(session);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  };

  const register = async (email, password, fullName, roll) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          roll: roll,
        },
      },
    });
    if (error) throw error;
    return data;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
    setSession(null);
  };

  const refreshProfile = async () => {
    if (session?.user) {
      const profile = await fetchProfile(session.user.id, session.user.email);
      setUser(profile);
    }
  };

  const value = {
    user,
    session,
    loading,
    login,
    register,
    logout,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
