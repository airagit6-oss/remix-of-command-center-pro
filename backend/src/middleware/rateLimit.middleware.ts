import { FastifyRequest, FastifyReply } from 'fastify';
import { redis } from '../lib/cache';

// ============================================================
// RATE LIMITING - PROTECT AGAINST ABUSE
// Token bucket algorithm with Redis
// ============================================================

const RATE_LIMITS = {
  // General API endpoints
  default: { requests: 100, window: 60 }, // 100 req/min
  
  // Auth endpoints (stricter)
  auth: { requests: 5, window: 60 }, // 5 attempts/min
  login: { requests: 5, window: 300 }, // 5 logins/5min
  
  // Public endpoints (loose)
  public: { requests: 1000, window: 60 }, // 1000 req/min
  
  // Admin endpoints (moderate)
  admin: { requests: 500, window: 60 }, // 500 req/min
};

/**
 * Rate limiter middleware
 */
export async function rateLimit(
  request: FastifyRequest,
  reply: FastifyReply,
  limitType: keyof typeof RATE_LIMITS = 'default'
) {
  try {
    const limit = RATE_LIMITS[limitType];
    const key = `ratelimit:${request.ip}:${request.url}`;
    
    const current = await redis.incr(key);
    
    if (current === 1) {
      await redis.expire(key, limit.window);
    }
    
    if (current > limit.requests) {
      return reply.status(429).send({
        error: 'Too many requests',
        retryAfter: limit.window,
      });
    }
    
    // Set headers
    reply.header('X-RateLimit-Limit', limit.requests);
    reply.header('X-RateLimit-Remaining', limit.requests - current);
    reply.header('X-RateLimit-Reset', Math.ceil(Date.now() / 1000) + limit.window);
  } catch (error) {
    // If Redis is down, allow request but log
    console.warn('Rate limiting error:', error);
  }
}

/**
 * Create rate limit hook for Fastify
 */
export function createRateLimitHook(limitType: keyof typeof RATE_LIMITS = 'default') {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    await rateLimit(request, reply, limitType);
  };
}

/**
 * Get rate limit status for IP
 */
export async function getRateLimitStatus(ip: string, url: string) {
  const key = `ratelimit:${ip}:${url}`;
  const current = await redis.get(key);
  const ttl = await redis.ttl(key);
  
  return {
    current: parseInt(current || '0'),
    ttl: ttl > 0 ? ttl : 0,
  };
}
