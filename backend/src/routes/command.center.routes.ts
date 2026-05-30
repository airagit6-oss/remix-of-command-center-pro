// ============================================================
// COMMAND CENTER ROUTES
// API endpoints for live dashboard metrics
// ============================================================

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { CommandCenterService } from '../services/command.center.service';

// GET /command-center/dashboard
export async function getDashboard(req: FastifyRequest, reply: FastifyReply) {
  try {
    const dashboard = await CommandCenterService.getCommandCenterDashboard();
    return reply.send(dashboard);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch dashboard data' });
  }
}

// GET /command-center/revenue
export async function getRevenueMetrics(req: FastifyRequest, reply: FastifyReply) {
  try {
    const timeframe = (req.query as any).timeframe || 'today';
    const metrics = await CommandCenterService.getLiveRevenueMetrics(timeframe);
    return reply.send(metrics);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch revenue metrics' });
  }
}

// GET /command-center/orders
export async function getOrderMetrics(req: FastifyRequest, reply: FastifyReply) {
  try {
    const metrics = await CommandCenterService.getLiveOrderMetrics();
    return reply.send(metrics);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch order metrics' });
  }
}

// GET /command-center/users
export async function getUserMetrics(req: FastifyRequest, reply: FastifyReply) {
  try {
    const metrics = await CommandCenterService.getLiveUserMetrics();
    return reply.send(metrics);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch user metrics' });
  }
}

// GET /command-center/activations
export async function getActivationMetrics(req: FastifyRequest, reply: FastifyReply) {
  try {
    const metrics = await CommandCenterService.getLiveActivationMetrics();
    return reply.send(metrics);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch activation metrics' });
  }
}

// GET /command-center/commissions
export async function getCommissionMetrics(req: FastifyRequest, reply: FastifyReply) {
  try {
    const metrics = await CommandCenterService.getLiveCommissionMetrics();
    return reply.send(metrics);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch commission metrics' });
  }
}

// GET /command-center/payouts
export async function getPayoutMetrics(req: FastifyRequest, reply: FastifyReply) {
  try {
    const metrics = await CommandCenterService.getLivePayoutMetrics();
    return reply.send(metrics);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch payout metrics' });
  }
}

// GET /command-center/errors
export async function getErrorMetrics(req: FastifyRequest, reply: FastifyReply) {
  try {
    const metrics = await CommandCenterService.getLiveErrorMetrics();
    return reply.send(metrics);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch error metrics' });
  }
}

// GET /command-center/api-status
export async function getAPIStatus(req: FastifyRequest, reply: FastifyReply) {
  try {
    const status = await CommandCenterService.getLiveAPIStatus();
    return reply.send(status);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch API status' });
  }
}

// GET /command-center/webhook-status
export async function getWebhookStatus(req: FastifyRequest, reply: FastifyReply) {
  try {
    const status = await CommandCenterService.getLiveWebhookStatus();
    return reply.send(status);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch webhook status' });
  }
}

export function commandCenterRoutes(fastify: FastifyInstance) {
  fastify.get('/command-center/dashboard', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, getDashboard);
  fastify.get('/command-center/revenue', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, getRevenueMetrics);
  fastify.get('/command-center/orders', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, getOrderMetrics);
  fastify.get('/command-center/users', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, getUserMetrics);
  fastify.get('/command-center/activations', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, getActivationMetrics);
  fastify.get('/command-center/commissions', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, getCommissionMetrics);
  fastify.get('/command-center/payouts', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, getPayoutMetrics);
  fastify.get('/command-center/errors', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, getErrorMetrics);
  fastify.get('/command-center/api-status', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, getAPIStatus);
  fastify.get('/command-center/webhook-status', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, getWebhookStatus);
}
