import { useEffect } from 'react';
import { useFeedStore } from '../stores/feedStore';
import { CreatePostCard } from '../components/feed/CreatePostCard';
import { PostCard } from '../components/feed/PostCard';
import { Briefcase, BookOpen, Users, Award, User, BookmarkPlus } from 'lucide-react';

export function Feed() {
  const { posts, loading, fetchPosts } = useFeedStore();

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      {/* Left Sidebar */}
      <div className="hidden lg:col-span-3 lg:block">
        <div className="sticky top-24">
          <div className="card overflow-hidden">
            <div className="bg-gradient-to-r from-primary-600 to-primary-900 p-4 text-white">
              <h3 className="font-medium">Your Dashboard</h3>
            </div>
            <div className="divide-y divide-gray-100">
              <a href="#" className="flex items-center px-4 py-3 hover:bg-gray-50">
                <User className="mr-3 h-5 w-5 text-gray-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">My Profile</p>
                  <p className="text-xs text-gray-500">View and edit your profile</p>
                </div>
              </a>
              <a href="#" className="flex items-center px-4 py-3 hover:bg-gray-50">
                <Briefcase className="mr-3 h-5 w-5 text-gray-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Job Applications</p>
                  <p className="text-xs text-gray-500">Track your job applications</p>
                </div>
              </a>
              <a href="#" className="flex items-center px-4 py-3 hover:bg-gray-50">
                <BookOpen className="mr-3 h-5 w-5 text-gray-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">My Courses</p>
                  <p className="text-xs text-gray-500">Continue learning</p>
                </div>
              </a>
              <a href="#" className="flex items-center px-4 py-3 hover:bg-gray-50">
                <Users className="mr-3 h-5 w-5 text-gray-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Mentorship Sessions</p>
                  <p className="text-xs text-gray-500">Upcoming and past sessions</p>
                </div>
              </a>
              <a href="#" className="flex items-center px-4 py-3 hover:bg-gray-50">
                <BookmarkPlus className="mr-3 h-5 w-5 text-gray-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Saved Items</p>
                  <p className="text-xs text-gray-500">Jobs, courses, and posts</p>
                </div>
              </a>
              <a href="#" className="flex items-center px-4 py-3 hover:bg-gray-50">
                <Award className="mr-3 h-5 w-5 text-gray-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Certificates</p>
                  <p className="text-xs text-gray-500">View your achievements</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Feed */}
      <div className="lg:col-span-6">
        <CreatePostCard />

        {loading && posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-primary-600"></div>
            <p className="mt-4 text-gray-500">Loading posts...</p>
          </div>
        ) : (
          <>
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}

            {posts.length === 0 && !loading && (
              <div className="card p-8 text-center">
                <h3 className="text-lg font-medium text-gray-900">No posts yet</h3>
                <p className="mt-2 text-gray-500">
                  Follow mentors and connections to see their posts in your feed.
                </p>
                <button className="mt-4 rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700">
                  Discover People to Follow
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Right Sidebar */}
      <div className="hidden lg:col-span-3 lg:block">
        <div className="sticky top-24 space-y-4">
          <div className="card overflow-hidden">
            <div className="bg-gradient-to-r from-teal-600 to-teal-800 p-4 text-white">
              <h3 className="font-medium">Recommended Mentors</h3>
            </div>
            <div className="divide-y divide-gray-100">
              <div className="flex items-center px-4 py-3">
                <img
                  src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=150"
                  alt="Sarah Johnson"
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900">Sarah Johnson</p>
                  <p className="text-xs text-gray-500">UX Designer | 4.9 ★</p>
                </div>
                <button className="rounded-md border border-primary-600 px-2 py-1 text-xs font-medium text-primary-600 hover:bg-primary-50">
                  Connect
                </button>
              </div>
              <div className="flex items-center px-4 py-3">
                <img
                  src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=150"
                  alt="Michael Chen"
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900">Michael Chen</p>
                  <p className="text-xs text-gray-500">Backend Engineer | 4.8 ★</p>
                </div>
                <button className="rounded-md border border-primary-600 px-2 py-1 text-xs font-medium text-primary-600 hover:bg-primary-50">
                  Connect
                </button>
              </div>
              <a href="#" className="block px-4 py-2 text-center text-sm text-primary-600 hover:bg-gray-50">
                View all mentors →
              </a>
            </div>
          </div>

          <div className="card overflow-hidden">
            <div className="bg-gradient-to-r from-accent-600 to-accent-800 p-4 text-white">
              <h3 className="font-medium">Featured Jobs</h3>
            </div>
            <div className="divide-y divide-gray-100">
              <a href="#" className="block px-4 py-3 hover:bg-gray-50">
                <p className="text-sm font-medium text-gray-900">Senior Frontend Developer</p>
                <p className="text-xs text-gray-500">TechCorp | Remote</p>
                <p className="mt-1 text-xs text-gray-500">Posted 2 days ago</p>
              </a>
              <a href="#" className="block px-4 py-3 hover:bg-gray-50">
                <p className="text-sm font-medium text-gray-900">UX/UI Designer</p>
                <p className="text-xs text-gray-500">DesignHub | New York</p>
                <p className="mt-1 text-xs text-gray-500">Posted 3 days ago</p>
              </a>
              <a href="#" className="block px-4 py-2 text-center text-sm text-primary-600 hover:bg-gray-50">
                View all jobs →
              </a>
            </div>
          </div>

          <div className="card p-4">
            <h3 className="font-medium text-gray-900">Trending Topics</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              <a href="#" className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-800 hover:bg-gray-200">
                #react
              </a>
              <a href="#" className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-800 hover:bg-gray-200">
                #webdev
              </a>
              <a href="#" className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-800 hover:bg-gray-200">
                #uxdesign
              </a>
              <a href="#" className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-800 hover:bg-gray-200">
                #frontend
              </a>
              <a href="#" className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-800 hover:bg-gray-200">
                #careeradvice
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}