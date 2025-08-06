import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Brain, Target, TrendingUp, BookOpen, Award, Zap, AlertTriangle } from 'lucide-react';
import { useEnterpriseAuth } from '../../hooks/useEnterpriseAuth';
import { toast } from 'sonner';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type?: 'text' | 'suggestion' | 'career_path' | 'skill_gap';
  creditsUsed?: number;
}

export function EnterpriseAIMentorChatbot() {
  const { user, checkCredits, consumeCredits, hasCredits } = useEnterpriseAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: `Hello ${user?.profileData?.full_name || 'there'}! I'm your AI mentor assistant powered by enterprise-grade intelligence. I can help you with career guidance, skill development, and finding the right learning path. What would you like to explore today?`,
      sender: 'ai',
      timestamp: new Date(),
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [creditWarning, setCreditWarning] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Check if user is running low on credits
    if (user) {
      const remaining = user.creditQuota - user.creditsUsed;
      setCreditWarning(remaining < 10);
    }
  }, [user]);

  const generateAIResponse = async (userMessage: string): Promise<Message> => {
    // Check credits before processing
    const creditCheck = await checkCredits(2); // AI responses cost 2 credits
    
    if (!creditCheck.canProceed) {
      throw new Error('Insufficient credits. Please upgrade your plan to continue.');
    }

    // Consume credits
    const success = await consumeCredits(2, 'ai_chat', 'mentor_chatbot');
    if (!success) {
      throw new Error('Failed to process request. Please try again.');
    }

    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    const lowerMessage = userMessage.toLowerCase();
    
    // Enhanced AI responses based on user plan and profile
    if (lowerMessage.includes('career') || lowerMessage.includes('path') || lowerMessage.includes('direction')) {
      return {
        id: Date.now().toString(),
        content: `Based on your ${user?.planTier} plan profile and current skills, I see several exciting career paths for you:

**🚀 Software Development Track** (Recommended for your background)
- Frontend Developer → Senior Frontend → Tech Lead → Engineering Manager
- Skills to focus: React, TypeScript, System Design, Leadership
- Timeline: 2-4 years | Salary potential: $120K-$200K+

**📊 Data Science Path** (High growth potential)
- Data Analyst → Data Scientist → ML Engineer → AI Research Lead
- Skills to focus: Python, SQL, Machine Learning, Statistics
- Timeline: 3-5 years | Salary potential: $130K-$250K+

**🎨 Product Design Journey** (Creative + Technical)
- UI/UX Designer → Senior Designer → Design Director → CPO
- Skills to focus: Figma, User Research, Design Systems, Strategy
- Timeline: 3-4 years | Salary potential: $110K-$180K+

${user?.planTier !== 'free' ? `
**🔥 Premium Insight**: Based on market analysis, ${user?.planTier === 'pro' ? 'AI/ML roles show 40% higher salary growth' : 'full-stack development has the highest job availability'} in your region.

**Next Steps**: I can create a detailed 90-day action plan with specific milestones, learning resources, and mentor connections. Would you like me to generate this for you?` : `
**Upgrade to Pro**: Get personalized market insights, detailed action plans, and priority mentor matching.`}`,
        sender: 'ai',
        timestamp: new Date(),
        type: 'career_path',
        creditsUsed: 2
      };
    }

    // Skill gap analysis with plan-specific features
    if (lowerMessage.includes('skill') || lowerMessage.includes('learn') || lowerMessage.includes('improve')) {
      return {
        id: Date.now().toString(),
        content: `Let me analyze your skill gaps with ${user?.planTier === 'pro' ? 'advanced AI insights' : 'standard analysis'}:

**🎯 Priority Skills for Your Role:**
1. **TypeScript** - High demand, 40% salary boost
   ${user?.planTier !== 'free' ? '• Market trend: 85% of companies now require TypeScript' : ''}
2. **System Design** - Essential for senior roles
   ${user?.planTier !== 'free' ? '• Skill gap: Most critical for $150K+ positions' : ''}
3. **Cloud Platforms (AWS/Azure)** - Industry standard
   ${user?.planTier !== 'free' ? '• Certification ROI: Average $25K salary increase' : ''}

**📈 Trending Skills in Your Field:**
- React 18 & Next.js 14 (Hot demand)
- GraphQL & tRPC (API evolution)
- Docker & Kubernetes (DevOps essential)
- AI/ML Integration (Future-proofing)

**🏆 Quick Wins (1-2 months):**
- Advanced Git workflows
- Testing frameworks (Jest, Cypress)
- Performance optimization

${user?.planTier === 'pro' ? `
**🔥 Pro Analysis**: 
- Your learning velocity: 23% faster than average
- Recommended focus: Backend skills for full-stack transition
- Mentor match: 3 senior engineers available this week
- Salary projection: +$35K within 12 months

**Action Plan**: I can create a personalized learning roadmap with weekly milestones and mentor check-ins.` : user?.planTier === 'starter' ? `
**Starter Insight**: Focus on TypeScript first - it's your highest-impact skill gap.

**Upgrade to Pro**: Get detailed learning velocity analysis and personalized roadmaps.` : `
**Free Plan**: Basic skill analysis provided.

**Upgrade**: Get advanced insights, learning velocity tracking, and personalized roadmaps.`}

Would you like me to create a detailed learning plan for any of these areas?`,
        sender: 'ai',
        timestamp: new Date(),
        type: 'skill_gap',
        creditsUsed: 2
      };
    }

    // Default responses with plan-aware features
    const responses = [
      `That's a great question! Based on your ${user?.planTier} plan and background in ${user?.profileData?.role || 'your field'}, I'd recommend focusing on both technical and soft skills. 

${user?.planTier !== 'free' ? `**Premium Insight**: Your profile suggests you're ready for senior-level opportunities. Focus on leadership and system design skills.` : ''}

What specific area would you like to dive deeper into?`,
      
      `I can see you're motivated to grow! Here's your personalized action plan:
      
**Immediate (This week):**
- Update your LinkedIn profile with recent projects
- Complete skill assessment (${user?.planTier === 'pro' ? 'Advanced AI analysis available' : 'Basic assessment'})

**Short-term (1 month):**
- Complete a relevant certification
- ${user?.planTier !== 'free' ? 'Connect with matched mentors' : 'Browse available mentors'}

**Medium-term (3 months):**
- Start a portfolio project
- ${user?.planTier === 'pro' ? 'Join exclusive Pro community events' : 'Participate in community discussions'}

**Long-term (6 months):**
- Begin mentoring others
- ${user?.planTier === 'pro' ? 'Access executive coaching sessions' : 'Consider upgrading for advanced features'}

Which of these resonates most with your current goals?`,

      `Excellent! I love helping ambitious professionals like you. Here are some insights:

**Your Strengths:** ${user?.profileData?.skills?.slice(0, 3).join(', ') || 'Technical expertise, problem-solving, continuous learning'}

**Growth Opportunities:** 
- Leadership and communication skills
- Industry-specific certifications
- Building a professional network

${user?.planTier === 'pro' ? `**Pro Exclusive**: I've identified 5 senior professionals in your network who could provide strategic career advice. Would you like me to facilitate introductions?` : `**Next Steps**: I recommend connecting with mentors who've walked similar paths. ${user?.planTier === 'free' ? 'Upgrade to get AI-powered mentor matching.' : 'Shall I show you some perfect matches?'}`}`
    ];

    return {
      id: Date.now().toString(),
      content: responses[Math.floor(Math.random() * responses.length)],
      sender: 'ai',
      timestamp: new Date(),
      creditsUsed: 2
    };
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    // Check credits before sending
    const creditCheck = await checkCredits(2);
    if (!creditCheck.canProceed) {
      toast.error('Insufficient credits. Please upgrade your plan to continue.');
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const aiResponse = await generateAIResponse(inputMessage);
      setMessages(prev => [...prev, aiResponse]);
      
      // Update credit warning state
      if (user) {
        const newRemaining = user.creditQuota - user.creditsUsed - 2;
        setCreditWarning(newRemaining < 10);
      }
    } catch (error: any) {
      console.error('AI response error:', error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: error.message || "I'm having trouble processing that right now. Could you try rephrasing your question?",
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const quickActions = [
    { 
      label: 'Career Path Guidance', 
      icon: Target, 
      action: () => setInputMessage('What career path should I pursue?'),
      credits: 2
    },
    { 
      label: 'Skill Gap Analysis', 
      icon: TrendingUp, 
      action: () => setInputMessage('What skills should I learn next?'),
      credits: 2
    },
    { 
      label: 'Find Mentors', 
      icon: Brain, 
      action: () => setInputMessage('Help me find the right mentor'),
      credits: 1
    },
    { 
      label: 'Learning Resources', 
      icon: BookOpen, 
      action: () => setInputMessage('Recommend learning resources for my goals'),
      credits: 1
    },
  ];

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg border border-gray-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-full">
              <Brain className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold">Enterprise AI Mentor</h3>
              <p className="text-sm text-blue-100">
                {user?.planTier === 'pro' ? 'Advanced AI with market insights' : 
                 user?.planTier === 'starter' ? 'Enhanced AI mentorship' : 
                 'Basic AI guidance'}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-1">
              <Zap className="h-4 w-4 text-yellow-300" />
              <span className="text-sm font-medium">
                {user ? user.creditQuota - user.creditsUsed : 0} credits
              </span>
            </div>
            <div className="text-xs text-blue-100 capitalize">
              {user?.planTier} plan
            </div>
          </div>
        </div>
      </div>

      {/* Credit Warning */}
      {creditWarning && (
        <div className="bg-yellow-50 border-b border-yellow-200 p-3">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <span className="text-sm text-yellow-800">
              Running low on credits. Consider upgrading your plan.
            </span>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-96">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-start space-x-2 max-w-[80%] ${
              message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            }`}>
              <div className={`p-2 rounded-full ${
                message.sender === 'user' 
                  ? 'bg-blue-600' 
                  : 'bg-gradient-to-r from-purple-500 to-blue-500'
              }`}>
                {message.sender === 'user' ? (
                  <User className="h-4 w-4 text-white" />
                ) : (
                  <Bot className="h-4 w-4 text-white" />
                )}
              </div>
              
              <div className={`p-3 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-blue-600 text-white'
                  : message.type === 'career_path'
                  ? 'bg-gradient-to-r from-green-50 to-blue-50 border border-green-200'
                  : message.type === 'skill_gap'
                  ? 'bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200'
                  : 'bg-gray-100 text-gray-900'
              }`}>
                <div className="whitespace-pre-line text-sm">
                  {message.content}
                </div>
                <div className={`flex items-center justify-between text-xs mt-2 ${
                  message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  <span>{message.timestamp.toLocaleTimeString()}</span>
                  {message.creditsUsed && message.sender === 'ai' && (
                    <div className="flex items-center space-x-1">
                      <Zap className="h-3 w-3" />
                      <span>{message.creditsUsed} credits</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-2">
              <div className="p-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div className="bg-gray-100 p-3 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-2 mb-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            const canAfford = user ? (user.creditQuota - user.creditsUsed) >= action.credits : false;
            
            return (
              <button
                key={index}
                onClick={action.action}
                disabled={!canAfford}
                className={`flex items-center space-x-2 p-2 text-sm rounded-lg transition-colors ${
                  canAfford 
                    ? 'text-gray-600 hover:bg-gray-50' 
                    : 'text-gray-400 cursor-not-allowed'
                }`}
                title={!canAfford ? `Requires ${action.credits} credits` : ''}
              >
                <Icon className="h-4 w-4" />
                <span className="truncate">{action.label}</span>
                <div className="flex items-center space-x-1 text-xs">
                  <Zap className="h-3 w-3" />
                  <span>{action.credits}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Input */}
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={hasCredits ? "Ask me anything about your career..." : "Insufficient credits - please upgrade"}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            disabled={isTyping || !hasCredits}
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isTyping || !hasCredits}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2 rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 transition-all"
            title={!hasCredits ? "Insufficient credits" : "Send message (2 credits)"}
          >
            <Send className="h-4 w-4" />
          </button>
        </form>

        {/* Credit info */}
        <div className="mt-2 text-xs text-gray-500 text-center">
          AI responses cost 2 credits • {user ? user.creditQuota - user.creditsUsed : 0} remaining
        </div>
      </div>
    </div>
  );
}