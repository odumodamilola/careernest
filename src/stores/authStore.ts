import { create } from 'zustand';
import { authService, EnterpriseUser } from '../lib/auth/authService';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { toast } from 'sonner';

interface AuthState {
  user: EnterpriseUser | null;
  loading: boolean;
  error: string | null;
  isConfigured: boolean;
  
  // Actions
  checkAuth: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, userData: any) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
  updateProfile: (userData: Partial<EnterpriseUser>) => Promise<void>;
  
  // Credit management
  checkCredits: (requiredCredits: number) => Promise<boolean>;
  consumeCredits: (credits: number, actionType: string, feature?: string) => Promise<boolean>;
  
  // Utility
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
      
      const user = await authService.getCurrentUser();
      
      set({ 
        user,
        loading: false,
        error: null,
        isConfigured: true
      });
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
      const errorMsg = 'Supabase not configured. Please set up your environment variables.';
      set({ error: errorMsg });
      toast.error(errorMsg);
      return;
    }

    // Validate inputs
    if (!email || !password) {
      const errorMsg = 'Email and password are required';
      set({ error: errorMsg });
      toast.error(errorMsg);
      return;
    }

    set({ loading: true, error: null });
    
    try {
      const result = await authService.loginUser(email, password);
      
      if (result.error) {
        throw new Error(result.error);
      }

      set({ 
        user: result.user,
        loading: false,
        error: null
      });

      toast.success('Successfully logged in!');
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = error.message || 'Login failed';
      
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
    }
  },

  register: async (email: string, password: string, userData: any) => {
    if (!isSupabaseConfigured()) {
      const errorMsg = 'Supabase not configured. Please set up your environment variables.';
      set({ error: errorMsg });
      toast.error(errorMsg);
      return;
    }

    // Validate inputs
    if (!email || !password || !userData.fullName) {
      const errorMsg = 'All fields are required';
      set({ error: errorMsg });
      toast.error(errorMsg);
      return;
    }

    set({ loading: true, error: null });
    
    try {
      const result = await authService.registerUser(email, password, userData);
      
      if (result.error) {
        throw new Error(result.error);
      }

      set({ 
        user: result.user,
        loading: false,
        error: null
      });

      toast.success('Account created successfully! Please check your email to confirm your account.');
    } catch (error: any) {
      console.error('Registration error:', error);
      const errorMessage = error.message || 'Registration failed';
      
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
    }
  },

  logout: async () => {
    try {
      await authService.logoutUser();
      set({ user: null, error: null });
      toast.success('Successfully logged out');
    } catch (error: any) {
      console.error('Logout error:', error);
      toast.error('Logout failed');
    }
  },

  resetPassword: async (email: string) => {
    try {
      await authService.resetPassword(email);
      toast.success('Password reset email sent. Please check your inbox.');
    } catch (error: any) {
      console.error('Password reset error:', error);
      toast.error(error.message || 'Failed to send password reset email');
    }
  },

  updatePassword: async (newPassword: string) => {
    try {
      await authService.updatePassword(newPassword);
      toast.success('Password updated successfully');
    } catch (error: any) {
      console.error('Password update error:', error);
      toast.error(error.message || 'Failed to update password');
    }
  },

  updateProfile: async (userData) => {
    const currentUser = get().user;
    if (!currentUser) {
      set({ error: 'No user logged in' });
      return;
    }

    set({ loading: true, error: null });
    
    try {
      const { error } = await supabase
        .from('users')
        .update({
          profile_data: { ...currentUser.profileData, ...userData },
          updated_at: new Date().toISOString()
        })
        .eq('id', currentUser.id);

      if (error) throw error;

      set(state => ({
        user: state.user ? { 
          ...state.user, 
          profileData: { ...state.user.profileData, ...userData }
        } : null,
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

  checkCredits: async (requiredCredits: number) => {
    const user = get().user;
    if (!user) return false;

    try {
      const result = await authService.checkCredits(user.id, requiredCredits);
      return result.canProceed;
    } catch (error) {
      console.error('Credit check error:', error);
      return false;
    }
  },

  consumeCredits: async (credits: number, actionType: string, feature?: string) => {
    const user = get().user;
    if (!user) return false;

    try {
      const success = await authService.consumeCredits(user.id, credits, actionType, feature);
      
      if (success) {
        // Update local state
        set(state => ({
          user: state.user ? {
            ...state.user,
            creditsUsed: state.user.creditsUsed + credits
          } : null
        }));
      }
      
      return success;
    } catch (error) {
      console.error('Credit consumption error:', error);
      return false;
    }
  },

  clearError: () => set({ error: null })
}));

// Set up auth state listener with enterprise features
supabase.auth.onAuthStateChange(async (event, session) => {
  const { checkAuth } = useAuthStore.getState();
  
  console.log('Auth state changed:', event, session?.user?.email);
  
  if (event === 'SIGNED_IN') {
    await checkAuth();
    
    // Update user activity
    if (session?.user) {
      await supabase.rpc('update_user_activity', {
        user_uuid: session.user.id
      });
    }
  } else if (event === 'SIGNED_OUT') {
    await checkAuth();
  } else if (event === 'TOKEN_REFRESHED') {
    await checkAuth();
  }
});