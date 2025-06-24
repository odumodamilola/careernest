import { create } from 'zustand';
import { aiMatchingEngine, UserPreferences, MatchScore } from '../lib/ai-matching';
import { DatabaseService } from '../lib/database';
import { toast } from 'sonner';

interface MatchingState {
  userPreferences: UserPreferences | null;
  matches: MatchScore[];
  loading: boolean;
  error: string | null;
  
  // Actions
  setUserPreferences: (preferences: UserPreferences) => void;
  findMatches: (userId: string) => Promise<void>;
  updatePreferences: (updates: Partial<UserPreferences>) => Promise<void>;
  getInstantMatches: (preferences: UserPreferences) => Promise<MatchScore[]>;
  recordInteraction: (targetUserId: string, interactionType: string) => void;
  
  // Real-time matching
  enableRealTimeMatching: (userId: string) => void;
  disableRealTimeMatching: () => void;
}

export const useMatchingStore = create<MatchingState>((set, get) => ({
  userPreferences: null,
  matches: [],
  loading: false,
  error: null,

  setUserPreferences: (preferences: UserPreferences) => {
    set({ userPreferences: preferences });
  },

  findMatches: async (userId: string) => {
    set({ loading: true, error: null });
    
    try {
      const { userPreferences } = get();
      if (!userPreferences) {
        throw new Error('User preferences not set');
      }

      // In a real implementation, fetch from database
      const mockCandidates: UserPreferences[] = [
        {
          id: 'mentor-1',
          role: 'mentor',
          skills: ['React', 'TypeScript', 'Node.js', 'AWS'],
          interests: ['Web Development', 'Mentoring', 'Startup Culture'],
          goals: ['Help others grow', 'Share knowledge'],
          experience_level: 'senior',
          industry: ['Technology'],
          timezone: 'America/New_York',
          availability: { 
            days: ['Monday', 'Wednesday', 'Friday'], 
            hours: ['18:00', '19:00', '20:00'] 
          },
          communication_style: 'supportive',
          session_frequency: 'weekly',
          session_duration: '60min',
          mentorship_type: 'technical',
          personality_traits: ['Patient', 'Encouraging', 'Analytical'],
          learning_style: 'mixed',
          languages: ['English'],
          remote_preference: 'remote_only'
        },
        {
          id: 'mentor-2',
          role: 'mentor',
          skills: ['Python', 'Machine Learning', 'Data Science', 'TensorFlow'],
          interests: ['AI', 'Data Science', 'Research'],
          goals: ['Advance AI field', 'Mentor next generation'],
          experience_level: 'executive',
          industry: ['Technology', 'Research'],
          timezone: 'America/Los_Angeles',
          availability: { 
            days: ['Tuesday', 'Thursday', 'Saturday'], 
            hours: ['10:00', '14:00', '16:00'] 
          },
          communication_style: 'formal',
          session_frequency: 'biweekly',
          session_duration: '90min',
          mentorship_type: 'technical',
          personality_traits: ['Analytical', 'Direct', 'Innovative'],
          learning_style: 'visual',
          languages: ['English', 'Spanish'],
          remote_preference: 'hybrid'
        }
      ];

      const matches = aiMatchingEngine.findEnhancedMatches(
        userPreferences,
        mockCandidates,
        10
      );

      set({ matches, loading: false });
      
      toast.success(`Found ${matches.length} perfect matches!`);
      
    } catch (error: any) {
      console.error('Error finding matches:', error);
      set({ error: error.message, loading: false });
      toast.error('Failed to find matches');
    }
  },

  updatePreferences: async (updates: Partial<UserPreferences>) => {
    const { userPreferences } = get();
    if (!userPreferences) return;

    const updatedPreferences = { ...userPreferences, ...updates };
    
    try {
      // Save to database
      await DatabaseService.updateProfile(userPreferences.id, {
        mentorship_preferences: updatedPreferences
      });

      set({ userPreferences: updatedPreferences });
      
      // Re-find matches with updated preferences
      await get().findMatches(userPreferences.id);
      
      toast.success('Preferences updated and matches refreshed!');
      
    } catch (error: any) {
      console.error('Error updating preferences:', error);
      toast.error('Failed to update preferences');
    }
  },

  getInstantMatches: async (preferences: UserPreferences): Promise<MatchScore[]> => {
    try {
      // Mock candidate pool for instant matching
      const candidatePool: UserPreferences[] = [
        // Add more mock candidates here
      ];

      const instantMatches = aiMatchingEngine.getInstantMatches(preferences, candidatePool);
      return instantMatches;
      
    } catch (error: any) {
      console.error('Error getting instant matches:', error);
      return [];
    }
  },

  recordInteraction: (targetUserId: string, interactionType: string) => {
    const { userPreferences } = get();
    if (!userPreferences) return;

    // Record user interaction for collaborative filtering
    const interaction = {
      targetId: targetUserId,
      type: interactionType,
      timestamp: new Date().toISOString()
    };

    // Update AI engine with interaction data
    const currentInteractions = []; // Get from storage
    aiMatchingEngine.updateUserInteractions(userPreferences.id, [
      ...currentInteractions,
      interaction
    ]);
  },

  enableRealTimeMatching: (userId: string) => {
    // Set up real-time matching updates
    const interval = setInterval(async () => {
      const { userPreferences } = get();
      if (userPreferences) {
        await get().findMatches(userId);
      }
    }, 30000); // Update every 30 seconds

    // Store interval ID for cleanup
    (window as any).matchingInterval = interval;
  },

  disableRealTimeMatching: () => {
    if ((window as any).matchingInterval) {
      clearInterval((window as any).matchingInterval);
      delete (window as any).matchingInterval;
    }
  }
}));