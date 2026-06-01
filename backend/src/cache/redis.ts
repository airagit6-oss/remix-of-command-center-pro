import Redis from 'ioredis';
import { logger } from '../utils/logger';

/**
 * PRODUCTION REDIS CLIENT
 * Connection pooling and error handling
 */

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  db: parseInt(process.env.REDIS_DB || '0'),
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  maxRetriesPerRequest: 3,
});

redis.on('error', (error) => {
  logger.error({ type: 'redis_error', error: error.message });
});

redis.on('connect', () => {
  logger.info({ type: 'redis_connected' });
});

redis.on('disconnect', () => {
  logger.warn({ type: 'redis_disconnected' });
});

export { redis };
