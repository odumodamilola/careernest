import React, { useEffect, useState } from 'react';
import { useDynamicStore } from '../../stores/dynamicStore';
import { useAuthStore } from '../../stores/authStore';
import { PostCard } from '../feed/PostCard';
import { CreatePostCard } from '../feed/CreatePostCard';
import { Loader2, RefreshCw } from 'lucide-react';

export function DynamicFeed() {
  const { user } = useAuthStore();
  const { 
    posts, 
    loading, 
    fetchPosts, 
    initializeRealtime,
    createPost,
    likePost,
    addComment 
  } = useDynamicStore();
  
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (user) {
      initializeRealtime(user.id);
      loadPosts();
    }
  }, [user]);

  const loadPosts = async (pageNum = 0) => {
    try {
      await fetchPosts({ 
        limit: 10, 
        offset: pageNum * 10 
      });
      
      if (pageNum === 0) {
        setPage(0);
      }
    } catch (error) {
      console.error('Failed to load posts:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadPosts(0);
    setRefreshing(false);
  };

  const handleLoadMore = async () => {
    const nextPage = page + 1;
    await loadPosts(nextPage);
    setPage(nextPage);
  };

  const handleCreatePost = async (postData: any) => {
    await createPost(postData);
  };

  const handleLikePost = async (postId: string) => {
    await likePost(postId);
  };

  const handleAddComment = async (postId: string, content: string) => {
    await addComment(postId, content);
  };

  if (loading.posts && posts.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading posts...</span>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Create Post */}
      <CreatePostCard onCreatePost={handleCreatePost} />

      {/* Refresh Button */}
      <div className="flex justify-center">
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Posts */}
      <div className="space-y-6">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onLike={() => handleLikePost(post.id)}
            onComment={(content) => handleAddComment(post.id, content)}
          />
        ))}
      </div>

      {/* Load More */}
      {hasMore && posts.length > 0 && (
        <div className="flex justify-center py-6">
          <button
            onClick={handleLoadMore}
            disabled={loading.posts}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading.posts ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Loading...</span>
              </div>
            ) : (
              'Load More Posts'
            )}
          </button>
        </div>
      )}

      {/* Empty State */}
      {posts.length === 0 && !loading.posts && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
          <p className="text-gray-600">Be the first to share something with the community!</p>
        </div>
      )}
    </div>
  );
}