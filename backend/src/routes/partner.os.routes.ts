// ============================================================
// PARTNER OS ROUTES
// API endpoints for partner management
// ============================================================

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { PartnerOSService } from '../services/partner.os.service';

// POST /partners
export async function createPartner(req: FastifyRequest, reply: FastifyReply) {
  try {
    const data = req.body as any;
    const partner = await PartnerOSService.createPartner(data);
    return reply.send(partner);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to create partner' });
  }
}

// GET /partners
export async function getPartners(req: FastifyRequest, reply: FastifyReply) {
  try {
    const type = (req.query as any).type;
    const status = (req.query as any).status;
    const partners = await PartnerOSService.getPartners(type, status);
    return reply.send(partners);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch partners' });
  }
}

// GET /partners/:partnerId
export async function getPartner(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { partnerId } = req.params as any;
    const partner = await PartnerOSService.getPartner(partnerId);
    return reply.send(partner);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to fetch partner' });
  }
}

// PATCH /partners/:partnerId
export async function updatePartner(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { partnerId } = req.params as any;
    const data = req.body as any;
    const partner = await PartnerOSService.updatePartner(partnerId, data);
    return reply.send(partner);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to update partner' });
  }
}

// PATCH /partners/:partnerId/status
export async function updatePartnerStatus(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { partnerId } = req.params as any;
    const { status } = req.body as any;
    const partner = await PartnerOSService.updatePartnerStatus(partnerId, status);
    return reply.send(partner);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to update partner status' });
  }
}

// POST /partners/:partnerId/revenue
export async function createPartnerRevenue(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { partnerId } = req.params as any;
    const data = req.body as any;
    const revenue = await PartnerOSService.createPartnerRevenue({ ...data, partnerId });
    return reply.send(revenue);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to create partner revenue' });
  }
}

// GET /partners/:partnerId/revenue
export async function getPartnerRevenue(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { partnerId } = req.params as any;
    const period = (req.query as any).period;
    const revenue = await PartnerOSService.getPartnerRevenue(partnerId, period);
    return reply.send(revenue);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch partner revenue' });
  }
}

// PATCH /partners/revenue/:revenueId
export async function updatePartnerRevenue(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { revenueId } = req.params as any;
    const data = req.body as any;
    const revenue = await PartnerOSService.updatePartnerRevenue(revenueId, data);
    return reply.send(revenue);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to update partner revenue' });
  }
}

// POST /partners/:partnerId/commissions
export async function createPartnerCommission(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { partnerId } = req.params as any;
    const data = req.body as any;
    const commission = await PartnerOSService.createPartnerCommission({ ...data, partnerId });
    return reply.send(commission);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to create partner commission' });
  }
}

// GET /partners/:partnerId/commissions
export async function getPartnerCommissions(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { partnerId } = req.params as any;
    const status = (req.query as any).status;
    const commissions = await PartnerOSService.getPartnerCommissions(partnerId, status);
    return reply.send(commissions);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch partner commissions' });
  }
}

// PATCH /partners/commissions/:commissionId/status
export async function updatePartnerCommissionStatus(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { commissionId } = req.params as any;
    const { status } = req.body as any;
    const commission = await PartnerOSService.updatePartnerCommissionStatus(commissionId, status);
    return reply.send(commission);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to update commission status' });
  }
}

// POST /partners/:partnerId/payouts
export async function createPartnerPayout(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { partnerId } = req.params as any;
    const data = req.body as any;
    const payout = await PartnerOSService.createPartnerPayout({ ...data, partnerId });
    return reply.send(payout);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to create partner payout' });
  }
}

// GET /partners/:partnerId/payouts
export async function getPartnerPayouts(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { partnerId } = req.params as any;
    const status = (req.query as any).status;
    const payouts = await PartnerOSService.getPartnerPayouts(partnerId, status);
    return reply.send(payouts);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch partner payouts' });
  }
}

// PATCH /partners/payouts/:payoutId/status
export async function updatePartnerPayoutStatus(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { payoutId } = req.params as any;
    const { status } = req.body as any;
    const payout = await PartnerOSService.updatePartnerPayoutStatus(payoutId, status);
    return reply.send(payout);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to update payout status' });
  }
}

// GET /partners/:partnerId/analytics
export async function getPartnerAnalytics(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { partnerId } = req.params as any;
    const analytics = await PartnerOSService.getPartnerAnalytics(partnerId);
    return reply.send(analytics);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch partner analytics' });
  }
}

export function partnerOSRoutes(fastify: FastifyInstance) {
  // Partners
  fastify.post('/partners', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, createPartner);
  fastify.get('/partners', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, getPartners);
  fastify.get('/partners/:partnerId', { preHandler: [fastify.authenticate] }, getPartner);
  fastify.patch('/partners/:partnerId', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, updatePartner);
  fastify.patch('/partners/:partnerId/status', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, updatePartnerStatus);
  
  // Partner Revenue
  fastify.post('/partners/:partnerId/revenue', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, createPartnerRevenue);
  fastify.get('/partners/:partnerId/revenue', { preHandler: [fastify.authenticate] }, getPartnerRevenue);
  fastify.patch('/partners/revenue/:revenueId', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, updatePartnerRevenue);
  
  // Partner Commissions
  fastify.post('/partners/:partnerId/commissions', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, createPartnerCommission);
  fastify.get('/partners/:partnerId/commissions', { preHandler: [fastify.authenticate] }, getPartnerCommissions);
  fastify.patch('/partners/commissions/:commissionId/status', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, updatePartnerCommissionStatus);
  
  // Partner Payouts
  fastify.post('/partners/:partnerId/payouts', { preHandler: [fastify.authenticate] }, createPartnerPayout);
  fastify.get('/partners/:partnerId/payouts', { preHandler: [fastify.authenticate] }, getPartnerPayouts);
  fastify.patch('/partners/payouts/:payoutId/status', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, updatePartnerPayoutStatus);
  
  // Analytics
  fastify.get('/partners/:partnerId/analytics', { preHandler: [fastify.authenticate] }, getPartnerAnalytics);
}
