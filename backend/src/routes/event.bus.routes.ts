// ============================================================
// EVENT BUS ROUTES
// API endpoints for event management
// ============================================================

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { EventBusService } from '../services/event.bus.service';

// POST /events/publish
export async function publishEvent(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { eventType, aggregateId, aggregateType, data, metadata } = req.body as any;
    
    if (!eventType || !aggregateId || !aggregateType || !data) {
      return reply.status(400).send({ error: 'eventType, aggregateId, aggregateType, and data are required' });
    }

    const event = await EventBusService.publishEvent(eventType, aggregateId, aggregateType, data, metadata);
    return reply.send(event);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to publish event' });
  }
}

// GET /events
export async function getEvents(req: FastifyRequest, reply: FastifyReply) {
  try {
    const eventType = (req.query as any).eventType;
    const aggregateId = (req.query as any).aggregateId;
    const aggregateType = (req.query as any).aggregateType;
    const limit = parseInt((req.query as any).limit || '50');
    
    const events = await EventBusService.getEvents({ eventType, aggregateId, aggregateType, limit });
    return reply.send(events);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch events' });
  }
}

// POST /events/subscribe
export async function subscribeToEvent(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { eventType, webhookUrl, secret, metadata } = req.body as any;
    
    if (!eventType || !webhookUrl) {
      return reply.status(400).send({ error: 'eventType and webhookUrl are required' });
    }

    const subscription = await EventBusService.subscribeToEvent(eventType, webhookUrl, secret, metadata);
    return reply.send(subscription);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to subscribe to event' });
  }
}

// DELETE /events/subscriptions/:subscriptionId
export async function unsubscribeFromEvent(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { subscriptionId } = req.params as any;
    const subscription = await EventBusService.unsubscribeFromEvent(subscriptionId);
    return reply.send(subscription);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to unsubscribe from event' });
  }
}

// GET /events/subscriptions
export async function getAllSubscriptions(req: FastifyRequest, reply: FastifyReply) {
  try {
    const subscriptions = await EventBusService.getAllSubscriptions();
    return reply.send(subscriptions);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch subscriptions' });
  }
}

// GET /events/subscriptions/:eventType
export async function getSubscriptionsByEventType(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { eventType } = req.params as any;
    const subscriptions = await EventBusService.getSubscriptionsByEventType(eventType);
    return reply.send(subscriptions);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to fetch subscriptions' });
  }
}

// POST /events/subscriptions/:subscriptionId/enable
export async function enableSubscription(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { subscriptionId } = req.params as any;
    const subscription = await EventBusService.enableSubscription(subscriptionId);
    return reply.send(subscription);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to enable subscription' });
  }
}

// POST /events/subscriptions/:subscriptionId/disable
export async function disableSubscription(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { subscriptionId } = req.params as any;
    const subscription = await EventBusService.disableSubscription(subscriptionId);
    return reply.send(subscription);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to disable subscription' });
  }
}

// GET /events/logs
export async function getEventLogs(req: FastifyRequest, reply: FastifyReply) {
  try {
    const eventId = (req.query as any).eventId;
    const subscriptionId = (req.query as any).subscriptionId;
    const eventType = (req.query as any).eventType;
    const status = (req.query as any).status;
    const limit = parseInt((req.query as any).limit || '50');
    
    const logs = await EventBusService.getEventLogs({ eventId, subscriptionId, eventType, status, limit });
    return reply.send(logs);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch event logs' });
  }
}

// POST /events/process-pending
export async function processPendingEventLogs(req: FastifyRequest, reply: FastifyReply) {
  try {
    const result = await EventBusService.processPendingEventLogs();
    return reply.send(result);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to process pending event logs' });
  }
}

// POST /events/retry-failed
export async function retryFailedLogs(req: FastifyRequest, reply: FastifyReply) {
  try {
    const limit = parseInt((req.body as any).limit || '50');
    const result = await EventBusService.retryFailedLogs(limit);
    return reply.send(result);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to retry failed logs' });
  }
}

// GET /events/statistics
export async function getEventStatistics(req: FastifyRequest, reply: FastifyReply) {
  try {
    const stats = await EventBusService.getEventStatistics();
    return reply.send(stats);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch event statistics' });
  }
}

// POST /events/cleanup
export async function cleanupOldEvents(req: FastifyRequest, reply: FastifyReply) {
  try {
    const daysToKeep = parseInt((req.body as any).daysToKeep || '30');
    const result = await EventBusService.cleanupOldEvents(daysToKeep);
    return reply.send(result);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to cleanup old events' });
  }
}

// POST /events/logs/cleanup
export async function cleanupOldEventLogs(req: FastifyRequest, reply: FastifyReply) {
  try {
    const daysToKeep = parseInt((req.body as any).daysToKeep || '30');
    const result = await EventBusService.cleanupOldEventLogs(daysToKeep);
    return reply.send(result);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to cleanup old event logs' });
  }
}

export function eventBusRoutes(fastify: FastifyInstance) {
  fastify.post('/events/publish', { preHandler: [fastify.authenticate] }, publishEvent);
  fastify.get('/events', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, getEvents);
  
  fastify.post('/events/subscribe', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, subscribeToEvent);
  fastify.delete('/events/subscriptions/:subscriptionId', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, unsubscribeFromEvent);
  fastify.get('/events/subscriptions', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, getAllSubscriptions);
  fastify.get('/events/subscriptions/:eventType', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, getSubscriptionsByEventType);
  fastify.post('/events/subscriptions/:subscriptionId/enable', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, enableSubscription);
  fastify.post('/events/subscriptions/:subscriptionId/disable', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, disableSubscription);
  
  fastify.get('/events/logs', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, getEventLogs);
  fastify.post('/events/process-pending', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, processPendingEventLogs);
  fastify.post('/events/retry-failed', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, retryFailedLogs);
  
  fastify.get('/events/statistics', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, getEventStatistics);
  fastify.post('/events/cleanup', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, cleanupOldEvents);
  fastify.post('/events/logs/cleanup', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, cleanupOldEventLogs);
}
