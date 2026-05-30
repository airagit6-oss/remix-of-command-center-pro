// ============================================================
// DOWNLOAD SECURITY ROUTES
// API endpoints for download security
// ============================================================

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DownloadSecurityService } from '../services/download.security.service';

// POST /downloads/one-time/:licenseId
export async function createOneTimeDownloadUrl(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req as any).user.id;
    const { licenseId } = req.params as any;
    const ipAddress = req.ip;
    const userAgent = req.headers['user-agent'];
    
    const result = await DownloadSecurityService.createOneTimeDownloadUrl(licenseId, userId, ipAddress, userAgent);
    return reply.send(result);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to create download URL' });
  }
}

// POST /downloads/expiring/:licenseId
export async function createExpiringDownloadUrl(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req as any).user.id;
    const { licenseId } = req.params as any;
    const { expiryMinutes } = req.body as any;
    const ipAddress = req.ip;
    const userAgent = req.headers['user-agent'];
    
    const result = await DownloadSecurityService.createExpiringDownloadUrl(
      licenseId,
      userId,
      expiryMinutes || 60,
      ipAddress,
      userAgent
    );
    return reply.send(result);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to create download URL' });
  }
}

// GET /downloads/license/:token
export async function downloadLicense(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { token } = req.params as any;
    const ipAddress = req.ip;
    const userAgent = req.headers['user-agent'];
    
    const result = await DownloadSecurityService.processDownload(token, ipAddress, userAgent);
    return reply.send(result);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to process download' });
  }
}

// GET /downloads/audit/:licenseId
export async function getDownloadAuditLog(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { licenseId } = req.params as any;
    const limit = parseInt((req.query as any).limit || '50');
    
    const auditLog = await DownloadSecurityService.getDownloadAuditLog(licenseId, limit);
    return reply.send(auditLog);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to fetch audit log' });
  }
}

// GET /downloads/statistics/:licenseId
export async function getDownloadStatistics(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { licenseId } = req.params as any;
    const stats = await DownloadSecurityService.getDownloadStatistics(licenseId);
    return reply.send(stats);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to fetch download statistics' });
  }
}

// POST /downloads/reset/:licenseId
export async function resetDownloadCount(req: FastifyRequest, reply: FastifyReply) {
  try {
    const adminId = (req as any).user.id;
    const { licenseId } = req.params as any;
    
    const license = await DownloadSecurityService.resetDownloadCount(licenseId, adminId);
    return reply.send(license);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to reset download count' });
  }
}

// POST /downloads/bind-ip/:licenseId
export async function setIPBinding(req: FastifyRequest, reply: FastifyReply) {
  try {
    const adminId = (req as any).user.id;
    const { licenseId } = req.params as any;
    const { ipAddress } = req.body as any;
    
    if (!ipAddress) {
      return reply.status(400).send({ error: 'ipAddress is required' });
    }

    const license = await DownloadSecurityService.setIPBinding(licenseId, ipAddress, adminId);
    return reply.send(license);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to set IP binding' });
  }
}

// POST /downloads/bind-device/:licenseId
export async function setDeviceBinding(req: FastifyRequest, reply: FastifyReply) {
  try {
    const adminId = (req as any).user.id;
    const { licenseId } = req.params as any;
    const { userAgent } = req.body as any;
    
    if (!userAgent) {
      return reply.status(400).send({ error: 'userAgent is required' });
    }

    const license = await DownloadSecurityService.setDeviceBinding(licenseId, userAgent, adminId);
    return reply.send(license);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to set device binding' });
  }
}

// POST /downloads/bind-domain/:licenseId
export async function setDomainBinding(req: FastifyRequest, reply: FastifyReply) {
  try {
    const adminId = (req as any).user.id;
    const { licenseId } = req.params as any;
    const { domain } = req.body as any;
    
    if (!domain) {
      return reply.status(400).send({ error: 'domain is required' });
    }

    const license = await DownloadSecurityService.setDomainBinding(licenseId, domain, adminId);
    return reply.send(license);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to set domain binding' });
  }
}

export function downloadSecurityRoutes(fastify: FastifyInstance) {
  fastify.post('/downloads/one-time/:licenseId', { preHandler: [fastify.authenticate] }, createOneTimeDownloadUrl);
  fastify.post('/downloads/expiring/:licenseId', { preHandler: [fastify.authenticate] }, createExpiringDownloadUrl);
  fastify.get('/downloads/license/:token', downloadLicense);
  
  fastify.get('/downloads/audit/:licenseId', { preHandler: [fastify.authenticate] }, getDownloadAuditLog);
  fastify.get('/downloads/statistics/:licenseId', { preHandler: [fastify.authenticate] }, getDownloadStatistics);
  
  fastify.post('/downloads/reset/:licenseId', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, resetDownloadCount);
  fastify.post('/downloads/bind-ip/:licenseId', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, setIPBinding);
  fastify.post('/downloads/bind-device/:licenseId', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, setDeviceBinding);
  fastify.post('/downloads/bind-domain/:licenseId', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, setDomainBinding);
}
