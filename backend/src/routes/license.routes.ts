import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /licenses
export async function getLicenses(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req as any).user.id;

    const licenses = await prisma.license.findMany({
      where: {
        order: { userId }
      },
      include: {
        order: {
          include: {
            orderItems: {
              include: { product: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return reply.send(licenses);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch licenses' });
  }
}

// GET /licenses/:id
export async function getLicense(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = req.params as any;
    const userId = (req as any).user.id;

    const license = await prisma.license.findFirst({
      where: {
        id,
        order: { userId }
      },
      include: {
        order: {
          include: {
            orderItems: {
              include: { product: true }
            }
          }
        },
        activations: true
      }
    });

    if (!license) {
      return reply.status(404).send({ error: 'License not found' });
    }

    return reply.send(license);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch license' });
  }
}

// POST /licenses/:id/activate
export async function activateLicense(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = req.params as any;
    const { deviceId, deviceName } = req.body as any;
    const userId = (req as any).user.id;

    const license = await prisma.license.findFirst({
      where: {
        id,
        order: { userId }
      }
    });

    if (!license) {
      return reply.status(404).send({ error: 'License not found' });
    }

    if (license.status !== 'ACTIVE') {
      return reply.status(400).send({ error: 'License is not active' });
    }

    if (license.currentActivations >= license.maxActivations) {
      return reply.status(400).send({ error: 'Maximum activations reached' });
    }

    // Check if device already activated
    const existingActivation = await prisma.licenseActivation.findFirst({
      where: {
        licenseId: id,
        deviceId,
        isActive: true
      }
    });

    if (existingActivation) {
      // Update last seen
      await prisma.licenseActivation.update({
        where: { id: existingActivation.id },
        data: { lastSeenAt: new Date() }
      });
      return reply.send({ success: true, activation: existingActivation });
    }

    // Create new activation
    const activation = await prisma.licenseActivation.create({
      data: {
        licenseId: id,
        deviceId,
        deviceName,
        ipAddress: (req as any).ip,
        userAgent: req.headers['user-agent']
      }
    });

    // Update activation count
    await prisma.license.update({
      where: { id },
      data: { currentActivations: { increment: 1 } }
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'ACTIVATE_LICENSE',
        entity: 'License',
        entityId: id,
        changes: { deviceId, deviceName }
      }
    });

    return reply.send({ success: true, activation });
  } catch (error) {
    reply.status(500).send({ error: 'Failed to activate license' });
  }
}

// POST /licenses/:id/deactivate
export async function deactivateLicense(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = req.params as any;
    const { deviceId } = req.body as any;
    const userId = (req as any).user.id;

    const license = await prisma.license.findFirst({
      where: {
        id,
        order: { userId }
      }
    });

    if (!license) {
      return reply.status(404).send({ error: 'License not found' });
    }

    // Deactivate device
    await prisma.licenseActivation.updateMany({
      where: {
        licenseId: id,
        deviceId,
        isActive: true
      },
      data: {
        isActive: false
      }
    });

    // Update activation count
    await prisma.license.update({
      where: { id },
      data: { currentActivations: { decrement: 1 } }
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'DEACTIVATE_LICENSE',
        entity: 'License',
        entityId: id,
        changes: { deviceId }
      }
    });

    return reply.send({ success: true });
  } catch (error) {
    reply.status(500).send({ error: 'Failed to deactivate license' });
  }
}

export function licenseRoutes(fastify: FastifyInstance) {
  fastify.get('/licenses', { preHandler: [fastify.authenticate] }, getLicenses);
  fastify.get('/licenses/:id', { preHandler: [fastify.authenticate] }, getLicense);
  fastify.post('/licenses/:id/activate', { preHandler: [fastify.authenticate] }, activateLicense);
  fastify.post('/licenses/:id/deactivate', { preHandler: [fastify.authenticate] }, deactivateLicense);
}
