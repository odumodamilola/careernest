import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { User, UserRole } from '../types';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  checkAuth: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  error: null,

  checkAuth: async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) throw error;
      
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        set({ 
          user: {
            id: session.user.id,
            email: session.user.email!,
            ...profile
          },
          loading: false 
        });
      } else {
        set({ user: null, loading: false });
      }
    } catch (error) {
      console.error('Auth error:', error);
      set({ error: 'Authentication failed', loading: false });
    }
  },

  login: async (email: string, password: string) => {
    set({ loading: true, error: null });
    
    try {
      const { data: { session }, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        set({ 
          user: {
            id: session.user.id,
            email: session.user.email!,
            ...profile
          },
          loading: false 
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      set({ error: 'Invalid credentials', loading: false });
    }
  },

  register: async (email: string, password: string, fullName: string, role: UserRole) => {
    set({ loading: true, error: null });
    
    try {
      const { data: { user }, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role
          }
        }
      });

      if (error) throw error;

      if (user) {
        // Create profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: user.id,
              full_name: fullName,
              role,
              created_at: new Date().toISOString()
            }
          ]);

        if (profileError) throw profileError;

        set({ 
          user: {
            id: user.id,
            email: user.email!,
            fullName,
            role,
            profileComplete: false,
            createdAt: new Date().toISOString()
          },
          loading: false 
        });
      }
    } catch (error) {
      console.error('Registration error:', error);
      set({ error: 'Registration failed', loading: false });
    }
  },

  logout: async () => {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Logout error:', error);
    }

    set({ user: null });
  },

  updateProfile: async (userData) => {
    set({ loading: true });
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('No user found');

      const { error } = await supabase
        .from('profiles')
        .update(userData)
        .eq('id', user.id);

      if (error) throw error;

      set(state => ({
        user: state.user ? { ...state.user, ...userData } : null,
        loading: false
      }));
    } catch (error) {
      console.error('Profile update error:', error);
      set({ error: 'Failed to update profile', loading: false });
    }
  }
}));