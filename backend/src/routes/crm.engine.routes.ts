// ============================================================
// CRM ENGINE ROUTES
// API endpoints for CRM management
// ============================================================

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { CRMEngineService } from '../services/crm.engine.service';

// POST /crm/contacts
export async function createContact(req: FastifyRequest, reply: FastifyReply) {
  try {
    const data = req.body as any;
    const contact = await CRMEngineService.createContact(data);
    return reply.send(contact);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to create contact' });
  }
}

// GET /crm/contacts
export async function getContacts(req: FastifyRequest, reply: FastifyReply) {
  try {
    const type = (req.query as any).type;
    const tags = (req.query as any).tags?.split(',').filter((t: string) => t);
    
    const contacts = await CRMEngineService.getContacts(type, tags);
    return reply.send(contacts);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch contacts' });
  }
}

// GET /crm/contacts/:contactId
export async function getContact(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { contactId } = req.params as any;
    const contact = await CRMEngineService.getContact(contactId);
    return reply.send(contact);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to fetch contact' });
  }
}

// PATCH /crm/contacts/:contactId
export async function updateContact(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { contactId } = req.params as any;
    const data = req.body as any;
    const contact = await CRMEngineService.updateContact(contactId, data);
    return reply.send(contact);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to update contact' });
  }
}

// POST /crm/pipeline-stages
export async function createPipelineStage(req: FastifyRequest, reply: FastifyReply) {
  try {
    const data = req.body as any;
    const stage = await CRMEngineService.createPipelineStage(data);
    return reply.send(stage);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to create pipeline stage' });
  }
}

// GET /crm/pipeline-stages
export async function getPipelineStages(req: FastifyRequest, reply: FastifyReply) {
  try {
    const stages = await CRMEngineService.getPipelineStages();
    return reply.send(stages);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch pipeline stages' });
  }
}

// POST /crm/opportunities
export async function createOpportunity(req: FastifyRequest, reply: FastifyReply) {
  try {
    const data = req.body as any;
    const opportunity = await CRMEngineService.createOpportunity(data);
    return reply.send(opportunity);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to create opportunity' });
  }
}

// GET /crm/opportunities
export async function getOpportunities(req: FastifyRequest, reply: FastifyReply) {
  try {
    const contactId = (req.query as any).contactId;
    const stageId = (req.query as any).stageId;
    const status = (req.query as any).status;
    
    const opportunities = await CRMEngineService.getOpportunities(contactId, stageId, status);
    return reply.send(opportunities);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch opportunities' });
  }
}

// PATCH /crm/opportunities/:opportunityId
export async function updateOpportunity(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { opportunityId } = req.params as any;
    const data = req.body as any;
    const opportunity = await CRMEngineService.updateOpportunity(opportunityId, data);
    return reply.send(opportunity);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to update opportunity' });
  }
}

// POST /crm/follow-ups
export async function createFollowUp(req: FastifyRequest, reply: FastifyReply) {
  try {
    const data = req.body as any;
    const followUp = await CRMEngineService.createFollowUp(data);
    return reply.send(followUp);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to create follow-up' });
  }
}

// GET /crm/follow-ups
export async function getFollowUps(req: FastifyRequest, reply: FastifyReply) {
  try {
    const contactId = (req.query as any).contactId;
    const status = (req.query as any).status;
    const assignedTo = (req.query as any).assignedTo;
    
    const followUps = await CRMEngineService.getFollowUps(contactId, status, assignedTo);
    return reply.send(followUps);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch follow-ups' });
  }
}

// POST /crm/follow-ups/:followUpId/complete
export async function completeFollowUp(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { followUpId } = req.params as any;
    const followUp = await CRMEngineService.completeFollowUp(followUpId);
    return reply.send(followUp);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to complete follow-up' });
  }
}

// POST /crm/meeting-notes
export async function createMeetingNote(req: FastifyRequest, reply: FastifyReply) {
  try {
    const data = req.body as any;
    const note = await CRMEngineService.createMeetingNote(data);
    return reply.send(note);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to create meeting note' });
  }
}

// GET /crm/meeting-notes
export async function getMeetingNotes(req: FastifyRequest, reply: FastifyReply) {
  try {
    const contactId = (req.query as any).contactId;
    const notes = await CRMEngineService.getMeetingNotes(contactId);
    return reply.send(notes);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch meeting notes' });
  }
}

// POST /crm/call-notes
export async function createCallNote(req: FastifyRequest, reply: FastifyReply) {
  try {
    const data = req.body as any;
    const note = await CRMEngineService.createCallNote(data);
    return reply.send(note);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to create call note' });
  }
}

// GET /crm/call-notes
export async function getCallNotes(req: FastifyRequest, reply: FastifyReply) {
  try {
    const contactId = (req.query as any).contactId;
    const notes = await CRMEngineService.getCallNotes(contactId);
    return reply.send(notes);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch call notes' });
  }
}

// POST /crm/tasks
export async function createTask(req: FastifyRequest, reply: FastifyReply) {
  try {
    const data = req.body as any;
    const task = await CRMEngineService.createTask(data);
    return reply.send(task);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to create task' });
  }
}

// GET /crm/tasks
export async function getTasks(req: FastifyRequest, reply: FastifyReply) {
  try {
    const assignedTo = (req.query as any).assignedTo;
    const status = (req.query as any).status;
    const contactId = (req.query as any).contactId;
    
    const tasks = await CRMEngineService.getTasks(assignedTo, status, contactId);
    return reply.send(tasks);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch tasks' });
  }
}

// POST /crm/tasks/:taskId/complete
export async function completeTask(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { taskId } = req.params as any;
    const task = await CRMEngineService.completeTask(taskId);
    return reply.send(task);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to complete task' });
  }
}

// POST /crm/customer-journey
export async function createCustomerJourney(req: FastifyRequest, reply: FastifyReply) {
  try {
    const data = req.body as any;
    const journey = await CRMEngineService.createCustomerJourney(data);
    return reply.send(journey);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to create customer journey' });
  }
}

// GET /crm/customer-journey/:contactId
export async function getCustomerJourney(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { contactId } = req.params as any;
    const journey = await CRMEngineService.getCustomerJourney(contactId);
    return reply.send(journey);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to fetch customer journey' });
  }
}

// POST /crm/health-score/:contactId
export async function calculateHealthScore(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { contactId } = req.params as any;
    const healthScore = await CRMEngineService.calculateHealthScore(contactId);
    return reply.send(healthScore);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to calculate health score' });
  }
}

// GET /crm/health-score/:contactId
export async function getHealthScore(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { contactId } = req.params as any;
    const healthScore = await CRMEngineService.getHealthScore(contactId);
    return reply.send(healthScore);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to fetch health score' });
  }
}

// POST /crm/lost-customer-recovery
export async function createLostCustomerRecovery(req: FastifyRequest, reply: FastifyReply) {
  try {
    const data = req.body as any;
    const recovery = await CRMEngineService.createLostCustomerRecovery(data);
    return reply.send(recovery);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to create lost customer recovery' });
  }
}

// POST /crm/lost-customer-recovery/:recoveryId/attempt
export async function attemptRecovery(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { recoveryId } = req.params as any;
    const recovery = await CRMEngineService.attemptRecovery(recoveryId);
    return reply.send(recovery);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to attempt recovery' });
  }
}

// POST /crm/lost-customer-recovery/:recoveryId/recovered
export async function markRecovered(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { recoveryId } = req.params as any;
    const recovery = await CRMEngineService.markRecovered(recoveryId);
    return reply.send(recovery);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to mark as recovered' });
  }
}

// POST /crm/vip-customers
export async function createVIPCustomer(req: FastifyRequest, reply: FastifyReply) {
  try {
    const data = req.body as any;
    const vip = await CRMEngineService.createVIPCustomer(data);
    return reply.send(vip);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to create VIP customer' });
  }
}

// GET /crm/vip-customers
export async function getVIPCustomers(req: FastifyRequest, reply: FastifyReply) {
  try {
    const tier = (req.query as any).tier;
    const vips = await CRMEngineService.getVIPCustomers(tier);
    return reply.send(vips);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch VIP customers' });
  }
}

// GET /crm/statistics
export async function getCRMStatistics(req: FastifyRequest, reply: FastifyReply) {
  try {
    const stats = await CRMEngineService.getCRMStatistics();
    return reply.send(stats);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch CRM statistics' });
  }
}

export function crmEngineRoutes(fastify: FastifyInstance) {
  fastify.post('/crm/contacts', { preHandler: [fastify.authenticate] }, createContact);
  fastify.get('/crm/contacts', { preHandler: [fastify.authenticate] }, getContacts);
  fastify.get('/crm/contacts/:contactId', { preHandler: [fastify.authenticate] }, getContact);
  fastify.patch('/crm/contacts/:contactId', { preHandler: [fastify.authenticate] }, updateContact);
  
  fastify.post('/crm/pipeline-stages', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, createPipelineStage);
  fastify.get('/crm/pipeline-stages', { preHandler: [fastify.authenticate] }, getPipelineStages);
  
  fastify.post('/crm/opportunities', { preHandler: [fastify.authenticate] }, createOpportunity);
  fastify.get('/crm/opportunities', { preHandler: [fastify.authenticate] }, getOpportunities);
  fastify.patch('/crm/opportunities/:opportunityId', { preHandler: [fastify.authenticate] }, updateOpportunity);
  
  fastify.post('/crm/follow-ups', { preHandler: [fastify.authenticate] }, createFollowUp);
  fastify.get('/crm/follow-ups', { preHandler: [fastify.authenticate] }, getFollowUps);
  fastify.post('/crm/follow-ups/:followUpId/complete', { preHandler: [fastify.authenticate] }, completeFollowUp);
  
  fastify.post('/crm/meeting-notes', { preHandler: [fastify.authenticate] }, createMeetingNote);
  fastify.get('/crm/meeting-notes', { preHandler: [fastify.authenticate] }, getMeetingNotes);
  
  fastify.post('/crm/call-notes', { preHandler: [fastify.authenticate] }, createCallNote);
  fastify.get('/crm/call-notes', { preHandler: [fastify.authenticate] }, getCallNotes);
  
  fastify.post('/crm/tasks', { preHandler: [fastify.authenticate] }, createTask);
  fastify.get('/crm/tasks', { preHandler: [fastify.authenticate] }, getTasks);
  fastify.post('/crm/tasks/:taskId/complete', { preHandler: [fastify.authenticate] }, completeTask);
  
  fastify.post('/crm/customer-journey', { preHandler: [fastify.authenticate] }, createCustomerJourney);
  fastify.get('/crm/customer-journey/:contactId', { preHandler: [fastify.authenticate] }, getCustomerJourney);
  
  fastify.post('/crm/health-score/:contactId', { preHandler: [fastify.authenticate] }, calculateHealthScore);
  fastify.get('/crm/health-score/:contactId', { preHandler: [fastify.authenticate] }, getHealthScore);
  
  fastify.post('/crm/lost-customer-recovery', { preHandler: [fastify.authenticate] }, createLostCustomerRecovery);
  fastify.post('/crm/lost-customer-recovery/:recoveryId/attempt', { preHandler: [fastify.authenticate] }, attemptRecovery);
  fastify.post('/crm/lost-customer-recovery/:recoveryId/recovered', { preHandler: [fastify.authenticate] }, markRecovered);
  
  fastify.post('/crm/vip-customers', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, createVIPCustomer);
  fastify.get('/crm/vip-customers', { preHandler: [fastify.authenticate] }, getVIPCustomers);
  
  fastify.get('/crm/statistics', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, getCRMStatistics);
}
