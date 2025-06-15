import { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatDistance } from 'date-fns';
import { ThumbsUp, MessageSquare, Repeat, Share2, MoreHorizontal, Image, Send } from 'lucide-react';
import { Post, Comment } from '../../types';
import { useFeedStore } from '../../stores/feedStore';
import { CommentItem } from './CommentItem';

interface PostCardProps {
  post: Post;
  onLike?: () => void;
  onComment?: (content: string) => void;
}

export function PostCard({ post, onLike, onComment }: PostCardProps) {
  const { likePost, fetchComments, addComment } = useFeedStore();
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  
  const handleLike = () => {
    if (onLike) {
      onLike();
    } else {
      likePost(post.id);
    }
  };
  
  const handleToggleComments = async () => {
    if (!showComments && comments.length === 0) {
      setLoading(true);
      await fetchComments(post.id);
      
      // Simulating getting comments from the store
      const fetchedComments = useFeedStore.getState().comments[post.id] || [];
      setComments(fetchedComments);
      setLoading(false);
    }
    
    setShowComments(!showComments);
  };
  
  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (commentText.trim()) {
      if (onComment) {
        onComment(commentText);
      } else {
        await addComment(post.id, commentText);
        
        // Refresh comments
        const updatedComments = useFeedStore.getState().comments[post.id] || [];
        setComments(updatedComments);
      }
      
      setCommentText('');
    }
  };
  
  // Format post time
  const postTime = formatDistance(new Date(post.createdAt), new Date(), {
    addSuffix: true,
  });
  
  return (
    <div className="card mb-4 overflow-hidden animate-fade-in">
      <div className="p-4">
        {/* Post Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <Link to={`/profile/${post.author.id}`} className="flex-shrink-0">
              <img
                src={post.author.avatar || 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=150'}
                alt={post.author.fullName}
                className="h-10 w-10 rounded-full object-cover"
              />
            </Link>
            <div>
              <Link to={`/profile/${post.author.id}`} className="font-medium text-gray-900 hover:underline">
                {post.author.fullName}
              </Link>
              <p className="text-sm text-gray-500">
                {post.author.headline}
              </p>
              <p className="text-xs text-gray-500">{postTime}</p>
            </div>
          </div>
          <button className="text-gray-400 hover:text-gray-500">
            <MoreHorizontal size={20} />
          </button>
        </div>
        
        {/* Post Content */}
        <div className="mt-3">
          <p className="text-gray-900 whitespace-pre-line">{post.content}</p>
        </div>
        
        {/* Post Media */}
        {post.images && post.images.length > 0 && (
          <div className="mt-3 rounded-lg overflow-hidden">
            <img
              src={post.images[0]}
              alt="Post attachment"
              className="w-full h-auto max-h-96 object-cover"
            />
          </div>
        )}
        
        {/* Post Tags */}
        {post.type === 'job' && (
          <div className="mt-3">
            <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
              Job Opportunity
            </span>
          </div>
        )}
        
        {post.type === 'certificate' && (
          <div className="mt-3">
            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
              Certificate Earned
            </span>
          </div>
        )}
        
        {/* Post Stats */}
        <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-100">
              <ThumbsUp size={12} className="text-primary-600" />
            </div>
            <span>{post.likesCount > 0 ? post.likesCount : ''}</span>
          </div>
          <div>
            {post.commentsCount > 0 && (
              <button 
                className="hover:underline"
                onClick={handleToggleComments}
              >
                {post.commentsCount} comments
              </button>
            )}
          </div>
        </div>
        
        {/* Post Actions */}
        <div className="mt-3 flex border-t border-gray-100 pt-3">
          <button
            className={`flex flex-1 items-center justify-center rounded-md py-1.5 text-sm font-medium ${
              post.hasLiked
                ? 'text-primary-600'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
            onClick={handleLike}
          >
            <ThumbsUp size={18} className="mr-2" />
            Like
          </button>
          <button
            className="flex flex-1 items-center justify-center rounded-md py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            onClick={handleToggleComments}
          >
            <MessageSquare size={18} className="mr-2" />
            Comment
          </button>
          <button className="flex flex-1 items-center justify-center rounded-md py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900">
            <Repeat size={18} className="mr-2" />
            Repost
          </button>
          <button className="flex flex-1 items-center justify-center rounded-md py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900">
            <Share2 size={18} className="mr-2" />
            Share
          </button>
        </div>
      </div>
      
      {/* Comments Section */}
      {showComments && (
        <div className="border-t border-gray-100 bg-gray-50 p-4">
          {loading ? (
            <div className="flex justify-center py-4">
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
              <form onSubmit={handleAddComment} className="mt-4 flex items-center space-x-2">
                <img
                  src="https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=150"
                  alt="Your avatar"
                  className="h-8 w-8 rounded-full object-cover"
                />
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Add a comment..."
                    className="w-full rounded-full border border-gray-300 bg-white py-2 pl-4 pr-10 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-10 flex items-center pr-3 text-gray-400 hover:text-gray-500"
                  >
                    <Image size={18} />
                  </button>
                </div>
                <button
                  type="submit"
                  disabled={!commentText.trim()}
                  className="rounded-full p-2 text-primary-600 hover:bg-primary-50 disabled:opacity-50"
                >
                  <Send size={18} />
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
}