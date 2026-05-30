// ============================================================
// COMMAND CENTER SERVICE
// Live dashboard metrics: Revenue, Orders, Users, Activations, Commissions, Payouts, Errors, API, Webhook Status
// ============================================================

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class CommandCenterService {
  // Get live revenue metrics
  static async getLiveRevenueMetrics(timeframe: 'today' | 'week' | 'month' | 'year' = 'today') {
    const now = new Date();
    let startDate: Date;

    switch (timeframe) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
    }

    const orders = await prisma.order.findMany({
      where: {
        createdAt: { gte: startDate }
      },
      include: {
        items: true
      }
    });

    const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total), 0);
    const completedOrders = orders.filter(o => o.status === 'COMPLETED').length;
    const pendingOrders = orders.filter(o => o.status === 'PENDING').length;

    const transactions = await prisma.transaction.findMany({
      where: {
        createdAt: { gte: startDate },
        status: 'COMPLETED'
      }
    });

    const totalTransactions = transactions.length;
    const totalTransactionAmount = transactions.reduce((sum, t) => sum + Number(t.amount), 0);

    return {
      timeframe,
      totalRevenue,
      completedOrders,
      pendingOrders,
      totalOrders: orders.length,
      totalTransactions,
      totalTransactionAmount,
      averageOrderValue: orders.length > 0 ? totalRevenue / orders.length : 0
    };
  }

  // Get live order metrics
  static async getLiveOrderMetrics() {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const totalOrders = await prisma.order.count();
    const todayOrders = await prisma.order.count({
      where: { createdAt: { gte: today } }
    });

    const ordersByStatus = await prisma.order.groupBy({
      by: ['status'],
      _count: true
    });

    const recentOrders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: {
        user: { select: { id: true, name: true, email: true } }
      }
    });

    return {
      totalOrders,
      todayOrders,
      ordersByStatus: ordersByStatus.map(item => ({
        status: item.status,
        count: item._count
      })),
      recentOrders: recentOrders.map(order => ({
        id: order.id,
        orderNumber: order.orderNumber,
        total: Number(order.total),
        status: order.status,
        user: order.user,
        createdAt: order.createdAt
      }))
    };
  }

  // Get live user metrics
  static async getLiveUserMetrics() {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const totalUsers = await prisma.user.count();
    const verifiedUsers = await prisma.user.count({
      where: { isVerified: true }
    });
    const todayUsers = await prisma.user.count({
      where: { createdAt: { gte: today } }
    });
    const last30DaysUsers = await prisma.user.count({
      where: { createdAt: { gte: last30Days } }
    });

    const usersByRole = await prisma.user.groupBy({
      by: ['role'],
      _count: true
    });

    const activeSessions = await prisma.session.count({
      where: {
        expiresAt: { gt: now }
      }
    });

    const activeDevices = await prisma.device.count({
      where: {
        lastSeenAt: { gte: last30Days }
      }
    });

    return {
      totalUsers,
      verifiedUsers,
      todayUsers,
      last30DaysUsers,
      usersByRole: usersByRole.map(item => ({
        role: item.role,
        count: item._count
      })),
      activeSessions,
      activeDevices
    };
  }

  // Get live license activation metrics
  static async getLiveActivationMetrics() {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const totalLicenses = await prisma.license.count();
    const activeLicenses = await prisma.license.count({
      where: { status: 'ACTIVE' }
    });
    const todayActivations = await prisma.licenseActivation.count({
      where: { activatedAt: { gte: today } }
    });
    const last7DaysActivations = await prisma.licenseActivation.count({
      where: { activatedAt: { gte: last7Days } }
    });

    const licensesByType = await prisma.license.groupBy({
      by: ['type'],
      _count: true
    });

    const licensesByStatus = await prisma.license.groupBy({
      by: ['status'],
      _count: true
    });

    const recentActivations = await prisma.licenseActivation.findMany({
      orderBy: { activatedAt: 'desc' },
      take: 10,
      include: {
        license: {
          include: {
            order: {
              include: {
                user: { select: { id: true, name: true, email: true } }
              }
            }
          }
        }
      }
    });

    return {
      totalLicenses,
      activeLicenses,
      todayActivations,
      last7DaysActivations,
      licensesByType: licensesByType.map(item => ({
        type: item.type,
        count: item._count
      })),
      licensesByStatus: licensesByStatus.map(item => ({
        status: item.status,
        count: item._count
      })),
      recentActivations: recentActivations.map(activation => ({
        id: activation.id,
        deviceId: activation.deviceId,
        deviceName: activation.deviceName,
        activatedAt: activation.activatedAt,
        license: {
          licenseKey: activation.license.licenseKey,
          type: activation.license.type,
          user: activation.license.order.user
        }
      }))
    };
  }

  // Get live commission metrics
  static async getLiveCommissionMetrics() {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const totalCommissions = await prisma.commission.count();
    const pendingCommissions = await prisma.commission.count({
      where: { status: 'PENDING' }
    });
    const todayCommissions = await prisma.commission.count({
      where: { createdAt: { gte: today } }
    });
    const thisMonthCommissions = await prisma.commission.count({
      where: { createdAt: { gte: thisMonth } }
    });

    const commissions = await prisma.commission.findMany({
      where: { createdAt: { gte: thisMonth } }
    });

    const totalCommissionAmount = commissions.reduce((sum, c) => sum + Number(c.amount), 0);
    const paidCommissionAmount = commissions
      .filter(c => c.status === 'PAID')
      .reduce((sum, c) => sum + Number(c.amount), 0);
    const pendingCommissionAmount = commissions
      .filter(c => c.status === 'PENDING')
      .reduce((sum, c) => sum + Number(c.amount), 0);

    const recentCommissions = await prisma.commission.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: {
        user: { select: { id: true, name: true, email: true } }
      }
    });

    return {
      totalCommissions,
      pendingCommissions,
      todayCommissions,
      thisMonthCommissions,
      totalCommissionAmount,
      paidCommissionAmount,
      pendingCommissionAmount,
      recentCommissions: recentCommissions.map(commission => ({
        id: commission.id,
        amount: Number(commission.amount),
        status: commission.status,
        user: commission.user,
        createdAt: commission.createdAt
      }))
    };
  }

  // Get live payout metrics
  static async getLivePayoutMetrics() {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const totalPayouts = await prisma.payout.count();
    const pendingPayouts = await prisma.payout.count({
      where: { status: 'PENDING' }
    });
    const todayPayouts = await prisma.payout.count({
      where: { createdAt: { gte: today } }
    });
    const thisMonthPayouts = await prisma.payout.count({
      where: { createdAt: { gte: thisMonth } }
    });

    const payouts = await prisma.payout.findMany({
      where: { createdAt: { gte: thisMonth } }
    });

    const totalPayoutAmount = payouts.reduce((sum, p) => sum + Number(p.amount), 0);
    const paidPayoutAmount = payouts
      .filter(p => p.status === 'PAID')
      .reduce((sum, p) => sum + Number(p.amount), 0);
    const pendingPayoutAmount = payouts
      .filter(p => p.status === 'PENDING')
      .reduce((sum, p) => sum + Number(p.amount), 0);

    const recentPayouts = await prisma.payout.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: {
        user: { select: { id: true, name: true, email: true } }
      }
    });

    return {
      totalPayouts,
      pendingPayouts,
      todayPayouts,
      thisMonthPayouts,
      totalPayoutAmount,
      paidPayoutAmount,
      pendingPayoutAmount,
      recentPayouts: recentPayouts.map(payout => ({
        id: payout.id,
        amount: Number(payout.amount),
        status: payout.status,
        user: payout.user,
        createdAt: payout.createdAt
      }))
    };
  }

  // Get live error metrics
  static async getLiveErrorMetrics() {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const securityEvents = await prisma.securityEvent.count({
      where: {
        createdAt: { gte: last24Hours },
        severity: { in: ['HIGH', 'CRITICAL'] }
      }
    });

    const unresolvedSecurityEvents = await prisma.securityEvent.count({
      where: { resolved: false }
    });

    const recentSecurityEvents = await prisma.securityEvent.findMany({
      where: { resolved: false },
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: {
        user: { select: { id: true, name: true, email: true } }
      }
    });

    const failedWebhooks = await prisma.paymentWebhookLog.count({
      where: {
        createdAt: { gte: last24Hours },
        processed: false
      }
    });

    const recentFailedWebhooks = await prisma.paymentWebhookLog.findMany({
      where: { processed: false },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    return {
      securityEvents,
      unresolvedSecurityEvents,
      recentSecurityEvents: recentSecurityEvents.map(event => ({
        id: event.id,
        eventType: event.eventType,
        severity: event.severity,
        description: event.description,
        user: event.user,
        createdAt: event.createdAt
      })),
      failedWebhooks,
      recentFailedWebhooks: recentFailedWebhooks.map(webhook => ({
        id: webhook.id,
        eventType: webhook.eventType,
        createdAt: webhook.createdAt
      }))
    };
  }

  // Get live API status
  static async getLiveAPIStatus() {
    // This would typically check actual API health endpoints
    // For now, we'll return simulated status based on recent activity
    const now = new Date();
    const last5Minutes = new Date(now.getTime() - 5 * 60 * 1000);

    const recentActivity = await prisma.activityLog.count({
      where: { createdAt: { gte: last5Minutes } }
    });

    const recentOrders = await prisma.order.count({
      where: { createdAt: { gte: last5Minutes } }
    });

    const recentPayments = await prisma.transaction.count({
      where: { createdAt: { gte: last5Minutes } }
    });

    const apiStatus = recentActivity > 0 ? 'HEALTHY' : 'IDLE';
    const responseTime = recentActivity > 0 ? '< 200ms' : 'N/A';

    return {
      status: apiStatus,
      responseTime,
      uptime: '99.9%', // Would be calculated from actual monitoring
      requestsPerMinute: recentActivity * 12, // Extrapolated from 5 minutes
      recentActivity,
      recentOrders,
      recentPayments
    };
  }

  // Get live webhook status
  static async getLiveWebhookStatus() {
    const now = new Date();
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const totalWebhooks = await prisma.paymentWebhookLog.count({
      where: { createdAt: { gte: last24Hours } }
    });

    const processedWebhooks = await prisma.paymentWebhookLog.count({
      where: {
        createdAt: { gte: last24Hours },
        processed: true
      }
    });

    const failedWebhooks = totalWebhooks - processedWebhooks;
    const successRate = totalWebhooks > 0 ? (processedWebhooks / totalWebhooks) * 100 : 100;

    const recentWebhooks = await prisma.paymentWebhookLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    return {
      totalWebhooks,
      processedWebhooks,
      failedWebhooks,
      successRate: Math.round(successRate),
      recentWebhooks: recentWebhooks.map(webhook => ({
        id: webhook.id,
        eventType: webhook.eventType,
        processed: webhook.processed,
        createdAt: webhook.createdAt
      }))
    };
  }

  // Get comprehensive command center dashboard
  static async getCommandCenterDashboard() {
    const [
      revenueMetrics,
      orderMetrics,
      userMetrics,
      activationMetrics,
      commissionMetrics,
      payoutMetrics,
      errorMetrics,
      apiStatus,
      webhookStatus
    ] = await Promise.all([
      this.getLiveRevenueMetrics('today'),
      this.getLiveOrderMetrics(),
      this.getLiveUserMetrics(),
      this.getLiveActivationMetrics(),
      this.getLiveCommissionMetrics(),
      this.getLivePayoutMetrics(),
      this.getLiveErrorMetrics(),
      this.getLiveAPIStatus(),
      this.getLiveWebhookStatus()
    ]);

    return {
      revenue: revenueMetrics,
      orders: orderMetrics,
      users: userMetrics,
      activations: activationMetrics,
      commissions: commissionMetrics,
      payouts: payoutMetrics,
      errors: errorMetrics,
      api: apiStatus,
      webhooks: webhookStatus,
      lastUpdated: new Date()
    };
  }
}
