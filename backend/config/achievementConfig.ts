/**
 * Role-Specific Achievement Configuration
 * Defines XP values, badges, and achievement rules per role
 */

export const ROLE_ACHIEVEMENT_CONFIG = {
  RESELLER: {
    displayName: 'Reseller',
    icon: '🏪',
    xpConfig: {
      SALE: 100,
      LEAD_GENERATED: 25,
      REFERRAL: 50,
      ENGAGEMENT: 5,
      PRODUCT_UPLOAD: 0,
      CHALLENGE_COMPLETED: 500,
    },
    multipliers: {
      weekdayBonus: 1.2, // 20% bonus on weekdays
      streakMultiplier: 0.1, // 10% per day streak
      challengeBonus: 2.0, // 2x for challenge completion
    },
    availableBadgeCategories: ['SALES', 'LEAD', 'ENGAGEMENT', 'MILESTONE', 'SPECIAL'],
    levelCaps: {
      basic: 10,
      intermediate: 20,
      advanced: 35,
      expert: 50,
    },
  },

  FRANCHISE: {
    displayName: 'Franchise',
    icon: '🏢',
    xpConfig: {
      SALE: 100,
      LEAD_GENERATED: 25,
      TERRITORY_GROWTH: 75,
      ENGAGEMENT: 5,
      PRODUCT_UPLOAD: 0,
      CHALLENGE_COMPLETED: 500,
    },
    multipliers: {
      weekdayBonus: 1.15,
      streakMultiplier: 0.08,
      challengeBonus: 2.0,
    },
    availableBadgeCategories: ['SALES', 'LEAD', 'ENGAGEMENT', 'MILESTONE', 'SPECIAL'],
    levelCaps: {
      basic: 10,
      intermediate: 20,
      advanced: 35,
      expert: 50,
    },
  },

  AUTHOR: {
    displayName: 'Author',
    icon: '✍️',
    xpConfig: {
      PRODUCT_UPLOAD: 75,
      SALE: 100,
      ENGAGEMENT: 10,
      LEAD_GENERATED: 0,
      REFERRAL: 0,
      CHALLENGE_COMPLETED: 500,
    },
    multipliers: {
      weekdayBonus: 1.25,
      streakMultiplier: 0.12,
      challengeBonus: 2.5,
    },
    availableBadgeCategories: ['PRODUCT', 'SALES', 'ENGAGEMENT', 'MILESTONE', 'SPECIAL'],
    levelCaps: {
      basic: 8,
      intermediate: 18,
      advanced: 32,
      expert: 50,
    },
  },

  VENDOR: {
    displayName: 'Vendor',
    icon: '🛍️',
    xpConfig: {
      SALE: 100,
      LEAD_GENERATED: 20,
      PRODUCT_UPLOAD: 50,
      ENGAGEMENT: 5,
      REFERRAL: 30,
      CHALLENGE_COMPLETED: 500,
    },
    multipliers: {
      weekdayBonus: 1.15,
      streakMultiplier: 0.09,
      challengeBonus: 2.0,
    },
    availableBadgeCategories: ['SALES', 'PRODUCT', 'ENGAGEMENT', 'MILESTONE', 'SPECIAL'],
    levelCaps: {
      basic: 10,
      intermediate: 20,
      advanced: 35,
      expert: 50,
    },
  },

  AFFILIATE: {
    displayName: 'Affiliate',
    icon: '🤝',
    xpConfig: {
      REFERRAL: 75,
      LEAD_GENERATED: 40,
      SALE: 50,
      ENGAGEMENT: 8,
      PRODUCT_UPLOAD: 0,
      CHALLENGE_COMPLETED: 500,
    },
    multipliers: {
      weekdayBonus: 1.2,
      streakMultiplier: 0.1,
      challengeBonus: 2.0,
    },
    availableBadgeCategories: ['LEAD', 'ENGAGEMENT', 'MILESTONE', 'SPECIAL'],
    levelCaps: {
      basic: 9,
      intermediate: 19,
      advanced: 33,
      expert: 50,
    },
  },

  INFLUENCER: {
    displayName: 'Influencer',
    icon: '⭐',
    xpConfig: {
      ENGAGEMENT: 50,
      REFERRAL: 100,
      LEAD_GENERATED: 30,
      SALE: 75,
      PRODUCT_UPLOAD: 0,
      CHALLENGE_COMPLETED: 600,
    },
    multipliers: {
      weekdayBonus: 1.3,
      streakMultiplier: 0.15,
      challengeBonus: 2.5,
    },
    availableBadgeCategories: ['ENGAGEMENT', 'LEAD', 'MILESTONE', 'SPECIAL'],
    levelCaps: {
      basic: 7,
      intermediate: 17,
      advanced: 30,
      expert: 50,
    },
  },
};

export const ACHIEVEMENT_ACTIVITY_TYPES = {
  SALE: 'Sale Made',
  LEAD_GENERATED: 'Lead Generated',
  REFERRAL: 'Referral Made',
  PRODUCT_UPLOAD: 'Product Uploaded',
  ENGAGEMENT: 'User Engagement',
  TERRITORY_GROWTH: 'Territory Growth',
  CHALLENGE_COMPLETED: 'Challenge Completed',
};

export const XP_LEVEL_PROGRESSION = {
  1: 100,
  2: 200,
  3: 350,
  4: 550,
  5: 800,
  6: 1100,
  7: 1450,
  8: 1850,
  9: 2300,
  10: 2800,
  // Progressive scaling
  // Each subsequent level requires 15% more XP
};

// Generate XP requirements for all 50 levels
export function generateXPProgression() {
  const progression: { [key: number]: number } = {};
  let baseXP = 100;

  for (let level = 1; level <= 50; level++) {
    progression[level] = baseXP;
    baseXP = Math.floor(baseXP * 1.15); // 15% increase per level
  }

  return progression;
}

export const CELEBRATION_CONFIG = {
  LEVEL_UP: {
    duration: 3000,
    sound: 'level_up',
    particles: 30,
  },
  BADGE_UNLOCK: {
    duration: 2000,
    sound: 'badge_unlock',
    position: 'bottom-right',
  },
  TROPHY_UNLOCK: {
    duration: 4000,
    sound: 'trophy_unlock',
    particles: 50,
  },
  XP_GAIN: {
    duration: 1500,
    sound: 'xp_gain',
    position: 'top-right',
  },
};

export const REWARD_TYPES = {
  COMMISSION: {
    label: 'Commission Bonus',
    icon: '💰',
    color: '#FFD700',
  },
  LEAD_CREDITS: {
    label: 'Lead Credits',
    icon: '📱',
    color: '#4ECDC4',
  },
  SOFTWARE: {
    label: 'Premium Software',
    icon: '💻',
    color: '#9370DB',
  },
  DISCOUNT: {
    label: 'Special Discount',
    icon: '🏷️',
    color: '#FF6B6B',
  },
  ACCESS: {
    label: 'VIP Access',
    icon: '👑',
    color: '#FFD700',
  },
  WALLET: {
    label: 'Wallet Credit',
    icon: '💳',
    color: '#4ECDC4',
  },
  RECOGNITION: {
    label: 'Recognition',
    icon: '🌟',
    color: '#FF69B4',
  },
};

export const CHALLENGE_CONFIG = {
  WEEKLY: {
    icon: '📅',
    color: '#4ECDC4',
    resetDay: 1, // Monday
  },
  MONTHLY: {
    icon: '📊',
    color: '#9370DB',
    resetDay: 1, // 1st of month
  },
  YEARLY: {
    icon: '📈',
    color: '#FF6B6B',
    resetDay: 1, // Jan 1
  },
};
