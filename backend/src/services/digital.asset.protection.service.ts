// ============================================================
// DIGITAL ASSET PROTECTION SERVICE
// Download Watermark, Leak Tracking, Download Fingerprinting,
// Secure File Delivery, Abuse Detection
// ============================================================

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class DigitalAssetProtectionService {
  // Download Watermark Methods
  static async createDownloadWatermark(data: {
    userId: string;
    productId: string;
    licenseId?: string;
    watermarkType: any;
    watermarkData?: any;
    metadata?: any;
  }) {
    const watermark = await prisma.downloadWatermark.create({
      data
    });

    // Log watermark creation
    await prisma.auditLog.create({
      data: {
        action: 'DOWNLOAD_WATERMARK_CREATED',
        entity: 'DownloadWatermark',
        entityId: watermark.id,
        metadata: { userId: watermark.userId, productId: watermark.productId }
      }
    });

    return watermark;
  }

  static async getDownloadWatermarks(userId?: string, productId?: string) {
    const where: any = {};
    if (userId) where.userId = userId;
    if (productId) where.productId = productId;

    return prisma.downloadWatermark.findMany({
      where,
      include: { user: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  // Leak Tracking Methods
  static async reportLeak(data: {
    productId: string;
    source: string;
    sourceUrl?: string;
    reportedBy: string;
    metadata?: any;
  }) {
    const leak = await prisma.leakReport.create({
      data
    });

    // Log leak report
    await prisma.auditLog.create({
      data: {
        action: 'LEAK_REPORTED',
        entity: 'LeakReport',
        entityId: leak.id,
        metadata: { productId: leak.productId, source: leak.source }
      }
    });

    return leak;
  }

  static async getLeakReports(productId?: string, status?: any) {
    const where: any = {};
    if (productId) where.productId = productId;
    if (status) where.status = status;

    return prisma.leakReport.findMany({
      where,
      include: { product: true },
      orderBy: { reportedAt: 'desc' }
    });
  }

  static async updateLeakStatus(leakId: string, status: any) {
    const leak = await prisma.leakReport.update({
      where: { id: leakId },
      data: { status }
    });

    // Log status update
    await prisma.auditLog.create({
      data: {
        action: 'LEAK_STATUS_UPDATED',
        entity: 'LeakReport',
        entityId: leakId,
        metadata: { status }
      }
    });

    return leak;
  }

  // Download Fingerprinting Methods
  static async createDownloadFingerprint(data: {
    userId: string;
    productId: string;
    licenseId?: string;
    fingerprint: string;
    deviceInfo?: any;
    ipAddress?: string;
    metadata?: any;
  }) {
    const fingerprint = await prisma.downloadFingerprint.create({
      data
    });

    // Log fingerprint creation
    await prisma.auditLog.create({
      data: {
        action: 'DOWNLOAD_FINGERPRINT_CREATED',
        entity: 'DownloadFingerprint',
        entityId: fingerprint.id,
        metadata: { userId: fingerprint.userId, productId: fingerprint.productId }
      }
    });

    return fingerprint;
  }

  static async getDownloadFingerprints(userId?: string, productId?: string) {
    const where: any = {};
    if (userId) where.userId = userId;
    if (productId) where.productId = productId;

    return prisma.downloadFingerprint.findMany({
      where,
      include: { user: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async detectDuplicateFingerprint(fingerprint: string) {
    const existing = await prisma.downloadFingerprint.findFirst({
      where: { fingerprint }
    });

    return existing !== null;
  }

  // Secure File Delivery Methods
  static async createSecureDelivery(data: {
    productId: string;
    licenseId?: string;
    deliveryUrl: string;
    accessKey: string;
    expiresAt: Date;
    maxAccess?: number;
    metadata?: any;
  }) {
    const delivery = await prisma.secureDelivery.create({
      data
    });

    // Log delivery creation
    await prisma.auditLog.create({
      data: {
        action: 'SECURE_DELIVERY_CREATED',
        entity: 'SecureDelivery',
        entityId: delivery.id,
        metadata: { productId: delivery.productId }
      }
    });

    return delivery;
  }

  static async getSecureDeliveries(productId?: string, licenseId?: string) {
    const where: any = {};
    if (productId) where.productId = productId;
    if (licenseId) where.licenseId = licenseId;

    return prisma.secureDelivery.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });
  }

  static async accessSecureDelivery(deliveryId: string) {
    const delivery = await prisma.secureDelivery.findUnique({
      where: { id: deliveryId }
    });

    if (!delivery) {
      throw new Error('Delivery not found');
    }

    if (delivery.status !== 'ACTIVE') {
      throw new Error('Delivery is not active');
    }

    if (new Date() > delivery.expiresAt) {
      await prisma.secureDelivery.update({
        where: { id: deliveryId },
        data: { status: 'EXPIRED' }
      });
      throw new Error('Delivery has expired');
    }

    if (delivery.maxAccess && delivery.accessCount >= delivery.maxAccess) {
      await prisma.secureDelivery.update({
        where: { id: deliveryId },
        data: { status: 'CONSUMED' }
      });
      throw new Error('Delivery has been consumed');
    }

    const updated = await prisma.secureDelivery.update({
      where: { id: deliveryId },
      data: { accessCount: { increment: 1 } }
    });

    // Log access
    await prisma.auditLog.create({
      data: {
        action: 'SECURE_DELIVERY_ACCESSED',
        entity: 'SecureDelivery',
        entityId: deliveryId,
        metadata: { accessCount: updated.accessCount }
      }
    });

    return updated;
  }

  static async revokeSecureDelivery(deliveryId: string) {
    const delivery = await prisma.secureDelivery.update({
      where: { id: deliveryId },
      data: { status: 'REVOKED' }
    });

    // Log revocation
    await prisma.auditLog.create({
      data: {
        action: 'SECURE_DELIVERY_REVOKED',
        entity: 'SecureDelivery',
        entityId: deliveryId
      }
    });

    return delivery;
  }

  // Abuse Detection Methods
  static async reportAbuse(data: {
    type: any;
    severity: any;
    userId?: string;
    productId?: string;
    licenseId?: string;
    description: string;
    evidence?: any;
    metadata?: any;
  }) {
    const abuse = await prisma.abuseReport.create({
      data
    });

    // Log abuse report
    await prisma.auditLog.create({
      data: {
        action: 'ABUSE_REPORTED',
        entity: 'AbuseReport',
        entityId: abuse.id,
        metadata: { type: abuse.type, severity: abuse.severity }
      }
    });

    return abuse;
  }

  static async getAbuseReports(type?: any, status?: any, userId?: string, productId?: string) {
    const where: any = {};
    if (type) where.type = type;
    if (status) where.status = status;
    if (userId) where.userId = userId;
    if (productId) where.productId = productId;

    return prisma.abuseReport.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });
  }

  static async updateAbuseStatus(abuseId: string, status: any, resolvedBy?: string) {
    const data: any = { status };
    if (resolvedBy) {
      data.resolvedBy = resolvedBy;
      data.resolvedAt = new Date();
    }

    const abuse = await prisma.abuseReport.update({
      where: { id: abuseId },
      data
    });

    // Log status update
    await prisma.auditLog.create({
      data: {
        action: 'ABUSE_STATUS_UPDATED',
        entity: 'AbuseReport',
        entityId: abuseId,
        metadata: { status, resolvedBy }
      }
    });

    return abuse;
  }

  static async getAbuseStatistics() {
    const [
      totalReports,
      newReports,
      investigating,
      confirmed,
      resolved,
      byType
    ] = await Promise.all([
      prisma.abuseReport.count(),
      prisma.abuseReport.count({ where: { status: 'NEW' } }),
      prisma.abuseReport.count({ where: { status: 'INVESTIGATING' } }),
      prisma.abuseReport.count({ where: { status: 'CONFIRMED' } }),
      prisma.abuseReport.count({ where: { status: 'RESOLVED' } }),
      prisma.abuseReport.groupBy({
        by: ['type'],
        _count: true
      })
    ]);

    return {
      total: totalReports,
      new: newReports,
      investigating,
      confirmed,
      resolved,
      byType: byType.reduce((acc: Record<string, number>, item: any) => {
        acc[item.type] = item._count;
        return acc;
      }, {} as Record<string, number>)
    };
  }
}
