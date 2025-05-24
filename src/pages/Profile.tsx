import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { formatDistance } from 'date-fns';
import {
  MapPin,
  Globe,
  Briefcase,
  GraduationCap,
  Award,
  Languages,
  Heart,
  Users,
  MessageSquare,
  Calendar,
  Edit,
  Plus,
  ExternalLink,
  Github,
  Linkedin,
  Twitter,
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useFeedStore } from '../stores/feedStore';
import { PostCard } from '../components/feed/PostCard';
import { EditProfileModal } from '../components/profile/EditProfileModal';
import { AddExperienceModal } from '../components/profile/AddExperienceModal';
import { AddEducationModal } from '../components/profile/AddEducationModal';
import { AddCertificateModal } from '../components/profile/AddCertificateModal';

interface ProfileData {
  posts: Post[];
  experiences: Experience[];
  education: Education[];
  certificates: Certificate[];
}

interface Post {
  id: string;
  content: string;
  // ... other post properties
}

export function Profile() {
  const { id } = useParams();
  const { user: currentUser } = useAuthStore();
  const { posts, fetchPosts } = useFeedStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<ProfileData>({
    posts: [],
    experiences: [],
    education: [],
    certificates: []
  });
  const [activeTab, setActiveTab] = useState<'posts' | 'about' | 'experience' | 'education'>('posts');
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showAddExperience, setShowAddExperience] = useState(false);
  const [showAddEducation, setShowAddEducation] = useState(false);
  const [showAddCertificate, setShowAddCertificate] = useState(false);

  // In a real app, we would fetch the profile data if id !== currentUser.id
  const user = currentUser;
  const isOwnProfile = !id || id === currentUser?.id;

  useEffect(() => {
    const loadUserPosts = async () => {
      try {
        setIsLoading(true);
        const userPosts = await fetchPosts({ userId: id });
        setProfileData(prev => ({ ...prev, posts: userPosts || [] }));
      } catch (err) {
        setError(err?.message || 'Failed to load posts');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      loadUserPosts();
    }
  }, [id, fetchPosts]);

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-md">
        {error}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-4 flex justify-center">
        <span>Loading profile...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      {/* Cover Image */}
      <div className="relative h-64 bg-gradient-to-r from-primary-600 to-primary-900 rounded-b-lg overflow-hidden">
        {user?.coverImage && (
          <img
            src={user.coverImage}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        )}
        {isOwnProfile && (
          <button
            className="absolute top-4 right-4 bg-white bg-opacity-90 rounded-full p-2 text-gray-700 hover:bg-opacity-100"
            onClick={() => setShowEditProfile(true)}
          >
            <Edit size={20} />
          </button>
        )}
      </div>

      {/* Profile Header */}
      <div className="relative px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end -mt-16 sm:-mt-20 mb-4 sm:mb-6">
          {/* Avatar */}
          <div className="relative inline-block flex-shrink-0">
            <img
              src={user?.avatar || 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=150'}
              alt={user?.fullName}
              className="h-32 w-32 sm:h-40 sm:w-40 rounded-full border-4 border-white object-cover"
            />
            {user?.isVerified && (
              <div className="absolute bottom-2 right-2 bg-primary-600 text-white rounded-full p-1">
                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>

          {/* Profile Info */}
          <div className="mt-6 sm:mt-0 sm:ml-6 flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{user?.fullName}</h1>
                <p className="text-lg text-gray-600">{user?.headline}</p>
              </div>
              
              {!isOwnProfile && (
                <div className="mt-4 sm:mt-0 flex space-x-3">
                  <button
                    onClick={() => {}}
                    className="btn-primary px-4 py-2"
                  >
                    Follow
                  </button>
                  <button
                    onClick={() => {}}
                    className="btn-outline px-4 py-2"
                  >
                    Message
                  </button>
                  {user?.role === 'mentor' && (
                    <button
                      onClick={() => {}}
                      className="btn-secondary px-4 py-2"
                    >
                      Schedule Session
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-500">
              {user?.location && (
                <div className="flex items-center">
                  <MapPin size={16} className="mr-1" />
                  {user.location}
                </div>
              )}
              {user?.website && (
                <a
                  href={user.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center hover:text-primary-600"
                >
                  <Globe size={16} className="mr-1" />
                  Website
                  <ExternalLink size={12} className="ml-1" />
                </a>
              )}
              {user?.socialLinks?.github && (
                <a
                  href={user.socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center hover:text-primary-600"
                >
                  <Github size={16} className="mr-1" />
                  GitHub
                </a>
              )}
              {user?.socialLinks?.linkedin && (
                <a
                  href={user.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center hover:text-primary-600"
                >
                  <Linkedin size={16} className="mr-1" />
                  LinkedIn
                </a>
              )}
              {user?.socialLinks?.twitter && (
                <a
                  href={user.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center hover:text-primary-600"
                >
                  <Twitter size={16} className="mr-1" />
                  Twitter
                </a>
              )}
            </div>

            {/* Stats */}
            <div className="mt-6 flex flex-wrap gap-4 text-sm">
              <div className="flex items-center">
                <Users size={16} className="mr-1 text-gray-500" />
                <span className="font-medium">{user?.stats?.followers || 0}</span>
                <span className="ml-1 text-gray-500">followers</span>
              </div>
              <div className="flex items-center">
                <Heart size={16} className="mr-1 text-gray-500" />
                <span className="font-medium">{user?.stats?.following || 0}</span>
                <span className="ml-1 text-gray-500">following</span>
              </div>
              <div className="flex items-center">
                <MessageSquare size={16} className="mr-1 text-gray-500" />
                <span className="font-medium">{user?.stats?.posts || 0}</span>
                <span className="ml-1 text-gray-500">posts</span>
              </div>
              {user?.role === 'mentor' && (
                <div className="flex items-center">
                  <Calendar size={16} className="mr-1 text-gray-500" />
                  <span className="font-medium">{user?.stats?.mentorshipSessions || 0}</span>
                  <span className="ml-1 text-gray-500">sessions</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bio */}
        {user?.bio && (
          <div className="mt-6">
            <p className="text-gray-700 whitespace-pre-line">{user.bio}</p>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="mt-8 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('posts')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'posts'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Posts
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'about'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              About
            </button>
            <button
              onClick={() => setActiveTab('experience')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'experience'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Experience
            </button>
            <button
              onClick={() => setActiveTab('education')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'education'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Education
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === 'posts' && (
            <div className="space-y-4">
              {profileData.posts?.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}

          {activeTab === 'about' && (
            <div className="space-y-8">
              {/* Skills */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Skills</h3>
                  {isOwnProfile && (
                    <button
                      onClick={() => setShowEditProfile(true)}
                      className="text-sm text-primary-600 hover:text-primary-700"
                    >
                      <Edit size={16} />
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {user?.skills?.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Languages */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Languages</h3>
                  {isOwnProfile && (
                    <button
                      onClick={() => setShowEditProfile(true)}
                      className="text-sm text-primary-600 hover:text-primary-700"
                    >
                      <Edit size={16} />
                    </button>
                  )}
                </div>
                <div className="space-y-2">
                  {user?.languages?.map((language) => (
                    <div
                      key={language.name}
                      className="flex items-center justify-between"
                    >
                      <span className="text-gray-700">{language.name}</span>
                      <span className="text-sm text-gray-500 capitalize">
                        {language.level}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interests */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Interests</h3>
                  {isOwnProfile && (
                    <button
                      onClick={() => setShowEditProfile(true)}
                      className="text-sm text-primary-600 hover:text-primary-700"
                    >
                      <Edit size={16} />
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {user?.interests?.map((interest) => (
                    <span
                      key={interest}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'experience' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900">Work Experience</h3>
                {isOwnProfile && (
                  <button
                    onClick={() => setShowAddExperience(true)}
                    className="btn-outline px-3 py-1"
                  >
                    <Plus size={16} className="mr-1" />
                    Add Experience
                  </button>
                )}
              </div>
              <div className="space-y-6">
                {user?.experience?.map((exp) => (
                  <div key={exp.id} className="flex">
                    <div className="flex-shrink-0 mr-4">
                      <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                        <Briefcase className="h-6 w-6 text-gray-500" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">
                        {exp.title}
                      </h4>
                      <p className="text-gray-600">{exp.company}</p>
                      <p className="text-sm text-gray-500">
                        {formatDistance(new Date(exp.startDate), new Date(), {
                          addSuffix: true,
                        })}
                        {exp.current
                          ? ' - Present'
                          : ` - ${formatDistance(new Date(exp.endDate!), new Date(), {
                              addSuffix: true,
                            })}`}
                      </p>
                      {exp.description && (
                        <p className="mt-2 text-gray-700">{exp.description}</p>
                      )}
                      {exp.skills && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {exp.skills.map((skill) => (
                            <span
                              key={skill}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'education' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900">Education</h3>
                {isOwnProfile && (
                  <button
                    onClick={() => setShowAddEducation(true)}
                    className="btn-outline px-3 py-1"
                  >
                    <Plus size={16} className="mr-1" />
                    Add Education
                  </button>
                )}
              </div>
              <div className="space-y-6">
                {user?.education?.map((edu) => (
                  <div key={edu.id} className="flex">
                    <div className="flex-shrink-0 mr-4">
                      <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                        <GraduationCap className="h-6 w-6 text-gray-500" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">
                        {edu.school}
                      </h4>
                      <p className="text-gray-600">
                        {edu.degree} • {edu.field}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDistance(new Date(edu.startDate), new Date(), {
                          addSuffix: true,
                        })}
                        {edu.current
                          ? ' - Present'
                          : ` - ${formatDistance(new Date(edu.endDate!), new Date(), {
                              addSuffix: true,
                            })}`}
                      </p>
                      {edu.description && (
                        <p className="mt-2 text-gray-700">{edu.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showEditProfile && (
        <EditProfileModal 
          onClose={() => setShowEditProfile(false)} 
          user={currentUser} 
        />
      )}
      {showAddExperience && (
        <AddExperienceModal
          onClose={() => setShowAddExperience(false)}
        />
      )}
      {showAddEducation && (
        <AddEducationModal
          onClose={() => setShowAddEducation(false)}
        />
      )}
      {showAddCertificate && (
        <AddCertificateModal
          onClose={() => setShowAddCertificate(false)}
        />
      )}
    </div>
  );
}