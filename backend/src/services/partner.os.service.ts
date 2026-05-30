// ============================================================
// PARTNER OS SERVICE
// Technology Partner, Agency Partner, Channel Partner,
// Regional Partner, Enterprise Partner, Partner Revenue,
// Partner Analytics, Partner Commissions, Partner Payouts
// ============================================================

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class PartnerOSService {
  // Partner Methods
  static async createPartner(data: {
    userId: string;
    type: any;
    companyName?: string;
    contactName?: string;
    contactEmail?: string;
    contactPhone?: string;
    region?: string;
    territory?: string;
    commissionRate?: number;
    revenueShare?: number;
    contractUrl?: string;
    metadata?: any;
  }) {
    const partner = await prisma.partner.create({
      data
    });

    // Log partner creation
    await prisma.auditLog.create({
      data: {
        action: 'PARTNER_CREATED',
        entity: 'Partner',
        entityId: partner.id,
        metadata: { userId: partner.userId, type: partner.type }
      }
    });

    return partner;
  }

  static async getPartners(type?: any, status?: any) {
    const where: any = {};
    if (type) where.type = type;
    if (status) where.status = status;

    return prisma.partner.findMany({
      where,
      include: { user: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async getPartner(partnerId: string) {
    return prisma.partner.findUnique({
      where: { id: partnerId },
      include: { user: true, revenues: true, commissions: true, payouts: true }
    });
  }

  static async updatePartner(partnerId: string, data: any) {
    const partner = await prisma.partner.update({
      where: { id: partnerId },
      data
    });

    // Log partner update
    await prisma.auditLog.create({
      data: {
        action: 'PARTNER_UPDATED',
        entity: 'Partner',
        entityId: partnerId
      }
    });

    return partner;
  }

  static async updatePartnerStatus(partnerId: string, status: any) {
    const partner = await prisma.partner.update({
      where: { id: partnerId },
      data: { status }
    });

    // Log status update
    await prisma.auditLog.create({
      data: {
        action: 'PARTNER_STATUS_UPDATED',
        entity: 'Partner',
        entityId: partnerId,
        metadata: { status }
      }
    });

    return partner;
  }

  // Partner Revenue Methods
  static async createPartnerRevenue(data: {
    partnerId: string;
    period: string;
    periodType: any;
    totalRevenue?: number;
    commissionRevenue?: number;
    transactions?: number;
    metadata?: any;
  }) {
    const revenue = await prisma.partnerRevenue.create({
      data
    });

    // Log revenue creation
    await prisma.auditLog.create({
      data: {
        action: 'PARTNER_REVENUE_CREATED',
        entity: 'PartnerRevenue',
        entityId: revenue.id,
        metadata: { partnerId: revenue.partnerId, period: revenue.period }
      }
    });

    return revenue;
  }

  static async getPartnerRevenue(partnerId: string, period?: string) {
    const where: any = { partnerId };
    if (period) where.period = period;

    return prisma.partnerRevenue.findMany({
      where,
      orderBy: { period: 'desc' }
    });
  }

  static async updatePartnerRevenue(revenueId: string, data: any) {
    const revenue = await prisma.partnerRevenue.update({
      where: { id: revenueId },
      data
    });

    // Log revenue update
    await prisma.auditLog.create({
      data: {
        action: 'PARTNER_REVENUE_UPDATED',
        entity: 'PartnerRevenue',
        entityId: revenueId
      }
    });

    return revenue;
  }

  // Partner Commission Methods
  static async createPartnerCommission(data: {
    partnerId: string;
    orderId?: string;
    subscriptionId?: string;
    amount: number;
    rate: number;
    metadata?: any;
  }) {
    const commission = await prisma.partnerCommission.create({
      data
    });

    // Log commission creation
    await prisma.auditLog.create({
      data: {
        action: 'PARTNER_COMMISSION_CREATED',
        entity: 'PartnerCommission',
        entityId: commission.id,
        metadata: { partnerId: commission.partnerId, amount: commission.amount }
      }
    });

    return commission;
  }

  static async getPartnerCommissions(partnerId: string, status?: any) {
    const where: any = { partnerId };
    if (status) where.status = status;

    return prisma.partnerCommission.findMany({
      where,
      orderBy: { calculatedAt: 'desc' }
    });
  }

  static async updatePartnerCommissionStatus(commissionId: string, status: any) {
    const data: any = { status };
    if (status === 'PAID') data.paidAt = new Date();

    const commission = await prisma.partnerCommission.update({
      where: { id: commissionId },
      data
    });

    // Log status update
    await prisma.auditLog.create({
      data: {
        action: 'PARTNER_COMMISSION_STATUS_UPDATED',
        entity: 'PartnerCommission',
        entityId: commissionId,
        metadata: { status }
      }
    });

    return commission;
  }

  // Partner Payout Methods
  static async createPartnerPayout(data: {
    partnerId: string;
    amount: number;
    currency: string;
    method: any;
    details?: any;
    metadata?: any;
  }) {
    const payout = await prisma.partnerPayout.create({
      data
    });

    // Log payout creation
    await prisma.auditLog.create({
      data: {
        action: 'PARTNER_PAYOUT_CREATED',
        entity: 'PartnerPayout',
        entityId: payout.id,
        metadata: { partnerId: payout.partnerId, amount: payout.amount }
      }
    });

    return payout;
  }

  static async getPartnerPayouts(partnerId: string, status?: any) {
    const where: any = { partnerId };
    if (status) where.status = status;

    return prisma.partnerPayout.findMany({
      where,
      orderBy: { requestedAt: 'desc' }
    });
  }

  static async updatePartnerPayoutStatus(payoutId: string, status: any) {
    const data: any = { status };
    if (status === 'COMPLETED' || status === 'PROCESSING') data.processedAt = new Date();

    const payout = await prisma.partnerPayout.update({
      where: { id: payoutId },
      data
    });

    // Log status update
    await prisma.auditLog.create({
      data: {
        action: 'PARTNER_PAYOUT_STATUS_UPDATED',
        entity: 'PartnerPayout',
        entityId: payoutId,
        metadata: { status }
      }
    });

    return payout;
  }

  // Partner Analytics
  static async getPartnerAnalytics(partnerId: string) {
    const [
      totalRevenue,
      totalCommission,
      pendingCommission,
      paidCommission,
      totalPayouts,
      pendingPayouts,
      completedPayouts
    ] = await Promise.all([
      prisma.partnerRevenue.aggregate({
        where: { partnerId },
        _sum: { totalRevenue: true, commissionRevenue: true }
      }),
      prisma.partnerCommission.aggregate({
        where: { partnerId },
        _sum: { amount: true }
      }),
      prisma.partnerCommission.aggregate({
        where: { partnerId, status: 'PENDING' },
        _sum: { amount: true }
      }),
      prisma.partnerCommission.aggregate({
        where: { partnerId, status: 'PAID' },
        _sum: { amount: true }
      }),
      prisma.partnerPayout.aggregate({
        where: { partnerId },
        _sum: { amount: true }
      }),
      prisma.partnerPayout.aggregate({
        where: { partnerId, status: 'PENDING' },
        _sum: { amount: true }
      }),
      prisma.partnerPayout.aggregate({
        where: { partnerId, status: 'COMPLETED' },
        _sum: { amount: true }
      })
    ]);

    return {
      revenue: {
        total: totalRevenue._sum.totalRevenue || 0,
        commission: totalRevenue._sum.commissionRevenue || 0
      },
      commission: {
        total: totalCommission._sum.amount || 0,
        pending: pendingCommission._sum.amount || 0,
        paid: paidCommission._sum.amount || 0
      },
      payout: {
        total: totalPayouts._sum.amount || 0,
        pending: pendingPayouts._sum.amount || 0,
        completed: completedPayouts._sum.amount || 0
      }
    };
  }
}
