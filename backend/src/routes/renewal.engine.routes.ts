// ============================================================
// RENEWAL ENGINE ROUTES
// API endpoints for license/subscription renewal
// ============================================================

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { RenewalEngineService } from '../services/renewal.engine.service';

// POST /renewals/license/:licenseId
export async function renewLicense(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { licenseId } = req.params as any;
    const { paymentMethod, paymentId } = req.body as any;
    
    const result = await RenewalEngineService.renewLicense(licenseId, paymentMethod, paymentId);
    return reply.send(result);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to renew license' });
  }
}

// POST /renewals/subscription/:subscriptionId
export async function renewSubscription(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { subscriptionId } = req.params as any;
    const { paymentMethod, paymentId } = req.body as any;
    
    const result = await RenewalEngineService.renewSubscription(subscriptionId, paymentMethod, paymentId);
    return reply.send(result);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to renew subscription' });
  }
}

// POST /renewals/process-auto
export async function processAutoRenewals(req: FastifyRequest, reply: FastifyReply) {
  try {
    const result = await RenewalEngineService.processAutoRenewals();
    return reply.send(result);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to process auto-renewals' });
  }
}

// GET /renewals/analytics
export async function getRenewalAnalytics(req: FastifyRequest, reply: FastifyReply) {
  try {
    const timeframe = (req.query as any).timeframe || 'month';
    const analytics = await RenewalEngineService.getRenewalAnalytics(timeframe);
    return reply.send(analytics);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch renewal analytics' });
  }
}

// GET /renewals/upcoming
export async function getUpcomingRenewals(req: FastifyRequest, reply: FastifyReply) {
  try {
    const days = parseInt((req.query as any).days || '30');
    const renewals = await RenewalEngineService.getUpcomingRenewals(days);
    return reply.send(renewals);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch upcoming renewals' });
  }
}

// POST /renewals/enable-auto-renewal
export async function enableAutoRenewal(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { type, id } = req.body as any;
    
    if (!type || !id) {
      return reply.status(400).send({ error: 'type and id are required' });
    }

    const result = await RenewalEngineService.enableAutoRenewal(type, id);
    return reply.send(result);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to enable auto-renewal' });
  }
}

// POST /renewals/disable-auto-renewal
export async function disableAutoRenewal(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { type, id } = req.body as any;
    
    if (!type || !id) {
      return reply.status(400).send({ error: 'type and id are required' });
    }

    const result = await RenewalEngineService.disableAutoRenewal(type, id);
    return reply.send(result);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to disable auto-renewal' });
  }
}

// POST /renewals/send-expiry-reminder
export async function sendExpiryReminder(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { licenseId, daysBefore } = req.body as any;
    
    if (!licenseId || !daysBefore) {
      return reply.status(400).send({ error: 'licenseId and daysBefore are required' });
    }

    await RenewalEngineService.sendExpiryReminder(licenseId, daysBefore);
    return reply.send({ success: true });
  } catch (error) {
    reply.status(500).send({ error: 'Failed to send expiry reminder' });
  }
}

// POST /renewals/send-upgrade-reminder
export async function sendUpgradeReminder(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { licenseId } = req.body as any;
    
    if (!licenseId) {
      return reply.status(400).send({ error: 'licenseId is required' });
    }

    await RenewalEngineService.sendUpgradeReminder(licenseId);
    return reply.send({ success: true });
  } catch (error) {
    reply.status(500).send({ error: 'Failed to send upgrade reminder' });
  }
}

export function renewalEngineRoutes(fastify: FastifyInstance) {
  fastify.post('/renewals/license/:licenseId', { preHandler: [fastify.authenticate] }, renewLicense);
  fastify.post('/renewals/subscription/:subscriptionId', { preHandler: [fastify.authenticate] }, renewSubscription);
  fastify.post('/renewals/process-auto', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, processAutoRenewals);
  
  fastify.get('/renewals/analytics', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, getRenewalAnalytics);
  fastify.get('/renewals/upcoming', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, getUpcomingRenewals);
  
  fastify.post('/renewals/enable-auto-renewal', { preHandler: [fastify.authenticate] }, enableAutoRenewal);
  fastify.post('/renewals/disable-auto-renewal', { preHandler: [fastify.authenticate] }, disableAutoRenewal);
  
  fastify.post('/renewals/send-expiry-reminder', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, sendExpiryReminder);
  fastify.post('/renewals/send-upgrade-reminder', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, sendUpgradeReminder);
}
