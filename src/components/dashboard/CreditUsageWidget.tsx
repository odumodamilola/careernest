import React from 'react';
import { useAuthStore } from '../../stores/authStore';
import { Zap, TrendingUp, AlertTriangle, Crown } from 'lucide-react';

export function CreditUsageWidget() {
  const { user } = useAuthStore();

  if (!user) return null;

  const creditUsagePercentage = (user.creditsUsed / user.creditQuota) * 100;
  const remainingCredits = user.creditQuota - user.creditsUsed;

  const getUsageColor = () => {
    if (creditUsagePercentage >= 90) return 'text-red-600 bg-red-100';
    if (creditUsagePercentage >= 75) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  const getProgressColor = () => {
    if (creditUsagePercentage >= 90) return 'bg-red-500';
    if (creditUsagePercentage >= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Zap className="h-5 w-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900">AI Credits</h3>
        </div>
        <div className="flex items-center space-x-2">
          <Crown className="h-4 w-4 text-purple-500" />
          <span className="text-sm font-medium text-purple-600 capitalize">
            {user.planTier} Plan
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {/* Usage Overview */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-gray-900">
              {remainingCredits}
            </div>
            <div className="text-sm text-gray-600">Credits remaining</div>
          </div>
          <div className="text-right">
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${getUsageColor()}`}>
              {creditUsagePercentage.toFixed(0)}% used
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {user.creditsUsed} / {user.creditQuota}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${getProgressColor()}`}
            style={{ width: `${Math.min(creditUsagePercentage, 100)}%` }}
          />
        </div>

        {/* Usage Breakdown */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-gray-700">AI Chat</span>
            </div>
            <div className="font-semibold text-blue-600">45 used</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-1">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-gray-700">Matching</span>
            </div>
            <div className="font-semibold text-purple-600">12 used</div>
          </div>
        </div>

        {/* Warning or Upgrade CTA */}
        {creditUsagePercentage >= 80 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-yellow-800">Running low on credits</p>
                <p className="text-yellow-700">
                  {remainingCredits < 10 ? 'Consider upgrading your plan' : 'Monitor your usage'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Upgrade Button */}
        {user.planTier === 'free' && (
          <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium text-sm">
            Upgrade Plan
          </button>
        )}
      </div>
    </div>
  );
}