import { useState } from 'react';
import { Image, FileText, Link2, Globe, Users, MessageCircle, X } from 'lucide-react';
import { useFeedStore } from '../../stores/feedStore';
import { useAuthStore } from '../../stores/authStore';
import { User } from '../../types';

export function CreatePostCard() {
  const { user } = useAuthStore();
  const { createPost } = useFeedStore();
  const [content, setContent] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [visibility, setVisibility] = useState<'public' | 'followers' | 'mentors' | 'private'>('public');
  const [selectedMedia, setSelectedMedia] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  
  const handleMediaSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      
      if (files.length > 0) {
        setSelectedMedia([...selectedMedia, ...files]);
        
        // Create preview URLs
        const newPreviewUrls = files.map(file => URL.createObjectURL(file));
        setPreviewUrls([...previewUrls, ...newPreviewUrls]);
      }
    }
  };
  
  const removeMedia = (index: number) => {
    setSelectedMedia(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && selectedMedia.length === 0) return;

    try {
      setIsCreating(true);
      
      let mediaUrls: string[] = [];
      if (selectedMedia.length > 0) {
        const formData = new FormData();
        selectedMedia.forEach(file => {
          formData.append('files', file);
        });
        
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });
        mediaUrls = await response.json();
      }

      await createPost({
        content,
        visibility,
        media: mediaUrls,
        authorId: user.id
      });

      // Reset form
      setContent('');
      setSelectedMedia([]);
      setPreviewUrls([]);
      setVisibility('public');
      
    } catch (error) {
      console.error('Failed to create post:', error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <form onSubmit={handleSubmit}>
        <div className="flex items-start space-x-3">
          <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
          <div className="flex-1">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind?"
              className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
            />
            
            {previewUrls.length > 0 && (
              <div className="mt-2 grid grid-cols-2 gap-2">
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative">
                    <img src={url} alt="" className="rounded-lg" />
                    <button
                      type="button"
                      onClick={() => removeMedia(index)}
                      className="absolute top-1 right-1 p-1 bg-gray-800 bg-opacity-50 rounded-full text-white hover:bg-opacity-70"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            <div className="mt-3 flex items-center justify-between">
              <div className="flex space-x-2">
                <label className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
                  <input
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={handleMediaSelect}
                    className="hidden"
                  />
                  <Image size={20} className="text-gray-600" />
                </label>
                <select
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value as any)}
                  className="p-2 text-sm text-gray-600 border border-gray-200 rounded-lg"
                >
                  <option value="public">Public</option>
                  <option value="followers">Followers</option>
                  <option value="mentors">Mentors</option>
                  <option value="private">Private</option>
                </select>
              </div>
              
              <button
                type="submit"
                disabled={isCreating || (!content.trim() && selectedMedia.length === 0)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                {isCreating ? 'Posting...' : 'Post'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}