import React, { useState } from 'react';
import { Brain, Sparkles, Target, TrendingUp, Users, Award, Zap, BookOpen } from 'lucide-react';
import { AIMentorChatbot } from '../components/ai/AIMentorChatbot';
import { AIMatchingEngine } from '../components/ai/AIMatchingEngine';
import { CareerPathGenerator } from '../components/ai/CareerPathGenerator';
import { SkillGapDetector } from '../components/ai/SkillGapDetector';

export function AIMentorship() {
  const [activeTab, setActiveTab] = useState<'chatbot' | 'matching' | 'career-paths' | 'skill-gaps'>('chatbot');

  const tabs = [
    {
      id: 'chatbot',
      label: 'AI Mentor Chat',
      icon: Brain,
      description: 'Get instant career guidance'
    },
    {
      id: 'matching',
      label: 'Smart Matching',
      icon: Users,
      description: 'Find perfect mentors'
    },
    {
      id: 'career-paths',
      label: 'Career Paths',
      icon: Target,
      description: 'Explore career roadmaps'
    },
    {
      id: 'skill-gaps',
      label: 'Skill Analysis',
      icon: TrendingUp,
      description: 'Identify learning priorities'
    }
  ];

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'chatbot':
        return <AIMentorChatbot />;
      case 'matching':
        return <AIMatchingEngine />;
      case 'career-paths':
        return <CareerPathGenerator />;
      case 'skill-gaps':
        return <SkillGapDetector />;
      default:
        return <AIMentorChatbot />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full">
                <Brain className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              🧠 AI-Powered Mentorship System
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Experience the future of career development with our advanced AI mentorship platform. 
              Get personalized guidance, smart mentor matching, and data-driven career insights.
            </p>
            
            {/* Feature Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="p-3 bg-blue-100 rounded-full w-fit mx-auto mb-3">
                  <Brain className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">AI Mentor Chat</h3>
                <p className="text-sm text-gray-600">24/7 personalized guidance</p>
              </div>
              <div className="text-center">
                <div className="p-3 bg-purple-100 rounded-full w-fit mx-auto mb-3">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Smart Matching</h3>
                <p className="text-sm text-gray-600">95% compatibility accuracy</p>
              </div>
              <div className="text-center">
                <div className="p-3 bg-green-100 rounded-full w-fit mx-auto mb-3">
                  <Target className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Career Paths</h3>
                <p className="text-sm text-gray-600">Structured learning tracks</p>
              </div>
              <div className="text-center">
                <div className="p-3 bg-orange-100 rounded-full w-fit mx-auto mb-3">
                  <TrendingUp className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Skill Analysis</h3>
                <p className="text-sm text-gray-600">Gap detection & recommendations</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <div className="text-left">
                      <div>{tab.label}</div>
                      <div className="text-xs text-gray-500">{tab.description}</div>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Active Component */}
        <div className="min-h-[600px]">
          {renderActiveComponent()}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-center mb-4">
              <Sparkles className="h-8 w-8 text-yellow-300" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Ready to Accelerate Your Career?</h2>
            <p className="text-xl text-blue-100 mb-6">
              Join thousands of professionals who've transformed their careers with AI-powered mentorship
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Find Your Mentor</span>
              </button>
              <button className="border border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors font-medium flex items-center space-x-2">
                <BookOpen className="h-5 w-5" />
                <span>Start Learning Path</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}