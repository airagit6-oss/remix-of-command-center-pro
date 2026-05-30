// ============================================================
// AUTOMATION PLATFORM ROUTES
// API endpoints for automation management
// ============================================================

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { AutomationPlatformService } from '../services/automation.platform.service';

// POST /automation/workflows
export async function createWorkflow(req: FastifyRequest, reply: FastifyReply) {
  try {
    const data = req.body as any;
    const workflow = await AutomationPlatformService.createWorkflow(data);
    return reply.send(workflow);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to create workflow' });
  }
}

// GET /automation/workflows
export async function getWorkflows(req: FastifyRequest, reply: FastifyReply) {
  try {
    const enabledOnly = (req.query as any).enabledOnly === 'true';
    const workflows = await AutomationPlatformService.getWorkflows(enabledOnly);
    return reply.send(workflows);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch workflows' });
  }
}

// GET /automation/workflows/:workflowId
export async function getWorkflow(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { workflowId } = req.params as any;
    const workflow = await AutomationPlatformService.getWorkflow(workflowId);
    return reply.send(workflow);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to fetch workflow' });
  }
}

// PATCH /automation/workflows/:workflowId
export async function updateWorkflow(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { workflowId } = req.params as any;
    const data = req.body as any;
    const workflow = await AutomationPlatformService.updateWorkflow(workflowId, data);
    return reply.send(workflow);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to update workflow' });
  }
}

// POST /automation/workflows/:workflowId/toggle
export async function toggleWorkflow(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { workflowId } = req.params as any;
    const { enabled } = req.body as any;
    const workflow = await AutomationPlatformService.toggleWorkflow(workflowId, enabled);
    return reply.send(workflow);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to toggle workflow' });
  }
}

// POST /automation/workflows/:workflowId/execute
export async function executeWorkflow(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { workflowId } = req.params as any;
    const { triggeredBy, triggerData } = req.body as any;
    const execution = await AutomationPlatformService.executeWorkflow(workflowId, triggeredBy, triggerData);
    return reply.send(execution);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to execute workflow' });
  }
}

// GET /automation/executions
export async function getWorkflowExecutions(req: FastifyRequest, reply: FastifyReply) {
  try {
    const workflowId = (req.query as any).workflowId;
    const status = (req.query as any).status;
    const executions = await AutomationPlatformService.getWorkflowExecutions(workflowId, status);
    return reply.send(executions);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch executions' });
  }
}

// POST /automation/triggers
export async function createTrigger(req: FastifyRequest, reply: FastifyReply) {
  try {
    const data = req.body as any;
    const trigger = await AutomationPlatformService.createTrigger(data);
    return reply.send(trigger);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to create trigger' });
  }
}

// GET /automation/triggers
export async function getTriggers(req: FastifyRequest, reply: FastifyReply) {
  try {
    const type = (req.query as any).type;
    const triggers = await AutomationPlatformService.getTriggers(type);
    return reply.send(triggers);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch triggers' });
  }
}

// POST /automation/conditions
export async function createCondition(req: FastifyRequest, reply: FastifyReply) {
  try {
    const data = req.body as any;
    const condition = await AutomationPlatformService.createCondition(data);
    return reply.send(condition);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to create condition' });
  }
}

// GET /automation/conditions
export async function getConditions(req: FastifyRequest, reply: FastifyReply) {
  try {
    const type = (req.query as any).type;
    const conditions = await AutomationPlatformService.getConditions(type);
    return reply.send(conditions);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch conditions' });
  }
}

// POST /automation/actions
export async function createAction(req: FastifyRequest, reply: FastifyReply) {
  try {
    const data = req.body as any;
    const action = await AutomationPlatformService.createAction(data);
    return reply.send(action);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to create action' });
  }
}

// GET /automation/actions
export async function getActions(req: FastifyRequest, reply: FastifyReply) {
  try {
    const type = (req.query as any).type;
    const actions = await AutomationPlatformService.getActions(type);
    return reply.send(actions);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch actions' });
  }
}

// POST /automation/assignment-rules
export async function createAssignmentRule(req: FastifyRequest, reply: FastifyReply) {
  try {
    const data = req.body as any;
    const rule = await AutomationPlatformService.createAssignmentRule(data);
    return reply.send(rule);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to create assignment rule' });
  }
}

// GET /automation/assignment-rules
export async function getAssignmentRules(req: FastifyRequest, reply: FastifyReply) {
  try {
    const entityType = (req.query as any).entityType;
    const rules = await AutomationPlatformService.getAssignmentRules(entityType);
    return reply.send(rules);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch assignment rules' });
  }
}

// POST /automation/assignment-rules/apply
export async function applyAssignment(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { entityType, entityId } = req.body as any;
    const data = req.body as any;
    const result = await AutomationPlatformService.applyAssignment(entityType, entityId, data);
    return reply.send(result);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to apply assignment' });
  }
}

// POST /automation/follow-up-rules
export async function createFollowUpRule(req: FastifyRequest, reply: FastifyReply) {
  try {
    const data = req.body as any;
    const rule = await AutomationPlatformService.createFollowUpRule(data);
    return reply.send(rule);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to create follow-up rule' });
  }
}

// GET /automation/follow-up-rules
export async function getFollowUpRules(req: FastifyRequest, reply: FastifyReply) {
  try {
    const entityType = (req.query as any).entityType;
    const rules = await AutomationPlatformService.getFollowUpRules(entityType);
    return reply.send(rules);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch follow-up rules' });
  }
}

// POST /automation/reminder-rules
export async function createReminderRule(req: FastifyRequest, reply: FastifyReply) {
  try {
    const data = req.body as any;
    const rule = await AutomationPlatformService.createReminderRule(data);
    return reply.send(rule);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to create reminder rule' });
  }
}

// GET /automation/reminder-rules
export async function getReminderRules(req: FastifyRequest, reply: FastifyReply) {
  try {
    const reminderType = (req.query as any).reminderType;
    const rules = await AutomationPlatformService.getReminderRules(reminderType);
    return reply.send(rules);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch reminder rules' });
  }
}

// POST /automation/escalation-rules
export async function createEscalationRule(req: FastifyRequest, reply: FastifyReply) {
  try {
    const data = req.body as any;
    const rule = await AutomationPlatformService.createEscalationRule(data);
    return reply.send(rule);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to create escalation rule' });
  }
}

// GET /automation/escalation-rules
export async function getEscalationRules(req: FastifyRequest, reply: FastifyReply) {
  try {
    const entityType = (req.query as any).entityType;
    const rules = await AutomationPlatformService.getEscalationRules(entityType);
    return reply.send(rules);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch escalation rules' });
  }
}

// POST /automation/renewal-rules
export async function createRenewalRule(req: FastifyRequest, reply: FastifyReply) {
  try {
    const data = req.body as any;
    const rule = await AutomationPlatformService.createRenewalRule(data);
    return reply.send(rule);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to create renewal rule' });
  }
}

// GET /automation/renewal-rules
export async function getRenewalRules(req: FastifyRequest, reply: FastifyReply) {
  try {
    const entityType = (req.query as any).entityType;
    const rules = await AutomationPlatformService.getRenewalRules(entityType);
    return reply.send(rules);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch renewal rules' });
  }
}

// POST /automation/notification-rules
export async function createNotificationRule(req: FastifyRequest, reply: FastifyReply) {
  try {
    const data = req.body as any;
    const rule = await AutomationPlatformService.createNotificationRule(data);
    return reply.send(rule);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to create notification rule' });
  }
}

// GET /automation/notification-rules
export async function getNotificationRules(req: FastifyRequest, reply: FastifyReply) {
  try {
    const eventType = (req.query as any).eventType;
    const rules = await AutomationPlatformService.getNotificationRules(eventType);
    return reply.send(rules);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch notification rules' });
  }
}

// POST /automation/notification-rules/trigger
export async function triggerNotification(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { eventType } = req.body as any;
    const data = req.body as any;
    const result = await AutomationPlatformService.triggerNotification(eventType, data);
    return reply.send(result);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to trigger notification' });
  }
}

// POST /automation/payout-rules
export async function createPayoutRule(req: FastifyRequest, reply: FastifyReply) {
  try {
    const data = req.body as any;
    const rule = await AutomationPlatformService.createPayoutRule(data);
    return reply.send(rule);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to create payout rule' });
  }
}

// GET /automation/payout-rules
export async function getPayoutRules(req: FastifyRequest, reply: FastifyReply) {
  try {
    const entityType = (req.query as any).entityType;
    const rules = await AutomationPlatformService.getPayoutRules(entityType);
    return reply.send(rules);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch payout rules' });
  }
}

// POST /automation/approval-rules
export async function createApprovalRule(req: FastifyRequest, reply: FastifyReply) {
  try {
    const data = req.body as any;
    const rule = await AutomationPlatformService.createApprovalRule(data);
    return reply.send(rule);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to create approval rule' });
  }
}

// GET /automation/approval-rules
export async function getApprovalRules(req: FastifyRequest, reply: FastifyReply) {
  try {
    const entityType = (req.query as any).entityType;
    const rules = await AutomationPlatformService.getApprovalRules(entityType);
    return reply.send(rules);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch approval rules' });
  }
}

// POST /automation/approval-rules/check
export async function checkAutoApproval(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { entityType } = req.body as any;
    const data = req.body as any;
    const result = await AutomationPlatformService.checkAutoApproval(entityType, data);
    return reply.send(result);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to check auto approval' });
  }
}

// GET /automation/statistics
export async function getAutomationStatistics(req: FastifyRequest, reply: FastifyReply) {
  try {
    const stats = await AutomationPlatformService.getAutomationStatistics();
    return reply.send(stats);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch automation statistics' });
  }
}

export function automationPlatformRoutes(fastify: FastifyInstance) {
  // Workflows
  fastify.post('/automation/workflows', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, createWorkflow);
  fastify.get('/automation/workflows', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, getWorkflows);
  fastify.get('/automation/workflows/:workflowId', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, getWorkflow);
  fastify.patch('/automation/workflows/:workflowId', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, updateWorkflow);
  fastify.post('/automation/workflows/:workflowId/toggle', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, toggleWorkflow);
  fastify.post('/automation/workflows/:workflowId/execute', { preHandler: [fastify.authenticate] }, executeWorkflow);
  
  // Executions
  fastify.get('/automation/executions', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, getWorkflowExecutions);
  
  // Builder Components
  fastify.post('/automation/triggers', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, createTrigger);
  fastify.get('/automation/triggers', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, getTriggers);
  fastify.post('/automation/conditions', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, createCondition);
  fastify.get('/automation/conditions', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, getConditions);
  fastify.post('/automation/actions', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, createAction);
  fastify.get('/automation/actions', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, getActions);
  
  // Auto Assignment
  fastify.post('/automation/assignment-rules', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, createAssignmentRule);
  fastify.get('/automation/assignment-rules', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, getAssignmentRules);
  fastify.post('/automation/assignment-rules/apply', { preHandler: [fastify.authenticate] }, applyAssignment);
  
  // Auto Follow Up
  fastify.post('/automation/follow-up-rules', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, createFollowUpRule);
  fastify.get('/automation/follow-up-rules', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, getFollowUpRules);
  
  // Auto Reminder
  fastify.post('/automation/reminder-rules', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, createReminderRule);
  fastify.get('/automation/reminder-rules', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, getReminderRules);
  
  // Auto Escalation
  fastify.post('/automation/escalation-rules', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, createEscalationRule);
  fastify.get('/automation/escalation-rules', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, getEscalationRules);
  
  // Auto Renewal
  fastify.post('/automation/renewal-rules', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, createRenewalRule);
  fastify.get('/automation/renewal-rules', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, getRenewalRules);
  
  // Auto Notification
  fastify.post('/automation/notification-rules', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, createNotificationRule);
  fastify.get('/automation/notification-rules', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, getNotificationRules);
  fastify.post('/automation/notification-rules/trigger', { preHandler: [fastify.authenticate] }, triggerNotification);
  
  // Auto Payout
  fastify.post('/automation/payout-rules', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, createPayoutRule);
  fastify.get('/automation/payout-rules', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, getPayoutRules);
  
  // Auto Approval
  fastify.post('/automation/approval-rules', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, createApprovalRule);
  fastify.get('/automation/approval-rules', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, getApprovalRules);
  fastify.post('/automation/approval-rules/check', { preHandler: [fastify.authenticate] }, checkAutoApproval);
  
  // Statistics
  fastify.get('/automation/statistics', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, getAutomationStatistics);
}
