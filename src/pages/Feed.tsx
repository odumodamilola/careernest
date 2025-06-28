import { useEffect, useState, useCallback, useMemo } from 'react';
import { useFeedStore } from '../stores/feedStore';
import { CreatePostCard } from '../components/feed/CreatePostCard';
import { PostCard } from '../components/feed/PostCard';
import { useAuthStore } from '../stores/authStore';
import { 
  Briefcase, 
  BookOpen, 
  Users, 
  Award, 
  User, 
  BookmarkPlus, 
  Filter,
  RefreshCw,
  TrendingUp,
  Calendar,
  Bell
} from 'lucide-react';

const FEED_FILTERS = [
  { id: 'all', label: 'All Posts', icon: TrendingUp },
  { id: 'text', label: 'Updates', icon: User },
  { id: 'media', label: 'Media', icon: BookOpen },
  { id: 'job', label: 'Jobs', icon: Briefcase },
  { id: 'certificate', label: 'Achievements', icon: Award }
];

export function Feed() {
  const { user } = useAuthStore();
  const { 
    posts, 
    loading, 
    hasMore, 
    filters,
    fetchPosts, 
    setFilters, 
    clearFilters,
    refreshFeed 
  } = useFeedStore();
  
  const [activeFilter, setActiveFilter] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  // Initial load
  useEffect(() => {
    if (user) {
      fetchPosts({ page: 0, refresh: true });
    }
  }, [user, fetchPosts]);

  // Handle filter changes
  const handleFilterChange = useCallback(async (filterId: string) => {
    setActiveFilter(filterId);
    
    if (filterId === 'all') {
      clearFilters();
      await fetchPosts({ page: 0, refresh: true });
    } else {
      const newFilters = { type: filterId };
      setFilters(newFilters);
      await fetchPosts({ page: 0, refresh: true, filters: newFilters });
    }
  }, [setFilters, clearFilters, fetchPosts]);

  // Handle refresh
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await refreshFeed();
    } finally {
      setIsRefreshing(false);
    }
  }, [refreshFeed]);

  // Handle load more
  const handleLoadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    
    setLoadingMore(true);
    try {
      const currentPage = Math.floor(posts.length / 10);
      await fetchPosts({ 
        page: currentPage + 1, 
        filters: activeFilter !== 'all' ? { type: activeFilter } : undefined 
      });
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore, posts.length, fetchPosts, activeFilter]);

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop
        >= document.documentElement.offsetHeight - 1000
      ) {
        handleLoadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleLoadMore]);

  // Memoize filtered posts for performance
  const displayedPosts = useMemo(() => {
    return posts.filter(post => {
      if (activeFilter === 'all') return true;
      return post.type === activeFilter;
    });
  }, [posts, activeFilter]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Welcome to CareerNest</h2>
          <p className="text-gray-600">Please log in to view your feed</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      {/* Left Sidebar */}
      <aside className="hidden lg:col-span-3 lg:block">
        <div className="sticky top-24">
          <div className="card overflow-hidden">
            <div className="bg-gradient-to-r from-primary-600 to-primary-900 p-4 text-white">
              <h3 className="font-medium">Your Dashboard</h3>
            </div>
            <nav className="divide-y divide-gray-100" role="navigation" aria-label="Dashboard navigation">
              <a href="#" className="flex items-center px-4 py-3 hover:bg-gray-50 transition-colors">
                <User className="mr-3 h-5 w-5 text-gray-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">My Profile</p>
                  <p className="text-xs text-gray-500">View and edit your profile</p>
                </div>
              </a>
              <a href="#" className="flex items-center px-4 py-3 hover:bg-gray-50 transition-colors">
                <Briefcase className="mr-3 h-5 w-5 text-gray-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Job Applications</p>
                  <p className="text-xs text-gray-500">Track your applications</p>
                </div>
              </a>
              <a href="#" className="flex items-center px-4 py-3 hover:bg-gray-50 transition-colors">
                <BookOpen className="mr-3 h-5 w-5 text-gray-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">My Courses</p>
                  <p className="text-xs text-gray-500">Continue learning</p>
                </div>
              </a>
              <a href="#" className="flex items-center px-4 py-3 hover:bg-gray-50 transition-colors">
                <Users className="mr-3 h-5 w-5 text-gray-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Mentorship</p>
                  <p className="text-xs text-gray-500">Sessions and connections</p>
                </div>
              </a>
              <a href="#" className="flex items-center px-4 py-3 hover:bg-gray-50 transition-colors">
                <BookmarkPlus className="mr-3 h-5 w-5 text-gray-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Saved Items</p>
                  <p className="text-xs text-gray-500">Jobs, courses, and posts</p>
                </div>
              </a>
              <a href="#" className="flex items-center px-4 py-3 hover:bg-gray-50 transition-colors">
                <Award className="mr-3 h-5 w-5 text-gray-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Certificates</p>
                  <p className="text-xs text-gray-500">View achievements</p>
                </div>
              </a>
            </nav>
          </div>
        </div>
      </aside>

      {/* Main Feed */}
      <main className="lg:col-span-6">
        {/* Feed Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Your Feed</h1>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
              aria-label="Refresh feed"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 overflow-x-auto" aria-label="Feed filters">
              {FEED_FILTERS.map((filter) => {
                const Icon = filter.icon;
                return (
                  <button
                    key={filter.id}
                    onClick={() => handleFilterChange(filter.id)}
                    className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                      activeFilter === filter.id
                        ? 'border-primary-600 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                    aria-current={activeFilter === filter.id ? 'page' : undefined}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{filter.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Create Post */}
        <CreatePostCard />

        {/* Posts */}
        <div className="space-y-6">
          {loading && posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-primary-600"></div>
              <p className="mt-4 text-gray-500">Loading posts...</p>
            </div>
          ) : (
            <>
              {displayedPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}

              {/* Load More */}
              {hasMore && displayedPosts.length > 0 && (
                <div className="flex justify-center py-6">
                  <button
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors font-medium"
                  >
                    {loadingMore ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Loading...</span>
                      </div>
                    ) : (
                      'Load More Posts'
                    )}
                  </button>
                </div>
              )}

              {/* Empty State */}
              {displayedPosts.length === 0 && !loading && (
                <div className="card p-8 text-center">
                  <div className="text-gray-400 mb-4">
                    <TrendingUp className="h-16 w-16 mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {activeFilter === 'all' ? 'No posts yet' : `No ${FEED_FILTERS.find(f => f.id === activeFilter)?.label.toLowerCase()} found`}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {activeFilter === 'all' 
                      ? 'Follow mentors and connections to see their posts in your feed.'
                      : 'Try changing your filter or create a new post.'
                    }
                  </p>
                  <button 
                    onClick={() => handleFilterChange('all')}
                    className="btn-primary px-4 py-2"
                  >
                    {activeFilter === 'all' ? 'Discover People to Follow' : 'View All Posts'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Right Sidebar */}
      <aside className="hidden lg:col-span-3 lg:block">
        <div className="sticky top-24 space-y-4">
          {/* Trending Topics */}
          <div className="card p-4">
            <h3 className="font-medium text-gray-900 mb-3">Trending Topics</h3>
            <div className="space-y-2">
              {['#react', '#webdev', '#uxdesign', '#frontend', '#careeradvice'].map((tag) => (
                <a
                  key={tag}
                  href="#"
                  className="block text-sm text-primary-600 hover:text-primary-700 hover:underline"
                >
                  {tag}
                </a>
              ))}
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="card p-4">
            <h3 className="font-medium text-gray-900 mb-3 flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Upcoming Events
            </h3>
            <div className="space-y-3">
              <div className="text-sm">
                <p className="font-medium text-gray-900">Tech Career Fair</p>
                <p className="text-gray-500">Tomorrow, 2:00 PM</p>
              </div>
              <div className="text-sm">
                <p className="font-medium text-gray-900">UX Design Workshop</p>
                <p className="text-gray-500">Friday, 10:00 AM</p>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="card p-4">
            <h3 className="font-medium text-gray-900 mb-3 flex items-center">
              <Bell className="h-4 w-4 mr-2" />
              Recent Activity
            </h3>
            <div className="space-y-3">
              <div className="text-sm">
                <p className="text-gray-900">Sarah liked your post</p>
                <p className="text-gray-500">2 minutes ago</p>
              </div>
              <div className="text-sm">
                <p className="text-gray-900">New job match found</p>
                <p className="text-gray-500">1 hour ago</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}