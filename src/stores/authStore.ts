import { create } from 'zustand';
import { User, UserRole } from '../types';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  
  // For demo purposes, we'll use a simulated auth flow
  checkAuth: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
}

// Mock user for demonstration
const DEMO_USER: User = {
  id: '1',
  email: 'demo@careernest.com',
  fullName: 'Jamie Smith',
  avatar: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=150',
  headline: 'Senior Frontend Developer | React & TypeScript',
  role: 'mentee',
  isVerified: true,
  createdAt: new Date().toISOString(),
  profileComplete: true,
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  error: null,
  
  checkAuth: async () => {
    set({ loading: true });
    
    // Simulating an API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user exists in localStorage (in a real app, verify token with backend)
    const savedUser = localStorage.getItem('careernest_user');
    
    if (savedUser) {
      set({ user: JSON.parse(savedUser), loading: false });
    } else {
      // For demo, automatically log in the demo user
      localStorage.setItem('careernest_user', JSON.stringify(DEMO_USER));
      set({ user: DEMO_USER, loading: false });
    }
  },
  
  login: async (email: string, password: string) => {
    set({ loading: true, error: null });
    
    try {
      // Simulating an API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, accept any credentials
      localStorage.setItem('careernest_user', JSON.stringify(DEMO_USER));
      set({ user: DEMO_USER, loading: false });
    } catch (error) {
      set({ error: 'Invalid credentials', loading: false });
    }
  },
  
  register: async (email, password, fullName, role) => {
    set({ loading: true, error: null });
    
    try {
      // Simulating an API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser: User = {
        ...DEMO_USER,
        email,
        fullName,
        role,
        profileComplete: false,
      };
      
      localStorage.setItem('careernest_user', JSON.stringify(newUser));
      set({ user: newUser, loading: false });
    } catch (error) {
      set({ error: 'Registration failed', loading: false });
    }
  },
  
  logout: async () => {
    // Simulating an API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    localStorage.removeItem('careernest_user');
    set({ user: null });
  },
  
  updateProfile: async (userData) => {
    set({ loading: true });
    
    try {
      // Simulating an API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const currentUser = localStorage.getItem('careernest_user');
      if (currentUser) {
        const updatedUser = { ...JSON.parse(currentUser), ...userData };
        localStorage.setItem('careernest_user', JSON.stringify(updatedUser));
        set({ user: updatedUser, loading: false });
      }
    } catch (error) {
      set({ error: 'Failed to update profile', loading: false });
    }
  }
}));