import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Provide fallback values for development
const defaultUrl = 'https://placeholder.supabase.co';
const defaultKey = 'placeholder-key';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables not found. Using placeholder values.');
}

export const supabase = createClient(
  supabaseUrl || defaultUrl,
  supabaseAnonKey || defaultKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      flowType: 'pkce'
    },
    realtime: {
      params: {
        eventsPerSecond: 10
      }
    },
    global: {
      headers: {
        'X-Client-Info': 'careernest-web'
      }
    }
  }
);

// Helper function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return supabaseUrl && supabaseAnonKey && 
         supabaseUrl !== defaultUrl && 
         supabaseAnonKey !== defaultKey &&
         supabaseUrl.includes('supabase.co');
};

// Auth helper functions with better error handling
export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
      console.error('Error getting current user:', error);
      return null;
    }
    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

export const signInWithEmail = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password
    });
    
    if (error) {
      console.error('Sign in error:', error);
      throw new Error(getAuthErrorMessage(error));
    }
    
    return data;
  } catch (error: any) {
    console.error('Error signing in:', error);
    throw error;
  }
};

export const signUpWithEmail = async (email: string, password: string, metadata?: any) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: {
        data: metadata,
        emailRedirectTo: window.location.origin
      }
    });
    
    if (error) {
      console.error('Sign up error:', error);
      throw new Error(getAuthErrorMessage(error));
    }
    
    return data;
  } catch (error: any) {
    console.error('Error signing up:', error);
    throw error;
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Sign out error:', error);
      throw new Error(getAuthErrorMessage(error));
    }
  } catch (error: any) {
    console.error('Error signing out:', error);
    throw error;
  }
};

// Helper function to get user-friendly error messages
const getAuthErrorMessage = (error: any): string => {
  if (!error) return 'An unknown error occurred';
  
  const message = error.message?.toLowerCase() || '';
  
  if (message.includes('invalid login credentials')) {
    return 'Invalid email or password. Please check your credentials and try again.';
  }
  
  if (message.includes('email not confirmed')) {
    return 'Please check your email and click the confirmation link before signing in.';
  }
  
  if (message.includes('user already registered')) {
    return 'An account with this email already exists. Please sign in instead.';
  }
  
  if (message.includes('password should be at least')) {
    return 'Password must be at least 6 characters long.';
  }
  
  if (message.includes('invalid email')) {
    return 'Please enter a valid email address.';
  }
  
  if (message.includes('signup is disabled')) {
    return 'Account registration is currently disabled. Please contact support.';
  }
  
  if (message.includes('rate limit')) {
    return 'Too many attempts. Please wait a moment before trying again.';
  }
  
  if (message.includes('network')) {
    return 'Network error. Please check your internet connection and try again.';
  }
  
  // Return the original error message if we don't have a specific mapping
  return error.message || 'An error occurred during authentication';
};

// Test Supabase connection
export const testSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('profiles').select('count').limit(1);
    return { success: !error, error };
  } catch (error) {
    return { success: false, error };
  }
};