// ============================================================
// CACHE STRATEGY
// Enterprise caching strategies for different data patterns
// ============================================================

import { CacheService, productCache, userCache, sessionCache, queryCache } from './cache.service';

export enum CacheStrategy {
  CACHE_FIRST = 'cache_first',
  CACHE_THROUGH = 'cache_through',
  CACHE_ASIDE = 'cache_aside',
  WRITE_THROUGH = 'write_through',
  WRITE_BACK = 'write_back',
  NO_CACHE = 'no_cache',
}

export interface CacheConfig {
  strategy: CacheStrategy;
  ttl?: number;
  invalidateOn?: string[]; // Events that should invalidate this cache
}

export class CacheStrategyManager {
  private static strategies: Map<string, CacheConfig> = new Map();

  static register(key: string, config: CacheConfig): void {
    this.strategies.set(key, config);
  }

  static get(key: string): CacheConfig | undefined {
    return this.strategies.get(key);
  }

  static async getOrSet<T>(
    key: string,
    fetchFn: () => Promise<T>,
    config?: CacheConfig
  ): Promise<T> {
    const strategy = config?.strategy || CacheStrategy.CACHE_FIRST;
    const ttl = config?.ttl;

    switch (strategy) {
      case CacheStrategy.CACHE_FIRST:
        return this.cacheFirst(key, fetchFn, ttl);
      case CacheStrategy.CACHE_THROUGH:
        return this.cacheThrough(key, fetchFn, ttl);
      case CacheStrategy.CACHE_ASIDE:
        return this.cacheAside(key, fetchFn, ttl);
      case CacheStrategy.NO_CACHE:
        return fetchFn();
      default:
        return this.cacheFirst(key, fetchFn, ttl);
    }
  }

  private static async cacheFirst<T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttl?: number
  ): Promise<T> {
    const cached = await productCache.get<T>(key);
    if (cached !== null) {
      return cached;
    }
    const data = await fetchFn();
    await productCache.set(key, data, ttl);
    return data;
  }

  private static async cacheThrough<T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttl?: number
  ): Promise<T> {
    const data = await fetchFn();
    await productCache.set(key, data, ttl);
    return data;
  }

  private static async cacheAside<T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttl?: number
  ): Promise<T> {
    const cached = await productCache.get<T>(key);
    if (cached !== null) {
      return cached;
    }
    const data = await fetchFn();
    await productCache.set(key, data, ttl);
    return data;
  }

  static async invalidate(pattern: string): Promise<void> {
    await productCache.deletePattern(pattern);
    await userCache.deletePattern(pattern);
    await sessionCache.deletePattern(pattern);
    await queryCache.deletePattern(pattern);
  }

  static async invalidateByKey(key: string): Promise<void> {
    await productCache.delete(key);
    await userCache.delete(key);
    await sessionCache.delete(key);
    await queryCache.delete(key);
  }
}

// Pre-registered cache strategies
CacheStrategyManager.register('product:list', {
  strategy: CacheStrategy.CACHE_FIRST,
  ttl: 3600,
  invalidateOn: ['product:created', 'product:updated', 'product:deleted'],
});

CacheStrategyManager.register('product:detail', {
  strategy: CacheStrategy.CACHE_FIRST,
  ttl: 3600,
  invalidateOn: ['product:updated', 'product:deleted'],
});

CacheStrategyManager.register('user:profile', {
  strategy: CacheStrategy.CACHE_FIRST,
  ttl: 1800,
  invalidateOn: ['user:updated', 'user:deleted'],
});

CacheStrategyManager.register('user:session', {
  strategy: CacheStrategy.CACHE_THROUGH,
  ttl: 86400,
  invalidateOn: ['user:logout', 'user:deleted'],
});

CacheStrategyManager.register('query:search', {
  strategy: CacheStrategy.CACHE_FIRST,
  ttl: 300,
  invalidateOn: ['product:created', 'product:updated', 'product:deleted'],
});

CacheStrategyManager.register('analytics:daily', {
  strategy: CacheStrategy.CACHE_FIRST,
  ttl: 600,
  invalidateOn: ['order:created', 'order:updated'],
});

CacheStrategyManager.register('ratelimit:global', {
  strategy: CacheStrategy.CACHE_THROUGH,
  ttl: 60,
  invalidateOn: [],
});
