/**
 * ============================================================================
 * API KEY AUTHENTICATION MIDDLEWARE
 * ============================================================================
 * Provides API key validation for third-party integrations and service-to-service
 * communication. Works alongside JWT for user authentication.
 * ============================================================================
 */

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

interface ApiKeyConfig {
  headerName: string;
  validKeys: string[];
  keyPrefix: string;
}

const DEFAULT_CONFIG: ApiKeyConfig = {
  headerName: process.env.API_KEY_HEADER || 'X-API-Key',
  validKeys: (process.env.VALID_API_KEYS || '').split(',').filter(Boolean),
  keyPrefix: 'key_',
};

/**
 * Validate API key format
 */
function isValidKeyFormat(key: string): boolean {
  // API keys should start with key_ prefix
  if (!key.startsWith(DEFAULT_CONFIG.keyPrefix)) {
    return false;
  }
  // Minimum length: key_ (4) + 16 chars = 20 total
  return key.length >= 20;
}

/**
 * API Key validation middleware
 */
export async function validateApiKey(request: FastifyRequest, reply: FastifyReply) {
  // Skip health checks and public endpoints
  const publicPaths = ['/health', '/ready', '/public'];
  if (publicPaths.some(path => request.url.startsWith(path))) {
    return;
  }

  // Extract API key from header
  const apiKey = request.headers[DEFAULT_CONFIG.headerName.toLowerCase()] as string;

  // For endpoints that require API key
  const apiKeyRequiredPaths = ['/api/v1', '/integrations'];
  const requiresApiKey = apiKeyRequiredPaths.some(path => request.url.startsWith(path));

  if (requiresApiKey) {
    if (!apiKey) {
      console.warn(`[SECURITY] Missing API key for: ${request.method} ${request.url}`);
      return reply.code(401).send({
        code: 'MISSING_API_KEY',
        message: `${DEFAULT_CONFIG.headerName} header is required`,
      });
    }

    // Validate API key format
    if (!isValidKeyFormat(apiKey)) {
      console.warn(`[SECURITY] Invalid API key format from: ${request.ip}`);
      return reply.code(401).send({
        code: 'INVALID_API_KEY_FORMAT',
        message: 'API key format is invalid',
      });
    }

    // Check if key is in valid keys list
    if (!DEFAULT_CONFIG.validKeys.includes(apiKey)) {
      console.warn(`[SECURITY] Unauthorized API key attempt from: ${request.ip}`);
      return reply.code(403).send({
        code: 'INVALID_API_KEY',
        message: 'API key is not authorized',
      });
    }

    // Attach API key info to request
    (request as any).apiKey = {
      key: apiKey,
      validated: true,
      timestamp: new Date(),
    };
  }
}

/**
 * Generate a new API key (for admin use)
 */
export function generateApiKey(prefix = 'key_prod_'): string {
  const randomPart = Math.random().toString(36).substring(2, 15) + 
                     Math.random().toString(36).substring(2, 15) +
                     Math.random().toString(36).substring(2, 15);
  return `${prefix}${randomPart}`.substring(0, 50);
}

/**
 * Validate API key against list
 */
export function isValidApiKey(key: string): boolean {
  return isValidKeyFormat(key) && DEFAULT_CONFIG.validKeys.includes(key);
}

/**
 * Get API keys from environment (returns masked version)
 */
export function getConfiguredApiKeys(): { count: number; preview: string[] } {
  const keys = DEFAULT_CONFIG.validKeys || [];
  const preview = keys.map(k => `${k.substring(0, 8)}...${k.substring(k.length - 4)}`);
  return { count: keys.length, preview };
}

/**
 * Rate limit specific to API key usage
 */
export async function checkApiKeyRateLimit(
  request: FastifyRequest,
  reply: FastifyReply,
  redis: any
) {
  const apiKey = (request as any).apiKey?.key;
  if (!apiKey) return;

  const rateLimitKey = `api_key:${apiKey}:${Math.floor(Date.now() / 60000)}`;
  const currentCount = await redis.incr(rateLimitKey);
  
  // Set expiry on first request
  if (currentCount === 1) {
    await redis.expire(rateLimitKey, 60);
  }

  const maxRequests = parseInt(process.env.RATE_LIMIT_API_KEY_MAX || '1000', 10);
  
  if (currentCount > maxRequests) {
    console.warn(`[SECURITY] API key rate limit exceeded: ${apiKey}`);
    return reply.code(429).send({
      code: 'RATE_LIMIT_EXCEEDED',
      message: `API key has exceeded ${maxRequests} requests per minute`,
      retryAfter: 60,
    });
  }

  // Add rate limit info to response headers
  reply.header('X-RateLimit-Limit', maxRequests);
  reply.header('X-RateLimit-Remaining', maxRequests - currentCount);
  reply.header('X-RateLimit-Reset', Math.floor(Date.now() / 1000) + 60);
}

/**
 * Register API key middleware with Fastify
 */
export async function registerApiKeyMiddleware(fastify: FastifyInstance) {
  // Validate API keys
  fastify.addHook('preHandler', validateApiKey);

  // Health endpoint for API key validation
  fastify.get('/api/keys/health', async (request, reply) => {
    if (!(request as any).apiKey) {
      return reply.code(401).send({ error: 'API key required' });
    }
    
    return reply.send({
      status: 'valid',
      keyPrefix: (request as any).apiKey.key.substring(0, 8),
      timestamp: new Date(),
    });
  });

  console.log('[SECURITY] API key middleware registered');
  console.log('[SECURITY] Configured API keys:', getConfiguredApiKeys());
}

export default {
  validateApiKey,
  generateApiKey,
  isValidApiKey,
  getConfiguredApiKeys,
  checkApiKeyRateLimit,
  registerApiKeyMiddleware,
};
