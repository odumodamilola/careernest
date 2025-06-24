import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { aiMatchingEngine, UserPreferences } from '../../lib/ai-matching';
import { 
  Brain, 
  Target, 
  Clock, 
  MapPin, 
  DollarSign, 
  Users, 
  MessageSquare,
  Calendar,
  Globe,
  Award,
  Zap,
  CheckCircle,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner';

interface PreferencesFormProps {
  onComplete: (preferences: UserPreferences) => void;
}

export function PreferencesForm({ onComplete }: PreferencesFormProps) {
  const { user, updateProfile } = useAuthStore();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [matches, setMatches] = useState<any[]>([]);
  
  const [preferences, setPreferences] = useState<Partial<UserPreferences>>({
    id: user?.id || '',
    role: user?.role || 'mentee',
    skills: [],
    interests: [],
    goals: [],
    experience_level: 'entry',
    industry: [],
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    availability: {
      days: [],
      hours: []
    },
    communication_style: 'mixed',
    session_frequency: 'weekly',
    session_duration: '60min',
    mentorship_type: 'mixed',
    personality_traits: [],
    learning_style: 'mixed',
    languages: ['English'],
    remote_preference: 'no_preference'
  });

  const skillOptions = [
    'JavaScript', 'TypeScript', 'React', 'Vue.js', 'Angular', 'Node.js', 'Python', 'Java',
    'Go', 'Rust', 'PHP', 'Ruby', 'C#', 'Swift', 'Kotlin', 'Flutter', 'React Native',
    'PostgreSQL', 'MongoDB', 'MySQL', 'Redis', 'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes',
    'Machine Learning', 'Data Science', 'AI', 'Blockchain', 'Cybersecurity', 'DevOps',
    'UI/UX Design', 'Product Management', 'Project Management', 'Digital Marketing',
    'Sales', 'Business Strategy', 'Leadership', 'Entrepreneurship'
  ];

  const interestOptions = [
    'Web Development', 'Mobile Development', 'Data Science', 'Machine Learning', 'AI',
    'Cybersecurity', 'Cloud Computing', 'DevOps', 'Blockchain', 'IoT', 'AR/VR',
    'Product Design', 'User Experience', 'Digital Marketing', 'E-commerce',
    'Fintech', 'Healthtech', 'Edtech', 'Gaming', 'Social Impact', 'Sustainability',
    'Startup Culture', 'Remote Work', 'Team Leadership', 'Public Speaking',
    'Technical Writing', 'Open Source', 'Community Building'
  ];

  const goalOptions = [
    'Career Transition', 'Skill Development', 'Leadership Growth', 'Salary Negotiation',
    'Job Search Strategy', 'Interview Preparation', 'Network Building', 'Personal Branding',
    'Work-Life Balance', 'Remote Work Skills', 'Team Management', 'Public Speaking',
    'Technical Expertise', 'Industry Knowledge', 'Entrepreneurship', 'Side Projects',
    'Portfolio Building', 'Certification Prep', 'Conference Speaking', 'Mentoring Others'
  ];

  const industryOptions = [
    'Technology', 'Finance', 'Healthcare', 'Education', 'E-commerce', 'Gaming',
    'Media & Entertainment', 'Automotive', 'Real Estate', 'Travel & Hospitality',
    'Non-profit', 'Government', 'Consulting', 'Manufacturing', 'Energy',
    'Telecommunications', 'Retail', 'Food & Beverage', 'Fashion', 'Sports'
  ];

  const personalityOptions = [
    'Analytical', 'Creative', 'Detail-oriented', 'Big-picture', 'Patient', 'Energetic',
    'Structured', 'Flexible', 'Direct', 'Supportive', 'Challenging', 'Encouraging',
    'Introverted', 'Extroverted', 'Collaborative', 'Independent', 'Innovative', 'Practical'
  ];

  const handleSkillToggle = (skill: string) => {
    setPreferences(prev => ({
      ...prev,
      skills: prev.skills?.includes(skill) 
        ? prev.skills.filter(s => s !== skill)
        : [...(prev.skills || []), skill]
    }));
  };

  const handleInterestToggle = (interest: string) => {
    setPreferences(prev => ({
      ...prev,
      interests: prev.interests?.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...(prev.interests || []), interest]
    }));
  };

  const handleGoalToggle = (goal: string) => {
    setPreferences(prev => ({
      ...prev,
      goals: prev.goals?.includes(goal)
        ? prev.goals.filter(g => g !== goal)
        : [...(prev.goals || []), goal]
    }));
  };

  const handleIndustryToggle = (industry: string) => {
    setPreferences(prev => ({
      ...prev,
      industry: prev.industry?.includes(industry)
        ? prev.industry.filter(i => i !== industry)
        : [...(prev.industry || []), industry]
    }));
  };

  const handlePersonalityToggle = (trait: string) => {
    setPreferences(prev => ({
      ...prev,
      personality_traits: prev.personality_traits?.includes(trait)
        ? prev.personality_traits.filter(t => t !== trait)
        : [...(prev.personality_traits || []), trait]
    }));
  };

  const handleAvailabilityChange = (type: 'days' | 'hours', value: string) => {
    setPreferences(prev => ({
      ...prev,
      availability: {
        ...prev.availability!,
        [type]: prev.availability![type].includes(value)
          ? prev.availability![type].filter(v => v !== value)
          : [...prev.availability![type], value]
      }
    }));
  };

  const findMatches = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate finding matches with AI algorithm
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
          availability: { days: ['Monday', 'Wednesday', 'Friday'], hours: ['18:00', '19:00', '20:00'] },
          communication_style: 'supportive',
          session_frequency: 'weekly',
          session_duration: '60min',
          mentorship_type: 'technical',
          personality_traits: ['Patient', 'Encouraging', 'Analytical'],
          learning_style: 'mixed',
          languages: ['English'],
          remote_preference: 'remote_only'
        }
      ];

      const instantMatches = aiMatchingEngine.getInstantMatches(
        preferences as UserPreferences, 
        mockCandidates
      );

      setMatches(instantMatches);
      
      // Save preferences to user profile
      await updateProfile({
        mentorship_preferences: preferences
      });

      toast.success('🎯 AI matching complete! Found your perfect matches.');
      
    } catch (error) {
      console.error('Error finding matches:', error);
      toast.error('Error finding matches. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleComplete = async () => {
    await findMatches();
    onComplete(preferences as UserPreferences);
    navigate('/mentorship');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Target className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Skills & Expertise</h2>
              <p className="text-gray-600">Select your current skills and areas of expertise</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {skillOptions.map(skill => (
                <button
                  key={skill}
                  onClick={() => handleSkillToggle(skill)}
                  className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                    preferences.skills?.includes(skill)
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Sparkles className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Interests</h2>
              <p className="text-gray-600">What topics and areas excite you most?</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {interestOptions.map(interest => (
                <button
                  key={interest}
                  onClick={() => handleInterestToggle(interest)}
                  className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                    preferences.interests?.includes(interest)
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-purple-300'
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Target className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Goals</h2>
              <p className="text-gray-600">What do you want to achieve through mentorship?</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {goalOptions.map(goal => (
                <button
                  key={goal}
                  onClick={() => handleGoalToggle(goal)}
                  className={`p-3 rounded-lg border text-sm font-medium transition-all text-left ${
                    preferences.goals?.includes(goal)
                      ? 'bg-green-600 text-white border-green-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-green-300'
                  }`}
                >
                  {goal}
                </button>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Users className="h-12 w-12 text-orange-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Experience & Preferences</h2>
              <p className="text-gray-600">Tell us about your experience level and preferences</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Experience Level
                </label>
                <select
                  value={preferences.experience_level}
                  onChange={(e) => setPreferences(prev => ({ ...prev, experience_level: e.target.value as any }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="entry">Entry Level (0-2 years)</option>
                  <option value="mid">Mid Level (3-5 years)</option>
                  <option value="senior">Senior Level (6+ years)</option>
                  <option value="executive">Executive Level</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Communication Style
                </label>
                <select
                  value={preferences.communication_style}
                  onChange={(e) => setPreferences(prev => ({ ...prev, communication_style: e.target.value as any }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="formal">Formal</option>
                  <option value="casual">Casual</option>
                  <option value="mixed">Mixed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Session Frequency
                </label>
                <select
                  value={preferences.session_frequency}
                  onChange={(e) => setPreferences(prev => ({ ...prev, session_frequency: e.target.value as any }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="weekly">Weekly</option>
                  <option value="biweekly">Bi-weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="flexible">Flexible</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Session Duration
                </label>
                <select
                  value={preferences.session_duration}
                  onChange={(e) => setPreferences(prev => ({ ...prev, session_duration: e.target.value as any }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="30min">30 minutes</option>
                  <option value="60min">60 minutes</option>
                  <option value="90min">90 minutes</option>
                  <option value="flexible">Flexible</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Industry Focus
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {industryOptions.map(industry => (
                  <button
                    key={industry}
                    onClick={() => handleIndustryToggle(industry)}
                    className={`p-2 rounded-lg border text-sm font-medium transition-all ${
                      preferences.industry?.includes(industry)
                        ? 'bg-orange-600 text-white border-orange-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-orange-300'
                    }`}
                  >
                    {industry}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Calendar className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Availability & Personality</h2>
              <p className="text-gray-600">When are you available and what's your working style?</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available Days
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                    <button
                      key={day}
                      onClick={() => handleAvailabilityChange('days', day)}
                      className={`p-2 rounded-lg border text-sm font-medium transition-all ${
                        preferences.availability?.days.includes(day)
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-indigo-300'
                      }`}
                    >
                      {day.slice(0, 3)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Hours
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['09:00', '12:00', '15:00', '18:00', '21:00'].map(hour => (
                    <button
                      key={hour}
                      onClick={() => handleAvailabilityChange('hours', hour)}
                      className={`p-2 rounded-lg border text-sm font-medium transition-all ${
                        preferences.availability?.hours.includes(hour)
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-indigo-300'
                      }`}
                    >
                      {hour}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Personality Traits
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {personalityOptions.map(trait => (
                  <button
                    key={trait}
                    onClick={() => handlePersonalityToggle(trait)}
                    className={`p-2 rounded-lg border text-sm font-medium transition-all ${
                      preferences.personality_traits?.includes(trait)
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-indigo-300'
                    }`}
                  >
                    {trait}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Brain className="h-12 w-12 text-pink-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">AI Matching Results</h2>
              <p className="text-gray-600">Our AI has found your perfect mentorship matches!</p>
            </div>

            {isProcessing ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">AI is analyzing your preferences and finding matches...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {matches.map((match, index) => (
                  <div key={index} className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <Award className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">Perfect Match Found!</h3>
                          <p className="text-sm text-gray-600">AI Confidence: {(match.confidence * 100).toFixed(0)}%</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">
                          {(match.overallScore * 100).toFixed(0)}%
                        </div>
                        <div className="text-sm text-gray-500">Match Score</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-lg font-semibold text-green-600">
                          {(match.breakdown.skillsMatch * 100).toFixed(0)}%
                        </div>
                        <div className="text-xs text-gray-500">Skills Match</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-blue-600">
                          {(match.breakdown.interestsMatch * 100).toFixed(0)}%
                        </div>
                        <div className="text-xs text-gray-500">Interests</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-purple-600">
                          {(match.breakdown.experienceCompatibility * 100).toFixed(0)}%
                        </div>
                        <div className="text-xs text-gray-500">Experience</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-orange-600">
                          {(match.breakdown.availabilityMatch * 100).toFixed(0)}%
                        </div>
                        <div className="text-xs text-gray-500">Availability</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {match.reasoning.map((reason: string, idx: number) => (
                        <div key={idx} className="flex items-center space-x-2 text-sm text-gray-700">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>{reason}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Step {currentStep} of 6</span>
          <span className="text-sm text-gray-500">{Math.round((currentStep / 6) * 100)}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 6) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        {renderStep()}
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <button
          onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
          disabled={currentStep === 1}
          className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        {currentStep < 6 ? (
          <button
            onClick={() => setCurrentStep(Math.min(6, currentStep + 1))}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 flex items-center space-x-2"
          >
            <span>Next</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            onClick={handleComplete}
            disabled={isProcessing}
            className="px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 flex items-center space-x-2 disabled:opacity-50"
          >
            <Brain className="h-4 w-4" />
            <span>{isProcessing ? 'Finding Matches...' : 'Complete & Find Matches'}</span>
          </button>
        )}
      </div>
    </div>
  );
}