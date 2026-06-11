import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Plus,
  Edit2,
  Trash2,
  Trophy,
  Award,
  Zap,
  Target,
  Settings,
  BarChart3,
  Users,
  TrendingUp,
  Sparkles,
} from 'lucide-react';

interface Achievement {
  id: string;
  type: 'badge' | 'trophy' | 'level' | 'rank' | 'reward' | 'challenge';
  name: string;
  description: string;
  icon?: string;
  config: any;
}

export const AchievementManagementCenter: React.FC = () => {
  const { t } = useTranslation();
  
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Achievement | null>(null);
  const [settings, setSettings] = useState({
    xpPerSale: 100,
    xpPerLead: 25,
    xpPerReferral: 50,
    xpPerProductUpload: 75,
    xpMultiplier: 1.0,
    leaderboardEnabled: true,
    notificationsEnabled: true,
  });

  const tabs = [
    { id: 'overview', label: '📊 Overview', icon: BarChart3 },
    { id: 'levels', label: '🏆 Levels', icon: TrendingUp },
    { id: 'ranks', label: '👑 Ranks', icon: Award },
    { id: 'badges', label: '🎖️ Badges', icon: Sparkles },
    { id: 'trophies', label: '🏅 Trophies', icon: Trophy },
    { id: 'rewards', label: '🎁 Rewards', icon: Award },
    { id: 'challenges', label: '🎯 Challenges', icon: Target },
    { id: 'xp-rules', label: '⚡ XP Rules', icon: Zap },
    { id: 'users', label: '👥 Users', icon: Users },
    { id: 'settings', label: '⚙️ Settings', icon: Settings },
  ];

  // ========== OVERVIEW TAB ==========
  const OverviewTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {[
        { label: 'Total Badges', value: '48', icon: '🎖️', color: 'bg-blue-500/10' },
        { label: 'Total Trophies', value: '12', icon: '🏅', color: 'bg-gold-500/10' },
        { label: 'Active Challenges', value: '5', icon: '🎯', color: 'bg-purple-500/10' },
        { label: 'Users in Achievement', value: '1,234', icon: '👥', color: 'bg-emerald-500/10' },
      ].map((stat, i) => (
        <div key={i} className={`${stat.color} border border-slate-700 rounded-lg p-4`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">{stat.label}</p>
              <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
            </div>
            <div className="text-4xl">{stat.icon}</div>
          </div>
        </div>
      ))}
    </div>
  );

  // ========== LEVELS TAB ==========
  const LevelsTab = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white">Create & Manage Levels</h2>
        <button
          onClick={() => { setEditingItem(null); setShowModal(true); }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus size={18} /> Add Level
        </button>
      </div>

      <div className="space-y-3">
        {[
          { num: 1, title: 'Beginner', xpRange: '0-100', rank: 'BEGINNER' },
          { num: 2, title: 'Intermediate', xpRange: '100-300', rank: 'INTERMEDIATE' },
          { num: 3, title: 'Pro', xpRange: '300-600', rank: 'PRO' },
          { num: 4, title: 'Expert', xpRange: '600-1000', rank: 'EXPERT' },
          { num: 5, title: 'Master', xpRange: '1000-1500', rank: 'MASTER' },
        ].map((level) => (
          <div key={level.num} className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-4xl">🏅</div>
              <div>
                <p className="font-bold text-white">Level {level.num}: {level.title}</p>
                <p className="text-sm text-slate-400">XP: {level.xpRange}</p>
                <p className="text-xs text-slate-500 mt-1">Rank: {level.rank}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 px-3 py-1 rounded text-sm flex items-center gap-1">
                <Edit2 size={14} /> Edit
              </button>
              <button className="bg-red-600/20 hover:bg-red-600/40 text-red-400 px-3 py-1 rounded text-sm flex items-center gap-1">
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // ========== BADGES TAB ==========
  const BadgesTab = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white">Manage Badges</h2>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <Plus size={18} /> Add Badge
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[
          { name: 'First Sale', icon: '🛍️', category: 'SALES', rarity: 'COMMON' },
          { name: '10 Sales', icon: '💰', category: 'SALES', rarity: 'RARE' },
          { name: 'Sales Champion', icon: '🏆', category: 'SALES', rarity: 'EPIC' },
          { name: 'First Lead', icon: '🎯', category: 'LEAD', rarity: 'COMMON' },
          { name: '50 Leads', icon: '📊', category: 'LEAD', rarity: 'RARE' },
          { name: 'Lead Master', icon: '👑', category: 'LEAD', rarity: 'EPIC' },
          { name: 'Product Upload', icon: '📦', category: 'PRODUCT', rarity: 'COMMON' },
          { name: 'Engagement Star', icon: '⭐', category: 'ENGAGEMENT', rarity: 'RARE' },
        ].map((badge, i) => (
          <div key={i} className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 text-center hover:border-blue-500 transition cursor-pointer">
            <div className="text-3xl mb-2">{badge.icon}</div>
            <p className="font-semibold text-white text-sm mb-1">{badge.name}</p>
            <div className="flex gap-1 justify-center mb-2">
              <span className="text-xs px-2 py-0.5 bg-slate-700 text-slate-300 rounded">{badge.category}</span>
              <span className={`text-xs px-2 py-0.5 rounded ${
                badge.rarity === 'COMMON' ? 'bg-gray-600 text-gray-200' :
                badge.rarity === 'RARE' ? 'bg-blue-600 text-blue-200' :
                'bg-purple-600 text-purple-200'
              }`}>{badge.rarity}</span>
            </div>
            <div className="flex gap-1">
              <button className="flex-1 bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 px-2 py-1 rounded text-xs">Edit</button>
              <button className="flex-1 bg-red-600/20 hover:bg-red-600/40 text-red-400 px-2 py-1 rounded text-xs">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // ========== XP RULES TAB ==========
  const XPRulesTab = () => (
    <div className="space-y-6">
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-6">XP Configuration</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { label: 'XP per Sale', key: 'xpPerSale', value: settings.xpPerSale },
            { label: 'XP per Lead', key: 'xpPerLead', value: settings.xpPerLead },
            { label: 'XP per Referral', key: 'xpPerReferral', value: settings.xpPerReferral },
            { label: 'XP per Product Upload', key: 'xpPerProductUpload', value: settings.xpPerProductUpload },
          ].map((item) => (
            <div key={item.key}>
              <label className="block text-white font-medium mb-2">{item.label}</label>
              <input
                type="number"
                value={item.value}
                onChange={(e) => setSettings({ ...settings, [item.key]: parseInt(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-white font-medium mb-2">XP Multiplier</label>
            <input
              type="number"
              step="0.1"
              value={settings.xpMultiplier}
              onChange={(e) => setSettings({ ...settings, xpMultiplier: parseFloat(e.target.value) })}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white"
            />
            <p className="text-sm text-slate-400 mt-1">Global multiplier for all XP (e.g., 1.5 = 50% more)</p>
          </div>
        </div>

        <button className="mt-6 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium">
          Save XP Configuration
        </button>
      </div>
    </div>
  );

  // ========== CHALLENGES TAB ==========
  const ChallengesTab = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white">Active Challenges</h2>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <Plus size={18} /> Create Challenge
        </button>
      </div>

      <div className="space-y-3">
        {[
          { type: '🔔 WEEKLY', title: 'Make 5 Sales', reward: '500 XP', participants: 234, endDate: 'In 2 days' },
          { type: '📅 MONTHLY', title: 'Generate 50 Leads', reward: 'Trophy + 2000 XP', participants: 156, endDate: 'In 15 days' },
          { type: '⭐ YEARLY', title: 'Become Top Performer', reward: 'Hall of Fame + Prize', participants: 89, endDate: 'In 200 days' },
        ].map((challenge, i) => (
          <div key={i} className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <span className="text-sm font-medium text-slate-300 mr-3">{challenge.type}</span>
                <p className="font-bold text-white">{challenge.title}</p>
                <p className="text-sm text-slate-400 mt-1">Reward: {challenge.reward}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-400">{challenge.participants} participants</p>
                <p className="text-xs text-slate-500 mt-1">Ends {challenge.endDate}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 px-3 py-1 rounded text-sm">Edit</button>
              <button className="bg-red-600/20 hover:bg-red-600/40 text-red-400 px-3 py-1 rounded text-sm">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // ========== SETTINGS TAB ==========
  const SettingsTab = () => (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-6">
      <h2 className="text-xl font-bold text-white">Global Settings</h2>

      <div className="space-y-4">
        {[
          { label: 'Enable Gamification System', key: 'gamificationEnabled' },
          { label: 'Enable Leaderboard', key: 'leaderboardEnabled' },
          { label: 'Enable Achievement Notifications', key: 'notificationsEnabled' },
        ].map((setting) => (
          <div key={setting.key} className="flex items-center justify-between p-3 bg-slate-700/50 rounded">
            <span className="text-white font-medium">{setting.label}</span>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                defaultChecked={settings[setting.key as keyof typeof settings] === true}
                className="w-5 h-5 rounded cursor-pointer"
              />
            </div>
          </div>
        ))}
      </div>

      <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium w-full">
        Save All Settings
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">🎮 Achievement Management Center</h1>
          <p className="text-slate-400">Create, manage, and configure achievements, levels, badges, and rewards for all user roles</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 whitespace-nowrap transition ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="bg-slate-800/30 rounded-lg p-6">
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'levels' && <LevelsTab />}
          {activeTab === 'badges' && <BadgesTab />}
          {activeTab === 'xp-rules' && <XPRulesTab />}
          {activeTab === 'challenges' && <ChallengesTab />}
          {activeTab === 'settings' && <SettingsTab />}

          {/* Other tabs placeholder */}
          {!['overview', 'levels', 'badges', 'xp-rules', 'challenges', 'settings'].includes(activeTab) && (
            <div className="text-center py-12">
              <p className="text-slate-400 text-lg">Management interface for {activeTab}</p>
              <p className="text-slate-500 text-sm mt-2">Coming soon...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AchievementManagementCenter;
