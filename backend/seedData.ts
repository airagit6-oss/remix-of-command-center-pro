/**
 * Achievement System Seed Data
 * Run this once to populate database with initial badges, levels, ranks, and trophies
 */

export const seedLevels = [
  ...Array.from({ length: 50 }, (_, i) => ({
    level: i + 1,
    title: `Level ${i + 1}`,
    minXP: i * 500,
    maxXP: (i + 1) * 500 - 1,
    icon: '⭐',
  })),
];

export const seedRanks = {
  RESELLER: [
    { rank: 'BRONZE', minLevel: 1, maxLevel: 5, icon: '🥉', color: '#CD7F32' },
    { rank: 'SILVER', minLevel: 6, maxLevel: 15, icon: '🥈', color: '#C0C0C0' },
    { rank: 'GOLD', minLevel: 16, maxLevel: 25, icon: '🥇', color: '#FFD700' },
    { rank: 'PLATINUM', minLevel: 26, maxLevel: 35, icon: '💎', color: '#E5E4E2' },
    { rank: 'DIAMOND', minLevel: 36, maxLevel: 50, icon: '💠', color: '#B9F2FF' },
  ],
  FRANCHISE: [
    { rank: 'STARTER', minLevel: 1, maxLevel: 8, icon: '🚀', color: '#FF6B6B' },
    { rank: 'GROWTH', minLevel: 9, maxLevel: 18, icon: '📈', color: '#4ECDC4' },
    { rank: 'ESTABLISHED', minLevel: 19, maxLevel: 28, icon: '🏢', color: '#45B7D1' },
    { rank: 'LEADER', minLevel: 29, maxLevel: 40, icon: '👑', color: '#F7DC6F' },
    { rank: 'EMPIRE', minLevel: 41, maxLevel: 50, icon: '🏰', color: '#D4A5A5' },
  ],
  AUTHOR: [
    { rank: 'CONTRIBUTOR', minLevel: 1, maxLevel: 7, icon: '✍️', color: '#B19CD9' },
    { rank: 'CREATOR', minLevel: 8, maxLevel: 16, icon: '🎨', color: '#87CEEB' },
    { rank: 'INNOVATOR', minLevel: 17, maxLevel: 26, icon: '💡', color: '#FFD700' },
    { rank: 'MASTER', minLevel: 27, maxLevel: 38, icon: '🧙', color: '#9370DB' },
    { rank: 'LEGEND', minLevel: 39, maxLevel: 50, icon: '⚡', color: '#FF4500' },
  ],
  VENDOR: [
    { rank: 'PARTNER', minLevel: 1, maxLevel: 6, icon: '🤝', color: '#87CEEB' },
    { rank: 'PREFERRED', minLevel: 7, maxLevel: 14, icon: '⭐', color: '#FFD700' },
    { rank: 'ELITE', minLevel: 15, maxLevel: 25, icon: '👑', color: '#FF69B4' },
    { rank: 'CHAMPION', minLevel: 26, maxLevel: 38, icon: '🏆', color: '#FF6347' },
    { rank: 'EMPIRE', minLevel: 39, maxLevel: 50, icon: '👸', color: '#9400D3' },
  ],
  AFFILIATE: [
    { rank: 'REFERRER', minLevel: 1, maxLevel: 6, icon: '🔗', color: '#20B2AA' },
    { rank: 'PROMOTER', minLevel: 7, maxLevel: 14, icon: '📢', color: '#FF8C00' },
    { rank: 'AMBASSADOR', minLevel: 15, maxLevel: 25, icon: '🎭', color: '#FFD700' },
    { rank: 'INFLUENCER', minLevel: 26, maxLevel: 38, icon: '📱', color: '#FF1493' },
    { rank: 'MEGASTAR', minLevel: 39, maxLevel: 50, icon: '🌟', color: '#FF4500' },
  ],
  INFLUENCER: [
    { rank: 'MICRO', minLevel: 1, maxLevel: 5, icon: '📹', color: '#87CEEB' },
    { rank: 'RISING', minLevel: 6, maxLevel: 12, icon: '📈', color: '#FFD700' },
    { rank: 'STAR', minLevel: 13, maxLevel: 22, icon: '⭐', color: '#FF69B4' },
    { rank: 'CELEBRITY', minLevel: 23, maxLevel: 35, icon: '🎬', color: '#FF6347' },
    { rank: 'LEGENDARY', minLevel: 36, maxLevel: 50, icon: '👑', color: '#FF4500' },
  ],
};

export const seedBadges = [
  // SALES CATEGORY
  {
    title: '🎯 First Sale',
    category: 'SALES',
    rarity: 'COMMON',
    description: 'Make your first sale',
    requirementType: 'ACTIVITY_COUNT',
    requirementValue: 1,
    requirementActivity: 'SALE',
    icon: '💰',
  },
  {
    title: '💯 Sales Pro',
    category: 'SALES',
    rarity: 'RARE',
    description: 'Complete 10 sales',
    requirementType: 'ACTIVITY_COUNT',
    requirementValue: 10,
    requirementActivity: 'SALE',
    icon: '🏆',
  },
  {
    title: '🚀 Sales Master',
    category: 'SALES',
    rarity: 'EPIC',
    description: 'Complete 50 sales',
    requirementType: 'ACTIVITY_COUNT',
    requirementValue: 50,
    requirementActivity: 'SALE',
    icon: '👑',
  },
  {
    title: '💎 Sales Legend',
    category: 'SALES',
    rarity: 'LEGENDARY',
    description: 'Complete 100 sales',
    requirementType: 'ACTIVITY_COUNT',
    requirementValue: 100,
    requirementActivity: 'SALE',
    icon: '⚡',
  },

  // LEADS CATEGORY
  {
    title: '📞 Lead Hunter',
    category: 'LEAD',
    rarity: 'COMMON',
    description: 'Generate 5 leads',
    requirementType: 'ACTIVITY_COUNT',
    requirementValue: 5,
    requirementActivity: 'LEAD_GENERATED',
    icon: '📱',
  },
  {
    title: '🎯 Lead Magnet',
    category: 'LEAD',
    rarity: 'RARE',
    description: 'Generate 25 leads',
    requirementType: 'ACTIVITY_COUNT',
    requirementValue: 25,
    requirementActivity: 'LEAD_GENERATED',
    icon: '🧲',
  },
  {
    title: '🔥 Lead Master',
    category: 'LEAD',
    rarity: 'EPIC',
    description: 'Generate 100 leads',
    requirementType: 'ACTIVITY_COUNT',
    requirementValue: 100,
    requirementActivity: 'LEAD_GENERATED',
    icon: '🌟',
  },

  // REFERRALS CATEGORY
  {
    title: '👥 Referral Starter',
    category: 'ENGAGEMENT',
    rarity: 'COMMON',
    description: 'Make 3 referrals',
    requirementType: 'ACTIVITY_COUNT',
    requirementValue: 3,
    requirementActivity: 'REFERRAL',
    icon: '🔗',
  },
  {
    title: '🤝 Referral Expert',
    category: 'ENGAGEMENT',
    rarity: 'RARE',
    description: 'Make 15 referrals',
    requirementType: 'ACTIVITY_COUNT',
    requirementValue: 15,
    requirementActivity: 'REFERRAL',
    icon: '🌐',
  },
  {
    title: '💼 Referral Influencer',
    category: 'ENGAGEMENT',
    rarity: 'EPIC',
    description: 'Make 50 referrals',
    requirementType: 'ACTIVITY_COUNT',
    requirementValue: 50,
    requirementActivity: 'REFERRAL',
    icon: '📢',
  },

  // XP MILESTONES
  {
    title: '🔥 1K XP Club',
    category: 'MILESTONE',
    rarity: 'COMMON',
    description: 'Earn 1,000 XP',
    requirementType: 'XP',
    requirementValue: 1000,
    icon: '⚡',
  },
  {
    title: '💪 5K XP Master',
    category: 'MILESTONE',
    rarity: 'RARE',
    description: 'Earn 5,000 XP',
    requirementType: 'XP',
    requirementValue: 5000,
    icon: '🔋',
  },
  {
    title: '🌟 10K XP Legend',
    category: 'MILESTONE',
    rarity: 'EPIC',
    description: 'Earn 10,000 XP',
    requirementType: 'XP',
    requirementValue: 10000,
    icon: '✨',
  },

  // SPECIAL BADGES
  {
    title: '🔥 Hotstreak',
    category: 'SPECIAL',
    rarity: 'RARE',
    description: 'Maintain 7-day activity streak',
    requirementType: 'CUSTOM',
    requirementValue: 7,
    icon: '🔥',
  },
  {
    title: '👑 Weekday Warrior',
    category: 'SPECIAL',
    rarity: 'COMMON',
    description: 'Stay active for 5 consecutive weekdays',
    requirementType: 'CUSTOM',
    requirementValue: 5,
    icon: '⚔️',
  },
];

export const seedRewards = [
  {
    title: 'Commission Bonus',
    description: '+10% commission on next sale',
    rewardType: 'COMMISSION',
    value: '10',
    unit: 'percent',
    durationDays: 30,
    icon: '💰',
    requirementLevel: 5,
  },
  {
    title: 'Lead Credits',
    description: '100 lead credits for ad campaigns',
    rewardType: 'LEAD_CREDITS',
    value: '100',
    unit: 'credits',
    durationDays: 60,
    icon: '📱',
    requirementLevel: 10,
  },
  {
    title: 'Premium Software Access',
    description: '1-month access to premium tools',
    rewardType: 'SOFTWARE',
    value: 'premium_tools',
    durationDays: 30,
    icon: '💻',
    requirementLevel: 15,
  },
  {
    title: 'Special Discount',
    description: '20% discount on marketplace purchases',
    rewardType: 'DISCOUNT',
    value: '20',
    unit: 'percent',
    durationDays: 90,
    icon: '🏷️',
    requirementLevel: 8,
  },
  {
    title: 'VIP Access',
    description: '1-month VIP marketplace access',
    rewardType: 'ACCESS',
    value: 'vip_access',
    durationDays: 30,
    icon: '👑',
    requirementLevel: 20,
  },
  {
    title: 'Wallet Credit',
    description: '₹5,000 wallet credit',
    rewardType: 'WALLET',
    value: '5000',
    unit: 'INR',
    durationDays: 365,
    icon: '💳',
    requirementLevel: 25,
  },
  {
    title: 'Featured Spotlight',
    description: 'Get featured in monthly spotlight',
    rewardType: 'RECOGNITION',
    value: 'featured',
    durationDays: 30,
    icon: '🌟',
    requirementLevel: 30,
  },
];

export const seedChallenges = [
  // WEEKLY
  {
    title: '💰 Weekly Sales Challenge',
    description: 'Make 5 sales this week',
    type: 'WEEKLY',
    goalMetric: 'sales',
    targetValue: 5,
    reward: {
      xp: 500,
      rewardTitle: '100 Lead Credits',
    },
    icon: '🎯',
    daysLeft: 7,
  },
  {
    title: '📞 Lead Generation Drive',
    description: 'Generate 20 leads this week',
    type: 'WEEKLY',
    goalMetric: 'leads',
    targetValue: 20,
    reward: {
      xp: 400,
      rewardTitle: '₹1,000 Wallet',
    },
    icon: '📱',
    daysLeft: 7,
  },
  {
    title: '👥 Referral Rush',
    description: 'Get 5 referrals',
    type: 'WEEKLY',
    goalMetric: 'referrals',
    targetValue: 5,
    reward: {
      xp: 350,
      rewardTitle: '10% Commission Bonus',
    },
    icon: '🔗',
    daysLeft: 7,
  },

  // MONTHLY
  {
    title: '🏆 Monthly Top Performer',
    description: 'Complete 30 sales this month',
    type: 'MONTHLY',
    goalMetric: 'sales',
    targetValue: 30,
    reward: {
      xp: 2000,
      badgeTitle: 'Sales Master Badge',
    },
    icon: '👑',
    daysLeft: 30,
  },
  {
    title: '🚀 Monthly Growth Challenge',
    description: 'Increase activity by 50% vs last month',
    type: 'MONTHLY',
    goalMetric: 'activities',
    targetValue: 50,
    reward: {
      xp: 1500,
      rewardTitle: 'VIP Access',
    },
    icon: '📈',
    daysLeft: 30,
  },

  // YEARLY
  {
    title: '⭐ Yearly Legends',
    description: 'Reach level 30 by year-end',
    type: 'YEARLY',
    goalMetric: 'levels',
    targetValue: 30,
    reward: {
      xp: 5000,
      badgeTitle: 'Yearly Legend',
    },
    icon: '🌟',
    daysLeft: 365,
  },
];

export const seedTrophies = [
  {
    title: 'Monthly Champion',
    category: 'MONTHLY',
    icon: '🏅',
    description: 'Top performer of the month',
    positions: [
      { position: 1, name: 'Gold Trophy', icon: '🥇' },
      { position: 2, name: 'Silver Trophy', icon: '🥈' },
      { position: 3, name: 'Bronze Trophy', icon: '🥉' },
    ],
  },
  {
    title: 'Yearly Legend',
    category: 'YEARLY',
    icon: '👑',
    description: 'Top performer of the year',
    positions: [
      { position: 1, name: 'Platinum Trophy', icon: '💎' },
      { position: 2, name: 'Gold Trophy', icon: '🥇' },
      { position: 3, name: 'Silver Trophy', icon: '🥈' },
    ],
  },
  {
    title: 'Hall of Fame',
    category: 'SPECIAL',
    icon: '🌟',
    description: 'Legendary performers',
    positions: [
      { position: 1, name: 'Hall of Fame', icon: '👑' },
    ],
  },
];
