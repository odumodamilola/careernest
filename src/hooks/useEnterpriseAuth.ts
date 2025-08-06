import { useEffect, useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { authService, CreditCheckResult } from '../lib/auth/authService';

export function useEnterpriseAuth() {
  const { user, loading, error, checkAuth } = useAuthStore();
  const [sessionInfo, setSessionInfo] = useState<any>(null);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const checkFeatureAccess = async (featureName: string): Promise<boolean> => {
    if (!user) return false;
    return await authService.checkFeatureAccess(user.id, featureName);
  };

  const checkCredits = async (requiredCredits: number): Promise<CreditCheckResult> => {
    if (!user) return { available: 0, canProceed: false, planLimit: 0 };
    return await authService.checkCredits(user.id, requiredCredits);
  };

  const consumeCredits = async (
    credits: number, 
    actionType: string, 
    feature?: string
  ): Promise<boolean> => {
    if (!user) return false;
    return await authService.consumeCredits(user.id, credits, actionType, feature);
  };

  const getActiveSessions = async () => {
    if (!user) return [];
    return await authService.getActiveSessions(user.id);
  };

  const revokeSession = async (sessionId: string) => {
    await authService.revokeSession(sessionId);
  };

  const isAdmin = user?.role === 'admin';
  const isPremium = user?.role === 'premium' || user?.role === 'admin';
  const hasCredits = user ? user.creditQuota - user.creditsUsed > 0 : false;

  return {
    user,
    loading,
    error,
    sessionInfo,
    isAuthenticated: !!user,
    isAdmin,
    isPremium,
    hasCredits,
    checkFeatureAccess,
    checkCredits,
    consumeCredits,
    getActiveSessions,
    revokeSession
  };
}