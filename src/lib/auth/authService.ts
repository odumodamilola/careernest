// Enterprise-grade authentication service
// Based on patterns from Stripe, Auth0, and AWS Cognito implementations

import { supabase } from '../supabase';
import { User } from '@supabase/supabase-js';
import { toast } from 'sonner';

export interface EnterpriseUser {
  id: string;
  email: string;
  role: 'admin' | 'premium' | 'standard' | 'trial';
  planTier: 'enterprise' | 'pro' | 'starter' | 'free';
  creditQuota: number;
  creditsUsed: number;
  profileData: any;
  lastActivity: string;
  emailVerified: boolean;
  mfaEnabled: boolean;
  accountLocked: boolean;
  createdAt: string;
}

export interface AuthResponse {
  user: EnterpriseUser | null;
  session: any;
  error: string | null;
}

export interface CreditCheckResult {
  available: number;
  canProceed: boolean;
  planLimit: number;
}

class EnterpriseAuthService {
  private retryAttempts = 3;
  private retryDelay = 1000; // 1 second base delay

  // Circuit breaker pattern for database failures
  private async withRetry<T>(operation: () => Promise<T>): Promise<T> {
    let lastError: Error;
    
    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      try {
        return await operation();
      } catch (error: any) {
        lastError = error;
        
        if (attempt === this.retryAttempts) {
          throw error;
        }
        
        // Exponential backoff
        const delay = this.retryDelay * Math.pow(2, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw lastError!;
  }

  // Enhanced user registration with enterprise features
  async registerUser(
    email: string, 
    password: string, 
    userData: {
      fullName: string;
      role?: string;
      planTier?: string;
      acceptedTerms: boolean;
      acceptedPrivacy: boolean;
    }
  ): Promise<AuthResponse> {
    try {
      if (!userData.acceptedTerms || !userData.acceptedPrivacy) {
        throw new Error('Terms and privacy policy must be accepted');
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Invalid email format');
      }

      // Validate password strength
      if (password.length < 8) {
        throw new Error('Password must be at least 8 characters long');
      }

      const { data, error } = await this.withRetry(async () => {
        return await supabase.auth.signUp({
          email: email.toLowerCase().trim(),
          password,
          options: {
            data: {
              full_name: userData.fullName,
              role: userData.role || 'trial'
            }
          }
        });
      });

      if (error) throw error;

      if (data.user) {
        // Create enterprise user profile
        const { error: profileError } = await supabase
          .from('users')
          .insert([{
            id: data.user.id,
            email: data.user.email,
            role: userData.role || 'trial',
            plan_tier: userData.planTier || 'free',
            profile_data: {
              full_name: userData.fullName,
              onboarding_completed: false
            },
            terms_accepted_at: new Date().toISOString(),
            privacy_accepted_at: new Date().toISOString(),
            email_verified: false
          }]);

        if (profileError) {
          console.error('Profile creation error:', profileError);
          // Don't throw here - user was created successfully
        }

        // Log security event
        await this.logSecurityEvent(data.user.id, 'registration_success', 'info');

        return {
          user: await this.mapToEnterpriseUser(data.user),
          session: data.session,
          error: null
        };
      }

      return { user: null, session: null, error: 'Registration failed' };
    } catch (error: any) {
      console.error('Registration error:', error);
      return {
        user: null,
        session: null,
        error: this.getAuthErrorMessage(error)
      };
    }
  }

  // Enhanced login with security monitoring
  async loginUser(email: string, password: string, ipAddress?: string): Promise<AuthResponse> {
    try {
      const { data, error } = await this.withRetry(async () => {
        return await supabase.auth.signInWithPassword({
          email: email.toLowerCase().trim(),
          password
        });
      });

      if (error) {
        // Log failed login attempt
        await this.logFailedLogin(email, ipAddress);
        throw error;
      }

      if (data.user) {
        // Update login statistics
        await this.updateLoginStats(data.user.id, ipAddress);
        
        // Log successful login
        await this.logSecurityEvent(data.user.id, 'login_success', 'info', ipAddress);

        // Create session record
        await this.createSessionRecord(data.user.id, data.session, ipAddress);

        return {
          user: await this.mapToEnterpriseUser(data.user),
          session: data.session,
          error: null
        };
      }

      return { user: null, session: null, error: 'Login failed' };
    } catch (error: any) {
      console.error('Login error:', error);
      return {
        user: null,
        session: null,
        error: this.getAuthErrorMessage(error)
      };
    }
  }

  // Get current user with enterprise data
  async getCurrentUser(): Promise<EnterpriseUser | null> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error || !user) return null;

      return await this.mapToEnterpriseUser(user);
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  // Credit management system
  async checkCredits(userId: string, requiredCredits: number): Promise<CreditCheckResult> {
    try {
      const { data: user, error } = await supabase
        .from('users')
        .select('credit_quota, credits_used, plan_tier')
        .eq('id', userId)
        .maybeSingle();

      if (error || !user) {
        throw new Error('Failed to check credits');
      }

      const available = user.credit_quota - user.credits_used;
      
      return {
        available,
        canProceed: available >= requiredCredits,
        planLimit: user.credit_quota
      };
    } catch (error: any) {
      console.error('Credit check error:', error);
      return { available: 0, canProceed: false, planLimit: 0 };
    }
  }

  // Consume credits with atomic transaction
  async consumeCredits(
    userId: string, 
    credits: number, 
    actionType: string, 
    featureUsed?: string
  ): Promise<boolean> {
    try {
      const { data, error } = await supabase.rpc('consume_user_credits', {
        user_uuid: userId,
        credits_to_consume: credits,
        action_type_param: actionType,
        feature_used_param: featureUsed
      });

      if (error) throw error;

      return data;
    } catch (error: any) {
      console.error('Credit consumption error:', error);
      return false;
    }
  }

  // Check feature access based on plan
  async checkFeatureAccess(userId: string, featureName: string): Promise<boolean> {
    try {
      const { data: user } = await supabase
        .from('users')
        .select('plan_tier')
        .eq('id', userId)
        .maybeSingle();

      if (!user) return false;

      const { data: feature } = await supabase
        .from('plan_features')
        .select('is_enabled, feature_limit')
        .eq('plan_tier', user.plan_tier)
        .eq('feature_name', featureName)
        .maybeSingle();

      return feature?.is_enabled || false;
    } catch (error) {
      console.error('Feature access check error:', error);
      return false;
    }
  }

  // Enhanced logout with session cleanup
  async logoutUser(): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Deactivate all sessions
        await supabase
          .from('user_sessions')
          .update({ is_active: false })
          .eq('user_id', user.id);

        // Log security event
        await this.logSecurityEvent(user.id, 'logout', 'info');
      }

      await supabase.auth.signOut();
    } catch (error: any) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  // Password reset with security logging
  async resetPassword(email: string): Promise<void> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) throw error;

      // Log password reset request
      const { data: user } = await supabase
        .from('users')
        .select('id')
        .eq('email', email.toLowerCase().trim())
        .maybeSingle();

      if (user) {
        await this.logSecurityEvent(user.id, 'password_reset_requested', 'medium');
      }
    } catch (error: any) {
      console.error('Password reset error:', error);
      throw error;
    }
  }

  // Update password with security validation
  async updatePassword(newPassword: string): Promise<void> {
    try {
      if (newPassword.length < 8) {
        throw new Error('Password must be at least 8 characters long');
      }

      const { data: { user }, error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      if (user) {
        await this.logSecurityEvent(user.id, 'password_change', 'medium');
      }
    } catch (error: any) {
      console.error('Password update error:', error);
      throw error;
    }
  }

  // Private helper methods

  private async mapToEnterpriseUser(user: User): Promise<EnterpriseUser> {
    try {
      const { data: userData, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user data:', error);
      }

      return {
        id: user.id,
        email: user.email!,
        role: userData?.role || 'trial',
        planTier: userData?.plan_tier || 'free',
        creditQuota: userData?.credit_quota || 100,
        creditsUsed: userData?.credits_used || 0,
        profileData: userData?.profile_data || {},
        lastActivity: userData?.last_activity || user.created_at,
        emailVerified: userData?.email_verified || false,
        mfaEnabled: userData?.security_settings?.mfa_enabled || false,
        accountLocked: !!userData?.account_locked_until,
        createdAt: user.created_at
      };
    } catch (error) {
      console.error('Error mapping user data:', error);
      // Return basic user data if enterprise data fetch fails
      return {
        id: user.id,
        email: user.email!,
        role: 'trial',
        planTier: 'free',
        creditQuota: 100,
        creditsUsed: 0,
        profileData: {},
        lastActivity: user.created_at,
        emailVerified: false,
        mfaEnabled: false,
        accountLocked: false,
        createdAt: user.created_at
      };
    }
  }

  private async updateLoginStats(userId: string, ipAddress?: string): Promise<void> {
    try {
      await supabase
        .from('users')
        .update({
          last_login_at: new Date().toISOString(),
          login_count: supabase.sql`login_count + 1`,
          failed_login_attempts: 0,
          last_activity: new Date().toISOString()
        })
        .eq('id', userId);
    } catch (error) {
      console.error('Error updating login stats:', error);
    }
  }

  private async createSessionRecord(userId: string, session: any, ipAddress?: string): Promise<void> {
    try {
      await supabase
        .from('user_sessions')
        .insert([{
          user_id: userId,
          session_token: session.access_token,
          refresh_token: session.refresh_token,
          ip_address: ipAddress,
          user_agent: navigator.userAgent,
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
        }]);
    } catch (error) {
      console.error('Error creating session record:', error);
    }
  }

  private async logFailedLogin(email: string, ipAddress?: string): Promise<void> {
    try {
      const { data: user } = await supabase
        .from('users')
        .select('id, failed_login_attempts')
        .eq('email', email.toLowerCase().trim())
        .maybeSingle();

      if (user) {
        // Increment failed attempts
        const newFailedAttempts = (user.failed_login_attempts || 0) + 1;
        
        await supabase
          .from('users')
          .update({
            failed_login_attempts: newFailedAttempts,
            account_locked_until: newFailedAttempts >= 5 ? 
              new Date(Date.now() + 30 * 60 * 1000).toISOString() : // Lock for 30 minutes
              null
          })
          .eq('id', user.id);

        await this.logSecurityEvent(
          user.id, 
          'login_failure', 
          newFailedAttempts >= 5 ? 'high' : 'medium',
          ipAddress
        );
      }
    } catch (error) {
      console.error('Error logging failed login:', error);
    }
  }

  private async logSecurityEvent(
    userId: string,
    eventType: string,
    severity: string = 'info',
    ipAddress?: string
  ): Promise<void> {
    try {
      await supabase.rpc('log_security_event', {
        user_uuid: userId,
        event_type_param: eventType,
        severity_param: severity,
        ip_address_param: ipAddress,
        user_agent_param: navigator.userAgent,
        metadata_param: {
          timestamp: new Date().toISOString(),
          url: window.location.href
        }
      });
    } catch (error) {
      console.error('Error logging security event:', error);
    }
  }

  private getAuthErrorMessage(error: any): string {
    if (!error) return 'An unknown error occurred';
    
    const message = error.message?.toLowerCase() || '';
    
    if (message.includes('invalid login credentials')) {
      return 'Invalid email or password. Please check your credentials and try again.';
    }
    
    if (message.includes('email not confirmed')) {
      return 'Please check your email and click the confirmation link before signing in.';
    }
    
    if (message.includes('user already registered')) {
      return 'An account with this email already exists. Please sign in instead.';
    }
    
    if (message.includes('password should be at least')) {
      return 'Password must be at least 8 characters long.';
    }
    
    if (message.includes('invalid email')) {
      return 'Please enter a valid email address.';
    }
    
    if (message.includes('signup is disabled')) {
      return 'Account registration is currently disabled. Please contact support.';
    }
    
    if (message.includes('rate limit')) {
      return 'Too many attempts. Please wait a moment before trying again.';
    }
    
    if (message.includes('account locked')) {
      return 'Account temporarily locked due to multiple failed login attempts. Please try again later.';
    }
    
    return error.message || 'An error occurred during authentication';
  }

  // Admin functions for user management
  async getUserAnalytics(userId: string): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('activity_logs')
        .select('action, created_at, metadata')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching user analytics:', error);
      return [];
    }
  }

  async getSecurityEvents(userId: string): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('security_events')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching security events:', error);
      return [];
    }
  }

  // Session management
  async getActiveSessions(userId: string): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('user_sessions')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching sessions:', error);
      return [];
    }
  }

  async revokeSession(sessionId: string): Promise<void> {
    try {
      await supabase
        .from('user_sessions')
        .update({ is_active: false })
        .eq('id', sessionId);
    } catch (error) {
      console.error('Error revoking session:', error);
    }
  }

  // Cleanup expired sessions (should be called periodically)
  async cleanupExpiredSessions(): Promise<number> {
    try {
      const { data, error } = await supabase.rpc('cleanup_expired_sessions');
      if (error) throw error;
      return data || 0;
    } catch (error) {
      console.error('Error cleaning up sessions:', error);
      return 0;
    }
  }
}

// Export singleton instance
export const authService = new EnterpriseAuthService();