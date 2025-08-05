import React, { useState, useEffect } from 'react';
import { TrendingUp, Target, AlertTriangle, CheckCircle, BookOpen, Clock, Award, Zap } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

interface SkillGap {
  skill: string;
  currentLevel: number;
  targetLevel: number;
  priority: 'high' | 'medium' | 'low';
  timeToLearn: string;
  resources: LearningResource[];
  marketDemand: number;
  salaryImpact: string;
}

interface LearningResource {
  title: string;
  type: 'course' | 'book' | 'tutorial' | 'practice';
  provider: string;
  duration: string;
  rating: number;
  url: string;
  isFree: boolean;
}

interface SkillAnalysis {
  currentSkills: string[];
  missingSkills: SkillGap[];
  strengthAreas: string[];
  recommendedFocus: string[];
  careerReadiness: number;
}

export function SkillGapDetector() {
  const { user } = useAuthStore();
  const [analysis, setAnalysis] = useState<SkillAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const [targetRoles] = useState([
    'Frontend Developer',
    'Backend Developer',
    'Full-Stack Developer',
    'Data Scientist',
    'Product Manager',
    'UX Designer',
    'DevOps Engineer',
    'Mobile Developer',
    'AI/ML Engineer',
    'Cybersecurity Specialist'
  ]);

  const runSkillGapAnalysis = async () => {
    if (!selectedRole) return;
    
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    const mockAnalysis: SkillAnalysis = {
      currentSkills: user?.skills || ['JavaScript', 'React', 'HTML/CSS'],
      careerReadiness: 72,
      strengthAreas: ['Frontend Development', 'User Interface Design', 'Problem Solving'],
      recommendedFocus: ['Backend Development', 'Database Design', 'System Architecture'],
      missingSkills: [
        {
          skill: 'Node.js',
          currentLevel: 2,
          targetLevel: 8,
          priority: 'high',
          timeToLearn: '2-3 months',
          marketDemand: 89,
          salaryImpact: '+$15,000',
          resources: [
            {
              title: 'Node.js Complete Guide',
              type: 'course',
              provider: 'Udemy',
              duration: '40 hours',
              rating: 4.7,
              url: '#',
              isFree: false
            },
            {
              title: 'Node.js Documentation',
              type: 'tutorial',
              provider: 'Official Docs',
              duration: 'Self-paced',
              rating: 4.9,
              url: '#',
              isFree: true
            }
          ]
        },
        {
          skill: 'PostgreSQL',
          currentLevel: 1,
          targetLevel: 7,
          priority: 'high',
          timeToLearn: '1-2 months',
          marketDemand: 76,
          salaryImpact: '+$12,000',
          resources: [
            {
              title: 'PostgreSQL Bootcamp',
              type: 'course',
              provider: 'Coursera',
              duration: '30 hours',
              rating: 4.6,
              url: '#',
              isFree: false
            }
          ]
        },
        {
          skill: 'Docker',
          currentLevel: 0,
          targetLevel: 6,
          priority: 'medium',
          timeToLearn: '3-4 weeks',
          marketDemand: 82,
          salaryImpact: '+$8,000',
          resources: [
            {
              title: 'Docker Mastery',
              type: 'course',
              provider: 'Docker',
              duration: '20 hours',
              rating: 4.8,
              url: '#',
              isFree: true
            }
          ]
        },
        {
          skill: 'System Design',
          currentLevel: 1,
          targetLevel: 8,
          priority: 'medium',
          timeToLearn: '4-6 months',
          marketDemand: 94,
          salaryImpact: '+$25,000',
          resources: [
            {
              title: 'System Design Interview',
              type: 'book',
              provider: 'Alex Xu',
              duration: '200 pages',
              rating: 4.9,
              url: '#',
              isFree: false
            }
          ]
        }
      ]
    };

    setAnalysis(mockAnalysis);
    setIsAnalyzing(false);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'course': return <BookOpen className="h-4 w-4" />;
      case 'book': return <BookOpen className="h-4 w-4" />;
      case 'tutorial': return <Target className="h-4 w-4" />;
      case 'practice': return <Zap className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-6 rounded-t-lg">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white bg-opacity-20 rounded-full">
            <TrendingUp className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Smart Skill Gap Detector</h2>
            <p className="text-orange-100">AI-powered analysis of your skill gaps and learning recommendations</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Role Selection */}
        {!analysis && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="p-4 bg-gradient-to-r from-orange-100 to-red-100 rounded-full w-fit mx-auto mb-4">
                <Target className="h-12 w-12 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Analyze Your Skill Gaps
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Select your target role and I'll analyze what skills you need to develop
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Role
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">Select a target role...</option>
                {targetRoles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>

            <button
              onClick={runSkillGapAnalysis}
              disabled={!selectedRole || isAnalyzing}
              className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-3 px-6 rounded-lg hover:from-orange-700 hover:to-red-700 disabled:opacity-50 transition-all font-medium flex items-center justify-center space-x-2"
            >
              <TrendingUp className="h-5 w-5" />
              <span>{isAnalyzing ? 'Analyzing Skills...' : 'Analyze Skill Gaps'}</span>
            </button>
          </div>
        )}

        {/* Analysis Loading */}
        {isAnalyzing && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Analysis in Progress</h3>
            <div className="space-y-2 text-sm text-gray-500">
              <div>🔍 Analyzing your current skill set</div>
              <div>📊 Comparing with {selectedRole} requirements</div>
              <div>🎯 Identifying priority learning areas</div>
              <div>💡 Generating personalized recommendations</div>
            </div>
          </div>
        )}

        {/* Analysis Results */}
        {analysis && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">
                Skill Gap Analysis for {selectedRole}
              </h3>
              <button
                onClick={() => {
                  setAnalysis(null);
                  setSelectedRole('');
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ← New Analysis
              </button>
            </div>

            {/* Career Readiness Score */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {analysis.careerReadiness}%
                </div>
                <div className="text-lg font-medium text-gray-900 mb-2">Career Readiness</div>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-1000"
                    style={{ width: `${analysis.careerReadiness}%` }}
                  />
                </div>
                <p className="text-gray-600">
                  You're {analysis.careerReadiness >= 80 ? 'well-prepared' : analysis.careerReadiness >= 60 ? 'on track' : 'getting started'} for this role
                </p>
              </div>
            </div>

            {/* Skill Gaps */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-orange-500" />
                Priority Skill Gaps
              </h4>
              
              <div className="space-y-4">
                {analysis.missingSkills.map((gap, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h5 className="font-semibold text-gray-900">{gap.skill}</h5>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(gap.priority)}`}>
                            {gap.priority} priority
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Time to Learn:</span>
                            <div className="font-medium">{gap.timeToLearn}</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Market Demand:</span>
                            <div className="font-medium text-blue-600">{gap.marketDemand}%</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Salary Impact:</span>
                            <div className="font-medium text-green-600">{gap.salaryImpact}</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Current Level:</span>
                            <div className="font-medium">{gap.currentLevel}/10</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Skill Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Current</span>
                        <span>Target</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gray-400 h-2 rounded-full"
                          style={{ width: `${(gap.currentLevel / 10) * 100}%` }}
                        />
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full"
                          style={{ width: `${(gap.targetLevel / 10) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Learning Resources */}
                    <div>
                      <h6 className="font-medium text-gray-900 mb-2">Recommended Resources:</h6>
                      <div className="space-y-2">
                        {gap.resources.map((resource, resourceIndex) => (
                          <div key={resourceIndex} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              {getResourceIcon(resource.type)}
                              <div>
                                <div className="font-medium text-gray-900">{resource.title}</div>
                                <div className="text-sm text-gray-600">
                                  {resource.provider} • {resource.duration}
                                  {resource.isFree && <span className="text-green-600 ml-2">Free</span>}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="flex items-center space-x-1">
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <div
                                      key={i}
                                      className={`w-3 h-3 ${
                                        i < Math.floor(resource.rating) ? 'text-yellow-400' : 'text-gray-300'
                                      }`}
                                    >
                                      ★
                                    </div>
                                  ))}
                                </div>
                                <span className="text-sm text-gray-600">{resource.rating}</span>
                              </div>
                              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                                Start
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Strengths */}
            <div className="bg-green-50 rounded-lg p-6 border border-green-200">
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                Your Strengths
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {analysis.strengthAreas.map((strength, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-gray-700">{strength}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Plan */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                <Target className="h-5 w-5 mr-2 text-blue-600" />
                Recommended Learning Plan
              </h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                  <div>
                    <div className="font-medium">Focus on high-priority skills first</div>
                    <div className="text-sm text-gray-600">Start with Node.js and PostgreSQL (3-4 months)</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                  <div>
                    <div className="font-medium">Build practical projects</div>
                    <div className="text-sm text-gray-600">Apply new skills in real-world scenarios</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                  <div>
                    <div className="font-medium">Get mentorship and feedback</div>
                    <div className="text-sm text-gray-600">Connect with experts for guidance</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 text-white py-3 px-6 rounded-lg hover:from-orange-700 hover:to-red-700 transition-all font-medium flex items-center justify-center space-x-2">
                <BookOpen className="h-5 w-5" />
                <span>Start Learning Plan</span>
              </button>
              <button className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center justify-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Find Skill Mentors</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}