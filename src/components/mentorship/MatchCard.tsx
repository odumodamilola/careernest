import React from 'react';
import { MatchScore } from '../../lib/ai-matching';
import { 
  Star, 
  MapPin, 
  Clock, 
  MessageSquare, 
  Video, 
  Calendar,
  Award,
  Brain,
  TrendingUp,
  Users,
  Target,
  Zap
} from 'lucide-react';

interface MatchCardProps {
  match: MatchScore;
  onConnect: (mentorId: string) => void;
  onSchedule: (mentorId: string) => void;
}

export function MatchCard({ match, onConnect, onSchedule }: MatchCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600 bg-green-100';
    if (score >= 0.6) return 'text-blue-600 bg-blue-100';
    if (score >= 0.4) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 0.9) return 'Perfect Match';
    if (score >= 0.8) return 'Excellent Match';
    if (score >= 0.7) return 'Great Match';
    if (score >= 0.6) return 'Good Match';
    return 'Potential Match';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Header with AI Badge */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="h-5 w-5" />
            <span className="text-sm font-medium">AI Matched</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`px-3 py-1 rounded-full text-xs font-semibold ${getScoreColor(match.overallScore)}`}>
              {getScoreLabel(match.overallScore)}
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">
                {(match.overallScore * 100).toFixed(0)}%
              </div>
              <div className="text-xs opacity-90">Match Score</div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Section */}
      <div className="p-6">
        <div className="flex items-start space-x-4 mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <Award className="h-8 w-8 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-1">
              Expert Mentor
            </h3>
            <p className="text-gray-600 mb-2">Senior Software Engineer</p>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <MapPin className="h-4 w-4" />
                <span>San Francisco, CA</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>Available now</span>
              </div>
            </div>
          </div>
        </div>

        {/* Match Breakdown */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
            <TrendingUp className="h-4 w-4 mr-2" />
            AI Analysis Breakdown
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-600">Skills Match</span>
                <span className="text-sm font-semibold text-green-600">
                  {(match.breakdown.skillsMatch * 100).toFixed(0)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${match.breakdown.skillsMatch * 100}%` }}
                />
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-600">Experience</span>
                <span className="text-sm font-semibold text-blue-600">
                  {(match.breakdown.experienceCompatibility * 100).toFixed(0)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${match.breakdown.experienceCompatibility * 100}%` }}
                />
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-600">Availability</span>
                <span className="text-sm font-semibold text-purple-600">
                  {(match.breakdown.availabilityMatch * 100).toFixed(0)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${match.breakdown.availabilityMatch * 100}%` }}
                />
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-600">Goals Alignment</span>
                <span className="text-sm font-semibold text-orange-600">
                  {(match.breakdown.goalsAlignment * 100).toFixed(0)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${match.breakdown.goalsAlignment * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* AI Reasoning */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
            <Target className="h-4 w-4 mr-2" />
            Why This Match Works
          </h4>
          <div className="space-y-2">
            {match.reasoning.map((reason, index) => (
              <div key={index} className="flex items-start space-x-2 text-sm text-gray-700">
                <Zap className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                <span>{reason}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Confidence Score */}
        <div className="mb-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-gray-900">AI Confidence</span>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-green-600">
                {(match.confidence * 100).toFixed(0)}%
              </div>
              <div className="text-xs text-gray-500">Prediction Accuracy</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={() => onConnect(match.mentorId)}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center space-x-2 font-medium"
          >
            <MessageSquare className="h-4 w-4" />
            <span>Connect Now</span>
          </button>
          
          <button
            onClick={() => onSchedule(match.mentorId)}
            className="flex-1 border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-all duration-200 flex items-center justify-center space-x-2 font-medium"
          >
            <Calendar className="h-4 w-4" />
            <span>Schedule</span>
          </button>
        </div>

        {/* Quick Stats */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <Users className="h-3 w-3" />
              <span>156 sessions completed</span>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="h-3 w-3 text-yellow-400" />
              <span>4.9 rating</span>
            </div>
            <div className="flex items-center space-x-1">
              <Video className="h-3 w-3" />
              <span>Available for video calls</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}