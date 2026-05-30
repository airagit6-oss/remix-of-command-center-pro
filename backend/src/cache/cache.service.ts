// ============================================================
// CACHE SERVICE
// Enterprise-grade caching service with TTL and invalidation
// ============================================================

import { getRedisClient } from './redis.client';

export interface CacheOptions {
  ttl?: number; // Time to live in seconds
  prefix?: string; // Key prefix for namespacing
}

export class CacheService {
  private readonly defaultTTL: number = 3600; // 1 hour default
  private readonly prefix: string = 'sv:';

  constructor(options?: CacheOptions) {
    if (options?.ttl) {
      this.defaultTTL = options.ttl;
    }
    if (options?.prefix) {
      this.prefix = options.prefix;
    }
  }

  private getKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const redis = getRedisClient();
      const data = await redis.get(this.getKey(key));
      if (!data) return null;
      return JSON.parse(data) as T;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<boolean> {
    try {
      const redis = getRedisClient();
      const serialized = JSON.stringify(value);
      const expiry = ttl ?? this.defaultTTL;
      
      if (expiry > 0) {
        await redis.setex(this.getKey(key), expiry, serialized);
      } else {
        await redis.set(this.getKey(key), serialized);
      }
      
      return true;
    } catch (error) {
      console.error('Cache set error:', error);
      return false;
    }
  }

  async delete(key: string): Promise<boolean> {
    try {
      const redis = getRedisClient();
      await redis.del(this.getKey(key));
      return true;
    } catch (error) {
      console.error('Cache delete error:', error);
      return false;
    }
  }

  async deletePattern(pattern: string): Promise<number> {
    try {
      const redis = getRedisClient();
      const keys = await redis.keys(`${this.prefix}${pattern}`);
      if (keys.length === 0) return 0;
      await redis.del(...keys);
      return keys.length;
    } catch (error) {
      console.error('Cache delete pattern error:', error);
      return 0;
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      const redis = getRedisClient();
      const result = await redis.exists(this.getKey(key));
      return result === 1;
    } catch (error) {
      console.error('Cache exists error:', error);
      return false;
    }
  }

  async expire(key: string, ttl: number): Promise<boolean> {
    try {
      const redis = getRedisClient();
      await redis.expire(this.getKey(key), ttl);
      return true;
    } catch (error) {
      console.error('Cache expire error:', error);
      return false;
    }
  }

  async getTTL(key: string): Promise<number> {
    try {
      const redis = getRedisClient();
      return await redis.ttl(this.getKey(key));
    } catch (error) {
      console.error('Cache getTTL error:', error);
      return -1;
    }
  }

  async increment(key: string, amount: number = 1): Promise<number> {
    try {
      const redis = getRedisClient();
      return await redis.incrby(this.getKey(key), amount);
    } catch (error) {
      console.error('Cache increment error:', error);
      return 0;
    }
  }

  async decrement(key: string, amount: number = 1): Promise<number> {
    try {
      const redis = getRedisClient();
      return await redis.decrby(this.getKey(key), amount);
    } catch (error) {
      console.error('Cache decrement error:', error);
      return 0;
    }
  }

  async getMultiple<T>(keys: string[]): Promise<Map<string, T>> {
    try {
      const redis = getRedisClient();
      const prefixedKeys = keys.map(k => this.getKey(k));
      const values = await redis.mget(...prefixedKeys);
      
      const result = new Map<string, T>();
      keys.forEach((key, index) => {
        const value = values[index];
        if (value) {
          result.set(key, JSON.parse(value) as T);
        }
      });
      
      return result;
    } catch (error) {
      console.error('Cache getMultiple error:', error);
      return new Map();
    }
  }

  async setMultiple<T>(entries: Map<string, T>, ttl?: number): Promise<boolean> {
    try {
      const redis = getRedisClient();
      const pipeline = redis.pipeline();
      
      entries.forEach((value, key) => {
        const serialized = JSON.stringify(value);
        const expiry = ttl ?? this.defaultTTL;
        
        if (expiry > 0) {
          pipeline.setex(this.getKey(key), expiry, serialized);
        } else {
          pipeline.set(this.getKey(key), serialized);
        }
      });
      
      await pipeline.exec();
      return true;
    } catch (error) {
      console.error('Cache setMultiple error:', error);
      return false;
    }
  }

  async flush(): Promise<boolean> {
    try {
      const redis = getRedisClient();
      const keys = await redis.keys(`${this.prefix}*`);
      if (keys.length === 0) return true;
      await redis.del(...keys);
      return true;
    } catch (error) {
      console.error('Cache flush error:', error);
      return false;
    }
  }
}

// Pre-configured cache instances for different use cases
export const sessionCache = new CacheService({ prefix: 'session:', ttl: 86400 }); // 24 hours
export const productCache = new CacheService({ prefix: 'product:', ttl: 3600 }); // 1 hour
export const userCache = new CacheService({ prefix: 'user:', ttl: 1800 }); // 30 minutes
export const queryCache = new CacheService({ prefix: 'query:', ttl: 300 }); // 5 minutes
export const rateLimitCache = new CacheService({ prefix: 'ratelimit:', ttl: 60 }); // 1 minute
