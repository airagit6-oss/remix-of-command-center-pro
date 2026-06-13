# Phase 1 Implementation: Database & API Optimization

**Status:** In Progress  
**Target Duration:** Weeks 1-2  
**Priority:** CRITICAL  

---

## 1. DATABASE INDEXING

### MongoDB Index Strategy

The system has 13 models requiring strategic indexing for 1M+ users:

```javascript
// User Model Indexes
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ createdAt: -1 });
db.users.createIndex({ status: 1, createdAt: -1 });
db.users.createIndex({ companyId: 1, role: 1 });
db.users.createIndex({ lastLogin: -1 });

// API Manager Model Indexes  
db.apimanagers.createIndex({ userId: 1, status: 1 });
db.apimanagers.createIndex({ createdAt: -1 });
db.apimanagers.createIndex({ tags: 1, status: 1 });
db.apimanagers.createIndex({ tier: 1, createdAt: -1 });

// Subscription Model Indexes
db.subscriptions.createIndex({ userId: 1, status: 1 });
db.subscriptions.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index
db.subscriptions.createIndex({ companyId: 1, tier: 1 });
db.subscriptions.createIndex({ renewalDate: 1 });

// Transaction Model Indexes
db.transactions.createIndex({ userId: 1, createdAt: -1 });
db.transactions.createIndex({ status: 1, createdAt: -1 });
db.transactions.createIndex({ transactionId: 1 }, { unique: true });
db.transactions.createIndex({ amount: -1 }); // for analytics

// Audit Model Indexes
db.audits.createIndex({ userId: 1, action: 1, createdAt: -1 });
db.audits.createIndex({ createdAt: -1 });
db.audits.createIndex({ entityType: 1, entityId: 1 });

// Activity Model Indexes
db.activities.createIndex({ userId: 1, createdAt: -1 });
db.activities.createIndex({ type: 1, createdAt: -1 });
db.activities.createIndex({ timestamp: -1 });
```

### Implementation Steps:

1. **Connect to MongoDB**
   ```bash
   mongo mongodb://localhost:27017/software-vala-ai-api-manager
   ```

2. **Run index creation script** - Create [PHASE1_CREATE_INDEXES.mongo](./scripts/PHASE1_CREATE_INDEXES.mongo)

3. **Verify indexes**
   ```javascript
   db.users.getIndexes();
   db.apimanagers.getIndexes();
   ```

4. **Monitor index performance**
   ```javascript
   db.users.aggregate([
     { $indexStats: {} }
   ]).pretty();
   ```

---

## 2. QUERY OPTIMIZATION

### Mongoose Query Patterns

Replace all queries to optimize for performance:

#### Before (Inefficient - N+1 Problem):
```typescript
// BAD: Multiple queries in loop
const users = await User.find({ status: 'active' });
const enriched = [];
for (const user of users) {
  const subscriptions = await Subscription.find({ userId: user._id });
  enriched.push({ ...user.toObject(), subscriptions });
}
```

#### After (Optimized - Single Query):
```typescript
// GOOD: Single aggregation pipeline
const enriched = await User.aggregate([
  { $match: { status: 'active' } },
  {
    $lookup: {
      from: 'subscriptions',
      localField: '_id',
      foreignField: 'userId',
      as: 'subscriptions'
    }
  },
  { $project: { email: 1, status: 1, subscriptions: 1 } }
]);
```

### Lean Queries (Read-Only)
```typescript
// GOOD: For read-only queries (50% memory reduction)
const users = await User.find({ status: 'active' }).lean();

// BAD: Returns full Mongoose documents with overhead
const users = await User.find({ status: 'active' });
```

### Query Response Caching
```typescript
// WITH CACHING (implemented in Phase 1)
async function getCachedUsers(page = 1, limit = 50) {
  const cacheKey = `users:page:${page}:limit:${limit}`;
  
  // Check cache first
  let cached = await redis.get(cacheKey);
  if (cached) return JSON.parse(cached);
  
  // Query database if not cached
  const users = await User.find()
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();
  
  // Cache for 15 minutes
  await redis.setex(cacheKey, 900, JSON.stringify(users));
  
  return users;
}
```

---

## 3. API PAGINATION

### Pagination Implementation for All List Endpoints

#### Endpoint Template:
```
GET /api/v1/resource?page=1&limit=50&sort=createdAt&order=desc&filter[status]=active

Response:
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 5000,
    "pages": 100,
    "hasMore": true,
    "nextPage": 2,
    "prevPage": null
  }
}
```

#### Implementation in Express:
```typescript
// src/server/middleware/pagination.ts
export interface PaginationQuery {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export function parsePaginationQuery(
  query: any
): { skip: number; limit: number; sort: { [key: string]: 1 | -1 } } {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 50));
  const skip = (page - 1) * limit;
  
  const sort: { [key: string]: 1 | -1 } = {};
  if (query.sort) {
    const order = query.order === 'asc' ? 1 : -1;
    sort[query.sort] = order;
  } else {
    sort['createdAt'] = -1; // Default sort
  }
  
  return { skip, limit, sort };
}

// Usage in routes:
router.get('/apis', async (req: Request, res: Response) => {
  const { skip, limit, sort } = parsePaginationQuery(req.query);
  
  const total = await Api.countDocuments();
  const data = await Api.find()
    .skip(skip)
    .limit(limit)
    .sort(sort)
    .lean();
  
  res.json({
    data,
    pagination: {
      page: Math.floor(skip / limit) + 1,
      limit,
      total,
      pages: Math.ceil(total / limit),
      hasMore: skip + limit < total,
    }
  });
});
```

---

## 4. RESPONSE COMPRESSION

### Enable Gzip Middleware

```typescript
// src/server/index.ts
import compression from 'compression';

app.use(compression({
  level: 6, // Balance between speed and compression (0-9)
  threshold: 1024, // Only compress responses > 1KB
  filter: (req: Request, res: Response) => {
    // Don't compress if client doesn't support it
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  }
}));
```

**Install dependency:**
```bash
npm install compression
npm install -D @types/compression
```

**Expected compression ratio:** 60-80% reduction in response size

---

## 5. RATE LIMITING

### Express Rate Limiting

```typescript
// src/server/middleware/rateLimiter.ts
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import redis from 'redis';

const redisClient = redis.createClient({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
});

// Per-user rate limit: 100 requests per 15 minutes
export const userLimiter = rateLimit({
  store: new RedisStore({
    client: redisClient,
    prefix: 'rate-limit:user:',
  }),
  keyGenerator: (req: Request) => {
    // Use user ID if authenticated, otherwise use IP
    return req.headers['x-user-id'] || req.ip;
  },
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests from this account, please try again after 15 minutes',
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
});

// Global rate limit: 10,000 requests per minute
export const globalLimiter = rateLimit({
  store: new RedisStore({
    client: redisClient,
    prefix: 'rate-limit:global:',
  }),
  windowMs: 60 * 1000, // 1 minute
  max: 10000,
  message: 'Server is receiving too many requests, please try again later',
  skip: (req: Request) => {
    // Skip rate limiting for health checks
    return req.path === '/health';
  },
});

// Usage in Express:
app.use(globalLimiter); // Apply global limit to all routes
app.use('/api/v1', userLimiter); // Apply per-user limit to API routes
```

**Install dependencies:**
```bash
npm install express-rate-limit rate-limit-redis redis
npm install -D @types/express-rate-limit
```

---

## 6. REQUEST VALIDATION

### Input Validation Middleware

```typescript
// src/server/middleware/validation.ts
import { body, query, validationResult } from 'express-validator';

export const validatePaginationQuery = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

export const validateCreateAPI = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('API name is required')
    .isLength({ min: 3, max: 255 })
    .withMessage('API name must be between 3 and 255 characters'),
  body('baseUrl')
    .isURL()
    .withMessage('Invalid URL format'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must not exceed 1000 characters'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  }
];

// Usage:
router.post('/apis', validateCreateAPI, (req: Request, res: Response) => {
  // Handle request...
});
```

**Install dependencies:**
```bash
npm install express-validator
```

---

## 7. LOGGING & MONITORING

### Structured Logging

```typescript
// src/server/logger.ts
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  transports: [
    // Console output
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    // File output
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

export default logger;

// Usage:
logger.info('API request', {
  method: req.method,
  path: req.path,
  userId: req.headers['x-user-id'],
  responseTime: `${Date.now() - startTime}ms`,
});
```

**Install dependencies:**
```bash
npm install winston
```

---

## Implementation Checklist

- [ ] Create MongoDB indexes for all models
- [ ] Implement pagination for all list endpoints
- [ ] Add gzip compression middleware
- [ ] Set up rate limiting with Redis
- [ ] Add input validation middleware
- [ ] Implement structured logging
- [ ] Add HTTP caching headers
- [ ] Test performance improvements
- [ ] Document API changes
- [ ] Update API documentation

---

## Performance Benchmarks

### Before Optimization:
- API response time: 500-1000ms
- Database query time: 100-300ms
- Concurrent users: 100
- RPS capacity: 50

### After Optimization (Expected):
- API response time: 50-100ms (10x improvement)
- Database query time: 10-30ms (10x improvement)
- Concurrent users: 10,000 (100x improvement)
- RPS capacity: 1,000 (20x improvement)

---

**Next Steps:**
1. Review with database team
2. Create MongoDB indexes
3. Implement pagination
4. Add rate limiting
5. Run load tests
6. Monitor performance improvements
