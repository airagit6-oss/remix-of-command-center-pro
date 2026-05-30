// ============================================================
// ENTERPRISE COMMISSION ENGINE SERVICE
// Split Commission, Team Commission, Manager Commission,
// Regional Commission, Performance Commission, Recurring Commission,
// Renewal Commission, Custom Rules, Commission Ledger
// ============================================================

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class EnterpriseCommissionEngineService {
  // Commission Rule Methods
  static async createCommissionRule(data: {
    name: string;
    description?: string;
    type: any;
    scope: any;
    conditions?: any;
    rates?: any;
    metadata?: any;
  }) {
    const rule = await prisma.commissionRule.create({
      data
    });

    // Log rule creation
    await prisma.auditLog.create({
      data: {
        action: 'COMMISSION_RULE_CREATED',
        entity: 'CommissionRule',
        entityId: rule.id,
        metadata: { type: rule.type, scope: rule.scope }
      }
    });

    return rule;
  }

  static async getCommissionRules(type?: any, scope?: any, status?: any) {
    const where: any = {};
    if (type) where.type = type;
    if (scope) where.scope = scope;
    if (status) where.status = status;

    return prisma.commissionRule.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });
  }

  static async updateCommissionRule(ruleId: string, data: any) {
    const rule = await prisma.commissionRule.update({
      where: { id: ruleId },
      data
    });

    // Log rule update
    await prisma.auditLog.create({
      data: {
        action: 'COMMISSION_RULE_UPDATED',
        entity: 'CommissionRule',
        entityId: ruleId
      }
    });

    return rule;
  }

  static async updateCommissionRuleStatus(ruleId: string, status: any) {
    const rule = await prisma.commissionRule.update({
      where: { id: ruleId },
      data: { status }
    });

    // Log status update
    await prisma.auditLog.create({
      data: {
        action: 'COMMISSION_RULE_STATUS_UPDATED',
        entity: 'CommissionRule',
        entityId: ruleId,
        metadata: { status }
      }
    });

    return rule;
  }

  // Commission Ledger Entry Methods
  static async createCommissionLedgerEntry(data: {
    userId: string;
    ruleId?: string;
    sourceType: any;
    sourceId?: string;
    amount: number;
    rate: number;
    metadata?: any;
  }) {
    const entry = await prisma.commissionLedgerEntry.create({
      data
    });

    // Log entry creation
    await prisma.auditLog.create({
      data: {
        action: 'COMMISSION_LEDGER_ENTRY_CREATED',
        entity: 'CommissionLedgerEntry',
        entityId: entry.id,
        metadata: { userId: entry.userId, amount: entry.amount }
      }
    });

    return entry;
  }

  static async getCommissionLedgerEntries(userId?: string, sourceType?: any, status?: any) {
    const where: any = {};
    if (userId) where.userId = userId;
    if (sourceType) where.sourceType = sourceType;
    if (status) where.status = status;

    return prisma.commissionLedgerEntry.findMany({
      where,
      include: { user: true, rule: true },
      orderBy: { calculatedAt: 'desc' }
    });
  }

  static async updateCommissionLedgerEntryStatus(entryId: string, status: any) {
    const data: any = { status };
    if (status === 'PAID') data.paidAt = new Date();

    const entry = await prisma.commissionLedgerEntry.update({
      where: { id: entryId },
      data
    });

    // Log status update
    await prisma.auditLog.create({
      data: {
        action: 'COMMISSION_LEDGER_ENTRY_STATUS_UPDATED',
        entity: 'CommissionLedgerEntry',
        entityId: entryId,
        metadata: { status }
      }
    });

    return entry;
  }

  // Team Commission Methods
  static async createTeamCommission(data: {
    teamId: string;
    teamLeadId: string;
    memberId: string;
    orderId?: string;
    subscriptionId?: string;
    amount: number;
    rate: number;
    level: number;
    metadata?: any;
  }) {
    const commission = await prisma.teamCommission.create({
      data
    });

    // Log commission creation
    await prisma.auditLog.create({
      data: {
        action: 'TEAM_COMMISSION_CREATED',
        entity: 'TeamCommission',
        entityId: commission.id,
        metadata: { teamId: commission.teamId, memberId: commission.memberId }
      }
    });

    return commission;
  }

  static async getTeamCommissions(teamId?: string, memberId?: string, status?: any) {
    const where: any = {};
    if (teamId) where.teamId = teamId;
    if (memberId) where.memberId = memberId;
    if (status) where.status = status;

    return prisma.teamCommission.findMany({
      where,
      include: { teamLead: true, member: true },
      orderBy: { calculatedAt: 'desc' }
    });
  }

  static async updateTeamCommissionStatus(commissionId: string, status: any) {
    const data: any = { status };
    if (status === 'PAID') data.paidAt = new Date();

    const commission = await prisma.teamCommission.update({
      where: { id: commissionId },
      data
    });

    // Log status update
    await prisma.auditLog.create({
      data: {
        action: 'TEAM_COMMISSION_STATUS_UPDATED',
        entity: 'TeamCommission',
        entityId: commissionId,
        metadata: { status }
      }
    });

    return commission;
  }

  // Performance Commission Methods
  static async createPerformanceCommission(data: {
    userId: string;
    period: string;
    periodType: any;
    metrics?: any;
    targetAmount: number;
    actualAmount: number;
    achievedPercentage: number;
    bonusRate: number;
    bonusAmount: number;
    metadata?: any;
  }) {
    const commission = await prisma.performanceCommission.create({
      data
    });

    // Log commission creation
    await prisma.auditLog.create({
      data: {
        action: 'PERFORMANCE_COMMISSION_CREATED',
        entity: 'PerformanceCommission',
        entityId: commission.id,
        metadata: { userId: commission.userId, period: commission.period }
      }
    });

    return commission;
  }

  static async getPerformanceCommissions(userId?: string, period?: string, status?: any) {
    const where: any = {};
    if (userId) where.userId = userId;
    if (period) where.period = period;
    if (status) where.status = status;

    return prisma.performanceCommission.findMany({
      where,
      include: { user: true },
      orderBy: { period: 'desc' }
    });
  }

  static async updatePerformanceCommissionStatus(commissionId: string, status: any) {
    const data: any = { status };
    if (status === 'PAID') data.paidAt = new Date();

    const commission = await prisma.performanceCommission.update({
      where: { id: commissionId },
      data
    });

    // Log status update
    await prisma.auditLog.create({
      data: {
        action: 'PERFORMANCE_COMMISSION_STATUS_UPDATED',
        entity: 'PerformanceCommission',
        entityId: commissionId,
        metadata: { status }
      }
    });

    return commission;
  }

  // Commission Analytics
  static async getCommissionAnalytics(userId?: string) {
    const where = userId ? { userId } : {};

    const [
      totalLedgerAmount,
      pendingLedgerAmount,
      approvedLedgerAmount,
      paidLedgerAmount,
      totalTeamAmount,
      totalPerformanceBonus,
      totalPendingCommissions
    ] = await Promise.all([
      prisma.commissionLedgerEntry.aggregate({
        where,
        _sum: { amount: true }
      }),
      prisma.commissionLedgerEntry.aggregate({
        where: { ...where, status: 'PENDING' },
        _sum: { amount: true }
      }),
      prisma.commissionLedgerEntry.aggregate({
        where: { ...where, status: 'APPROVED' },
        _sum: { amount: true }
      }),
      prisma.commissionLedgerEntry.aggregate({
        where: { ...where, status: 'PAID' },
        _sum: { amount: true }
      }),
      prisma.teamCommission.aggregate({
        where: userId ? { memberId: userId } : {},
        _sum: { amount: true }
      }),
      prisma.performanceCommission.aggregate({
        where: userId ? { userId } : {},
        _sum: { bonusAmount: true }
      }),
      prisma.commissionLedgerEntry.count({
        where: { ...where, status: 'PENDING' }
      })
    ]);

    return {
      ledger: {
        total: totalLedgerAmount._sum.amount || 0,
        pending: pendingLedgerAmount._sum.amount || 0,
        approved: approvedLedgerAmount._sum.amount || 0,
        paid: paidLedgerAmount._sum.amount || 0
      },
      team: {
        total: totalTeamAmount._sum.amount || 0
      },
      performance: {
        totalBonus: totalPerformanceBonus._sum.bonusAmount || 0
      },
      pendingCount: totalPendingCommissions
    };
  }
}
