import { create } from 'zustand';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { User, UserRole } from '../types';
import { toast } from 'sonner';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  isConfigured: boolean;
  checkAuth: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: true,
  error: null,
  isConfigured: isSupabaseConfigured(),

  checkAuth: async () => {
    if (!isSupabaseConfigured()) {
      set({ 
        user: null, 
        loading: false, 
        error: 'Supabase not configured. Please set up your environment variables.',
        isConfigured: false 
      });
      return;
    }

    try {
      set({ loading: true, error: null });
      
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) throw error;
      
      if (session?.user) {
        // Try to get profile data
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profileError && profileError.code !== 'PGRST116') {
          console.error('Profile fetch error:', profileError);
        }

        const userData: User = {
          id: session.user.id,
          email: session.user.email!,
          fullName: profile?.full_name || session.user.user_metadata?.full_name || '',
          role: profile?.role || 'mentee',
          avatar: profile?.avatar_url,
          headline: profile?.headline,
          bio: profile?.bio,
          location: profile?.location,
          website: profile?.website,
          socialLinks: profile?.social_links || {},
          skills: profile?.skills || [],
          languages: profile?.languages || [],
          interests: profile?.interests || [],
          isVerified: profile?.is_verified || false,
          createdAt: profile?.created_at || session.user.created_at,
          profileComplete: !!profile?.full_name
        };

        set({ 
          user: userData,
          loading: false,
          error: null,
          isConfigured: true
        });
      } else {
        set({ user: null, loading: false, error: null });
      }
    } catch (error: any) {
      console.error('Auth check error:', error);
      set({ 
        error: error.message || 'Authentication failed', 
        loading: false,
        user: null
      });
    }
  },

  login: async (email: string, password: string) => {
    if (!isSupabaseConfigured()) {
      set({ error: 'Supabase not configured' });
      toast.error('Application not properly configured');
      return;
    }

    set({ loading: true, error: null });
    
    try {
      const { data: { session }, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      if (session?.user) {
        // Get or create profile
        let { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profileError && profileError.code === 'PGRST116') {
          // Profile doesn't exist, create one
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert([
              {
                id: session.user.id,
                full_name: session.user.user_metadata?.full_name || '',
                role: 'mentee',
                created_at: new Date().toISOString()
              }
            ])
            .select()
            .single();

          if (createError) throw createError;
          profile = newProfile;
        } else if (profileError) {
          throw profileError;
        }

        const userData: User = {
          id: session.user.id,
          email: session.user.email!,
          fullName: profile?.full_name || '',
          role: profile?.role || 'mentee',
          avatar: profile?.avatar_url,
          headline: profile?.headline,
          bio: profile?.bio,
          location: profile?.location,
          website: profile?.website,
          socialLinks: profile?.social_links || {},
          skills: profile?.skills || [],
          languages: profile?.languages || [],
          interests: profile?.interests || [],
          isVerified: profile?.is_verified || false,
          createdAt: profile?.created_at || session.user.created_at,
          profileComplete: !!profile?.full_name
        };

        set({ 
          user: userData,
          loading: false,
          error: null
        });

        toast.success('Successfully logged in!');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = error.message === 'Invalid login credentials' 
        ? 'Invalid email or password' 
        : error.message || 'Login failed';
      
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
    }
  },

  register: async (email: string, password: string, fullName: string, role: UserRole) => {
    if (!isSupabaseConfigured()) {
      set({ error: 'Supabase not configured' });
      toast.error('Application not properly configured');
      return;
    }

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

        if (profileError) {
          console.error('Profile creation error:', profileError);
          // Don't throw here as the user was created successfully
        }

        const userData: User = {
          id: user.id,
          email: user.email!,
          fullName,
          role,
          isVerified: false,
          createdAt: new Date().toISOString(),
          profileComplete: false,
          socialLinks: {},
          skills: [],
          languages: [],
          interests: []
        };

        set({ 
          user: userData,
          loading: false,
          error: null
        });

        toast.success('Account created successfully!');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      const errorMessage = error.message || 'Registration failed';
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
    }
  },

  logout: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Logout error:', error);
        toast.error('Logout failed');
      } else {
        set({ user: null, error: null });
        toast.success('Successfully logged out');
      }
    } catch (error: any) {
      console.error('Logout error:', error);
      toast.error('Logout failed');
    }
  },

  updateProfile: async (userData) => {
    if (!get().user) {
      set({ error: 'No user logged in' });
      return;
    }

    set({ loading: true, error: null });
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('No user found');

      const { error } = await supabase
        .from('profiles')
        .update({
          ...userData,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      set(state => ({
        user: state.user ? { ...state.user, ...userData } : null,
        loading: false,
        error: null
      }));

      toast.success('Profile updated successfully!');
    } catch (error: any) {
      console.error('Profile update error:', error);
      set({ error: 'Failed to update profile', loading: false });
      toast.error('Failed to update profile');
    }
  },

  clearError: () => set({ error: null })
}));

// Set up auth state listener
supabase.auth.onAuthStateChange((event, session) => {
  const { checkAuth } = useAuthStore.getState();
  
  if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
    checkAuth();
  }
});