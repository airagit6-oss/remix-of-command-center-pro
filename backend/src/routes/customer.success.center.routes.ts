// ============================================================
// CUSTOMER SUCCESS CENTER ROUTES
// API endpoints for customer success management
// ============================================================

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { CustomerSuccessCenterService } from '../services/customer.success.center.service';

// POST /customer-success/onboarding
export async function createCustomerOnboarding(req: FastifyRequest, reply: FastifyReply) {
  try {
    const data = req.body as any;
    const onboarding = await CustomerSuccessCenterService.createCustomerOnboarding(data);
    return reply.send(onboarding);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to create onboarding' });
  }
}

// GET /customer-success/onboarding/:userId
export async function getCustomerOnboarding(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { userId } = req.params as any;
    const onboarding = await CustomerSuccessCenterService.getCustomerOnboarding(userId);
    return reply.send(onboarding);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to fetch onboarding' });
  }
}

// PATCH /customer-success/onboarding/:onboardingId
export async function updateOnboardingProgress(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { onboardingId } = req.params as any;
    const data = req.body as any;
    const onboarding = await CustomerSuccessCenterService.updateOnboardingProgress(onboardingId, data);
    return reply.send(onboarding);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to update onboarding progress' });
  }
}

// POST /customer-success/usage
export async function trackUsage(req: FastifyRequest, reply: FastifyReply) {
  try {
    const data = req.body as any;
    const usage = await CustomerSuccessCenterService.trackUsage(data);
    return reply.send(usage);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to track usage' });
  }
}

// GET /customer-success/usage
export async function getUsageTracking(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req.query as any).userId;
    const productId = (req.query as any).productId;
    const action = (req.query as any).action;
    const usage = await CustomerSuccessCenterService.getUsageTracking(userId, productId, action);
    return reply.send(usage);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch usage tracking' });
  }
}

// POST /customer-success/adoption
export async function createAdoptionTracking(req: FastifyRequest, reply: FastifyReply) {
  try {
    const data = req.body as any;
    const adoption = await CustomerSuccessCenterService.createAdoptionTracking(data);
    return reply.send(adoption);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to create adoption tracking' });
  }
}

// GET /customer-success/adoption
export async function getAdoptionTracking(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req.query as any).userId;
    const productId = (req.query as any).productId;
    const adoption = await CustomerSuccessCenterService.getAdoptionTracking(userId, productId);
    return reply.send(adoption);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch adoption tracking' });
  }
}

// PATCH /customer-success/adoption/:adoptionId
export async function updateAdoptionScore(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { adoptionId } = req.params as any;
    const data = req.body as any;
    const adoption = await CustomerSuccessCenterService.updateAdoptionScore(adoptionId, data);
    return reply.send(adoption);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to update adoption score' });
  }
}

// POST /customer-success/renewal-prediction
export async function createRenewalPrediction(req: FastifyRequest, reply: FastifyReply) {
  try {
    const data = req.body as any;
    const prediction = await CustomerSuccessCenterService.createRenewalPrediction(data);
    return reply.send(prediction);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to create renewal prediction' });
  }
}

// GET /customer-success/renewal-prediction
export async function getRenewalPredictions(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req.query as any).userId;
    const riskLevel = (req.query as any).riskLevel;
    const predictions = await CustomerSuccessCenterService.getRenewalPredictions(userId, riskLevel);
    return reply.send(predictions);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch renewal predictions' });
  }
}

// PATCH /customer-success/renewal-prediction/:predictionId
export async function updateRenewalPrediction(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { predictionId } = req.params as any;
    const data = req.body as any;
    const prediction = await CustomerSuccessCenterService.updateRenewalPrediction(predictionId, data);
    return reply.send(prediction);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to update renewal prediction' });
  }
}

// POST /customer-success/churn-prediction
export async function createChurnPrediction(req: FastifyRequest, reply: FastifyReply) {
  try {
    const data = req.body as any;
    const prediction = await CustomerSuccessCenterService.createChurnPrediction(data);
    return reply.send(prediction);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to create churn prediction' });
  }
}

// GET /customer-success/churn-prediction
export async function getChurnPredictions(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req.query as any).userId;
    const riskLevel = (req.query as any).riskLevel;
    const predictions = await CustomerSuccessCenterService.getChurnPredictions(userId, riskLevel);
    return reply.send(predictions);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch churn predictions' });
  }
}

// PATCH /customer-success/churn-prediction/:predictionId
export async function updateChurnPrediction(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { predictionId } = req.params as any;
    const data = req.body as any;
    const prediction = await CustomerSuccessCenterService.updateChurnPrediction(predictionId, data);
    return reply.send(prediction);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to update churn prediction' });
  }
}

// POST /customer-success/campaigns
export async function createRetentionCampaign(req: FastifyRequest, reply: FastifyReply) {
  try {
    const data = req.body as any;
    const campaign = await CustomerSuccessCenterService.createRetentionCampaign(data);
    return reply.send(campaign);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to create retention campaign' });
  }
}

// GET /customer-success/campaigns
export async function getRetentionCampaigns(req: FastifyRequest, reply: FastifyReply) {
  try {
    const status = (req.query as any).status;
    const type = (req.query as any).type;
    const campaigns = await CustomerSuccessCenterService.getRetentionCampaigns(status, type);
    return reply.send(campaigns);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch retention campaigns' });
  }
}

// PATCH /customer-success/campaigns/:campaignId
export async function updateRetentionCampaign(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { campaignId } = req.params as any;
    const data = req.body as any;
    const campaign = await CustomerSuccessCenterService.updateRetentionCampaign(campaignId, data);
    return reply.send(campaign);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to update retention campaign' });
  }
}

// POST /customer-success/campaigns/:campaignId/targets
export async function addCampaignTarget(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { campaignId } = req.params as any;
    const data = req.body as any;
    const target = await CustomerSuccessCenterService.addCampaignTarget({ ...data, campaignId });
    return reply.send(target);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to add campaign target' });
  }
}

// GET /customer-success/campaigns/:campaignId/targets
export async function getCampaignTargets(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { campaignId } = req.params as any;
    const status = (req.query as any).status;
    const targets = await CustomerSuccessCenterService.getCampaignTargets(campaignId, status);
    return reply.send(targets);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch campaign targets' });
  }
}

// PATCH /customer-success/campaigns/targets/:targetId/status
export async function updateCampaignTargetStatus(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { targetId } = req.params as any;
    const { status } = req.body as any;
    const target = await CustomerSuccessCenterService.updateCampaignTargetStatus(targetId, status);
    return reply.send(target);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to update campaign target status' });
  }
}

// GET /customer-success/statistics
export async function getCustomerSuccessStatistics(req: FastifyRequest, reply: FastifyReply) {
  try {
    const stats = await CustomerSuccessCenterService.getCustomerSuccessStatistics();
    return reply.send(stats);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch statistics' });
  }
}

export function customerSuccessCenterRoutes(fastify: FastifyInstance) {
  // Customer Onboarding
  fastify.post('/customer-success/onboarding', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, createCustomerOnboarding);
  fastify.get('/customer-success/onboarding/:userId', { preHandler: [fastify.authenticate] }, getCustomerOnboarding);
  fastify.patch('/customer-success/onboarding/:onboardingId', { preHandler: [fastify.authenticate] }, updateOnboardingProgress);
  
  // Usage Tracking
  fastify.post('/customer-success/usage', { preHandler: [fastify.authenticate] }, trackUsage);
  fastify.get('/customer-success/usage', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, getUsageTracking);
  
  // Adoption Tracking
  fastify.post('/customer-success/adoption', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, createAdoptionTracking);
  fastify.get('/customer-success/adoption', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, getAdoptionTracking);
  fastify.patch('/customer-success/adoption/:adoptionId', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, updateAdoptionScore);
  
  // Renewal Prediction
  fastify.post('/customer-success/renewal-prediction', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, createRenewalPrediction);
  fastify.get('/customer-success/renewal-prediction', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, getRenewalPredictions);
  fastify.patch('/customer-success/renewal-prediction/:predictionId', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, updateRenewalPrediction);
  
  // Churn Prediction
  fastify.post('/customer-success/churn-prediction', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, createChurnPrediction);
  fastify.get('/customer-success/churn-prediction', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, getChurnPredictions);
  fastify.patch('/customer-success/churn-prediction/:predictionId', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, updateChurnPrediction);
  
  // Retention Campaigns
  fastify.post('/customer-success/campaigns', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, createRetentionCampaign);
  fastify.get('/customer-success/campaigns', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, getRetentionCampaigns);
  fastify.patch('/customer-success/campaigns/:campaignId', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, updateRetentionCampaign);
  
  // Campaign Targets
  fastify.post('/customer-success/campaigns/:campaignId/targets', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, addCampaignTarget);
  fastify.get('/customer-success/campaigns/:campaignId/targets', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, getCampaignTargets);
  fastify.patch('/customer-success/campaigns/targets/:targetId/status', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, updateCampaignTargetStatus);
  
  // Statistics
  fastify.get('/customer-success/statistics', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, getCustomerSuccessStatistics);
}
