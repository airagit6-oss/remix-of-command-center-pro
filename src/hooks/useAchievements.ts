/**
 * useAchievements Hook - React hook for achievement integration
 * Use this hook in any component to access achievement system
 */

import { useState, useCallback, useEffect } from 'react';

interface AchievementData {
  currentLevel: number;
  currentRank: string;
  totalXP: number;
  currentXP: number;
  xpNeeded: number;
  currentStreak: number;
  leaderboardRank: number;
  userBadges: any[];
  userTrophies: any[];
  userRewards: any[];
}

interface UseAchievementsReturn {
  achievement: AchievementData | null;
  loading: boolean;
  error: string | null;
  logActivity: (activityType: string, value: number, metadata?: any) => Promise<any>;
  claimReward: (rewardId: string) => Promise<any>;
  refreshProfile: () => Promise<void>;
  progress: number;
}

export const useAchievements = (userId?: string): UseAchievementsReturn => {
  const [achievement, setAchievement] = useState<AchievementData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch profile
  const fetchProfile = useCallback(async () => {
    if (!userId) return;
    try {
      const response = await fetch(`/api/achievements/profile/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAchievement(data);
        setError(null);
      } else {
        throw new Error('Failed to fetch profile');
      }
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchProfile();
    }
  }, [userId, fetchProfile]);

  // Log activity
  const logActivity = useCallback(
    async (activityType: string, value: number, metadata?: any) => {
      try {
        const response = await fetch('/api/achievements/xp/log', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            activityType,
            activityValue: value,
            metadata,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          // Refresh profile to get updated data
          await fetchProfile();
          return data;
        } else {
          throw new Error('Failed to log activity');
        }
      } catch (err: any) {
        console.error('Error logging activity:', err);
        throw err;
      }
    },
    [fetchProfile]
  );

  // Claim reward
  const claimReward = useCallback(async (rewardId: string) => {
    try {
      const response = await fetch(`/api/achievements/rewards/${rewardId}/claim`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        await fetchProfile();
        return data;
      } else {
        throw new Error('Failed to claim reward');
      }
    } catch (err: any) {
      console.error('Error claiming reward:', err);
      throw err;
    }
  }, [fetchProfile]);

  // Calculate progress percentage
  const progress = achievement
    ? ((achievement.currentXP || 0) / (achievement.xpNeeded || 100)) * 100
    : 0;

  return {
    achievement,
    loading,
    error,
    logActivity,
    claimReward,
    refreshProfile: fetchProfile,
    progress,
  };
};

export default useAchievements;
