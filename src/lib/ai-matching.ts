// AI-Powered Mentor-Mentee Matching Algorithm
// Open-source implementation using collaborative filtering and content-based filtering

export interface UserPreferences {
  id: string;
  role: 'mentor' | 'mentee';
  skills: string[];
  interests: string[];
  goals: string[];
  experience_level: 'entry' | 'mid' | 'senior' | 'executive';
  preferred_mentor_experience?: 'mid' | 'senior' | 'executive';
  industry: string[];
  location?: string;
  timezone: string;
  availability: {
    days: string[];
    hours: string[];
  };
  communication_style: 'formal' | 'casual' | 'mixed';
  session_frequency: 'weekly' | 'biweekly' | 'monthly' | 'flexible';
  session_duration: '30min' | '60min' | '90min' | 'flexible';
  mentorship_type: 'career_guidance' | 'skill_development' | 'leadership' | 'entrepreneurship' | 'technical' | 'mixed';
  personality_traits: string[];
  learning_style: 'visual' | 'auditory' | 'kinesthetic' | 'reading' | 'mixed';
  budget_range?: {
    min: number;
    max: number;
    currency: string;
  };
  languages: string[];
  company_size_preference?: 'startup' | 'small' | 'medium' | 'large' | 'enterprise';
  remote_preference: 'remote_only' | 'in_person' | 'hybrid' | 'no_preference';
}

export interface MatchScore {
  mentorId: string;
  menteeId: string;
  overallScore: number;
  breakdown: {
    skillsMatch: number;
    interestsMatch: number;
    goalsAlignment: number;
    experienceCompatibility: number;
    availabilityMatch: number;
    personalityFit: number;
    communicationStyle: number;
    locationCompatibility: number;
    budgetCompatibility: number;
    languageMatch: number;
  };
  confidence: number;
  reasoning: string[];
}

export interface MatchingWeights {
  skills: number;
  interests: number;
  goals: number;
  experience: number;
  availability: number;
  personality: number;
  communication: number;
  location: number;
  budget: number;
  language: number;
}

export class AIMatchingEngine {
  private defaultWeights: MatchingWeights = {
    skills: 0.25,
    interests: 0.15,
    goals: 0.20,
    experience: 0.15,
    availability: 0.10,
    personality: 0.05,
    communication: 0.03,
    location: 0.03,
    budget: 0.02,
    language: 0.02
  };

  private skillsEmbeddings: Map<string, number[]> = new Map();
  private userInteractionHistory: Map<string, any[]> = new Map();

  constructor() {
    this.initializeSkillsEmbeddings();
  }

  // Initialize skill embeddings using a simple word2vec-like approach
  private initializeSkillsEmbeddings(): void {
    const skillCategories = {
      'frontend': ['react', 'vue', 'angular', 'javascript', 'typescript', 'html', 'css', 'tailwind'],
      'backend': ['node.js', 'python', 'java', 'go', 'rust', 'php', 'ruby', 'c#'],
      'database': ['postgresql', 'mongodb', 'mysql', 'redis', 'elasticsearch', 'cassandra'],
      'cloud': ['aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform'],
      'mobile': ['react-native', 'flutter', 'ios', 'android', 'swift', 'kotlin'],
      'data': ['machine-learning', 'data-science', 'python', 'r', 'sql', 'tableau', 'powerbi'],
      'design': ['ui/ux', 'figma', 'sketch', 'adobe-creative', 'prototyping', 'user-research'],
      'management': ['project-management', 'agile', 'scrum', 'leadership', 'team-building'],
      'business': ['strategy', 'marketing', 'sales', 'finance', 'operations', 'consulting']
    };

    // Create simple embeddings based on category relationships
    Object.entries(skillCategories).forEach(([category, skills], categoryIndex) => {
      skills.forEach((skill, skillIndex) => {
        const embedding = new Array(50).fill(0);
        embedding[categoryIndex] = 1.0;
        embedding[categoryIndex + 10] = skillIndex / skills.length;
        this.skillsEmbeddings.set(skill.toLowerCase(), embedding);
      });
    });
  }

  // Calculate cosine similarity between two vectors
  private cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) return 0;
    
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    
    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    
    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  // Calculate Jaccard similarity for sets
  private jaccardSimilarity(set1: string[], set2: string[]): number {
    const s1 = new Set(set1.map(s => s.toLowerCase()));
    const s2 = new Set(set2.map(s => s.toLowerCase()));
    
    const intersection = new Set([...s1].filter(x => s2.has(x)));
    const union = new Set([...s1, ...s2]);
    
    return union.size === 0 ? 0 : intersection.size / union.size;
  }

  // Calculate skills compatibility using embeddings
  private calculateSkillsMatch(mentorSkills: string[], menteeSkills: string[]): number {
    if (mentorSkills.length === 0 || menteeSkills.length === 0) return 0;

    let totalSimilarity = 0;
    let validComparisons = 0;

    for (const menteeSkill of menteeSkills) {
      let maxSimilarity = 0;
      const menteeEmbedding = this.skillsEmbeddings.get(menteeSkill.toLowerCase());
      
      if (menteeEmbedding) {
        for (const mentorSkill of mentorSkills) {
          const mentorEmbedding = this.skillsEmbeddings.get(mentorSkill.toLowerCase());
          if (mentorEmbedding) {
            const similarity = this.cosineSimilarity(menteeEmbedding, mentorEmbedding);
            maxSimilarity = Math.max(maxSimilarity, similarity);
          }
        }
        totalSimilarity += maxSimilarity;
        validComparisons++;
      }
    }

    // Fallback to Jaccard similarity if embeddings not available
    if (validComparisons === 0) {
      return this.jaccardSimilarity(mentorSkills, menteeSkills);
    }

    return validComparisons > 0 ? totalSimilarity / validComparisons : 0;
  }

  // Calculate experience level compatibility
  private calculateExperienceMatch(mentorLevel: string, menteeLevel: string, menteePreference?: string): number {
    const experienceLevels = { 'entry': 1, 'mid': 2, 'senior': 3, 'executive': 4 };
    const mentorScore = experienceLevels[mentorLevel as keyof typeof experienceLevels] || 0;
    const menteeScore = experienceLevels[menteeLevel as keyof typeof experienceLevels] || 0;
    
    // Ideal mentor should be 1-2 levels above mentee
    const idealDifference = menteePreference ? 
      experienceLevels[menteePreference as keyof typeof experienceLevels] - menteeScore :
      1.5;
    
    const actualDifference = mentorScore - menteeScore;
    
    if (actualDifference <= 0) return 0.1; // Mentor should be more experienced
    if (actualDifference > 3) return 0.3; // Too big gap
    
    // Optimal range is 1-2 levels difference
    if (actualDifference >= 1 && actualDifference <= 2) return 1.0;
    return Math.max(0.5, 1 - Math.abs(actualDifference - idealDifference) * 0.3);
  }

  // Calculate availability overlap
  private calculateAvailabilityMatch(mentorAvail: any, menteeAvail: any): number {
    const dayOverlap = this.jaccardSimilarity(mentorAvail.days, menteeAvail.days);
    const hourOverlap = this.jaccardSimilarity(mentorAvail.hours, menteeAvail.hours);
    
    return (dayOverlap + hourOverlap) / 2;
  }

  // Calculate timezone compatibility
  private calculateTimezoneCompatibility(mentorTz: string, menteeTz: string): number {
    // Simplified timezone compatibility - in real implementation, use proper timezone library
    const timezoneGroups = {
      'UTC': ['UTC', 'GMT'],
      'US_EAST': ['EST', 'EDT', 'America/New_York'],
      'US_WEST': ['PST', 'PDT', 'America/Los_Angeles'],
      'EU': ['CET', 'CEST', 'Europe/London', 'Europe/Berlin'],
      'ASIA': ['JST', 'Asia/Tokyo', 'Asia/Shanghai', 'IST', 'Asia/Kolkata']
    };

    for (const group of Object.values(timezoneGroups)) {
      if (group.includes(mentorTz) && group.includes(menteeTz)) {
        return 1.0;
      }
    }

    // Different timezone groups - partial compatibility
    return 0.3;
  }

  // Calculate budget compatibility
  private calculateBudgetMatch(mentorRate?: number, menteeBudget?: { min: number; max: number }): number {
    if (!mentorRate || !menteeBudget) return 0.5; // Neutral if no budget info
    
    if (mentorRate >= menteeBudget.min && mentorRate <= menteeBudget.max) {
      return 1.0;
    }
    
    // Calculate how far off the rate is from the budget range
    const distance = mentorRate < menteeBudget.min ? 
      (menteeBudget.min - mentorRate) / menteeBudget.min :
      (mentorRate - menteeBudget.max) / menteeBudget.max;
    
    return Math.max(0, 1 - distance);
  }

  // Calculate personality compatibility using Big Five traits
  private calculatePersonalityMatch(mentorTraits: string[], menteeTraits: string[]): number {
    const personalityMapping = {
      'extroverted': 1, 'introverted': -1,
      'analytical': 1, 'creative': 0.5,
      'detail-oriented': 1, 'big-picture': 0.5,
      'patient': 1, 'energetic': 0.7,
      'structured': 1, 'flexible': 0.8,
      'direct': 0.8, 'supportive': 1,
      'challenging': 0.7, 'encouraging': 1
    };

    let compatibility = 0;
    let count = 0;

    for (const menteeTrait of menteeTraits) {
      for (const mentorTrait of mentorTraits) {
        const menteeScore = personalityMapping[menteeTrait as keyof typeof personalityMapping] || 0;
        const mentorScore = personalityMapping[mentorTrait as keyof typeof personalityMapping] || 0;
        
        // Good mentors should complement mentee traits
        compatibility += Math.abs(mentorScore - menteeScore) < 0.5 ? 1 : 0.5;
        count++;
      }
    }

    return count > 0 ? compatibility / count : 0.5;
  }

  // Main matching algorithm
  public calculateMatch(mentor: UserPreferences, mentee: UserPreferences, weights?: Partial<MatchingWeights>): MatchScore {
    const finalWeights = { ...this.defaultWeights, ...weights };

    // Calculate individual match scores
    const skillsMatch = this.calculateSkillsMatch(mentor.skills, mentee.skills);
    const interestsMatch = this.jaccardSimilarity(mentor.interests, mentee.interests);
    const goalsAlignment = this.jaccardSimilarity(mentor.goals || [], mentee.goals);
    const experienceCompatibility = this.calculateExperienceMatch(
      mentor.experience_level, 
      mentee.experience_level, 
      mentee.preferred_mentor_experience
    );
    const availabilityMatch = this.calculateAvailabilityMatch(mentor.availability, mentee.availability);
    const personalityFit = this.calculatePersonalityMatch(mentor.personality_traits, mentee.personality_traits);
    
    // Communication and preference matches
    const communicationStyle = mentor.communication_style === mentee.communication_style ? 1.0 : 0.5;
    const locationCompatibility = mentor.location === mentee.location ? 1.0 : 
      this.calculateTimezoneCompatibility(mentor.timezone, mentee.timezone);
    const languageMatch = this.jaccardSimilarity(mentor.languages, mentee.languages);
    
    // Budget compatibility (assuming mentor has hourly rate)
    const budgetCompatibility = this.calculateBudgetMatch(
      (mentor as any).hourly_rate, 
      mentee.budget_range
    );

    // Calculate weighted overall score
    const overallScore = 
      skillsMatch * finalWeights.skills +
      interestsMatch * finalWeights.interests +
      goalsAlignment * finalWeights.goals +
      experienceCompatibility * finalWeights.experience +
      availabilityMatch * finalWeights.availability +
      personalityFit * finalWeights.personality +
      communicationStyle * finalWeights.communication +
      locationCompatibility * finalWeights.location +
      budgetCompatibility * finalWeights.budget +
      languageMatch * finalWeights.language;

    // Calculate confidence based on data completeness
    const dataCompleteness = this.calculateDataCompleteness(mentor, mentee);
    const confidence = Math.min(0.95, overallScore * dataCompleteness);

    // Generate reasoning
    const reasoning = this.generateMatchReasoning({
      skillsMatch,
      interestsMatch,
      goalsAlignment,
      experienceCompatibility,
      availabilityMatch,
      personalityFit,
      communicationStyle,
      locationCompatibility,
      budgetCompatibility,
      languageMatch
    });

    return {
      mentorId: mentor.id,
      menteeId: mentee.id,
      overallScore,
      breakdown: {
        skillsMatch,
        interestsMatch,
        goalsAlignment,
        experienceCompatibility,
        availabilityMatch,
        personalityFit,
        communicationStyle,
        locationCompatibility,
        budgetCompatibility,
        languageMatch
      },
      confidence,
      reasoning
    };
  }

  // Calculate data completeness for confidence scoring
  private calculateDataCompleteness(mentor: UserPreferences, mentee: UserPreferences): number {
    const mentorFields = [
      mentor.skills.length > 0,
      mentor.interests.length > 0,
      mentor.experience_level,
      mentor.availability.days.length > 0,
      mentor.personality_traits.length > 0,
      mentor.languages.length > 0
    ];

    const menteeFields = [
      mentee.skills.length > 0,
      mentee.interests.length > 0,
      mentee.goals.length > 0,
      mentee.availability.days.length > 0,
      mentee.personality_traits.length > 0,
      mentee.languages.length > 0
    ];

    const mentorCompleteness = mentorFields.filter(Boolean).length / mentorFields.length;
    const menteeCompleteness = menteeFields.filter(Boolean).length / menteeFields.length;

    return (mentorCompleteness + menteeCompleteness) / 2;
  }

  // Generate human-readable reasoning for the match
  private generateMatchReasoning(breakdown: any): string[] {
    const reasoning: string[] = [];

    if (breakdown.skillsMatch > 0.8) {
      reasoning.push("Excellent skills alignment - mentor has strong expertise in mentee's areas of interest");
    } else if (breakdown.skillsMatch > 0.6) {
      reasoning.push("Good skills overlap with opportunities for growth");
    } else if (breakdown.skillsMatch < 0.3) {
      reasoning.push("Limited skills overlap - may require broader mentorship approach");
    }

    if (breakdown.experienceCompatibility > 0.8) {
      reasoning.push("Optimal experience gap for effective mentorship");
    } else if (breakdown.experienceCompatibility < 0.4) {
      reasoning.push("Experience levels may not be ideally matched");
    }

    if (breakdown.availabilityMatch > 0.7) {
      reasoning.push("Strong availability overlap for regular sessions");
    } else if (breakdown.availabilityMatch < 0.3) {
      reasoning.push("Limited availability overlap - may require flexible scheduling");
    }

    if (breakdown.goalsAlignment > 0.6) {
      reasoning.push("Well-aligned career goals and objectives");
    }

    if (breakdown.personalityFit > 0.7) {
      reasoning.push("Compatible personality traits for effective mentoring relationship");
    }

    if (breakdown.locationCompatibility > 0.8) {
      reasoning.push("Same location/timezone for easy coordination");
    } else if (breakdown.locationCompatibility < 0.4) {
      reasoning.push("Different timezones - remote mentorship recommended");
    }

    return reasoning;
  }

  // Find best matches for a mentee
  public findBestMatches(mentee: UserPreferences, mentors: UserPreferences[], limit: number = 10): MatchScore[] {
    const matches = mentors
      .filter(mentor => mentor.role === 'mentor')
      .map(mentor => this.calculateMatch(mentor, mentee))
      .sort((a, b) => b.overallScore - a.overallScore)
      .slice(0, limit);

    return matches;
  }

  // Find best matches for a mentor
  public findBestMentees(mentor: UserPreferences, mentees: UserPreferences[], limit: number = 10): MatchScore[] {
    const matches = mentees
      .filter(mentee => mentee.role === 'mentee')
      .map(mentee => this.calculateMatch(mentor, mentee))
      .sort((a, b) => b.overallScore - a.overallScore)
      .slice(0, limit);

    return matches;
  }

  // Collaborative filtering based on user interactions
  public updateUserInteractions(userId: string, interactions: any[]): void {
    this.userInteractionHistory.set(userId, interactions);
  }

  // Get similar users based on interaction patterns
  private findSimilarUsers(userId: string, allUsers: UserPreferences[]): string[] {
    const userInteractions = this.userInteractionHistory.get(userId) || [];
    const similarities: { userId: string; similarity: number }[] = [];

    for (const user of allUsers) {
      if (user.id === userId) continue;
      
      const otherInteractions = this.userInteractionHistory.get(user.id) || [];
      const similarity = this.calculateInteractionSimilarity(userInteractions, otherInteractions);
      
      if (similarity > 0.3) {
        similarities.push({ userId: user.id, similarity });
      }
    }

    return similarities
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 10)
      .map(s => s.userId);
  }

  // Calculate similarity between user interaction patterns
  private calculateInteractionSimilarity(interactions1: any[], interactions2: any[]): number {
    // Simplified collaborative filtering based on common interactions
    const set1 = new Set(interactions1.map(i => i.targetId));
    const set2 = new Set(interactions2.map(i => i.targetId));
    
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    
    return union.size === 0 ? 0 : intersection.size / union.size;
  }

  // Enhanced matching with collaborative filtering
  public findEnhancedMatches(
    user: UserPreferences, 
    candidates: UserPreferences[], 
    limit: number = 10
  ): MatchScore[] {
    // Get content-based matches
    const contentMatches = user.role === 'mentee' ? 
      this.findBestMatches(user, candidates, limit * 2) :
      this.findBestMentees(user, candidates, limit * 2);

    // Get collaborative filtering recommendations
    const similarUsers = this.findSimilarUsers(user.id, candidates);
    
    // Boost scores for candidates recommended by similar users
    const enhancedMatches = contentMatches.map(match => {
      const targetId = user.role === 'mentee' ? match.mentorId : match.menteeId;
      const collaborativeBoost = similarUsers.includes(targetId) ? 0.1 : 0;
      
      return {
        ...match,
        overallScore: Math.min(1.0, match.overallScore + collaborativeBoost),
        reasoning: collaborativeBoost > 0 ? 
          [...match.reasoning, "Recommended by users with similar preferences"] :
          match.reasoning
      };
    });

    return enhancedMatches
      .sort((a, b) => b.overallScore - a.overallScore)
      .slice(0, limit);
  }

  // Real-time matching for immediate suggestions
  public getInstantMatches(userPreferences: UserPreferences, candidatePool: UserPreferences[]): MatchScore[] {
    // Quick matching algorithm for real-time suggestions
    const quickMatches = candidatePool
      .filter(candidate => candidate.role !== userPreferences.role)
      .map(candidate => {
        const skillsMatch = this.jaccardSimilarity(candidate.skills, userPreferences.skills);
        const interestsMatch = this.jaccardSimilarity(candidate.interests, userPreferences.interests);
        const quickScore = (skillsMatch * 0.6) + (interestsMatch * 0.4);
        
        return {
          mentorId: candidate.role === 'mentor' ? candidate.id : userPreferences.id,
          menteeId: candidate.role === 'mentee' ? candidate.id : userPreferences.id,
          overallScore: quickScore,
          breakdown: {
            skillsMatch,
            interestsMatch,
            goalsAlignment: 0,
            experienceCompatibility: 0,
            availabilityMatch: 0,
            personalityFit: 0,
            communicationStyle: 0,
            locationCompatibility: 0,
            budgetCompatibility: 0,
            languageMatch: 0
          },
          confidence: quickScore * 0.7, // Lower confidence for quick matches
          reasoning: ['Quick match based on skills and interests']
        };
      })
      .sort((a, b) => b.overallScore - a.overallScore)
      .slice(0, 5);

    return quickMatches;
  }
}

// Export singleton instance
export const aiMatchingEngine = new AIMatchingEngine();