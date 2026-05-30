// ============================================================
// OPERATIONS CENTER SERVICE
// Pending Reviews/Approvals/Payments/Webhooks/Emails/Licenses - One Screen
// ============================================================

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class OperationsCenterService {
  // Get operations center dashboard
  static async getOperationsCenterDashboard() {
    const [
      pendingReviews,
      pendingApprovals,
      failedPayments,
      failedWebhooks,
      failedEmails,
      failedLicenses,
      pendingPayouts,
      pendingKYC,
      pendingRefunds
    ] = await Promise.all([
      this.getPendingReviews(),
      this.getPendingApprovals(),
      this.getFailedPayments(),
      this.getFailedWebhooks(),
      this.getFailedEmails(),
      this.getFailedLicenses(),
      this.getPendingPayouts(),
      this.getPendingKYC(),
      this.getPendingRefunds()
    ]);

    return {
      summary: {
        totalPending: pendingReviews.count + pendingApprovals.count + pendingPayouts.count + pendingKYC.count + pendingRefunds.count,
        totalFailed: failedPayments.count + failedWebhooks.count + failedEmails.count + failedLicenses.count
      },
      pendingReviews,
      pendingApprovals,
      failedPayments,
      failedWebhooks,
      failedEmails,
      failedLicenses,
      pendingPayouts,
      pendingKYC,
      pendingRefunds,
      lastUpdated: new Date()
    };
  }

  // Get pending reviews
  static async getPendingReviews() {
    const reviews = await prisma.review.findMany({
      where: { status: 'PENDING' },
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: {
        user: { select: { id: true, name: true, email: true } },
        product: { select: { id: true, name: true } }
      }
    });

    return {
      count: await prisma.review.count({ where: { status: 'PENDING' } }),
      items: reviews.map(r => ({
        id: r.id,
        rating: r.rating,
        comment: r.comment,
        user: r.user,
        product: r.product,
        createdAt: r.createdAt
      }))
    };
  }

  // Get pending approvals
  static async getPendingApprovals() {
    // Pending products
    const pendingProducts = await prisma.product.findMany({
      where: { status: 'PENDING' },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        author: { select: { id: true, name: true, email: true } }
      }
    });

    // Pending author profiles
    const pendingAuthors = await prisma.authorProfile.findMany({
      where: { status: 'PENDING' },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        user: { select: { id: true, name: true, email: true } }
      }
    });

    return {
      count: pendingProducts.length + pendingAuthors.length,
      items: [
        ...pendingProducts.map(p => ({
          type: 'PRODUCT',
          id: p.id,
          name: p.name,
          author: p.author,
          createdAt: p.createdAt
        })),
        ...pendingAuthors.map(a => ({
          type: 'AUTHOR',
          id: a.id,
          name: a.user.name,
          email: a.user.email,
          createdAt: a.createdAt
        }))
      ]
    };
  }

  // Get failed payments
  static async getFailedPayments() {
    const payments = await prisma.paymentIntent.findMany({
      where: { status: 'FAILED' },
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: {
        order: {
          include: {
            user: { select: { id: true, name: true, email: true } }
          }
        }
      }
    });

    return {
      count: await prisma.paymentIntent.count({ where: { status: 'FAILED' } }),
      items: payments.map(p => ({
        id: p.id,
        amount: Number(p.amount),
        currency: p.currency,
        order: p.order,
        user: p.order.user,
        createdAt: p.createdAt
      }))
    };
  }

  // Get failed webhooks
  static async getFailedWebhooks() {
    const webhooks = await prisma.paymentWebhookLog.findMany({
      where: { processed: false },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    return {
      count: await prisma.paymentWebhookLog.count({ where: { processed: false } }),
      items: webhooks.map(w => ({
        id: w.id,
        provider: w.provider,
        eventType: w.eventType,
        createdAt: w.createdAt
      }))
    };
  }

  // Get failed emails (simulated - would integrate with email service)
  static async getFailedEmails() {
    // This would query an email service for failed deliveries
    // For now, we'll return a placeholder
    const failedNotifications = await prisma.notificationHistory.findMany({
      where: { status: 'FAILED' },
      orderBy: { sentAt: 'desc' },
      take: 10
    });

    return {
      count: failedNotifications.length,
      items: failedNotifications.map(n => ({
        id: n.id,
        type: n.type,
        channel: n.channel,
        error: n.error,
        sentAt: n.sentAt
      }))
    };
  }

  // Get failed licenses
  static async getFailedLicenses() {
    const licenses = await prisma.license.findMany({
      where: { status: { in: ['SUSPENDED', 'REVOKED'] } },
      orderBy: { updatedAt: 'desc' },
      take: 10,
      include: {
        order: {
          include: {
            user: { select: { id: true, name: true, email: true } }
          }
        }
      }
    });

    return {
      count: await prisma.license.count({ where: { status: { in: ['SUSPENDED', 'REVOKED'] } } }),
      items: licenses.map(l => ({
        id: l.id,
        licenseKey: l.licenseKey,
        type: l.type,
        status: l.status,
        user: l.order.user,
        updatedAt: l.updatedAt
      }))
    };
  }

  // Get pending payouts
  static async getPendingPayouts() {
    const payouts = await prisma.payout.findMany({
      where: { status: 'PENDING' },
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: {
        user: { select: { id: true, name: true, email: true } }
      }
    });

    return {
      count: await prisma.payout.count({ where: { status: 'PENDING' } }),
      items: payouts.map(p => ({
        id: p.id,
        amount: Number(p.amount),
        currency: p.currency,
        user: p.user,
        createdAt: p.createdAt
      }))
    };
  }

  // Get pending KYC
  static async getPendingKYC() {
    const kycRecords = await prisma.kYCRecord.findMany({
      where: { status: 'PENDING' },
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: {
        user: { select: { id: true, name: true, email: true } }
      }
    });

    return {
      count: await prisma.kYCRecord.count({ where: { status: 'PENDING' } }),
      items: kycRecords.map(k => ({
        id: k.id,
        type: k.type,
        user: k.user,
        createdAt: k.createdAt
      }))
    };
  }

  // Get pending refunds
  static async getPendingRefunds() {
    const refunds = await prisma.refund.findMany({
      where: { status: 'PENDING' },
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: {
        order: {
          include: {
            user: { select: { id: true, name: true, email: true } }
          }
        }
      }
    });

    return {
      count: await prisma.refund.count({ where: { status: 'PENDING' } }),
      items: refunds.map(r => ({
        id: r.id,
        amount: Number(r.amount),
        reason: r.reason,
        order: r.order,
        user: r.order.user,
        createdAt: r.createdAt
      }))
    };
  }

  // Get operations statistics
  static async getOperationsStatistics(timeframe: 'today' | 'week' | 'month' = 'today') {
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
    }

    const [
      reviewsProcessed,
      approvalsProcessed,
      paymentsProcessed,
      webhooksProcessed,
      payoutsProcessed,
      kycProcessed,
      refundsProcessed
    ] = await Promise.all([
      prisma.review.count({ where: { updatedAt: { gte: startDate } } }),
      prisma.product.count({ where: { updatedAt: { gte: startDate } } }) + prisma.authorProfile.count({ where: { updatedAt: { gte: startDate } } }),
      prisma.paymentIntent.count({ where: { updatedAt: { gte: startDate } } }),
      prisma.paymentWebhookLog.count({ where: { createdAt: { gte: startDate } } }),
      prisma.payout.count({ where: { updatedAt: { gte: startDate } } }),
      prisma.kYCRecord.count({ where: { updatedAt: { gte: startDate } } }),
      prisma.refund.count({ where: { updatedAt: { gte: startDate } } })
    ]);

    return {
      timeframe,
      reviewsProcessed,
      approvalsProcessed,
      paymentsProcessed,
      webhooksProcessed,
      payoutsProcessed,
      kycProcessed,
      refundsProcessed,
      totalProcessed: reviewsProcessed + approvalsProcessed + paymentsProcessed + webhooksProcessed + payoutsProcessed + kycProcessed + refundsProcessed
    };
  }

  // Get critical alerts
  static async getCriticalAlerts() {
    const now = new Date();
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const [
      highSecurityEvents,
      criticalFailedPayments,
      expiredLicenses,
      overduePayouts
    ] = await Promise.all([
      prisma.securityEvent.count({
        where: {
          severity: 'CRITICAL',
          createdAt: { gte: last24Hours },
          resolved: false
        }
      }),
      prisma.paymentIntent.count({
        where: {
          status: 'FAILED',
          createdAt: { gte: last24Hours }
        }
      }),
      prisma.license.count({
        where: {
          status: 'EXPIRED',
          validUntil: { lte: now }
        }
      }),
      prisma.payout.count({
        where: {
          status: 'PENDING',
          createdAt: { lte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) }
        }
      })
    ]);

    return {
      highSecurityEvents,
      criticalFailedPayments,
      expiredLicenses,
      overduePayouts,
      totalCritical: highSecurityEvents + criticalFailedPayments + expiredLicenses + overduePayouts
    };
  }
}
