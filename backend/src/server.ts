import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import { PrismaClient } from '@prisma/client';
import { authorRoutes } from './routes/author.routes';
import { resellerRoutes } from './routes/reseller.routes';
import { authRoutes } from './routes/auth.routes';
import { orderRoutes } from './routes/order.routes';
import { authenticate, requireRole } from './middleware/auth.middleware';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import { rateLimitOptions, strictRateLimitOptions } from './middleware/rate-limit.middleware';

const prisma = new PrismaClient();
const fastify = Fastify({ logger: true });

// Register plugins
fastify.register(cors, {
  origin: process.env.CORS_ORIGIN || '*'
});

fastify.register(jwt, {
  secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production'
});

// Register rate limiting
fastify.register(import('@fastify/rate-limit'), rateLimitOptions);

// Set error handlers
fastify.setErrorHandler(errorHandler);
fastify.setNotFoundHandler(notFoundHandler);

// Decorate request with authenticate and requireRole
fastify.decorate('authenticate', authenticate);
fastify.decorate('requireRole', requireRole);

// Health check
fastify.get('/health', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

// Register routes
fastify.register(authRoutes, { prefix: '/api/v1' });
fastify.register(authorRoutes, { prefix: '/api/v1' });
fastify.register(resellerRoutes, { prefix: '/api/v1' });
fastify.register(orderRoutes, { prefix: '/api/v1' });

// Start server
const start = async () => {
  try {
    const port = parseInt(process.env.PORT || '3001');
    await fastify.listen({ port, host: '0.0.0.0' });
    console.log(`Server running on http://localhost:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

// Graceful shutdown
const gracefulShutdown = async () => {
  await fastify.close();
  await prisma.$disconnect();
  process.exit(0);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

start();
