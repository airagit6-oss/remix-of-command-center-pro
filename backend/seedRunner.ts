/**
 * Seed Runner - Populates database with initial achievement data
 * Run once on server startup or manually via: npm run seed:achievements
 */

import { PrismaClient } from '@prisma/client';
import {
  seedLevels,
  seedRanks,
  seedBadges,
  seedRewards,
  seedChallenges,
  seedTrophies,
} from './seedData';

const prisma = new PrismaClient();

export async function seedAchievementSystem() {
  console.log('🌱 Starting achievement system seed...');

  try {
    // 1. Seed Levels
    console.log('📊 Seeding levels...');
    for (const level of seedLevels) {
      await prisma.level.upsert({
        where: { level: level.level },
        update: {},
        create: {
          level: level.level,
          title: level.title,
          minXP: level.minXP,
          maxXP: level.maxXP,
          icon: level.icon,
        },
      });
    }
    console.log(`✅ Seeded ${seedLevels.length} levels`);

    // 2. Seed Ranks (one per role)
    console.log('👑 Seeding ranks...');
    let rankCount = 0;
    for (const [role, ranks] of Object.entries(seedRanks)) {
      for (const rank of ranks) {
        await prisma.rank.upsert({
          where: {
            rankName_userRole: {
              rankName: rank.rank,
              userRole: role as any,
            },
          },
          update: {},
          create: {
            rankName: rank.rank,
            userRole: role as any,
            minLevel: rank.minLevel,
            maxLevel: rank.maxLevel,
            icon: rank.icon,
          },
        });
        rankCount++;
      }
    }
    console.log(`✅ Seeded ${rankCount} ranks`);

    // 3. Seed Badges
    console.log('🎖️ Seeding badges...');
    for (const badge of seedBadges) {
      await prisma.badge.upsert({
        where: { title: badge.title },
        update: {},
        create: {
          title: badge.title,
          category: badge.category as any,
          rarity: badge.rarity as any,
          description: badge.description,
          requirementType: badge.requirementType as any,
          requirementValue: badge.requirementValue,
          requirementActivity: (badge as any).requirementActivity as any,
          icon: badge.icon,
        },
      });
    }
    console.log(`✅ Seeded ${seedBadges.length} badges`);

    // 4. Seed Rewards
    console.log('🎁 Seeding rewards...');
    for (const reward of seedRewards) {
      await prisma.reward.upsert({
        where: { title: reward.title },
        update: {},
        create: {
          title: reward.title,
          description: reward.description,
          rewardType: reward.rewardType as any,
          value: reward.value,
          durationDays: reward.durationDays,
          icon: reward.icon,
          requirementLevel: reward.requirementLevel,
        },
      });
    }
    console.log(`✅ Seeded ${seedRewards.length} rewards`);

    // 5. Seed Challenges
    console.log('🎯 Seeding challenges...');
    for (const challenge of seedChallenges) {
      await prisma.challenge.upsert({
        where: { title: challenge.title },
        update: {},
        create: {
          title: challenge.title,
          description: challenge.description,
          type: challenge.type as any,
          goalMetric: challenge.goalMetric,
          targetValue: challenge.targetValue,
          rewardXP: challenge.reward.xp,
          rewardTitle: (challenge.reward as any).rewardTitle || (challenge.reward as any).badgeTitle,
          icon: challenge.icon,
          isActive: true,
        },
      });
    }
    console.log(`✅ Seeded ${seedChallenges.length} challenges`);

    // 6. Seed Trophies
    console.log('🏆 Seeding trophies...');
    for (const trophy of seedTrophies) {
      await prisma.trophy.upsert({
        where: { title: trophy.title },
        update: {},
        create: {
          title: trophy.title,
          category: trophy.category as any,
          icon: trophy.icon,
          description: trophy.description,
        },
      });
    }
    console.log(`✅ Seeded ${seedTrophies.length} trophies`);

    // 7. Create global settings
    console.log('⚙️ Creating global settings...');
    await prisma.achievementSetting.upsert({
      where: { key: 'GLOBAL' },
      update: {},
      create: {
        key: 'GLOBAL',
        gamificationEnabled: true,
        soundEnabled: true,
        celebrationEnabled: true,
        streakRequiredDays: 1,
        monthlyLeaderboardResetDay: 1,
        yearlyLeaderboardResetDay: 1,
      },
    });
    console.log('✅ Created global settings');

    console.log('🎉 Achievement system seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding achievement system:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run if called directly
if (require.main === module) {
  seedAchievementSystem().catch(console.error);
}

export default seedAchievementSystem;
