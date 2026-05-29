import rateLimit from '@fastify/rate-limit';

export const rateLimitOptions = {
  max: 100, // Maximum requests per window
  timeWindow: '1 minute', // Time window
  skipOnError: false,
  addHeaders: {
    'x-ratelimit-limit': true,
    'x-ratelimit-remaining': true,
    'x-ratelimit-reset': true
  }
};

export const strictRateLimitOptions = {
  max: 10,
  timeWindow: '1 minute',
  skipOnError: false,
  addHeaders: {
    'x-ratelimit-limit': true,
    'x-ratelimit-remaining': true,
    'x-ratelimit-reset': true
  }
};
