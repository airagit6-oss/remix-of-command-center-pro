// ============================================================
// RENEWAL ENGINE SERVICE
// License/Subscription Renewal, Upgrade/Expiry Reminder, Auto Renewal, Analytics
// ============================================================

import { PrismaClient } from '@prisma/client';
import { NotificationService } from './notification.service';

const prisma = new PrismaClient();

export class RenewalEngineService {
  // Calculate next renewal date based on period
  static calculateNextRenewalDate(currentDate: Date, period: string): Date {
    const nextDate = new Date(currentDate);
    
    switch (period.toLowerCase()) {
      case 'monthly':
        nextDate.setMonth(nextDate.getMonth() + 1);
        break;
      case 'yearly':
        nextDate.setFullYear(nextDate.getFullYear() + 1);
        break;
      case 'quarterly':
        nextDate.setMonth(nextDate.getMonth() + 3);
        break;
      case 'weekly':
        nextDate.setDate(nextDate.getDate() + 7);
        break;
      default:
        nextDate.setFullYear(nextDate.getFullYear() + 1);
    }
    
    return nextDate;
  }

  // Renew License
  static async renewLicense(licenseId: string, paymentMethod?: string, paymentId?: string) {
    const license = await prisma.license.findUnique({
      where: { id: licenseId },
      include: { order: { include: { user: true } } }
    });

    if (!license) {
      throw new Error('License not found');
    }

    if (!license.validUntil) {
      throw new Error('License has no expiry date');
    }

    const previousValidUntil = license.validUntil;
    const renewalPeriod = license.renewalPeriod || 'yearly';
    const newValidUntil = this.calculateNextRenewalDate(previousValidUntil, renewalPeriod);

    // Calculate renewal amount (simplified - would be based on product pricing)
    const amount = this.calculateRenewalAmount(license.type, renewalPeriod);

    // Create renewal record
    const renewal = await prisma.licenseRenewal.create({
      data: {
        licenseId,
        previousValidUntil,
        newValidUntil,
        amount,
        currency: 'USD',
        paymentMethod,
        paymentId,
        status: 'COMPLETED'
      }
    });

    // Update license
    const updatedLicense = await prisma.license.update({
      where: { id: licenseId },
      data: {
        validUntil: newValidUntil,
        lastRenewedAt: new Date(),
        nextRenewalAt: this.calculateNextRenewalDate(newValidUntil, renewalPeriod),
        renewalCount: license.renewalCount + 1,
        status: 'ACTIVE'
      }
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: license.order.userId,
        action: 'LICENSE_RENEWED',
        resource: 'License',
        resourceId: licenseId,
        metadata: { renewalId: renewal.id, amount, newValidUntil }
      }
    });

    // Send notification
    await NotificationService.sendNotification(
      license.order.userId,
      'LICENSE',
      'License Renewed',
      `Your license has been successfully renewed until ${newValidUntil.toISOString().split('T')[0]}`,
      ['IN_APP', 'EMAIL'],
      { licenseId, renewalId: renewal.id }
    );

    return { license: updatedLicense, renewal };
  }

  // Renew Subscription
  static async renewSubscription(subscriptionId: string, paymentMethod?: string, paymentId?: string) {
    const subscription = await prisma.subscription.findUnique({
      where: { id: subscriptionId },
      include: { user: true }
    });

    if (!subscription) {
      throw new Error('Subscription not found');
    }

    const previousPeriodEnd = subscription.currentPeriodEnd;
    const renewalPeriod = subscription.renewalPeriod || 'monthly';
    const newPeriodEnd = this.calculateNextRenewalDate(previousPeriodEnd, renewalPeriod);

    // Calculate renewal amount (simplified - would be based on subscription plan)
    const amount = this.calculateRenewalAmount('STANDARD', renewalPeriod);

    // Create renewal record
    const renewal = await prisma.subscriptionRenewal.create({
      data: {
        subscriptionId,
        previousPeriodEnd,
        newPeriodEnd,
        amount,
        currency: 'USD',
        paymentMethod,
        paymentId,
        status: 'COMPLETED'
      }
    });

    // Update subscription
    const updatedSubscription = await prisma.subscription.update({
      where: { id: subscriptionId },
      data: {
        currentPeriodStart: previousPeriodEnd,
        currentPeriodEnd: newPeriodEnd,
        lastRenewedAt: new Date(),
        nextRenewalAt: this.calculateNextRenewalDate(newPeriodEnd, renewalPeriod),
        renewalCount: subscription.renewalCount + 1,
        status: 'ACTIVE'
      }
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: subscription.userId,
        action: 'SUBSCRIPTION_RENEWED',
        resource: 'Subscription',
        resourceId: subscriptionId,
        metadata: { renewalId: renewal.id, amount, newPeriodEnd }
      }
    });

    // Send notification
    await NotificationService.sendNotification(
      subscription.userId,
      'WALLET',
      'Subscription Renewed',
      `Your subscription has been successfully renewed until ${newPeriodEnd.toISOString().split('T')[0]}`,
      ['IN_APP', 'EMAIL'],
      { subscriptionId, renewalId: renewal.id }
    );

    return { subscription: updatedSubscription, renewal };
  }

  // Calculate renewal amount (simplified logic)
  private static calculateRenewalAmount(type: string, period: string): number {
    const basePrices: any = {
      STANDARD: 99,
      PREMIUM: 199,
      ENTERPRISE: 499,
      TRIAL: 0
    };

    const periodMultipliers: any = {
      monthly: 1,
      yearly: 10,
      quarterly: 3,
      weekly: 0.25
    };

    const basePrice = basePrices[type] || 99;
    const multiplier = periodMultipliers[period] || 10;

    return basePrice * multiplier;
  }

  // Send expiry reminder
  static async sendExpiryReminder(licenseId: string, daysBefore: number) {
    const license = await prisma.license.findUnique({
      where: { id: licenseId },
      include: { order: { include: { user: true } } }
    });

    if (!license || !license.validUntil) {
      return;
    }

    const daysUntilExpiry = Math.floor((license.validUntil.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

    if (daysUntilExpiry !== daysBefore) {
      return;
    }

    await NotificationService.sendNotification(
      license.order.userId,
      'LICENSE',
      'License Expiring Soon',
      `Your license will expire in ${daysBefore} day(s). Renew now to avoid service interruption.`,
      ['IN_APP', 'EMAIL'],
      { licenseId, expiryDate: license.validUntil }
    );

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: license.order.userId,
        action: 'EXPIRY_REMINDER_SENT',
        resource: 'License',
        resourceId: licenseId,
        metadata: { daysBefore, expiryDate: license.validUntil }
      }
    });
  }

  // Send upgrade reminder
  static async sendUpgradeReminder(licenseId: string) {
    const license = await prisma.license.findUnique({
      where: { id: licenseId },
      include: { order: { include: { user: true } } }
    });

    if (!license) {
      return;
    }

    await NotificationService.sendNotification(
      license.order.userId,
      'PRODUCT',
      'Upgrade Available',
      'A new version of your licensed product is available. Upgrade to access the latest features.',
      ['IN_APP', 'EMAIL'],
      { licenseId }
    );
  }

  // Process auto-renewals (scheduled job)
  static async processAutoRenewals() {
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    // Auto-renew licenses
    const licensesToRenew = await prisma.license.findMany({
      where: {
        autoRenew: true,
        nextRenewalAt: { lte: tomorrow },
        status: { in: ['ACTIVE', 'EXPIRED'] }
      }
    });

    for (const license of licensesToRenew) {
      try {
        await this.renewLicense(license.id, 'AUTO_RENEWAL');
      } catch (error) {
        console.error(`Failed to auto-renew license ${license.id}:`, error);
      }
    }

    // Auto-renew subscriptions
    const subscriptionsToRenew = await prisma.subscription.findMany({
      where: {
        autoRenew: true,
        nextRenewalAt: { lte: tomorrow },
        status: { in: ['ACTIVE', 'EXPIRED'] },
        cancelAtPeriodEnd: false
      }
    });

    for (const subscription of subscriptionsToRenew) {
      try {
        await this.renewSubscription(subscription.id, 'AUTO_RENEWAL');
      } catch (error) {
        console.error(`Failed to auto-renew subscription ${subscription.id}:`, error);
      }
    }

    return {
      licensesRenewed: licensesToRenew.length,
      subscriptionsRenewed: subscriptionsToRenew.length
    };
  }

  // Get renewal analytics
  static async getRenewalAnalytics(timeframe: 'today' | 'week' | 'month' | 'year' = 'month') {
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

    const licenseRenewals = await prisma.licenseRenewal.findMany({
      where: { renewedAt: { gte: startDate } }
    });

    const subscriptionRenewals = await prisma.subscriptionRenewal.findMany({
      where: { renewedAt: { gte: startDate } }
    });

    const totalLicenseRenewals = licenseRenewals.length;
    const totalSubscriptionRenewals = subscriptionRenewals.length;
    const totalRenewalRevenue = licenseRenewals.reduce((sum, r) => sum + Number(r.amount), 0) +
      subscriptionRenewals.reduce((sum, r) => sum + Number(r.amount), 0);

    const successfulRenewals = licenseRenewals.filter(r => r.status === 'COMPLETED').length +
      subscriptionRenewals.filter(r => r.status === 'COMPLETED').length;

    const failedRenewals = licenseRenewals.filter(r => r.status === 'FAILED').length +
      subscriptionRenewals.filter(r => r.status === 'FAILED').length;

    return {
      timeframe,
      totalLicenseRenewals,
      totalSubscriptionRenewals,
      totalRenewals: totalLicenseRenewals + totalSubscriptionRenewals,
      totalRenewalRevenue,
      successfulRenewals,
      failedRenewals,
      successRate: totalRenewals > 0 ? (successfulRenewals / totalRenewals) * 100 : 100
    };
  }

  // Get upcoming renewals
  static async getUpcomingRenewals(days: number = 30) {
    const now = new Date();
    const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

    const licenses = await prisma.license.findMany({
      where: {
        nextRenewalAt: { gte: now, lte: futureDate },
        autoRenew: true
      },
      include: {
        order: { include: { user: { select: { id: true, name: true, email: true } } } }
      },
      orderBy: { nextRenewalAt: 'asc' }
    });

    const subscriptions = await prisma.subscription.findMany({
      where: {
        nextRenewalAt: { gte: now, lte: futureDate },
        autoRenew: true,
        cancelAtPeriodEnd: false
      },
      include: { user: { select: { id: true, name: true, email: true } } },
      orderBy: { nextRenewalAt: 'asc' }
    });

    return {
      licenses: licenses.map(l => ({
        id: l.id,
        licenseKey: l.licenseKey,
        type: l.type,
        nextRenewalAt: l.nextRenewalAt,
        user: l.order.user
      })),
      subscriptions: subscriptions.map(s => ({
        id: s.id,
        provider: s.provider,
        status: s.status,
        nextRenewalAt: s.nextRenewalAt,
        user: s.user
      }))
    };
  }

  // Enable auto-renewal
  static async enableAutoRenewal(type: 'license' | 'subscription', id: string) {
    if (type === 'license') {
      const license = await prisma.license.findUnique({ where: { id } });
      if (!license) throw new Error('License not found');

      const renewalPeriod = license.renewalPeriod || 'yearly';
      const nextRenewalAt = license.validUntil ? this.calculateNextRenewalDate(license.validUntil, renewalPeriod) : null;

      return prisma.license.update({
        where: { id },
        data: { autoRenew: true, nextRenewalAt }
      });
    } else {
      const subscription = await prisma.subscription.findUnique({ where: { id } });
      if (!subscription) throw new Error('Subscription not found');

      const renewalPeriod = subscription.renewalPeriod || 'monthly';
      const nextRenewalAt = this.calculateNextRenewalDate(subscription.currentPeriodEnd, renewalPeriod);

      return prisma.subscription.update({
        where: { id },
        data: { autoRenew: true, nextRenewalAt }
      });
    }
  }

  // Disable auto-renewal
  static async disableAutoRenewal(type: 'license' | 'subscription', id: string) {
    if (type === 'license') {
      return prisma.license.update({
        where: { id },
        data: { autoRenew: false, nextRenewalAt: null }
      });
    } else {
      return prisma.subscription.update({
        where: { id },
        data: { autoRenew: false, nextRenewalAt: null }
      });
    }
  }
}
