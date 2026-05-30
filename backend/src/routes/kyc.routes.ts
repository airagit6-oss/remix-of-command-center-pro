import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /kyc/status
export async function getKYCStatus(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req as any).user.id;
    
    const kycRecord = await prisma.kYCRecord.findFirst({
      where: { userId },
      orderBy: { submittedAt: 'desc' }
    });

    if (!kycRecord) {
      return reply.send({ status: 'NOT_SUBMITTED' });
    }

    reply.send({
      id: kycRecord.id,
      type: kycRecord.type,
      status: kycRecord.status,
      submittedAt: kycRecord.submittedAt,
      reviewedAt: kycRecord.reviewedAt,
      rejectionReason: kycRecord.rejectionReason
    });
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch KYC status' });
  }
}

// POST /kyc/submit
export async function submitKYC(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req as any).user.id;
    const { type, documents } = req.body as any;
    
    // Validate required fields
    if (!type || !documents) {
      return reply.status(400).send({ error: 'Type and documents are required' });
    }

    // Check if there's a pending KYC
    const pendingKYC = await prisma.kYCRecord.findFirst({
      where: { userId, status: { in: ['PENDING', 'UNDER_REVIEW'] } }
    });

    if (pendingKYC) {
      return reply.status(400).send({ error: 'KYC already in progress' });
    }

    // Create KYC record
    const kycRecord = await prisma.kYCRecord.create({
      data: {
        userId,
        type,
        status: 'PENDING',
        documents
      }
    });

    // Update author profile if user is author
    const author = await prisma.authorProfile.findUnique({
      where: { userId }
    });

    if (author) {
      await prisma.authorProfile.update({
        where: { id: author.id },
        data: {
          kycSubmittedAt: new Date(),
          kycDocuments: documents
        }
      });
    }

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'SUBMIT_KYC',
        entity: 'KYCRecord',
        entityId: kycRecord.id,
        changes: { type, status: 'PENDING' }
      }
    });

    // Notification
    await prisma.notification.create({
      data: {
        userId,
        type: 'SYSTEM',
        title: 'KYC Submitted',
        message: 'Your KYC verification has been submitted and is under review.',
        data: { kycId: kycRecord.id }
      }
    });

    reply.status(201).send({
      id: kycRecord.id,
      type: kycRecord.type,
      status: kycRecord.status,
      submittedAt: kycRecord.submittedAt
    });
  } catch (error) {
    reply.status(500).send({ error: 'Failed to submit KYC' });
  }
}

// GET /kyc/documents
export async function getKYCDocuments(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req as any).user.id;
    
    const kycRecord = await prisma.kYCRecord.findFirst({
      where: { userId },
      orderBy: { submittedAt: 'desc' }
    });

    if (!kycRecord) {
      return reply.status(404).send({ error: 'KYC record not found' });
    }

    reply.send({
      documents: kycRecord.documents
    });
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch KYC documents' });
  }
}

// POST /kyc/:id/approve (Admin only)
export async function approveKYC(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req as any).user.id;
    const { id } = req.params as any;
    const { notes } = req.body as any;
    
    // Verify admin role
    if ((req as any).user.role !== 'ADMIN' && (req as any).user.role !== 'SUPER_ADMIN') {
      return reply.status(403).send({ error: 'Insufficient permissions' });
    }

    const kycRecord = await prisma.kYCRecord.findUnique({
      where: { id }
    });

    if (!kycRecord) {
      return reply.status(404).send({ error: 'KYC record not found' });
    }

    if (kycRecord.status !== 'PENDING' && kycRecord.status !== 'UNDER_REVIEW') {
      return reply.status(400).send({ error: 'KYC cannot be approved' });
    }

    const updated = await prisma.kYCRecord.update({
      where: { id },
      data: {
        status: 'APPROVED',
        reviewedAt: new Date(),
        reviewedBy: userId,
        notes
      }
    });

    // Update author profile
    const author = await prisma.authorProfile.findUnique({
      where: { userId: kycRecord.userId }
    });

    if (author) {
      await prisma.authorProfile.update({
        where: { id: author.id },
        data: {
          isKYCVerified: true,
          kycVerifiedAt: new Date()
        }
      });
    }

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'APPROVE_KYC',
        entity: 'KYCRecord',
        entityId: id,
        changes: { status: 'APPROVED', notes }
      }
    });

    // Notification
    await prisma.notification.create({
      data: {
        userId: kycRecord.userId,
        type: 'SYSTEM',
        title: 'KYC Approved',
        message: 'Your KYC verification has been approved.',
        data: { kycId: id }
      }
    });

    reply.send(updated);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to approve KYC' });
  }
}

// POST /kyc/:id/reject (Admin only)
export async function rejectKYC(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req as any).user.id;
    const { id } = req.params as any;
    const { reason } = req.body as any;
    
    // Verify admin role
    if ((req as any).user.role !== 'ADMIN' && (req as any).user.role !== 'SUPER_ADMIN') {
      return reply.status(403).send({ error: 'Insufficient permissions' });
    }

    if (!reason) {
      return reply.status(400).send({ error: 'Rejection reason is required' });
    }

    const kycRecord = await prisma.kYCRecord.findUnique({
      where: { id }
    });

    if (!kycRecord) {
      return reply.status(404).send({ error: 'KYC record not found' });
    }

    if (kycRecord.status !== 'PENDING' && kycRecord.status !== 'UNDER_REVIEW') {
      return reply.status(400).send({ error: 'KYC cannot be rejected' });
    }

    const updated = await prisma.kYCRecord.update({
      where: { id },
      data: {
        status: 'REJECTED',
        reviewedAt: new Date(),
        reviewedBy: userId,
        rejectionReason: reason
      }
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'REJECT_KYC',
        entity: 'KYCRecord',
        entityId: id,
        changes: { status: 'REJECTED', reason }
      }
    });

    // Notification
    await prisma.notification.create({
      data: {
        userId: kycRecord.userId,
        type: 'SYSTEM',
        title: 'KYC Rejected',
        message: `Your KYC verification has been rejected. Reason: ${reason}`,
        data: { kycId: id, reason }
      }
    });

    reply.send(updated);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to reject KYC' });
  }
}

export function kycRoutes(fastify: FastifyInstance) {
  fastify.get('/kyc/status', { preHandler: [fastify.authenticate] }, getKYCStatus);
  fastify.post('/kyc/submit', { preHandler: [fastify.authenticate] }, submitKYC);
  fastify.get('/kyc/documents', { preHandler: [fastify.authenticate] }, getKYCDocuments);
  fastify.post('/kyc/:id/approve', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN', 'SUPER_ADMIN')] }, approveKYC);
  fastify.post('/kyc/:id/reject', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN', 'SUPER_ADMIN')] }, rejectKYC);
}
