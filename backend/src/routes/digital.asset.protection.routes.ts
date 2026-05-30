// ============================================================
// DIGITAL ASSET PROTECTION ROUTES
// API endpoints for digital asset protection management
// ============================================================

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DigitalAssetProtectionService } from '../services/digital.asset.protection.service';

// POST /digital-asset-protection/watermarks
export async function createDownloadWatermark(req: FastifyRequest, reply: FastifyReply) {
  try {
    const data = req.body as any;
    const watermark = await DigitalAssetProtectionService.createDownloadWatermark(data);
    return reply.send(watermark);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to create watermark' });
  }
}

// GET /digital-asset-protection/watermarks
export async function getDownloadWatermarks(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req.query as any).userId;
    const productId = (req.query as any).productId;
    const watermarks = await DigitalAssetProtectionService.getDownloadWatermarks(userId, productId);
    return reply.send(watermarks);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch watermarks' });
  }
}

// POST /digital-asset-protection/leaks
export async function reportLeak(req: FastifyRequest, reply: FastifyReply) {
  try {
    const data = req.body as any;
    const leak = await DigitalAssetProtectionService.reportLeak(data);
    return reply.send(leak);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to report leak' });
  }
}

// GET /digital-asset-protection/leaks
export async function getLeakReports(req: FastifyRequest, reply: FastifyReply) {
  try {
    const productId = (req.query as any).productId;
    const status = (req.query as any).status;
    const leaks = await DigitalAssetProtectionService.getLeakReports(productId, status);
    return reply.send(leaks);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch leak reports' });
  }
}

// PATCH /digital-asset-protection/leaks/:leakId/status
export async function updateLeakStatus(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { leakId } = req.params as any;
    const { status } = req.body as any;
    const leak = await DigitalAssetProtectionService.updateLeakStatus(leakId, status);
    return reply.send(leak);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to update leak status' });
  }
}

// POST /digital-asset-protection/fingerprints
export async function createDownloadFingerprint(req: FastifyRequest, reply: FastifyReply) {
  try {
    const data = req.body as any;
    const fingerprint = await DigitalAssetProtectionService.createDownloadFingerprint(data);
    return reply.send(fingerprint);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to create fingerprint' });
  }
}

// GET /digital-asset-protection/fingerprints
export async function getDownloadFingerprints(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req.query as any).userId;
    const productId = (req.query as any).productId;
    const fingerprints = await DigitalAssetProtectionService.getDownloadFingerprints(userId, productId);
    return reply.send(fingerprints);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch fingerprints' });
  }
}

// POST /digital-asset-protection/fingerprints/check
export async function detectDuplicateFingerprint(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { fingerprint } = req.body as any;
    const isDuplicate = await DigitalAssetProtectionService.detectDuplicateFingerprint(fingerprint);
    return reply.send({ isDuplicate });
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to check fingerprint' });
  }
}

// POST /digital-asset-protection/secure-deliveries
export async function createSecureDelivery(req: FastifyRequest, reply: FastifyReply) {
  try {
    const data = req.body as any;
    const delivery = await DigitalAssetProtectionService.createSecureDelivery(data);
    return reply.send(delivery);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to create secure delivery' });
  }
}

// GET /digital-asset-protection/secure-deliveries
export async function getSecureDeliveries(req: FastifyRequest, reply: FastifyReply) {
  try {
    const productId = (req.query as any).productId;
    const licenseId = (req.query as any).licenseId;
    const deliveries = await DigitalAssetProtectionService.getSecureDeliveries(productId, licenseId);
    return reply.send(deliveries);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch secure deliveries' });
  }
}

// POST /digital-asset-protection/secure-deliveries/:deliveryId/access
export async function accessSecureDelivery(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { deliveryId } = req.params as any;
    const delivery = await DigitalAssetProtectionService.accessSecureDelivery(deliveryId);
    return reply.send(delivery);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to access delivery' });
  }
}

// POST /digital-asset-protection/secure-deliveries/:deliveryId/revoke
export async function revokeSecureDelivery(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { deliveryId } = req.params as any;
    const delivery = await DigitalAssetProtectionService.revokeSecureDelivery(deliveryId);
    return reply.send(delivery);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to revoke delivery' });
  }
}

// POST /digital-asset-protection/abuse
export async function reportAbuse(req: FastifyRequest, reply: FastifyReply) {
  try {
    const data = req.body as any;
    const abuse = await DigitalAssetProtectionService.reportAbuse(data);
    return reply.send(abuse);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to report abuse' });
  }
}

// GET /digital-asset-protection/abuse
export async function getAbuseReports(req: FastifyRequest, reply: FastifyReply) {
  try {
    const type = (req.query as any).type;
    const status = (req.query as any).status;
    const userId = (req.query as any).userId;
    const productId = (req.query as any).productId;
    const reports = await DigitalAssetProtectionService.getAbuseReports(type, status, userId, productId);
    return reply.send(reports);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch abuse reports' });
  }
}

// PATCH /digital-asset-protection/abuse/:abuseId/status
export async function updateAbuseStatus(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { abuseId } = req.params as any;
    const { status, resolvedBy } = req.body as any;
    const abuse = await DigitalAssetProtectionService.updateAbuseStatus(abuseId, status, resolvedBy);
    return reply.send(abuse);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to update abuse status' });
  }
}

// GET /digital-asset-protection/abuse/statistics
export async function getAbuseStatistics(req: FastifyRequest, reply: FastifyReply) {
  try {
    const stats = await DigitalAssetProtectionService.getAbuseStatistics();
    return reply.send(stats);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch statistics' });
  }
}

export function digitalAssetProtectionRoutes(fastify: FastifyInstance) {
  // Download Watermarks
  fastify.post('/digital-asset-protection/watermarks', { preHandler: [fastify.authenticate] }, createDownloadWatermark);
  fastify.get('/digital-asset-protection/watermarks', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, getDownloadWatermarks);
  
  // Leak Tracking
  fastify.post('/digital-asset-protection/leaks', { preHandler: [fastify.authenticate] }, reportLeak);
  fastify.get('/digital-asset-protection/leaks', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, getLeakReports);
  fastify.patch('/digital-asset-protection/leaks/:leakId/status', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, updateLeakStatus);
  
  // Download Fingerprinting
  fastify.post('/digital-asset-protection/fingerprints', { preHandler: [fastify.authenticate] }, createDownloadFingerprint);
  fastify.get('/digital-asset-protection/fingerprints', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, getDownloadFingerprints);
  fastify.post('/digital-asset-protection/fingerprints/check', { preHandler: [fastify.authenticate] }, detectDuplicateFingerprint);
  
  // Secure File Delivery
  fastify.post('/digital-asset-protection/secure-deliveries', { preHandler: [fastify.authenticate] }, createSecureDelivery);
  fastify.get('/digital-asset-protection/secure-deliveries', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, getSecureDeliveries);
  fastify.post('/digital-asset-protection/secure-deliveries/:deliveryId/access', { preHandler: [fastify.authenticate] }, accessSecureDelivery);
  fastify.post('/digital-asset-protection/secure-deliveries/:deliveryId/revoke', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, revokeSecureDelivery);
  
  // Abuse Detection
  fastify.post('/digital-asset-protection/abuse', { preHandler: [fastify.authenticate] }, reportAbuse);
  fastify.get('/digital-asset-protection/abuse', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, getAbuseReports);
  fastify.patch('/digital-asset-protection/abuse/:abuseId/status', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, updateAbuseStatus);
  fastify.get('/digital-asset-protection/abuse/statistics', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, getAbuseStatistics);
}
