// ============================================================
// LICENSE PROTECTION SERVICE
// Advanced license protection: device binding, domain binding, download limits, piracy detection
// ============================================================

import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

export class LicenseProtectionService {
  // License Key Generation
  static generateLicenseKey(): string {
    const prefix = 'SV-'; // SoftwareVala prefix
    const randomPart = crypto.randomBytes(16).toString('hex').toUpperCase();
    const checksum = crypto.createHash('md5').update(randomPart).digest('hex').substring(0, 4).toUpperCase();
    return `${prefix}${randomPart}-${checksum}`;
  }

  // Device Binding
  static async bindDevice(licenseId: string, deviceId: string, deviceInfo: {
    deviceName?: string;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<{ success: boolean; message: string }> {
    const license = await prisma.license.findUnique({
      where: { id: licenseId },
      include: { activations: true }
    });

    if (!license) {
      return { success: false, message: 'License not found' };
    }

    if (license.status !== 'ACTIVE') {
      return { success: false, message: 'License is not active' };
    }

    if (license.deviceBinding && license.deviceBinding !== deviceId) {
      await this.logLicenseAnalytics(licenseId, 'DEVICE_VIOLATION', {
        expectedDevice: license.deviceBinding,
        attemptedDevice: deviceId
      });
      return { success: false, message: 'License is bound to a different device' };
    }

    if (license.currentActivations >= license.maxActivations) {
      await this.logLicenseAnalytics(licenseId, 'ACTIVATION_LIMIT_EXCEEDED', {
        maxActivations: license.maxActivations,
        currentActivations: license.currentActivations
      });
      return { success: false, message: 'Maximum activation limit reached' };
    }

    // Check if device already activated
    const existingActivation = license.activations.find(a => a.deviceId === deviceId && a.isActive);
    if (existingActivation) {
      await prisma.licenseActivation.update({
        where: { id: existingActivation.id },
        data: {
          lastSeenAt: new Date(),
          deviceName: deviceInfo.deviceName,
          ipAddress: deviceInfo.ipAddress,
          userAgent: deviceInfo.userAgent
        }
      });
      return { success: true, message: 'Device already activated, updated last seen' };
    }

    // Create new activation
    await prisma.licenseActivation.create({
      data: {
        licenseId,
        deviceId,
        deviceName: deviceInfo.deviceName,
        ipAddress: deviceInfo.ipAddress,
        userAgent: deviceInfo.userAgent
      }
    });

    await prisma.license.update({
      where: { id: licenseId },
      data: { currentActivations: license.currentActivations + 1 }
    });

    await this.logLicenseAnalytics(licenseId, 'ACTIVATION', {
      deviceId,
      deviceName: deviceInfo.deviceName
    });

    return { success: true, message: 'Device activated successfully' };
  }

  // Domain Binding
  static async bindDomain(licenseId: string, domain: string): Promise<{ success: boolean; message: string }> {
    const license = await prisma.license.findUnique({
      where: { id: licenseId }
    });

    if (!license) {
      return { success: false, message: 'License not found' };
    }

    await prisma.license.update({
      where: { id: licenseId },
      data: { domainBinding: domain.toLowerCase() }
    });

    return { success: true, message: 'Domain bound successfully' };
  }

  static async validateDomain(licenseId: string, domain: string): Promise<boolean> {
    const license = await prisma.license.findUnique({
      where: { id: licenseId }
    });

    if (!license || !license.domainBinding) {
      return true; // No domain restriction
    }

    const isValid = license.domainBinding === domain.toLowerCase();
    
    if (!isValid && license.piracyDetectionEnabled) {
      await this.logLicenseAnalytics(licenseId, 'DOMAIN_VIOLATION', {
        expectedDomain: license.domainBinding,
        attemptedDomain: domain
      });
    }

    return isValid;
  }

  // IP Binding
  static async bindIP(licenseId: string, ipAddress: string): Promise<{ success: boolean; message: string }> {
    const license = await prisma.license.findUnique({
      where: { id: licenseId }
    });

    if (!license) {
      return { success: false, message: 'License not found' };
    }

    await prisma.license.update({
      where: { id: licenseId },
      data: { ipBinding: ipAddress }
    });

    return { success: true, message: 'IP bound successfully' };
  }

  static async validateIP(licenseId: string, ipAddress: string): Promise<boolean> {
    const license = await prisma.license.findUnique({
      where: { id: licenseId }
    });

    if (!license || !license.ipBinding) {
      return true; // No IP restriction
    }

    const isValid = license.ipBinding === ipAddress;
    
    if (!isValid && license.piracyDetectionEnabled) {
      await this.logLicenseAnalytics(licenseId, 'IP_VIOLATION', {
        expectedIP: license.ipBinding,
        attemptedIP: ipAddress
      });
    }

    return isValid;
  }

  // Download Limits
  static async checkDownloadLimit(licenseId: string): Promise<{ allowed: boolean; remaining: number }> {
    const license = await prisma.license.findUnique({
      where: { id: licenseId }
    });

    if (!license) {
      return { allowed: false, remaining: 0 };
    }

    if (license.maxDownloads === -1) {
      return { allowed: true, remaining: -1 }; // Unlimited
    }

    const remaining = license.maxDownloads - license.currentDownloads;
    const allowed = remaining > 0;

    if (!allowed && license.piracyDetectionEnabled) {
      await this.logLicenseAnalytics(licenseId, 'DOWNLOAD_LIMIT_EXCEEDED', {
        maxDownloads: license.maxDownloads,
        currentDownloads: license.currentDownloads
      });
    }

    return { allowed, remaining };
  }

  static async recordDownload(licenseId: string): Promise<void> {
    const license = await prisma.license.findUnique({
      where: { id: licenseId }
    });

    if (!license) {
      return;
    }

    await prisma.license.update({
      where: { id: licenseId },
      data: { currentDownloads: license.currentDownloads + 1 }
    });

    await this.logLicenseAnalytics(licenseId, 'DOWNLOAD', {
      totalDownloads: license.currentDownloads + 1
    });
  }

  // Secure Download URL
  static async generateSecureDownloadUrl(licenseId: string, expiresInMinutes: number = 30): Promise<string> {
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + expiresInMinutes * 60 * 1000);

    await prisma.license.update({
      where: { id: licenseId },
      data: {
        secureDownloadToken: token,
        secureDownloadExpiresAt: expiresAt
      }
    });

    return token;
  }

  static async validateSecureDownloadToken(licenseId: string, token: string): Promise<boolean> {
    const license = await prisma.license.findUnique({
      where: { id: licenseId }
    });

    if (!license || !license.secureDownloadToken) {
      return false;
    }

    if (license.secureDownloadToken !== token) {
      return false;
    }

    if (license.secureDownloadExpiresAt && license.secureDownloadExpiresAt < new Date()) {
      return false;
    }

    return true;
  }

  static async invalidateSecureDownloadUrl(licenseId: string): Promise<void> {
    await prisma.license.update({
      where: { id: licenseId },
      data: {
        secureDownloadToken: null,
        secureDownloadExpiresAt: null
      }
    });
  }

  // Watermark
  static async enableWatermark(licenseId: string, watermarkText: string): Promise<void> {
    await prisma.license.update({
      where: { id: licenseId },
      data: {
        watermarkEnabled: true,
        watermarkText
      }
    });
  }

  static async getWatermarkConfig(licenseId: string): Promise<{ enabled: boolean; text: string | null }> {
    const license = await prisma.license.findUnique({
      where: { id: licenseId },
      select: {
        watermarkEnabled: true,
        watermarkText: true
      }
    });

    if (!license) {
      return { enabled: false, text: null };
    }

    return {
      enabled: license.watermarkEnabled,
      text: license.watermarkText
    };
  }

  // Piracy Detection
  static async detectPiracy(licenseId: string, context: {
    deviceId?: string;
    domain?: string;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<{ isSuspicious: boolean; reasons: string[] }> {
    const license = await prisma.license.findUnique({
      where: { id: licenseId },
      include: { activations: true }
    });

    if (!license) {
      return { isSuspicious: true, reasons: ['License not found'] };
    }

    if (!license.piracyDetectionEnabled) {
      return { isSuspicious: false, reasons: [] };
    }

    const reasons: string[] = [];

    // Check device violations
    if (license.deviceBinding && context.deviceId && license.deviceBinding !== context.deviceId) {
      reasons.push('Device mismatch');
    }

    // Check domain violations
    if (license.domainBinding && context.domain && license.domainBinding !== context.domain.toLowerCase()) {
      reasons.push('Domain mismatch');
    }

    // Check IP violations
    if (license.ipBinding && context.ipAddress && license.ipBinding !== context.ipAddress) {
      reasons.push('IP mismatch');
    }

    // Check for multiple concurrent activations from different IPs
    const activeActivations = license.activations.filter(a => a.isActive);
    if (activeActivations.length > 1) {
      const uniqueIPs = new Set(activeActivations.map(a => a.ipAddress));
      if (uniqueIPs.size > 1) {
        reasons.push('Multiple IPs detected');
      }
    }

    const isSuspicious = reasons.length > 0;

    if (isSuspicious) {
      await prisma.license.update({
        where: { id: licenseId },
        data: {
          piracyAlerts: license.piracyAlerts + 1,
          lastPiracyCheckAt: new Date()
        }
      });

      await this.logLicenseAnalytics(licenseId, 'PIRACY_ALERT', {
        reasons,
        context
      });
    }

    return { isSuspicious, reasons };
  }

  // License Revocation
  static async revokeLicense(licenseId: string, reason: string): Promise<void> {
    await prisma.license.update({
      where: { id: licenseId },
      data: { status: 'REVOKED' }
    });

    // Deactivate all activations
    await prisma.licenseActivation.updateMany({
      where: { licenseId },
      data: { isActive: false }
    });

    await this.logLicenseAnalytics(licenseId, 'LICENSE_REVOKED', { reason });
  }

  static async suspendLicense(licenseId: string, reason: string): Promise<void> {
    await prisma.license.update({
      where: { id: licenseId },
      data: { status: 'SUSPENDED' }
    });

    await this.logLicenseAnalytics(licenseId, 'LICENSE_SUSPENDED', { reason });
  }

  static async reactivateLicense(licenseId: string): Promise<void> {
    await prisma.license.update({
      where: { id: licenseId },
      data: { status: 'ACTIVE' }
    });

    await this.logLicenseAnalytics(licenseId, 'LICENSE_RENEWED', {});
  }

  // License Analytics
  static async logLicenseAnalytics(
    licenseId: string,
    eventType: string,
    metadata: any,
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
    await prisma.licenseAnalytics.create({
      data: {
        licenseId,
        eventType: eventType as any,
        metadata,
        ipAddress,
        userAgent
      }
    });
  }

  static async getLicenseAnalytics(licenseId: string, limit: number = 100) {
    return prisma.licenseAnalytics.findMany({
      where: { licenseId },
      orderBy: { createdAt: 'desc' },
      take: limit
    });
  }

  static async getLicenseStats(licenseId: string) {
    const license = await prisma.license.findUnique({
      where: { id: licenseId },
      include: { activations: true, licenseAnalytics: true }
    });

    if (!license) {
      return null;
    }

    const analytics = license.licenseAnalytics;
    const activations = license.activations;

    return {
      licenseKey: license.licenseKey,
      status: license.status,
      currentActivations: license.currentActivations,
      maxActivations: license.maxActivations,
      currentDownloads: license.currentDownloads,
      maxDownloads: license.maxDownloads,
      piracyAlerts: license.piracyAlerts,
      totalActivations: activations.length,
      activeActivations: activations.filter(a => a.isActive).length,
      totalAnalyticsEvents: analytics.length,
      piracyAlertsCount: analytics.filter(a => a.eventType === 'PIRACY_ALERT').length,
      downloadCount: analytics.filter(a => a.eventType === 'DOWNLOAD').length,
      lastActivity: analytics[0]?.createdAt || null
    };
  }
}
