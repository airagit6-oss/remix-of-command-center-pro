// ============================================================
// SYSTEM HEALTH ROUTES
// API endpoints for system health monitoring
// ============================================================

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { SystemHealthService } from '../services/system.health.service';

// GET /health
export async function getOverallHealth(req: FastifyRequest, reply: FastifyReply) {
  try {
    const health = await SystemHealthService.getOverallHealth();
    return reply.send(health);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch system health' });
  }
}

// GET /health/api
export async function getAPIHealth(req: FastifyRequest, reply: FastifyReply) {
  try {
    const health = await SystemHealthService.checkAPIHealth();
    return reply.send(health);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to check API health' });
  }
}

// GET /health/database
export async function getDatabaseHealth(req: FastifyRequest, reply: FastifyReply) {
  try {
    const health = await SystemHealthService.checkDatabaseHealth();
    return reply.send(health);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to check database health' });
  }
}

// GET /health/queue
export async function getQueueHealth(req: FastifyRequest, reply: FastifyReply) {
  try {
    const health = await SystemHealthService.checkQueueHealth();
    return reply.send(health);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to check queue health' });
  }
}

// GET /health/webhook
export async function getWebhookHealth(req: FastifyRequest, reply: FastifyReply) {
  try {
    const health = await SystemHealthService.checkWebhookHealth();
    return reply.send(health);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to check webhook health' });
  }
}

// GET /health/cron
export async function getCronHealth(req: FastifyRequest, reply: FastifyReply) {
  try {
    const health = await SystemHealthService.checkCronHealth();
    return reply.send(health);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to check cron health' });
  }
}

// GET /health/storage
export async function getStorageHealth(req: FastifyRequest, reply: FastifyReply) {
  try {
    const health = await SystemHealthService.checkStorageHealth();
    return reply.send(health);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to check storage health' });
  }
}

// GET /health/redis
export async function getRedisHealth(req: FastifyRequest, reply: FastifyReply) {
  try {
    const health = await SystemHealthService.checkRedisHealth();
    return reply.send(health);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to check Redis health' });
  }
}

// GET /health/cdn
export async function getCDNHealth(req: FastifyRequest, reply: FastifyReply) {
  try {
    const health = await SystemHealthService.checkCDNHealth();
    return reply.send(health);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to check CDN health' });
  }
}

// GET /health/history
export async function getHealthHistory(req: FastifyRequest, reply: FastifyReply) {
  try {
    const component = (req.query as any).component;
    const hours = parseInt((req.query as any).hours || '24');
    
    const history = await SystemHealthService.getHealthHistory(component, hours);
    return reply.send(history);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch health history' });
  }
}

// POST /health/cleanup
export async function cleanupOldHealthChecks(req: FastifyRequest, reply: FastifyReply) {
  try {
    const daysToKeep = parseInt((req.body as any).daysToKeep || '7');
    const result = await SystemHealthService.cleanupOldHealthChecks(daysToKeep);
    return reply.send(result);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to cleanup old health checks' });
  }
}

export function systemHealthRoutes(fastify: FastifyInstance) {
  fastify.get('/health', getOverallHealth);
  fastify.get('/health/api', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, getAPIHealth);
  fastify.get('/health/database', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, getDatabaseHealth);
  fastify.get('/health/queue', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, getQueueHealth);
  fastify.get('/health/webhook', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, getWebhookHealth);
  fastify.get('/health/cron', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, getCronHealth);
  fastify.get('/health/storage', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, getStorageHealth);
  fastify.get('/health/redis', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, getRedisHealth);
  fastify.get('/health/cdn', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, getCDNHealth);
  
  fastify.get('/health/history', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, getHealthHistory);
  fastify.post('/health/cleanup', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, cleanupOldHealthChecks);
}
