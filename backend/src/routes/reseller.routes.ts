import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { requireOwnership } from '../middleware/auth.middleware';

const prisma = new PrismaClient();

// GET /reseller/dashboard
export async function getResellerDashboard(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req as any).user.id;
    
    const reseller = await prisma.resellerProfile.findUnique({
      where: { userId },
      include: {
        leads: { where: { status: 'NEW' } },
        commissions: { where: { status: 'APPROVED' } }
      }
    });

    if (!reseller) {
      return reply.status(404).send({ error: 'Reseller profile not found' });
    }

    const analytics = await prisma.resellerAnalytics.findMany({
      where: { resellerId: reseller.id },
      orderBy: { date: 'desc' },
      take: 30
    });

    const monthlyCommissions = analytics
      .filter((a: any) => a.metric === 'commissions')
      .map((a: any) => ({ month: a.date.toISOString().slice(0, 7), commissions: Number(a.value) }));

    const activeLeads = reseller.leads.length;
    const pendingCommissions = reseller.commissions.reduce((sum: number, c: any) => sum + Number(c.amount), 0);

    reply.send({
      totalReferrals: reseller.totalReferrals,
      totalLeads: reseller.totalLeads,
      conversionRate: Number(reseller.conversionRate),
      totalCommissions: Number(reseller.totalCommissions),
      availableBalance: Number(reseller.availableBalance),
      pendingBalance: Number(reseller.pendingBalance),
      activeLeads,
      pendingCommissions,
      monthlyCommissions
    });
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch dashboard' });
  }
}

// GET /reseller/referrals
export async function getResellerReferrals(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req as any).user.id;
    
    const reseller = await prisma.resellerProfile.findUnique({
      where: { userId }
    });

    if (!reseller) {
      return reply.status(404).send({ error: 'Reseller profile not found' });
    }

    const referrals = await prisma.referral.findMany({
      where: { referrerId: userId },
      include: {
        referredUser: {
          select: { id: true, name: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 100
    });

    reply.send(referrals.map((r: any) => ({
      id: r.id,
      status: r.status,
      commission: r.commission ? Number(r.commission) : 0,
      createdAt: r.createdAt,
      referredUser: r.referredUser
    })));
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch referrals' });
  }
}

// GET /reseller/leads
export async function getResellerLeads(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req as any).user.id;
    
    const reseller = await prisma.resellerProfile.findUnique({
      where: { userId }
    });

    if (!reseller) {
      return reply.status(404).send({ error: 'Reseller profile not found' });
    }

    const leads = await prisma.lead.findMany({
      where: { resellerId: reseller.id },
      orderBy: { createdAt: 'desc' },
      take: 100
    });

    reply.send(leads.map((l: any) => ({
      ...l,
      value: l.value ? Number(l.value) : 0
    })));
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch leads' });
  }
}

// POST /reseller/leads
export async function createLead(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req as any).user.id;
    const { name, email, phone, source, notes, value } = req.body as any;
    
    const reseller = await prisma.resellerProfile.findUnique({
      where: { userId }
    });

    if (!reseller) {
      return reply.status(404).send({ error: 'Reseller profile not found' });
    }

    // Check for duplicate email
    const existing = await prisma.lead.findFirst({
      where: { resellerId: reseller.id, email }
    });

    if (existing) {
      return reply.status(400).send({ error: 'Lead with this email already exists' });
    }

    const lead = await prisma.lead.create({
      data: {
        resellerId: reseller.id,
        name,
        email,
        phone,
        source,
        notes,
        value: value || 0
      }
    });

    // Update reseller stats
    await prisma.resellerProfile.update({
      where: { id: reseller.id },
      data: { totalLeads: { increment: 1 } }
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'CREATE_LEAD',
        entity: 'Lead',
        entityId: lead.id,
        changes: { name, email }
      }
    });

    reply.status(201).send({
      ...lead,
      value: Number(lead.value)
    });
  } catch (error) {
    reply.status(500).send({ error: 'Failed to create lead' });
  }
}

// PATCH /reseller/leads/:id
export async function updateLead(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req as any).user.id;
    const { id } = req.params as any;
    const { name, email, phone, source, notes, status, value } = req.body as any;
    
    const reseller = await prisma.resellerProfile.findUnique({
      where: { userId }
    });

    if (!reseller) {
      return reply.status(404).send({ error: 'Reseller profile not found' });
    }

    const lead = await prisma.lead.findFirst({
      where: { id, resellerId: reseller.id }
    });

    if (!lead) {
      return reply.status(404).send({ error: 'Lead not found' });
    }

    const updated = await prisma.lead.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(phone && { phone }),
        ...(source && { source }),
        ...(notes && { notes }),
        ...(status && { status }),
        ...(value !== undefined && { value })
      }
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'UPDATE_LEAD',
        entity: 'Lead',
        entityId: id,
        changes: { status, value }
      }
    });

    reply.send({
      ...updated,
      value: Number(updated.value)
    });
  } catch (error) {
    reply.status(500).send({ error: 'Failed to update lead' });
  }
}

// DELETE /reseller/leads/:id
export async function deleteLead(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req as any).user.id;
    const { id } = req.params as any;
    
    const reseller = await prisma.resellerProfile.findUnique({
      where: { userId }
    });

    if (!reseller) {
      return reply.status(404).send({ error: 'Reseller profile not found' });
    }

    const lead = await prisma.lead.findFirst({
      where: { id, resellerId: reseller.id }
    });

    if (!lead) {
      return reply.status(404).send({ error: 'Lead not found' });
    }

    await prisma.lead.delete({ where: { id } });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'DELETE_LEAD',
        entity: 'Lead',
        entityId: id
      }
    });

    reply.status(204).send();
  } catch (error) {
    reply.status(500).send({ error: 'Failed to delete lead' });
  }
}

// POST /reseller/leads/:id/convert
export async function convertLead(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req as any).user.id;
    const { id } = req.params as any;
    
    const reseller = await prisma.resellerProfile.findUnique({
      where: { userId }
    });

    if (!reseller) {
      return reply.status(404).send({ error: 'Reseller profile not found' });
    }

    const lead = await prisma.lead.findFirst({
      where: { id, resellerId: reseller.id }
    });

    if (!lead) {
      return reply.status(404).send({ error: 'Lead not found' });
    }

    if (lead.status === 'CONVERTED') {
      return reply.status(400).send({ error: 'Lead already converted' });
    }

    await prisma.lead.update({
      where: { id },
      data: { status: 'CONVERTED' }
    });

    // Create commission
    const commissionRule = await prisma.commissionRule.findFirst({
      where: { type: 'LEAD_CONVERSION', isActive: true }
    });

    const rate = commissionRule ? Number(commissionRule.rate) : 0.10;
    const amount = lead.value ? Number(lead.value) * rate : 0;

    if (amount > 0) {
      await prisma.commission.create({
        data: {
          resellerId: reseller.id,
          userId: userId,
          type: 'LEAD_CONVERSION',
          amount,
          rate,
          status: 'PENDING'
        }
      });

      // Update reseller stats
      await prisma.resellerProfile.update({
        where: { id: reseller.id },
        data: {
          totalCommissions: { increment: amount },
          conversionRate: { increment: 1 }
        }
      });
    }

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'CONVERT_LEAD',
        entity: 'Lead',
        entityId: id,
        changes: { status: 'CONVERTED', commission: amount }
      }
    });

    reply.send({ success: true, commission: amount });
  } catch (error) {
    reply.status(500).send({ error: 'Failed to convert lead' });
  }
}

// GET /reseller/commissions
export async function getResellerCommissions(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req as any).user.id;
    
    const reseller = await prisma.resellerProfile.findUnique({
      where: { userId }
    });

    if (!reseller) {
      return reply.status(404).send({ error: 'Reseller profile not found' });
    }

    const commissions = await prisma.commission.findMany({
      where: { resellerId: reseller.id },
      orderBy: { createdAt: 'desc' },
      take: 100
    });

    reply.send(commissions.map((c: any) => ({
      ...c,
      amount: Number(c.amount),
      rate: Number(c.rate)
    })));
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch commissions' });
  }
}

// GET /reseller/earnings
export async function getResellerEarnings(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req as any).user.id;
    
    const reseller = await prisma.resellerProfile.findUnique({
      where: { userId },
      include: {
        earnings: {
          where: { status: 'AVAILABLE' },
          orderBy: { createdAt: 'desc' },
          take: 50
        }
      }
    });

    if (!reseller) {
      return reply.status(404).send({ error: 'Reseller profile not found' });
    }

    const lastPayout = await prisma.payout.findFirst({
      where: { userId },
      orderBy: { requestedAt: 'desc' }
    });

    const totalLifetimeEarnings = reseller.earnings.reduce((sum: number, e: any) => sum + Number(e.amount), 0);

    reply.send({
      availableBalance: Number(reseller.availableBalance),
      pendingBalance: Number(reseller.pendingBalance),
      totalReferrals: reseller.totalReferrals,
      totalLeads: reseller.totalLeads,
      totalLifetimeEarnings,
      conversionRate: Number(reseller.conversionRate),
      lastPayout: lastPayout ? {
        amount: Number(lastPayout.amount),
        date: lastPayout.requestedAt,
        status: lastPayout.status
      } : null
    });
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch earnings' });
  }
}

// GET /reseller/payouts
export async function getResellerPayouts(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req as any).user.id;
    
    const payouts = await prisma.payout.findMany({
      where: { userId },
      orderBy: { requestedAt: 'desc' },
      take: 50
    });

    reply.send(payouts.map((p: any) => ({
      ...p,
      amount: Number(p.amount)
    })));
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch payouts' });
  }
}

// POST /reseller/payouts
export async function requestResellerPayout(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req as any).user.id;
    const { amount, method, accountDetails } = req.body as any;
    
    const reseller = await prisma.resellerProfile.findUnique({
      where: { userId }
    });

    if (!reseller) {
      return reply.status(404).send({ error: 'Reseller profile not found' });
    }

    if (Number(reseller.availableBalance) < amount) {
      return reply.status(400).send({ error: 'Insufficient balance' });
    }

    if (amount < 50) {
      return reply.status(400).send({ error: 'Minimum payout is $50' });
    }

    const payout = await prisma.payout.create({
      data: {
        userId,
        amount,
        method,
        accountDetails
      }
    });

    await prisma.resellerProfile.update({
      where: { id: reseller.id },
      data: {
        availableBalance: { decrement: amount }
      }
    });

    await prisma.resellerEarnings.create({
      data: {
        resellerId: reseller.id,
        type: 'ADJUSTMENT',
        amount: -amount,
        status: 'HELD'
      }
    });

    await prisma.auditLog.create({
      data: {
        userId,
        action: 'REQUEST_PAYOUT',
        entity: 'Payout',
        entityId: payout.id,
        changes: { amount, method }
      }
    });

    reply.status(201).send({
      ...payout,
      amount: Number(payout.amount)
    });
  } catch (error) {
    reply.status(500).send({ error: 'Failed to request payout' });
  }
}

// DELETE /reseller/payouts/:id
export async function cancelResellerPayout(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req as any).user.id;
    const { id } = req.params as any;
    
    const payout = await prisma.payout.findFirst({
      where: { id, userId, status: 'PENDING' }
    });

    if (!payout) {
      return reply.status(404).send({ error: 'Payout not found or cannot be cancelled' });
    }

    await prisma.payout.update({
      where: { id },
      data: { status: 'CANCELLED' }
    });

    const reseller = await prisma.resellerProfile.findUnique({
      where: { userId }
    });

    if (reseller) {
      await prisma.resellerProfile.update({
        where: { id: reseller.id },
        data: {
          availableBalance: { increment: payout.amount }
        }
      });
    }

    await prisma.auditLog.create({
      data: {
        userId,
        action: 'CANCEL_PAYOUT',
        entity: 'Payout',
        entityId: id
      }
    });

    reply.status(204).send();
  } catch (error) {
    reply.status(500).send({ error: 'Failed to cancel payout' });
  }
}

// GET /reseller/referral-code
export async function getReferralCode(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req as any).user.id;
    
    const reseller = await prisma.resellerProfile.findUnique({
      where: { userId }
    });

    if (!reseller) {
      return reply.status(404).send({ error: 'Reseller profile not found' });
    }

    reply.send({
      code: reseller.referralCode,
      link: `${process.env.APP_URL || 'http://localhost:3000'}/signup?ref=${reseller.referralCode}`
    });
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch referral code' });
  }
}

// POST /reseller/referral-code/regenerate
export async function generateReferralCode(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req as any).user.id;
    
    const reseller = await prisma.resellerProfile.findUnique({
      where: { userId }
    });

    if (!reseller) {
      return reply.status(404).send({ error: 'Reseller profile not found' });
    }

    const newCode = `REF${Date.now().toString(36).toUpperCase()}${Math.floor(Math.random() * 1000)}`;

    const updated = await prisma.resellerProfile.update({
      where: { id: reseller.id },
      data: {
        referralCode: newCode,
        referralLink: `${process.env.APP_URL || 'http://localhost:3000'}/signup?ref=${newCode}`
      }
    });

    await prisma.auditLog.create({
      data: {
        userId,
        action: 'REGENERATE_REFERRAL_CODE',
        entity: 'ResellerProfile',
        entityId: reseller.id,
        changes: { oldCode: reseller.referralCode, newCode }
      }
    });

    reply.send({
      code: updated.referralCode,
      link: updated.referralLink
    });
  } catch (error) {
    reply.status(500).send({ error: 'Failed to generate referral code' });
  }
}

// GET /reseller/analytics
export async function getResellerAnalytics(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req as any).user.id;
    
    const reseller = await prisma.resellerProfile.findUnique({
      where: { userId }
    });

    if (!reseller) {
      return reply.status(404).send({ error: 'Reseller profile not found' });
    }

    const analytics = await prisma.resellerAnalytics.findMany({
      where: { resellerId: reseller.id },
      orderBy: { date: 'desc' },
      take: 90
    });

    const monthlyCommissions = analytics
      .filter((a: any) => a.metric === 'commissions')
      .map((a: any) => ({ month: a.date.toISOString().slice(0, 7), commissions: Number(a.value) }));

    const monthlyReferrals = analytics
      .filter((a: any) => a.metric === 'referrals')
      .map((a: any) => ({ month: a.date.toISOString().slice(0, 7), referrals: Number(a.value) }));

    reply.send({
      totalReferrals: reseller.totalReferrals,
      totalLeads: reseller.totalLeads,
      conversionRate: Number(reseller.conversionRate),
      totalCommissions: Number(reseller.totalCommissions),
      monthlyCommissions,
      monthlyReferrals
    });
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch analytics' });
  }
}

export function resellerRoutes(fastify: FastifyInstance) {
  fastify.get('/reseller/dashboard', { preHandler: [fastify.authenticate, fastify.requireRole('RESELLER')] }, getResellerDashboard);
  fastify.get('/reseller/referrals', { preHandler: [fastify.authenticate, fastify.requireRole('RESELLER')] }, getResellerReferrals);
  fastify.get('/reseller/leads', { preHandler: [fastify.authenticate, fastify.requireRole('RESELLER')] }, getResellerLeads);
  fastify.post('/reseller/leads', { preHandler: [fastify.authenticate, fastify.requireRole('RESELLER')] }, createLead);
  fastify.patch('/reseller/leads/:id', { preHandler: [fastify.authenticate, fastify.requireRole('RESELLER'), requireOwnership('Lead')] }, updateLead);
  fastify.delete('/reseller/leads/:id', { preHandler: [fastify.authenticate, fastify.requireRole('RESELLER'), requireOwnership('Lead')] }, deleteLead);
  fastify.post('/reseller/leads/:id/convert', { preHandler: [fastify.authenticate, fastify.requireRole('RESELLER'), requireOwnership('Lead')] }, convertLead);
  fastify.get('/reseller/commissions', { preHandler: [fastify.authenticate, fastify.requireRole('RESELLER')] }, getResellerCommissions);
  fastify.get('/reseller/earnings', { preHandler: [fastify.authenticate, fastify.requireRole('RESELLER')] }, getResellerEarnings);
  fastify.get('/reseller/payouts', { preHandler: [fastify.authenticate, fastify.requireRole('RESELLER')] }, getResellerPayouts);
  fastify.post('/reseller/payouts', { preHandler: [fastify.authenticate, fastify.requireRole('RESELLER')] }, requestResellerPayout);
  fastify.delete('/reseller/payouts/:id', { preHandler: [fastify.authenticate, fastify.requireRole('RESELLER'), requireOwnership('Payout')] }, cancelResellerPayout);
  fastify.get('/reseller/referral-code', { preHandler: [fastify.authenticate, fastify.requireRole('RESELLER')] }, getReferralCode);
  fastify.post('/reseller/referral-code/regenerate', { preHandler: [fastify.authenticate, fastify.requireRole('RESELLER')] }, generateReferralCode);
  fastify.get('/reseller/analytics', { preHandler: [fastify.authenticate, fastify.requireRole('RESELLER')] }, getResellerAnalytics);
}
