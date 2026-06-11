# 🔌 ACHIEVEMENT SYSTEM - API SPECIFICATIONS

**Version:** 1.0.0  
**Last Updated:** 2026-06-11  
**Status:** ✅ Frontend Ready (Awaiting Backend)

---

## 📚 TABLE OF CONTENTS
1. [Authentication](#auth)
2. [User Achievement Profile](#profile)
3. [XP & Activity Logging](#xp)
4. [Badges & Trophies](#badges)
5. [Rewards Management](#rewards)
6. [Challenges](#challenges)
7. [Leaderboard](#leaderboard)
8. [Admin Management](#admin)
9. [Error Codes](#errors)

---

## 🔐 AUTHENTICATION {#auth}

All endpoints require JWT token in header:

```
Authorization: Bearer <JWT_TOKEN>
```

---

## 👤 USER ACHIEVEMENT PROFILE {#profile}

### GET `/api/achievements/profile/:userId`

Get user's complete achievement profile.

**Response:**
```json
{
  "id": "clpxyz123",
  "userId": "user_123",
  "currentLevel": 5,
  "currentRank": "PRO",
  "totalXP": 850,
  "currentXP": 50,
  "xpNeeded": 100,
  "totalBadgesUnlocked": 3,
  "totalTrophiesUnlocked": 1,
  "totalRewardsEarned": 2,
  "currentStreak": 7,
  "longestStreak": 15,
  "lastActivityAt": "2024-06-11T10:30:00Z",
  "leaderboardRank": 12,
  "leaderboardScore": 850,
  "userRole": "RESELLER",
  "nextMilestone": "Level 6 (in 50 XP)",
  "badges": [
    {
      "id": "badge_1",
      "name": "First Sale",
      "category": "SALES",
      "rarity": "COMMON",
      "unlockedAt": "2024-05-01T10:00:00Z"
    }
  ],
  "trophies": [
    {
      "id": "trophy_1",
      "name": "Weekly Champion",
      "season": 23,
      "rank": 1,
      "unlockedAt": "2024-06-08T10:00:00Z"
    }
  ],
  "rewards": [
    {
      "id": "reward_1",
      "name": "5% Commission Boost",
      "type": "COMMISSION",
      "value": "5%",
      "status": "AVAILABLE",
      "expiresAt": "2024-07-10T23:59:59Z"
    }
  ]
}
```

**Error Responses:**
- `404` - User not found
- `401` - Unauthorized
- `500` - Server error

---

## ⚡ XP & ACTIVITY LOGGING {#xp}

### POST `/api/achievements/xp/log`

Log an activity and earn XP.

**Request Body:**
```json
{
  "userId": "user_123",
  "activityType": "SALE",
  "activityValue": 5000,
  "metadata": {
    "saleId": "sale_456",
    "productId": "prod_789",
    "customerId": "cust_321"
  }
}
```

**Activity Types & Default XP:**
```
SALE            → 100 XP (+ multiplier based on amount)
LEAD_GENERATED  → 25 XP
REFERRAL        → 50 XP
PRODUCT_UPLOAD  → 75 XP
ENGAGEMENT      → 5 XP
CHALLENGE_COMPLETED → varies
CUSTOM          → admin-defined
```

**Response:**
```json
{
  "success": true,
  "xpEarned": 120,
  "totalXP": 970,
  "newLevel": false,
  "newBadges": [],
  "newTrophy": null,
  "activityLogId": "log_123"
}
```

**If Level-Up:**
```json
{
  "success": true,
  "xpEarned": 120,
  "totalXP": 970,
  "newLevel": true,
  "levelNumber": 6,
  "newRank": "ADVANCED",
  "celebrationRequired": true,
  "newBadges": [
    {
      "id": "badge_5",
      "name": "Level 6 Master",
      "rarity": "RARE"
    }
  ],
  "activityLogId": "log_123"
}
```

**Error Codes:**
- `400` - Invalid activity type
- `401` - Unauthorized
- `404` - User not found
- `422` - Invalid metadata
- `500` - Server error

---

### GET `/api/achievements/activity-log/:userId`

Get user's activity history (paginated).

**Query Parameters:**
```
?page=1&limit=20&type=SALE&startDate=2024-06-01&endDate=2024-06-30
```

**Response:**
```json
{
  "total": 156,
  "page": 1,
  "limit": 20,
  "activities": [
    {
      "id": "log_1",
      "userId": "user_123",
      "activityType": "SALE",
      "activityValue": 5000,
      "xpEarned": 120,
      "createdAt": "2024-06-11T10:30:00Z",
      "metadata": {
        "saleId": "sale_456",
        "productId": "prod_789"
      }
    }
  ]
}
```

---

### GET `/api/achievements/levels`

Get all level definitions.

**Response:**
```json
{
  "levels": [
    {
      "id": "level_1",
      "levelNumber": 1,
      "title": "Beginner",
      "description": "Just starting out",
      "minXP": 0,
      "maxXP": 100,
      "color": "#3B82F6",
      "icon": "🏅"
    },
    {
      "id": "level_2",
      "levelNumber": 2,
      "title": "Intermediate",
      "minXP": 100,
      "maxXP": 250,
      "color": "#8B5CF6",
      "icon": "🎯"
    }
  ]
}
```

---

## 🎖️ BADGES & TROPHIES {#badges}

### GET `/api/achievements/badges`

Get all available badges for user's role.

**Query Parameters:**
```
?role=RESELLER&category=SALES&rarity=RARE
```

**Response:**
```json
{
  "badges": [
    {
      "id": "badge_1",
      "name": "First Sale",
      "category": "SALES",
      "rarity": "COMMON",
      "requirementType": "SALE_COUNT",
      "requirementValue": 1,
      "icon": "🛍️",
      "description": "Complete your first sale",
      "unlocked": true,
      "unlockedAt": "2024-05-01T10:00:00Z"
    },
    {
      "id": "badge_2",
      "name": "Sales Master",
      "category": "SALES",
      "rarity": "EPIC",
      "requirementType": "SALE_COUNT",
      "requirementValue": 100,
      "icon": "🏆",
      "description": "Complete 100 sales",
      "unlocked": false,
      "progressValue": 45
    }
  ]
}
```

---

### GET `/api/achievements/trophies/:season?`

Get trophies for current or specific season.

**Response:**
```json
{
  "season": 23,
  "trophies": [
    {
      "id": "trophy_1",
      "name": "Weekly Champion",
      "category": "MONTHLY",
      "icon": "🏆",
      "locked": false,
      "rank": 1,
      "unlockedAt": "2024-06-08T10:00:00Z"
    }
  ]
}
```

---

## 🎁 REWARDS MANAGEMENT {#rewards}

### GET `/api/achievements/rewards`

Get user's available and claimed rewards.

**Response:**
```json
{
  "available": [
    {
      "id": "reward_1",
      "name": "5% Commission Boost",
      "description": "Get 5% commission on all sales for 30 days",
      "type": "COMMISSION",
      "value": "5%",
      "expiresAt": "2024-07-10T23:59:59Z",
      "status": "AVAILABLE",
      "requirementsMet": true
    }
  ],
  "claimed": [
    {
      "id": "reward_2",
      "name": "50 Lead Credits",
      "type": "LEAD_CREDITS",
      "value": "50",
      "claimedAt": "2024-06-05T10:00:00Z",
      "usedAt": "2024-06-07T14:30:00Z",
      "status": "USED"
    }
  ]
}
```

---

### POST `/api/achievements/rewards/:rewardId/claim`

Claim an earned reward.

**Response:**
```json
{
  "success": true,
  "reward": {
    "id": "reward_1",
    "name": "5% Commission Boost",
    "status": "CLAIMED",
    "claimedAt": "2024-06-11T10:00:00Z",
    "expiresAt": "2024-07-10T23:59:59Z"
  },
  "appliedToAccount": true
}
```

---

## 🎯 CHALLENGES {#challenges}

### GET `/api/achievements/challenges/active`

Get user's active challenges.

**Response:**
```json
{
  "active": [
    {
      "id": "challenge_1",
      "title": "Make 5 Sales This Week",
      "description": "Close 5 sales to earn bonus XP",
      "type": "WEEKLY",
      "startsAt": "2024-06-10T00:00:00Z",
      "endsAt": "2024-06-17T23:59:59Z",
      "season": 23,
      "goalMetric": "sales",
      "targetValue": 5,
      "progress": 3,
      "reward": "500 XP + Badge",
      "completed": false,
      "completedAt": null
    }
  ]
}
```

---

### PUT `/api/achievements/challenges/:challengeId/progress`

Update challenge progress (usually auto-updated via activity log).

**Request Body:**
```json
{
  "progressIncrement": 1
}
```

**Response:**
```json
{
  "success": true,
  "challenge": {
    "id": "challenge_1",
    "progress": 4,
    "targetValue": 5,
    "percentComplete": 80,
    "completed": false
  }
}
```

**If Challenge Completed:**
```json
{
  "success": true,
  "challenge": {
    "id": "challenge_1",
    "progress": 5,
    "targetValue": 5,
    "percentComplete": 100,
    "completed": true,
    "completedAt": "2024-06-15T14:30:00Z"
  },
  "rewards": {
    "xpAwarded": 500,
    "badgeUnlocked": "challenge_badge_1"
  },
  "celebrationRequired": true
}
```

---

## 🏆 LEADERBOARD {#leaderboard}

### GET `/api/achievements/leaderboard`

Get global leaderboard.

**Query Parameters:**
```
?period=all&limit=100&role=RESELLER&page=1
```

**Response:**
```json
{
  "period": "all",
  "total": 5234,
  "yourRank": 12,
  "leaderboard": [
    {
      "rank": 1,
      "userId": "user_001",
      "name": "Raj Kumar",
      "role": "RESELLER",
      "level": 12,
      "xp": 5400,
      "streak": 45,
      "badge": "Top Performer"
    },
    {
      "rank": 2,
      "userId": "user_002",
      "name": "Priya Singh",
      "role": "AUTHOR",
      "level": 11,
      "xp": 4800,
      "streak": 38
    },
    {
      "rank": 12,
      "userId": "user_123",
      "name": "You",
      "role": "RESELLER",
      "level": 5,
      "xp": 850,
      "streak": 7,
      "isYou": true
    }
  ]
}
```

---

## 🛠️ ADMIN MANAGEMENT {#admin}

### POST `/admin/achievements/badge/create`

Create a new badge (admin only).

**Request Body:**
```json
{
  "badgeName": "Sales Master",
  "title": "Sales Master",
  "description": "Achieve 100 sales",
  "category": "SALES",
  "userRole": "RESELLER",
  "requirementType": "SALE_COUNT",
  "requirementValue": 100,
  "icon": "🏆",
  "color": "#FFD700",
  "rarity": "EPIC",
  "autoUnlock": true,
  "xpBonus": 250
}
```

**Response:**
```json
{
  "success": true,
  "badge": {
    "id": "badge_new",
    "badgeName": "Sales Master",
    "createdAt": "2024-06-11T10:00:00Z"
  }
}
```

---

### POST `/admin/achievements/challenge/create`

Create a new challenge.

**Request Body:**
```json
{
  "challengeName": "weekly_sales_05",
  "title": "Make 5 Sales This Week",
  "description": "Close 5 sales to earn bonus XP",
  "challengeType": "WEEKLY",
  "userRole": "RESELLER",
  "startsAt": "2024-06-10T00:00:00Z",
  "endsAt": "2024-06-17T23:59:59Z",
  "season": 23,
  "goalMetric": "sales",
  "targetValue": 5,
  "rewardType": "XP",
  "rewardValue": 500,
  "topRewardCount": 10
}
```

**Response:**
```json
{
  "success": true,
  "challenge": {
    "id": "challenge_new",
    "challengeName": "weekly_sales_05",
    "createdAt": "2024-06-11T10:00:00Z"
  }
}
```

---

### PUT `/admin/achievements/settings`

Update global achievement settings.

**Request Body:**
```json
{
  "xpPerSale": 100,
  "xpPerLead": 25,
  "xpPerReferral": 50,
  "xpPerProductUpload": 75,
  "xpPerEngagement": 5,
  "xpMultiplier": 1.0,
  "leaderboardEnabled": true,
  "notifyOnLevelUp": true,
  "notifyOnBadge": true,
  "notifyOnTrophy": true,
  "achievementsEnabled": true
}
```

**Response:**
```json
{
  "success": true,
  "settings": {
    "updatedAt": "2024-06-11T10:00:00Z",
    "appliedTo": "all_users"
  }
}
```

---

### POST `/admin/achievements/leaderboard/update`

Manually trigger leaderboard update (usually automatic).

**Response:**
```json
{
  "success": true,
  "usersRanked": 5234,
  "updatedAt": "2024-06-11T10:30:00Z"
}
```

---

## ❌ ERROR CODES {#errors}

### Standard Error Response
```json
{
  "error": true,
  "code": "ERROR_CODE",
  "message": "Human-readable error message",
  "details": {}
}
```

### Common Errors

| Code | HTTP | Meaning |
|------|------|---------|
| `INVALID_ACTIVITY_TYPE` | 400 | Activity type not recognized |
| `USER_NOT_FOUND` | 404 | User doesn't exist |
| `ACHIEVEMENT_NOT_FOUND` | 404 | Badge/trophy/reward not found |
| `INSUFFICIENT_PERMISSIONS` | 403 | User not admin (for admin endpoints) |
| `REWARD_EXPIRED` | 400 | Reward has expired |
| `REWARD_ALREADY_CLAIMED` | 400 | Reward already claimed by user |
| `REQUIREMENTS_NOT_MET` | 400 | Cannot claim reward (requirements not met) |
| `DUPLICATE_ACTIVITY` | 409 | Activity already logged (prevent duplication) |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |

---

## 📋 IMPLEMENTATION ROADMAP

### Phase 1: Core APIs (Week 1)
- [x] Design API contracts
- [ ] Implement XP logging
- [ ] Implement profile fetch
- [ ] Implement badge unlock logic
- [ ] Implement level-up logic

### Phase 2: Challenge & Leaderboard (Week 2)
- [ ] Implement challenge tracking
- [ ] Implement leaderboard computation
- [ ] Implement reward claiming
- [ ] Implement admin APIs

### Phase 3: Notifications & Features (Week 3)
- [ ] Push notifications
- [ ] Email notifications
- [ ] Celebration animations
- [ ] Real-time updates via WebSocket

### Phase 4: Testing & Optimization (Week 4)
- [ ] Unit tests
- [ ] Integration tests
- [ ] Performance optimization
- [ ] Load testing

---

**Status:** ✅ API Specification Complete

**Next:** Backend team to implement these endpoints

**Questions?** Refer to ACHIEVEMENT_SYSTEM_GUIDE.md for business logic details.
