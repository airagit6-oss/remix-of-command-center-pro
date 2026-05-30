// ============================================================
// ENTERPRISE COMMISSION ENGINE ROUTES
// API endpoints for enterprise commission management
// ============================================================

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { EnterpriseCommissionEngineService } from '../services/enterprise.commission.engine.service';

// POST /commission-rules
export async function createCommissionRule(req: FastifyRequest, reply: FastifyReply) {
  try {
    const data = req.body as any;
    const rule = await EnterpriseCommissionEngineService.createCommissionRule(data);
    return reply.send(rule);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to create commission rule' });
  }
}

// GET /commission-rules
export async function getCommissionRules(req: FastifyRequest, reply: FastifyReply) {
  try {
    const type = (req.query as any).type;
    const scope = (req.query as any).scope;
    const status = (req.query as any).status;
    const rules = await EnterpriseCommissionEngineService.getCommissionRules(type, scope, status);
    return reply.send(rules);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch commission rules' });
  }
}

// PATCH /commission-rules/:ruleId
export async function updateCommissionRule(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { ruleId } = req.params as any;
    const data = req.body as any;
    const rule = await EnterpriseCommissionEngineService.updateCommissionRule(ruleId, data);
    return reply.send(rule);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to update commission rule' });
  }
}

// PATCH /commission-rules/:ruleId/status
export async function updateCommissionRuleStatus(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { ruleId } = req.params as any;
    const { status } = req.body as any;
    const rule = await EnterpriseCommissionEngineService.updateCommissionRuleStatus(ruleId, status);
    return reply.send(rule);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to update commission rule status' });
  }
}

// POST /commission-ledger
export async function createCommissionLedgerEntry(req: FastifyRequest, reply: FastifyReply) {
  try {
    const data = req.body as any;
    const entry = await EnterpriseCommissionEngineService.createCommissionLedgerEntry(data);
    return reply.send(entry);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to create commission ledger entry' });
  }
}

// GET /commission-ledger
export async function getCommissionLedgerEntries(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req.query as any).userId;
    const sourceType = (req.query as any).sourceType;
    const status = (req.query as any).status;
    const entries = await EnterpriseCommissionEngineService.getCommissionLedgerEntries(userId, sourceType, status);
    return reply.send(entries);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch commission ledger entries' });
  }
}

// PATCH /commission-ledger/:entryId/status
export async function updateCommissionLedgerEntryStatus(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { entryId } = req.params as any;
    const { status } = req.body as any;
    const entry = await EnterpriseCommissionEngineService.updateCommissionLedgerEntryStatus(entryId, status);
    return reply.send(entry);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to update ledger entry status' });
  }
}

// POST /team-commissions
export async function createTeamCommission(req: FastifyRequest, reply: FastifyReply) {
  try {
    const data = req.body as any;
    const commission = await EnterpriseCommissionEngineService.createTeamCommission(data);
    return reply.send(commission);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to create team commission' });
  }
}

// GET /team-commissions
export async function getTeamCommissions(req: FastifyRequest, reply: FastifyReply) {
  try {
    const teamId = (req.query as any).teamId;
    const memberId = (req.query as any).memberId;
    const status = (req.query as any).status;
    const commissions = await EnterpriseCommissionEngineService.getTeamCommissions(teamId, memberId, status);
    return reply.send(commissions);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch team commissions' });
  }
}

// PATCH /team-commissions/:commissionId/status
export async function updateTeamCommissionStatus(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { commissionId } = req.params as any;
    const { status } = req.body as any;
    const commission = await EnterpriseCommissionEngineService.updateTeamCommissionStatus(commissionId, status);
    return reply.send(commission);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to update team commission status' });
  }
}

// POST /performance-commissions
export async function createPerformanceCommission(req: FastifyRequest, reply: FastifyReply) {
  try {
    const data = req.body as any;
    const commission = await EnterpriseCommissionEngineService.createPerformanceCommission(data);
    return reply.send(commission);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to create performance commission' });
  }
}

// GET /performance-commissions
export async function getPerformanceCommissions(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req.query as any).userId;
    const period = (req.query as any).period;
    const status = (req.query as any).status;
    const commissions = await EnterpriseCommissionEngineService.getPerformanceCommissions(userId, period, status);
    return reply.send(commissions);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch performance commissions' });
  }
}

// PATCH /performance-commissions/:commissionId/status
export async function updatePerformanceCommissionStatus(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { commissionId } = req.params as any;
    const { status } = req.body as any;
    const commission = await EnterpriseCommissionEngineService.updatePerformanceCommissionStatus(commissionId, status);
    return reply.send(commission);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to update performance commission status' });
  }
}

// GET /commission-analytics
export async function getCommissionAnalytics(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req.query as any).userId;
    const analytics = await EnterpriseCommissionEngineService.getCommissionAnalytics(userId);
    return reply.send(analytics);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch commission analytics' });
  }
}

export function enterpriseCommissionEngineRoutes(fastify: FastifyInstance) {
  // Commission Rules
  fastify.post('/commission-rules', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, createCommissionRule);
  fastify.get('/commission-rules', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, getCommissionRules);
  fastify.patch('/commission-rules/:ruleId', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, updateCommissionRule);
  fastify.patch('/commission-rules/:ruleId/status', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, updateCommissionRuleStatus);
  
  // Commission Ledger
  fastify.post('/commission-ledger', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, createCommissionLedgerEntry);
  fastify.get('/commission-ledger', { preHandler: [fastify.authenticate] }, getCommissionLedgerEntries);
  fastify.patch('/commission-ledger/:entryId/status', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, updateCommissionLedgerEntryStatus);
  
  // Team Commissions
  fastify.post('/team-commissions', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, createTeamCommission);
  fastify.get('/team-commissions', { preHandler: [fastify.authenticate] }, getTeamCommissions);
  fastify.patch('/team-commissions/:commissionId/status', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, updateTeamCommissionStatus);
  
  // Performance Commissions
  fastify.post('/performance-commissions', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, createPerformanceCommission);
  fastify.get('/performance-commissions', { preHandler: [fastify.authenticate] }, getPerformanceCommissions);
  fastify.patch('/performance-commissions/:commissionId/status', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, updatePerformanceCommissionStatus);
  
  // Analytics
  fastify.get('/commission-analytics', { preHandler: [fastify.authenticate] }, getCommissionAnalytics);
}
