// ============================================================
// FORM BUILDER ROUTES
// API endpoints for form management
// ============================================================

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { FormBuilderService } from '../services/form.builder.service';

// POST /forms
export async function createFormDefinition(req: FastifyRequest, reply: FastifyReply) {
  try {
    const data = req.body as any;
    const form = await FormBuilderService.createFormDefinition(data);
    return reply.send(form);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to create form' });
  }
}

// GET /forms
export async function getFormDefinitions(req: FastifyRequest, reply: FastifyReply) {
  try {
    const type = (req.query as any).type;
    const publishedOnly = (req.query as any).publishedOnly === 'true';
    
    const forms = await FormBuilderService.getFormDefinitions(type, publishedOnly);
    return reply.send(forms);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch forms' });
  }
}

// GET /forms/:formId
export async function getFormDefinition(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { formId } = req.params as any;
    const form = await FormBuilderService.getFormDefinition(formId);
    return reply.send(form);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to fetch form' });
  }
}

// PATCH /forms/:formId
export async function updateFormDefinition(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { formId } = req.params as any;
    const data = req.body as any;
    const form = await FormBuilderService.updateFormDefinition(formId, data);
    return reply.send(form);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to update form' });
  }
}

// DELETE /forms/:formId
export async function deleteFormDefinition(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { formId } = req.params as any;
    const form = await FormBuilderService.deleteFormDefinition(formId);
    return reply.send(form);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to delete form' });
  }
}

// POST /forms/:formId/publish
export async function publishForm(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { formId } = req.params as any;
    const form = await FormBuilderService.publishForm(formId);
    return reply.send(form);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to publish form' });
  }
}

// POST /forms/:formId/unpublish
export async function unpublishForm(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { formId } = req.params as any;
    const form = await FormBuilderService.unpublishForm(formId);
    return reply.send(form);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to unpublish form' });
  }
}

// POST /forms/:formId/enable
export async function enableForm(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { formId } = req.params as any;
    const form = await FormBuilderService.enableForm(formId);
    return reply.send(form);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to enable form' });
  }
}

// POST /forms/:formId/disable
export async function disableForm(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { formId } = req.params as any;
    const form = await FormBuilderService.disableForm(formId);
    return reply.send(form);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to disable form' });
  }
}

// POST /forms/:formId/submit
export async function submitForm(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { formId } = req.params as any;
    const userId = (req as any).user?.id || null;
    const data = req.body as any;
    
    const submission = await FormBuilderService.submitForm(formId, userId, data);
    return reply.send(submission);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to submit form' });
  }
}

// GET /forms/submissions
export async function getFormSubmissions(req: FastifyRequest, reply: FastifyReply) {
  try {
    const formId = (req.query as any).formId;
    const status = (req.query as any).status;
    const limit = parseInt((req.query as any).limit || '50');
    
    const submissions = await FormBuilderService.getFormSubmissions(formId, status, limit);
    return reply.send(submissions);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch form submissions' });
  }
}

// GET /forms/submissions/:submissionId
export async function getFormSubmission(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { submissionId } = req.params as any;
    const submission = await FormBuilderService.getFormSubmission(submissionId);
    return reply.send(submission);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to fetch form submission' });
  }
}

// POST /forms/submissions/:submissionId/review
export async function reviewSubmission(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { submissionId } = req.params as any;
    const reviewerId = (req as any).user.id;
    const { status, notes } = req.body as any;
    
    const submission = await FormBuilderService.reviewSubmission(submissionId, reviewerId, status, notes);
    return reply.send(submission);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to review submission' });
  }
}

// POST /forms/submissions/:submissionId/approve
export async function approveSubmission(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { submissionId } = req.params as any;
    const reviewerId = (req as any).user.id;
    const { notes } = req.body as any;
    
    const submission = await FormBuilderService.approveSubmission(submissionId, reviewerId, notes);
    return reply.send(submission);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to approve submission' });
  }
}

// POST /forms/submissions/:submissionId/reject
export async function rejectSubmission(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { submissionId } = req.params as any;
    const reviewerId = (req as any).user.id;
    const { notes } = req.body as any;
    
    const submission = await FormBuilderService.rejectSubmission(submissionId, reviewerId, notes);
    return reply.send(submission);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to reject submission' });
  }
}

// GET /forms/statistics
export async function getFormStatistics(req: FastifyRequest, reply: FastifyReply) {
  try {
    const formId = (req.query as any).formId;
    const stats = await FormBuilderService.getFormStatistics(formId);
    return reply.send(stats);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch form statistics' });
  }
}

export function formBuilderRoutes(fastify: FastifyInstance) {
  fastify.post('/forms', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, createFormDefinition);
  fastify.get('/forms', { preHandler: [fastify.authenticate] }, getFormDefinitions);
  fastify.get('/forms/:formId', { preHandler: [fastify.authenticate] }, getFormDefinition);
  fastify.patch('/forms/:formId', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, updateFormDefinition);
  fastify.delete('/forms/:formId', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, deleteFormDefinition);
  
  fastify.post('/forms/:formId/publish', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, publishForm);
  fastify.post('/forms/:formId/unpublish', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, unpublishForm);
  fastify.post('/forms/:formId/enable', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, enableForm);
  fastify.post('/forms/:formId/disable', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, disableForm);
  
  fastify.post('/forms/:formId/submit', { preHandler: [fastify.authenticate] }, submitForm);
  
  fastify.get('/forms/submissions', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, getFormSubmissions);
  fastify.get('/forms/submissions/:submissionId', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, getFormSubmission);
  fastify.post('/forms/submissions/:submissionId/review', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, reviewSubmission);
  fastify.post('/forms/submissions/:submissionId/approve', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, approveSubmission);
  fastify.post('/forms/submissions/:submissionId/reject', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, rejectSubmission);
  
  fastify.get('/forms/statistics', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, getFormStatistics);
}
