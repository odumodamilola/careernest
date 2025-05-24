import { 
  MessageSquare, 
  Search, 
  Phone, 
  Video, 
  MoreVertical, 
  Send, 
  Paperclip, 
  Smile, 
  Users, 
  Star, 
  Clock, 
  CheckCheck, 
  Plus,
  Settings,
  Archive,
  Trash2,
  Pin,
  Volume2,
  VolumeX,
  UserPlus,
  Calendar,
  FileText,
  Image,
  Mic,
  Camera,
  Shield,
  Award,
  Briefcase,
  GraduationCap,
  Zap,
  X,
  Menu
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

// Mock data for different chat types
const chatData = {
  conversations: [
    {
      id: 1,
      type: 'mentor',
      name: 'Dr. Sarah Chen',
      title: 'Senior Software Engineer at Google',
      avatar: 'https://dims.healthgrades.com/dims3/MMH/54c2532/2147483647/strip/true/crop/400x400+0+0/resize/400x400!/quality/75/?url=https%3A%2F%2Fucmscdn.healthgrades.com%2F6c%2Fa8%2F1b134fb8489ab3d9a64f8a6ba2ef%2Fservlet-filedownload',
      lastMessage: 'Great progress on your system design skills! Let\'s schedule our next session.',
      timestamp: '2 min ago',
      unread: 2,
      online: true,
      verified: true,
      rating: 4.9,
      sessionType: 'Paid Mentorship'
    },
    {
      id: 2,
      type: 'professional',
      name: 'Marcus Johnson',
      title: 'Product Manager at Microsoft',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      lastMessage: 'Thanks for connecting! I\'d love to discuss the PM role at our company.',
      timestamp: '15 min ago',
      unread: 1,
      online: true,
      verified: true,
      mutualConnections: 12
    },
    {
      id: 3,
      type: 'group',
      name: 'Frontend Developers Community',
      avatar: null,
      lastMessage: 'Alex: Has anyone tried React 18 with Suspense?',
      timestamp: '1 hour ago',
      unread: 5,
      online: false,
      members: 1247,
      category: 'Professional Group'
    },
    {
      id: 4,
      type: 'course',
      name: 'Machine Learning Bootcamp',
      title: 'Course Discussion',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      lastMessage: 'Instructor: Assignment 3 has been posted. Due next Friday.',
      timestamp: '3 hours ago',
      unread: 0,
      online: false,
      students: 89,
      instructor: 'Dr. Kevin Liu'
    },
    {
      id: 5,
      type: 'project',
      name: 'E-commerce Website Team',
      avatar: null,
      lastMessage: 'Emma: Backend API is ready for testing',
      timestamp: '5 hours ago',
      unread: 3,
      online: false,
      members: 6,
      category: 'Work Project'
    },
    {
      id: 6,
      type: 'professional',
      name: 'Priya Patel',
      title: 'Data Scientist at Netflix',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      lastMessage: 'The data analysis report looks fantastic!',
      timestamp: '1 day ago',
      unread: 0,
      online: false,
      verified: true,
      mutualConnections: 8
    },
    {
      id: 7,
      type: 'mentor',
      name: 'James Wilson',
      title: 'UX Design Lead at Airbnb',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      lastMessage: 'Your portfolio is improving! Focus on user research next.',
      timestamp: '2 days ago',
      unread: 0,
      online: false,
      verified: true,
      rating: 4.8,
      sessionType: 'Design Review'
    }
  ],
  messages: {
    1: [
      {
        id: 1,
        sender: 'Dr. Sarah Chen',
        message: 'Hi! I reviewed your system design submission. Overall, great work!',
        timestamp: '10:30 AM',
        type: 'text',
        isOwn: false
      },
      {
        id: 2,
        sender: 'You',
        message: 'Thank you! I was particularly struggling with the load balancer design.',
        timestamp: '10:32 AM',
        type: 'text',
        isOwn: true
      },
      {
        id: 3,
        sender: 'Dr. Sarah Chen',
        message: 'That\'s completely normal. Let me share a diagram that might help.',
        timestamp: '10:33 AM',
        type: 'text',
        isOwn: false
      },
      {
        id: 4,
        sender: 'Dr. Sarah Chen',
        message: 'system-design-diagram.png',
        timestamp: '10:34 AM',
        type: 'image',
        isOwn: false,
        fileUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop'
      },
      {
        id: 5,
        sender: 'You',
        message: 'This is incredibly helpful! The horizontal scaling approach makes so much more sense now.',
        timestamp: '10:36 AM',
        type: 'text',
        isOwn: true
      },
      {
        id: 6,
        sender: 'Dr. Sarah Chen',
        message: 'Great progress on your system design skills! Let\'s schedule our next session.',
        timestamp: '10:45 AM',
        type: 'text',
        isOwn: false
      }
    ]
  }
};

// Add responsive styling classes
interface StyleConfig {
  container: string;
  sidebar: string;
  chatArea: string;
  infoPanel: string;
}

const styles: StyleConfig = {
  container: "h-screen w-full flex overflow-hidden bg-gray-50",
  sidebar: `
    fixed md:static 
    inset-y-0 left-0 
    z-30 w-full md:w-80 lg:w-96 
    transform transition-transform duration-300 ease-in-out
    md:transform-none 
    bg-white border-r border-gray-200
  `,
  chatArea: "flex-1 w-full flex flex-col bg-white md:rounded-l-xl",
  infoPanel: "hidden lg:block w-80 xl:w-96 border-l border-gray-200 bg-white"
};

export function Messages() {
  const [selectedChat, setSelectedChat] = useState(1);
  const [messageText, setMessageText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [showChatInfo, setShowChatInfo] = useState(false);
  const [messages, setMessages] = useState(chatData.messages);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const messagesEndRef = useRef(null);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showSidebar, setShowSidebar] = useState(!isMobile);
  const [showInfoPanel, setShowInfoPanel] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, selectedChat]);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setShowSidebar(!mobile);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSendMessage = () => {
    if (!messageText.trim()) return;

    const newMessage = {
      id: Date.now(),
      sender: 'You',
      message: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'text',
      isOwn: true
    };

    setMessages(prev => ({
      ...prev,
      [selectedChat]: [...(prev[selectedChat] || []), newMessage]
    }));

    setMessageText('');

    // Simulate response for demo
    setTimeout(() => {
      const responses = [
        "Thanks for sharing that!",
        "That's a great point.",
        "Let me think about this and get back to you.",
        "I agree with your approach.",
        "Would you like to schedule a call to discuss this further?"
      ];
      
      const responseMessage = {
        id: Date.now() + 1,
        sender: currentChat?.name || 'User',
        message: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'text',
        isOwn: false
      };

      setMessages(prev => ({
        ...prev,
        [selectedChat]: [...(prev[selectedChat] || []), responseMessage]
      }));
    }, 1000);
  };

  const filteredChats = chatData.conversations.filter(chat => {
    const matchesSearch = chat.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' || 
                     (activeTab === 'mentors' && chat.type === 'mentor') ||
                     (activeTab === 'professional' && chat.type === 'professional') ||
                     (activeTab === 'groups' && (chat.type === 'group' || chat.type === 'course' || chat.type === 'project'));
    return matchesSearch && matchesTab;
  });

  const currentChat = chatData.conversations.find(chat => chat.id === selectedChat);
  const currentMessages = messages[selectedChat] || [];

  const getChatIcon = (type) => {
    switch (type) {
      case 'mentor': return <Award className="h-4 w-4 text-yellow-500" />;
      case 'professional': return <Briefcase className="h-4 w-4 text-blue-500" />;
      case 'group': return <Users className="h-4 w-4 text-green-500" />;
      case 'course': return <GraduationCap className="h-4 w-4 text-purple-500" />;
      case 'project': return <Zap className="h-4 w-4 text-orange-500" />;
      default: return <MessageSquare className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <div className={`${styles.sidebar} ${showSidebar ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full flex flex-col">
          {isMobile && (
            <button 
              onClick={() => setShowSidebar(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          )}
          {/* Existing sidebar content */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-semibold text-gray-900">Messages</h1>
              <div className="flex items-center space-x-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Settings className="h-5 w-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Plus className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 mt-4 bg-gray-100 rounded-lg p-1">
              {[
                { id: 'all', label: 'All' },
                { id: 'mentors', label: 'Mentors' },
                { id: 'professional', label: 'Network' },
                { id: 'groups', label: 'Groups' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto">
            {filteredChats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => setSelectedChat(chat.id)}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedChat === chat.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="relative">
                    {chat.avatar ? (
                      <img
                        src={chat.avatar}
                        alt={chat.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <Users className="h-6 w-6 text-white" />
                      </div>
                    )}
                    {chat.online && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium text-gray-900 truncate">{chat.name}</h3>
                        {chat.verified && <Award className="h-4 w-4 text-blue-500" />}
                        {getChatIcon(chat.type)}
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="text-xs text-gray-500">{chat.timestamp}</span>
                        {chat.unread > 0 && (
                          <div className="w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">
                            {chat.unread}
                          </div>
                        )}
                      </div>
                    </div>

                    {chat.title && (
                      <p className="text-sm text-gray-600 truncate">{chat.title}</p>
                    )}

                    <p className="text-sm text-gray-600 truncate mt-1">{chat.lastMessage}</p>

                    {/* Additional info based on chat type */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center space-x-3 text-xs text-gray-500">
                        {chat.type === 'mentor' && chat.rating && (
                          <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3 text-yellow-400 fill-current" />
                            <span>{chat.rating}</span>
                          </div>
                        )}
                        {chat.type === 'professional' && chat.mutualConnections && (
                          <span>{chat.mutualConnections} mutual</span>
                        )}
                        {(chat.type === 'group' || chat.type === 'course' || chat.type === 'project') && (
                          <span>{chat.members || chat.students} members</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className={styles.chatArea}>
        {/* Chat Header */}
        <div className="flex items-center p-4 border-b border-gray-200">
          {isMobile && !showSidebar && (
            <button 
              onClick={() => setShowSidebar(true)}
              className="mr-4 p-2 rounded-full hover:bg-gray-100"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}
          {/* Existing header content */}
          {currentChat ? (
            <>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    {currentChat.avatar ? (
                      <img
                        src={currentChat.avatar}
                        alt={currentChat.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-white" />
                      </div>
                    )}
                    {currentChat.online && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h2 className="font-semibold text-gray-900">{currentChat.name}</h2>
                      {currentChat.verified && <Award className="h-4 w-4 text-blue-500" />}
                      {getChatIcon(currentChat.type)}
                    </div>
                    {currentChat.title && (
                      <p className="text-sm text-gray-600">{currentChat.title}</p>
                    )}
                    {currentChat.online ? (
                      <p className="text-xs text-green-600">Online now</p>
                    ) : (
                      <p className="text-xs text-gray-500">Last seen {currentChat.timestamp}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Phone className="h-5 w-5 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Video className="h-5 w-5 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Calendar className="h-5 w-5 text-gray-600" />
                  </button>
                  <button 
                    onClick={() => setShowChatInfo(!showChatInfo)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <MoreVertical className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Chat Type Banner */}
              {currentChat.type === 'mentor' && (
                <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <Award className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-800">Mentorship Session</span>
                    <span className="text-sm text-yellow-600">• {currentChat.sessionType}</span>
                    {currentChat.rating && (
                      <div className="flex items-center space-x-1 ml-auto">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium text-yellow-800">{currentChat.rating}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-700 mb-2">Select a conversation</h2>
                <p className="text-gray-500">Choose a chat from the sidebar to start messaging</p>
              </div>
            </div>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="max-w-3xl mx-auto space-y-4">
            {currentMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[75%] md:max-w-md px-3 md:px-4 py-2 rounded-lg ${
                  message.isOwn
                    ? 'bg-blue-500 text-white'
                    : 'bg-white border border-gray-200 text-gray-900'
                }`}>
                  {message.type === 'text' && (
                    <p className="text-sm">{message.message}</p>
                  )}
                  {message.type === 'image' && (
                    <div>
                      <img
                        src={message.fileUrl}
                        alt="Shared image"
                        className="rounded-lg max-w-full h-auto mb-2"
                      />
                      <p className="text-sm">{message.message}</p>
                    </div>
                  )}
                  <div className="flex items-center justify-between mt-1">
                    <span className={`text-xs ${
                      message.isOwn ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp}
                    </span>
                    {message.isOwn && (
                      <CheckCheck className="h-3 w-3 text-blue-100 ml-2" />
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-200">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center space-x-2 md:space-x-3">
              {/* Hide less important buttons on mobile */}
              <button className="hidden md:block p-2 hover:bg-gray-100 rounded-lg">
                <Paperclip className="h-5 w-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Image className="h-5 w-5 text-gray-600" />
              </button>
              <button className="hidden md:block p-2 hover:bg-gray-100 rounded-lg">
                <Mic className="h-5 w-5 text-gray-600" />
              </button>
              
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Smile className="h-5 w-5 text-gray-400" />
                </button>
              </div>

              <button
                onClick={handleSendMessage}
                className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors"
                disabled={!messageText.trim()}
              >
                <Send className="h-5 w-5" />
              </button>
            </div>

            {/* Make quick actions scrollable on mobile */}
            {currentChat.type === 'mentor' && (
              <div className="overflow-x-auto whitespace-nowrap mt-3">
                <div className="inline-flex space-x-2">
                  <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors">
                    Schedule Session
                  </button>
                  <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors">
                    Share Screen
                  </button>
                  <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors">
                    End Session
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Info Panel */}
      {showInfoPanel && (
        <div className={styles.infoPanel}>
          {/* Existing info panel content */}
          {currentChat && (
            <div className="text-center mb-6">
              {currentChat.avatar ? (
                <img
                  src={currentChat.avatar}
                  alt={currentChat.name}
                  className="w-20 h-20 rounded-full object-cover mx-auto mb-4"
                />
              ) : (
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-10 w-10 text-white" />
                </div>
              )}
              <h3 className="font-semibold text-gray-900">{currentChat.name}</h3>
              {currentChat.title && (
                <p className="text-sm text-gray-600 mt-1">{currentChat.title}</p>
              )}
            </div>
          )}

          <div className="space-y-4">
            {currentChat?.type === 'mentor' && (
              <div className="bg-yellow-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Mentorship Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rating:</span>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span>{currentChat.rating}</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Session Type:</span>
                    <span>{currentChat.sessionType}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <button className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <Volume2 className="h-5 w-5 text-gray-600" />
                <span className="text-gray-700">Mute notifications</span>
              </button>
              <button className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <Pin className="h-5 w-5 text-gray-600" />
                <span className="text-gray-700">Pin conversation</span>
              </button>
              <button className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <Archive className="h-5 w-5 text-gray-600" />
                <span className="text-gray-700">Archive chat</span>
              </button>
              <button className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors text-red-600">
                <Trash2 className="h-5 w-5" />
                <span>Delete conversation</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Overlay */}
      {isMobile && showSidebar && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setShowSidebar(false)}
        />
      )}
    </div>
  );
}