// ============================================================
// ACTIVITY TIMELINE SERVICE
// Comprehensive activity logging and timeline retrieval
// ============================================================

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ActivityTimelineService {
  // Log activity
  static async logActivity(
    userId: string | null,
    action: string,
    resource: string,
    resourceId?: string,
    metadata?: any,
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
    await prisma.activityLog.create({
      data: {
        userId,
        action,
        resource,
        resourceId,
        metadata,
        ipAddress,
        userAgent
      }
    });
  }

  // Get user activity timeline
  static async getUserTimeline(userId: string, limit: number = 100) {
    const activities = await prisma.activityLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit
    });

    return activities.map(activity => ({
      id: activity.id,
      action: activity.action,
      resource: activity.resource,
      resourceId: activity.resourceId,
      metadata: activity.metadata,
      ipAddress: activity.ipAddress,
      userAgent: activity.userAgent,
      timestamp: activity.createdAt
    }));
  }

  // Get activity timeline for a specific resource
  static async getResourceTimeline(resource: string, resourceId: string, limit: number = 100) {
    const activities = await prisma.activityLog.findMany({
      where: { resource, resourceId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: { user: { select: { id: true, name: true, email: true } } }
    });

    return activities.map(activity => ({
      id: activity.id,
      action: activity.action,
      resource: activity.resource,
      resourceId: activity.resourceId,
      metadata: activity.metadata,
      user: activity.user,
      ipAddress: activity.ipAddress,
      userAgent: activity.userAgent,
      timestamp: activity.createdAt
    }));
  }

  // Get global activity timeline (admin only)
  static async getGlobalTimeline(limit: number = 100, resourceFilter?: string) {
    const where: any = {};
    if (resourceFilter) {
      where.resource = resourceFilter;
    }

    const activities = await prisma.activityLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: { user: { select: { id: true, name: true, email: true, role: true } } }
    });

    return activities.map(activity => ({
      id: activity.id,
      action: activity.action,
      resource: activity.resource,
      resourceId: activity.resourceId,
      metadata: activity.metadata,
      user: activity.user,
      ipAddress: activity.ipAddress,
      userAgent: activity.userAgent,
      timestamp: activity.createdAt
    }));
  }

  // Get activity statistics
  static async getActivityStats(userId?: string) {
    const where: any = {};
    if (userId) {
      where.userId = userId;
    }

    const total = await prisma.activityLog.count({ where });
    
    const byAction = await prisma.activityLog.groupBy({
      by: ['action'],
      where,
      _count: true,
      orderBy: { _count: { _all: 'desc' } }
    });

    const byResource = await prisma.activityLog.groupBy({
      by: ['resource'],
      where,
      _count: true,
      orderBy: { _count: { _all: 'desc' } }
    });

    const recent = await prisma.activityLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    return {
      total,
      byAction: byAction.map(item => ({ action: item.action, count: item._count })),
      byResource: byResource.map(item => ({ resource: item.resource, count: item._count })),
      recentActivities: recent.length
    };
  }

  // Pre-defined activity loggers for common actions
  static async logProductCreated(userId: string, productId: string, metadata?: any) {
    return this.logActivity(
      userId,
      'PRODUCT_CREATED',
      'Product',
      productId,
      metadata,
      metadata?.ipAddress,
      metadata?.userAgent
    );
  }

  static async logProductUpdated(userId: string, productId: string, metadata?: any) {
    return this.logActivity(
      userId,
      'PRODUCT_UPDATED',
      'Product',
      productId,
      metadata,
      metadata?.ipAddress,
      metadata?.userAgent
    );
  }

  static async logOrderCreated(userId: string, orderId: string, metadata?: any) {
    return this.logActivity(
      userId,
      'ORDER_CREATED',
      'Order',
      orderId,
      metadata,
      metadata?.ipAddress,
      metadata?.userAgent
    );
  }

  static async logOrderUpdated(userId: string, orderId: string, metadata?: any) {
    return this.logActivity(
      userId,
      'ORDER_UPDATED',
      'Order',
      orderId,
      metadata,
      metadata?.ipAddress,
      metadata?.userAgent
    );
  }

  static async logLicenseActivated(userId: string, licenseId: string, metadata?: any) {
    return this.logActivity(
      userId,
      'LICENSE_ACTIVATED',
      'License',
      licenseId,
      metadata,
      metadata?.ipAddress,
      metadata?.userAgent
    );
  }

  static async logLicenseRevoked(userId: string, licenseId: string, metadata?: any) {
    return this.logActivity(
      userId,
      'LICENSE_REVOKED',
      'License',
      licenseId,
      metadata,
      metadata?.ipAddress,
      metadata?.userAgent
    );
  }

  static async logCommissionGenerated(userId: string, commissionId: string, metadata?: any) {
    return this.logActivity(
      userId,
      'COMMISSION_GENERATED',
      'Commission',
      commissionId,
      metadata,
      metadata?.ipAddress,
      metadata?.userAgent
    );
  }

  static async logPayoutRequested(userId: string, payoutId: string, metadata?: any) {
    return this.logActivity(
      userId,
      'PAYOUT_REQUESTED',
      'Payout',
      payoutId,
      metadata,
      metadata?.ipAddress,
      metadata?.userAgent
    );
  }

  static async logPayoutApproved(userId: string, payoutId: string, metadata?: any) {
    return this.logActivity(
      userId,
      'PAYOUT_APPROVED',
      'Payout',
      payoutId,
      metadata,
      metadata?.ipAddress,
      metadata?.userAgent
    );
  }

  static async logWalletCredit(userId: string, walletId: string, amount: number, metadata?: any) {
    return this.logActivity(
      userId,
      'WALLET_CREDIT',
      'Wallet',
      walletId,
      { ...metadata, amount },
      metadata?.ipAddress,
      metadata?.userAgent
    );
  }

  static async logWalletDebit(userId: string, walletId: string, amount: number, metadata?: any) {
    return this.logActivity(
      userId,
      'WALLET_DEBIT',
      'Wallet',
      walletId,
      { ...metadata, amount },
      metadata?.ipAddress,
      metadata?.userAgent
    );
  }

  static async logUserLogin(userId: string, metadata?: any) {
    return this.logActivity(
      userId,
      'USER_LOGIN',
      'User',
      userId,
      metadata,
      metadata?.ipAddress,
      metadata?.userAgent
    );
  }

  static async logUserLogout(userId: string, metadata?: any) {
    return this.logActivity(
      userId,
      'USER_LOGOUT',
      'User',
      userId,
      metadata,
      metadata?.ipAddress,
      metadata?.userAgent
    );
  }

  static async logSecurityEvent(userId: string, eventType: string, metadata?: any) {
    return this.logActivity(
      userId,
      'SECURITY_EVENT',
      'Security',
      undefined,
      { ...metadata, eventType },
      metadata?.ipAddress,
      metadata?.userAgent
    );
  }

  // Search activities
  static async searchActivities(query: string, limit: number = 50) {
    const activities = await prisma.activityLog.findMany({
      where: {
        OR: [
          { action: { contains: query, mode: 'insensitive' } },
          { resource: { contains: query, mode: 'insensitive' } },
          { resourceId: { contains: query, mode: 'insensitive' } }
        ]
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: { user: { select: { id: true, name: true, email: true } } }
    });

    return activities.map(activity => ({
      id: activity.id,
      action: activity.action,
      resource: activity.resource,
      resourceId: activity.resourceId,
      metadata: activity.metadata,
      user: activity.user,
      ipAddress: activity.ipAddress,
      userAgent: activity.userAgent,
      timestamp: activity.createdAt
    }));
  }

  // Get activities by date range
  static async getActivitiesByDateRange(
    startDate: Date,
    endDate: Date,
    userId?: string,
    limit: number = 100
  ) {
    const where: any = {
      createdAt: {
        gte: startDate,
        lte: endDate
      }
    };

    if (userId) {
      where.userId = userId;
    }

    const activities = await prisma.activityLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: { user: { select: { id: true, name: true, email: true } } }
    });

    return activities.map(activity => ({
      id: activity.id,
      action: activity.action,
      resource: activity.resource,
      resourceId: activity.resourceId,
      metadata: activity.metadata,
      user: activity.user,
      ipAddress: activity.ipAddress,
      userAgent: activity.userAgent,
      timestamp: activity.createdAt
    }));
  }
}
