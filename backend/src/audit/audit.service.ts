// ============================================================
// AUDIT LOG SERVICE
// Enterprise audit logging for compliance and security
// ============================================================

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface AuditLogEntry {
  id?: string;
  userId?: string;
  action: string;
  entityType: string;
  entityId: string;
  changes?: Record<string, any>;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  severity?: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
}

export class AuditLogService {
  static async log(entry: AuditLogEntry): Promise<void> {
    try {
      await prisma.auditLog.create({
        data: {
          userId: entry.userId,
          action: entry.action,
          entityType: entry.entityType,
          entityId: entry.entityId,
          changes: entry.changes ? JSON.stringify(entry.changes) : null,
          metadata: entry.metadata ? JSON.stringify(entry.metadata) : null,
          ipAddress: entry.ipAddress,
          userAgent: entry.userAgent,
          severity: entry.severity || 'INFO',
        },
      });
    } catch (error) {
      console.error('Failed to create audit log entry:', error);
      // Do not throw - audit logging failures should not break the application
    }
  }

  static async logUserAction(
    userId: string,
    action: string,
    entityType: string,
    entityId: string,
    changes?: Record<string, any>,
    metadata?: Record<string, any>
  ): Promise<void> {
    await this.log({
      userId,
      action,
      entityType,
      entityId,
      changes,
      metadata,
      severity: 'INFO',
    });
  }

  static async logSecurityEvent(
    action: string,
    entityType: string,
    entityId: string,
    metadata?: Record<string, any>,
    severity: 'WARNING' | 'ERROR' | 'CRITICAL' = 'WARNING'
  ): Promise<void> {
    await this.log({
      action,
      entityType,
      entityId,
      metadata,
      severity,
    });
  }

  static async logSystemEvent(
    action: string,
    entityType: string,
    entityId: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    await this.log({
      action,
      entityType,
      entityId,
      metadata,
      severity: 'INFO',
    });
  }

  static async getAuditLogs(filters: {
    userId?: string;
    action?: string;
    entityType?: string;
    entityId?: string;
    severity?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
    offset?: number;
  }): Promise<any[]> {
    const where: any = {};

    if (filters.userId) {
      where.userId = filters.userId;
    }

    if (filters.action) {
      where.action = filters.action;
    }

    if (filters.entityType) {
      where.entityType = filters.entityType;
    }

    if (filters.entityId) {
      where.entityId = filters.entityId;
    }

    if (filters.severity) {
      where.severity = filters.severity;
    }

    if (filters.startDate || filters.endDate) {
      where.createdAt = {};
      if (filters.startDate) {
        where.createdAt.gte = filters.startDate;
      }
      if (filters.endDate) {
        where.createdAt.lte = filters.endDate;
      }
    }

    return await prisma.auditLog.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      take: filters.limit || 100,
      skip: filters.offset || 0,
    });
  }

  static async getAuditLogById(id: string): Promise<any | null> {
    return await prisma.auditLog.findUnique({
      where: { id },
    });
  }

  static async getUserActivity(userId: string, days: number = 30): Promise<any[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return await prisma.auditLog.findMany({
      where: {
        userId,
        createdAt: {
          gte: startDate,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  static async getEntityHistory(
    entityType: string,
    entityId: string
  ): Promise<any[]> {
    return await prisma.auditLog.findMany({
      where: {
        entityType,
        entityId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  static async getSecurityEvents(
    severity?: 'WARNING' | 'ERROR' | 'CRITICAL',
    days: number = 7
  ): Promise<any[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const where: any = {
      createdAt: {
        gte: startDate,
      },
      severity: {
        in: ['WARNING', 'ERROR', 'CRITICAL'],
      },
    };

    if (severity) {
      where.severity = severity;
    }

    return await prisma.auditLog.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  static async getAuditStatistics(days: number = 30): Promise<{
    totalLogs: number;
    logsByAction: Record<string, number>;
    logsByEntityType: Record<string, number>;
    logsBySeverity: Record<string, number>;
    logsByUser: Record<string, number>;
  }> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const logs = await prisma.auditLog.findMany({
      where: {
        createdAt: {
          gte: startDate,
        },
      },
    });

    const logsByAction: Record<string, number> = {};
    const logsByEntityType: Record<string, number> = {};
    const logsBySeverity: Record<string, number> = {};
    const logsByUser: Record<string, number> = {};

    for (const log of logs) {
      logsByAction[log.action] = (logsByAction[log.action] || 0) + 1;
      logsByEntityType[log.entityType] = (logsByEntityType[log.entityType] || 0) + 1;
      logsBySeverity[log.severity] = (logsBySeverity[log.severity] || 0) + 1;
      if (log.userId) {
        logsByUser[log.userId] = (logsByUser[log.userId] || 0) + 1;
      }
    }

    return {
      totalLogs: logs.length,
      logsByAction,
      logsByEntityType,
      logsBySeverity,
      logsByUser,
    };
  }

  static async cleanupOldLogs(daysToKeep: number = 90): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const result = await prisma.auditLog.deleteMany({
      where: {
        createdAt: {
          lt: cutoffDate,
        },
      },
    });

    return result.count;
  }
}
