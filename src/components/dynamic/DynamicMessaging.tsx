import React, { useEffect, useState } from 'react';
import { useDynamicStore } from '../../stores/dynamicStore';
import { useAuthStore } from '../../stores/authStore';
import { RealtimeService } from '../../lib/realtime';
import { DatabaseService } from '../../lib/database';
import { Send, Phone, Video, MoreVertical, Smile, Paperclip } from 'lucide-react';

export function DynamicMessaging() {
  const { user } = useAuthStore();
  const { conversations, fetchConversations, sendMessage } = useDynamicStore();
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [typingUsers, setTypingUsers] = useState([]);

  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id);
      
      // Subscribe to real-time messages
      const messageSubscription = RealtimeService.subscribeToMessages(
        selectedConversation.id,
        (message) => {
          setMessages(prev => [...prev, message]);
        }
      );

      // Subscribe to typing indicators
      const typingSubscription = RealtimeService.subscribeToTyping(
        selectedConversation.id,
        (data) => {
          if (data.typing && data.user_id !== user.id) {
            setTypingUsers(prev => [...prev.filter(id => id !== data.user_id), data.user_id]);
          } else {
            setTypingUsers(prev => prev.filter(id => id !== data.user_id));
          }
        }
      );

      return () => {
        RealtimeService.unsubscribe(`messages:${selectedConversation.id}`);
        RealtimeService.unsubscribe(`typing:${selectedConversation.id}`);
      };
    }
  }, [selectedConversation]);

  const loadMessages = async (conversationId) => {
    try {
      const messages = await DatabaseService.getMessages(conversationId);
      setMessages(messages);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedConversation) return;

    try {
      await sendMessage(selectedConversation.id, messageText);
      setMessageText('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleTyping = () => {
    if (selectedConversation) {
      RealtimeService.sendTypingIndicator(selectedConversation.id, user.id);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Conversations List */}
      <div className="w-1/3 bg-white border-r border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
        </div>
        
        <div className="overflow-y-auto">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => setSelectedConversation(conversation)}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                selectedConversation?.id === conversation.id ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                  {conversation.participants?.[0]?.user?.full_name?.[0] || 'U'}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">
                    {conversation.name || conversation.participants?.[0]?.user?.full_name || 'Unknown'}
                  </h3>
                  <p className="text-sm text-gray-600 truncate">
                    {conversation.last_message?.content || 'No messages yet'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                    {selectedConversation.participants?.[0]?.user?.full_name?.[0] || 'U'}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {selectedConversation.name || selectedConversation.participants?.[0]?.user?.full_name || 'Unknown'}
                    </h3>
                    <p className="text-sm text-gray-600">Online</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <Phone className="h-5 w-5 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <Video className="h-5 w-5 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <MoreVertical className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender_id === user.id ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.sender_id === user.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-white border border-gray-200 text-gray-900'
                    }`}
                  >
                    <p>{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.sender_id === user.id ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {new Date(message.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              
              {/* Typing Indicator */}
              {typingUsers.length > 0 && (
                <div className="flex justify-start">
                  <div className="bg-gray-200 rounded-lg px-4 py-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                <button type="button" className="p-2 hover:bg-gray-100 rounded-lg">
                  <Paperclip className="h-5 w-5 text-gray-600" />
                </button>
                
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={messageText}
                    onChange={(e) => {
                      setMessageText(e.target.value);
                      handleTyping();
                    }}
                    placeholder="Type a message..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Smile className="h-5 w-5 text-gray-400" />
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={!messageText.trim()}
                  className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  <Send className="h-5 w-5" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="text-gray-400 mb-4">
                <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
              <p className="text-gray-600">Choose a chat from the sidebar to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}