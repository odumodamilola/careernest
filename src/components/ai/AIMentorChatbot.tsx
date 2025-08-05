import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Brain, Target, TrendingUp, BookOpen, Award } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type?: 'text' | 'suggestion' | 'career_path' | 'skill_gap';
}

interface CareerSuggestion {
  title: string;
  description: string;
  skills: string[];
  timeframe: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export function AIMentorChatbot() {
  const { user } = useAuthStore();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: `Hello ${user?.fullName || 'there'}! I'm your AI mentor assistant. I can help you with career guidance, skill development, and finding the right learning path. What would you like to explore today?`,
      sender: 'ai',
      timestamp: new Date(),
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateAIResponse = async (userMessage: string): Promise<Message> => {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    const lowerMessage = userMessage.toLowerCase();
    
    // Career path suggestions
    if (lowerMessage.includes('career') || lowerMessage.includes('path') || lowerMessage.includes('direction')) {
      return {
        id: Date.now().toString(),
        content: `Based on your profile and current skills, I see several exciting career paths for you:

**🚀 Software Development Track**
- Frontend Developer → Senior Frontend → Tech Lead
- Skills to focus: React, TypeScript, System Design
- Timeline: 2-4 years

**📊 Data Science Path**
- Data Analyst → Data Scientist → ML Engineer
- Skills to focus: Python, SQL, Machine Learning
- Timeline: 3-5 years

**🎨 Product Design Journey**
- UI/UX Designer → Senior Designer → Design Director
- Skills to focus: Figma, User Research, Design Systems
- Timeline: 3-4 years

Which path interests you most? I can create a detailed roadmap with specific milestones and learning resources.`,
        sender: 'ai',
        timestamp: new Date(),
        type: 'career_path'
      };
    }

    // Skill gap analysis
    if (lowerMessage.includes('skill') || lowerMessage.includes('learn') || lowerMessage.includes('improve')) {
      return {
        id: Date.now().toString(),
        content: `Let me analyze your skill gaps and recommend what to learn next:

**🎯 Priority Skills for Your Role:**
1. **TypeScript** - High demand, 40% salary boost
2. **System Design** - Essential for senior roles
3. **Cloud Platforms (AWS/Azure)** - Industry standard

**📈 Trending Skills in Your Field:**
- React 18 & Next.js 14
- GraphQL & tRPC
- Docker & Kubernetes
- AI/ML Integration

**🏆 Quick Wins (1-2 months):**
- Advanced Git workflows
- Testing frameworks (Jest, Cypress)
- Performance optimization

Would you like me to create a personalized learning plan for any of these areas?`,
        sender: 'ai',
        timestamp: new Date(),
        type: 'skill_gap'
      };
    }

    // Mentorship guidance
    if (lowerMessage.includes('mentor') || lowerMessage.includes('guidance') || lowerMessage.includes('advice')) {
      return {
        id: Date.now().toString(),
        content: `Here's how I can help you with mentorship:

**🤝 Finding the Right Mentor:**
- I've analyzed 500+ mentor profiles
- Found 12 perfect matches based on your goals
- 95% compatibility with your learning style

**💡 Mentorship Best Practices:**
- Set clear, measurable goals
- Prepare specific questions for each session
- Follow up with action items
- Track your progress regularly

**🎯 Recommended Focus Areas:**
1. Technical skill development
2. Career strategy planning
3. Industry networking
4. Leadership preparation

Would you like me to introduce you to your top mentor matches or help you prepare for your next mentorship session?`,
        sender: 'ai',
        timestamp: new Date(),
        type: 'suggestion'
      };
    }

    // Default responses
    const responses = [
      `That's a great question! Based on your background in ${user?.role || 'your field'}, I'd recommend focusing on building both technical and soft skills. What specific area would you like to dive deeper into?`,
      
      `I can see you're motivated to grow! Let me suggest some actionable steps:
      
1. **Immediate (This week):** Update your LinkedIn profile with recent projects
2. **Short-term (1 month):** Complete a relevant online certification
3. **Medium-term (3 months):** Start a side project to showcase your skills
4. **Long-term (6 months):** Begin mentoring others in your area of expertise

Which of these resonates most with your current goals?`,

      `Excellent! I love helping ambitious professionals like you. Here are some personalized insights:

**Your Strengths:** ${user?.skills?.slice(0, 3).join(', ') || 'Technical expertise, problem-solving, continuous learning'}

**Growth Opportunities:** 
- Leadership and communication skills
- Industry-specific certifications
- Building a professional network

**Next Steps:** I recommend connecting with mentors who've walked similar paths. Shall I show you some perfect matches?`
    ];

    return {
      id: Date.now().toString(),
      content: responses[Math.floor(Math.random() * responses.length)],
      sender: 'ai',
      timestamp: new Date(),
    };
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

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
    } catch (error) {
      console.error('AI response error:', error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: "I'm having trouble processing that right now. Could you try rephrasing your question?",
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const quickActions = [
    { label: 'Career Path Guidance', icon: Target, action: () => setInputMessage('What career path should I pursue?') },
    { label: 'Skill Gap Analysis', icon: TrendingUp, action: () => setInputMessage('What skills should I learn next?') },
    { label: 'Find Mentors', icon: Brain, action: () => setInputMessage('Help me find the right mentor') },
    { label: 'Learning Resources', icon: BookOpen, action: () => setInputMessage('Recommend learning resources for my goals') },
  ];

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg border border-gray-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-lg">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white bg-opacity-20 rounded-full">
            <Brain className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-semibold">AI Mentor Assistant</h3>
            <p className="text-sm text-blue-100">Powered by advanced career intelligence</p>
          </div>
          <div className="ml-auto">
            <Sparkles className="h-5 w-5 text-yellow-300" />
          </div>
        </div>
      </div>

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
                <div className={`text-xs mt-2 ${
                  message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString()}
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
            return (
              <button
                key={index}
                onClick={action.action}
                className="flex items-center space-x-2 p-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Icon className="h-4 w-4" />
                <span className="truncate">{action.label}</span>
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
            placeholder="Ask me anything about your career..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isTyping}
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isTyping}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2 rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 transition-all"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}