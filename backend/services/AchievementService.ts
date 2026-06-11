/**
 * Achievement Service - Core business logic
 * Handles: XP calculation, badge/trophy unlock, level progression, rewards
 * 
 * Integration Point: Called by all activity endpoints
 */

import { PrismaClient, UserRole, BadgeCategory, BadgeRarity, TrophyCategory } from '@prisma/client';

const prisma = new PrismaClient();

// ============================================================================
// XP CONFIGURATION (Admin configurable, but with defaults)
// ============================================================================

const XP_CONFIG = {
  RESELLER: {
    SALE: 100,
    LEAD_GENERATED: 25,
    REFERRAL: 50,
    ENGAGEMENT: 5,
    multiplier: 1.0,
  },
  FRANCHISE: {
    SALE: 100,
    LEAD_GENERATED: 25,
    TERRITORY_GROWTH: 75,
    ENGAGEMENT: 5,
    multiplier: 1.0,
  },
  AUTHOR: {
    PRODUCT_UPLOAD: 75,
    SALE: 100,
    REVIEW_POSITIVE: 10,
    ENGAGEMENT: 5,
    multiplier: 1.0,
  },
  VENDOR: {
    PROJECT_COMPLETE: 100,
    CUSTOMER_SATISFACTION: 50,
    ON_TIME_DELIVERY: 25,
    ENGAGEMENT: 5,
    multiplier: 1.0,
  },
  AFFILIATE: {
    LEAD_GENERATED: 25,
    CONVERSION: 100,
    TRAFFIC: 1,
    ENGAGEMENT: 5,
    multiplier: 1.0,
  },
  INFLUENCER: {
    ENGAGEMENT: 5,
    SALE: 100,
    REACH: 0.1,
    CAMPAIGN_COMPLETE: 50,
    multiplier: 1.0,
  },
};

// ============================================================================
// 1. LOG ACTIVITY & EARN XP
// ============================================================================

export async function logAchievementActivity(
  userId: string,
  activityType: string,
  activityValue: number,
  metadata?: any
) {
  try {
    // Get user's achievement profile
    let profile = await prisma.achievementProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      // Create profile if doesn't exist
      profile = await prisma.achievementProfile.create({
        data: {
          userId,
          userRole: (await prisma.user.findUnique({
            where: { id: userId },
            select: { role: true },
          }))?.role as UserRole,
          currentLevel: 1,
          currentRank: 'BEGINNER',
          totalXP: 0,
          currentXP: 0,
          xpNeeded: 100,
          leaderboardScore: 0,
        },
      });
    }

    // Get XP config for user's role
    const xpConfig = XP_CONFIG[profile.userRole as keyof typeof XP_CONFIG] || XP_CONFIG.RESELLER;
    let xpEarned = xpConfig[activityType as keyof typeof xpConfig] || 10;

    // Apply multipliers
    xpEarned = Math.floor(xpEarned * xpConfig.multiplier);

    // Check for streak bonus
    const lastActivity = await prisma.achievementActivityLog.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    let streakBonus = 0;
    if (lastActivity) {
      const hoursSinceLastActivity =
        (new Date().getTime() - lastActivity.createdAt.getTime()) / (1000 * 60 * 60);
      
      if (hoursSinceLastActivity < 24) {
        // Continue streak
        if (profile.currentStreak > 0) {
          streakBonus = Math.floor(profile.currentStreak / 7) * 10; // +10 XP every 7 days
        }
      } else {
        // Streak broken
        await prisma.achievementProfile.update({
          where: { userId },
          data: { currentStreak: 0 },
        });
      }
    }

    xpEarned += streakBonus;

    // Log the activity
    const activityLog = await prisma.achievementActivityLog.create({
      data: {
        userId,
        activityType: activityType as any,
        activityValue,
        xpEarned,
        metadata,
      },
    });

    // Update profile with new XP
    const newCurrentXP = profile.currentXP + xpEarned;
    const newTotalXP = profile.totalXP + xpEarned;
    let leveledUp = false;
    let newLevel = profile.currentLevel;
    let newRank = profile.currentRank;
    let newBadges: any[] = [];
    let newTrophy: any = null;

    // Check if level up
    if (newCurrentXP >= profile.xpNeeded) {
      leveledUp = true;
      newLevel = profile.currentLevel + 1;
      
      // Calculate new XP thresholds
      const baseXP = 100;
      const xpNeededForNextLevel = Math.floor(baseXP * Math.pow(1.5, newLevel - 1));

      // Update rank based on level
      newRank = getRankByLevel(profile.userRole, newLevel);

      // Check for badge unlocks from this level
      newBadges = await unlockBadgesForLevel(userId, newLevel, profile.userRole);

      await prisma.achievementProfile.update({
        where: { userId },
        data: {
          currentLevel: newLevel,
          currentRank: newRank,
          currentXP: 0,
          xpNeeded: xpNeededForNextLevel,
          totalXP: newTotalXP,
          lastActivityAt: new Date(),
          currentStreak: profile.currentStreak + 1,
          leaderboardScore: newTotalXP,
        },
      });

      // Create user level record
      const level = await prisma.level.findFirst({
        where: { levelNumber: newLevel },
      });

      if (level) {
        await prisma.userLevel.create({
          data: {
            userId,
            levelId: level.id,
          },
        });
      }
    } else {
      // Just update current XP
      await prisma.achievementProfile.update({
        where: { userId },
        data: {
          currentXP: newCurrentXP,
          totalXP: newTotalXP,
          lastActivityAt: new Date(),
          currentStreak: profile.currentStreak + 1,
          leaderboardScore: newTotalXP,
        },
      });
    }

    // Check for any auto-unlock badges
    const autoBadges = await unlockBadgesFromActivity(userId, activityType, profile.userRole);
    newBadges = [...newBadges, ...autoBadges];

    return {
      success: true,
      xpEarned,
      totalXP: newTotalXP,
      currentXP: leveledUp ? 0 : newCurrentXP,
      leveledUp,
      newLevel,
      newRank,
      currentStreak: profile.currentStreak + 1,
      newBadges,
      newTrophy,
      activityLogId: activityLog.id,
      celebrationRequired: leveledUp || newBadges.length > 0,
    };
  } catch (error) {
    console.error('Error logging achievement activity:', error);
    throw error;
  }
}

// ============================================================================
// 2. UNLOCK BADGES (Automatic)
// ============================================================================

async function unlockBadgesFromActivity(userId: string, activityType: string, userRole: UserRole) {
  const badges: any[] = [];

  // Find badges that match this activity
  const matchingBadges = await prisma.badge.findMany({
    where: {
      AND: [
        { category: activityType as BadgeCategory },
        { OR: [{ userRole: null }, { userRole }] },
        { autoUnlock: true },
      ],
    },
  });

  for (const badge of matchingBadges) {
    // Check if already unlocked
    const existing = await prisma.userBadge.findUnique({
      where: { userId_badgeId: { userId, badgeId: badge.id } },
    });

    if (!existing) {
      // Unlock badge
      const userBadge = await prisma.userBadge.create({
        data: {
          userId,
          badgeId: badge.id,
          isNew: true,
        },
      });

      badges.push({
        id: badge.id,
        name: badge.title,
        category: badge.category,
        rarity: badge.rarity,
        icon: badge.icon,
      });

      // Add XP bonus from badge
      if (badge.xpBonus > 0) {
        await prisma.achievementActivityLog.create({
          data: {
            userId,
            activityType: 'BADGE_UNLOCK' as any,
            activityValue: 1,
            xpEarned: badge.xpBonus,
            metadata: { badgeId: badge.id },
          },
        });

        // Update profile XP
        await prisma.achievementProfile.update({
          where: { userId },
          data: {
            totalXP: { increment: badge.xpBonus },
            currentXP: { increment: badge.xpBonus },
          },
        });
      }
    }
  }

  return badges;
}

async function unlockBadgesForLevel(userId: string, level: number, userRole: UserRole) {
  const badges: any[] = [];

  // Find badges unlocked at this level
  const levelBadges = await prisma.badge.findMany({
    where: {
      AND: [
        { requirementType: 'LEVEL' },
        { requirementValue: level },
        { OR: [{ userRole: null }, { userRole }] },
      ],
    },
  });

  for (const badge of levelBadges) {
    const existing = await prisma.userBadge.findUnique({
      where: { userId_badgeId: { userId, badgeId: badge.id } },
    });

    if (!existing) {
      await prisma.userBadge.create({
        data: {
          userId,
          badgeId: badge.id,
          isNew: true,
        },
      });

      badges.push({
        id: badge.id,
        name: badge.title,
        rarity: badge.rarity,
      });
    }
  }

  return badges;
}

// ============================================================================
// 3. RANK DETERMINATION
// ============================================================================

function getRankByLevel(userRole: UserRole, level: number): string {
  const rankMappings: Record<UserRole, Record<string, [number, number]>> = {
    RESELLER: {
      BRONZE: [1, 5],
      SILVER: [6, 15],
      GOLD: [16, 30],
      PLATINUM: [31, 40],
      DIAMOND: [41, 50],
    },
    FRANCHISE: {
      EMERGING: [1, 5],
      GROWTH: [6, 15],
      ESTABLISHED: [16, 30],
      PREMIUM: [31, 40],
      ELITE: [41, 50],
    },
    AUTHOR: {
      INDIE: [1, 5],
      RISING: [6, 15],
      ESTABLISHED: [16, 30],
      PIONEER: [31, 40],
      LEGENDARY: [41, 50],
    },
    VENDOR: {
      STARTER: [1, 5],
      GROWING: [6, 15],
      PROFESSIONAL: [16, 30],
      EXPERT: [31, 40],
      MASTER: [41, 50],
    },
    AFFILIATE: {
      STARTER: [1, 5],
      PERFORMER: [6, 15],
      TOP_PERFORMER: [16, 30],
      ELITE: [31, 40],
      LEGEND: [41, 50],
    },
    INFLUENCER: {
      MICRO: [1, 5],
      RISING: [6, 15],
      MACRO: [16, 30],
      MEGA: [31, 40],
      LEGENDARY: [41, 50],
    },
    CUSTOMER: { MEMBER: [1, 50] },
    ADMIN: { ADMIN: [1, 50] },
    MANAGER: { MANAGER: [1, 50] },
  };

  const mapping = rankMappings[userRole];
  if (!mapping) return 'MEMBER';

  for (const [rank, [minLevel, maxLevel]] of Object.entries(mapping)) {
    if (level >= minLevel && level <= maxLevel) {
      return rank;
    }
  }

  return 'MEMBER';
}

// ============================================================================
// 4. CLAIM REWARD
// ============================================================================

export async function claimReward(userId: string, rewardId: string) {
  try {
    const reward = await prisma.reward.findUnique({
      where: { id: rewardId },
    });

    if (!reward) {
      throw new Error('Reward not found');
    }

    // Check if already claimed
    const existing = await prisma.userReward.findFirst({
      where: {
        userId,
        rewardId,
        status: 'CLAIMED',
      },
    });

    if (existing) {
      throw new Error('Reward already claimed');
    }

    // Create claim record
    const userReward = await prisma.userReward.create({
      data: {
        userId,
        rewardId,
        status: 'CLAIMED',
        expiresAt: reward.duration
          ? new Date(Date.now() + reward.duration * 24 * 60 * 60 * 1000)
          : null,
      },
    });

    // Apply reward to user account
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (reward.rewardType === 'COMMISSION') {
      // Boost commission rate
      // await updateUserCommissionBoost(userId, reward.value);
    } else if (reward.rewardType === 'LEAD_CREDITS') {
      // Add lead credits
      // await addLeadCredits(userId, parseInt(reward.value));
    } else if (reward.rewardType === 'WALLET') {
      // Add wallet credits
      // await addWalletCredits(userId, reward.value);
    }

    return {
      success: true,
      reward: {
        id: reward.id,
        name: reward.title,
        status: 'CLAIMED',
        claimedAt: userReward.claimedAt,
      },
    };
  } catch (error) {
    console.error('Error claiming reward:', error);
    throw error;
  }
}

// ============================================================================
// 5. UPDATE LEADERBOARD
// ============================================================================

export async function updateLeaderboard() {
  try {
    // Get all achievement profiles sorted by total XP
    const profiles = await prisma.achievementProfile.findMany({
      orderBy: {
        totalXP: 'desc',
      },
    });

    // Update leaderboard ranks
    for (let i = 0; i < profiles.length; i++) {
      await prisma.achievementProfile.update({
        where: { id: profiles[i].id },
        data: {
          leaderboardRank: i + 1,
        },
      });
    }

    // Check for monthly/yearly trophies
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Award monthly trophies to top 10
    const monthlyTrophies = await prisma.trophy.findMany({
      where: { category: 'MONTHLY' },
    });

    for (let i = 0; i < Math.min(10, profiles.length); i++) {
      const profile = profiles[i];
      if (monthlyTrophies.length > 0) {
        const trophy = monthlyTrophies[0];
        await prisma.userTrophy.create({
          data: {
            userId: profile.userId,
            trophyId: trophy.id,
            season: currentMonth,
            rank: i + 1,
          },
        });
      }
    }

    return { success: true, usersRanked: profiles.length };
  } catch (error) {
    console.error('Error updating leaderboard:', error);
    throw error;
  }
}

// ============================================================================
// 6. GET USER PROFILE
// ============================================================================

export async function getUserAchievementProfile(userId: string) {
  try {
    let profile = await prisma.achievementProfile.findUnique({
      where: { userId },
      include: {
        userBadges: { include: { badge: true } },
        userTrophies: { include: { trophy: true } },
        userRewards: { include: { reward: true } },
      },
    });

    if (!profile) {
      // Return default profile
      return {
        level: 1,
        rank: 'BEGINNER',
        xp: 0,
        currentXP: 0,
        xpNeeded: 100,
        badges: [],
        trophies: [],
        rewards: [],
        streak: 0,
        leaderboardRank: null,
      };
    }

    return profile;
  } catch (error) {
    console.error('Error getting achievement profile:', error);
    throw error;
  }
}

export default {
  logAchievementActivity,
  claimReward,
  updateLeaderboard,
  getUserAchievementProfile,
};
