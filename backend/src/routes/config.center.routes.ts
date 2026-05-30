// ============================================================
// CONFIG CENTER ROUTES
// API endpoints for configuration management
// ============================================================

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { ConfigCenterService } from '../services/config.center.service';

// POST /config/rules
export async function createConfigRule(req: FastifyRequest, reply: FastifyReply) {
  try {
    const data = req.body as any;
    await ConfigCenterService.validateConfigRule(data.type, data.category, data.key, data.value);
    const rule = await ConfigCenterService.createConfigRule(data);
    return reply.send(rule);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to create config rule' });
  }
}

// GET /config/rules
export async function getConfigRules(req: FastifyRequest, reply: FastifyReply) {
  try {
    const type = (req.query as any).type;
    const category = (req.query as any).category;
    const enabledOnly = (req.query as any).enabledOnly !== 'false';
    
    const rules = await ConfigCenterService.getConfigRules(type, category, enabledOnly);
    return reply.send(rules);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch config rules' });
  }
}

// GET /config/rules/:ruleId
export async function getConfigRule(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { ruleId } = req.params as any;
    const rule = await ConfigCenterService.getConfigRule(ruleId);
    return reply.send(rule);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to fetch config rule' });
  }
}

// PATCH /config/rules/:ruleId
export async function updateConfigRule(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { ruleId } = req.params as any;
    const data = req.body as any;
    const rule = await ConfigCenterService.updateConfigRule(ruleId, data);
    return reply.send(rule);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to update config rule' });
  }
}

// DELETE /config/rules/:ruleId
export async function deleteConfigRule(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { ruleId } = req.params as any;
    const rule = await ConfigCenterService.deleteConfigRule(ruleId);
    return reply.send(rule);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to delete config rule' });
  }
}

// POST /config/rules/:ruleId/enable
export async function enableConfigRule(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { ruleId } = req.params as any;
    const rule = await ConfigCenterService.enableConfigRule(ruleId);
    return reply.send(rule);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to enable config rule' });
  }
}

// POST /config/rules/:ruleId/disable
export async function disableConfigRule(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { ruleId } = req.params as any;
    const rule = await ConfigCenterService.disableConfigRule(ruleId);
    return reply.send(rule);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to disable config rule' });
  }
}

// GET /config/rules/:type/:key
export async function getConfigRuleByKey(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { type, key } = req.params as any;
    const rule = await ConfigCenterService.getConfigRuleByKey(type, key);
    return reply.send(rule);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to fetch config rule' });
  }
}

// GET /config/rules/:type/:key/value
export async function getConfigValue(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { type, key } = req.params as any;
    const value = await ConfigCenterService.getConfigValue(type, key);
    return reply.send({ type, key, value });
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to fetch config value' });
  }
}

// GET /config/tax-rules
export async function getTaxRules(req: FastifyRequest, reply: FastifyReply) {
  try {
    const countryCode = (req.query as any).countryCode;
    const rules = await ConfigCenterService.getTaxRules(countryCode);
    return reply.send(rules);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch tax rules' });
  }
}

// GET /config/commission-rules
export async function getCommissionRules(req: FastifyRequest, reply: FastifyReply) {
  try {
    const role = (req.query as any).role;
    const rules = await ConfigCenterService.getCommissionRules(role);
    return reply.send(rules);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch commission rules' });
  }
}

// GET /config/license-rules
export async function getLicenseRules(req: FastifyRequest, reply: FastifyReply) {
  try {
    const licenseType = (req.query as any).licenseType;
    const rules = await ConfigCenterService.getLicenseRules(licenseType);
    return reply.send(rules);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch license rules' });
  }
}

// GET /config/renewal-rules
export async function getRenewalRules(req: FastifyRequest, reply: FastifyReply) {
  try {
    const rules = await ConfigCenterService.getRenewalRules();
    return reply.send(rules);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch renewal rules' });
  }
}

// GET /config/referral-rules
export async function getReferralRules(req: FastifyRequest, reply: FastifyReply) {
  try {
    const rules = await ConfigCenterService.getReferralRules();
    return reply.send(rules);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch referral rules' });
  }
}

// GET /config/notification-rules
export async function getNotificationRules(req: FastifyRequest, reply: FastifyReply) {
  try {
    const notificationType = (req.query as any).notificationType;
    const rules = await ConfigCenterService.getNotificationRules(notificationType);
    return reply.send(rules);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch notification rules' });
  }
}

// GET /config/statistics
export async function getConfigStatistics(req: FastifyRequest, reply: FastifyReply) {
  try {
    const stats = await ConfigCenterService.getConfigStatistics();
    return reply.send(stats);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch config statistics' });
  }
}

// POST /config/rules/bulk-update
export async function bulkUpdateConfigRules(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { updates } = req.body as any;
    const results = await ConfigCenterService.bulkUpdateConfigRules(updates);
    return reply.send(results);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to bulk update config rules' });
  }
}

export function configCenterRoutes(fastify: FastifyInstance) {
  fastify.post('/config/rules', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, createConfigRule);
  fastify.get('/config/rules', { preHandler: [fastify.authenticate] }, getConfigRules);
  fastify.get('/config/rules/:ruleId', { preHandler: [fastify.authenticate] }, getConfigRule);
  fastify.patch('/config/rules/:ruleId', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, updateConfigRule);
  fastify.delete('/config/rules/:ruleId', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, deleteConfigRule);
  
  fastify.post('/config/rules/:ruleId/enable', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, enableConfigRule);
  fastify.post('/config/rules/:ruleId/disable', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, disableConfigRule);
  
  fastify.get('/config/rules/:type/:key', { preHandler: [fastify.authenticate] }, getConfigRuleByKey);
  fastify.get('/config/rules/:type/:key/value', { preHandler: [fastify.authenticate] }, getConfigValue);
  
  fastify.get('/config/tax-rules', { preHandler: [fastify.authenticate] }, getTaxRules);
  fastify.get('/config/commission-rules', { preHandler: [fastify.authenticate] }, getCommissionRules);
  fastify.get('/config/license-rules', { preHandler: [fastify.authenticate] }, getLicenseRules);
  fastify.get('/config/renewal-rules', { preHandler: [fastify.authenticate] }, getRenewalRules);
  fastify.get('/config/referral-rules', { preHandler: [fastify.authenticate] }, getReferralRules);
  fastify.get('/config/notification-rules', { preHandler: [fastify.authenticate] }, getNotificationRules);
  
  fastify.get('/config/statistics', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, getConfigStatistics);
  fastify.post('/config/rules/bulk-update', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, bulkUpdateConfigRules);
}
