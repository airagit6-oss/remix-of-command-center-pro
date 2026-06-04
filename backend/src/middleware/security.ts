import { FastifyInstance } from 'fastify';
import helmet from '@fastify/helmet';
import fastifyCors from '@fastify/cors';
import { logger } from '../utils/logger';

/**
 * PRODUCTION SECURITY HEADERS
 * Protects against common web vulnerabilities
 */

export const setupSecurityHeaders = async (fastify: FastifyInstance) => {
  // Helmet: Security headers
  await fastify.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'"],
      },
    },
    hsts: {
      maxAge: 31536000, // 1 year
      includeSubDomains: true,
      preload: true,
    },
    frameguard: { action: 'deny' },
    hidePoweredBy: true,
    noSniff: true,
    xssFilter: true,
  });

  // CORS: Allow only trusted origins
  await fastify.register(fastifyCors, {
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 86400, // 24 hours
  });
};

/**
 * Request logging for security audit
 */
export const setupAuditLogging = (fastify: FastifyInstance) => {
  fastify.addHook('onRequest', async (request, reply) => {
    // Don't log health checks
    if (request.url === '/health') return;

    logger.info({
      type: 'request',
      method: request.method,
      path: request.url,
      ip: request.ip,
      userId: request.user?.id,
      timestamp: new Date().toISOString(),
    });
  });

  fastify.addHook('onResponse', async (request, reply) => {
    if (request.url === '/health') return;

    // Log errors and sensitive operations
    if (reply.statusCode >= 400 || request.method !== 'GET') {
      logger.info({
        type: 'response',
        method: request.method,
        path: request.url,
        statusCode: reply.statusCode,
        userId: request.user?.id,
        timestamp: new Date().toISOString(),
      });
    }
  });
};

/**
 * Prevent common attacks
 */
export const preventCommonAttacks = (fastify: FastifyInstance) => {
  // Prevent parameter pollution
  fastify.addHook('preHandler', async (request, reply) => {
    // Check for suspicious query patterns
    const queryKeys = Object.keys(request.query);
    if (queryKeys.length > 50) {
      logger.warn({
        type: 'suspicious_request',
        reason: 'too_many_query_params',
        userId: request.user?.id,
      });
      throw new Error('Too many query parameters');
    }

    // Validate URL length
    if (request.url.length > 2048) {
      logger.warn({
        type: 'suspicious_request',
        reason: 'url_too_long',
        userId: request.user?.id,
      });
      throw new Error('URL too long');
    }
  });
};

/**
 * Timeout protection
 */
export const setupTimeouts = (fastify: FastifyInstance) => {
  fastify.addHook('onRequest', async (request, reply) => {
    // Set timeout for each request (30 seconds)
    const timeout = setTimeout(() => {
      if (!reply.sent) {
        reply.code(408).send({ error: 'Request timeout' });
      }
    }, 30000);

    reply.on('finish', () => clearTimeout(timeout));
    reply.on('error', () => clearTimeout(timeout));
  });
};
