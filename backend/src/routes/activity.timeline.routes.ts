// ============================================================
// ACTIVITY TIMELINE ROUTES
// API endpoints for activity timeline
// ============================================================

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { ActivityTimelineService } from '../services/activity.timeline.service';

// GET /activity/timeline
export async function getUserTimeline(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req as any).user.id;
    const limit = parseInt((req.query as any).limit || '100');
    const timeline = await ActivityTimelineService.getUserTimeline(userId, limit);
    return reply.send(timeline);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch activity timeline' });
  }
}

// GET /activity/timeline/:resource/:resourceId
export async function getResourceTimeline(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { resource, resourceId } = req.params as any;
    const limit = parseInt((req.query as any).limit || '100');
    const timeline = await ActivityTimelineService.getResourceTimeline(resource, resourceId, limit);
    return reply.send(timeline);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch resource timeline' });
  }
}

// GET /activity/timeline/global
export async function getGlobalTimeline(req: FastifyRequest, reply: FastifyReply) {
  try {
    const limit = parseInt((req.query as any).limit || '100');
    const resourceFilter = (req.query as any).resource;
    const timeline = await ActivityTimelineService.getGlobalTimeline(limit, resourceFilter);
    return reply.send(timeline);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch global timeline' });
  }
}

// GET /activity/stats
export async function getActivityStats(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req as any).user.id;
    const stats = await ActivityTimelineService.getActivityStats(userId);
    return reply.send(stats);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch activity stats' });
  }
}

// GET /activity/stats/global
export async function getGlobalActivityStats(req: FastifyRequest, reply: FastifyReply) {
  try {
    const stats = await ActivityTimelineService.getActivityStats();
    return reply.send(stats);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch global activity stats' });
  }
}

// POST /activity/log
export async function logActivity(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req as any).user.id;
    const { action, resource, resourceId, metadata, ipAddress, userAgent } = req.body as any;
    
    if (!action || !resource) {
      return reply.status(400).send({ error: 'action and resource are required' });
    }

    await ActivityTimelineService.logActivity(
      userId,
      action,
      resource,
      resourceId,
      metadata,
      ipAddress,
      userAgent
    );
    
    return reply.send({ success: true });
  } catch (error) {
    reply.status(500).send({ error: 'Failed to log activity' });
  }
}

// GET /activity/search
export async function searchActivities(req: FastifyRequest, reply: FastifyReply) {
  try {
    const query = (req.query as any).q;
    const limit = parseInt((req.query as any).limit || '50');
    
    if (!query) {
      return reply.status(400).send({ error: 'Search query is required' });
    }

    const results = await ActivityTimelineService.searchActivities(query, limit);
    return reply.send(results);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to search activities' });
  }
}

// GET /activity/date-range
export async function getActivitiesByDateRange(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req as any).user.id;
    const { startDate, endDate } = req.query as any;
    const limit = parseInt((req.query as any).limit || '100');
    
    if (!startDate || !endDate) {
      return reply.status(400).send({ error: 'startDate and endDate are required' });
    }

    const activities = await ActivityTimelineService.getActivitiesByDateRange(
      new Date(startDate),
      new Date(endDate),
      userId,
      limit
    );
    
    return reply.send(activities);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch activities by date range' });
  }
}

export function activityTimelineRoutes(fastify: FastifyInstance) {
  fastify.get('/activity/timeline', { preHandler: [fastify.authenticate] }, getUserTimeline);
  fastify.get('/activity/timeline/:resource/:resourceId', { preHandler: [fastify.authenticate] }, getResourceTimeline);
  fastify.get('/activity/timeline/global', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, getGlobalTimeline);
  
  fastify.get('/activity/stats', { preHandler: [fastify.authenticate] }, getActivityStats);
  fastify.get('/activity/stats/global', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, getGlobalActivityStats);
  
  fastify.post('/activity/log', { preHandler: [fastify.authenticate] }, logActivity);
  
  fastify.get('/activity/search', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, searchActivities);
  fastify.get('/activity/date-range', { preHandler: [fastify.authenticate] }, getActivitiesByDateRange);
}
