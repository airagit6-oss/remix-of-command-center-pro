// ============================================================
// PRODUCT HEALTH CENTER ROUTES
// API endpoints for product health management
// ============================================================

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { ProductHealthCenterService } from '../services/product.health.center.service';

// POST /product-health/crash-reports
export async function createCrashReport(req: FastifyRequest, reply: FastifyReply) {
  try {
    const data = req.body as any;
    const crash = await ProductHealthCenterService.createCrashReport(data);
    return reply.send(crash);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to create crash report' });
  }
}

// GET /product-health/crash-reports
export async function getCrashReports(req: FastifyRequest, reply: FastifyReply) {
  try {
    const productId = (req.query as any).productId;
    const status = (req.query as any).status;
    const version = (req.query as any).version;
    const crashes = await ProductHealthCenterService.getCrashReports(productId, status, version);
    return reply.send(crashes);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch crash reports' });
  }
}

// PATCH /product-health/crash-reports/:crashId/status
export async function updateCrashStatus(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { crashId } = req.params as any;
    const { status } = req.body as any;
    const crash = await ProductHealthCenterService.updateCrashStatus(crashId, status);
    return reply.send(crash);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to update crash status' });
  }
}

// POST /product-health/bug-reports
export async function createProductBugReport(req: FastifyRequest, reply: FastifyReply) {
  try {
    const data = req.body as any;
    const bug = await ProductHealthCenterService.createProductBugReport(data);
    return reply.send(bug);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to create bug report' });
  }
}

// GET /product-health/bug-reports
export async function getProductBugReports(req: FastifyRequest, reply: FastifyReply) {
  try {
    const productId = (req.query as any).productId;
    const status = (req.query as any).status;
    const severity = (req.query as any).severity;
    const bugs = await ProductHealthCenterService.getProductBugReports(productId, status, severity);
    return reply.send(bugs);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch bug reports' });
  }
}

// PATCH /product-health/bug-reports/:bugId/status
export async function updateBugStatus(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { bugId } = req.params as any;
    const { status, assignedTo } = req.body as any;
    const bug = await ProductHealthCenterService.updateBugStatus(bugId, status, assignedTo);
    return reply.send(bug);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to update bug status' });
  }
}

// POST /product-health/issues
export async function createIssue(req: FastifyRequest, reply: FastifyReply) {
  try {
    const data = req.body as any;
    const issue = await ProductHealthCenterService.createIssue(data);
    return reply.send(issue);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to create issue' });
  }
}

// GET /product-health/issues
export async function getIssues(req: FastifyRequest, reply: FastifyReply) {
  try {
    const productId = (req.query as any).productId;
    const status = (req.query as any).status;
    const type = (req.query as any).type;
    const issues = await ProductHealthCenterService.getIssues(productId, status, type);
    return reply.send(issues);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch issues' });
  }
}

// PATCH /product-health/issues/:issueId/status
export async function updateIssueStatus(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { issueId } = req.params as any;
    const { status, assignedTo } = req.body as any;
    const issue = await ProductHealthCenterService.updateIssueStatus(issueId, status, assignedTo);
    return reply.send(issue);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to update issue status' });
  }
}

// POST /product-health/known-issues
export async function createKnownIssue(req: FastifyRequest, reply: FastifyReply) {
  try {
    const data = req.body as any;
    const knownIssue = await ProductHealthCenterService.createKnownIssue(data);
    return reply.send(knownIssue);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to create known issue' });
  }
}

// GET /product-health/known-issues
export async function getKnownIssues(req: FastifyRequest, reply: FastifyReply) {
  try {
    const productId = (req.query as any).productId;
    const status = (req.query as any).status;
    const version = (req.query as any).version;
    const knownIssues = await ProductHealthCenterService.getKnownIssues(productId, status, version);
    return reply.send(knownIssues);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch known issues' });
  }
}

// PATCH /product-health/known-issues/:issueId/status
export async function updateKnownIssueStatus(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { issueId } = req.params as any;
    const { status, fixedInVersion } = req.body as any;
    const knownIssue = await ProductHealthCenterService.updateKnownIssueStatus(issueId, status, fixedInVersion);
    return reply.send(knownIssue);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to update known issue status' });
  }
}

// POST /product-health/version-health
export async function createVersionHealth(req: FastifyRequest, reply: FastifyReply) {
  try {
    const data = req.body as any;
    const health = await ProductHealthCenterService.createVersionHealth(data);
    return reply.send(health);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to create version health' });
  }
}

// GET /product-health/version-health
export async function getVersionHealth(req: FastifyRequest, reply: FastifyReply) {
  try {
    const productId = (req.query as any).productId;
    const version = (req.query as any).version;
    const health = await ProductHealthCenterService.getVersionHealth(productId, version);
    return reply.send(health);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch version health' });
  }
}

// PATCH /product-health/version-health/:healthId
export async function updateVersionHealth(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { healthId } = req.params as any;
    const data = req.body as any;
    const health = await ProductHealthCenterService.updateVersionHealth(healthId, data);
    return reply.send(health);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to update version health' });
  }
}

// POST /product-health/user-complaints
export async function createUserComplaint(req: FastifyRequest, reply: FastifyReply) {
  try {
    const data = req.body as any;
    const complaint = await ProductHealthCenterService.createUserComplaint(data);
    return reply.send(complaint);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to create user complaint' });
  }
}

// GET /product-health/user-complaints
export async function getUserComplaints(req: FastifyRequest, reply: FastifyReply) {
  try {
    const productId = (req.query as any).productId;
    const userId = (req.query as any).userId;
    const status = (req.query as any).status;
    const complaints = await ProductHealthCenterService.getUserComplaints(productId, userId, status);
    return reply.send(complaints);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch user complaints' });
  }
}

// PATCH /product-health/user-complaints/:complaintId/status
export async function updateComplaintStatus(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { complaintId } = req.params as any;
    const { status, resolvedBy } = req.body as any;
    const complaint = await ProductHealthCenterService.updateComplaintStatus(complaintId, status, resolvedBy);
    return reply.send(complaint);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to update complaint status' });
  }
}

// GET /product-health/statistics
export async function getProductHealthStatistics(req: FastifyRequest, reply: FastifyReply) {
  try {
    const productId = (req.query as any).productId;
    const stats = await ProductHealthCenterService.getProductHealthStatistics(productId);
    return reply.send(stats);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch statistics' });
  }
}

export function productHealthCenterRoutes(fastify: FastifyInstance) {
  // Crash Reports
  fastify.post('/product-health/crash-reports', { preHandler: [fastify.authenticate] }, createCrashReport);
  fastify.get('/product-health/crash-reports', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, getCrashReports);
  fastify.patch('/product-health/crash-reports/:crashId/status', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, updateCrashStatus);
  
  // Bug Reports
  fastify.post('/product-health/bug-reports', { preHandler: [fastify.authenticate] }, createProductBugReport);
  fastify.get('/product-health/bug-reports', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, getProductBugReports);
  fastify.patch('/product-health/bug-reports/:bugId/status', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, updateBugStatus);
  
  // Issues
  fastify.post('/product-health/issues', { preHandler: [fastify.authenticate] }, createIssue);
  fastify.get('/product-health/issues', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, getIssues);
  fastify.patch('/product-health/issues/:issueId/status', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, updateIssueStatus);
  
  // Known Issues
  fastify.post('/product-health/known-issues', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, createKnownIssue);
  fastify.get('/product-health/known-issues', { preHandler: [fastify.authenticate] }, getKnownIssues);
  fastify.patch('/product-health/known-issues/:issueId/status', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, updateKnownIssueStatus);
  
  // Version Health
  fastify.post('/product-health/version-health', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, createVersionHealth);
  fastify.get('/product-health/version-health', { preHandler: [fastify.authenticate] }, getVersionHealth);
  fastify.patch('/product-health/version-health/:healthId', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, updateVersionHealth);
  
  // User Complaints
  fastify.post('/product-health/user-complaints', { preHandler: [fastify.authenticate] }, createUserComplaint);
  fastify.get('/product-health/user-complaints', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, getUserComplaints);
  fastify.patch('/product-health/user-complaints/:complaintId/status', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, updateComplaintStatus);
  
  // Statistics
  fastify.get('/product-health/statistics', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, getProductHealthStatistics);
}
