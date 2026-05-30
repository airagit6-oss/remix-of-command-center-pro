// ============================================================
// B2B SALES CENTER ROUTES
// API endpoints for B2B sales management
// ============================================================

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { B2BSalesCenterService } from '../services/b2b.sales.center.service';

// POST /b2b/corporate-leads
export async function createCorporateLead(req: FastifyRequest, reply: FastifyReply) {
  try {
    const data = req.body as any;
    const lead = await B2BSalesCenterService.createCorporateLead(data);
    return reply.send(lead);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to create corporate lead' });
  }
}

// GET /b2b/corporate-leads
export async function getCorporateLeads(req: FastifyRequest, reply: FastifyReply) {
  try {
    const companyId = (req.query as any).companyId;
    const leadStatus = (req.query as any).leadStatus;
    const assignedTo = (req.query as any).assignedTo;
    const leads = await B2BSalesCenterService.getCorporateLeads(companyId, leadStatus, assignedTo);
    return reply.send(leads);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch corporate leads' });
  }
}

// PATCH /b2b/corporate-leads/:leadId
export async function updateCorporateLead(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { leadId } = req.params as any;
    const data = req.body as any;
    const lead = await B2BSalesCenterService.updateCorporateLead(leadId, data);
    return reply.send(lead);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to update corporate lead' });
  }
}

// PATCH /b2b/corporate-leads/:leadId/status
export async function updateCorporateLeadStatus(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { leadId } = req.params as any;
    const { leadStatus } = req.body as any;
    const lead = await B2BSalesCenterService.updateCorporateLeadStatus(leadId, leadStatus);
    return reply.send(lead);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to update lead status' });
  }
}

// POST /b2b/enterprise-leads
export async function createEnterpriseLead(req: FastifyRequest, reply: FastifyReply) {
  try {
    const data = req.body as any;
    const lead = await B2BSalesCenterService.createEnterpriseLead(data);
    return reply.send(lead);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to create enterprise lead' });
  }
}

// GET /b2b/enterprise-leads
export async function getEnterpriseLeads(req: FastifyRequest, reply: FastifyReply) {
  try {
    const companyId = (req.query as any).companyId;
    const leadStatus = (req.query as any).leadStatus;
    const tier = (req.query as any).tier;
    const assignedTo = (req.query as any).assignedTo;
    const leads = await B2BSalesCenterService.getEnterpriseLeads(companyId, leadStatus, tier, assignedTo);
    return reply.send(leads);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch enterprise leads' });
  }
}

// PATCH /b2b/enterprise-leads/:leadId
export async function updateEnterpriseLead(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { leadId } = req.params as any;
    const data = req.body as any;
    const lead = await B2BSalesCenterService.updateEnterpriseLead(leadId, data);
    return reply.send(lead);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to update enterprise lead' });
  }
}

// PATCH /b2b/enterprise-leads/:leadId/status
export async function updateEnterpriseLeadStatus(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { leadId } = req.params as any;
    const { leadStatus } = req.body as any;
    const lead = await B2BSalesCenterService.updateEnterpriseLeadStatus(leadId, leadStatus);
    return reply.send(lead);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to update lead status' });
  }
}

// POST /b2b/bulk-deals
export async function createBulkDeal(req: FastifyRequest, reply: FastifyReply) {
  try {
    const data = req.body as any;
    const deal = await B2BSalesCenterService.createBulkDeal(data);
    return reply.send(deal);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to create bulk deal' });
  }
}

// GET /b2b/bulk-deals
export async function getBulkDeals(req: FastifyRequest, reply: FastifyReply) {
  try {
    const dealStatus = (req.query as any).dealStatus;
    const assignedTo = (req.query as any).assignedTo;
    const deals = await B2BSalesCenterService.getBulkDeals(dealStatus, assignedTo);
    return reply.send(deals);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch bulk deals' });
  }
}

// PATCH /b2b/bulk-deals/:dealId
export async function updateBulkDeal(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { dealId } = req.params as any;
    const data = req.body as any;
    const deal = await B2BSalesCenterService.updateBulkDeal(dealId, data);
    return reply.send(deal);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to update bulk deal' });
  }
}

// PATCH /b2b/bulk-deals/:dealId/status
export async function updateBulkDealStatus(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { dealId } = req.params as any;
    const { dealStatus } = req.body as any;
    const deal = await B2BSalesCenterService.updateBulkDealStatus(dealId, dealStatus);
    return reply.send(deal);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to update deal status' });
  }
}

// POST /b2b/proposals
export async function createProposal(req: FastifyRequest, reply: FastifyReply) {
  try {
    const data = req.body as any;
    const proposal = await B2BSalesCenterService.createProposal(data);
    return reply.send(proposal);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to create proposal' });
  }
}

// GET /b2b/proposals
export async function getProposals(req: FastifyRequest, reply: FastifyReply) {
  try {
    const dealId = (req.query as any).dealId;
    const status = (req.query as any).status;
    const proposals = await B2BSalesCenterService.getProposals(dealId, status);
    return reply.send(proposals);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch proposals' });
  }
}

// PATCH /b2b/proposals/:proposalId
export async function updateProposal(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { proposalId } = req.params as any;
    const data = req.body as any;
    const proposal = await B2BSalesCenterService.updateProposal(proposalId, data);
    return reply.send(proposal);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to update proposal' });
  }
}

// PATCH /b2b/proposals/:proposalId/status
export async function updateProposalStatus(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { proposalId } = req.params as any;
    const { status } = req.body as any;
    const proposal = await B2BSalesCenterService.updateProposalStatus(proposalId, status);
    return reply.send(proposal);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to update proposal status' });
  }
}

// POST /b2b/quotations
export async function createQuotation(req: FastifyRequest, reply: FastifyReply) {
  try {
    const data = req.body as any;
    const quotation = await B2BSalesCenterService.createQuotation(data);
    return reply.send(quotation);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to create quotation' });
  }
}

// GET /b2b/quotations
export async function getQuotations(req: FastifyRequest, reply: FastifyReply) {
  try {
    const dealId = (req.query as any).dealId;
    const status = (req.query as any).status;
    const quotations = await B2BSalesCenterService.getQuotations(dealId, status);
    return reply.send(quotations);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch quotations' });
  }
}

// PATCH /b2b/quotations/:quotationId
export async function updateQuotation(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { quotationId } = req.params as any;
    const data = req.body as any;
    const quotation = await B2BSalesCenterService.updateQuotation(quotationId, data);
    return reply.send(quotation);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to update quotation' });
  }
}

// PATCH /b2b/quotations/:quotationId/status
export async function updateQuotationStatus(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { quotationId } = req.params as any;
    const { status } = req.body as any;
    const quotation = await B2BSalesCenterService.updateQuotationStatus(quotationId, status);
    return reply.send(quotation);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to update quotation status' });
  }
}

// POST /b2b/contracts
export async function createContract(req: FastifyRequest, reply: FastifyReply) {
  try {
    const data = req.body as any;
    const contract = await B2BSalesCenterService.createContract(data);
    return reply.send(contract);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to create contract' });
  }
}

// GET /b2b/contracts
export async function getContracts(req: FastifyRequest, reply: FastifyReply) {
  try {
    const dealId = (req.query as any).dealId;
    const status = (req.query as any).status;
    const contracts = await B2BSalesCenterService.getContracts(dealId, status);
    return reply.send(contracts);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch contracts' });
  }
}

// PATCH /b2b/contracts/:contractId
export async function updateContract(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { contractId } = req.params as any;
    const data = req.body as any;
    const contract = await B2BSalesCenterService.updateContract(contractId, data);
    return reply.send(contract);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to update contract' });
  }
}

// PATCH /b2b/contracts/:contractId/status
export async function updateContractStatus(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { contractId } = req.params as any;
    const { status } = req.body as any;
    const contract = await B2BSalesCenterService.updateContractStatus(contractId, status);
    return reply.send(contract);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to update contract status' });
  }
}

// POST /b2b/deal-pipeline
export async function createDealPipeline(req: FastifyRequest, reply: FastifyReply) {
  try {
    const data = req.body as any;
    const pipeline = await B2BSalesCenterService.createDealPipeline(data);
    return reply.send(pipeline);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to create deal pipeline' });
  }
}

// GET /b2b/deal-pipeline
export async function getDealPipelines(req: FastifyRequest, reply: FastifyReply) {
  try {
    const dealId = (req.query as any).dealId;
    const stage = (req.query as any).stage;
    const pipelines = await B2BSalesCenterService.getDealPipelines(dealId, stage);
    return reply.send(pipelines);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch deal pipelines' });
  }
}

// PATCH /b2b/deal-pipeline/:pipelineId
export async function updateDealPipeline(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { pipelineId } = req.params as any;
    const data = req.body as any;
    const pipeline = await B2BSalesCenterService.updateDealPipeline(pipelineId, data);
    return reply.send(pipeline);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to update deal pipeline' });
  }
}

// PATCH /b2b/deal-pipeline/:pipelineId/move
export async function moveDealStage(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { pipelineId } = req.params as any;
    const { stage, probability } = req.body as any;
    const pipeline = await B2BSalesCenterService.moveDealStage(pipelineId, stage, probability);
    return reply.send(pipeline);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to move deal stage' });
  }
}

// GET /b2b/analytics
export async function getB2BSalesAnalytics(req: FastifyRequest, reply: FastifyReply) {
  try {
    const assignedTo = (req.query as any).assignedTo;
    const analytics = await B2BSalesCenterService.getB2BSalesAnalytics(assignedTo);
    return reply.send(analytics);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch B2B sales analytics' });
  }
}

export function b2bSalesCenterRoutes(fastify: FastifyInstance) {
  // Corporate Leads
  fastify.post('/b2b/corporate-leads', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, createCorporateLead);
  fastify.get('/b2b/corporate-leads', { preHandler: [fastify.authenticate] }, getCorporateLeads);
  fastify.patch('/b2b/corporate-leads/:leadId', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, updateCorporateLead);
  fastify.patch('/b2b/corporate-leads/:leadId/status', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, updateCorporateLeadStatus);
  
  // Enterprise Leads
  fastify.post('/b2b/enterprise-leads', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, createEnterpriseLead);
  fastify.get('/b2b/enterprise-leads', { preHandler: [fastify.authenticate] }, getEnterpriseLeads);
  fastify.patch('/b2b/enterprise-leads/:leadId', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, updateEnterpriseLead);
  fastify.patch('/b2b/enterprise-leads/:leadId/status', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, updateEnterpriseLeadStatus);
  
  // Bulk Deals
  fastify.post('/b2b/bulk-deals', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, createBulkDeal);
  fastify.get('/b2b/bulk-deals', { preHandler: [fastify.authenticate] }, getBulkDeals);
  fastify.patch('/b2b/bulk-deals/:dealId', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, updateBulkDeal);
  fastify.patch('/b2b/bulk-deals/:dealId/status', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, updateBulkDealStatus);
  
  // Proposals
  fastify.post('/b2b/proposals', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, createProposal);
  fastify.get('/b2b/proposals', { preHandler: [fastify.authenticate] }, getProposals);
  fastify.patch('/b2b/proposals/:proposalId', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, updateProposal);
  fastify.patch('/b2b/proposals/:proposalId/status', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, updateProposalStatus);
  
  // Quotations
  fastify.post('/b2b/quotations', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, createQuotation);
  fastify.get('/b2b/quotations', { preHandler: [fastify.authenticate] }, getQuotations);
  fastify.patch('/b2b/quotations/:quotationId', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, updateQuotation);
  fastify.patch('/b2b/quotations/:quotationId/status', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, updateQuotationStatus);
  
  // Contracts
  fastify.post('/b2b/contracts', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, createContract);
  fastify.get('/b2b/contracts', { preHandler: [fastify.authenticate] }, getContracts);
  fastify.patch('/b2b/contracts/:contractId', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, updateContract);
  fastify.patch('/b2b/contracts/:contractId/status', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, updateContractStatus);
  
  // Deal Pipeline
  fastify.post('/b2b/deal-pipeline', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, createDealPipeline);
  fastify.get('/b2b/deal-pipeline', { preHandler: [fastify.authenticate] }, getDealPipelines);
  fastify.patch('/b2b/deal-pipeline/:pipelineId', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, updateDealPipeline);
  fastify.patch('/b2b/deal-pipeline/:pipelineId/move', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, moveDealStage);
  
  // Analytics
  fastify.get('/b2b/analytics', { preHandler: [fastify.authenticate] }, getB2BSalesAnalytics);
}
