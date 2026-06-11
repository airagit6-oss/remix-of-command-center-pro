/**
 * Achievement System Server Integration
 * Add this to your main server file (e.g., server.ts or app.ts) to initialize the achievement system
 */

import express, { Express } from 'express';
import achievementRoutes from './routes/achievements';
import seedAchievementSystem from './seedRunner';

/**
 * Initialize Achievement System
 * Call this function during server startup
 */
export async function initializeAchievementSystem(app: Express) {
  console.log('🎮 Initializing Achievement System...');

  try {
    // 1. Register achievement routes
    app.use('/api/achievements', achievementRoutes);
    app.use('/admin/achievements', achievementRoutes);
    console.log('✅ Achievement routes registered');

    // 2. Run seed (optional - run once or check if data exists)
    // Uncomment the next line to seed data on every restart
    // await seedAchievementSystem();

    // 3. Initialize global settings if not exists
    const settings = await checkGlobalSettings();
    if (!settings) {
      console.log('⚙️ Creating default global settings...');
      // Settings created in seed
    }

    console.log('🎮 Achievement System initialized successfully!');
  } catch (error) {
    console.error('❌ Error initializing Achievement System:', error);
    throw error;
  }
}

/**
 * Check if global settings exist
 */
async function checkGlobalSettings() {
  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();

    const settings = await prisma.achievementSetting.findUnique({
      where: { key: 'GLOBAL' },
    });

    await prisma.$disconnect();
    return settings;
  } catch (error) {
    console.error('Error checking settings:', error);
    return null;
  }
}

/**
 * Middleware to add achievement context to requests
 */
export function achievementContextMiddleware(req: any, res: any, next: any) {
  // Add achievement service to request context
  req.achievements = {
    userId: req.user?.id,
    userRole: req.user?.role,
    timestamp: new Date(),
  };
  next();
}

// Example of how to use in your main app:
/*
import { initializeAchievementSystem, achievementContextMiddleware } from './backend/achievementIntegration';

const app = express();

// After your auth middleware
app.use(achievementContextMiddleware);

// Initialize achievement system
initializeAchievementSystem(app);

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
*/
