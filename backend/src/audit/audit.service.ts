// ============================================================
// AUDIT LOG SERVICE (STUB)
// Stub implementation - Audit logging disabled
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
    // Stub - do nothing
  }

  static async logUserAction(
    userId: string,
    action: string,
    entityType: string,
    entityId: string,
    changes?: Record<string, any>,
    metadata?: Record<string, any>
  ): Promise<void> {
    // Stub
  }

  static async logSecurityEvent(
    action: string,
    entityType: string,
    entityId: string,
    metadata?: Record<string, any>,
    severity: 'WARNING' | 'ERROR' | 'CRITICAL' = 'WARNING'
  ): Promise<void> {
    // Stub
  }

  static async logSystemEvent(
    action: string,
    entityType: string,
    entityId: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    // Stub
  }

  static async getAuditLogs(filters: any): Promise<any[]> {
    return [];
  }

  static async getAuditLogById(id: string): Promise<any | null> {
    return null;
  }

  static async getUserActivity(userId: string, days: number = 30): Promise<any[]> {
    return [];
  }

  static async getEntityHistory(entityType: string, entityId: string): Promise<any[]> {
    return [];
  }

  static async getSecurityEvents(severity?: 'WARNING' | 'ERROR' | 'CRITICAL', days: number = 7): Promise<any[]> {
    return [];
  }

  static async getAuditStatistics(days: number = 30): Promise<any> {
    return {
      totalLogs: 0,
      logsByAction: {},
      logsByEntityType: {},
      logsBySeverity: {},
      logsByUser: {},
    };
  }

  static async cleanupOldLogs(daysToKeep: number = 90): Promise<number> {
    return 0;
  }
}

