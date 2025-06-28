import { useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { formatDistance } from 'date-fns';
import { ThumbsUp, MessageSquare, Repeat, Share2, MoreHorizontal, Image, Send, Pin, Edit, Trash2, Flag, Bookmark } from 'lucide-react';
import { Post, Comment } from '../../types';
import { useFeedStore } from '../../stores/feedStore';
import { CommentItem } from './CommentItem';
import { useAuthStore } from '../../stores/authStore';

interface PostCardProps {
  post: Post;
  onLike?: () => void;
  onComment?: (content: string) => void;
  onShare?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onPin?: () => void;
  className?: string;
}

export function PostCard({ 
  post, 
  onLike, 
  onComment, 
  onShare, 
  onEdit, 
  onDelete, 
  onPin,
  className = ''
}: PostCardProps) {
  const { user } = useAuthStore();
  const { likePost, fetchComments, addComment } = useFeedStore();
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  
  // Memoize formatted time to prevent unnecessary re-renders
  const formattedTime = useMemo(() => {
    try {
      return formatDistance(new Date(post.createdAt), new Date(), {
        addSuffix: true,
      });
    } catch (error) {
      console.error('Invalid date format:', post.createdAt);
      return 'Unknown time';
    }
  }, [post.createdAt]);

  // Check if current user is the author
  const isAuthor = user?.id === post.author.id;
  const isAdmin = user?.role === 'admin';
  const canEdit = isAuthor || isAdmin;
  const canDelete = isAuthor || isAdmin;
  const canPin = isAdmin;

  const handleLike = useCallback(async () => {
    if (!user) {
      // Redirect to login or show auth modal
      return;
    }

    try {
      if (onLike) {
        onLike();
      } else {
        await likePost(post.id);
      }
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  }, [user, onLike, likePost, post.id]);
  
  const handleToggleComments = useCallback(async () => {
    if (!showComments && comments.length === 0) {
      setLoading(true);
      try {
        await fetchComments(post.id);
        const fetchedComments = useFeedStore.getState().comments[post.id] || [];
        setComments(fetchedComments);
      } catch (error) {
        console.error('Failed to fetch comments:', error);
      } finally {
        setLoading(false);
      }
    }
    setShowComments(!showComments);
  }, [showComments, comments.length, fetchComments, post.id]);
  
  const handleAddComment = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!commentText.trim() || !user) {
      return;
    }

    try {
      if (onComment) {
        onComment(commentText);
      } else {
        await addComment(post.id, commentText);
        const updatedComments = useFeedStore.getState().comments[post.id] || [];
        setComments(updatedComments);
      }
      setCommentText('');
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  }, [commentText, user, onComment, addComment, post.id]);

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  const handleShare = useCallback(() => {
    if (navigator.share) {
      navigator.share({
        title: `Post by ${post.author.fullName}`,
        text: post.content,
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
    
    if (onShare) {
      onShare();
    }
  }, [post.author.fullName, post.content, onShare]);

  // Sanitize content to prevent XSS
  const sanitizedContent = useMemo(() => {
    return post.content
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '');
  }, [post.content]);

  return (
    <article 
      className={`card mb-4 overflow-hidden animate-fade-in ${className}`}
      role="article"
      aria-labelledby={`post-${post.id}-title`}
    >
      <div className="p-4">
        {/* Post Header */}
        <header className="flex items-start justify-between mb-3">
          <div className="flex items-start space-x-3 flex-1 min-w-0">
            <Link 
              to={`/profile/${post.author.id}`} 
              className="flex-shrink-0"
              aria-label={`View ${post.author.fullName}'s profile`}
            >
              <img
                src={post.author.avatar || 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=150'}
                alt={`${post.author.fullName}'s avatar`}
                className="h-10 w-10 rounded-full object-cover ring-2 ring-gray-100"
                loading="lazy"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=150';
                }}
              />
            </Link>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <Link 
                  to={`/profile/${post.author.id}`} 
                  className="font-medium text-gray-900 hover:underline truncate"
                  id={`post-${post.id}-title`}
                >
                  {post.author.fullName}
                </Link>
                {post.author.isVerified && (
                  <span className="text-blue-500" aria-label="Verified user">
                    ✓
                  </span>
                )}
                {post.isPinned && (
                  <Pin className="h-4 w-4 text-yellow-500" aria-label="Pinned post" />
                )}
              </div>
              <p className="text-sm text-gray-500 truncate">
                {post.author.headline}
              </p>
              <time 
                className="text-xs text-gray-500" 
                dateTime={post.createdAt}
                title={new Date(post.createdAt).toLocaleString()}
              >
                {formattedTime}
              </time>
            </div>
          </div>
          
          {/* Post Menu */}
          <div className="relative">
            <button 
              className="text-gray-400 hover:text-gray-500 p-1 rounded-full hover:bg-gray-100"
              onClick={() => setShowMenu(!showMenu)}
              aria-label="Post options"
              aria-expanded={showMenu}
            >
              <MoreHorizontal size={20} />
            </button>
            
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border">
                <div className="py-1">
                  <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <Bookmark className="h-4 w-4 mr-2" />
                    Save Post
                  </button>
                  <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <Flag className="h-4 w-4 mr-2" />
                    Report
                  </button>
                  {canPin && (
                    <button 
                      onClick={onPin}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Pin className="h-4 w-4 mr-2" />
                      {post.isPinned ? 'Unpin' : 'Pin'} Post
                    </button>
                  )}
                  {canEdit && (
                    <button 
                      onClick={onEdit}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Post
                    </button>
                  )}
                  {canDelete && (
                    <button 
                      onClick={onDelete}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Post
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </header>
        
        {/* Post Content */}
        <div className="mb-3">
          <div 
            className="text-gray-900 whitespace-pre-line break-words"
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
          />
        </div>
        
        {/* Post Media */}
        {post.images && post.images.length > 0 && !imageError && (
          <div className="mb-3 rounded-lg overflow-hidden">
            <img
              src={post.images[0]}
              alt="Post attachment"
              className="w-full h-auto max-h-96 object-cover"
              loading="lazy"
              onError={handleImageError}
            />
          </div>
        )}
        
        {/* Post Type Badge */}
        {post.type === 'job' && (
          <div className="mb-3">
            <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
              Job Opportunity
            </span>
          </div>
        )}
        
        {post.type === 'certificate' && (
          <div className="mb-3">
            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
              Certificate Earned
            </span>
          </div>
        )}
        
        {/* Post Stats */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <div className="flex items-center space-x-1">
            {post.likesCount > 0 && (
              <>
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-100">
                  <ThumbsUp size={12} className="text-primary-600" />
                </div>
                <span>{post.likesCount}</span>
              </>
            )}
          </div>
          <div className="flex items-center space-x-4">
            {post.commentsCount > 0 && (
              <button 
                className="hover:underline"
                onClick={handleToggleComments}
                aria-label={`${post.commentsCount} comments`}
              >
                {post.commentsCount} comment{post.commentsCount !== 1 ? 's' : ''}
              </button>
            )}
            {post.sharesCount > 0 && (
              <span>{post.sharesCount} share{post.sharesCount !== 1 ? 's' : ''}</span>
            )}
          </div>
        </div>
        
        {/* Post Actions */}
        <div className="flex border-t border-gray-100 pt-3">
          <button
            className={`flex flex-1 items-center justify-center rounded-md py-1.5 text-sm font-medium transition-colors ${
              post.hasLiked
                ? 'text-primary-600 bg-primary-50'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
            onClick={handleLike}
            disabled={!user}
            aria-label={post.hasLiked ? 'Unlike post' : 'Like post'}
          >
            <ThumbsUp size={18} className="mr-2" />
            Like
          </button>
          <button
            className="flex flex-1 items-center justify-center rounded-md py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            onClick={handleToggleComments}
            aria-label="Comment on post"
          >
            <MessageSquare size={18} className="mr-2" />
            Comment
          </button>
          <button 
            className="flex flex-1 items-center justify-center rounded-md py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            onClick={handleShare}
            aria-label="Share post"
          >
            <Share2 size={18} className="mr-2" />
            Share
          </button>
        </div>
      </div>
      
      {/* Comments Section */}
      {showComments && (
        <section 
          className="border-t border-gray-100 bg-gray-50 p-4"
          aria-label="Comments"
        >
          {loading ? (
            <div className="flex justify-center py-4" role="status" aria-label="Loading comments">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-primary-600"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <CommentItem key={comment.id} comment={comment} />
              ))}
              
              {comments.length === 0 && (
                <p className="py-2 text-center text-sm text-gray-500">
                  No comments yet. Be the first to comment!
                </p>
              )}
              
              {/* Add Comment Form */}
              {user && (
                <form onSubmit={handleAddComment} className="mt-4 flex items-center space-x-2">
                  <img
                    src={user.avatar || 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=150'}
                    alt="Your avatar"
                    className="h-8 w-8 rounded-full object-cover"
                    loading="lazy"
                  />
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Add a comment..."
                      className="w-full rounded-full border border-gray-300 bg-white py-2 pl-4 pr-10 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                      maxLength={500}
                      aria-label="Add a comment"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-10 flex items-center pr-3 text-gray-400 hover:text-gray-500"
                      aria-label="Add image to comment"
                    >
                      <Image size={18} />
                    </button>
                  </div>
                  <button
                    type="submit"
                    disabled={!commentText.trim()}
                    className="rounded-full p-2 text-primary-600 hover:bg-primary-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Post comment"
                  >
                    <Send size={18} />
                  </button>
                </form>
              )}
            </div>
          )}
        </section>
      )}
    </article>
  );
}