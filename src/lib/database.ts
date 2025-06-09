import { supabase } from './supabase';
import { toast } from 'sonner';

// Database service layer for all CRUD operations
export class DatabaseService {
  // Profile operations
  static async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        *,
        experiences(*),
        education(*),
        followers:follows!follows_following_id_fkey(count),
        following:follows!follows_follower_id_fkey(count)
      `)
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  }

  static async updateProfile(userId: string, updates: any) {
    const { data, error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async searchProfiles(query: string, filters: any = {}) {
    let queryBuilder = supabase
      .from('profiles')
      .select('*')
      .textSearch('full_name,headline,bio', query);

    if (filters.role) {
      queryBuilder = queryBuilder.eq('role', filters.role);
    }
    if (filters.location) {
      queryBuilder = queryBuilder.ilike('location', `%${filters.location}%`);
    }

    const { data, error } = await queryBuilder.limit(20);
    if (error) throw error;
    return data;
  }

  // Posts operations
  static async getPosts(options: { userId?: string; limit?: number; offset?: number } = {}) {
    let query = supabase
      .from('posts')
      .select(`
        *,
        author:profiles(*),
        likes:post_likes(count),
        comments:post_comments(count),
        shares:post_shares(count)
      `)
      .order('created_at', { ascending: false });

    if (options.userId) {
      query = query.eq('author_id', options.userId);
    }

    if (options.limit) {
      query = query.limit(options.limit);
    }

    if (options.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
    }

    const { data, error } = await query;
    if (error) throw error;

    // Check if current user has liked each post
    const { data: { user } } = await supabase.auth.getUser();
    if (user && data) {
      const postIds = data.map(post => post.id);
      const { data: likes } = await supabase
        .from('post_likes')
        .select('post_id')
        .eq('user_id', user.id)
        .in('post_id', postIds);

      const likedPostIds = new Set(likes?.map(like => like.post_id));
      data.forEach(post => {
        post.hasLiked = likedPostIds.has(post.id);
      });
    }

    return data;
  }

  static async createPost(postData: any) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('posts')
      .insert([{
        ...postData,
        author_id: user.id,
        created_at: new Date().toISOString()
      }])
      .select(`
        *,
        author:profiles(*)
      `)
      .single();

    if (error) throw error;
    return data;
  }

  static async likePost(postId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Check if already liked
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
      return { liked: false };
    } else {
      // Like
      const { error } = await supabase
        .from('post_likes')
        .insert([{ post_id: postId, user_id: user.id }]);
      
      if (error) throw error;
      return { liked: true };
    }
  }

  // Comments operations
  static async getComments(postId: string) {
    const { data, error } = await supabase
      .from('post_comments')
      .select(`
        *,
        author:profiles(*),
        likes:comment_likes(count)
      `)
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data;
  }

  static async addComment(postId: string, content: string, parentId?: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('post_comments')
      .insert([{
        post_id: postId,
        author_id: user.id,
        parent_id: parentId,
        content,
        created_at: new Date().toISOString()
      }])
      .select(`
        *,
        author:profiles(*)
      `)
      .single();

    if (error) throw error;
    return data;
  }

  // Messaging operations
  static async getConversations(userId: string) {
    const { data, error } = await supabase
      .from('conversations')
      .select(`
        *,
        participants:conversation_participants(
          user:profiles(*),
          role,
          last_read_at
        ),
        last_message:messages(
          content,
          created_at,
          sender:profiles(full_name)
        )
      `)
      .eq('conversation_participants.user_id', userId)
      .order('last_message_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async createConversation(participantIds: string[], type: 'direct' | 'group' = 'direct', name?: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Create conversation
    const { data: conversation, error: convError } = await supabase
      .from('conversations')
      .insert([{
        type,
        name,
        created_by: user.id
      }])
      .select()
      .single();

    if (convError) throw convError;

    // Add participants
    const participants = [user.id, ...participantIds].map(userId => ({
      conversation_id: conversation.id,
      user_id: userId,
      role: userId === user.id ? 'admin' : 'member'
    }));

    const { error: participantsError } = await supabase
      .from('conversation_participants')
      .insert(participants);

    if (participantsError) throw participantsError;

    return conversation;
  }

  static async sendMessage(conversationId: string, content: string, messageType: string = 'text', mediaUrl?: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('messages')
      .insert([{
        conversation_id: conversationId,
        sender_id: user.id,
        content,
        message_type: messageType,
        media_url: mediaUrl
      }])
      .select(`
        *,
        sender:profiles(*)
      `)
      .single();

    if (error) throw error;
    return data;
  }

  static async getMessages(conversationId: string, limit: number = 50, offset: number = 0) {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:profiles(*),
        reactions:message_reactions(*)
      `)
      .eq('conversation_id', conversationId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return data?.reverse() || [];
  }

  // Courses operations
  static async getCourses(filters: any = {}) {
    let query = supabase
      .from('courses')
      .select(`
        *,
        instructor:profiles(*),
        modules:course_modules(count),
        enrollments:course_enrollments(count)
      `)
      .eq('status', 'published');

    if (filters.category) {
      query = query.eq('category', filters.category);
    }
    if (filters.level) {
      query = query.eq('level', filters.level);
    }
    if (filters.isFree !== undefined) {
      query = query.eq('is_free', filters.isFree);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  }

  static async enrollInCourse(courseId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('course_enrollments')
      .insert([{
        course_id: courseId,
        user_id: user.id
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Groups operations
  static async getGroups(filters: any = {}) {
    let query = supabase
      .from('groups')
      .select(`
        *,
        creator:profiles(*),
        members:group_members(count)
      `);

    if (filters.category) {
      query = query.eq('category', filters.category);
    }
    if (filters.type) {
      query = query.eq('type', filters.type);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  }

  static async joinGroup(groupId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('group_members')
      .insert([{
        group_id: groupId,
        user_id: user.id
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Mentorship operations
  static async getMentors(filters: any = {}) {
    let query = supabase
      .from('mentorship_profiles')
      .select(`
        *,
        mentor:profiles(*)
      `)
      .eq('is_accepting_mentees', true);

    if (filters.expertise) {
      query = query.contains('expertise_areas', [filters.expertise]);
    }

    const { data, error } = await query.order('rating_average', { ascending: false });
    if (error) throw error;
    return data;
  }

  static async bookMentorshipSession(mentorId: string, sessionData: any) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('mentorship_sessions')
      .insert([{
        mentor_id: mentorId,
        mentee_id: user.id,
        ...sessionData
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Notifications operations
  static async getNotifications(userId: string) {
    const { data, error } = await supabase
      .from('notifications')
      .select(`
        *,
        actor:profiles(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;
    return data;
  }

  static async markNotificationAsRead(notificationId: string) {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);

    if (error) throw error;
  }

  // Search operations
  static async globalSearch(query: string, type: string = 'global') {
    const results: any = {};

    if (type === 'global' || type === 'people') {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('*')
        .textSearch('full_name,headline,bio', query)
        .limit(10);
      results.profiles = profiles || [];
    }

    if (type === 'global' || type === 'posts') {
      const { data: posts } = await supabase
        .from('posts')
        .select(`
          *,
          author:profiles(*)
        `)
        .textSearch('content', query)
        .limit(10);
      results.posts = posts || [];
    }

    if (type === 'global' || type === 'courses') {
      const { data: courses } = await supabase
        .from('courses')
        .select(`
          *,
          instructor:profiles(*)
        `)
        .textSearch('title,description', query)
        .eq('status', 'published')
        .limit(10);
      results.courses = courses || [];
    }

    if (type === 'global' || type === 'groups') {
      const { data: groups } = await supabase
        .from('groups')
        .select('*')
        .textSearch('name,description', query)
        .eq('type', 'public')
        .limit(10);
      results.groups = groups || [];
    }

    return results;
  }

  // Real-time subscriptions
  static subscribeToConversation(conversationId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`conversation:${conversationId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`
      }, callback)
      .subscribe();
  }

  static subscribeToNotifications(userId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`notifications:${userId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`
      }, callback)
      .subscribe();
  }

  static subscribeToUserStatus(callback: (payload: any) => void) {
    return supabase
      .channel('user_status')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'profiles',
        filter: 'availability_status=neq.offline'
      }, callback)
      .subscribe();
  }
}