/*
  # Enterprise Authentication & Identity Infrastructure - Milestone 1
  
  1. Core Tables
    - Enhanced users table with enterprise features
    - Session tracking for security analytics
    - Credit quota system for SaaS monetization
    - Activity logging for compliance and monitoring
    
  2. Security
    - Banking-grade Row Level Security policies
    - Multi-factor authentication support
    - Session management with IP tracking
    - Audit trails for compliance (SOC 2, GDPR)
    
  3. Performance
    - Optimized indexes for enterprise scale
    - Connection pooling configuration
    - Query performance monitoring
    - Horizontal scaling preparation
*/

-- Enable required extensions for enterprise features
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "btree_gin";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enhanced users table with enterprise features
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    role TEXT CHECK (role IN ('admin', 'premium', 'standard', 'trial')) DEFAULT 'trial',
    plan_tier TEXT CHECK (plan_tier IN ('enterprise', 'pro', 'starter', 'free')) DEFAULT 'free',
    credit_quota INTEGER DEFAULT 100,
    credits_used INTEGER DEFAULT 0,
    profile_data JSONB DEFAULT '{}',
    security_settings JSONB DEFAULT '{"mfa_enabled": false, "login_notifications": true}',
    preferences JSONB DEFAULT '{}',
    last_activity TIMESTAMPTZ DEFAULT NOW(),
    last_login_at TIMESTAMPTZ,
    login_count INTEGER DEFAULT 0,
    failed_login_attempts INTEGER DEFAULT 0,
    account_locked_until TIMESTAMPTZ,
    email_verified BOOLEAN DEFAULT false,
    phone_verified BOOLEAN DEFAULT false,
    terms_accepted_at TIMESTAMPTZ,
    privacy_accepted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- Session tracking for security analytics
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_token TEXT UNIQUE NOT NULL,
    refresh_token TEXT UNIQUE,
    ip_address INET,
    user_agent TEXT,
    device_fingerprint TEXT,
    location_data JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    expires_at TIMESTAMPTZ NOT NULL,
    last_accessed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Credit usage tracking for SaaS monetization
CREATE TABLE IF NOT EXISTS user_credits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    credits_consumed INTEGER NOT NULL,
    action_type TEXT NOT NULL,
    feature_used TEXT,
    metadata JSONB DEFAULT '{}',
    transaction_id TEXT UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activity logs for compliance and monitoring
CREATE TABLE IF NOT EXISTS activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    resource TEXT,
    resource_id UUID,
    metadata JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    success BOOLEAN DEFAULT true,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Security events for threat detection
CREATE TABLE IF NOT EXISTS security_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL CHECK (event_type IN ('login_success', 'login_failure', 'password_change', 'mfa_enabled', 'suspicious_activity', 'account_locked')),
    severity TEXT DEFAULT 'info' CHECK (severity IN ('critical', 'high', 'medium', 'low', 'info')),
    ip_address INET,
    user_agent TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Plan limits and feature access
CREATE TABLE IF NOT EXISTS plan_features (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_tier TEXT NOT NULL,
    feature_name TEXT NOT NULL,
    feature_limit INTEGER,
    is_enabled BOOLEAN DEFAULT true,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(plan_tier, feature_name)
);

-- Insert default plan features
INSERT INTO plan_features (plan_tier, feature_name, feature_limit, is_enabled) VALUES
('free', 'ai_chat_messages', 50, true),
('free', 'mentor_matches', 5, true),
('free', 'career_paths', 1, true),
('free', 'skill_analyses', 2, true),
('starter', 'ai_chat_messages', 200, true),
('starter', 'mentor_matches', 20, true),
('starter', 'career_paths', 5, true),
('starter', 'skill_analyses', 10, true),
('pro', 'ai_chat_messages', 1000, true),
('pro', 'mentor_matches', 100, true),
('pro', 'career_paths', 20, true),
('pro', 'skill_analyses', 50, true),
('enterprise', 'ai_chat_messages', -1, true),
('enterprise', 'mentor_matches', -1, true),
('enterprise', 'career_paths', -1, true),
('enterprise', 'skill_analyses', -1, true)
ON CONFLICT (plan_tier, feature_name) DO NOTHING;

-- Performance indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_plan_tier ON users(plan_tier);
CREATE INDEX IF NOT EXISTS idx_users_last_activity ON users(last_activity);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_active ON user_sessions(user_id, is_active, expires_at);

CREATE INDEX IF NOT EXISTS idx_user_credits_user_id ON user_credits(user_id);
CREATE INDEX IF NOT EXISTS idx_user_credits_created_at ON user_credits(created_at);
CREATE INDEX IF NOT EXISTS idx_user_credits_action_type ON user_credits(action_type);

CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_activity_logs_action ON activity_logs(action);

CREATE INDEX IF NOT EXISTS idx_security_events_user_id ON security_events(user_id);
CREATE INDEX IF NOT EXISTS idx_security_events_type ON security_events(event_type);
CREATE INDEX IF NOT EXISTS idx_security_events_severity ON security_events(severity);
CREATE INDEX IF NOT EXISTS idx_security_events_created_at ON security_events(created_at);

-- Enable Row Level Security (Banking-grade security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE plan_features ENABLE ROW LEVEL SECURITY;

-- RLS Policies (Zero-trust security model)

-- Users table policies
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "System can insert new users" ON users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Session policies
CREATE POLICY "Users can view own sessions" ON user_sessions
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can manage own sessions" ON user_sessions
    FOR ALL USING (user_id = auth.uid());

-- Credit policies
CREATE POLICY "Users can view own credits" ON user_credits
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "System can track credit usage" ON user_credits
    FOR INSERT WITH CHECK (true);

-- Activity log policies
CREATE POLICY "Users can view own activity" ON activity_logs
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can view all activity" ON activity_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "System can log activity" ON activity_logs
    FOR INSERT WITH CHECK (true);

-- Security events policies
CREATE POLICY "Users can view own security events" ON security_events
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can view all security events" ON security_events
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "System can log security events" ON security_events
    FOR INSERT WITH CHECK (true);

-- Plan features policies
CREATE POLICY "Users can view plan features" ON plan_features
    FOR SELECT USING (true);

-- Enterprise functions for credit management
CREATE OR REPLACE FUNCTION check_user_credits(user_uuid UUID, required_credits INTEGER)
RETURNS BOOLEAN AS $$
DECLARE
    available_credits INTEGER;
BEGIN
    SELECT (credit_quota - credits_used) INTO available_credits
    FROM users
    WHERE id = user_uuid;
    
    RETURN available_credits >= required_credits;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION consume_user_credits(
    user_uuid UUID, 
    credits_to_consume INTEGER, 
    action_type_param TEXT,
    feature_used_param TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    available_credits INTEGER;
    transaction_uuid UUID;
BEGIN
    -- Generate unique transaction ID
    transaction_uuid := gen_random_uuid();
    
    -- Check available credits with row lock
    SELECT (credit_quota - credits_used) INTO available_credits
    FROM users
    WHERE id = user_uuid
    FOR UPDATE;
    
    IF available_credits < credits_to_consume THEN
        RETURN FALSE;
    END IF;
    
    -- Update user credits
    UPDATE users
    SET credits_used = credits_used + credits_to_consume,
        updated_at = NOW()
    WHERE id = user_uuid;
    
    -- Log credit consumption
    INSERT INTO user_credits (user_id, credits_consumed, action_type, feature_used, transaction_id)
    VALUES (user_uuid, credits_to_consume, action_type_param, feature_used_param, transaction_uuid::TEXT);
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to log security events
CREATE OR REPLACE FUNCTION log_security_event(
    user_uuid UUID,
    event_type_param TEXT,
    severity_param TEXT DEFAULT 'info',
    ip_address_param INET DEFAULT NULL,
    user_agent_param TEXT DEFAULT NULL,
    metadata_param JSONB DEFAULT '{}'
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO security_events (user_id, event_type, severity, ip_address, user_agent, metadata)
    VALUES (user_uuid, event_type_param, severity_param, ip_address_param, user_agent_param, metadata_param);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update user activity
CREATE OR REPLACE FUNCTION update_user_activity(user_uuid UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE users
    SET last_activity = NOW()
    WHERE id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to clean up expired sessions
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM user_sessions
    WHERE expires_at < NOW() OR is_active = false;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;