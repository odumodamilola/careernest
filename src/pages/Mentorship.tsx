import { Users, Star, MapPin, BookOpen, MessageCircle, Video, Calendar, Search, Filter, Brain, Award, Briefcase, GraduationCap, Zap, Target, TrendingUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useMatchingStore } from '../stores/matchingStore';
import { useAuthStore } from '../stores/authStore';
import { MatchCard } from '../components/mentorship/MatchCard';
import { MatchScore } from '../lib/ai-matching';

const mentors = [
  {
    id: 1,
    name: "Dr. Sarah Chen",
    title: "Senior Software Engineer",
    company: "Google",
    field: "Software Engineering",
    college: "Stanford University",
    experience: "8 years",
    rating: 4.9,
    sessions: 156,
    price: "$80/hour",
    expertise: ["React", "Machine Learning", "System Design"],
    avatar: "https://www.evergreenhealth.com/app/files/public/Chen-Sarah.jpg",
    verified: true,
    nextAvailable: "Today 3:00 PM"
  },
  {
    id: 2,
    name: "Marcus Johnson",
    title: "Product Manager",
    company: "Microsoft",
    field: "Product Management",
    college: "Harvard Business School",
    experience: "6 years",
    rating: 4.8,
    sessions: 142,
    price: "$75/hour",
    expertise: ["Strategy", "Agile", "Data Analytics"],
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    verified: true,
    nextAvailable: "Tomorrow 10:00 AM"
  },
  {
    id: 3,
    name: "Dr. Priya Patel",
    title: "Data Scientist",
    company: "Netflix",
    field: "Data Science",
    college: "MIT",
    experience: "7 years",
    rating: 4.9,
    sessions: 203,
    price: "$85/hour",
    expertise: ["Python", "Deep Learning", "Statistics"],
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    verified: true,
    nextAvailable: "Today 5:00 PM"
  }
];

const fields = ["All Fields", "Software Engineering", "Data Science", "Product Management", "UX Design", "AI/ML", "Finance", "Marketing", "Healthcare", "Other"];

export function Mentorship() {
  const { user } = useAuthStore();
  const { matches, loading, findMatches, userPreferences } = useMatchingStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedField, setSelectedField] = useState("All Fields");
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState<'ai-matches' | 'browse'>('ai-matches');

  useEffect(() => {
    if (user && userPreferences) {
      findMatches(user.id);
    }
  }, [user, userPreferences, findMatches]);

  const filteredMentors = mentors.filter(mentor => {
    const matchesSearch = mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mentor.field.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mentor.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesField = selectedField === "All Fields" || mentor.field === selectedField;
    return matchesSearch && matchesField;
  });

  const handleConnect = (mentorId: string) => {
    console.log('Connecting to mentor:', mentorId);
    // Implement connection logic
  };

  const handleSchedule = (mentorId: string) => {
    console.log('Scheduling with mentor:', mentorId);
    // Implement scheduling logic
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">AI-Powered Mentorship</h1>
                <p className="text-gray-600">Connect with industry experts and accelerate your career</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Users className="h-4 w-4" />
                <span>{mentors.length} Expert Mentors</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Award className="h-4 w-4" />
                <span>AI-Matched</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('ai-matches')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'ai-matches'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Brain className="h-4 w-4" />
                  <span>AI Matches</span>
                  {matches.length > 0 && (
                    <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs">
                      {matches.length}
                    </span>
                  )}
                </div>
              </button>
              <button
                onClick={() => setActiveTab('browse')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'browse'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Search className="h-4 w-4" />
                  <span>Browse All</span>
                </div>
              </button>
            </nav>
          </div>
        </div>

        {activeTab === 'ai-matches' && (
          <div>
            {/* AI Matches Header */}
            <div className="mb-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
              <div className="max-w-4xl mx-auto text-center">
                <div className="flex items-center justify-center mb-4">
                  <Brain className="h-12 w-12 text-white" />
                </div>
                <h2 className="text-3xl font-bold mb-4">Your AI-Curated Matches</h2>
                <p className="text-xl text-blue-100 mb-6">
                  Our advanced AI has analyzed your preferences and found the perfect mentors for you
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="bg-white bg-opacity-20 rounded-full p-3 w-fit mx-auto mb-3">
                      <Target className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold mb-2">Smart Matching</h3>
                    <p className="text-blue-100 text-sm">AI analyzes compatibility factors</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-white bg-opacity-20 rounded-full p-3 w-fit mx-auto mb-3">
                      <TrendingUp className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold mb-2">Quality Assurance</h3>
                    <p className="text-blue-100 text-sm">Verified experts with proven track records</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-white bg-opacity-20 rounded-full p-3 w-fit mx-auto mb-3">
                      <Zap className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold mb-2">Instant Results</h3>
                    <p className="text-blue-100 text-sm">Get matched immediately after preferences</p>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Matches Grid */}
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">AI is finding your perfect matches...</p>
              </div>
            ) : matches.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {matches.map((match) => (
                  <MatchCard
                    key={match.mentorId}
                    match={match}
                    onConnect={handleConnect}
                    onSchedule={handleSchedule}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="max-w-md mx-auto">
                  <div className="p-3 bg-gray-100 rounded-full w-fit mx-auto mb-4">
                    <Brain className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Complete Your Preferences</h3>
                  <p className="text-gray-600 mb-4">
                    Complete your mentorship preferences to get AI-powered matches tailored just for you.
                  </p>
                  <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors">
                    Set Up AI Matching
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'browse' && (
          <div>
            {/* Search and Filters */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search mentors by name, field, or company..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <select
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={selectedField}
                  onChange={(e) => setSelectedField(e.target.value)}
                >
                  {fields.map(field => (
                    <option key={field} value={field}>{field}</option>
                  ))}
                </select>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Filter className="h-5 w-5" />
                  <span>Filters</span>
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Active Mentors</p>
                    <p className="text-2xl font-bold text-gray-900">{mentors.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Star className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Avg Rating</p>
                    <p className="text-2xl font-bold text-gray-900">4.8</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <MessageCircle className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Total Sessions</p>
                    <p className="text-2xl font-bold text-gray-900">4,200+</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <GraduationCap className="h-6 w-6 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Success Rate</p>
                    <p className="text-2xl font-bold text-gray-900">95%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Mentors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMentors.map((mentor) => (
                <div key={mentor.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-blue-200">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={mentor.avatar}
                          alt={mentor.name}
                          className="w-16 h-16 rounded-full object-cover border-2 border-gray-100"
                        />
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold text-gray-900">{mentor.name}</h3>
                            {mentor.verified && (
                              <Award className="h-4 w-4 text-blue-500" />
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{mentor.title}</p>
                          <p className="text-sm font-medium text-blue-600">{mentor.company}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Field:</span>
                        <span className="font-medium">{mentor.field}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">College:</span>
                        <span className="font-medium">{mentor.college}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Experience:</span>
                        <span className="font-medium">{mentor.experience}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="font-medium">{mentor.rating}</span>
                          <span className="text-gray-500">({mentor.sessions} sessions)</span>
                        </div>
                        <span className="font-semibold text-green-600">{mentor.price}</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {mentor.expertise.slice(0, 3).map((skill, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>Available: {mentor.nextAvailable}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>Remote</span>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm flex items-center justify-center space-x-2">
                        <MessageCircle className="h-4 w-4" />
                        <span>Book Session</span>
                      </button>
                      <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <Video className="h-4 w-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredMentors.length === 0 && (
              <div className="text-center py-12">
                <div className="max-w-md mx-auto">
                  <div className="p-3 bg-gray-100 rounded-full w-fit mx-auto mb-4">
                    <Search className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No mentors found</h3>
                  <p className="text-gray-600">Try adjusting your search criteria or browse all mentors.</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}