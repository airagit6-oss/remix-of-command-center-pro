// ============================================================
// DOWNLOAD SECURITY SERVICE
// One Time URL, Expiring URL, IP/Device Validation, Abuse Detection, Audit Log
// ============================================================

import { PrismaClient } from '@prisma/client';
import { randomBytes, createHash } from 'crypto';

const prisma = new PrismaClient();

export class DownloadSecurityService {
  // Generate secure download token
  static generateSecureToken(): string {
    return randomBytes(32).toString('hex');
  }

  // Create one-time download URL
  static async createOneTimeDownloadUrl(licenseId: string, userId: string, ipAddress?: string, userAgent?: string) {
    const license = await prisma.license.findUnique({
      where: { id: licenseId },
      include: { order: { include: { user: true } } }
    });

    if (!license) {
      throw new Error('License not found');
    }

    if (license.order.userId !== userId) {
      throw new Error('Unauthorized access to license');
    }

    if (license.status !== 'ACTIVE') {
      throw new Error('License is not active');
    }

    if (license.validUntil && license.validUntil < new Date()) {
      throw new Error('License has expired');
    }

    if (license.maxDownloads !== -1 && license.currentDownloads >= license.maxDownloads) {
      throw new Error('Download limit exceeded');
    }

    const token = this.generateSecureToken();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour expiry

    await prisma.license.update({
      where: { id: licenseId },
      data: {
        secureDownloadToken: token,
        secureDownloadExpiresAt: expiresAt
      }
    });

    // Log download request
    await prisma.activityLog.create({
      data: {
        userId,
        action: 'DOWNLOAD_URL_GENERATED',
        resource: 'License',
        resourceId: licenseId,
        metadata: { token, expiresAt, type: 'one-time' },
        ipAddress,
        userAgent
      }
    });

    return {
      token,
      expiresAt,
      downloadUrl: `/api/v1/downloads/license/${token}`
    };
  }

  // Create expiring download URL (custom expiry)
  static async createExpiringDownloadUrl(licenseId: string, userId: string, expiryMinutes: number = 60, ipAddress?: string, userAgent?: string) {
    const license = await prisma.license.findUnique({
      where: { id: licenseId },
      include: { order: { include: { user: true } } }
    });

    if (!license) {
      throw new Error('License not found');
    }

    if (license.order.userId !== userId) {
      throw new Error('Unauthorized access to license');
    }

    if (license.status !== 'ACTIVE') {
      throw new Error('License is not active');
    }

    if (license.validUntil && license.validUntil < new Date()) {
      throw new Error('License has expired');
    }

    const token = this.generateSecureToken();
    const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);

    await prisma.license.update({
      where: { id: licenseId },
      data: {
        secureDownloadToken: token,
        secureDownloadExpiresAt: expiresAt
      }
    });

    // Log download request
    await prisma.activityLog.create({
      data: {
        userId,
        action: 'DOWNLOAD_URL_GENERATED',
        resource: 'License',
        resourceId: licenseId,
        metadata: { token, expiresAt, type: 'expiring', expiryMinutes },
        ipAddress,
        userAgent
      }
    });

    return {
      token,
      expiresAt,
      downloadUrl: `/api/v1/downloads/license/${token}`
    };
  }

  // Validate download token
  static async validateDownloadToken(token: string, ipAddress?: string, userAgent?: string) {
    const license = await prisma.license.findFirst({
      where: {
        secureDownloadToken: token,
        secureDownloadExpiresAt: { gt: new Date() }
      },
      include: { order: { include: { user: true } } }
    });

    if (!license) {
      throw new Error('Invalid or expired download token');
    }

    // IP validation if configured
    if (license.ipBinding && ipAddress) {
      if (license.ipBinding !== ipAddress) {
        await this.logDownloadViolation(license.id, license.order.userId, 'IP_MISMATCH', ipAddress, userAgent);
        throw new Error('IP address validation failed');
      }
    }

    // Device validation if configured
    if (license.deviceBinding && userAgent) {
      const deviceHash = this.hashUserAgent(userAgent);
      if (license.deviceBinding !== deviceHash) {
        await this.logDownloadViolation(license.id, license.order.userId, 'DEVICE_MISMATCH', ipAddress, userAgent);
        throw new Error('Device validation failed');
      }
    }

    // Domain validation if configured
    if (license.domainBinding) {
      // Domain validation would be done via referrer header in actual implementation
      // For now, we'll just check if it's configured
    }

    return license;
  }

  // Process download
  static async processDownload(token: string, ipAddress?: string, userAgent?: string) {
    const license = await this.validateDownloadToken(token, ipAddress, userAgent);

    // Check download limit
    if (license.maxDownloads !== -1 && license.currentDownloads >= license.maxDownloads) {
      await this.logDownloadViolation(license.id, license.order.userId, 'DOWNLOAD_LIMIT_EXCEEDED', ipAddress, userAgent);
      throw new Error('Download limit exceeded');
    }

    // Increment download count
    await prisma.license.update({
      where: { id: license.id },
      data: {
        currentDownloads: license.currentDownloads + 1
      }
    });

    // Log successful download
    await prisma.activityLog.create({
      data: {
        userId: license.order.userId,
        action: 'DOWNLOAD_COMPLETED',
        resource: 'License',
        resourceId: license.id,
        metadata: { ipAddress, userAgent },
        ipAddress,
        userAgent
      }
    });

    // Log to license analytics
    await prisma.licenseAnalytics.create({
      data: {
        licenseId: license.id,
        eventType: 'DOWNLOAD',
        metadata: { ipAddress, userAgent },
        ipAddress,
        userAgent
      }
    });

    // Invalidate one-time token after use
    await prisma.license.update({
      where: { id: license.id },
      data: {
        secureDownloadToken: null,
        secureDownloadExpiresAt: null
      }
    });

    return {
      success: true,
      licenseId: license.id,
      downloadCount: license.currentDownloads + 1
    };
  }

  // Detect abuse
  static async detectAbuse(userId: string, ipAddress?: string) {
    const now = new Date();
    const lastHour = new Date(now.getTime() - 60 * 60 * 1000);

    // Check for excessive download requests from same IP
    const downloadRequests = await prisma.activityLog.count({
      where: {
        action: 'DOWNLOAD_URL_GENERATED',
        ipAddress,
        createdAt: { gte: lastHour }
      }
    });

    if (downloadRequests > 10) {
      await this.logAbuseDetection(userId, 'EXCESSIVE_DOWNLOAD_REQUESTS', ipAddress);
      return { detected: true, reason: 'EXCESSIVE_DOWNLOAD_REQUESTS', count: downloadRequests };
    }

    // Check for download attempts from multiple IPs
    const recentDownloads = await prisma.activityLog.findMany({
      where: {
        userId,
        action: 'DOWNLOAD_COMPLETED',
        createdAt: { gte: lastHour }
      },
      select: { ipAddress: true }
    });

    const uniqueIPs = new Set(recentDownloads.map(d => d.ipAddress)).size;
    if (uniqueIPs > 5) {
      await this.logAbuseDetection(userId, 'MULTIPLE_IP_DOWNLOADS', ipAddress);
      return { detected: true, reason: 'MULTIPLE_IP_DOWNLOADS', count: uniqueIPs };
    }

    return { detected: false };
  }

  // Log download violation
  private static async logDownloadViolation(licenseId: string, userId: string, violationType: string, ipAddress?: string, userAgent?: string) {
    await prisma.activityLog.create({
      data: {
        userId,
        action: 'DOWNLOAD_VIOLATION',
        resource: 'License',
        resourceId: licenseId,
        metadata: { violationType, ipAddress, userAgent },
        ipAddress,
        userAgent
      }
    });

    // Log to license analytics
    await prisma.licenseAnalytics.create({
      data: {
        licenseId,
        eventType: 'DOWNLOAD_FAILED',
        metadata: { violationType, ipAddress, userAgent },
        ipAddress,
        userAgent
      }
    });

    // Increment piracy alerts if configured
    await prisma.license.update({
      where: { id: licenseId },
      data: {
        piracyAlerts: { increment: 1 },
        lastPiracyCheckAt: new Date()
      }
    });
  }

  // Log abuse detection
  private static async logAbuseDetection(userId: string, abuseType: string, ipAddress?: string) {
    await prisma.securityEvent.create({
      data: {
        userId,
        eventType: 'SUSPICIOUS_ACTIVITY' as any,
        severity: 'HIGH' as any,
        description: `Download abuse detected: ${abuseType}`,
        metadata: { abuseType, ipAddress },
        ipAddress
      }
    });
  }

  // Get download audit log
  static async getDownloadAuditLog(licenseId: string, limit: number = 50) {
    const activities = await prisma.activityLog.findMany({
      where: {
        resourceId: licenseId,
        action: { in: ['DOWNLOAD_URL_GENERATED', 'DOWNLOAD_COMPLETED', 'DOWNLOAD_VIOLATION'] }
      },
      orderBy: { createdAt: 'desc' },
      take: limit
    });

    return activities.map(activity => ({
      id: activity.id,
      action: activity.action,
      metadata: activity.metadata,
      ipAddress: activity.ipAddress,
      userAgent: activity.userAgent,
      timestamp: activity.createdAt
    }));
  }

  // Get download statistics
  static async getDownloadStatistics(licenseId: string) {
    const license = await prisma.license.findUnique({
      where: { id: licenseId },
      include: {
        analytics: {
          where: { eventType: 'DOWNLOAD' },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!license) {
      throw new Error('License not found');
    }

    const totalDownloads = license.currentDownloads;
    const maxDownloads = license.maxDownloads;
    const downloadsRemaining = maxDownloads === -1 ? -1 : Math.max(0, maxDownloads - totalDownloads);
    const downloadHistory = license.analytics;

    return {
      totalDownloads,
      maxDownloads,
      downloadsRemaining,
      downloadHistory: downloadHistory.map(a => ({
        timestamp: a.createdAt,
        ipAddress: a.ipAddress,
        userAgent: a.userAgent
      }))
    };
  }

  // Reset download count (admin only)
  static async resetDownloadCount(licenseId: string, adminId: string) {
    const license = await prisma.license.update({
      where: { id: licenseId },
      data: {
        currentDownloads: 0,
        piracyAlerts: 0
      }
    });

    // Log admin action
    await prisma.activityLog.create({
      data: {
        userId: adminId,
        action: 'DOWNLOAD_COUNT_RESET',
        resource: 'License',
        resourceId: licenseId,
        metadata: { previousCount: license.currentDownloads }
      }
    });

    return license;
  }

  // Hash user agent for device identification
  private static hashUserAgent(userAgent: string): string {
    return createHash('sha256').update(userAgent).digest('hex').substring(0, 32);
  }

  // Set IP binding
  static async setIPBinding(licenseId: string, ipAddress: string, adminId: string) {
    const license = await prisma.license.update({
      where: { id: licenseId },
      data: { ipBinding: ipAddress }
    });

    await prisma.activityLog.create({
      data: {
        userId: adminId,
        action: 'IP_BINDING_SET',
        resource: 'License',
        resourceId: licenseId,
        metadata: { ipAddress }
      }
    });

    return license;
  }

  // Set device binding
  static async setDeviceBinding(licenseId: string, userAgent: string, adminId: string) {
    const deviceHash = this.hashUserAgent(userAgent);
    const license = await prisma.license.update({
      where: { id: licenseId },
      data: { deviceBinding: deviceHash }
    });

    await prisma.activityLog.create({
      data: {
        userId: adminId,
        action: 'DEVICE_BINDING_SET',
        resource: 'License',
        resourceId: licenseId,
        metadata: { deviceHash }
      }
    });

    return license;
  }

  // Set domain binding
  static async setDomainBinding(licenseId: string, domain: string, adminId: string) {
    const license = await prisma.license.update({
      where: { id: licenseId },
      data: { domainBinding: domain }
    });

    await prisma.activityLog.create({
      data: {
        userId: adminId,
        action: 'DOMAIN_BINDING_SET',
        resource: 'License',
        resourceId: licenseId,
        metadata: { domain }
      }
    });

    return license;
  }
}
