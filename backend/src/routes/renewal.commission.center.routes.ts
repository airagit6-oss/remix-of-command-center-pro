// ============================================================
// RENEWAL COMMISSION CENTER ROUTES
// API endpoints for renewal commission management
// ============================================================

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { RenewalCommissionCenterService } from '../services/renewal.commission.center.service';

// POST /renewal/license-tracking
export async function createLicenseRenewalTracking(req: FastifyRequest, reply: FastifyReply) {
  try {
    const data = req.body as any;
    const tracking = await RenewalCommissionCenterService.createLicenseRenewalTracking(data);
    return reply.send(tracking);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to create license renewal tracking' });
  }
}

// GET /renewal/license-tracking
export async function getLicenseRenewalTracking(req: FastifyRequest, reply: FastifyReply) {
  try {
    const licenseId = (req.query as any).licenseId;
    const resellerId = (req.query as any).resellerId;
    const status = (req.query as any).status;
    const tracking = await RenewalCommissionCenterService.getLicenseRenewalTracking(licenseId, resellerId, status);
    return reply.send(tracking);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch license renewal tracking' });
  }
}

// PATCH /renewal/license-tracking/:trackingId/status
export async function updateLicenseRenewalStatus(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { trackingId } = req.params as any;
    const { status } = req.body as any;
    const tracking = await RenewalCommissionCenterService.updateLicenseRenewalStatus(trackingId, status);
    return reply.send(tracking);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to update renewal status' });
  }
}

// POST /renewal/subscription-tracking
export async function createSubscriptionRenewalTracking(req: FastifyRequest, reply: FastifyReply) {
  try {
    const data = req.body as any;
    const tracking = await RenewalCommissionCenterService.createSubscriptionRenewalTracking(data);
    return reply.send(tracking);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to create subscription renewal tracking' });
  }
}

// GET /renewal/subscription-tracking
export async function getSubscriptionRenewalTracking(req: FastifyRequest, reply: FastifyReply) {
  try {
    const subscriptionId = (req.query as any).subscriptionId;
    const resellerId = (req.query as any).resellerId;
    const status = (req.query as any).status;
    const tracking = await RenewalCommissionCenterService.getSubscriptionRenewalTracking(subscriptionId, resellerId, status);
    return reply.send(tracking);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch subscription renewal tracking' });
  }
}

// PATCH /renewal/subscription-tracking/:trackingId/status
export async function updateSubscriptionRenewalStatus(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { trackingId } = req.params as any;
    const { status } = req.body as any;
    const tracking = await RenewalCommissionCenterService.updateSubscriptionRenewalStatus(trackingId, status);
    return reply.send(tracking);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to update renewal status' });
  }
}

// POST /renewal/revenue
export async function createRenewalRevenue(req: FastifyRequest, reply: FastifyReply) {
  try {
    const data = req.body as any;
    const revenue = await RenewalCommissionCenterService.createRenewalRevenue(data);
    return reply.send(revenue);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to create renewal revenue' });
  }
}

// GET /renewal/revenue
export async function getRenewalRevenue(req: FastifyRequest, reply: FastifyReply) {
  try {
    const resellerId = (req.query as any).resellerId;
    const period = (req.query as any).period;
    const revenue = await RenewalCommissionCenterService.getRenewalRevenue(resellerId, period);
    return reply.send(revenue);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch renewal revenue' });
  }
}

// PATCH /renewal/revenue/:revenueId
export async function updateRenewalRevenue(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { revenueId } = req.params as any;
    const data = req.body as any;
    const revenue = await RenewalCommissionCenterService.updateRenewalRevenue(revenueId, data);
    return reply.send(revenue);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to update renewal revenue' });
  }
}

// POST /renewal/forecast
export async function createRenewalForecast(req: FastifyRequest, reply: FastifyReply) {
  try {
    const data = req.body as any;
    const forecast = await RenewalCommissionCenterService.createRenewalForecast(data);
    return reply.send(forecast);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to create renewal forecast' });
  }
}

// GET /renewal/forecast
export async function getRenewalForecasts(req: FastifyRequest, reply: FastifyReply) {
  try {
    const resellerId = (req.query as any).resellerId;
    const period = (req.query as any).period;
    const forecasts = await RenewalCommissionCenterService.getRenewalForecasts(resellerId, period);
    return reply.send(forecasts);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch renewal forecasts' });
  }
}

// PATCH /renewal/forecast/:forecastId
export async function updateRenewalForecast(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { forecastId } = req.params as any;
    const data = req.body as any;
    const forecast = await RenewalCommissionCenterService.updateRenewalForecast(forecastId, data);
    return reply.send(forecast);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to update renewal forecast' });
  }
}

// POST /renewal/auto-commission
export async function createAutoRenewalCommission(req: FastifyRequest, reply: FastifyReply) {
  try {
    const data = req.body as any;
    const commission = await RenewalCommissionCenterService.createAutoRenewalCommission(data);
    return reply.send(commission);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to create auto renewal commission' });
  }
}

// GET /renewal/auto-commission
export async function getAutoRenewalCommissions(req: FastifyRequest, reply: FastifyReply) {
  try {
    const resellerId = (req.query as any).resellerId;
    const sourceType = (req.query as any).sourceType;
    const status = (req.query as any).status;
    const commissions = await RenewalCommissionCenterService.getAutoRenewalCommissions(resellerId, sourceType, status);
    return reply.send(commissions);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch auto renewal commissions' });
  }
}

// PATCH /renewal/auto-commission/:commissionId/status
export async function updateAutoRenewalCommissionStatus(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { commissionId } = req.params as any;
    const { status } = req.body as any;
    const commission = await RenewalCommissionCenterService.updateAutoRenewalCommissionStatus(commissionId, status);
    return reply.send(commission);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to update commission status' });
  }
}

// GET /renewal/analytics
export async function getRenewalAnalytics(req: FastifyRequest, reply: FastifyReply) {
  try {
    const resellerId = (req.query as any).resellerId;
    const analytics = await RenewalCommissionCenterService.getRenewalAnalytics(resellerId);
    return reply.send(analytics);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch renewal analytics' });
  }
}

export function renewalCommissionCenterRoutes(fastify: FastifyInstance) {
  // License Renewal Tracking
  fastify.post('/renewal/license-tracking', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, createLicenseRenewalTracking);
  fastify.get('/renewal/license-tracking', { preHandler: [fastify.authenticate] }, getLicenseRenewalTracking);
  fastify.patch('/renewal/license-tracking/:trackingId/status', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, updateLicenseRenewalStatus);
  
  // Subscription Renewal Tracking
  fastify.post('/renewal/subscription-tracking', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, createSubscriptionRenewalTracking);
  fastify.get('/renewal/subscription-tracking', { preHandler: [fastify.authenticate] }, getSubscriptionRenewalTracking);
  fastify.patch('/renewal/subscription-tracking/:trackingId/status', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, updateSubscriptionRenewalStatus);
  
  // Renewal Revenue
  fastify.post('/renewal/revenue', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, createRenewalRevenue);
  fastify.get('/renewal/revenue', { preHandler: [fastify.authenticate] }, getRenewalRevenue);
  fastify.patch('/renewal/revenue/:revenueId', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, updateRenewalRevenue);
  
  // Renewal Forecast
  fastify.post('/renewal/forecast', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, createRenewalForecast);
  fastify.get('/renewal/forecast', { preHandler: [fastify.authenticate] }, getRenewalForecasts);
  fastify.patch('/renewal/forecast/:forecastId', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, updateRenewalForecast);
  
  // Auto Renewal Commission
  fastify.post('/renewal/auto-commission', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, createAutoRenewalCommission);
  fastify.get('/renewal/auto-commission', { preHandler: [fastify.authenticate] }, getAutoRenewalCommissions);
  fastify.patch('/renewal/auto-commission/:commissionId/status', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, updateAutoRenewalCommissionStatus);
  
  // Analytics
  fastify.get('/renewal/analytics', { preHandler: [fastify.authenticate] }, getRenewalAnalytics);
}
