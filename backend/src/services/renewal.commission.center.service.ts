// ============================================================
// RENEWAL COMMISSION CENTER SERVICE
// License Renewal Tracking, Subscription Renewal Tracking,
// Renewal Revenue, Renewal Earnings, Renewal Forecast,
// Renewal Analytics, Auto Renewal Commission
// ============================================================

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class RenewalCommissionCenterService {
  // License Renewal Tracking Methods
  static async createLicenseRenewalTracking(data: {
    licenseId: string;
    resellerId?: string;
    originalOrderId?: string;
    renewedAt: Date;
    expiresAt: Date;
    amount: number;
    commissionAmount: number;
    commissionRate: number;
    metadata?: any;
  }) {
    const tracking = await prisma.licenseRenewalTracking.create({
      data
    });

    // Log renewal tracking creation
    await prisma.auditLog.create({
      data: {
        action: 'LICENSE_RENEWAL_TRACKING_CREATED',
        entity: 'LicenseRenewalTracking',
        entityId: tracking.id,
        metadata: { licenseId: tracking.licenseId, resellerId: tracking.resellerId }
      }
    });

    return tracking;
  }

  static async getLicenseRenewalTracking(licenseId?: string, resellerId?: string, status?: any) {
    const where: any = {};
    if (licenseId) where.licenseId = licenseId;
    if (resellerId) where.resellerId = resellerId;
    if (status) where.status = status;

    return prisma.licenseRenewalTracking.findMany({
      where,
      include: { license: true, reseller: true },
      orderBy: { renewedAt: 'desc' }
    });
  }

  static async updateLicenseRenewalStatus(trackingId: string, status: any) {
    const tracking = await prisma.licenseRenewalTracking.update({
      where: { id: trackingId },
      data: { status }
    });

    // Log status update
    await prisma.auditLog.create({
      data: {
        action: 'LICENSE_RENEWAL_STATUS_UPDATED',
        entity: 'LicenseRenewalTracking',
        entityId: trackingId,
        metadata: { status }
      }
    });

    return tracking;
  }

  // Subscription Renewal Tracking Methods
  static async createSubscriptionRenewalTracking(data: {
    subscriptionId: string;
    resellerId?: string;
    renewedAt: Date;
    nextBillingAt: Date;
    amount: number;
    commissionAmount: number;
    commissionRate: number;
    metadata?: any;
  }) {
    const tracking = await prisma.subscriptionRenewalTracking.create({
      data
    });

    // Log renewal tracking creation
    await prisma.auditLog.create({
      data: {
        action: 'SUBSCRIPTION_RENEWAL_TRACKING_CREATED',
        entity: 'SubscriptionRenewalTracking',
        entityId: tracking.id,
        metadata: { subscriptionId: tracking.subscriptionId, resellerId: tracking.resellerId }
      }
    });

    return tracking;
  }

  static async getSubscriptionRenewalTracking(subscriptionId?: string, resellerId?: string, status?: any) {
    const where: any = {};
    if (subscriptionId) where.subscriptionId = subscriptionId;
    if (resellerId) where.resellerId = resellerId;
    if (status) where.status = status;

    return prisma.subscriptionRenewalTracking.findMany({
      where,
      include: { subscription: true, reseller: true },
      orderBy: { renewedAt: 'desc' }
    });
  }

  static async updateSubscriptionRenewalStatus(trackingId: string, status: any) {
    const tracking = await prisma.subscriptionRenewalTracking.update({
      where: { id: trackingId },
      data: { status }
    });

    // Log status update
    await prisma.auditLog.create({
      data: {
        action: 'SUBSCRIPTION_RENEWAL_STATUS_UPDATED',
        entity: 'SubscriptionRenewalTracking',
        entityId: trackingId,
        metadata: { status }
      }
    });

    return tracking;
  }

  // Renewal Revenue Methods
  static async createRenewalRevenue(data: {
    resellerId?: string;
    period: string;
    periodType: any;
    licenseRenewals?: number;
    subscriptionRenewals?: number;
    totalRevenue?: number;
    commissionRevenue?: number;
    metadata?: any;
  }) {
    const revenue = await prisma.renewalRevenue.create({
      data
    });

    // Log revenue creation
    await prisma.auditLog.create({
      data: {
        action: 'RENEWAL_REVENUE_CREATED',
        entity: 'RenewalRevenue',
        entityId: revenue.id,
        metadata: { resellerId: revenue.resellerId, period: revenue.period }
      }
    });

    return revenue;
  }

  static async getRenewalRevenue(resellerId?: string, period?: string) {
    const where: any = {};
    if (resellerId) where.resellerId = resellerId;
    if (period) where.period = period;

    return prisma.renewalRevenue.findMany({
      where,
      orderBy: { period: 'desc' }
    });
  }

  static async updateRenewalRevenue(revenueId: string, data: any) {
    const revenue = await prisma.renewalRevenue.update({
      where: { id: revenueId },
      data
    });

    // Log revenue update
    await prisma.auditLog.create({
      data: {
        action: 'RENEWAL_REVENUE_UPDATED',
        entity: 'RenewalRevenue',
        entityId: revenueId
      }
    });

    return revenue;
  }

  // Renewal Forecast Methods
  static async createRenewalForecast(data: {
    resellerId?: string;
    period: string;
    periodType: any;
    expectedRenewals: number;
    expectedRevenue: number;
    expectedCommission: number;
    confidence: number;
    factors?: any;
    metadata?: any;
  }) {
    const forecast = await prisma.renewalForecast.create({
      data
    });

    // Log forecast creation
    await prisma.auditLog.create({
      data: {
        action: 'RENEWAL_FORECAST_CREATED',
        entity: 'RenewalForecast',
        entityId: forecast.id,
        metadata: { resellerId: forecast.resellerId, period: forecast.period }
      }
    });

    return forecast;
  }

  static async getRenewalForecasts(resellerId?: string, period?: string) {
    const where: any = {};
    if (resellerId) where.resellerId = resellerId;
    if (period) where.period = period;

    return prisma.renewalForecast.findMany({
      where,
      orderBy: { period: 'desc' }
    });
  }

  static async updateRenewalForecast(forecastId: string, data: any) {
    const forecast = await prisma.renewalForecast.update({
      where: { id: forecastId },
      data
    });

    // Log forecast update
    await prisma.auditLog.create({
      data: {
        action: 'RENEWAL_FORECAST_UPDATED',
        entity: 'RenewalForecast',
        entityId: forecastId
      }
    });

    return forecast;
  }

  // Auto Renewal Commission Methods
  static async createAutoRenewalCommission(data: {
    resellerId: string;
    sourceType: any;
    sourceId: string;
    amount: number;
    rate: number;
    metadata?: any;
  }) {
    const commission = await prisma.autoRenewalCommission.create({
      data
    });

    // Log commission creation
    await prisma.auditLog.create({
      data: {
        action: 'AUTO_RENEWAL_COMMISSION_CREATED',
        entity: 'AutoRenewalCommission',
        entityId: commission.id,
        metadata: { resellerId: commission.resellerId, amount: commission.amount }
      }
    });

    return commission;
  }

  static async getAutoRenewalCommissions(resellerId?: string, sourceType?: any, status?: any) {
    const where: any = {};
    if (resellerId) where.resellerId = resellerId;
    if (sourceType) where.sourceType = sourceType;
    if (status) where.status = status;

    return prisma.autoRenewalCommission.findMany({
      where,
      include: { reseller: true },
      orderBy: { calculatedAt: 'desc' }
    });
  }

  static async updateAutoRenewalCommissionStatus(commissionId: string, status: any) {
    const data: any = { status };
    if (status === 'PAID') data.paidAt = new Date();

    const commission = await prisma.autoRenewalCommission.update({
      where: { id: commissionId },
      data
    });

    // Log status update
    await prisma.auditLog.create({
      data: {
        action: 'AUTO_RENEWAL_COMMISSION_STATUS_UPDATED',
        entity: 'AutoRenewalCommission',
        entityId: commissionId,
        metadata: { status }
      }
    });

    return commission;
  }

  // Renewal Analytics
  static async getRenewalAnalytics(resellerId?: string) {
    const where = resellerId ? { resellerId } : {};

    const [
      totalLicenseRenewals,
      totalSubscriptionRenewals,
      totalRenewalRevenue,
      totalCommissionRevenue,
      totalAutoRenewalCommissions,
      pendingAutoRenewalCommissions,
      expectedRenewals,
      expectedRevenue
    ] = await Promise.all([
      prisma.licenseRenewalTracking.count({ where: resellerId ? { resellerId } : {} }),
      prisma.subscriptionRenewalTracking.count({ where: resellerId ? { resellerId } : {} }),
      prisma.renewalRevenue.aggregate({
        where,
        _sum: { totalRevenue: true, commissionRevenue: true }
      }),
      prisma.autoRenewalCommission.aggregate({
        where,
        _sum: { amount: true }
      }),
      prisma.autoRenewalCommission.count({ where }),
      prisma.autoRenewalCommission.count({ where: { ...where, status: 'PENDING' } }),
      prisma.renewalForecast.aggregate({
        where,
        _sum: { expectedRenewals: true, expectedRevenue: true }
      })
    ]);

    return {
      renewals: {
        license: totalLicenseRenewals,
        subscription: totalSubscriptionRenewals
      },
      revenue: {
        total: totalRenewalRevenue._sum.totalRevenue || 0,
        commission: totalRenewalRevenue._sum.commissionRevenue || 0
      },
      autoRenewal: {
        totalCommissions: totalAutoRenewalCommissions,
        totalAmount: totalAutoRenewalCommissions._sum.amount || 0,
        pending: pendingAutoRenewalCommissions
      },
      forecast: {
        expectedRenewals: expectedRenewals._sum.expectedRenewals || 0,
        expectedRevenue: expectedRevenue._sum.expectedRevenue || 0
      }
    };
  }
}
