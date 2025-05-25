import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { Post, Comment } from '../types';

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
}

export const useFeedStore = create<FeedState>((set, get) => ({
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
          author:profiles(*)
        `)
        .order('created_at', { ascending: false });

      if (userId) {
        query = query.eq('author_id', userId);
      }

      const { data: posts, error } = await query;

      if (error) throw error;

      set({ posts: posts || [], loading: false });
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      set({ error: 'Failed to fetch posts', loading: false });
    }
  },
  
  createPost: async ({ content, type = 'text', visibility = 'public', mediaUrls = [] }) => {
    set({ loading: true });
    
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

      set(state => ({
        posts: [post, ...state.posts],
        loading: false
      }));
    } catch (error) {
      console.error('Failed to create post:', error);
      set({ error: 'Failed to create post', loading: false });
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
      set({ error: 'Failed to like post' });
    }
  },
  
  fetchComments: async (postId: string) => {
    set({ loading: true });
    
    try {
      const { data: comments, error } = await supabase
        .from('post_comments')
        .select(`
          *,
          author:profiles(*)
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      set(state => ({
        comments: { ...state.comments, [postId]: comments || [] },
        loading: false
      }));
    } catch (error) {
      console.error('Failed to fetch comments:', error);
      set({ error: 'Failed to fetch comments', loading: false });
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
    } catch (error) {
      console.error('Failed to add comment:', error);
      set({ error: 'Failed to add comment' });
    }
  },
  
  likeComment: async (commentId: string) => {
    // Similar to likePost but for comments
    // Implement if needed for MVP
  }
}));