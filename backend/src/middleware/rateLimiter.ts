import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { redis } from '../cache/redis';
import { AppError } from './errorHandler';

/**
 * PRODUCTION RATE LIMITING
 * Prevents abuse and DDoS attacks
 * Uses Redis for distributed rate limiting
 */

export interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Max requests per window
  keyPrefix?: string;
  message?: string;
}

const DEFAULT_CONFIG: RateLimitConfig = {
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 100,
  keyPrefix: 'rate-limit:',
};

/**
 * Create rate limiter middleware
 */
export const createRateLimiter = (config: Partial<RateLimitConfig> = {}) => {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  return async (request: FastifyRequest, reply: FastifyReply) => {
    // Get identifier (IP or user ID)
    const identifier = request.user?.id || request.ip;
    const key = `${finalConfig.keyPrefix}${identifier}`;
    const now = Date.now();

    try {
      // Get current count
      const count = await redis.incr(key);

      // Set expiry on first request
      if (count === 1) {
        await redis.expire(key, Math.ceil(finalConfig.windowMs / 1000));
      }

      // Check if exceeded
      if (count > finalConfig.maxRequests!) {
        const resetTime = now + finalConfig.windowMs!;
        throw new AppError(
          429,
          finalConfig.message || 'Too many requests. Please try again later.'
        );
      }

      // Add headers
      reply.header('X-RateLimit-Limit', finalConfig.maxRequests.toString());
      reply.header('X-RateLimit-Remaining', (finalConfig.maxRequests - count).toString());
      reply.header('X-RateLimit-Reset', Math.ceil(resetTime / 1000).toString());
    } catch (error) {
      // Fail open (allow request if Redis unavailable)
      if (error instanceof AppError && error.statusCode === 429) {
        throw error;
      }
      // Log Redis errors but don't block
      console.error('Rate limiter error:', error);
    }
  };
};

/**
 * Strict rate limiter for sensitive operations (auth, payments)
 */
export const strictRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5,
  keyPrefix: 'rate-limit:strict:',
});

/**
 * Standard rate limiter for most endpoints
 */
export const standardRateLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 100,
  keyPrefix: 'rate-limit:standard:',
});

/**
 * Relaxed rate limiter for read-only endpoints
 */
export const relaxedRateLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 500,
  keyPrefix: 'rate-limit:relaxed:',
});
