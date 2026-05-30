// ============================================================
// SECURITY ROUTES
// API endpoints for 2FA, device management, session management
// ============================================================

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { SecurityService } from '../services/security.service';

// POST /security/2fa/generate
export async function generate2FASecret(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req as any).user.id;
    const result = await SecurityService.generate2FASecret(userId);
    return reply.send(result);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to generate 2FA secret' });
  }
}

// POST /security/2fa/enable
export async function enable2FA(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req as any).user.id;
    const { token } = req.body as any;
    
    if (!token) {
      return reply.status(400).send({ error: 'Token is required' });
    }

    const success = await SecurityService.enable2FA(userId, token);
    
    if (success) {
      return reply.send({ success: true, message: '2FA enabled successfully' });
    } else {
      return reply.status(400).send({ error: 'Invalid token' });
    }
  } catch (error) {
    reply.status(500).send({ error: 'Failed to enable 2FA' });
  }
}

// POST /security/2fa/disable
export async function disable2FA(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req as any).user.id;
    const { token } = req.body as any;
    
    if (!token) {
      return reply.status(400).send({ error: 'Token is required' });
    }

    const success = await SecurityService.disable2FA(userId, token);
    
    if (success) {
      return reply.send({ success: true, message: '2FA disabled successfully' });
    } else {
      return reply.status(400).send({ error: 'Invalid token' });
    }
  } catch (error) {
    reply.status(500).send({ error: 'Failed to disable 2FA' });
  }
}

// GET /security/2fa/status
export async function get2FAStatus(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req as any).user.id;
    const user = await (req as any).prisma.user.findUnique({
      where: { id: userId },
      select: { twoFactorEnabled: true }
    });
    
    return reply.send({ enabled: user?.twoFactorEnabled || false });
  } catch (error) {
    reply.status(500).send({ error: 'Failed to get 2FA status' });
  }
}

// GET /security/devices
export async function getDevices(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req as any).user.id;
    const devices = await SecurityService.getUserDevices(userId);
    return reply.send(devices);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch devices' });
  }
}

// POST /security/devices/:deviceId/trust
export async function trustDevice(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req as any).user.id;
    const { deviceId } = req.params as any;
    
    await SecurityService.trustDevice(userId, deviceId);
    return reply.send({ success: true });
  } catch (error) {
    reply.status(500).send({ error: 'Failed to trust device' });
  }
}

// DELETE /security/devices/:deviceId
export async function revokeDevice(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req as any).user.id;
    const { deviceId } = req.params as any;
    
    await SecurityService.revokeDevice(userId, deviceId);
    return reply.send({ success: true });
  } catch (error) {
    reply.status(500).send({ error: 'Failed to revoke device' });
  }
}

// GET /security/sessions
export async function getSessions(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req as any).user.id;
    const sessions = await SecurityService.getUserSessions(userId);
    return reply.send(sessions);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch sessions' });
  }
}

// DELETE /security/sessions/:token
export async function revokeSession(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { token } = req.params as any;
    await SecurityService.revokeSession(token);
    return reply.send({ success: true });
  } catch (error) {
    reply.status(500).send({ error: 'Failed to revoke session' });
  }
}

// DELETE /security/sessions
export async function revokeAllSessions(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req as any).user.id;
    await SecurityService.revokeAllUserSessions(userId);
    return reply.send({ success: true });
  } catch (error) {
    reply.status(500).send({ error: 'Failed to revoke all sessions' });
  }
}

// GET /security/events
export async function getSecurityEvents(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req as any).user.id;
    const limit = parseInt((req.query as any).limit || '50');
    const events = await SecurityService.getSecurityEvents(userId, limit);
    return reply.send(events);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch security events' });
  }
}

// POST /security/events/:eventId/resolve
export async function resolveSecurityEvent(req: FastifyRequest, reply: FastifyReply) {
  try {
    const resolvedBy = (req as any).user.id;
    const { eventId } = req.params as any;
    
    await SecurityService.resolveSecurityEvent(eventId, resolvedBy);
    return reply.send({ success: true });
  } catch (error) {
    reply.status(500).send({ error: 'Failed to resolve security event' });
  }
}

// GET /security/activity
export async function getActivityLogs(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req as any).user.id;
    const limit = parseInt((req.query as any).limit || '50');
    const activity = await SecurityService.getUserActivity(userId, limit);
    return reply.send(activity);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch activity logs' });
  }
}

// POST /security/assess-risk
export async function assessRisk(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req as any).user.id;
    const { ipAddress, userAgent, deviceId } = req.body as any;
    
    const assessment = await SecurityService.assessRisk(userId, {
      ipAddress,
      userAgent,
      deviceId
    });
    
    return reply.send(assessment);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to assess risk' });
  }
}

export function securityRoutes(fastify: FastifyInstance) {
  fastify.post('/security/2fa/generate', { preHandler: [fastify.authenticate] }, generate2FASecret);
  fastify.post('/security/2fa/enable', { preHandler: [fastify.authenticate] }, enable2FA);
  fastify.post('/security/2fa/disable', { preHandler: [fastify.authenticate] }, disable2FA);
  fastify.get('/security/2fa/status', { preHandler: [fastify.authenticate] }, get2FAStatus);
  
  fastify.get('/security/devices', { preHandler: [fastify.authenticate] }, getDevices);
  fastify.post('/security/devices/:deviceId/trust', { preHandler: [fastify.authenticate] }, trustDevice);
  fastify.delete('/security/devices/:deviceId', { preHandler: [fastify.authenticate] }, revokeDevice);
  
  fastify.get('/security/sessions', { preHandler: [fastify.authenticate] }, getSessions);
  fastify.delete('/security/sessions/:token', { preHandler: [fastify.authenticate] }, revokeSession);
  fastify.delete('/security/sessions', { preHandler: [fastify.authenticate] }, revokeAllSessions);
  
  fastify.get('/security/events', { preHandler: [fastify.authenticate] }, getSecurityEvents);
  fastify.post('/security/events/:eventId/resolve', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, resolveSecurityEvent);
  
  fastify.get('/security/activity', { preHandler: [fastify.authenticate] }, getActivityLogs);
  fastify.post('/security/assess-risk', { preHandler: [fastify.authenticate] }, assessRisk);
}
