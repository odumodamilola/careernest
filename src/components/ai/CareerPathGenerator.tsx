import React, { useState } from 'react';
import { Target, TrendingUp, Clock, Award, BookOpen, Users, Zap, ArrowRight, CheckCircle } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

interface CareerPath {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  stages: CareerStage[];
  skills: string[];
  averageSalary: string;
  jobGrowth: string;
  topCompanies: string[];
}

interface CareerStage {
  title: string;
  duration: string;
  skills: string[];
  milestones: string[];
  averageSalary: string;
}

export function CareerPathGenerator() {
  const { user } = useAuthStore();
  const [selectedPath, setSelectedPath] = useState<CareerPath | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPaths, setGeneratedPaths] = useState<CareerPath[]>([]);

  const generateCareerPaths = async () => {
    setIsGenerating(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const paths: CareerPath[] = [
      {
        id: '1',
        title: 'Full-Stack Software Developer',
        description: 'Master both frontend and backend development to build complete web applications',
        duration: '18-24 months',
        difficulty: 'intermediate',
        averageSalary: '$85,000 - $150,000',
        jobGrowth: '+22% (Much faster than average)',
        topCompanies: ['Google', 'Microsoft', 'Amazon', 'Meta', 'Netflix'],
        skills: ['JavaScript', 'React', 'Node.js', 'Databases', 'Cloud Platforms'],
        stages: [
          {
            title: 'Frontend Developer',
            duration: '6-8 months',
            skills: ['HTML/CSS', 'JavaScript', 'React', 'TypeScript'],
            milestones: ['Build 3 responsive websites', 'Master React hooks', 'Deploy to production'],
            averageSalary: '$65,000 - $95,000'
          },
          {
            title: 'Backend Developer',
            duration: '6-8 months',
            skills: ['Node.js', 'Express', 'Databases', 'APIs', 'Authentication'],
            milestones: ['Build REST APIs', 'Database design', 'Security implementation'],
            averageSalary: '$70,000 - $105,000'
          },
          {
            title: 'Full-Stack Developer',
            duration: '6-8 months',
            skills: ['System Design', 'DevOps', 'Testing', 'Performance'],
            milestones: ['End-to-end applications', 'CI/CD pipelines', 'Scalable architecture'],
            averageSalary: '$85,000 - $150,000'
          }
        ]
      },
      {
        id: '2',
        title: 'Data Science Specialist',
        description: 'Analyze data to drive business decisions and build predictive models',
        duration: '12-18 months',
        difficulty: 'advanced',
        averageSalary: '$95,000 - $180,000',
        jobGrowth: '+31% (Much faster than average)',
        topCompanies: ['Netflix', 'Uber', 'Airbnb', 'Tesla', 'Spotify'],
        skills: ['Python', 'Machine Learning', 'Statistics', 'SQL', 'Data Visualization'],
        stages: [
          {
            title: 'Data Analyst',
            duration: '4-6 months',
            skills: ['SQL', 'Excel', 'Tableau', 'Statistics'],
            milestones: ['Data cleaning', 'Basic visualizations', 'Business insights'],
            averageSalary: '$60,000 - $85,000'
          },
          {
            title: 'Data Scientist',
            duration: '6-8 months',
            skills: ['Python', 'Machine Learning', 'Pandas', 'Scikit-learn'],
            milestones: ['Predictive models', 'A/B testing', 'Feature engineering'],
            averageSalary: '$85,000 - $130,000'
          },
          {
            title: 'Senior Data Scientist',
            duration: '4-6 months',
            skills: ['Deep Learning', 'MLOps', 'Big Data', 'Leadership'],
            milestones: ['Production ML systems', 'Team leadership', 'Strategic impact'],
            averageSalary: '$120,000 - $180,000'
          }
        ]
      },
      {
        id: '3',
        title: 'UX/UI Designer',
        description: 'Create intuitive and beautiful user experiences for digital products',
        duration: '12-15 months',
        difficulty: 'beginner',
        averageSalary: '$70,000 - $130,000',
        jobGrowth: '+13% (Faster than average)',
        topCompanies: ['Apple', 'Figma', 'Adobe', 'Airbnb', 'Spotify'],
        skills: ['Figma', 'User Research', 'Prototyping', 'Design Systems', 'Usability Testing'],
        stages: [
          {
            title: 'UI Designer',
            duration: '4-5 months',
            skills: ['Figma', 'Design Principles', 'Typography', 'Color Theory'],
            milestones: ['Design portfolio', 'Mobile interfaces', 'Design systems'],
            averageSalary: '$50,000 - $75,000'
          },
          {
            title: 'UX Designer',
            duration: '5-6 months',
            skills: ['User Research', 'Wireframing', 'Prototyping', 'Usability Testing'],
            milestones: ['User journey maps', 'Research studies', 'Interaction design'],
            averageSalary: '$65,000 - $95,000'
          },
          {
            title: 'Senior UX/UI Designer',
            duration: '3-4 months',
            skills: ['Design Strategy', 'Leadership', 'Business Impact', 'Mentoring'],
            milestones: ['Design leadership', 'Cross-team collaboration', 'Product strategy'],
            averageSalary: '$90,000 - $130,000'
          }
        ]
      }
    ];

    setGeneratedPaths(paths);
    setIsGenerating(false);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6 rounded-t-lg">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white bg-opacity-20 rounded-full">
            <Target className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">AI Career Path Generator</h2>
            <p className="text-green-100">Personalized career roadmaps based on your goals and market trends</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Generate Button */}
        {generatedPaths.length === 0 && (
          <div className="text-center py-8">
            <div className="mb-6">
              <div className="p-4 bg-gradient-to-r from-green-100 to-blue-100 rounded-full w-fit mx-auto mb-4">
                <Target className="h-12 w-12 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Discover Your Perfect Career Path
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Our AI analyzes your skills, interests, and market trends to generate personalized career roadmaps
              </p>
            </div>
            
            <button
              onClick={generateCareerPaths}
              disabled={isGenerating}
              className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-3 rounded-lg hover:from-green-700 hover:to-blue-700 disabled:opacity-50 transition-all font-medium flex items-center space-x-2 mx-auto"
            >
              <Target className="h-5 w-5" />
              <span>{isGenerating ? 'Generating Paths...' : 'Generate Career Paths'}</span>
            </button>
          </div>
        )}

        {/* Loading State */}
        {isGenerating && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Analysis in Progress</h3>
            <div className="space-y-2 text-sm text-gray-500">
              <div>🔍 Analyzing your current skills and experience</div>
              <div>📊 Researching market trends and opportunities</div>
              <div>🎯 Generating personalized career roadmaps</div>
              <div>💡 Calculating optimal learning paths</div>
            </div>
          </div>
        )}

        {/* Generated Paths */}
        {generatedPaths.length > 0 && !selectedPath && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Your Personalized Career Paths
              </h3>
              <p className="text-gray-600">
                Based on your profile, here are the most promising career paths for you
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {generatedPaths.map((path) => (
                <div
                  key={path.id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setSelectedPath(path)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <h4 className="font-semibold text-gray-900 text-lg">{path.title}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(path.difficulty)}`}>
                      {path.difficulty}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4">{path.description}</p>
                  
                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium">{path.duration}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Salary Range:</span>
                      <span className="font-medium text-green-600">{path.averageSalary}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Job Growth:</span>
                      <span className="font-medium text-blue-600">{path.jobGrowth}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="text-xs text-gray-600 mb-2">Key Skills:</div>
                    <div className="flex flex-wrap gap-1">
                      {path.skills.slice(0, 3).map((skill, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {skill}
                        </span>
                      ))}
                      {path.skills.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{path.skills.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  <button className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-2 px-4 rounded-lg hover:from-green-700 hover:to-blue-700 transition-all font-medium flex items-center justify-center space-x-2">
                    <span>View Detailed Path</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Detailed Path View */}
        {selectedPath && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-900">{selectedPath.title}</h3>
              <button
                onClick={() => setSelectedPath(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ← Back to all paths
              </button>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border border-green-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{selectedPath.duration}</div>
                  <div className="text-sm text-gray-600">Total Duration</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{selectedPath.averageSalary}</div>
                  <div className="text-sm text-gray-600">Salary Range</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{selectedPath.jobGrowth}</div>
                  <div className="text-sm text-gray-600">Job Growth</div>
                </div>
              </div>
            </div>

            {/* Career Stages */}
            <div className="space-y-6">
              <h4 className="text-xl font-semibold text-gray-900 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Career Progression Stages
              </h4>
              
              {selectedPath.stages.map((stage, index) => (
                <div key={index} className="relative">
                  {index < selectedPath.stages.length - 1 && (
                    <div className="absolute left-6 top-16 w-0.5 h-16 bg-gray-300"></div>
                  )}
                  
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                        {index + 1}
                      </div>
                    </div>
                    
                    <div className="flex-1 bg-white border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h5 className="text-lg font-semibold text-gray-900">{stage.title}</h5>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                              <Clock className="h-4 w-4" />
                              <span>{stage.duration}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Award className="h-4 w-4" />
                              <span>{stage.averageSalary}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h6 className="font-medium text-gray-900 mb-2">Skills to Master:</h6>
                          <div className="space-y-1">
                            {stage.skills.map((skill, skillIndex) => (
                              <div key={skillIndex} className="flex items-center space-x-2 text-sm">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <span>{skill}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h6 className="font-medium text-gray-900 mb-2">Key Milestones:</h6>
                          <div className="space-y-1">
                            {stage.milestones.map((milestone, milestoneIndex) => (
                              <div key={milestoneIndex} className="flex items-center space-x-2 text-sm">
                                <Target className="h-4 w-4 text-blue-500" />
                                <span>{milestone}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Top Companies */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Top Hiring Companies
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedPath.topCompanies.map((company, index) => (
                  <span key={index} className="px-3 py-1 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700">
                    {company}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 px-6 rounded-lg hover:from-green-700 hover:to-blue-700 transition-all font-medium flex items-center justify-center space-x-2">
                <BookOpen className="h-5 w-5" />
                <span>Start Learning Path</span>
              </button>
              <button className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center justify-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Find Mentors</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}