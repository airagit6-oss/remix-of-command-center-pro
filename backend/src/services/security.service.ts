// ============================================================
// SECURITY SERVICE
// Core security operations: 2FA, device tracking, session management
// ============================================================

import { PrismaClient } from '@prisma/client';
import { authenticator } from 'otplib';
import crypto from 'crypto';

const prisma = new PrismaClient();

export class SecurityService {
  // 2FA Operations
  static async generate2FASecret(userId: string): Promise<{ secret: string; qrCode: string }> {
    const secret = authenticator.generateSecret();
    
    await prisma.user.update({
      where: { id: userId },
      data: { twoFactorSecret: secret }
    });

    const otpauthUrl = authenticator.keyuri(
      'SoftwareVala',
      'SoftwareVala Marketplace',
      secret
    );

    return {
      secret,
      qrCode: otpauthUrl
    };
  }

  static async enable2FA(userId: string, token: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user || !user.twoFactorSecret) {
      return false;
    }

    const isValid = authenticator.verify({
      token,
      secret: user.twoFactorSecret
    });

    if (isValid) {
      await prisma.user.update({
        where: { id: userId },
        data: { twoFactorEnabled: true }
      });

      // Log security event
      await this.logSecurityEvent(userId, '2FA_ENABLED', 'MEDIUM', '2FA enabled for account');
    }

    return isValid;
  }

  static async disable2FA(userId: string, token: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user || !user.twoFactorSecret) {
      return false;
    }

    const isValid = authenticator.verify({
      token,
      secret: user.twoFactorSecret
    });

    if (isValid) {
      await prisma.user.update({
        where: { id: userId },
        data: { 
          twoFactorEnabled: false,
          twoFactorSecret: null
        }
      });

      // Log security event
      await this.logSecurityEvent(userId, '2FA_DISABLED', 'MEDIUM', '2FA disabled for account');
    }

    return isValid;
  }

  static async verify2FA(userId: string, token: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user || !user.twoFactorSecret || !user.twoFactorEnabled) {
      return false;
    }

    return authenticator.verify({
      token,
      secret: user.twoFactorSecret
    });
  }

  // Device Operations
  static async registerDevice(userId: string, deviceInfo: {
    deviceId: string;
    deviceName?: string;
    deviceType?: string;
    os?: string;
    browser?: string;
    ipAddress?: string;
    location?: any;
  }): Promise<void> {
    const existingDevice = await prisma.device.findUnique({
      where: { deviceId: deviceInfo.deviceId }
    });

    if (existingDevice) {
      await prisma.device.update({
        where: { id: existingDevice.id },
        data: {
          lastSeenAt: new Date(),
          ipAddress: deviceInfo.ipAddress,
          location: deviceInfo.location
        }
      });
    } else {
      await prisma.device.create({
        data: {
          userId,
          ...deviceInfo
        }
      });

      // Log security event for new device
      await this.logSecurityEvent(userId, 'SUSPICIOUS_ACTIVITY', 'MEDIUM', 'New device registered');
    }
  }

  static async trustDevice(userId: string, deviceId: string): Promise<void> {
    await prisma.device.updateMany({
      where: { userId, deviceId },
      data: { isTrusted: true }
    });
  }

  static async revokeDevice(userId: string, deviceId: string): Promise<void> {
    await prisma.device.deleteMany({
      where: { userId, deviceId }
    });

    await this.logSecurityEvent(userId, 'SUSPICIOUS_ACTIVITY', 'MEDIUM', 'Device revoked');
  }

  static async getUserDevices(userId: string) {
    return prisma.device.findMany({
      where: { userId },
      orderBy: { lastSeenAt: 'desc' }
    });
  }

  // Session Operations
  static async createSession(userId: string, sessionInfo: {
    ipAddress?: string;
    userAgent?: string;
  }): Promise<string> {
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    await prisma.session.create({
      data: {
        userId,
        token,
        ...sessionInfo,
        expiresAt
      }
    });

    return token;
  }

  static async validateSession(token: string): Promise<{ userId: string; valid: boolean }> {
    const session = await prisma.session.findUnique({
      where: { token },
      include: { user: true }
    });

    if (!session) {
      return { userId: '', valid: false };
    }

    if (session.expiresAt < new Date()) {
      await prisma.session.delete({ where: { id: session.id } });
      return { userId: '', valid: false };
    }

    // Update last seen
    await prisma.session.update({
      where: { id: session.id },
      data: { lastSeenAt: new Date() }
    });

    return { userId: session.userId, valid: true };
  }

  static async revokeSession(token: string): Promise<void> {
    await prisma.session.deleteMany({ where: { token } });
  }

  static async revokeAllUserSessions(userId: string): Promise<void> {
    await prisma.session.deleteMany({ where: { userId } });
  }

  static async getUserSessions(userId: string) {
    return prisma.session.findMany({
      where: { userId },
      orderBy: { lastSeenAt: 'desc' }
    });
  }

  // Security Event Logging
  static async logSecurityEvent(
    userId: string | null,
    eventType: string,
    severity: string,
    description: string,
    metadata?: any
  ): Promise<void> {
    await prisma.securityEvent.create({
      data: {
        userId,
        eventType,
        severity,
        description,
        metadata
      }
    });
  }

  static async getSecurityEvents(userId?: string, limit: number = 50) {
    return prisma.securityEvent.findMany({
      where: userId ? { userId } : undefined,
      orderBy: { createdAt: 'desc' },
      take: limit
    });
  }

  static async resolveSecurityEvent(eventId: string, resolvedBy: string): Promise<void> {
    await prisma.securityEvent.update({
      where: { id: eventId },
      data: {
        resolved: true,
        resolvedAt: new Date(),
        resolvedBy
      }
    });
  }

  // Activity Logging
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

  static async getUserActivity(userId: string, limit: number = 50) {
    return prisma.activityLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit
    });
  }

  // Risk Detection
  static async assessRisk(userId: string, context: {
    ipAddress?: string;
    userAgent?: string;
    deviceId?: string;
  }): Promise<{ riskScore: number; riskFactors: string[] }> {
    const riskFactors: string[] = [];
    let riskScore = 0;

    // Check for multiple failed login attempts
    const recentFailures = await prisma.securityEvent.count({
      where: {
        userId,
        eventType: 'LOGIN_FAILURE',
        createdAt: {
          gte: new Date(Date.now() - 15 * 60 * 1000) // Last 15 minutes
        }
      }
    });

    if (recentFailures >= 3) {
      riskFactors.push('Multiple failed login attempts');
      riskScore += 30;
    }

    // Check for new device
    if (context.deviceId) {
      const existingDevice = await prisma.device.findUnique({
        where: { deviceId: context.deviceId }
      });

      if (!existingDevice) {
        riskFactors.push('New device');
        riskScore += 20;
      } else if (!existingDevice.isTrusted) {
        riskFactors.push('Untrusted device');
        riskScore += 15;
      }
    }

    // Check for unusual location (simplified - would use geo IP service in production)
    if (context.ipAddress) {
      const recentSessions = await prisma.session.findMany({
        where: {
          userId,
          ipAddress: { not: context.ipAddress },
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
          }
        },
        take: 1
      });

      if (recentSessions.length > 0) {
        riskFactors.push('Unusual location');
        riskScore += 25;
      }
    }

    return { riskScore, riskFactors };
  }

  static async isAccountLocked(userId: string): Promise<boolean> {
    const recentLockEvents = await prisma.securityEvent.findMany({
      where: {
        userId,
        eventType: 'ACCOUNT_LOCKED',
        createdAt: {
          gte: new Date(Date.now() - 30 * 60 * 1000) // Last 30 minutes
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 1
    });

    return recentLockEvents.length > 0;
  }

  static async lockAccount(userId: string, reason: string): Promise<void> {
    await this.logSecurityEvent(userId, 'ACCOUNT_LOCKED', 'HIGH', `Account locked: ${reason}`);
  }

  static async unlockAccount(userId: string, unlockedBy: string): Promise<void> {
    const recentLockEvent = await prisma.securityEvent.findFirst({
      where: {
        userId,
        eventType: 'ACCOUNT_LOCKED',
        resolved: false
      },
      orderBy: { createdAt: 'desc' }
    });

    if (recentLockEvent) {
      await this.resolveSecurityEvent(recentLockEvent.id, unlockedBy);
    }

    await this.logSecurityEvent(userId, 'ACCOUNT_UNLOCKED', 'MEDIUM', 'Account unlocked');
  }
}
