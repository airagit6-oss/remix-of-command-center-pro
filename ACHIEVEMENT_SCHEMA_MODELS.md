// ============================================================================
// ACHIEVEMENT MANAGEMENT SYSTEM - DATABASE SCHEMA
// ============================================================================
// Purpose: Growth Journey for all roles (Reseller, Franchise, Author, 
//          Vendor, Affiliate, Influencer)
// Flow: Activity → XP → Levels → Ranks → Badges → Trophies → Rewards
// ============================================================================

// User Achievement Profile (Links to User model)
model AchievementProfile {
  id              String    @id @default(cuid())
  userId          String    @unique
  user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  currentLevel    Int       @default(1)
  currentRank     String    @default("BEGINNER")
  totalXP         Int       @default(0)
  currentXP       Int       @default(0)     // XP needed to reach next level
  xpNeeded        Int       @default(100)   // XP threshold for next level
  
  totalBadgesUnlocked   Int @default(0)
  totalTrophiesUnlocked Int @default(0)
  totalRewardsEarned    Int @default(0)
  
  currentStreak   Int       @default(0)
  longestStreak   Int       @default(0)
  lastActivityAt  DateTime?
  
  leaderboardRank Int?      // Ranking on global leaderboard
  leaderboardScore Int @default(0) // Score for ranking
  
  userRole        UserRole  // RESELLER, FRANCHISE, AUTHOR, VENDOR, AFFILIATE, INFLUENCER
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  // Relations
  userLevels      UserLevel[]
  userBadges      UserBadge[]
  userTrophies    UserTrophy[]
  userRewards     UserReward[]
  userChallenges  UserChallenge[]
  activityLogs    ActivityLog[]
  
  @@index([userId])
  @@index([currentLevel])
  @@index([currentRank])
  @@index([leaderboardRank])
  @@index([userRole])
}

// ============================================================================
// LEVELS (Progressive Growth)
// Level 1: Beginner (0-100 XP)
// Level 2: Intermediate (100-300 XP) 
// ...
// Level 50: Grand Master (highest)
// ============================================================================
model Level {
  id              String    @id @default(cuid())
  levelNumber     Int       @unique
  title           String    // "Beginner", "Intermediate", "Pro", "Expert", etc.
  description     String
  minXP           Int       // Minimum XP to reach this level
  maxXP           Int       // XP needed to reach next level
  color           String    @default("#3B82F6")
  icon            String    // URL to level badge icon
  
  requiredRank    String?   // Can set minimum rank required to unlock (optional)
  unlocksBadges   String[]  // Badges automatically unlocked at this level
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  userLevels      UserLevel[]
  
  @@index([levelNumber])
  @@index([minXP])
}

// Track user's level progression
model UserLevel {
  id                String    @id @default(cuid())
  userId            String
  achievementProfile AchievementProfile @relation(fields: [userId], references: [userId], onDelete: Cascade)
  
  levelId           String
  level             Level     @relation(fields: [levelId], references: [id])
  
  unlockedAt        DateTime  @default(now())
  
  @@unique([userId, levelId])
  @@index([userId])
  @@index([levelId])
}

// ============================================================================
// RANKS (Role-based Status)
// Reseller: Bronze, Silver, Gold, Platinum, Diamond
// Franchise: Emerging, Growth, Established, Premium, Elite
// Author: Indie, Rising, Established, Pioneer, Legendary
// etc.
// ============================================================================
model Rank {
  id              String    @id @default(cuid())
  rankName        String    @unique
  rankTitle       String
  description     String
  userRole        UserRole  // Which role this rank applies to
  
  minLevel        Int       // Minimum level to unlock
  minXP           Int       // Minimum XP to unlock
  minActivities   Int?      // Minimum completed activities
  
  color           String    @default("#3B82F6")
  badgeIcon       String    // URL to rank badge
  badgeAnimation  String    // "bounce", "pulse", "spin", etc.
  
  perks           String[]  // Benefits of reaching this rank
  // Example: ["5% commission boost", "priority support", "featured listing"]
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  @@index([userRole])
  @@index([minLevel])
}

// ============================================================================
// BADGES (Achievement Unlocks)
// Sales badges, Lead badges, Product badges, Engagement badges, etc.
// ============================================================================
model Badge {
  id              String    @id @default(cuid())
  badgeName       String    @unique
  title           String
  description     String
  
  // Badge categorization
  category        BadgeCategory // SALES, LEAD, PRODUCT, ENGAGEMENT, MILESTONE, CHALLENGE
  userRole        UserRole?     // Specific role, or NULL for all roles
  
  // Unlock conditions
  requirementType BadgeRequirementType // XP, ACTIVITY, SALES, REFERRAL, etc.
  requirementValue Int // "Earn 500 XP", "Make 10 sales", "Refer 5 users"
  
  // Visual
  icon            String    // URL to badge icon
  color           String    @default("#FCD34D")
  rarity          BadgeRarity // COMMON, RARE, EPIC, LEGENDARY
  
  // When unlocked
  autoUnlock      Boolean   @default(true) // Auto-unlock when condition met
  requiresApproval Boolean  @default(false)
  
  // Perks
  xpBonus         Int       @default(0) // Extra XP when badge earned
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  userBadges      UserBadge[]
  
  @@index([category])
  @@index([userRole])
}

// Track user's badges
model UserBadge {
  id                String    @id @default(cuid())
  userId            String
  achievementProfile AchievementProfile @relation(fields: [userId], references: [userId], onDelete: Cascade)
  
  badgeId           String
  badge             Badge     @relation(fields: [badgeId], references: [id])
  
  unlockedAt        DateTime  @default(now())
  seenAt            DateTime? // When user viewed the badge
  isNew             Boolean   @default(true)
  
  @@unique([userId, badgeId])
  @@index([userId])
  @@index([badgeId])
}

// ============================================================================
// TROPHIES (Major Achievements)
// Monthly Champion, Yearly Hall of Fame, Milestone trophies
// ============================================================================
model Trophy {
  id              String    @id @default(cuid())
  trophyName      String    @unique
  title           String
  description     String
  category        TrophyCategory // MONTHLY, YEARLY, MILESTONE, SPECIAL
  
  // Unlock requirements (usually hardest to achieve)
  requirementType String
  requirementValue Int
  
  icon            String    // Trophy icon/image URL
  displayOrder    Int       // Order to display on dashboard
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  userTrophies    UserTrophy[]
  
  @@index([category])
}

// Track user's trophies
model UserTrophy {
  id                String    @id @default(cuid())
  userId            String
  achievementProfile AchievementProfile @relation(fields: [userId], references: [userId], onDelete: Cascade)
  
  trophyId          String
  trophy            Trophy    @relation(fields: [trophyId], references: [id])
  
  unlockedAt        DateTime  @default(now())
  season            Int       // Season number (for monthly/yearly)
  rank              Int?      // Ranking (1st, 2nd, 3rd place)
  
  @@index([userId])
  @@index([trophyId])
  @@unique([userId, trophyId, season])
}

// ============================================================================
// REWARDS (Physical & Digital)
// Commission boost, Lead credits, Free software, Premium access, etc.
// ============================================================================
model Reward {
  id              String    @id @default(cuid())
  rewardName      String    @unique
  title           String
  description     String
  
  rewardType      RewardType // COMMISSION, LEAD_CREDITS, SOFTWARE, DISCOUNT, ACCESS, WALLET, RECOGNITION
  
  // Reward value
  value           Float     // Percentage, amount, or duration
  currency        String?   // For monetary rewards
  duration        Int?      // Days valid for subscription-like rewards
  
  // Unlock conditions
  requiredTrophyId String?
  requiredBadgeId  String?
  requiredRank     String?
  requiredLevel    Int?
  
  // Limits
  maxClaimsPerUser Int   @default(1)
  totalAvailable   Int?  // Total rewards available (NULL = unlimited)
  claimedCount     Int   @default(0)
  
  expiresAt        DateTime?
  
  createdAt        DateTime  @default(now())
  updatedAt        DateTime  @updatedAt
  
  userRewards      UserReward[]
  
  @@index([rewardType])
}

// Track claimed rewards
model UserReward {
  id                String    @id @default(cuid())
  userId            String
  achievementProfile AchievementProfile @relation(fields: [userId], references: [userId], onDelete: Cascade)
  
  rewardId          String
  reward            Reward    @relation(fields: [rewardId], references: [id])
  
  claimedAt         DateTime  @default(now())
  usedAt            DateTime?
  expiresAt         DateTime?
  status            RewardStatus // AVAILABLE, CLAIMED, USED, EXPIRED
  
  @@index([userId])
  @@index([rewardId])
  @@index([status])
}

// ============================================================================
// CHALLENGES (Weekly, Monthly, Yearly)
// ============================================================================
model Challenge {
  id              String    @id @default(cuid())
  challengeName   String    @unique
  title           String
  description     String
  
  challengeType   ChallengeType // WEEKLY, MONTHLY, YEARLY
  userRole        UserRole?     // Specific role, or NULL for all
  
  // Timeline
  startsAt        DateTime
  endsAt          DateTime
  season          Int       // Week/Month/Year number
  
  // Goal
  goalDescription String
  goalMetric      String    // "Sales", "Leads", "Engagement", etc.
  targetValue     Int       // e.g., 10 sales, 50 leads
  
  // Rewards
  rewardType      String    // What users earn (XP, badge, trophy, etc.)
  rewardValue     Int
  topRewardCount  Int?      // Top 3, 5, 10, etc.
  
  isActive        Boolean   @default(true)
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  userChallenges  UserChallenge[]
  
  @@index([challengeType])
  @@index([userRole])
  @@index([startsAt, endsAt])
}

// Track user's challenge progress
model UserChallenge {
  id                String    @id @default(cuid())
  userId            String
  achievementProfile AchievementProfile @relation(fields: [userId], references: [userId], onDelete: Cascade)
  
  challengeId       String
  challenge         Challenge @relation(fields: [challengeId], references: [id], onDelete: Cascade)
  
  currentProgress   Int       @default(0)
  completed         Boolean   @default(false)
  completedAt       DateTime?
  
  ranking           Int?      // Final ranking in challenge
  prizeAwarded      Boolean   @default(false)
  
  @@unique([userId, challengeId])
  @@index([userId])
  @@index([challengeId])
  @@index([completed])
}

// ============================================================================
// ACHIEVEMENT SETTINGS (Admin Configuration)
// ============================================================================
model AchievementSetting {
  id              String    @id @default(cuid())
  
  // XP Rules
  baseXPPerActivity Int   @default(10)
  xpMultiplier    Float   @default(1.0)
  xpPerReferral   Int     @default(50)
  xpPerSale       Int     @default(100)
  xpPerLead       Int     @default(25)
  xpPerProductUpload Int  @default(75)
  xpPerEngagement Int     @default(5)
  
  // Level Progression
  baseXPRequiredPerLevel Int @default(100)
  xpIncreasePerLevel Float   @default(1.5)
  maxLevel        Int     @default(50)
  
  // Leaderboard
  leaderboardUpdateFrequency String @default("daily") // "realtime", "daily", "weekly"
  leaderboardEnabled Boolean @default(true)
  
  // Challenges
  weeklyChallenge Boolean @default(true)
  monthlyChallenge Boolean @default(true)
  yearlyChallenge Boolean @default(true)
  
  // Notifications
  notifyOnLevelUp Boolean @default(true)
  notifyOnBadge   Boolean @default(true)
  notifyOnTrophy  Boolean @default(true)
  notifyOnReward  Boolean @default(true)
  
  // Feature Flags
  achievementsEnabled Boolean @default(true)
  gamificationEnabled Boolean @default(true)
  
  updatedAt       DateTime  @updatedAt
  
  @@id([id]) // Only one settings record
}

// ============================================================================
// ACTIVITY LOG (Track all XP-earning activities)
// ============================================================================
model ActivityLog {
  id                String    @id @default(cuid())
  userId            String
  achievementProfile AchievementProfile @relation(fields: [userId], references: [userId], onDelete: Cascade)
  
  activityType      ActivityType // SALE, LEAD, REFERRAL, PRODUCT_UPLOAD, ENGAGEMENT, CHALLENGE, etc.
  activityValue     Int       // e.g., sale amount, leads count
  xpEarned          Int
  
  metadata          Json?     // Extra details (orderID, productID, etc.)
  
  createdAt         DateTime  @default(now())
  
  @@index([userId])
  @@index([activityType])
  @@index([createdAt])
}

// ============================================================================
// ENUMS
// ============================================================================

enum BadgeCategory {
  SALES
  LEAD
  PRODUCT
  ENGAGEMENT
  MILESTONE
  CHALLENGE
  SPECIAL
}

enum BadgeRequirementType {
  XP
  ACTIVITY_COUNT
  SALES_COUNT
  LEAD_COUNT
  REFERRAL_COUNT
  PRODUCT_COUNT
  ENGAGEMENT_COUNT
  CUSTOM
}

enum BadgeRarity {
  COMMON
  RARE
  EPIC
  LEGENDARY
}

enum TrophyCategory {
  MONTHLY
  YEARLY
  MILESTONE
  SPECIAL
}

enum RewardType {
  COMMISSION        // Commission rate boost (e.g., +5%)
  LEAD_CREDITS      // Free leads to pursue
  SOFTWARE          // Free/discounted software access
  DISCOUNT          // Percentage discount on purchase
  ACCESS            // Premium feature access
  WALLET            // Account wallet credits
  RECOGNITION       // Spotlight/featured placement
  CUSTOM            // Other rewards
}

enum RewardStatus {
  AVAILABLE
  CLAIMED
  USED
  EXPIRED
}

enum ChallengeType {
  WEEKLY
  MONTHLY
  YEARLY
}

enum ActivityType {
  SALE
  LEAD_GENERATED
  REFERRAL
  PRODUCT_UPLOAD
  ENGAGEMENT
  CHALLENGE_COMPLETED
  CUSTOM
}

// ============================================================================
// ROLE-SPECIFIC ACHIEVEMENT RULES
// ============================================================================

model RoleAchievementRule {
  id              String    @id @default(cuid())
  userRole        UserRole  @unique
  
  // Activities that earn XP for this role
  activityXPConfig Json     // { "sale": 100, "lead": 25, "referral": 50, ... }
  
  // Rank progression for this role
  rankOrder       String[]  // ["BRONZE", "SILVER", "GOLD", "PLATINUM", "DIAMOND"]
  
  // Specific badges for this role
  roleBadges      String[]  // Comma-separated badge IDs
  
  // Custom rules
  customRules     Json?
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}

// ============================================================================
// SPOTLIGHT (Featured Top Performers)
// ============================================================================

model Spotlight {
  id              String    @id @default(cuid())
  userId          String
  user            User      @relation("Spotlight", fields: [userId], references: [id], onDelete: Cascade)
  
  spotlightType   String    // "weekly_champion", "monthly_champion", "trending", "featured"
  title           String
  description     String
  
  startDate       DateTime
  endDate         DateTime
  
  achievements    Json?     // Summary of user's recent achievements
  stats           Json?     // Performance stats (sales, leads, engagement, etc.)
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  @@index([userId])
  @@index([spotlightType])
  @@unique([userId, spotlightType])
}

// ============================================================================
// HALL OF FAME (Yearly Recognition)
// ============================================================================

model HallOfFame {
  id              String    @id @default(cuid())
  userId          String
  user            User      @relation("HallOfFame", fields: [userId], references: [id], onDelete: Cascade)
  
  year            Int
  userRole        UserRole
  ranking         Int       // 1st, 2nd, 3rd, etc.
  
  achievements    String    // Summary of what made them hall of fame
  stats           Json      // Performance metrics
  
  createdAt       DateTime  @default(now())
  
  @@unique([userId, year, userRole])
  @@index([year])
  @@index([userRole])
}

// Update User model to include achievement relations
model User {
  // ... existing fields ...
  
  // Achievement Relations
  achievementProfile  AchievementProfile?
  spotlightedAs       Spotlight?    @relation("Spotlight")
  hallOfFameEntries   HallOfFame[]  @relation("HallOfFame")
}
