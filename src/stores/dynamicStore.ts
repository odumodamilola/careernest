import { create } from 'zustand';
import { DatabaseService } from '../lib/database';
import { RealtimeService } from '../lib/realtime';
import { toast } from 'sonner';

interface DynamicState {
  // Loading states
  loading: {
    posts: boolean;
    messages: boolean;
    courses: boolean;
    groups: boolean;
    mentors: boolean;
    notifications: boolean;
  };
  
  // Data
  posts: any[];
  conversations: any[];
  courses: any[];
  groups: any[];
  mentors: any[];
  notifications: any[];
  searchResults: any;
  
  // Real-time state
  onlineUsers: Set<string>;
  typingUsers: Map<string, string[]>;
  
  // Actions
  initializeRealtime: (userId: string) => void;
  fetchPosts: (options?: any) => Promise<void>;
  createPost: (postData: any) => Promise<void>;
  likePost: (postId: string) => Promise<void>;
  addComment: (postId: string, content: string) => Promise<void>;
  
  fetchConversations: () => Promise<void>;
  sendMessage: (conversationId: string, content: string) => Promise<void>;
  
  fetchCourses: (filters?: any) => Promise<void>;
  enrollInCourse: (courseId: string) => Promise<void>;
  
  fetchGroups: (filters?: any) => Promise<void>;
  joinGroup: (groupId: string) => Promise<void>;
  
  fetchMentors: (filters?: any) => Promise<void>;
  bookMentorSession: (mentorId: string, sessionData: any) => Promise<void>;
  
  fetchNotifications: () => Promise<void>;
  markNotificationAsRead: (notificationId: string) => Promise<void>;
  
  globalSearch: (query: string, type?: string) => Promise<void>;
  
  // Real-time handlers
  handleNewMessage: (message: any) => void;
  handleNewNotification: (notification: any) => void;
  handlePostUpdate: (update: any) => void;
  handleUserStatusChange: (userId: string, status: string) => void;
  handleTypingIndicator: (conversationId: string, userId: string, typing: boolean) => void;
}

export const useDynamicStore = create<DynamicState>((set, get) => ({
  loading: {
    posts: false,
    messages: false,
    courses: false,
    groups: false,
    mentors: false,
    notifications: false,
  },
  
  posts: [],
  conversations: [],
  courses: [],
  groups: [],
  mentors: [],
  notifications: [],
  searchResults: null,
  
  onlineUsers: new Set(),
  typingUsers: new Map(),
  
  initializeRealtime: (userId: string) => {
    // Subscribe to real-time updates
    RealtimeService.subscribeToNotifications(userId, (notification) => {
      get().handleNewNotification(notification);
    });
    
    RealtimeService.subscribeToPosts((update) => {
      get().handlePostUpdate(update);
    });
    
    RealtimeService.trackUserPresence(userId);
  },
  
  fetchPosts: async (options = {}) => {
    set(state => ({ loading: { ...state.loading, posts: true } }));
    
    try {
      const posts = await DatabaseService.getPosts(options);
      set({ posts });
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      toast.error('Failed to load posts');
    } finally {
      set(state => ({ loading: { ...state.loading, posts: false } }));
    }
  },
  
  createPost: async (postData) => {
    try {
      const newPost = await DatabaseService.createPost(postData);
      set(state => ({ posts: [newPost, ...state.posts] }));
      toast.success('Post created successfully');
    } catch (error) {
      console.error('Failed to create post:', error);
      toast.error('Failed to create post');
    }
  },
  
  likePost: async (postId) => {
    try {
      const result = await DatabaseService.likePost(postId);
      
      set(state => ({
        posts: state.posts.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              hasLiked: result.liked,
              likesCount: result.liked ? post.likesCount + 1 : post.likesCount - 1
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
  
  addComment: async (postId, content) => {
    try {
      const comment = await DatabaseService.addComment(postId, content);
      
      set(state => ({
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
  
  fetchConversations: async () => {
    set(state => ({ loading: { ...state.loading, messages: true } }));
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      const conversations = await DatabaseService.getConversations(user.id);
      set({ conversations });
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
      toast.error('Failed to load conversations');
    } finally {
      set(state => ({ loading: { ...state.loading, messages: false } }));
    }
  },
  
  sendMessage: async (conversationId, content) => {
    try {
      const message = await DatabaseService.sendMessage(conversationId, content);
      
      // Update conversation with new message
      set(state => ({
        conversations: state.conversations.map(conv => {
          if (conv.id === conversationId) {
            return {
              ...conv,
              last_message: message,
              last_message_at: message.created_at
            };
          }
          return conv;
        })
      }));
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message');
    }
  },
  
  fetchCourses: async (filters = {}) => {
    set(state => ({ loading: { ...state.loading, courses: true } }));
    
    try {
      const courses = await DatabaseService.getCourses(filters);
      set({ courses });
    } catch (error) {
      console.error('Failed to fetch courses:', error);
      toast.error('Failed to load courses');
    } finally {
      set(state => ({ loading: { ...state.loading, courses: false } }));
    }
  },
  
  enrollInCourse: async (courseId) => {
    try {
      await DatabaseService.enrollInCourse(courseId);
      
      set(state => ({
        courses: state.courses.map(course => {
          if (course.id === courseId) {
            return {
              ...course,
              isEnrolled: true,
              enrolledCount: course.enrolledCount + 1
            };
          }
          return course;
        })
      }));
      
      toast.success('Successfully enrolled in course');
    } catch (error) {
      console.error('Failed to enroll in course:', error);
      toast.error('Failed to enroll in course');
    }
  },
  
  fetchGroups: async (filters = {}) => {
    set(state => ({ loading: { ...state.loading, groups: true } }));
    
    try {
      const groups = await DatabaseService.getGroups(filters);
      set({ groups });
    } catch (error) {
      console.error('Failed to fetch groups:', error);
      toast.error('Failed to load groups');
    } finally {
      set(state => ({ loading: { ...state.loading, groups: false } }));
    }
  },
  
  joinGroup: async (groupId) => {
    try {
      await DatabaseService.joinGroup(groupId);
      
      set(state => ({
        groups: state.groups.map(group => {
          if (group.id === groupId) {
            return {
              ...group,
              isJoined: true,
              membersCount: group.membersCount + 1
            };
          }
          return group;
        })
      }));
      
      toast.success('Successfully joined group');
    } catch (error) {
      console.error('Failed to join group:', error);
      toast.error('Failed to join group');
    }
  },
  
  fetchMentors: async (filters = {}) => {
    set(state => ({ loading: { ...state.loading, mentors: true } }));
    
    try {
      const mentors = await DatabaseService.getMentors(filters);
      set({ mentors });
    } catch (error) {
      console.error('Failed to fetch mentors:', error);
      toast.error('Failed to load mentors');
    } finally {
      set(state => ({ loading: { ...state.loading, mentors: false } }));
    }
  },
  
  bookMentorSession: async (mentorId, sessionData) => {
    try {
      await DatabaseService.bookMentorshipSession(mentorId, sessionData);
      toast.success('Mentorship session booked successfully');
    } catch (error) {
      console.error('Failed to book mentorship session:', error);
      toast.error('Failed to book mentorship session');
    }
  },
  
  fetchNotifications: async () => {
    set(state => ({ loading: { ...state.loading, notifications: true } }));
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      const notifications = await DatabaseService.getNotifications(user.id);
      set({ notifications });
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      toast.error('Failed to load notifications');
    } finally {
      set(state => ({ loading: { ...state.loading, notifications: false } }));
    }
  },
  
  markNotificationAsRead: async (notificationId) => {
    try {
      await DatabaseService.markNotificationAsRead(notificationId);
      
      set(state => ({
        notifications: state.notifications.map(notification => {
          if (notification.id === notificationId) {
            return { ...notification, is_read: true };
          }
          return notification;
        })
      }));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  },
  
  globalSearch: async (query, type = 'global') => {
    try {
      const results = await DatabaseService.globalSearch(query, type);
      set({ searchResults: results });
    } catch (error) {
      console.error('Failed to search:', error);
      toast.error('Search failed');
    }
  },
  
  // Real-time handlers
  handleNewMessage: (message) => {
    set(state => ({
      conversations: state.conversations.map(conv => {
        if (conv.id === message.conversation_id) {
          return {
            ...conv,
            last_message: message,
            last_message_at: message.created_at
          };
        }
        return conv;
      })
    }));
  },
  
  handleNewNotification: (notification) => {
    set(state => ({
      notifications: [notification, ...state.notifications]
    }));
    
    toast.info(notification.title);
  },
  
  handlePostUpdate: (update) => {
    const { eventType, new: newData, old: oldData } = update;
    
    set(state => {
      switch (eventType) {
        case 'INSERT':
          return { posts: [newData, ...state.posts] };
        case 'UPDATE':
          return {
            posts: state.posts.map(post => 
              post.id === newData.id ? { ...post, ...newData } : post
            )
          };
        case 'DELETE':
          return {
            posts: state.posts.filter(post => post.id !== oldData.id)
          };
        default:
          return state;
      }
    });
  },
  
  handleUserStatusChange: (userId, status) => {
    set(state => {
      const newOnlineUsers = new Set(state.onlineUsers);
      
      if (status === 'online') {
        newOnlineUsers.add(userId);
      } else {
        newOnlineUsers.delete(userId);
      }
      
      return { onlineUsers: newOnlineUsers };
    });
  },
  
  handleTypingIndicator: (conversationId, userId, typing) => {
    set(state => {
      const newTypingUsers = new Map(state.typingUsers);
      const currentTyping = newTypingUsers.get(conversationId) || [];
      
      if (typing) {
        if (!currentTyping.includes(userId)) {
          newTypingUsers.set(conversationId, [...currentTyping, userId]);
        }
      } else {
        newTypingUsers.set(conversationId, currentTyping.filter(id => id !== userId));
      }
      
      return { typingUsers: newTypingUsers };
    });
  }
}));