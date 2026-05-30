// ============================================================
// JOB SCHEDULER ROUTES
// API endpoints for job scheduling
// ============================================================

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { JobSchedulerService } from '../services/job.scheduler.service';

// POST /scheduler/jobs
export async function createScheduledJob(req: FastifyRequest, reply: FastifyReply) {
  try {
    const data = req.body as any;
    const job = await JobSchedulerService.createScheduledJob(data);
    return reply.send(job);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to create scheduled job' });
  }
}

// GET /scheduler/jobs
export async function getAllScheduledJobs(req: FastifyRequest, reply: FastifyReply) {
  try {
    const jobs = await JobSchedulerService.getAllScheduledJobs();
    return reply.send(jobs);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch scheduled jobs' });
  }
}

// GET /scheduler/jobs/:jobId
export async function getScheduledJob(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { jobId } = req.params as any;
    const job = await JobSchedulerService.getScheduledJob(jobId);
    return reply.send(job);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to fetch scheduled job' });
  }
}

// PATCH /scheduler/jobs/:jobId
export async function updateScheduledJob(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { jobId } = req.params as any;
    const data = req.body as any;
    const job = await JobSchedulerService.updateScheduledJob(jobId, data);
    return reply.send(job);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to update scheduled job' });
  }
}

// DELETE /scheduler/jobs/:jobId
export async function deleteScheduledJob(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { jobId } = req.params as any;
    const job = await JobSchedulerService.deleteScheduledJob(jobId);
    return reply.send(job);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to delete scheduled job' });
  }
}

// POST /scheduler/jobs/:jobId/execute
export async function executeJob(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { jobId } = req.params as any;
    const result = await JobSchedulerService.executeJob(jobId);
    return reply.send(result);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to execute job' });
  }
}

// POST /scheduler/jobs/:jobId/enable
export async function enableScheduledJob(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { jobId } = req.params as any;
    const job = await JobSchedulerService.enableScheduledJob(jobId);
    return reply.send(job);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to enable scheduled job' });
  }
}

// POST /scheduler/jobs/:jobId/disable
export async function disableScheduledJob(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { jobId } = req.params as any;
    const job = await JobSchedulerService.disableScheduledJob(jobId);
    return reply.send(job);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to disable scheduled job' });
  }
}

// GET /scheduler/due-jobs
export async function getDueJobs(req: FastifyRequest, reply: FastifyReply) {
  try {
    const jobs = await JobSchedulerService.getDueJobs();
    return reply.send(jobs);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch due jobs' });
  }
}

// GET /scheduler/statistics
export async function getJobStatistics(req: FastifyRequest, reply: FastifyReply) {
  try {
    const stats = await JobSchedulerService.getJobStatistics();
    return reply.send(stats);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch job statistics' });
  }
}

export function jobSchedulerRoutes(fastify: FastifyInstance) {
  fastify.post('/scheduler/jobs', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, createScheduledJob);
  fastify.get('/scheduler/jobs', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, getAllScheduledJobs);
  fastify.get('/scheduler/jobs/:jobId', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, getScheduledJob);
  fastify.patch('/scheduler/jobs/:jobId', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, updateScheduledJob);
  fastify.delete('/scheduler/jobs/:jobId', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, deleteScheduledJob);
  
  fastify.post('/scheduler/jobs/:jobId/execute', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, executeJob);
  fastify.post('/scheduler/jobs/:jobId/enable', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, enableScheduledJob);
  fastify.post('/scheduler/jobs/:jobId/disable', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, disableScheduledJob);
  
  fastify.get('/scheduler/due-jobs', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, getDueJobs);
  fastify.get('/scheduler/statistics', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, getJobStatistics);
}
