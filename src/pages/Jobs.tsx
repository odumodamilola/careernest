import { Briefcase, MapPin, Clock, DollarSign, ExternalLink, Search, Filter, Building2, Users, Star } from 'lucide-react';
import { useState } from 'react';

const jobListings = [
  {
    id: 1,
    title: "Senior Software Engineer",
    company: "Google",
    location: "Mountain View, CA",
    type: "Full-time",
    salary: "$180,000 - $250,000",
    posted: "2 days ago",
    description: "Join Google's core engineering team to build scalable systems serving billions of users.",
    requirements: ["5+ years experience", "Python/Java/Go", "Distributed systems"],
    url: "https://careers.google.com/jobs/results/",
    logo: "🔵",
    rating: 4.4,
    employees: "100k+"
  },
  {
    id: 2,
    title: "Product Manager",
    company: "Meta",
    location: "Menlo Park, CA",
    type: "Full-time",
    salary: "$160,000 - $220,000",
    posted: "1 day ago",
    description: "Lead product strategy for Meta's social platforms reaching 3+ billion users globally.",
    requirements: ["3+ years PM experience", "Data analysis", "Cross-functional leadership"],
    url: "https://www.metacareers.com/jobs/",
    logo: "🔷",
    rating: 4.1,
    employees: "80k+"
  },
  {
    id: 3,
    title: "Cloud Solutions Architect",
    company: "Amazon",
    location: "Seattle, WA",
    type: "Full-time",
    salary: "$170,000 - $240,000",
    posted: "3 days ago",
    description: "Design and implement cloud architecture solutions for enterprise customers using AWS.",
    requirements: ["AWS certifications", "5+ years cloud experience", "Enterprise architecture"],
    url: "https://amazon.jobs/en/",
    logo: "🟠",
    rating: 3.9,
    employees: "1.5M+"
  },
  {
    id: 4,
    title: "Data Scientist",
    company: "Microsoft",
    location: "Redmond, WA",
    type: "Full-time",
    salary: "$140,000 - $200,000",
    posted: "1 day ago",
    description: "Apply machine learning to improve Microsoft 365 products and Azure services.",
    requirements: ["PhD/MS in relevant field", "Python/R", "ML frameworks"],
    url: "https://careers.microsoft.com/",
    logo: "🟦",
    rating: 4.2,
    employees: "220k+"
  },
  {
    id: 5,
    title: "iOS Developer",
    company: "Apple",
    location: "Cupertino, CA",
    type: "Full-time",
    salary: "$150,000 - $210,000",
    posted: "4 days ago",
    description: "Develop innovative iOS applications that define the future of mobile experiences.",
    requirements: ["Swift/Objective-C", "iOS SDK", "3+ years iOS development"],
    url: "https://jobs.apple.com/",
    logo: "⚫",
    rating: 4.3,
    employees: "160k+"
  },
  {
    id: 6,
    title: "DevOps Engineer",
    company: "Netflix",
    location: "Los Gatos, CA",
    type: "Full-time",
    salary: "$155,000 - $225,000",
    posted: "2 days ago",
    description: "Build and maintain infrastructure supporting Netflix's global streaming platform.",
    requirements: ["Kubernetes", "Docker", "CI/CD pipelines", "Cloud platforms"],
    url: "https://jobs.netflix.com/",
    logo: "🔴",
    rating: 4.1,
    employees: "15k+"
  },
  {
    id: 7,
    title: "UX Designer",
    company: "Airbnb",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$130,000 - $180,000",
    posted: "1 day ago",
    description: "Design intuitive user experiences for Airbnb's global marketplace platform.",
    requirements: ["Design portfolio", "Figma/Sketch", "User research experience"],
    url: "https://careers.airbnb.com/",
    logo: "🌸",
    rating: 4.0,
    employees: "6k+"
  },
  {
    id: 8,
    title: "Machine Learning Engineer",
    company: "Tesla",
    location: "Palo Alto, CA",
    type: "Full-time",
    salary: "$165,000 - $235,000",
    posted: "3 days ago",
    description: "Develop AI systems for Tesla's autonomous driving and energy products.",
    requirements: ["Deep learning", "Computer vision", "PyTorch/TensorFlow"],
    url: "https://www.tesla.com/careers/",
    logo: "⚡",
    rating: 3.8,
    employees: "130k+"
  },
  {
    id: 9,
    title: "Frontend Developer",
    company: "Spotify",
    location: "New York, NY",
    type: "Full-time",
    salary: "$120,000 - $170,000",
    posted: "2 days ago",
    description: "Build engaging web experiences for Spotify's music streaming platform.",
    requirements: ["React/Vue.js", "TypeScript", "Web performance optimization"],
    url: "https://www.lifeatspotify.com/jobs/",
    logo: "🟢",
    rating: 4.2,
    employees: "9k+"
  },
  {
    id: 10,
    title: "Cybersecurity Analyst",
    company: "IBM",
    location: "Austin, TX",
    type: "Full-time",
    salary: "$110,000 - $150,000",
    posted: "4 days ago",
    description: "Protect IBM's global infrastructure and client systems from cyber threats.",
    requirements: ["Security certifications", "Incident response", "Risk assessment"],
    url: "https://www.ibm.com/careers/",
    logo: "🔵",
    rating: 3.9,
    employees: "350k+"
  },
  {
    id: 11,
    title: "Backend Developer",
    company: "Uber",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$145,000 - $195,000",
    posted: "1 day ago",
    description: "Build scalable backend systems powering Uber's global ride-sharing platform.",
    requirements: ["Microservices", "Database design", "Java/Python/Go"],
    url: "https://www.uber.com/careers/",
    logo: "⚫",
    rating: 3.7,
    employees: "32k+"
  },
  {
    id: 12,
    title: "Product Designer",
    company: "Figma",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$140,000 - $190,000",
    posted: "3 days ago",
    description: "Shape the future of design tools used by millions of designers worldwide.",
    requirements: ["Design systems", "Prototyping", "User-centered design"],
    url: "https://www.figma.com/careers/",
    logo: "🟣",
    rating: 4.5,
    employees: "1k+"
  },
  {
    id: 13,
    title: "Sales Engineer",
    company: "Salesforce",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$130,000 - $180,000",
    posted: "2 days ago",
    description: "Drive technical sales for Salesforce's enterprise CRM solutions.",
    requirements: ["Technical background", "Sales experience", "CRM knowledge"],
    url: "https://salesforce.wd1.myworkdayjobs.com/",
    logo: "🔵",
    rating: 4.1,
    employees: "80k+"
  },
  {
    id: 14,
    title: "Site Reliability Engineer",
    company: "LinkedIn",
    location: "Sunnyvale, CA",
    type: "Full-time",
    salary: "$160,000 - $220,000",
    posted: "1 day ago",
    description: "Ensure high availability and performance of LinkedIn's professional network platform.",
    requirements: ["System administration", "Monitoring tools", "Automation"],
    url: "https://careers.linkedin.com/",
    logo: "🔷",
    rating: 4.2,
    employees: "26k+"
  },
  {
    id: 15,
    title: "Mobile App Developer",
    company: "TikTok",
    location: "Los Angeles, CA",
    type: "Full-time",
    salary: "$135,000 - $185,000",
    posted: "3 days ago",
    description: "Develop features for TikTok's mobile app used by over 1 billion users.",
    requirements: ["React Native/Flutter", "Mobile optimization", "Video processing"],
    url: "https://careers.tiktok.com/",
    logo: "⚫",
    rating: 3.8,
    employees: "150k+"
  },
  {
    id: 16,
    title: "Data Engineer",
    company: "Snowflake",
    location: "San Mateo, CA",
    type: "Full-time",
    salary: "$150,000 - $210,000",
    posted: "2 days ago",
    description: "Build data pipelines and infrastructure for Snowflake's cloud data platform.",
    requirements: ["ETL/ELT", "SQL", "Cloud data warehousing", "Apache Spark"],
    url: "https://careers.snowflake.com/",
    logo: "🔵",
    rating: 4.4,
    employees: "7k+"
  },
  {
    id: 17,
    title: "Full Stack Developer",
    company: "Stripe",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$155,000 - $215,000",
    posted: "1 day ago",
    description: "Build payment infrastructure that powers millions of businesses globally.",
    requirements: ["JavaScript/TypeScript", "React", "Node.js", "Payment systems"],
    url: "https://stripe.com/jobs/",
    logo: "🟣",
    rating: 4.3,
    employees: "8k+"
  },
  {
    id: 18,
    title: "AI Research Scientist",
    company: "OpenAI",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$200,000 - $300,000",
    posted: "4 days ago",
    description: "Conduct cutting-edge AI research to advance artificial general intelligence.",
    requirements: ["PhD in AI/ML", "Research publications", "Deep learning expertise"],
    url: "https://openai.com/careers/",
    logo: "⚫",
    rating: 4.6,
    employees: "1k+"
  },
  {
    id: 19,
    title: "Security Engineer",
    company: "Cloudflare",
    location: "Austin, TX",
    type: "Full-time",
    salary: "$140,000 - $190,000",
    posted: "2 days ago",
    description: "Protect internet infrastructure and enhance security for millions of websites.",
    requirements: ["Network security", "Threat analysis", "Security tools"],
    url: "https://www.cloudflare.com/careers/",
    logo: "🟠",
    rating: 4.5,
    employees: "4k+"
  },
  {
    id: 20,
    title: "Growth Marketing Manager",
    company: "Shopify",
    location: "Toronto, ON",
    type: "Full-time",
    salary: "$95,000 - $130,000 CAD",
    posted: "3 days ago",
    description: "Drive user acquisition and growth for Shopify's e-commerce platform.",
    requirements: ["Digital marketing", "Analytics", "A/B testing", "Growth hacking"],
    url: "https://www.shopify.com/careers/",
    logo: "🟢",
    rating: 4.2,
    employees: "12k+"
  },
  {
    id: 21,
    title: "Platform Engineer",
    company: "Discord",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$145,000 - $200,000",
    posted: "1 day ago",
    description: "Build infrastructure supporting Discord's real-time communication platform.",
    requirements: ["Distributed systems", "Real-time systems", "Rust/Go"],
    url: "https://discord.com/jobs/",
    logo: "🟣",
    rating: 4.1,
    employees: "600+"
  }
];

export function Jobs() {
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const filteredJobs = jobListings.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = !locationFilter || job.location.toLowerCase().includes(locationFilter.toLowerCase());
    const matchesType = !typeFilter || job.type === typeFilter;
    
    return matchesSearch && matchesLocation && matchesType;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Find Your Dream Job
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover opportunities at top global companies. Your next career move starts here.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search jobs, companies..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Location"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
              />
            </div>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="">All Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Remote">Remote</option>
            </select>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
              <Filter className="h-5 w-5 mr-2" />
              Filter
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''} 
            {searchTerm && ` for "${searchTerm}"`}
          </p>
        </div>

        {/* Job Listings */}
        <div className="space-y-6">
          {filteredJobs.map((job) => (
            <div key={job.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{job.logo}</div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-1">
                          {job.title}
                        </h3>
                        <div className="flex items-center space-x-4 text-gray-600">
                          <div className="flex items-center">
                            <Building2 className="h-4 w-4 mr-1" />
                            <span className="font-medium">{job.company}</span>
                          </div>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 mr-1 text-yellow-400" />
                            <span>{job.rating}</span>
                          </div>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            <span>{job.employees}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      {job.type}
                    </span>
                  </div>

                  <p className="text-gray-700 mb-4 leading-relaxed">
                    {job.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.requirements.map((req, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                      >
                        {req}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-1" />
                      <span>{job.salary}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{job.posted}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 lg:mt-0 lg:ml-6 flex flex-col space-y-2">
                  <a
                    href={job.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                  >
                    Apply Now
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </a>
                  <button className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                    Save Job
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        {filteredJobs.length > 0 && (
          <div className="text-center mt-12">
            <button className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-300 transition-colors">
              Load More Jobs
            </button>
          </div>
        )}

        {/* No Results */}
        {filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No jobs found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search criteria or browse all available positions.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}