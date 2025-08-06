import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { Post, Comment } from '../types';
import { toast } from 'sonner';

interface FeedState {
  posts: Post[];
  comments: Record<string, Comment[]>;
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  currentPage: number;
  filters: {
    type?: string;
    author?: string;
    dateRange?: { start: Date; end: Date };
  };
  
  // Actions
  fetchPosts: (options?: { 
    userId?: string; 
    page?: number; 
    limit?: number; 
    refresh?: boolean;
    filters?: any;
  }) => Promise<void>;
  createPost: (data: { 
    content: string; 
    type?: Post['type']; 
    visibility?: string; 
    mediaUrls?: string[];
    attachmentUrl?: string;
  }) => Promise<void>;
  likePost: (postId: string) => Promise<void>;
  fetchComments: (postId: string) => Promise<void>;
  addComment: (postId: string, content: string, parentId?: string) => Promise<void>;
  likeComment: (commentId: string) => Promise<void>;
  deletePost: (postId: string) => Promise<void>;
  editPost: (postId: string, content: string) => Promise<void>;
  pinPost: (postId: string) => Promise<void>;
  sharePost: (postId: string, shareType?: string, comment?: string) => Promise<void>;
  reportPost: (postId: string, reason: string) => Promise<void>;
  setFilters: (filters: any) => void;
  clearFilters: () => void;
  refreshFeed: () => Promise<void>;
}

const POSTS_PER_PAGE = 10;

export const useFeedStore = create<FeedState>((set, get) => {
  // Subscribe to real-time post updates
  const subscription = supabase
    .channel('public:posts')
    .on('postgres_changes', { 
      event: '*', 
      schema: 'public', 
      table: 'posts' 
    }, (payload) => {
      const { eventType, new: newPost, old: oldPost } = payload;
      
      switch (eventType) {
        case 'INSERT':
          // Only add if it matches current filters
          set(state => {
            const shouldInclude = !state.filters.type || newPost.type === state.filters.type;
            if (shouldInclude) {
              return { posts: [newPost, ...state.posts] };
            }
            return state;
          });
          break;
        case 'UPDATE':
          set(state => ({
            posts: state.posts.map(post => 
              post.id === newPost.id ? { ...post, ...newPost } : post
            )
          }));
          break;
        case 'DELETE':
          set(state => ({
            posts: state.posts.filter(post => post.id !== oldPost.id)
          }));
          break;
      }
    })
    .subscribe();

  return {
    posts: [],
    comments: {},
    loading: false,
    error: null,
    hasMore: true,
    currentPage: 0,
    filters: {},
    
    fetchPosts: async ({ userId, page = 0, limit = POSTS_PER_PAGE, refresh = false, filters } = {}) => {
      // Prevent multiple simultaneous requests
      if (get().loading && !refresh) return;
      
      set({ loading: true, error: null });
      
      try {
        // Build query with explicit foreign key relationships to avoid ambiguity
        let query = supabase
          .from('posts')
          .select(`
            *,
            author:profiles!posts_author_id_fkey(*),
            likes:post_likes(count),
            comments:post_comments(count),
            shares:post_shares(count)
          `)
          .order('created_at', { ascending: false });

        // Apply filters
        if (userId) {
          query = query.eq('author_id', userId);
        }

        if (filters?.type) {
          query = query.eq('type', filters.type);
        }

        if (filters?.dateRange) {
          query = query
            .gte('created_at', filters.dateRange.start.toISOString())
            .lte('created_at', filters.dateRange.end.toISOString());
        }

        // Pagination
        const from = page * limit;
        const to = from + limit - 1;
        query = query.range(from, to);

        const { data: posts, error, count } = await query;

        if (error) throw error;

        // Get current user's likes
        const { data: { user } } = await supabase.auth.getUser();
        if (user && posts) {
          const postIds = posts.map(post => post.id);
          const { data: likes } = await supabase
            .from('post_likes')
            .select('post_id')
            .eq('user_id', user.id)
            .in('post_id', postIds);

          const likedPostIds = new Set(likes?.map(like => like.post_id));
          
          posts.forEach(post => {
            post.hasLiked = likedPostIds.has(post.id);
            // Ensure counts are numbers
            post.likesCount = Number(post.likes?.[0]?.count || 0);
            post.commentsCount = Number(post.comments?.[0]?.count || 0);
            post.sharesCount = Number(post.shares?.[0]?.count || 0);
          });
        }

        const hasMore = count ? (page + 1) * limit < count : false;

        set(state => ({
          posts: refresh || page === 0 ? (posts || []) : [...state.posts, ...(posts || [])],
          loading: false,
          hasMore,
          currentPage: page,
          filters: filters || state.filters
        }));

      } catch (error: any) {
        console.error('Failed to fetch posts:', error);
        set({ 
          error: error.message || 'Failed to fetch posts', 
          loading: false 
        });
        toast.error('Failed to load posts');
      }
    },
    
    createPost: async ({ content, type = 'text', visibility = 'public', mediaUrls = [], attachmentUrl }) => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) throw new Error('User not authenticated');

        // Validate content
        if (!content.trim() && !mediaUrls.length && !attachmentUrl) {
          throw new Error('Post content cannot be empty');
        }

        // Sanitize content
        const sanitizedContent = content
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/javascript:/gi, '')
          .trim();

        const postData = {
          author_id: user.id,
          content: sanitizedContent,
          type,
          visibility,
          media_urls: mediaUrls,
          attachment_url: attachmentUrl,
          created_at: new Date().toISOString()
        };

        const { data: post, error } = await supabase
          .from('posts')
          .insert([postData])
          .select(`
            *,
            author:profiles!posts_author_id_fkey(*)
          `)
          .single();

        if (error) throw error;

        // Add to local state immediately for optimistic updates
        set(state => ({
          posts: [{ ...post, hasLiked: false, likesCount: 0, commentsCount: 0, sharesCount: 0 }, ...state.posts]
        }));

        toast.success('Post created successfully');
      } catch (error: any) {
        console.error('Failed to create post:', error);
        toast.error(error.message || 'Failed to create post');
        throw error;
      }
    },
    
    likePost: async (postId: string) => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) throw new Error('User not authenticated');

        const { data: existingLike } = await supabase
          .from('post_likes')
          .select()
          .eq('post_id', postId)
          .eq('user_id', user.id)
          .maybeSingle();

        let liked = false;
        if (existingLike) {
          // Unlike
          const { error } = await supabase
            .from('post_likes')
            .delete()
            .eq('post_id', postId)
            .eq('user_id', user.id);

          if (error) throw error;
        } else {
          // Like
          const { error } = await supabase
            .from('post_likes')
            .insert([{ post_id: postId, user_id: user.id }]);

          if (error) throw error;
          liked = true;
        }

        // Optimistic update
        set(state => ({
          posts: state.posts.map(post => {
            if (post.id === postId) {
              return {
                ...post,
                hasLiked: liked,
                likesCount: liked ? post.likesCount + 1 : Math.max(0, post.likesCount - 1)
              };
            }
            return post;
          })
        }));

      } catch (error: any) {
        console.error('Failed to like post:', error);
        toast.error('Failed to like post');
      }
    },
    
    fetchComments: async (postId: string) => {
      try {
        const { data: comments, error } = await supabase
          .from('post_comments')
          .select(`
            *,
            author:profiles!post_comments_author_id_fkey(*),
            likes:comment_likes(count)
          `)
          .eq('post_id', postId)
          .order('created_at', { ascending: true });

        if (error) throw error;

        // Get current user's comment likes
        const { data: { user } } = await supabase.auth.getUser();
        if (user && comments) {
          const commentIds = comments.map(comment => comment.id);
          const { data: userLikes } = await supabase
            .from('comment_likes')
            .select('comment_id')
            .eq('user_id', user.id)
            .in('comment_id', commentIds);

          const likedCommentIds = new Set(userLikes?.map(like => like.comment_id));
          
          comments.forEach(comment => {
            comment.hasLiked = likedCommentIds.has(comment.id);
            comment.likesCount = Number(comment.likes?.[0]?.count || 0);
          });
        }

        set(state => ({
          comments: { ...state.comments, [postId]: comments || [] }
        }));
      } catch (error: any) {
        console.error('Failed to fetch comments:', error);
        toast.error('Failed to load comments');
      }
    },
    
    addComment: async (postId: string, content: string, parentId?: string) => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) throw new Error('User not authenticated');

        // Validate and sanitize content
        const sanitizedContent = content
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/javascript:/gi, '')
          .trim();

        if (!sanitizedContent) {
          throw new Error('Comment cannot be empty');
        }

        if (sanitizedContent.length > 500) {
          throw new Error('Comment is too long');
        }

        const { data: comment, error } = await supabase
          .from('post_comments')
          .insert([{
            post_id: postId,
            author_id: user.id,
            parent_id: parentId,
            content: sanitizedContent,
            created_at: new Date().toISOString()
          }])
          .select(`
            *,
            author:profiles!post_comments_author_id_fkey(*)
          `)
          .single();

        if (error) throw error;

        // Update local state
        set(state => ({
          comments: {
            ...state.comments,
            [postId]: [...(state.comments[postId] || []), { ...comment, hasLiked: false, likesCount: 0 }]
          },
          posts: state.posts.map(post => {
            if (post.id === postId) {
              return {
                ...post,
                commentsCount: post.commentsCount + 1
              };
            }
            return post;
          })
        }));

        toast.success('Comment added');
      } catch (error: any) {
        console.error('Failed to add comment:', error);
        toast.error(error.message || 'Failed to add comment');
      }
    },
    
    likeComment: async (commentId: string) => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) throw new Error('User not authenticated');

        const { data: existingLike } = await supabase
          .from('comment_likes')
          .select()
          .eq('comment_id', commentId)
          .eq('user_id', user.id)
          .maybeSingle();

        let liked = false;
        if (existingLike) {
          const { error } = await supabase
            .from('comment_likes')
            .delete()
            .eq('comment_id', commentId)
            .eq('user_id', user.id);

          if (error) throw error;
        } else {
          const { error } = await supabase
            .from('comment_likes')
            .insert([{ comment_id: commentId, user_id: user.id }]);

          if (error) throw error;
          liked = true;
        }

        // Update UI optimistically
        set(state => ({
          comments: Object.fromEntries(
            Object.entries(state.comments).map(([postId, comments]) => [
              postId,
              comments.map(comment => {
                if (comment.id === commentId) {
                  return {
                    ...comment,
                    hasLiked: liked,
                    likesCount: liked ? comment.likesCount + 1 : Math.max(0, comment.likesCount - 1)
                  };
                }
                return comment;
              })
            ])
          )
        }));
      } catch (error: any) {
        console.error('Failed to like comment:', error);
        toast.error('Failed to like comment');
      }
    },

    deletePost: async (postId: string) => {
      try {
        const { error } = await supabase
          .from('posts')
          .delete()
          .eq('id', postId);

        if (error) throw error;

        set(state => ({
          posts: state.posts.filter(post => post.id !== postId)
        }));

        toast.success('Post deleted');
      } catch (error: any) {
        console.error('Failed to delete post:', error);
        toast.error('Failed to delete post');
      }
    },

    editPost: async (postId: string, content: string) => {
      try {
        const sanitizedContent = content
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/javascript:/gi, '')
          .trim();

        const { error } = await supabase
          .from('posts')
          .update({ 
            content: sanitizedContent, 
            updated_at: new Date().toISOString(),
            edited_at: new Date().toISOString()
          })
          .eq('id', postId);

        if (error) throw error;

        set(state => ({
          posts: state.posts.map(post => 
            post.id === postId ? { ...post, content: sanitizedContent } : post
          )
        }));

        toast.success('Post updated');
      } catch (error: any) {
        console.error('Failed to edit post:', error);
        toast.error('Failed to edit post');
      }
    },

    pinPost: async (postId: string) => {
      try {
        const post = get().posts.find(p => p.id === postId);
        const newPinnedState = !post?.isPinned;

        const { error } = await supabase
          .from('posts')
          .update({ is_pinned: newPinnedState })
          .eq('id', postId);

        if (error) throw error;

        set(state => ({
          posts: state.posts.map(post => 
            post.id === postId ? { ...post, isPinned: newPinnedState } : post
          )
        }));

        toast.success(newPinnedState ? 'Post pinned' : 'Post unpinned');
      } catch (error: any) {
        console.error('Failed to pin post:', error);
        toast.error('Failed to pin post');
      }
    },

    sharePost: async (postId: string, shareType = 'repost', comment = '') => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) throw new Error('User not authenticated');

        const { error } = await supabase
          .from('post_shares')
          .insert([{
            post_id: postId,
            user_id: user.id,
            share_type: shareType,
            comment
          }]);

        if (error) throw error;

        // Update shares count
        set(state => ({
          posts: state.posts.map(post => 
            post.id === postId ? { ...post, sharesCount: post.sharesCount + 1 } : post
          )
        }));

        toast.success('Post shared');
      } catch (error: any) {
        console.error('Failed to share post:', error);
        toast.error('Failed to share post');
      }
    },

    reportPost: async (postId: string, reason: string) => {
      try {
        // In a real implementation, this would create a report record
        console.log('Reporting post:', postId, 'Reason:', reason);
        toast.success('Post reported. Thank you for helping keep our community safe.');
      } catch (error: any) {
        console.error('Failed to report post:', error);
        toast.error('Failed to report post');
      }
    },

    setFilters: (filters) => {
      set(state => ({ filters: { ...state.filters, ...filters } }));
    },

    clearFilters: () => {
      set({ filters: {} });
    },

    refreshFeed: async () => {
      const { fetchPosts, filters } = get();
      await fetchPosts({ page: 0, refresh: true, filters });
    }
  };
});