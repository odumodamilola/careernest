import { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatDistance } from 'date-fns';
import { ThumbsUp, MessageSquare } from 'lucide-react';
import { Comment } from '../../types';
import { useFeedStore } from '../../stores/feedStore';

interface CommentItemProps {
  comment: Comment;
}

export function CommentItem({ comment }: CommentItemProps) {
  const { likeComment } = useFeedStore();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState('');
  
  const handleLike = () => {
    likeComment(comment.id);
  };
  
  const handleReply = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (replyText.trim()) {
      // Add reply logic would go here
      setReplyText('');
      setShowReplyForm(false);
    }
  };
  
  // Format comment time
  const commentTime = formatDistance(new Date(comment.createdAt), new Date(), {
    addSuffix: true,
  });
  
  return (
    <div className="animate-slide-up">
      <div className="flex space-x-3">
        <Link to={`/profile/${comment.author.id}`} className="flex-shrink-0">
          <img
            src={comment.author.avatar || 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=150'}
            alt={comment.author.fullName}
            className="h-8 w-8 rounded-full object-cover"
          />
        </Link>
        <div className="flex-1">
          <div className="rounded-lg bg-white px-4 py-2 shadow-sm">
            <div className="flex items-center justify-between">
              <Link to={`/profile/${comment.author.id}`} className="font-medium text-gray-900 hover:underline">
                {comment.author.fullName}
              </Link>
              <span className="text-xs text-gray-500">{commentTime}</span>
            </div>
            <p className="mt-1 text-gray-900">{comment.content}</p>
          </div>
          
          <div className="mt-1 flex items-center space-x-4 pl-4">
            <button
              className={`flex items-center space-x-1 text-xs ${
                comment.hasLiked ? 'text-primary-600' : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={handleLike}
            >
              <ThumbsUp size={12} />
              <span>{comment.likesCount > 0 ? comment.likesCount : ''} Like</span>
            </button>
            <button
              className="flex items-center space-x-1 text-xs text-gray-500 hover:text-gray-700"
              onClick={() => setShowReplyForm(!showReplyForm)}
            >
              <MessageSquare size={12} />
              <span>Reply</span>
            </button>
          </div>
          
          {showReplyForm && (
            <form onSubmit={handleReply} className="mt-2 flex items-center space-x-2 pl-4">
              <img
                src="https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=150"
                alt="Your avatar"
                className="h-6 w-6 rounded-full object-cover"
              />
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a reply..."
                className="flex-1 rounded-full border border-gray-300 bg-white py-1 px-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
              <button
                type="submit"
                disabled={!replyText.trim()}
                className="rounded-full bg-primary-600 px-3 py-1 text-xs font-medium text-white hover:bg-primary-700 disabled:opacity-50"
              >
                Reply
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}