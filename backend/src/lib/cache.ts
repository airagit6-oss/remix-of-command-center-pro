import Redis from 'ioredis';

// ============================================================
// REDIS CACHING LAYER - Performance Multiplier
// ============================================================

const redisConfig = process.env.REDIS_URL ? process.env.REDIS_URL : {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  enableOfflineQueue: true
};

const redis = new Redis(redisConfig as any);

redis.on('error', (err) => console.error('❌ Redis Error:', err));
redis.on('connect', () => console.log('✅ Redis Connected'));

/**
 * Cache decorator for expensive operations
 * TTL in seconds
 */
export async function cache<T>(
  key: string,
  fn: () => Promise<T>,
  ttl: number = 3600
): Promise<T> {
  try {
    // Try to get from cache
    const cached = await redis.get(key);
    if (cached) {
      console.log(`✅ Cache HIT: ${key}`);
      return JSON.parse(cached);
    }

    // Cache miss - execute function
    const result = await fn();
    
    // Store in cache
    await redis.setex(key, ttl, JSON.stringify(result));
    console.log(`📝 Cache SET: ${key} (TTL: ${ttl}s)`);
    
    return result;
  } catch (error) {
    console.error(`⚠️  Cache error for ${key}:`, error);
    // On cache error, still return fresh data
    return fn();
  }
}

/**
 * Invalidate cache
 */
export async function invalidateCache(pattern: string) {
  try {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
      console.log(`🗑️  Invalidated ${keys.length} cache keys`);
    }
  } catch (error) {
    console.error('Error invalidating cache:', error);
  }
}

/**
 * Get all keys matching pattern
 */
export async function getCacheKeys(pattern: string) {
  return redis.keys(pattern);
}

/**
 * Clear all cache
 */
export async function clearAllCache() {
  await redis.flushall();
  console.log('🗑️  All cache cleared');
}

export { redis };
