import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import { logsRoutes } from './routes/logs.routes';
import { alertsRoutes } from './routes/alerts.routes';
import { infrastructureRoutes } from './routes/infrastructure.routes';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import { rateLimitOptions } from './middleware/rate-limit.middleware';

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

// Health check
fastify.get('/health', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

// Register admin monitoring routes
fastify.register(logsRoutes, { prefix: '/api/v1' });
fastify.register(alertsRoutes, { prefix: '/api/v1' });
fastify.register(infrastructureRoutes, { prefix: '/api/v1' });

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

start();

// Graceful shutdown
const gracefulShutdown = async () => {
  await fastify.close();
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

export default fastify;
