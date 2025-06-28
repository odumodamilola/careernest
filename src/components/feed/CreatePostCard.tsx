import { useState, useCallback, useRef } from 'react';
import { Image, FileText, Link2, Globe, Users, MessageCircle, X, AlertCircle } from 'lucide-react';
import { useFeedStore } from '../../stores/feedStore';
import { useAuthStore } from '../../stores/authStore';

interface CreatePostCardProps {
  onCreatePost?: (postData: any) => Promise<void>;
  className?: string;
}

const MAX_CONTENT_LENGTH = 2000;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

export function CreatePostCard({ onCreatePost, className = '' }: CreatePostCardProps) {
  const { user } = useAuthStore();
  const { createPost } = useFeedStore();
  const [content, setContent] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [visibility, setVisibility] = useState<'public' | 'followers' | 'mentors' | 'private'>('public');
  const [selectedMedia, setSelectedMedia] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const validateFile = useCallback((file: File): string | null => {
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return `File type ${file.type} is not supported. Please use JPEG, PNG, GIF, or WebP.`;
    }
    
    if (file.size > MAX_FILE_SIZE) {
      return `File size must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB.`;
    }
    
    return null;
  }, []);
  
  const handleMediaSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    const newErrors: string[] = [];
    const validFiles: File[] = [];
    const newPreviewUrls: string[] = [];
    
    Array.from(files).forEach(file => {
      const error = validateFile(file);
      if (error) {
        newErrors.push(error);
      } else {
        validFiles.push(file);
        newPreviewUrls.push(URL.createObjectURL(file));
      }
    });
    
    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setSelectedMedia(prev => [...prev, ...validFiles]);
    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
    setErrors([]);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [validateFile]);
  
  const removeMedia = useCallback((index: number) => {
    setSelectedMedia(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => {
      const newUrls = prev.filter((_, i) => i !== index);
      // Revoke the URL to free memory
      URL.revokeObjectURL(prev[index]);
      return newUrls;
    });
  }, []);
  
  const validateContent = useCallback((): string[] => {
    const validationErrors: string[] = [];
    
    if (!content.trim() && selectedMedia.length === 0) {
      validationErrors.push('Please add some content or media to your post.');
    }
    
    if (content.length > MAX_CONTENT_LENGTH) {
      validationErrors.push(`Content must be less than ${MAX_CONTENT_LENGTH} characters.`);
    }
    
    // Basic XSS prevention
    if (content.includes('<script>') || content.includes('javascript:')) {
      validationErrors.push('Content contains potentially harmful code.');
    }
    
    return validationErrors;
  }, [content, selectedMedia.length]);
  
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateContent();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    if (!user) {
      setErrors(['You must be logged in to create a post.']);
      return;
    }

    try {
      setIsCreating(true);
      setErrors([]);
      
      // In a real implementation, upload files to storage service
      let mediaUrls: string[] = [];
      if (selectedMedia.length > 0) {
        // Simulate file upload
        mediaUrls = previewUrls; // In production, replace with actual upload URLs
      }

      const postData = {
        content: content.trim(),
        visibility,
        mediaUrls,
        authorId: user.id,
        type: selectedMedia.length > 0 ? 'media' : 'text'
      };

      if (onCreatePost) {
        await onCreatePost(postData);
      } else {
        await createPost(postData);
      }

      // Reset form
      setContent('');
      setSelectedMedia([]);
      setPreviewUrls(prev => {
        prev.forEach(url => URL.revokeObjectURL(url));
        return [];
      });
      setVisibility('public');
      
    } catch (error) {
      console.error('Failed to create post:', error);
      setErrors(['Failed to create post. Please try again.']);
    } finally {
      setIsCreating(false);
    }
  }, [validateContent, user, content, visibility, selectedMedia, previewUrls, onCreatePost, createPost]);

  const characterCount = content.length;
  const isOverLimit = characterCount > MAX_CONTENT_LENGTH;

  if (!user) {
    return null;
  }

  return (
    <div className={`bg-white rounded-lg shadow p-4 mb-4 ${className}`}>
      <form onSubmit={handleSubmit}>
        {/* Error Messages */}
        {errors.length > 0 && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 mr-2 flex-shrink-0" />
              <div className="text-sm text-red-700">
                {errors.map((error, index) => (
                  <div key={index}>{error}</div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="flex items-start space-x-3">
          <img 
            src={user.avatar || 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=150'} 
            alt={`${user.fullName}'s avatar`} 
            className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100" 
            loading="lazy"
          />
          <div className="flex-1">
            <div className="relative">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's on your mind?"
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-colors ${
                  isOverLimit ? 'border-red-300 focus:ring-red-500' : 'border-gray-200'
                }`}
                rows={3}
                maxLength={MAX_CONTENT_LENGTH + 100} // Allow slight overflow for warning
                aria-label="Post content"
                aria-describedby="character-count"
              />
              <div 
                id="character-count"
                className={`absolute bottom-2 right-2 text-xs ${
                  isOverLimit ? 'text-red-500' : 'text-gray-400'
                }`}
              >
                {characterCount}/{MAX_CONTENT_LENGTH}
              </div>
            </div>
            
            {/* Media Preview */}
            {previewUrls.length > 0 && (
              <div className="mt-3 grid grid-cols-2 gap-2">
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    <img 
                      src={url} 
                      alt={`Preview ${index + 1}`} 
                      className="rounded-lg w-full h-32 object-cover" 
                    />
                    <button
                      type="button"
                      onClick={() => removeMedia(index)}
                      className="absolute top-1 right-1 p-1 bg-gray-800 bg-opacity-50 rounded-full text-white hover:bg-opacity-70 opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label={`Remove image ${index + 1}`}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <label className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors">
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept={ALLOWED_FILE_TYPES.join(',')}
                    onChange={handleMediaSelect}
                    className="hidden"
                    disabled={isCreating}
                  />
                  <Image size={20} className="text-gray-600" />
                  <span className="sr-only">Add images</span>
                </label>
                
                <select
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value as any)}
                  className="p-2 text-sm text-gray-600 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isCreating}
                  aria-label="Post visibility"
                >
                  <option value="public">🌍 Public</option>
                  <option value="followers">👥 Followers</option>
                  <option value="mentors">🎓 Mentors</option>
                  <option value="private">🔒 Private</option>
                </select>
              </div>
              
              <button
                type="submit"
                disabled={isCreating || isOverLimit || (!content.trim() && selectedMedia.length === 0)}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {isCreating ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Posting...</span>
                  </div>
                ) : (
                  'Post'
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}