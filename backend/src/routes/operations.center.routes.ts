// ============================================================
// OPERATIONS CENTER ROUTES
// API endpoints for operations center dashboard
// ============================================================

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { OperationsCenterService } from '../services/operations.center.service';

// GET /operations/dashboard
export async function getOperationsDashboard(req: FastifyRequest, reply: FastifyReply) {
  try {
    const dashboard = await OperationsCenterService.getOperationsCenterDashboard();
    return reply.send(dashboard);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch operations dashboard' });
  }
}

// GET /operations/reviews
export async function getPendingReviews(req: FastifyRequest, reply: FastifyReply) {
  try {
    const reviews = await OperationsCenterService.getPendingReviews();
    return reply.send(reviews);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch pending reviews' });
  }
}

// GET /operations/approvals
export async function getPendingApprovals(req: FastifyRequest, reply: FastifyReply) {
  try {
    const approvals = await OperationsCenterService.getPendingApprovals();
    return reply.send(approvals);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch pending approvals' });
  }
}

// GET /operations/failed-payments
export async function getFailedPayments(req: FastifyRequest, reply: FastifyReply) {
  try {
    const payments = await OperationsCenterService.getFailedPayments();
    return reply.send(payments);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch failed payments' });
  }
}

// GET /operations/failed-webhooks
export async function getFailedWebhooks(req: FastifyRequest, reply: FastifyReply) {
  try {
    const webhooks = await OperationsCenterService.getFailedWebhooks();
    return reply.send(webhooks);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch failed webhooks' });
  }
}

// GET /operations/failed-emails
export async function getFailedEmails(req: FastifyRequest, reply: FastifyReply) {
  try {
    const emails = await OperationsCenterService.getFailedEmails();
    return reply.send(emails);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch failed emails' });
  }
}

// GET /operations/failed-licenses
export async function getFailedLicenses(req: FastifyRequest, reply: FastifyReply) {
  try {
    const licenses = await OperationsCenterService.getFailedLicenses();
    return reply.send(licenses);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch failed licenses' });
  }
}

// GET /operations/pending-payouts
export async function getPendingPayouts(req: FastifyRequest, reply: FastifyReply) {
  try {
    const payouts = await OperationsCenterService.getPendingPayouts();
    return reply.send(payouts);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch pending payouts' });
  }
}

// GET /operations/pending-kyc
export async function getPendingKYC(req: FastifyRequest, reply: FastifyReply) {
  try {
    const kyc = await OperationsCenterService.getPendingKYC();
    return reply.send(kyc);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch pending KYC' });
  }
}

// GET /operations/pending-refunds
export async function getPendingRefunds(req: FastifyRequest, reply: FastifyReply) {
  try {
    const refunds = await OperationsCenterService.getPendingRefunds();
    return reply.send(refunds);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch pending refunds' });
  }
}

// GET /operations/statistics
export async function getOperationsStatistics(req: FastifyRequest, reply: FastifyReply) {
  try {
    const timeframe = (req.query as any).timeframe || 'today';
    const stats = await OperationsCenterService.getOperationsStatistics(timeframe);
    return reply.send(stats);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch operations statistics' });
  }
}

// GET /operations/critical-alerts
export async function getCriticalAlerts(req: FastifyRequest, reply: FastifyReply) {
  try {
    const alerts = await OperationsCenterService.getCriticalAlerts();
    return reply.send(alerts);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch critical alerts' });
  }
}

export function operationsCenterRoutes(fastify: FastifyInstance) {
  fastify.get('/operations/dashboard', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, getOperationsDashboard);
  fastify.get('/operations/reviews', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, getPendingReviews);
  fastify.get('/operations/approvals', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, getPendingApprovals);
  fastify.get('/operations/failed-payments', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, getFailedPayments);
  fastify.get('/operations/failed-webhooks', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, getFailedWebhooks);
  fastify.get('/operations/failed-emails', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, getFailedEmails);
  fastify.get('/operations/failed-licenses', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, getFailedLicenses);
  fastify.get('/operations/pending-payouts', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, getPendingPayouts);
  fastify.get('/operations/pending-kyc', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, getPendingKYC);
  fastify.get('/operations/pending-refunds', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, getPendingRefunds);
  fastify.get('/operations/statistics', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, getOperationsStatistics);
  fastify.get('/operations/critical-alerts', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, getCriticalAlerts);
}
