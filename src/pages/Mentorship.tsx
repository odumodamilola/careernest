import { Users, Star, MapPin, BookOpen, MessageCircle, Video, Calendar, Search, Filter, Brain, Award, Briefcase, GraduationCap } from 'lucide-react';
import { useState } from 'react';

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
  },
  {
    id: 4,
    name: "James Wilson",
    title: "UX Design Lead",
    company: "Airbnb",
    field: "UX Design",
    college: "RISD",
    experience: "9 years",
    rating: 4.7,
    sessions: 178,
    price: "$70/hour",
    expertise: ["Figma", "User Research", "Prototyping"],
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    verified: true,
    nextAvailable: "Today 7:00 PM"
  },
  {
    id: 5,
    name: "Angela Rodriguez",
    title: "Marketing Director",
    company: "HubSpot",
    field: "Digital Marketing",
    college: "Wharton",
    experience: "10 years",
    rating: 4.8,
    sessions: 234,
    price: "$90/hour",
    expertise: ["Growth Hacking", "SEO", "Content Strategy"],
    avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face",
    verified: true,
    nextAvailable: "Tomorrow 2:00 PM"
  },
  {
    id: 6,
    name: "Dr. Kevin Liu",
    title: "AI Research Scientist",
    company: "OpenAI",
    field: "Artificial Intelligence",
    college: "Carnegie Mellon",
    experience: "5 years",
    rating: 4.9,
    sessions: 89,
    price: "$100/hour",
    expertise: ["NLP", "Computer Vision", "PyTorch"],
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face",
    verified: true,
    nextAvailable: "Today 4:00 PM"
  },
  {
    id: 7,
    name: "Emma Thompson",
    title: "Cybersecurity Architect",
    company: "IBM",
    field: "Cybersecurity",
    college: "Georgia Tech",
    experience: "12 years",
    rating: 4.8,
    sessions: 167,
    price: "$95/hour",
    expertise: ["Penetration Testing", "Cloud Security", "Risk Assessment"],
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face",
    verified: true,
    nextAvailable: "Tomorrow 9:00 AM"
  },
  {
    id: 8,
    name: "Carlos Mendez",
    title: "DevOps Engineer",
    company: "Spotify",
    field: "DevOps",
    college: "UC Berkeley",
    experience: "6 years",
    rating: 4.7,
    sessions: 134,
    price: "$75/hour",
    expertise: ["Kubernetes", "AWS", "CI/CD"],
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
    verified: true,
    nextAvailable: "Today 6:00 PM"
  },
  {
    id: 9,
    name: "Dr. Lisa Park",
    title: "Biotech Researcher",
    company: "Genentech",
    field: "Biotechnology",
    college: "Johns Hopkins",
    experience: "11 years",
    rating: 4.9,
    sessions: 78,
    price: "$110/hour",
    expertise: ["Gene Therapy", "Clinical Trials", "R&D"],
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face",
    verified: true,
    nextAvailable: "Tomorrow 11:00 AM"
  },
  {
    id: 10,
    name: "Ahmed Hassan",
    title: "Blockchain Developer",
    company: "Coinbase",
    field: "Blockchain",
    college: "Oxford",
    experience: "4 years",
    rating: 4.6,
    sessions: 92,
    price: "$85/hour",
    expertise: ["Solidity", "Web3", "DeFi"],
    avatar: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face",
    verified: true,
    nextAvailable: "Today 8:00 PM"
  },
  {
    id: 11,
    name: "Rachel Green",
    title: "Financial Analyst",
    company: "Goldman Sachs",
    field: "Finance",
    college: "NYU Stern",
    experience: "7 years",
    rating: 4.8,
    sessions: 156,
    price: "$80/hour",
    expertise: ["Investment Banking", "Financial Modeling", "Valuation"],
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    verified: true,
    nextAvailable: "Tomorrow 1:00 PM"
  },
  {
    id: 12,
    name: "Dr. Michael Brown",
    title: "Clinical Psychologist",
    company: "Private Practice",
    field: "Psychology",
    college: "Yale",
    experience: "15 years",
    rating: 4.9,
    sessions: 289,
    price: "$120/hour",
    expertise: ["Cognitive Therapy", "Research", "Clinical Practice"],
    avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face",
    verified: true,
    nextAvailable: "Today 2:00 PM"
  },
  {
    id: 13,
    name: "Sofia Gonzalez",
    title: "Environmental Engineer",
    company: "Tesla",
    field: "Environmental Engineering",
    college: "Caltech",
    experience: "8 years",
    rating: 4.7,
    sessions: 123,
    price: "$85/hour",
    expertise: ["Sustainability", "Clean Energy", "Environmental Impact"],
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face",
    verified: true,
    nextAvailable: "Tomorrow 3:00 PM"
  },
  {
    id: 14,
    name: "David Kim",
    title: "Game Developer",
    company: "Epic Games",
    field: "Game Development",
    college: "DigiPen",
    experience: "9 years",
    rating: 4.8,
    sessions: 167,
    price: "$75/hour",
    expertise: ["Unreal Engine", "C++", "Game Design"],
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    verified: true,
    nextAvailable: "Today 9:00 PM"
  },
  {
    id: 15,
    name: "Dr. Jennifer Lee",
    title: "Mechanical Engineer",
    company: "Boeing",
    field: "Mechanical Engineering",
    college: "Georgia Tech",
    experience: "13 years",
    rating: 4.9,
    sessions: 198,
    price: "$90/hour",
    expertise: ["Aerospace", "CAD Design", "Manufacturing"],
    avatar: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=150&h=150&fit=crop&crop=face",
    verified: true,
    nextAvailable: "Tomorrow 10:00 AM"
  },
  {
    id: 16,
    name: "Robert Taylor",
    title: "Sales Director",
    company: "Salesforce",
    field: "Sales",
    college: "Northwestern Kellogg",
    experience: "11 years",
    rating: 4.7,
    sessions: 234,
    price: "$70/hour",
    expertise: ["B2B Sales", "CRM", "Team Leadership"],
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    verified: true,
    nextAvailable: "Today 1:00 PM"
  },
  {
    id: 17,
    name: "Dr. Maya Singh",
    title: "Medical Doctor",
    company: "Johns Hopkins Hospital",
    field: "Medicine",
    college: "Harvard Medical",
    experience: "14 years",
    rating: 4.9,
    sessions: 156,
    price: "$150/hour",
    expertise: ["Internal Medicine", "Research", "Patient Care"],
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face",
    verified: true,
    nextAvailable: "Tomorrow 8:00 AM"
  },
  {
    id: 18,
    name: "Alex Turner",
    title: "Mobile App Developer",
    company: "Uber",
    field: "Mobile Development",
    college: "University of Washington",
    experience: "6 years",
    rating: 4.6,
    sessions: 145,
    price: "$70/hour",
    expertise: ["React Native", "iOS", "Android"],
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face",
    verified: true,
    nextAvailable: "Today 4:00 PM"
  },
  {
    id: 19,
    name: "Dr. Hannah White",
    title: "Research Scientist",
    company: "NASA",
    field: "Aerospace",
    college: "MIT",
    experience: "10 years",
    rating: 4.8,
    sessions: 89,
    price: "$95/hour",
    expertise: ["Space Systems", "Robotics", "Mission Planning"],
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b1ac?w=150&h=150&fit=crop&crop=face",
    verified: true,
    nextAvailable: "Tomorrow 2:00 PM"
  },
  {
    id: 20,
    name: "Tony Rodriguez",
    title: "Cloud Architect",
    company: "Amazon Web Services",
    field: "Cloud Computing",
    college: "Stanford",
    experience: "9 years",
    rating: 4.7,
    sessions: 178,
    price: "$85/hour",
    expertise: ["AWS", "Serverless", "Microservices"],
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
    verified: true,
    nextAvailable: "Today 7:00 PM"
  },
  {
    id: 21,
    name: "Dr. Grace Chen",
    title: "Quantum Computing Researcher",
    company: "IBM Research",
    field: "Quantum Computing",
    college: "Caltech",
    experience: "6 years",
    rating: 4.9,
    sessions: 67,
    price: "$120/hour",
    expertise: ["Quantum Algorithms", "Qiskit", "Physics"],
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    verified: true,
    nextAvailable: "Tomorrow 4:00 PM"
  },
  {
    id: 22,
    name: "Luis Martinez",
    title: "Data Engineer",
    company: "Databricks",
    field: "Data Engineering",
    college: "UC San Diego",
    experience: "7 years",
    rating: 4.6,
    sessions: 134,
    price: "$80/hour",
    expertise: ["Apache Spark", "ETL", "Big Data"],
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    verified: true,
    nextAvailable: "Today 5:00 PM"
  },
  {
    id: 23,
    name: "Dr. Olivia Davis",
    title: "Neuroscientist",
    company: "Stanford Medicine",
    field: "Neuroscience",
    college: "Harvard",
    experience: "12 years",
    rating: 4.8,
    sessions: 98,
    price: "$110/hour",
    expertise: ["Brain Research", "Cognitive Science", "Neural Networks"],
    avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face",
    verified: true,
    nextAvailable: "Tomorrow 11:00 AM"
  },
  {
    id: 24,
    name: "Ryan O'Connor",
    title: "Startup Founder",
    company: "TechStars",
    field: "Entrepreneurship",
    college: "Y Combinator",
    experience: "8 years",
    rating: 4.7,
    sessions: 189,
    price: "$100/hour",
    expertise: ["Fundraising", "Product-Market Fit", "Scaling"],
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    verified: true,
    nextAvailable: "Today 3:00 PM"
  },
  {
    id: 25,
    name: "Dr. Zoe Adams",
    title: "Chemical Engineer",
    company: "Dow Chemical",
    field: "Chemical Engineering",
    college: "MIT",
    experience: "11 years",
    rating: 4.8,
    sessions: 143,
    price: "$85/hour",
    expertise: ["Process Optimization", "Materials Science", "R&D"],
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face",
    verified: true,
    nextAvailable: "Tomorrow 9:00 AM"
  },
  {
    id: 26,
    name: "Marcus Thompson",
    title: "Investment Manager",
    company: "Blackstone",
    field: "Investment Banking",
    college: "Wharton",
    experience: "9 years",
    rating: 4.6,
    sessions: 167,
    price: "$95/hour",
    expertise: ["Private Equity", "M&A", "Due Diligence"],
    avatar: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face",
    verified: true,
    nextAvailable: "Today 6:00 PM"
  },
  {
    id: 27,
    name: "Dr. Isabel Garcia",
    title: "Agricultural Scientist",
    company: "Monsanto",
    field: "Agriculture",
    college: "UC Davis",
    experience: "13 years",
    rating: 4.7,
    sessions: 112,
    price: "$75/hour",
    expertise: ["Crop Science", "Sustainability", "Biotechnology"],
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    verified: true,
    nextAvailable: "Tomorrow 1:00 PM"
  },
  {
    id: 28,
    name: "Jordan Lee",
    title: "Social Media Manager",
    company: "Meta",
    field: "Social Media",
    college: "NYU",
    experience: "5 years",
    rating: 4.5,
    sessions: 156,
    price: "$60/hour",
    expertise: ["Content Strategy", "Analytics", "Community Management"],
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face",
    verified: true,
    nextAvailable: "Today 8:00 PM"
  },
  {
    id: 29,
    name: "Dr. Samuel Wright",
    title: "Pharmacologist",
    company: "Pfizer",
    field: "Pharmaceutical",
    college: "Johns Hopkins",
    experience: "14 years",
    rating: 4.9,
    sessions: 123,
    price: "$105/hour",
    expertise: ["Drug Development", "Clinical Trials", "Regulatory Affairs"],
    avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face",
    verified: true,
    nextAvailable: "Tomorrow 10:00 AM"
  },
  {
    id: 30,
    name: "Nina Patel",
    title: "HR Director",
    company: "LinkedIn",
    field: "Human Resources",
    college: "Cornell",
    experience: "10 years",
    rating: 4.7,
    sessions: 198,
    price: "$70/hour",
    expertise: ["Talent Acquisition", "Organizational Development", "Leadership"],
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face",
    verified: true,
    nextAvailable: "Today 2:00 PM"
  }
];

const fields = ["All Fields", "Software Engineering", "Data Science", "Product Management", "UX Design", "AI/ML", "Finance", "Marketing", "Healthcare", "Other"];

export function Mentorship() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedField, setSelectedField] = useState("All Fields");
  const [showFilters, setShowFilters] = useState(false);

  const filteredMentors = mentors.filter(mentor => {
    const matchesSearch = mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mentor.field.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mentor.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesField = selectedField === "All Fields" || mentor.field === selectedField;
    return matchesSearch && matchesField;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
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

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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

        {/* AI Matching Banner */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center mb-4">
              <Brain className="h-12 w-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-4">AI-Powered Mentor Matching</h2>
            <p className="text-xl text-blue-100 mb-6">
              Our advanced AI analyzes your goals, experience, and preferences to match you with the perfect mentor
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="bg-white bg-opacity-20 rounded-full p-3 w-fit mx-auto mb-3">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="font-semibold mb-2">Smart Matching</h3>
                <p className="text-blue-100 text-sm">AI analyzes compatibility factors</p>
              </div>
              <div className="text-center">
                <div className="bg-white bg-opacity-20 rounded-full p-3 w-fit mx-auto mb-3">
                  <Star className="h-6 w-6" />
                </div>
                <h3 className="font-semibold mb-2">Quality Assurance</h3>
                <p className="text-blue-100 text-sm">Verified experts with proven track records</p>
              </div>
              <div className="text-center">
                <div className="bg-white bg-opacity-20 rounded-full p-3 w-fit mx-auto mb-3">
                  <Briefcase className="h-6 w-6" />
                </div>
                <h3 className="font-semibold mb-2">Career Growth</h3>
                <p className="text-blue-100 text-sm">Personalized guidance for your goals</p>
              </div>
            </div>
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
              Get AI-Matched Now
            </button>
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-16 bg-white rounded-2xl p-8 shadow-sm">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-gray-600 text-lg">Start your mentorship journey in three simple steps</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-4 w-fit mx-auto mb-4">
                <Search className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">1. Find Your Mentor</h3>
              <p className="text-gray-600">Browse our curated list of expert mentors or use AI matching to find your perfect fit</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 rounded-full p-4 w-fit mx-auto mb-4">
                <Calendar className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">2. Book a Session</h3>
              <p className="text-gray-600">Schedule a convenient time for your mentorship session with flexible timing options</p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 rounded-full p-4 w-fit mx-auto mb-4">
                <Award className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">3. Grow Your Career</h3>
              <p className="text-gray-600">Get personalized guidance, actionable insights, and accelerate your professional growth</p>
            </div>
          </div>
        </div>

        {/* Success Stories */}
        <div className="mt-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Success Stories</h2>
            <p className="text-gray-600 text-lg">See how our mentorship program has transformed careers</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <img
                  src="https://images.unsplash.com/photo-1494790108755-2616b612b1ac?w=40&h=40&fit=crop&crop=face"
                  alt="Student"
                  className="w-10 h-10 rounded-full mr-3"
                />
                <div>
                  <p className="font-medium text-gray-900">Sarah J.</p>
                  <p className="text-sm text-gray-600">Software Engineer</p>
                </div>
              </div>
              <p className="text-gray-700 text-sm italic mb-3">
                "Thanks to my mentor, I landed my dream job at Google. The personalized guidance was invaluable!"
              </p>
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
                  alt="Student"
                  className="w-10 h-10 rounded-full mr-3"
                />
                <div>
                  <p className="font-medium text-gray-900">Mike R.</p>
                  <p className="text-sm text-gray-600">Product Manager</p>
                </div>
              </div>
              <p className="text-gray-700 text-sm italic mb-3">
                "My mentor helped me transition from engineering to product management. Couldn't have done it without them!"
              </p>
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <img
                  src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face"
                  alt="Student"
                  className="w-10 h-10 rounded-full mr-3"
                />
                <div>
                  <p className="font-medium text-gray-900">Lisa K.</p>
                  <p className="text-sm text-gray-600">Data Scientist</p>
                </div>
              </div>
              <p className="text-gray-700 text-sm italic mb-3">
                "The AI matching system connected me with the perfect mentor. My career growth has been exponential!"
              </p>
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}