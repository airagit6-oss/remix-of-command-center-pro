// ============================================================
// FEATURE FLAG ROUTES
// API endpoints for feature flag management
// ============================================================

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { FeatureFlagService } from '../services/feature.flag.service';

// GET /feature-flags
export async function getAllFeatureFlags(req: FastifyRequest, reply: FastifyReply) {
  try {
    const flags = await FeatureFlagService.getAllFeatureFlags();
    return reply.send(flags);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch feature flags' });
  }
}

// GET /feature-flags/:key
export async function getFeatureFlag(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { key } = req.params as any;
    const flag = await FeatureFlagService.getFeatureFlagByKey(key);
    return reply.send(flag);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to fetch feature flag' });
  }
}

// GET /feature-flags/check/:key
export async function checkFeatureFlag(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { key } = req.params as any;
    const userId = (req as any).user?.id;
    const userRole = (req as any).user?.role;
    const countryCode = req.headers['x-country-code'] as string;
    const userSegment = req.headers['x-user-segment'] as string;
    
    const isEnabled = await FeatureFlagService.isFeatureEnabled(key, userId, userRole, countryCode, userSegment);
    return reply.send({ key, enabled: isEnabled });
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to check feature flag' });
  }
}

// GET /feature-flags/value/:key
export async function getFeatureFlagValue(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { key } = req.params as any;
    const userId = (req as any).user?.id;
    
    const value = await FeatureFlagService.getFeatureFlag(key, userId);
    return reply.send({ key, value });
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to get feature flag value' });
  }
}

// GET /feature-flags/user
export async function getUserFeatureFlags(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req as any).user.id;
    const userRole = (req as any).user.role;
    const countryCode = req.headers['x-country-code'] as string;
    const userSegment = req.headers['x-user-segment'] as string;
    
    const flags = await FeatureFlagService.getFeatureFlagsForUser(userId, userRole, countryCode, userSegment);
    return reply.send(flags);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch user feature flags' });
  }
}

// POST /feature-flags
export async function createFeatureFlag(req: FastifyRequest, reply: FastifyReply) {
  try {
    const data = req.body as any;
    const flag = await FeatureFlagService.createFeatureFlag(data);
    return reply.send(flag);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to create feature flag' });
  }
}

// PATCH /feature-flags/:key
export async function updateFeatureFlag(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { key } = req.params as any;
    const data = req.body as any;
    const flag = await FeatureFlagService.updateFeatureFlag(key, data);
    return reply.send(flag);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to update feature flag' });
  }
}

// DELETE /feature-flags/:key
export async function deleteFeatureFlag(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { key } = req.params as any;
    const flag = await FeatureFlagService.deleteFeatureFlag(key);
    return reply.send(flag);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to delete feature flag' });
  }
}

// POST /feature-flags/:key/enable
export async function enableFeatureFlag(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { key } = req.params as any;
    const flag = await FeatureFlagService.enableFeatureFlag(key);
    return reply.send(flag);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to enable feature flag' });
  }
}

// POST /feature-flags/:key/disable
export async function disableFeatureFlag(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { key } = req.params as any;
    const flag = await FeatureFlagService.disableFeatureFlag(key);
    return reply.send(flag);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to disable feature flag' });
  }
}

// POST /feature-flags/user-segment
export async function setUserSegment(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req as any).user.id;
    const { segment } = req.body as any;
    
    if (!segment) {
      return reply.status(400).send({ error: 'segment is required' });
    }

    const result = await FeatureFlagService.setUserSegment(userId, segment);
    return reply.send(result);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to set user segment' });
  }
}

// GET /feature-flags/user-segment
export async function getUserSegment(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req as any).user.id;
    const segment = await FeatureFlagService.getUserSegment(userId);
    return reply.send({ userId, segment });
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to get user segment' });
  }
}

export function featureFlagRoutes(fastify: FastifyInstance) {
  fastify.get('/feature-flags', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, getAllFeatureFlags);
  fastify.get('/feature-flags/:key', { preHandler: [fastify.authenticate] }, getFeatureFlag);
  fastify.get('/feature-flags/check/:key', { preHandler: [fastify.authenticate] }, checkFeatureFlag);
  fastify.get('/feature-flags/value/:key', { preHandler: [fastify.authenticate] }, getFeatureFlagValue);
  fastify.get('/feature-flags/user', { preHandler: [fastify.authenticate] }, getUserFeatureFlags);
  
  fastify.post('/feature-flags', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, createFeatureFlag);
  fastify.patch('/feature-flags/:key', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, updateFeatureFlag);
  fastify.delete('/feature-flags/:key', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, deleteFeatureFlag);
  
  fastify.post('/feature-flags/:key/enable', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, enableFeatureFlag);
  fastify.post('/feature-flags/:key/disable', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, disableFeatureFlag);
  
  fastify.post('/feature-flags/user-segment', { preHandler: [fastify.authenticate] }, setUserSegment);
  fastify.get('/feature-flags/user-segment', { preHandler: [fastify.authenticate] }, getUserSegment);
}
