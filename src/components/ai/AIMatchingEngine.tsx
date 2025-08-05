import React, { useState, useEffect } from 'react';
import { Brain, Users, Target, Zap, Star, Clock, MapPin, Award, TrendingUp } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useMatchingStore } from '../../stores/matchingStore';

interface MatchResult {
  id: string;
  name: string;
  title: string;
  company: string;
  avatar: string;
  matchScore: number;
  compatibility: {
    skills: number;
    goals: number;
    availability: number;
    personality: number;
  };
  reasoning: string[];
  nextAvailable: string;
  hourlyRate?: number;
}

export function AIMatchingEngine() {
  const { user } = useAuthStore();
  const { matches, loading, findMatches } = useMatchingStore();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [matchResults, setMatchResults] = useState<MatchResult[]>([]);

  useEffect(() => {
    if (user) {
      runAIMatching();
    }
  }, [user]);

  const runAIMatching = async () => {
    setIsAnalyzing(true);
    
    try {
      // Simulate AI analysis
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const mockMatches: MatchResult[] = [
        {
          id: '1',
          name: 'Dr. Sarah Chen',
          title: 'Senior Software Engineer',
          company: 'Google',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
          matchScore: 94,
          compatibility: {
            skills: 0.92,
            goals: 0.88,
            availability: 0.95,
            personality: 0.89
          },
          reasoning: [
            'Excellent skills alignment in React and TypeScript',
            'Shared interest in system design and architecture',
            'Compatible availability for weekly sessions',
            'Proven track record with 150+ successful mentorships'
          ],
          nextAvailable: 'Today 3:00 PM',
          hourlyRate: 80
        },
        {
          id: '2',
          name: 'Marcus Johnson',
          title: 'Product Manager',
          company: 'Microsoft',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
          matchScore: 87,
          compatibility: {
            skills: 0.85,
            goals: 0.91,
            availability: 0.82,
            personality: 0.90
          },
          reasoning: [
            'Strong alignment in product strategy and user experience',
            'Complementary skills in data analysis and market research',
            'Similar career transition goals',
            'Excellent communication style match'
          ],
          nextAvailable: 'Tomorrow 10:00 AM',
          hourlyRate: 75
        },
        {
          id: '3',
          name: 'Dr. Priya Patel',
          title: 'Data Science Lead',
          company: 'Netflix',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
          matchScore: 91,
          compatibility: {
            skills: 0.89,
            goals: 0.93,
            availability: 0.87,
            personality: 0.92
          },
          reasoning: [
            'Perfect match for machine learning and data science goals',
            'Extensive experience in your target industry',
            'Proven success in career transitions',
            'Highly rated for technical mentorship'
          ],
          nextAvailable: 'Today 5:00 PM',
          hourlyRate: 85
        }
      ];

      setMatchResults(mockMatches);
    } catch (error) {
      console.error('AI matching failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 80) return 'text-blue-600 bg-blue-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getCompatibilityColor = (score: number) => {
    if (score >= 0.9) return 'bg-green-500';
    if (score >= 0.8) return 'bg-blue-500';
    if (score >= 0.7) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-full">
              <Brain className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">AI Matching Engine</h2>
              <p className="text-blue-100">Advanced compatibility analysis powered by machine learning</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{matchResults.length}</div>
            <div className="text-sm text-blue-100">Perfect Matches</div>
          </div>
        </div>
      </div>

      {/* Analysis Status */}
      {isAnalyzing ? (
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Analysis in Progress</h3>
          <p className="text-gray-600 mb-4">Analyzing 500+ mentor profiles for compatibility...</p>
          <div className="space-y-2 text-sm text-gray-500">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span>Processing skills compatibility</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Analyzing personality traits</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
              <span>Calculating availability overlap</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-6">
          {/* AI Insights */}
          <div className="mb-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-center space-x-2 mb-3">
              <Zap className="h-5 w-5 text-green-600" />
              <h3 className="font-semibold text-gray-900">AI Insights</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">95%</div>
                <div className="text-gray-600">Match Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">12</div>
                <div className="text-gray-600">Compatible Mentors</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">3.2x</div>
                <div className="text-gray-600">Success Rate Boost</div>
              </div>
            </div>
          </div>

          {/* Match Results */}
          <div className="space-y-4">
            {matchResults.map((match) => (
              <div key={match.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={match.avatar}
                      alt={match.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold text-gray-900">{match.name}</h4>
                        <Award className="h-4 w-4 text-blue-500" />
                      </div>
                      <p className="text-sm text-gray-600">{match.title}</p>
                      <p className="text-sm font-medium text-blue-600">{match.company}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`px-3 py-1 rounded-full text-sm font-bold ${getScoreColor(match.matchScore)}`}>
                      {match.matchScore}% Match
                    </div>
                    <div className="text-xs text-gray-500 mt-1">AI Confidence: High</div>
                  </div>
                </div>

                {/* Compatibility Breakdown */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-700 mb-1">Skills</div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${getCompatibilityColor(match.compatibility.skills)}`}
                        style={{ width: `${match.compatibility.skills * 100}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{(match.compatibility.skills * 100).toFixed(0)}%</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-700 mb-1">Goals</div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${getCompatibilityColor(match.compatibility.goals)}`}
                        style={{ width: `${match.compatibility.goals * 100}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{(match.compatibility.goals * 100).toFixed(0)}%</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-700 mb-1">Schedule</div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${getCompatibilityColor(match.compatibility.availability)}`}
                        style={{ width: `${match.compatibility.availability * 100}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{(match.compatibility.availability * 100).toFixed(0)}%</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-700 mb-1">Style</div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${getCompatibilityColor(match.compatibility.personality)}`}
                        style={{ width: `${match.compatibility.personality * 100}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{(match.compatibility.personality * 100).toFixed(0)}%</div>
                  </div>
                </div>

                {/* AI Reasoning */}
                <div className="mb-4">
                  <h5 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                    <Target className="h-4 w-4 mr-1" />
                    Why This Match Works
                  </h5>
                  <div className="space-y-1">
                    {match.reasoning.map((reason, index) => (
                      <div key={index} className="flex items-start space-x-2 text-sm text-gray-700">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span>{reason}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Info */}
                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{match.nextAvailable}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400" />
                      <span>4.9 rating</span>
                    </div>
                  </div>
                  {match.hourlyRate && (
                    <div className="font-semibold text-green-600">
                      ${match.hourlyRate}/hour
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium">
                    Connect Now
                  </button>
                  <button className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                    Schedule Session
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Refresh Button */}
          <div className="mt-6 text-center">
            <button
              onClick={runAIMatching}
              disabled={isAnalyzing}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 transition-all font-medium flex items-center space-x-2 mx-auto"
            >
              <Brain className="h-4 w-4" />
              <span>{isAnalyzing ? 'Analyzing...' : 'Refresh AI Matches'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}