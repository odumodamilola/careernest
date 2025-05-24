import { create } from 'zustand';
import { Post, Comment, User } from '../types';
import { formatDistance } from 'date-fns';

interface FeedState {
  posts: Post[];
  comments: Record<string, Comment[]>;
  loading: boolean;
  error: string | null;
  
  fetchPosts: () => Promise<void>;
  createPost: (content: string, visibility: Post['visibility'], media?: File[]) => Promise<void>;
  likePost: (postId: string) => Promise<void>;
  fetchComments: (postId: string) => Promise<void>;
  addComment: (postId: string, content: string, parentId?: string) => Promise<void>;
  likeComment: (commentId: string) => Promise<void>;
}

// Sample users for demonstration
const USERS: User[] = [
  {
    id: '1',
    email: 'demo@careernest.com',
    fullName: 'Jamie Smith',
    avatar: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=150',
    headline: 'Senior Frontend Developer | React & TypeScript',
    role: 'mentee',
    isVerified: true,
    createdAt: new Date().toISOString(),
    profileComplete: true,
  },
  {
    id: '2',
    email: 'sarah@example.com',
    fullName: 'Sarah Johnson',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=150',
    headline: 'UX Designer | Design Systems Specialist',
    role: 'mentor',
    isVerified: true,
    createdAt: new Date().toISOString(),
    profileComplete: true,
  },
  {
    id: '3',
    email: 'michael@example.com',
    fullName: 'Michael Chen',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=150',
    headline: 'Backend Engineer | Node.js, Python & AWS',
    role: 'mentor',
    isVerified: true,
    createdAt: new Date().toISOString(),
    profileComplete: true,
  },
  {
    id: '4',
    email: 'company@example.com',
    fullName: 'TechCorp Innovations',
    avatar: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=150',
    headline: 'Building the future of technology',
    role: 'recruiter',
    isVerified: true,
    createdAt: new Date().toISOString(),
    profileComplete: true,
  },
];

// Generate time stamps from recent to older
const getTimeAgo = (index: number) => {
  const date = new Date();
  date.setHours(date.getHours() - index * 4);
  return date.toISOString();
};

// Sample posts for demonstration
const DEMO_POSTS: Post[] = [
  {
    id: '1',
    content: "I'm excited to announce that I've joined CareerNest as a Senior Frontend Developer! Looking forward to connecting with other developers and mentors on this platform.",
    authorId: '1',
    author: USERS[0],
    likesCount: 24,
    commentsCount: 5,
    sharesCount: 2,
    hasLiked: false,
    createdAt: getTimeAgo(0),
    updatedAt: getTimeAgo(0),
    visibility: 'public',
    type: 'text',
  },
  {
    id: '2',
    content: "Just finished teaching a workshop on design systems at DesignCon 2025. It's amazing to see so many passionate designers eager to learn and grow!",
    authorId: '2',
    author: USERS[1],
    images: [
      'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940'
    ],
    likesCount: 42,
    commentsCount: 8,
    sharesCount: 5,
    hasLiked: true,
    createdAt: getTimeAgo(1),
    updatedAt: getTimeAgo(1),
    visibility: 'public',
    type: 'media',
  },
  {
    id: '3',
    content: "I'm looking to mentor junior backend developers who want to advance their career in cloud architecture. Comment below if you're interested!",
    authorId: '3',
    author: USERS[2],
    likesCount: 18,
    commentsCount: 12,
    sharesCount: 3,
    hasLiked: false,
    createdAt: getTimeAgo(2),
    updatedAt: getTimeAgo(2),
    visibility: 'public',
    type: 'text',
  },
  {
    id: '4',
    content: "We're hiring! TechCorp is looking for talented frontend and backend developers to join our growing team. Apply through CareerNest or send us a message.",
    authorId: '4',
    author: USERS[3],
    likesCount: 15,
    commentsCount: 3,
    sharesCount: 10,
    hasLiked: false,
    createdAt: getTimeAgo(3),
    updatedAt: getTimeAgo(3),
    visibility: 'public',
    type: 'job',
  },
  {
    id: '5',
    content: "Just completed the Advanced React Patterns course on CareerNest! The instructor @Sarah Johnson was amazing. Highly recommend to anyone looking to level up their React skills.",
    authorId: '1',
    author: USERS[0],
    likesCount: 31,
    commentsCount: 7,
    sharesCount: 4,
    hasLiked: false,
    createdAt: getTimeAgo(4),
    updatedAt: getTimeAgo(4),
    visibility: 'public',
    type: 'certificate',
  },
];

// Sample comments for demonstration
const DEMO_COMMENTS: Record<string, Comment[]> = {
  '1': [
    {
      id: 'c1',
      content: 'Congratulations on your new role!',
      authorId: '2',
      author: USERS[1],
      postId: '1',
      likesCount: 3,
      hasLiked: false,
      createdAt: getTimeAgo(0.1),
      updatedAt: getTimeAgo(0.1),
    },
    {
      id: 'c2',
      content: 'Welcome to the team! Looking forward to collaborating.',
      authorId: '3',
      author: USERS[2],
      postId: '1',
      likesCount: 2,
      hasLiked: true,
      createdAt: getTimeAgo(0.2),
      updatedAt: getTimeAgo(0.2),
    },
  ],
  '2': [
    {
      id: 'c3',
      content: 'The workshop was fantastic! Learned so much about design systems.',
      authorId: '1',
      author: USERS[0],
      postId: '2',
      likesCount: 5,
      hasLiked: false,
      createdAt: getTimeAgo(1.1),
      updatedAt: getTimeAgo(1.1),
    },
  ],
};

export const useFeedStore = create<FeedState>((set, get) => ({
  posts: [],
  comments: {},
  loading: false,
  error: null,
  
  fetchPosts: async () => {
    set({ loading: true });
    
    try {
      // Simulating an API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      set({ posts: DEMO_POSTS, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch posts', loading: false });
    }
  },
  
  createPost: async (content, visibility, media) => {
    set({ loading: true });
    
    try {
      // Simulating an API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get the current user
      const currentUser = JSON.parse(localStorage.getItem('careernest_user') || '{}');
      
      const newPost: Post = {
        id: `post-${Date.now()}`,
        content,
        authorId: currentUser.id,
        author: currentUser,
        likesCount: 0,
        commentsCount: 0,
        sharesCount: 0,
        hasLiked: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        visibility,
        type: media && media.length > 0 ? 'media' : 'text',
        // In a real implementation, we would upload the media files
        // and set the URLs here
      };
      
      set({ posts: [newPost, ...get().posts], loading: false });
    } catch (error) {
      set({ error: 'Failed to create post', loading: false });
    }
  },
  
  likePost: async (postId) => {
    try {
      // Optimistic update
      const updatedPosts = get().posts.map(post => {
        if (post.id === postId) {
          const hasLiked = !post.hasLiked;
          return {
            ...post,
            hasLiked,
            likesCount: hasLiked ? post.likesCount + 1 : post.likesCount - 1,
          };
        }
        return post;
      });
      
      set({ posts: updatedPosts });
      
      // In a real implementation, we would make an API call here
      // to persist the like/unlike action
    } catch (error) {
      set({ error: 'Failed to like post' });
    }
  },
  
  fetchComments: async (postId) => {
    set({ loading: true });
    
    try {
      // Simulating an API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Get comments for the post
      const comments = DEMO_COMMENTS[postId] || [];
      
      set(state => ({
        comments: { ...state.comments, [postId]: comments },
        loading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to fetch comments', loading: false });
    }
  },
  
  addComment: async (postId, content, parentId) => {
    try {
      // Get the current user
      const currentUser = JSON.parse(localStorage.getItem('careernest_user') || '{}');
      
      const newComment: Comment = {
        id: `comment-${Date.now()}`,
        content,
        authorId: currentUser.id,
        author: currentUser,
        postId,
        parentId,
        likesCount: 0,
        hasLiked: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // Update comments
      const currentComments = get().comments[postId] || [];
      const updatedComments = [...currentComments, newComment];
      
      // Update post comment count
      const updatedPosts = get().posts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            commentsCount: post.commentsCount + 1,
          };
        }
        return post;
      });
      
      set(state => ({
        comments: { ...state.comments, [postId]: updatedComments },
        posts: updatedPosts,
      }));
    } catch (error) {
      set({ error: 'Failed to add comment' });
    }
  },
  
  likeComment: async (commentId) => {
    try {
      // Find the comment and update its like status
      let updatedComments = { ...get().comments };
      
      for (const postId in updatedComments) {
        updatedComments[postId] = updatedComments[postId].map(comment => {
          if (comment.id === commentId) {
            const hasLiked = !comment.hasLiked;
            return {
              ...comment,
              hasLiked,
              likesCount: hasLiked ? comment.likesCount + 1 : comment.likesCount - 1,
            };
          }
          return comment;
        });
      }
      
      set({ comments: updatedComments });
      
      // In a real implementation, we would make an API call here
      // to persist the like/unlike action
    } catch (error) {
      set({ error: 'Failed to like comment' });
    }
  },
}));