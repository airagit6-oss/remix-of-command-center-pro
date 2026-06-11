/**
 * Achievement Routes - REST API Endpoints
 * All endpoints for achievement system
 */

import express, { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth';
import {
  logAchievementActivity,
  claimReward,
  updateLeaderboard,
  getUserAchievementProfile,
} from '../services/AchievementService';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// ============================================================================
// USER ENDPOINTS
// ============================================================================

/**
 * Log an activity and earn XP
 * POST /api/achievements/xp/log
 */
router.post('/xp/log', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { activityType, activityValue, metadata } = req.body;
    const userId = req.user?.id;

    if (!userId || !activityType) {
      return res.status(400).json({
        error: true,
        code: 'INVALID_REQUEST',
        message: 'Missing required fields',
      });
    }

    const result = await logAchievementActivity(
      userId,
      activityType,
      activityValue || 0,
      metadata
    );

    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      error: true,
      code: 'XP_LOG_ERROR',
      message: error.message,
    });
  }
});

/**
 * Get user's achievement profile
 * GET /api/achievements/profile/:userId
 */
router.get('/profile/:userId', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const profile = await getUserAchievementProfile(userId);

    res.json(profile);
  } catch (error: any) {
    res.status(500).json({
      error: true,
      code: 'PROFILE_ERROR',
      message: error.message,
    });
  }
});

/**
 * Get all badges for user's role
 * GET /api/achievements/badges?role=RESELLER
 */
router.get('/badges', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userRole = req.query.role || 'RESELLER';

    const badges = await prisma.badge.findMany({
      where: {
        OR: [{ userRole: userRole as any }, { userRole: null }],
      },
      orderBy: [{ category: 'asc' }, { rarity: 'asc' }],
    });

    res.json({ badges });
  } catch (error: any) {
    res.status(500).json({
      error: true,
      code: 'BADGES_ERROR',
      message: error.message,
    });
  }
});

/**
 * Get active challenges
 * GET /api/achievements/challenges/active
 */
router.get('/challenges/active', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    const challenges = await prisma.challenge.findMany({
      where: {
        isActive: true,
        startsAt: { lte: new Date() },
        endsAt: { gte: new Date() },
      },
      include: {
        userChallenges: {
          where: { userId },
        },
      },
    });

    res.json({ challenges });
  } catch (error: any) {
    res.status(500).json({
      error: true,
      code: 'CHALLENGES_ERROR',
      message: error.message,
    });
  }
});

/**
 * Get global leaderboard
 * GET /api/achievements/leaderboard?limit=100&period=all
 */
router.get('/leaderboard', authMiddleware, async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 100;

    const leaderboard = await prisma.achievementProfile.findMany({
      orderBy: [{ leaderboardRank: 'asc' }],
      take: limit,
      include: {
        user: { select: { name: true, role: true } },
      },
    });

    const userProfile = await prisma.achievementProfile.findUnique({
      where: { userId: req.user?.id! },
    });

    res.json({
      period: 'all',
      yourRank: userProfile?.leaderboardRank,
      leaderboard: leaderboard.map((item) => ({
        rank: item.leaderboardRank,
        userId: item.userId,
        name: (item as any).user?.name || 'Unknown',
        role: (item as any).user?.role || 'USER',
        level: item.currentLevel,
        xp: item.totalXP,
        streak: item.currentStreak,
      })),
    });
  } catch (error: any) {
    res.status(500).json({
      error: true,
      code: 'LEADERBOARD_ERROR',
      message: error.message,
    });
  }
});

/**
 * Claim a reward
 * POST /api/achievements/rewards/:rewardId/claim
 */
router.post('/rewards/:rewardId/claim', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { rewardId } = req.params;
    const userId = req.user?.id;

    if (!rewardId || !userId) {
      return res.status(400).json({
        error: true,
        code: 'INVALID_REQUEST',
        message: 'Missing required fields',
      });
    }

    const result = await claimReward(userId, rewardId);

    res.json(result);
  } catch (error: any) {
    res.status(400).json({
      error: true,
      code: 'CLAIM_ERROR',
      message: error.message,
    });
  }
});

/**
 * Get user's rewards
 * GET /api/achievements/rewards
 */
router.get('/rewards', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    const rewards = await prisma.userReward.findMany({
      where: { userId },
      include: { reward: true },
      orderBy: { claimedAt: 'desc' },
    });

    const available = await prisma.reward.findMany({
      where: {
        userRewards: {
          none: { userId },
        },
      },
    });

    res.json({
      claimed: rewards,
      available,
    });
  } catch (error: any) {
    res.status(500).json({
      error: true,
      code: 'REWARDS_ERROR',
      message: error.message,
    });
  }
});

// ============================================================================
// ADMIN ENDPOINTS
// ============================================================================

/**
 * Create a badge
 * POST /admin/achievements/badge/create
 */
router.post('/admin/badge/create', authMiddleware, async (req: Request, res: Response) => {
  try {
    // Check admin role
    if (req.user?.role !== 'ADMIN' && req.user?.role !== 'MANAGER') {
      return res.status(403).json({
        error: true,
        code: 'INSUFFICIENT_PERMISSIONS',
        message: 'Only admins can create badges',
      });
    }

    const {
      badgeName,
      title,
      description,
      category,
      userRole,
      requirementType,
      requirementValue,
      icon,
      color,
      rarity,
      autoUnlock,
      xpBonus,
    } = req.body;

    const badge = await prisma.badge.create({
      data: {
        badgeName,
        title,
        description,
        category: category as any,
        userRole,
        requirementType: requirementType as any,
        requirementValue,
        icon,
        color,
        rarity: rarity as any,
        autoUnlock: autoUnlock ?? true,
        xpBonus: xpBonus || 0,
      },
    });

    res.json({ success: true, badge });
  } catch (error: any) {
    res.status(400).json({
      error: true,
      code: 'BADGE_CREATE_ERROR',
      message: error.message,
    });
  }
});

/**
 * Create a challenge
 * POST /admin/achievements/challenge/create
 */
router.post('/admin/challenge/create', authMiddleware, async (req: Request, res: Response) => {
  try {
    // Check admin role
    if (req.user?.role !== 'ADMIN' && req.user?.role !== 'MANAGER') {
      return res.status(403).json({
        error: true,
        code: 'INSUFFICIENT_PERMISSIONS',
        message: 'Only admins can create challenges',
      });
    }

    const {
      challengeName,
      title,
      description,
      challengeType,
      userRole,
      startsAt,
      endsAt,
      season,
      goalMetric,
      targetValue,
      rewardType,
      rewardValue,
      topRewardCount,
    } = req.body;

    const challenge = await prisma.challenge.create({
      data: {
        challengeName,
        title,
        description,
        challengeType: challengeType as any,
        userRole,
        startsAt: new Date(startsAt),
        endsAt: new Date(endsAt),
        season,
        goalDescription: description,
        goalMetric,
        targetValue,
        rewardType,
        rewardValue,
        topRewardCount,
      },
    });

    res.json({ success: true, challenge });
  } catch (error: any) {
    res.status(400).json({
      error: true,
      code: 'CHALLENGE_CREATE_ERROR',
      message: error.message,
    });
  }
});

/**
 * Update achievement settings
 * PUT /admin/achievements/settings
 */
router.put('/admin/settings', authMiddleware, async (req: Request, res: Response) => {
  try {
    // Check admin role
    if (req.user?.role !== 'ADMIN') {
      return res.status(403).json({
        error: true,
        code: 'INSUFFICIENT_PERMISSIONS',
        message: 'Only admins can update settings',
      });
    }

    const settings = await prisma.achievementSetting.findFirst();

    if (settings) {
      const updated = await prisma.achievementSetting.update({
        where: { id: settings.id },
        data: req.body,
      });
      res.json({ success: true, settings: updated });
    } else {
      const created = await prisma.achievementSetting.create({
        data: req.body,
      });
      res.json({ success: true, settings: created });
    }
  } catch (error: any) {
    res.status(400).json({
      error: true,
      code: 'SETTINGS_ERROR',
      message: error.message,
    });
  }
});

/**
 * Update leaderboard rankings
 * POST /admin/achievements/leaderboard/update
 */
router.post('/admin/leaderboard/update', authMiddleware, async (req: Request, res: Response) => {
  try {
    // Check admin role
    if (req.user?.role !== 'ADMIN') {
      return res.status(403).json({
        error: true,
        code: 'INSUFFICIENT_PERMISSIONS',
        message: 'Only admins can update leaderboard',
      });
    }

    const result = await updateLeaderboard();

    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      error: true,
      code: 'LEADERBOARD_UPDATE_ERROR',
      message: error.message,
    });
  }
});

export default router;
