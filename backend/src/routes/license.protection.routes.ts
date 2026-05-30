// ============================================================
// LICENSE PROTECTION ROUTES
// API endpoints for license protection features
// ============================================================

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { LicenseProtectionService } from '../services/license.protection.service';

// POST /licenses/:licenseId/bind-device
export async function bindDevice(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { licenseId } = req.params as any;
    const { deviceId, deviceName, ipAddress, userAgent } = req.body as any;
    
    if (!deviceId) {
      return reply.status(400).send({ error: 'Device ID is required' });
    }

    const result = await LicenseProtectionService.bindDevice(licenseId, deviceId, {
      deviceName,
      ipAddress,
      userAgent
    });
    
    return reply.send(result);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to bind device' });
  }
}

// POST /licenses/:licenseId/bind-domain
export async function bindDomain(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { licenseId } = req.params as any;
    const { domain } = req.body as any;
    
    if (!domain) {
      return reply.status(400).send({ error: 'Domain is required' });
    }

    const result = await LicenseProtectionService.bindDomain(licenseId, domain);
    return reply.send(result);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to bind domain' });
  }
}

// POST /licenses/:licenseId/validate-domain
export async function validateDomain(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { licenseId } = req.params as any;
    const { domain } = req.body as any;
    
    if (!domain) {
      return reply.status(400).send({ error: 'Domain is required' });
    }

    const isValid = await LicenseProtectionService.validateDomain(licenseId, domain);
    return reply.send({ valid: isValid });
  } catch (error) {
    reply.status(500).send({ error: 'Failed to validate domain' });
  }
}

// POST /licenses/:licenseId/bind-ip
export async function bindIP(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { licenseId } = req.params as any;
    const { ipAddress } = req.body as any;
    
    if (!ipAddress) {
      return reply.status(400).send({ error: 'IP address is required' });
    }

    const result = await LicenseProtectionService.bindIP(licenseId, ipAddress);
    return reply.send(result);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to bind IP' });
  }
}

// POST /licenses/:licenseId/validate-ip
export async function validateIP(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { licenseId } = req.params as any;
    const { ipAddress } = req.body as any;
    
    if (!ipAddress) {
      return reply.status(400).send({ error: 'IP address is required' });
    }

    const isValid = await LicenseProtectionService.validateIP(licenseId, ipAddress);
    return reply.send({ valid: isValid });
  } catch (error) {
    reply.status(500).send({ error: 'Failed to validate IP' });
  }
}

// GET /licenses/:licenseId/download-limit
export async function checkDownloadLimit(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { licenseId } = req.params as any;
    const result = await LicenseProtectionService.checkDownloadLimit(licenseId);
    return reply.send(result);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to check download limit' });
  }
}

// POST /licenses/:licenseId/record-download
export async function recordDownload(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { licenseId } = req.params as any;
    await LicenseProtectionService.recordDownload(licenseId);
    return reply.send({ success: true });
  } catch (error) {
    reply.status(500).send({ error: 'Failed to record download' });
  }
}

// POST /licenses/:licenseId/generate-secure-download-url
export async function generateSecureDownloadUrl(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { licenseId } = req.params as any;
    const { expiresInMinutes } = req.body as any;
    
    const token = await LicenseProtectionService.generateSecureDownloadUrl(
      licenseId,
      expiresInMinutes || 30
    );
    
    return reply.send({ token });
  } catch (error) {
    reply.status(500).send({ error: 'Failed to generate secure download URL' });
  }
}

// POST /licenses/:licenseId/validate-secure-download-url
export async function validateSecureDownloadUrl(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { licenseId } = req.params as any;
    const { token } = req.body as any;
    
    if (!token) {
      return reply.status(400).send({ error: 'Token is required' });
    }

    const isValid = await LicenseProtectionService.validateSecureDownloadToken(licenseId, token);
    return reply.send({ valid: isValid });
  } catch (error) {
    reply.status(500).send({ error: 'Failed to validate secure download URL' });
  }
}

// DELETE /licenses/:licenseId/secure-download-url
export async function invalidateSecureDownloadUrl(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { licenseId } = req.params as any;
    await LicenseProtectionService.invalidateSecureDownloadUrl(licenseId);
    return reply.send({ success: true });
  } catch (error) {
    reply.status(500).send({ error: 'Failed to invalidate secure download URL' });
  }
}

// POST /licenses/:licenseId/enable-watermark
export async function enableWatermark(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { licenseId } = req.params as any;
    const { watermarkText } = req.body as any;
    
    if (!watermarkText) {
      return reply.status(400).send({ error: 'Watermark text is required' });
    }

    await LicenseProtectionService.enableWatermark(licenseId, watermarkText);
    return reply.send({ success: true });
  } catch (error) {
    reply.status(500).send({ error: 'Failed to enable watermark' });
  }
}

// GET /licenses/:licenseId/watermark-config
export async function getWatermarkConfig(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { licenseId } = req.params as any;
    const config = await LicenseProtectionService.getWatermarkConfig(licenseId);
    return reply.send(config);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to get watermark config' });
  }
}

// POST /licenses/:licenseId/detect-piracy
export async function detectPiracy(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { licenseId } = req.params as any;
    const { deviceId, domain, ipAddress, userAgent } = req.body as any;
    
    const result = await LicenseProtectionService.detectPiracy(licenseId, {
      deviceId,
      domain,
      ipAddress,
      userAgent
    });
    
    return reply.send(result);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to detect piracy' });
  }
}

// POST /licenses/:licenseId/revoke
export async function revokeLicense(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { licenseId } = req.params as any;
    const { reason } = req.body as any;
    
    await LicenseProtectionService.revokeLicense(licenseId, reason || 'Manual revocation');
    return reply.send({ success: true });
  } catch (error) {
    reply.status(500).send({ error: 'Failed to revoke license' });
  }
}

// POST /licenses/:licenseId/suspend
export async function suspendLicense(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { licenseId } = req.params as any;
    const { reason } = req.body as any;
    
    await LicenseProtectionService.suspendLicense(licenseId, reason || 'Manual suspension');
    return reply.send({ success: true });
  } catch (error) {
    reply.status(500).send({ error: 'Failed to suspend license' });
  }
}

// POST /licenses/:licenseId/reactivate
export async function reactivateLicense(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { licenseId } = req.params as any;
    await LicenseProtectionService.reactivateLicense(licenseId);
    return reply.send({ success: true });
  } catch (error) {
    reply.status(500).send({ error: 'Failed to reactivate license' });
  }
}

// GET /licenses/:licenseId/analytics
export async function getLicenseAnalytics(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { licenseId } = req.params as any;
    const limit = parseInt((req.query as any).limit || '100');
    
    const analytics = await LicenseProtectionService.getLicenseAnalytics(licenseId, limit);
    return reply.send(analytics);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to get license analytics' });
  }
}

// GET /licenses/:licenseId/stats
export async function getLicenseStats(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { licenseId } = req.params as any;
    const stats = await LicenseProtectionService.getLicenseStats(licenseId);
    
    if (!stats) {
      return reply.status(404).send({ error: 'License not found' });
    }
    
    return reply.send(stats);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to get license stats' });
  }
}

export function licenseProtectionRoutes(fastify: FastifyInstance) {
  fastify.post('/licenses/:licenseId/bind-device', { preHandler: [fastify.authenticate] }, bindDevice);
  fastify.post('/licenses/:licenseId/bind-domain', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, bindDomain);
  fastify.post('/licenses/:licenseId/validate-domain', { preHandler: [fastify.authenticate] }, validateDomain);
  fastify.post('/licenses/:licenseId/bind-ip', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, bindIP);
  fastify.post('/licenses/:licenseId/validate-ip', { preHandler: [fastify.authenticate] }, validateIP);
  
  fastify.get('/licenses/:licenseId/download-limit', { preHandler: [fastify.authenticate] }, checkDownloadLimit);
  fastify.post('/licenses/:licenseId/record-download', { preHandler: [fastify.authenticate] }, recordDownload);
  
  fastify.post('/licenses/:licenseId/generate-secure-download-url', { preHandler: [fastify.authenticate] }, generateSecureDownloadUrl);
  fastify.post('/licenses/:licenseId/validate-secure-download-url', { preHandler: [fastify.authenticate] }, validateSecureDownloadUrl);
  fastify.delete('/licenses/:licenseId/secure-download-url', { preHandler: [fastify.authenticate] }, invalidateSecureDownloadUrl);
  
  fastify.post('/licenses/:licenseId/enable-watermark', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, enableWatermark);
  fastify.get('/licenses/:licenseId/watermark-config', { preHandler: [fastify.authenticate] }, getWatermarkConfig);
  
  fastify.post('/licenses/:licenseId/detect-piracy', { preHandler: [fastify.authenticate] }, detectPiracy);
  
  fastify.post('/licenses/:licenseId/revoke', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, revokeLicense);
  fastify.post('/licenses/:licenseId/suspend', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, suspendLicense);
  fastify.post('/licenses/:licenseId/reactivate', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, reactivateLicense);
  
  fastify.get('/licenses/:licenseId/analytics', { preHandler: [fastify.authenticate] }, getLicenseAnalytics);
  fastify.get('/licenses/:licenseId/stats', { preHandler: [fastify.authenticate] }, getLicenseStats);
}
