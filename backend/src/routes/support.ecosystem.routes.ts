// ============================================================
// SUPPORT ECOSYSTEM ROUTES
// API endpoints for support management
// ============================================================

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { SupportEcosystemService } from '../services/support.ecosystem.service';

// POST /support/tickets
export async function createTicket(req: FastifyRequest, reply: FastifyReply) {
  try {
    const data = req.body as any;
    const ticket = await SupportEcosystemService.createTicket(data);
    return reply.send(ticket);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to create ticket' });
  }
}

// GET /support/tickets
export async function getTickets(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req.query as any).userId;
    const assignedTo = (req.query as any).assignedTo;
    const status = (req.query as any).status;
    const category = (req.query as any).category;
    
    const tickets = await SupportEcosystemService.getTickets(userId, assignedTo, status, category);
    return reply.send(tickets);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch tickets' });
  }
}

// GET /support/tickets/:ticketId
export async function getTicket(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { ticketId } = req.params as any;
    const ticket = await SupportEcosystemService.getTicket(ticketId);
    return reply.send(ticket);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to fetch ticket' });
  }
}

// PATCH /support/tickets/:ticketId
export async function updateTicket(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { ticketId } = req.params as any;
    const data = req.body as any;
    const ticket = await SupportEcosystemService.updateTicket(ticketId, data);
    return reply.send(ticket);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to update ticket' });
  }
}

// POST /support/tickets/:ticketId/assign
export async function assignTicket(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { ticketId } = req.params as any;
    const { assignedTo } = req.body as any;
    const ticket = await SupportEcosystemService.assignTicket(ticketId, assignedTo);
    return reply.send(ticket);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to assign ticket' });
  }
}

// POST /support/tickets/:ticketId/resolve
export async function resolveTicket(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { ticketId } = req.params as any;
    const { resolution } = req.body as any;
    const ticket = await SupportEcosystemService.resolveTicket(ticketId, resolution);
    return reply.send(ticket);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to resolve ticket' });
  }
}

// POST /support/tickets/:ticketId/messages
export async function addTicketMessage(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { ticketId } = req.params as any;
    const data = req.body as any;
    const message = await SupportEcosystemService.addTicketMessage({ ...data, ticketId });
    return reply.send(message);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to add message' });
  }
}

// POST /support/chat/sessions
export async function createChatSession(req: FastifyRequest, reply: FastifyReply) {
  try {
    const data = req.body as any;
    const session = await SupportEcosystemService.createChatSession(data);
    return reply.send(session);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to create chat session' });
  }
}

// POST /support/chat/sessions/:sessionId/assign
export async function assignChatAgent(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { sessionId } = req.params as any;
    const { agentId } = req.body as any;
    const session = await SupportEcosystemService.assignChatAgent(sessionId, agentId);
    return reply.send(session);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to assign agent' });
  }
}

// POST /support/chat/sessions/:sessionId/messages
export async function addChatMessage(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { sessionId } = req.params as any;
    const data = req.body as any;
    const message = await SupportEcosystemService.addChatMessage({ ...data, sessionId });
    return reply.send(message);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to add message' });
  }
}

// POST /support/chat/sessions/:sessionId/close
export async function closeChatSession(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { sessionId } = req.params as any;
    const session = await SupportEcosystemService.closeChatSession(sessionId);
    return reply.send(session);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to close session' });
  }
}

// POST /support/knowledge-base
export async function createKBArticle(req: FastifyRequest, reply: FastifyReply) {
  try {
    const data = req.body as any;
    const article = await SupportEcosystemService.createKBArticle(data);
    return reply.send(article);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to create article' });
  }
}

// GET /support/knowledge-base
export async function getKBArticles(req: FastifyRequest, reply: FastifyReply) {
  try {
    const category = (req.query as any).category;
    const publishedOnly = (req.query as any).publishedOnly !== 'false';
    
    const articles = await SupportEcosystemService.getKBArticles(category, publishedOnly);
    return reply.send(articles);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch articles' });
  }
}

// GET /support/knowledge-base/:slug
export async function getKBArticle(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { slug } = req.params as any;
    const article = await SupportEcosystemService.getKBArticle(slug);
    return reply.send(article);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to fetch article' });
  }
}

// POST /support/knowledge-base/:articleId/helpful
export async function markKBHelpful(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { articleId } = req.params as any;
    const article = await SupportEcosystemService.markKBHelpful(articleId);
    return reply.send(article);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to mark helpful' });
  }
}

// POST /support/forum/posts
export async function createForumPost(req: FastifyRequest, reply: FastifyReply) {
  try {
    const data = req.body as any;
    const post = await SupportEcosystemService.createForumPost(data);
    return reply.send(post);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to create post' });
  }
}

// GET /support/forum/posts
export async function getForumPosts(req: FastifyRequest, reply: FastifyReply) {
  try {
    const category = (req.query as any).category;
    const status = (req.query as any).status;
    
    const posts = await SupportEcosystemService.getForumPosts(category, status);
    return reply.send(posts);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch posts' });
  }
}

// GET /support/forum/posts/:postId
export async function getForumPost(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { postId } = req.params as any;
    const post = await SupportEcosystemService.getForumPost(postId);
    return reply.send(post);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to fetch post' });
  }
}

// POST /support/forum/posts/:postId/comments
export async function addForumComment(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { postId } = req.params as any;
    const data = req.body as any;
    const comment = await SupportEcosystemService.addForumComment({ ...data, postId });
    return reply.send(comment);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to add comment' });
  }
}

// POST /support/bug-reports
export async function createBugReport(req: FastifyRequest, reply: FastifyReply) {
  try {
    const data = req.body as any;
    const bugReport = await SupportEcosystemService.createBugReport(data);
    return reply.send(bugReport);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to create bug report' });
  }
}

// GET /support/bug-reports
export async function getBugReports(req: FastifyRequest, reply: FastifyReply) {
  try {
    const status = (req.query as any).status;
    const severity = (req.query as any).severity;
    
    const bugReports = await SupportEcosystemService.getBugReports(status, severity);
    return reply.send(bugReports);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch bug reports' });
  }
}

// PATCH /support/bug-reports/:bugReportId
export async function updateBugReport(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { bugReportId } = req.params as any;
    const data = req.body as any;
    const bugReport = await SupportEcosystemService.updateBugReport(bugReportId, data);
    return reply.send(bugReport);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to update bug report' });
  }
}

// POST /support/feature-requests
export async function createFeatureRequest(req: FastifyRequest, reply: FastifyReply) {
  try {
    const data = req.body as any;
    const featureRequest = await SupportEcosystemService.createFeatureRequest(data);
    return reply.send(featureRequest);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to create feature request' });
  }
}

// GET /support/feature-requests
export async function getFeatureRequests(req: FastifyRequest, reply: FastifyReply) {
  try {
    const status = (req.query as any).status;
    const category = (req.query as any).category;
    
    const featureRequests = await SupportEcosystemService.getFeatureRequests(status, category);
    return reply.send(featureRequests);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch feature requests' });
  }
}

// POST /support/feature-requests/:requestId/vote
export async function voteFeatureRequest(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { requestId } = req.params as any;
    const { userId } = req.body as any;
    const featureRequest = await SupportEcosystemService.voteFeatureRequest(requestId, userId);
    return reply.send(featureRequest);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to vote' });
  }
}

// PATCH /support/feature-requests/:requestId/status
export async function updateFeatureStatus(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { requestId } = req.params as any;
    const { status, plannedFor } = req.body as any;
    const featureRequest = await SupportEcosystemService.updateFeatureStatus(requestId, status, plannedFor);
    return reply.send(featureRequest);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to update status' });
  }
}

// POST /support/roadmap
export async function createRoadmapItem(req: FastifyRequest, reply: FastifyReply) {
  try {
    const data = req.body as any;
    const item = await SupportEcosystemService.createRoadmapItem(data);
    return reply.send(item);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to create roadmap item' });
  }
}

// GET /support/roadmap
export async function getRoadmapItems(req: FastifyRequest, reply: FastifyReply) {
  try {
    const category = (req.query as any).category;
    const status = (req.query as any).status;
    
    const items = await SupportEcosystemService.getRoadmapItems(category, status);
    return reply.send(items);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch roadmap items' });
  }
}

// PATCH /support/roadmap/:itemId
export async function updateRoadmapItem(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { itemId } = req.params as any;
    const data = req.body as any;
    const item = await SupportEcosystemService.updateRoadmapItem(itemId, data);
    return reply.send(item);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to update roadmap item' });
  }
}

// POST /support/feedback
export async function createFeedback(req: FastifyRequest, reply: FastifyReply) {
  try {
    const data = req.body as any;
    const feedback = await SupportEcosystemService.createFeedback(data);
    return reply.send(feedback);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to create feedback' });
  }
}

// GET /support/feedback
export async function getFeedback(req: FastifyRequest, reply: FastifyReply) {
  try {
    const type = (req.query as any).type;
    const productId = (req.query as any).productId;
    
    const feedback = await SupportEcosystemService.getFeedback(type, productId);
    return reply.send(feedback);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch feedback' });
  }
}

// POST /support/sla-policies
export async function createSLAPolicy(req: FastifyRequest, reply: FastifyReply) {
  try {
    const data = req.body as any;
    const policy = await SupportEcosystemService.createSLAPolicy(data);
    return reply.send(policy);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to create SLA policy' });
  }
}

// GET /support/sla-policies
export async function getSLAPolicies(req: FastifyRequest, reply: FastifyReply) {
  try {
    const category = (req.query as any).category;
    const policies = await SupportEcosystemService.getSLAPolicies(category);
    return reply.send(policies);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch SLA policies' });
  }
}

// PATCH /support/sla-policies/:policyId
export async function updateSLAPolicy(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { policyId } = req.params as any;
    const data = req.body as any;
    const policy = await SupportEcosystemService.updateSLAPolicy(policyId, data);
    return reply.send(policy);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to update SLA policy' });
  }
}

// POST /support/escalation-rules
export async function createEscalationRule(req: FastifyRequest, reply: FastifyReply) {
  try {
    const data = req.body as any;
    const rule = await SupportEcosystemService.createEscalationRule(data);
    return reply.send(rule);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to create escalation rule' });
  }
}

// GET /support/escalation-rules
export async function getEscalationRules(req: FastifyRequest, reply: FastifyReply) {
  try {
    const category = (req.query as any).category;
    const priority = (req.query as any).priority;
    const rules = await SupportEcosystemService.getEscalationRules(category, priority);
    return reply.send(rules);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch escalation rules' });
  }
}

// POST /support/check-escalations
export async function checkEscalations(req: FastifyRequest, reply: FastifyReply) {
  try {
    const result = await SupportEcosystemService.checkEscalations();
    return reply.send(result);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to check escalations' });
  }
}

// POST /support/check-sla-breaches
export async function checkSLABreaches(req: FastifyRequest, reply: FastifyReply) {
  try {
    const result = await SupportEcosystemService.checkSLABreaches();
    return reply.send(result);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to check SLA breaches' });
  }
}

// GET /support/statistics
export async function getSupportStatistics(req: FastifyRequest, reply: FastifyReply) {
  try {
    const stats = await SupportEcosystemService.getSupportStatistics();
    return reply.send(stats);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch support statistics' });
  }
}

export function supportEcosystemRoutes(fastify: FastifyInstance) {
  // Tickets
  fastify.post('/support/tickets', { preHandler: [fastify.authenticate] }, createTicket);
  fastify.get('/support/tickets', { preHandler: [fastify.authenticate] }, getTickets);
  fastify.get('/support/tickets/:ticketId', { preHandler: [fastify.authenticate] }, getTicket);
  fastify.patch('/support/tickets/:ticketId', { preHandler: [fastify.authenticate] }, updateTicket);
  fastify.post('/support/tickets/:ticketId/assign', { preHandler: [fastify.authenticate] }, assignTicket);
  fastify.post('/support/tickets/:ticketId/resolve', { preHandler: [fastify.authenticate] }, resolveTicket);
  fastify.post('/support/tickets/:ticketId/messages', { preHandler: [fastify.authenticate] }, addTicketMessage);
  
  // Live Chat
  fastify.post('/support/chat/sessions', { preHandler: [fastify.authenticate] }, createChatSession);
  fastify.post('/support/chat/sessions/:sessionId/assign', { preHandler: [fastify.authenticate] }, assignChatAgent);
  fastify.post('/support/chat/sessions/:sessionId/messages', { preHandler: [fastify.authenticate] }, addChatMessage);
  fastify.post('/support/chat/sessions/:sessionId/close', { preHandler: [fastify.authenticate] }, closeChatSession);
  
  // Knowledge Base
  fastify.post('/support/knowledge-base', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, createKBArticle);
  fastify.get('/support/knowledge-base', getKBArticles);
  fastify.get('/support/knowledge-base/:slug', getKBArticle);
  fastify.post('/support/knowledge-base/:articleId/helpful', { preHandler: [fastify.authenticate] }, markKBHelpful);
  
  // Forum
  fastify.post('/support/forum/posts', { preHandler: [fastify.authenticate] }, createForumPost);
  fastify.get('/support/forum/posts', getForumPosts);
  fastify.get('/support/forum/posts/:postId', getForumPost);
  fastify.post('/support/forum/posts/:postId/comments', { preHandler: [fastify.authenticate] }, addForumComment);
  
  // Bug Reports
  fastify.post('/support/bug-reports', { preHandler: [fastify.authenticate] }, createBugReport);
  fastify.get('/support/bug-reports', { preHandler: [fastify.authenticate] }, getBugReports);
  fastify.patch('/support/bug-reports/:bugReportId', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, updateBugReport);
  
  // Feature Requests
  fastify.post('/support/feature-requests', { preHandler: [fastify.authenticate] }, createFeatureRequest);
  fastify.get('/support/feature-requests', getFeatureRequests);
  fastify.post('/support/feature-requests/:requestId/vote', { preHandler: [fastify.authenticate] }, voteFeatureRequest);
  fastify.patch('/support/feature-requests/:requestId/status', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, updateFeatureStatus);
  
  // Roadmap
  fastify.post('/support/roadmap', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, createRoadmapItem);
  fastify.get('/support/roadmap', getRoadmapItems);
  fastify.patch('/support/roadmap/:itemId', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, updateRoadmapItem);
  
  // Feedback
  fastify.post('/support/feedback', { preHandler: [fastify.authenticate] }, createFeedback);
  fastify.get('/support/feedback', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, getFeedback);
  
  // SLA Policies
  fastify.post('/support/sla-policies', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, createSLAPolicy);
  fastify.get('/support/sla-policies', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, getSLAPolicies);
  fastify.patch('/support/sla-policies/:policyId', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, updateSLAPolicy);
  
  // Escalation Rules
  fastify.post('/support/escalation-rules', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, createEscalationRule);
  fastify.get('/support/escalation-rules', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, getEscalationRules);
  
  // Automation
  fastify.post('/support/check-escalations', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, checkEscalations);
  fastify.post('/support/check-sla-breaches', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, checkSLABreaches);
  
  // Statistics
  fastify.get('/support/statistics', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, getSupportStatistics);
}
