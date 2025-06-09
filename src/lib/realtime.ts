import { supabase } from './supabase';
import { toast } from 'sonner';

export class RealtimeService {
  private static channels: Map<string, any> = new Map();

  // Real-time messaging
  static subscribeToMessages(conversationId: string, onMessage: (message: any) => void) {
    const channelName = `messages:${conversationId}`;
    
    if (this.channels.has(channelName)) {
      return this.channels.get(channelName);
    }

    const channel = supabase
      .channel(channelName)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`
      }, (payload) => {
        onMessage(payload.new);
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`
      }, (payload) => {
        onMessage(payload.new);
      })
      .subscribe();

    this.channels.set(channelName, channel);
    return channel;
  }

  // Real-time notifications
  static subscribeToNotifications(userId: string, onNotification: (notification: any) => void) {
    const channelName = `notifications:${userId}`;
    
    if (this.channels.has(channelName)) {
      return this.channels.get(channelName);
    }

    const channel = supabase
      .channel(channelName)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`
      }, (payload) => {
        onNotification(payload.new);
        toast.info(payload.new.title);
      })
      .subscribe();

    this.channels.set(channelName, channel);
    return channel;
  }

  // Real-time post updates
  static subscribeToPosts(onPostUpdate: (post: any) => void) {
    const channelName = 'posts';
    
    if (this.channels.has(channelName)) {
      return this.channels.get(channelName);
    }

    const channel = supabase
      .channel(channelName)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'posts'
      }, (payload) => {
        onPostUpdate(payload);
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'post_likes'
      }, (payload) => {
        onPostUpdate(payload);
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'post_comments'
      }, (payload) => {
        onPostUpdate(payload);
      })
      .subscribe();

    this.channels.set(channelName, channel);
    return channel;
  }

  // User presence tracking
  static trackUserPresence(userId: string) {
    const channelName = `presence:${userId}`;
    
    const channel = supabase
      .channel(channelName, {
        config: {
          presence: {
            key: userId
          }
        }
      })
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        console.log('Presence state:', state);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('User joined:', key, newPresences);
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('User left:', key, leftPresences);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            user_id: userId,
            online_at: new Date().toISOString()
          });
        }
      });

    this.channels.set(channelName, channel);
    return channel;
  }

  // Typing indicators
  static sendTypingIndicator(conversationId: string, userId: string) {
    const channelName = `typing:${conversationId}`;
    
    let channel = this.channels.get(channelName);
    if (!channel) {
      channel = supabase.channel(channelName);
      this.channels.set(channelName, channel);
    }

    channel.send({
      type: 'broadcast',
      event: 'typing',
      payload: { user_id: userId, typing: true }
    });

    // Stop typing after 3 seconds
    setTimeout(() => {
      channel.send({
        type: 'broadcast',
        event: 'typing',
        payload: { user_id: userId, typing: false }
      });
    }, 3000);
  }

  static subscribeToTyping(conversationId: string, onTyping: (data: any) => void) {
    const channelName = `typing:${conversationId}`;
    
    if (this.channels.has(channelName)) {
      return this.channels.get(channelName);
    }

    const channel = supabase
      .channel(channelName)
      .on('broadcast', { event: 'typing' }, (payload) => {
        onTyping(payload.payload);
      })
      .subscribe();

    this.channels.set(channelName, channel);
    return channel;
  }

  // Video call signaling
  static subscribeToCallSignaling(conversationId: string, onSignal: (signal: any) => void) {
    const channelName = `call:${conversationId}`;
    
    const channel = supabase
      .channel(channelName)
      .on('broadcast', { event: 'call-signal' }, (payload) => {
        onSignal(payload.payload);
      })
      .subscribe();

    this.channels.set(channelName, channel);
    return channel;
  }

  static sendCallSignal(conversationId: string, signal: any) {
    const channelName = `call:${conversationId}`;
    
    let channel = this.channels.get(channelName);
    if (!channel) {
      channel = supabase.channel(channelName);
      this.channels.set(channelName, channel);
    }

    channel.send({
      type: 'broadcast',
      event: 'call-signal',
      payload: signal
    });
  }

  // Cleanup
  static unsubscribe(channelName: string) {
    const channel = this.channels.get(channelName);
    if (channel) {
      supabase.removeChannel(channel);
      this.channels.delete(channelName);
    }
  }

  static unsubscribeAll() {
    this.channels.forEach((channel, channelName) => {
      supabase.removeChannel(channel);
    });
    this.channels.clear();
  }
}