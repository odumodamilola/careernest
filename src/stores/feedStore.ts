import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { Post, Comment } from '../types';
import { toast } from 'sonner';

interface FeedState {
  posts: Post[];
  comments: Record<string, Comment[]>;
  loading: boolean;
  error: string | null;
  
  fetchPosts: (options?: { userId?: string }) => Promise<void>;
  createPost: (data: { content: string; type?: Post['type']; visibility?: string; mediaUrls?: string[] }) => Promise<void>;
  likePost: (postId: string) => Promise<void>;
  fetchComments: (postId: string) => Promise<void>;
  addComment: (postId: string, content: string, parentId?: string) => Promise<void>;
  likeComment: (commentId: string) => Promise<void>;
  deletePost: (postId: string) => Promise<void>;
  editPost: (postId: string, content: string) => Promise<void>;
}

export const useFeedStore = create<FeedState>((set, get) => {
  // Subscribe to real-time post updates
  supabase
    .channel('public:posts')
    .on('postgres_changes', { 
      event: '*', 
      schema: 'public', 
      table: 'posts' 
    }, (payload) => {
      const { eventType, new: newPost, old: oldPost } = payload;
      
      switch (eventType) {
        case 'INSERT':
          set(state => ({
            posts: [newPost, ...state.posts]
          }));
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
    
    fetchPosts: async ({ userId } = {}) => {
      set({ loading: true });
      
      try {
        let query = supabase
          .from('posts')
          .select(`
            *,
            author:profiles(*),
            likes:post_likes(count),
            comments:post_comments(count)
          `)
          .order('created_at', { ascending: false });

        if (userId) {
          query = query.eq('author_id', userId);
        }

        const { data: posts, error } = await query;

        if (error) throw error;

        // Get current user's likes
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: userLikes } = await supabase
            .from('post_likes')
            .select('post_id')
            .eq('user_id', user.id);

          const likedPostIds = new Set(userLikes?.map(like => like.post_id));
          
          posts?.forEach(post => {
            post.hasLiked = likedPostIds.has(post.id);
          });
        }

        set({ posts: posts || [], loading: false });
      } catch (error) {
        console.error('Failed to fetch posts:', error);
        set({ error: 'Failed to fetch posts', loading: false });
        toast.error('Failed to load posts');
      }
    },
    
    createPost: async ({ content, type = 'text', visibility = 'public', mediaUrls = [] }) => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) throw new Error('No user found');

        const { data: post, error } = await supabase
          .from('posts')
          .insert([
            {
              author_id: user.id,
              content,
              type,
              visibility,
              media_urls: mediaUrls,
              created_at: new Date().toISOString()
            }
          ])
          .select(`
            *,
            author:profiles(*)
          `)
          .single();

        if (error) throw error;

        toast.success('Post created successfully');
      } catch (error) {
        console.error('Failed to create post:', error);
        toast.error('Failed to create post');
      }
    },
    
    likePost: async (postId: string) => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) throw new Error('No user found');

        const { data: existingLike } = await supabase
          .from('post_likes')
          .select()
          .eq('post_id', postId)
          .eq('user_id', user.id)
          .single();

        if (existingLike) {
          // Unlike
          const { error } = await supabase
            .from('post_likes')
            .delete()
            .eq('post_id', postId)
            .eq('user_id', user.id);

          if (error) throw error;
          
          toast.success('Post unliked');
        } else {
          // Like
          const { error } = await supabase
            .from('post_likes')
            .insert([
              {
                post_id: postId,
                user_id: user.id
              }
            ]);

          if (error) throw error;
          
          toast.success('Post liked');
        }

        // Optimistic update
        set(state => ({
          posts: state.posts.map(post => {
            if (post.id === postId) {
              return {
                ...post,
                hasLiked: !existingLike,
                likesCount: existingLike ? post.likesCount - 1 : post.likesCount + 1
              };
            }
            return post;
          })
        }));
      } catch (error) {
        console.error('Failed to like post:', error);
        toast.error('Failed to like post');
      }
    },
    
    fetchComments: async (postId: string) => {
      set({ loading: true });
      
      try {
        const { data: comments, error } = await supabase
          .from('post_comments')
          .select(`
            *,
            author:profiles(*),
            likes:comment_likes(count)
          `)
          .eq('post_id', postId)
          .order('created_at', { ascending: true });

        if (error) throw error;

        // Get current user's comment likes
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: userLikes } = await supabase
            .from('comment_likes')
            .select('comment_id')
            .eq('user_id', user.id);

          const likedCommentIds = new Set(userLikes?.map(like => like.comment_id));
          
          comments?.forEach(comment => {
            comment.hasLiked = likedCommentIds.has(comment.id);
          });
        }

        set(state => ({
          comments: { ...state.comments, [postId]: comments || [] },
          loading: false
        }));
      } catch (error) {
        console.error('Failed to fetch comments:', error);
        set({ error: 'Failed to fetch comments', loading: false });
        toast.error('Failed to load comments');
      }
    },
    
    addComment: async (postId: string, content: string, parentId?: string) => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) throw new Error('No user found');

        const { data: comment, error } = await supabase
          .from('post_comments')
          .insert([
            {
              post_id: postId,
              author_id: user.id,
              parent_id: parentId,
              content,
              created_at: new Date().toISOString()
            }
          ])
          .select(`
            *,
            author:profiles(*)
          `)
          .single();

        if (error) throw error;

        // Update comments count
        await supabase.rpc('increment_comments_count', { post_id: postId });

        set(state => ({
          comments: {
            ...state.comments,
            [postId]: [...(state.comments[postId] || []), comment]
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
      } catch (error) {
        console.error('Failed to add comment:', error);
        toast.error('Failed to add comment');
      }
    },
    
    likeComment: async (commentId: string) => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) throw new Error('No user found');

        const { data: existingLike } = await supabase
          .from('comment_likes')
          .select()
          .eq('comment_id', commentId)
          .eq('user_id', user.id)
          .single();

        if (existingLike) {
          const { error } = await supabase
            .from('comment_likes')
            .delete()
            .eq('comment_id', commentId)
            .eq('user_id', user.id);

          if (error) throw error;
          
          toast.success('Comment unliked');
        } else {
          const { error } = await supabase
            .from('comment_likes')
            .insert([
              {
                comment_id: commentId,
                user_id: user.id
              }
            ]);

          if (error) throw error;
          
          toast.success('Comment liked');
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
                    hasLiked: !existingLike,
                    likesCount: existingLike ? comment.likesCount - 1 : comment.likesCount + 1
                  };
                }
                return comment;
              })
            ])
          )
        }));
      } catch (error) {
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
      } catch (error) {
        console.error('Failed to delete post:', error);
        toast.error('Failed to delete post');
      }
    },

    editPost: async (postId: string, content: string) => {
      try {
        const { error } = await supabase
          .from('posts')
          .update({ content, updated_at: new Date().toISOString() })
          .eq('id', postId);

        if (error) throw error;

        set(state => ({
          posts: state.posts.map(post => 
            post.id === postId ? { ...post, content } : post
          )
        }));

        toast.success('Post updated');
      } catch (error) {
        console.error('Failed to edit post:', error);
        toast.error('Failed to edit post');
      }
    }
  };
});