/*
  # Comprehensive CareerNest Database Schema

  1. Core Tables
    - Enhanced profiles with all required fields
    - Posts with media support and engagement tracking
    - Comments with threading support
    - Real-time messaging system
    - Course and mentorship marketplace
    - Groups and communities
    - Company pages
    - Notifications system

  2. Security
    - Row Level Security on all tables
    - Comprehensive policies for all user roles
    - Audit trails and security logging

  3. Performance
    - Optimized indexes for search and filtering
    - Materialized views for analytics
    - Efficient pagination support
*/

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "btree_gin";

-- Enhanced profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS cover_image_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS date_of_birth DATE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS gender TEXT CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say'));
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS experience_level TEXT CHECK (experience_level IN ('entry', 'mid', 'senior', 'executive'));
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS availability_status TEXT DEFAULT 'available' CHECK (availability_status IN ('available', 'busy', 'away', 'offline'));
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'UTC';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS languages JSONB DEFAULT '[]';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS social_links JSONB DEFAULT '{}';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS skills JSONB DEFAULT '[]';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS interests JSONB DEFAULT '[]';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS certifications JSONB DEFAULT '[]';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS portfolio_items JSONB DEFAULT '[]';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS verification_type TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_active_at TIMESTAMPTZ DEFAULT now();
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS profile_views_count INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS followers_count INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS following_count INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS posts_count INTEGER DEFAULT 0;

-- Experience table
CREATE TABLE IF NOT EXISTS experiences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  position TEXT NOT NULL,
  location TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  is_current BOOLEAN DEFAULT false,
  description TEXT,
  skills_used JSONB DEFAULT '[]',
  achievements JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Education table
CREATE TABLE IF NOT EXISTS education (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  institution_name TEXT NOT NULL,
  degree TEXT NOT NULL,
  field_of_study TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  is_current BOOLEAN DEFAULT false,
  grade TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enhanced posts table
ALTER TABLE posts ADD COLUMN IF NOT EXISTS media_type TEXT CHECK (media_type IN ('image', 'video', 'document', 'link'));
ALTER TABLE posts ADD COLUMN IF NOT EXISTS media_metadata JSONB DEFAULT '{}';
ALTER TABLE posts ADD COLUMN IF NOT EXISTS hashtags JSONB DEFAULT '[]';
ALTER TABLE posts ADD COLUMN IF NOT EXISTS mentions JSONB DEFAULT '[]';
ALTER TABLE posts ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS shares_count INTEGER DEFAULT 0;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS views_count INTEGER DEFAULT 0;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS is_pinned BOOLEAN DEFAULT false;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS scheduled_at TIMESTAMPTZ;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS edited_at TIMESTAMPTZ;

-- Post shares table
CREATE TABLE IF NOT EXISTS post_shares (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  share_type TEXT DEFAULT 'repost' CHECK (share_type IN ('repost', 'quote', 'external')),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(post_id, user_id, share_type)
);

-- Enhanced post_comments table
ALTER TABLE post_comments ADD COLUMN IF NOT EXISTS likes_count INTEGER DEFAULT 0;
ALTER TABLE post_comments ADD COLUMN IF NOT EXISTS replies_count INTEGER DEFAULT 0;
ALTER TABLE post_comments ADD COLUMN IF NOT EXISTS is_edited BOOLEAN DEFAULT false;
ALTER TABLE post_comments ADD COLUMN IF NOT EXISTS edited_at TIMESTAMPTZ;

-- Comment likes table
CREATE TABLE IF NOT EXISTS comment_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  comment_id UUID REFERENCES post_comments(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(comment_id, user_id)
);

-- Follows table
ALTER TABLE follows ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'following' CHECK (status IN ('following', 'pending', 'blocked'));
ALTER TABLE follows ADD COLUMN IF NOT EXISTS notification_enabled BOOLEAN DEFAULT true;

-- Messages table for real-time chat
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT DEFAULT 'direct' CHECK (type IN ('direct', 'group')),
  name TEXT,
  description TEXT,
  avatar_url TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  last_message_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS conversation_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'moderator', 'member')),
  joined_at TIMESTAMPTZ DEFAULT now(),
  last_read_at TIMESTAMPTZ DEFAULT now(),
  is_muted BOOLEAN DEFAULT false,
  UNIQUE(conversation_id, user_id)
);

CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'video', 'audio', 'file', 'system')),
  media_url TEXT,
  media_metadata JSONB DEFAULT '{}',
  reply_to_id UUID REFERENCES messages(id),
  is_edited BOOLEAN DEFAULT false,
  edited_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

-- Message reactions
CREATE TABLE IF NOT EXISTS message_reactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  message_id UUID REFERENCES messages(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  emoji TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(message_id, user_id, emoji)
);

-- Groups/Communities
CREATE TABLE IF NOT EXISTS groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  avatar_url TEXT,
  cover_image_url TEXT,
  type TEXT DEFAULT 'public' CHECK (type IN ('public', 'private', 'secret')),
  category TEXT,
  tags JSONB DEFAULT '[]',
  rules TEXT,
  location TEXT,
  website_url TEXT,
  created_by UUID REFERENCES profiles(id),
  members_count INTEGER DEFAULT 0,
  posts_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS group_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'moderator', 'member')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'pending', 'banned')),
  joined_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(group_id, user_id)
);

-- Company/Organization pages
CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  cover_image_url TEXT,
  industry TEXT,
  company_size TEXT,
  founded_year INTEGER,
  headquarters TEXT,
  website_url TEXT,
  social_links JSONB DEFAULT '{}',
  specialties JSONB DEFAULT '[]',
  created_by UUID REFERENCES profiles(id),
  followers_count INTEGER DEFAULT 0,
  employees_count INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS company_employees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  position TEXT,
  department TEXT,
  start_date DATE,
  end_date DATE,
  is_current BOOLEAN DEFAULT true,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Courses and Learning
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  instructor_id UUID REFERENCES profiles(id),
  category TEXT,
  subcategory TEXT,
  level TEXT CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  duration_hours INTEGER,
  price DECIMAL(10,2),
  currency TEXT DEFAULT 'USD',
  is_free BOOLEAN DEFAULT false,
  language TEXT DEFAULT 'en',
  requirements JSONB DEFAULT '[]',
  learning_outcomes JSONB DEFAULT '[]',
  tags JSONB DEFAULT '[]',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  enrolled_count INTEGER DEFAULT 0,
  rating_average DECIMAL(3,2) DEFAULT 0,
  rating_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS course_modules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL,
  duration_minutes INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS course_lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  module_id UUID REFERENCES course_modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  video_url TEXT,
  duration_minutes INTEGER,
  order_index INTEGER NOT NULL,
  lesson_type TEXT DEFAULT 'video' CHECK (lesson_type IN ('video', 'text', 'quiz', 'assignment')),
  resources JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS course_enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  progress_percentage INTEGER DEFAULT 0,
  last_accessed_at TIMESTAMPTZ DEFAULT now(),
  certificate_issued BOOLEAN DEFAULT false,
  UNIQUE(course_id, user_id)
);

CREATE TABLE IF NOT EXISTS lesson_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  enrollment_id UUID REFERENCES course_enrollments(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES course_lessons(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ,
  time_spent_minutes INTEGER DEFAULT 0,
  UNIQUE(enrollment_id, lesson_id)
);

-- Mentorship system
CREATE TABLE IF NOT EXISTS mentorship_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mentor_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  hourly_rate DECIMAL(10,2),
  currency TEXT DEFAULT 'USD',
  availability_hours JSONB DEFAULT '{}',
  expertise_areas JSONB DEFAULT '[]',
  mentorship_style TEXT,
  max_mentees INTEGER DEFAULT 10,
  current_mentees INTEGER DEFAULT 0,
  total_sessions INTEGER DEFAULT 0,
  rating_average DECIMAL(3,2) DEFAULT 0,
  rating_count INTEGER DEFAULT 0,
  is_accepting_mentees BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(mentor_id)
);

CREATE TABLE IF NOT EXISTS mentorship_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mentor_id UUID REFERENCES profiles(id),
  mentee_id UUID REFERENCES profiles(id),
  title TEXT,
  description TEXT,
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled', 'no_show')),
  meeting_url TEXT,
  notes TEXT,
  mentor_feedback TEXT,
  mentee_feedback TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  price DECIMAL(10,2),
  currency TEXT DEFAULT 'USD',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Notifications system
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('like', 'comment', 'follow', 'mention', 'message', 'course', 'mentorship', 'group', 'company')),
  title TEXT NOT NULL,
  content TEXT,
  entity_type TEXT,
  entity_id UUID,
  actor_id UUID REFERENCES profiles(id),
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Search and discovery
CREATE TABLE IF NOT EXISTS search_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  query TEXT NOT NULL,
  search_type TEXT DEFAULT 'global' CHECK (search_type IN ('global', 'people', 'posts', 'courses', 'groups', 'companies')),
  results_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Analytics and metrics
CREATE TABLE IF NOT EXISTS user_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  metric_type TEXT NOT NULL,
  metric_value INTEGER DEFAULT 0,
  date DATE DEFAULT CURRENT_DATE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, metric_type, date)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_location ON profiles(location);
CREATE INDEX IF NOT EXISTS idx_profiles_skills ON profiles USING GIN(skills);
CREATE INDEX IF NOT EXISTS idx_profiles_last_active ON profiles(last_active_at);

CREATE INDEX IF NOT EXISTS idx_posts_author_created ON posts(author_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_type ON posts(type);
CREATE INDEX IF NOT EXISTS idx_posts_visibility ON posts(visibility);
CREATE INDEX IF NOT EXISTS idx_posts_hashtags ON posts USING GIN(hashtags);

CREATE INDEX IF NOT EXISTS idx_messages_conversation_created ON messages(conversation_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);

CREATE INDEX IF NOT EXISTS idx_courses_category ON courses(category);
CREATE INDEX IF NOT EXISTS idx_courses_level ON courses(level);
CREATE INDEX IF NOT EXISTS idx_courses_rating ON courses(rating_average DESC);

CREATE INDEX IF NOT EXISTS idx_notifications_user_created ON notifications(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(user_id, is_read, created_at DESC);

-- Full-text search indexes
CREATE INDEX IF NOT EXISTS idx_profiles_search ON profiles USING GIN(to_tsvector('english', coalesce(full_name, '') || ' ' || coalesce(headline, '') || ' ' || coalesce(bio, '')));
CREATE INDEX IF NOT EXISTS idx_posts_search ON posts USING GIN(to_tsvector('english', content));
CREATE INDEX IF NOT EXISTS idx_courses_search ON courses USING GIN(to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, '')));

-- Enable RLS on all tables
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE comment_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentorship_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentorship_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Experiences
CREATE POLICY "Users can view public experiences" ON experiences FOR SELECT USING (true);
CREATE POLICY "Users can manage own experiences" ON experiences FOR ALL USING (profile_id = auth.uid());

-- Education
CREATE POLICY "Users can view public education" ON education FOR SELECT USING (true);
CREATE POLICY "Users can manage own education" ON education FOR ALL USING (profile_id = auth.uid());

-- Post shares
CREATE POLICY "Users can view public shares" ON post_shares FOR SELECT USING (true);
CREATE POLICY "Users can manage own shares" ON post_shares FOR ALL USING (user_id = auth.uid());

-- Comment likes
CREATE POLICY "Users can view comment likes" ON comment_likes FOR SELECT USING (true);
CREATE POLICY "Users can manage own comment likes" ON comment_likes FOR ALL USING (user_id = auth.uid());

-- Conversations
CREATE POLICY "Users can view own conversations" ON conversations FOR SELECT USING (
  id IN (SELECT conversation_id FROM conversation_participants WHERE user_id = auth.uid())
);
CREATE POLICY "Users can create conversations" ON conversations FOR INSERT WITH CHECK (created_by = auth.uid());

-- Conversation participants
CREATE POLICY "Users can view conversation participants" ON conversation_participants FOR SELECT USING (
  conversation_id IN (SELECT conversation_id FROM conversation_participants WHERE user_id = auth.uid())
);
CREATE POLICY "Admins can manage participants" ON conversation_participants FOR ALL USING (
  conversation_id IN (
    SELECT conversation_id FROM conversation_participants 
    WHERE user_id = auth.uid() AND role IN ('admin', 'moderator')
  )
);

-- Messages
CREATE POLICY "Users can view conversation messages" ON messages FOR SELECT USING (
  conversation_id IN (SELECT conversation_id FROM conversation_participants WHERE user_id = auth.uid())
);
CREATE POLICY "Users can send messages" ON messages FOR INSERT WITH CHECK (
  sender_id = auth.uid() AND 
  conversation_id IN (SELECT conversation_id FROM conversation_participants WHERE user_id = auth.uid())
);
CREATE POLICY "Users can edit own messages" ON messages FOR UPDATE USING (sender_id = auth.uid());

-- Groups
CREATE POLICY "Users can view public groups" ON groups FOR SELECT USING (type = 'public' OR id IN (
  SELECT group_id FROM group_members WHERE user_id = auth.uid()
));
CREATE POLICY "Users can create groups" ON groups FOR INSERT WITH CHECK (created_by = auth.uid());
CREATE POLICY "Admins can manage groups" ON groups FOR UPDATE USING (
  id IN (SELECT group_id FROM group_members WHERE user_id = auth.uid() AND role = 'admin')
);

-- Courses
CREATE POLICY "Users can view published courses" ON courses FOR SELECT USING (status = 'published');
CREATE POLICY "Instructors can manage own courses" ON courses FOR ALL USING (instructor_id = auth.uid());

-- Notifications
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (user_id = auth.uid());

-- Functions for real-time updates
CREATE OR REPLACE FUNCTION update_last_message_at()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversations 
  SET last_message_at = NEW.created_at, updated_at = NEW.created_at
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_conversation_last_message
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_last_message_at();

-- Function to increment counters
CREATE OR REPLACE FUNCTION increment_counter(table_name TEXT, counter_column TEXT, id_column TEXT, id_value UUID)
RETURNS VOID AS $$
BEGIN
  EXECUTE format('UPDATE %I SET %I = %I + 1 WHERE %I = $1', table_name, counter_column, counter_column, id_column)
  USING id_value;
END;
$$ LANGUAGE plpgsql;

-- Function to decrement counters
CREATE OR REPLACE FUNCTION decrement_counter(table_name TEXT, counter_column TEXT, id_column TEXT, id_value UUID)
RETURNS VOID AS $$
BEGIN
  EXECUTE format('UPDATE %I SET %I = GREATEST(%I - 1, 0) WHERE %I = $1', table_name, counter_column, counter_column, id_column)
  USING id_value;
END;
$$ LANGUAGE plpgsql;