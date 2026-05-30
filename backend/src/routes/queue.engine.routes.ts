// ============================================================
// QUEUE ENGINE ROUTES
// API endpoints for queue management
// ============================================================

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { QueueEngineService } from '../services/queue.engine.service';

// POST /queues/jobs
export async function addJob(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { queue, type, data, options } = req.body as any;
    
    if (!queue || !type || !data) {
      return reply.status(400).send({ error: 'queue, type, and data are required' });
    }

    const job = await QueueEngineService.addJob(queue, type, data, options);
    return reply.send(job);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to add job' });
  }
}

// GET /queues/jobs/:jobId
export async function getJob(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { jobId } = req.params as any;
    const job = await QueueEngineService.getJob(jobId);
    return reply.send(job);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to fetch job' });
  }
}

// POST /queues/jobs/:jobId/complete
export async function completeJob(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { jobId } = req.params as any;
    const { result } = req.body as any;
    
    const job = await QueueEngineService.completeJob(jobId, result);
    return reply.send(job);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to complete job' });
  }
}

// POST /queues/jobs/:jobId/fail
export async function failJob(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { jobId } = req.params as any;
    const { error, errorMessage } = req.body as any;
    
    if (!error) {
      return reply.status(400).send({ error: 'error is required' });
    }

    const job = await QueueEngineService.failJob(jobId, error, errorMessage);
    return reply.send(job);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to fail job' });
  }
}

// POST /queues/jobs/:jobId/cancel
export async function cancelJob(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { jobId } = req.params as any;
    const job = await QueueEngineService.cancelJob(jobId);
    return reply.send(job);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to cancel job' });
  }
}

// GET /queues/statistics
export async function getQueueStatistics(req: FastifyRequest, reply: FastifyReply) {
  try {
    const queue = (req.query as any).queue;
    const stats = await QueueEngineService.getQueueStatistics(queue);
    return reply.send(stats);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch queue statistics' });
  }
}

// GET /queues/jobs
export async function getJobsByStatus(req: FastifyRequest, reply: FastifyReply) {
  try {
    const status = (req.query as any).status;
    const queue = (req.query as any).queue;
    const limit = parseInt((req.query as any).limit || '50');
    
    if (!status) {
      return reply.status(400).send({ error: 'status is required' });
    }

    const jobs = await QueueEngineService.getJobsByStatus(status, queue, limit);
    return reply.send(jobs);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to fetch jobs' });
  }
}

// POST /queues/retry-failed
export async function retryFailedJobs(req: FastifyRequest, reply: FastifyReply) {
  try {
    const queue = (req.query as any).queue;
    const result = await QueueEngineService.retryFailedJobs(queue);
    return reply.send(result);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to retry failed jobs' });
  }
}

// POST /queues/cleanup
export async function cleanupOldJobs(req: FastifyRequest, reply: FastifyReply) {
  try {
    const daysToKeep = parseInt((req.body as any).daysToKeep || '7');
    const result = await QueueEngineService.cleanupOldJobs(daysToKeep);
    return reply.send(result);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to cleanup old jobs' });
  }
}

// POST /queues/email
export async function addEmailJob(req: FastifyRequest, reply: FastifyReply) {
  try {
    const data = req.body as any;
    const options = (req.body as any).options;
    const job = await QueueEngineService.addEmailJob(data, options);
    return reply.send(job);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to add email job' });
  }
}

// POST /queues/notification
export async function addNotificationJob(req: FastifyRequest, reply: FastifyReply) {
  try {
    const data = req.body as any;
    const options = (req.body as any).options;
    const job = await QueueEngineService.addNotificationJob(data, options);
    return reply.send(job);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to add notification job' });
  }
}

// POST /queues/license
export async function addLicenseJob(req: FastifyRequest, reply: FastifyReply) {
  try {
    const data = req.body as any;
    const options = (req.body as any).options;
    const job = await QueueEngineService.addLicenseJob(data, options);
    return reply.send(job);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to add license job' });
  }
}

// POST /queues/webhook
export async function addWebhookJob(req: FastifyRequest, reply: FastifyReply) {
  try {
    const data = req.body as any;
    const options = (req.body as any).options;
    const job = await QueueEngineService.addWebhookJob(data, options);
    return reply.send(job);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to add webhook job' });
  }
}

// POST /queues/payout
export async function addPayoutJob(req: FastifyRequest, reply: FastifyReply) {
  try {
    const data = req.body as any;
    const options = (req.body as any).options;
    const job = await QueueEngineService.addPayoutJob(data, options);
    return reply.send(job);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to add payout job' });
  }
}

// POST /queues/report
export async function addReportJob(req: FastifyRequest, reply: FastifyReply) {
  try {
    const data = req.body as any;
    const options = (req.body as any).options;
    const job = await QueueEngineService.addReportJob(data, options);
    return reply.send(job);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to add report job' });
  }
}

export function queueEngineRoutes(fastify: FastifyInstance) {
  fastify.post('/queues/jobs', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, addJob);
  fastify.get('/queues/jobs/:jobId', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, getJob);
  fastify.post('/queues/jobs/:jobId/complete', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, completeJob);
  fastify.post('/queues/jobs/:jobId/fail', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, failJob);
  fastify.post('/queues/jobs/:jobId/cancel', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, cancelJob);
  
  fastify.get('/queues/statistics', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, getQueueStatistics);
  fastify.get('/queues/jobs', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, getJobsByStatus);
  
  fastify.post('/queues/retry-failed', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, retryFailedJobs);
  fastify.post('/queues/cleanup', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, cleanupOldJobs);
  
  fastify.post('/queues/email', { preHandler: [fastify.authenticate] }, addEmailJob);
  fastify.post('/queues/notification', { preHandler: [fastify.authenticate] }, addNotificationJob);
  fastify.post('/queues/license', { preHandler: [fastify.authenticate] }, addLicenseJob);
  fastify.post('/queues/webhook', { preHandler: [fastify.authenticate] }, addWebhookJob);
  fastify.post('/queues/payout', { preHandler: [fastify.authenticate] }, addPayoutJob);
  fastify.post('/queues/report', { preHandler: [fastify.authenticate] }, addReportJob);
}
