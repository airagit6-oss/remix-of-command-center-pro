// ============================================================
// PRODUCT APPROVAL WORKFLOW ROUTES
// API endpoints for product approval management
// ============================================================

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { ProductApprovalService } from '../services/product.approval.service';

// POST /product-approvals
export async function createApproval(req: FastifyRequest, reply: FastifyReply) {
  try {
    const data = req.body as any;
    const approval = await ProductApprovalService.createApproval(data);
    return reply.send(approval);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to create approval' });
  }
}

// GET /product-approvals
export async function getApprovals(req: FastifyRequest, reply: FastifyReply) {
  try {
    const productId = (req.query as any).productId;
    const status = (req.query as any).status;
    const submittedBy = (req.query as any).submittedBy;
    const approvals = await ProductApprovalService.getApprovals(productId, status, submittedBy);
    return reply.send(approvals);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch approvals' });
  }
}

// GET /product-approvals/:approvalId
export async function getApproval(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { approvalId } = req.params as any;
    const approval = await ProductApprovalService.getApproval(approvalId);
    return reply.send(approval);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to fetch approval' });
  }
}

// POST /product-approvals/:approvalId/submit
export async function submitForReview(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { approvalId } = req.params as any;
    const { submittedBy } = req.body as any;
    const approval = await ProductApprovalService.submitForReview(approvalId, submittedBy);
    return reply.send(approval);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to submit for review' });
  }
}

// POST /product-approvals/:approvalId/approve
export async function approveProduct(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { approvalId } = req.params as any;
    const { reviewedBy } = req.body as any;
    const approval = await ProductApprovalService.approveProduct(approvalId, reviewedBy);
    return reply.send(approval);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to approve product' });
  }
}

// POST /product-approvals/:approvalId/reject
export async function rejectProduct(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { approvalId } = req.params as any;
    const { reviewedBy, rejectionReason } = req.body as any;
    const approval = await ProductApprovalService.rejectProduct(approvalId, reviewedBy, rejectionReason);
    return reply.send(approval);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to reject product' });
  }
}

// POST /product-approvals/:approvalId/request-changes
export async function requestChanges(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { approvalId } = req.params as any;
    const { reviewedBy, changeRequests } = req.body as any;
    const approval = await ProductApprovalService.requestChanges(approvalId, reviewedBy, changeRequests);
    return reply.send(approval);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to request changes' });
  }
}

// POST /product-approvals/:approvalId/publish
export async function publishProduct(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { approvalId } = req.params as any;
    const approval = await ProductApprovalService.publishProduct(approvalId);
    return reply.send(approval);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to publish product' });
  }
}

// POST /product-approvals/:approvalId/archive
export async function archiveProduct(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { approvalId } = req.params as any;
    const approval = await ProductApprovalService.archiveProduct(approvalId);
    return reply.send(approval);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to archive product' });
  }
}

// GET /product-approvals/statistics
export async function getApprovalStatistics(req: FastifyRequest, reply: FastifyReply) {
  try {
    const stats = await ProductApprovalService.getApprovalStatistics();
    return reply.send(stats);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch statistics' });
  }
}

export function productApprovalRoutes(fastify: FastifyInstance) {
  fastify.post('/product-approvals', { preHandler: [fastify.authenticate] }, createApproval);
  fastify.get('/product-approvals', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, getApprovals);
  fastify.get('/product-approvals/:approvalId', { preHandler: [fastify.authenticate] }, getApproval);
  fastify.post('/product-approvals/:approvalId/submit', { preHandler: [fastify.authenticate] }, submitForReview);
  fastify.post('/product-approvals/:approvalId/approve', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, approveProduct);
  fastify.post('/product-approvals/:approvalId/reject', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, rejectProduct);
  fastify.post('/product-approvals/:approvalId/request-changes', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, requestChanges);
  fastify.post('/product-approvals/:approvalId/publish', { preHandler: [fastify.authenticate] }, publishProduct);
  fastify.post('/product-approvals/:approvalId/archive', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, archiveProduct);
  fastify.get('/product-approvals/statistics', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, getApprovalStatistics);
}
