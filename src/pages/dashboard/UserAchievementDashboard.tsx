import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import {
  Trophy,
  Award,
  Target,
  TrendingUp,
  Flame,
  Gift,
  Users,
  Clock,
  AlertCircle,
  Loader,
} from 'lucide-react';
import {
  AchievementNotificationManager,
} from '../../components/achievements/AchievementCelebrations';

export const UserAchievementDashboard: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  
  const [selectedTab, setSelectedTab] = useState<'overview' | 'badges' | 'trophies' | 'rewards' | 'challenges' | 'leaderboard'>('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);

  // API Data
  const [achievement, setAchievement] = useState<any>(null);
  const [challenges, setChallenges] = useState<any[]>([]);
  const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
  const [rewards, setRewards] = useState<any>(null);

  // Fetch achievement profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/achievements/profile/${user?.id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        if (!response.ok) throw new Error('Failed to fetch profile');
        const data = await response.json();
        setAchievement(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (user?.id) fetchProfile();
  }, [user?.id]);

  // Fetch challenges
  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const response = await fetch('/api/achievements/challenges/active', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        if (response.ok) {
          const data = await response.json();
          setChallenges(data.challenges || []);
        }
      } catch (err) {
        console.error('Error fetching challenges:', err);
      }
    };
    fetchChallenges();
  }, []);

  // Fetch leaderboard
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch('/api/achievements/leaderboard?limit=100', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        if (response.ok) {
          const data = await response.json();
          setLeaderboardData(data.leaderboard || []);
        }
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
      }
    };
    fetchLeaderboard();
  }, []);

  // Fetch rewards
  useEffect(() => {
    const fetchRewards = async () => {
      try {
        const response = await fetch('/api/achievements/rewards', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        if (response.ok) {
          const data = await response.json();
          setRewards(data);
        }
      } catch (err) {
        console.error('Error fetching rewards:', err);
      }
    };
    fetchRewards();
  }, []);

  // Log activity
  const logActivity = useCallback(async (activityType: string, value: number) => {
    try {
      const response = await fetch('/api/achievements/xp/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ activityType, activityValue: value }),
      });

      if (response.ok) {
        const data = await response.json();

        // Show XP gain toast
        setNotifications([
          ...notifications,
          {
            id: Date.now().toString(),
            type: 'xp',
            data: {
              amount: data.xpEarned,
              reason: activityType.replace(/_/g, ' '),
            },
          },
        ]);

        // If level up
        if (data.leveledUp) {
          setNotifications((prev) => [
            ...prev,
            {
              id: `level-${Date.now()}`,
              type: 'level-up',
              data: { level: data.newLevel, rank: data.newRank },
            },
          ]);
        }

        // Show new badges
        data.newBadges?.forEach((badge: any) => {
          setNotifications((prev) => [
            ...prev,
            {
              id: `badge-${badge.id}`,
              type: 'badge',
              data: badge,
            },
          ]);
        });

        // Refresh profile
        const profileResponse = await fetch(`/api/achievements/profile/${user?.id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          setAchievement(profileData);
        }
      }
    } catch (err) {
      console.error('Error logging activity:', err);
    }
  }, [user?.id, notifications]);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-white">Loading your achievements...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="bg-red-900/50 border border-red-600 rounded-lg p-6 text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-white font-semibold">{error}</p>
        </div>
      </div>
    );
  }

  // ========== TAB COMPONENTS ==========

  const OverviewTab = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-4xl font-bold mb-2">Level {achievement?.currentLevel || 1}</h2>
            <p className="text-lg text-blue-100">Rank: {achievement?.currentRank || 'BEGINNER'}</p>
          </div>
          <div className="text-7xl">🎯</div>
        </div>

        <div className="bg-white/20 rounded-lg p-4 backdrop-blur mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">XP Progress</span>
            <span className="text-sm">{achievement?.currentXP || 0} / {achievement?.xpNeeded || 100} XP</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-4 overflow-hidden">
            <div
              className="bg-white h-full rounded-full transition-all duration-500"
              style={{ width: `${((achievement?.currentXP || 0) / (achievement?.xpNeeded || 100)) * 100}%` }}
            />
          </div>
          <p className="text-sm mt-2 text-blue-100">
            {((achievement?.xpNeeded || 100) - (achievement?.currentXP || 0))} XP to next level
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <p className="text-sm text-blue-100">Total XP</p>
            <p className="text-2xl font-bold mt-1">{achievement?.totalXP || 0}</p>
          </div>
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <p className="text-sm text-blue-100">Streak</p>
            <p className="text-2xl font-bold mt-1">
              <Flame className="inline mr-1 text-red-400" size={18} />
              {achievement?.currentStreak || 0}
            </p>
          </div>
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <p className="text-sm text-blue-100">Rank</p>
            <p className="text-2xl font-bold mt-1">#{achievement?.leaderboardRank || '?'}</p>
          </div>
        </div>
      </div>

      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
        <h3 className="text-lg font-bold text-white mb-4">🧪 Test Activities</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { label: '💰 Sale', activity: 'SALE', value: 5000 },
            { label: '📞 Lead', activity: 'LEAD_GENERATED', value: 1 },
            { label: '👥 Referral', activity: 'REFERRAL', value: 1 },
            { label: '📦 Upload', activity: 'PRODUCT_UPLOAD', value: 1 },
            { label: '💬 Engagement', activity: 'ENGAGEMENT', value: 1 },
          ].map((test) => (
            <button
              key={test.activity}
              onClick={() => logActivity(test.activity, test.value)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm font-medium transition"
            >
              {test.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Badges', value: achievement?.userBadges?.length || 0, icon: '🎖️' },
          { label: 'Trophies', value: achievement?.userTrophies?.length || 0, icon: '🏅' },
          { label: 'Rewards', value: achievement?.userRewards?.length || 0, icon: '🎁' },
          { label: 'Milestones', value: '3/5', icon: '⭐' },
        ].map((stat, i) => (
          <div key={i} className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg p-4 text-center">
            <div className="text-3xl mb-2">{stat.icon}</div>
            <p className="text-slate-400 text-sm">{stat.label}</p>
            <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const BadgesTab = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Badges ({achievement?.userBadges?.length || 0})</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {achievement?.userBadges?.map((ub: any) => {
          const badge = ub.badge;
          const rarityColors = {
            COMMON: 'border-gray-400 bg-gray-900/50',
            RARE: 'border-blue-400 bg-blue-900/50',
            EPIC: 'border-purple-400 bg-purple-900/50',
            LEGENDARY: 'border-yellow-400 bg-yellow-900/50',
          };
          return (
            <div key={badge.id} className={`border-2 rounded-lg p-4 text-center ${rarityColors[badge.rarity]}`}>
              <div className="text-4xl mb-2">{badge.icon}</div>
              <p className="font-semibold text-white text-sm">{badge.title}</p>
              <p className="text-xs text-slate-400 mt-1">{badge.category}</p>
              <div className="mt-2 px-2 py-1 bg-slate-700/50 rounded">
                <span className="text-xs font-medium text-slate-300">{badge.rarity}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const TrophiesTab = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Trophies ({achievement?.userTrophies?.length || 0})</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {achievement?.userTrophies?.map((ut: any) => (
          <div key={ut.id} className="bg-gradient-to-br from-yellow-600 to-amber-600 rounded-lg p-6 text-white">
            <div className="text-5xl mb-4">🏆</div>
            <p className="text-xl font-bold mb-2">{ut.trophy?.title}</p>
            <p className="text-sm text-yellow-100">Rank #{ut.rank}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const RewardsTab = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Rewards</h2>
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Available</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rewards?.available?.map((reward: any) => (
            <div key={reward.id} className="bg-emerald-600/20 border border-emerald-600 rounded-lg p-4">
              <p className="font-bold text-white mb-2">{reward.title}</p>
              <p className="text-sm text-emerald-100 mb-3">{reward.description}</p>
              <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded text-sm">
                Claim
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const ChallengesTab = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Active Challenges</h2>
      <div className="space-y-4">
        {challenges.map((challenge) => {
          const progress = challenge.userChallenges?.[0]?.currentProgress || 0;
          const target = challenge.targetValue;
          const percentComplete = (progress / target) * 100;
          return (
            <div key={challenge.id} className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <h3 className="text-lg font-bold text-white mb-4">{challenge.title}</h3>
              <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden mb-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all"
                  style={{ width: `${percentComplete}%` }}
                />
              </div>
              <p className="text-sm text-slate-400">{progress}/{target} {challenge.goalMetric}</p>
            </div>
          );
        })}
      </div>
    </div>
  );

  const LeaderboardTab = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">🏆 Leaderboard</h2>
      <div className="space-y-2">
        {leaderboardData.map((user) => (
          <div key={user.rank} className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white">
                {user.rank <= 3 ? ['🥇', '🥈', '🥉'][user.rank - 1] : user.rank}
              </div>
              <div>
                <p className="font-bold text-white">{user.name}</p>
                <p className="text-sm text-slate-400">Level {user.level}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-white">{user.xp} XP</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      <AchievementNotificationManager notifications={notifications} onRemove={removeNotification} />

      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">🎮 Your Achievement Journey</h1>

        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {[
            { id: 'overview', label: '📊 Overview' },
            { id: 'badges', label: '🎖️ Badges' },
            { id: 'trophies', label: '🏅 Trophies' },
            { id: 'rewards', label: '🎁 Rewards' },
            { id: 'challenges', label: '🎯 Challenges' },
            { id: 'leaderboard', label: '🏆 Leaderboard' },
          ].map((tab: any) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${
                selectedTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div>
          {selectedTab === 'overview' && <OverviewTab />}
          {selectedTab === 'badges' && <BadgesTab />}
          {selectedTab === 'trophies' && <TrophiesTab />}
          {selectedTab === 'rewards' && <RewardsTab />}
          {selectedTab === 'challenges' && <ChallengesTab />}
          {selectedTab === 'leaderboard' && <LeaderboardTab />}
        </div>
      </div>
    </div>
  );
};

export default UserAchievementDashboard;
