/**
 * ENTERPRISE AUDIT LOGGER
 * ═══════════════════════════════════════════════════════════
 * Comprehensive audit logging for all security events,
 * user actions, and permission changes.
 * 
 * EXTENDS existing src/lib/auditLog.ts
 */

import {
  AuditEvent,
  AuditEventType,
  AuditEventSeverity,
  EnterpriseRole,
  EnterprisePermission,
} from './types';

// ──────────────────────────────────────────────────────────
// AUDIT LOG STORAGE
// ──────────────────────────────────────────────────────────

const AUDIT_LOGS_KEY = 'enterprise_audit_logs';
const MAX_LOCAL_AUDIT_LOGS = 10000;

function getStoredAuditLogs(): AuditEvent[] {
  try {
    const raw = localStorage.getItem(AUDIT_LOGS_KEY);
    return raw ? (JSON.parse(raw) as AuditEvent[]) : [];
  } catch {
    return [];
  }
}

function persistAuditLogs(logs: AuditEvent[]): void {
  try {
    const recentLogs = logs.slice(-MAX_LOCAL_AUDIT_LOGS);
    localStorage.setItem(AUDIT_LOGS_KEY, JSON.stringify(recentLogs));
  } catch {
    // Fail safe: localStorage may be unavailable
  }
}

// ──────────────────────────────────────────────────────────
// AUDIT EVENT CREATION
// ──────────────────────────────────────────────────────────

function generateEventId(): string {
  return 'evt_' + crypto.randomUUID().replace(/-/g, '').slice(0, 16);
}

/**
 * Log any audit event
 */
export function logAuditEvent(
  eventType: AuditEventType,
  severity: AuditEventSeverity,
  actor: {
    userId: string;
    role: EnterpriseRole;
    email: string;
  },
  resource: {
    resourceType: string;
    resourceId: string;
    action: string;
  },
  result: 'SUCCESS' | 'FAILURE',
  metadata?: Record<string, unknown>,
  options?: {
    ipAddress?: string;
    userAgent?: string;
    tenantId?: string;
  },
): AuditEvent {
  const event: AuditEvent = {
    eventId: generateEventId(),
    eventType,
    severity,
    actor,
    resource,
    result,
    metadata: metadata || {},
    ipAddress: options?.ipAddress || '0.0.0.0',
    userAgent: options?.userAgent || (typeof navigator !== 'undefined' ? navigator.userAgent : ''),
    timestamp: new Date(),
    tenantId: options?.tenantId,
  };

  // Persist locally
  const logs = getStoredAuditLogs();
  logs.push(event);
  persistAuditLogs(logs);

  // Send to server if available
  if (typeof fetch !== 'undefined') {
    fetch('/api/v1/audit/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
      keepalive: true,
    }).catch(() => {
      // Fail safe
    });
  }

  return event;
}

// ──────────────────────────────────────────────────────────
// CONVENIENCE LOGGING FUNCTIONS
// ──────────────────────────────────────────────────────────

export const AuditLogger = {
  // Authentication events
  loginSuccess: (userId: string, role: EnterpriseRole, email: string, metadata?: Record<string, unknown>) =>
    logAuditEvent(
      AuditEventType.LOGIN_SUCCESS,
      AuditEventSeverity.LOW,
      { userId, role, email },
      { resourceType: 'user', resourceId: userId, action: 'LOGIN' },
      'SUCCESS',
      { ...metadata, timestamp: new Date().toISOString() },
    ),

  loginFailure: (email: string, reason: string, metadata?: Record<string, unknown>) =>
    logAuditEvent(
      AuditEventType.LOGIN_FAILURE,
      AuditEventSeverity.MEDIUM,
      { userId: 'unknown', role: EnterpriseRole.USER, email },
      { resourceType: 'auth', resourceId: email, action: 'LOGIN_ATTEMPT' },
      'FAILURE',
      { reason, ...metadata },
    ),

  logout: (userId: string, role: EnterpriseRole, email: string) =>
    logAuditEvent(
      AuditEventType.LOGOUT,
      AuditEventSeverity.LOW,
      { userId, role, email },
      { resourceType: 'user', resourceId: userId, action: 'LOGOUT' },
      'SUCCESS',
    ),

  tokenRefresh: (userId: string, role: EnterpriseRole, email: string, sessionId?: string) =>
    logAuditEvent(
      AuditEventType.TOKEN_REFRESH,
      AuditEventSeverity.LOW,
      { userId, role, email },
      { resourceType: 'session', resourceId: sessionId || userId, action: 'TOKEN_REFRESH' },
      'SUCCESS',
    ),

  sessionRevoked: (userId: string, role: EnterpriseRole, email: string, sessionId: string, reason?: string) =>
    logAuditEvent(
      AuditEventType.SESSION_REVOKED,
      AuditEventSeverity.MEDIUM,
      { userId, role, email },
      { resourceType: 'session', resourceId: sessionId, action: 'SESSION_REVOKED' },
      'SUCCESS',
      { reason },
    ),

  // Permission events
  permissionGranted: (
    actorId: string,
    actorRole: EnterpriseRole,
    actorEmail: string,
    targetUserId: string,
    permission: EnterprisePermission,
  ) =>
    logAuditEvent(
      AuditEventType.PERMISSION_GRANTED,
      AuditEventSeverity.MEDIUM,
      { userId: actorId, role: actorRole, email: actorEmail },
      { resourceType: 'permission', resourceId: permission, action: 'GRANT' },
      'SUCCESS',
      { targetUserId, permission },
    ),

  permissionDenied: (
    userId: string,
    role: EnterpriseRole,
    email: string,
    permission: EnterprisePermission,
    resource: string,
    reason?: string,
  ) =>
    logAuditEvent(
      AuditEventType.PERMISSION_DENIED,
      AuditEventSeverity.MEDIUM,
      { userId, role, email },
      { resourceType: 'permission', resourceId: permission, action: 'ACCESS_DENIED' },
      'FAILURE',
      { resource, reason },
    ),

  roleAssigned: (
    actorId: string,
    actorRole: EnterpriseRole,
    actorEmail: string,
    targetUserId: string,
    assignedRole: EnterpriseRole,
  ) =>
    logAuditEvent(
      AuditEventType.ROLE_ASSIGNED,
      AuditEventSeverity.HIGH,
      { userId: actorId, role: actorRole, email: actorEmail },
      { resourceType: 'role', resourceId: assignedRole, action: 'ASSIGN' },
      'SUCCESS',
      { targetUserId, assignedRole },
    ),

  roleRemoved: (
    actorId: string,
    actorRole: EnterpriseRole,
    actorEmail: string,
    targetUserId: string,
    removedRole: EnterpriseRole,
  ) =>
    logAuditEvent(
      AuditEventType.ROLE_REMOVED,
      AuditEventSeverity.HIGH,
      { userId: actorId, role: actorRole, email: actorEmail },
      { resourceType: 'role', resourceId: removedRole, action: 'REMOVE' },
      'SUCCESS',
      { targetUserId, removedRole },
    ),

  // User events
  userCreated: (actorId: string, actorRole: EnterpriseRole, actorEmail: string, userId: string, metadata?: Record<string, unknown>) =>
    logAuditEvent(
      AuditEventType.USER_CREATED,
      AuditEventSeverity.MEDIUM,
      { userId: actorId, role: actorRole, email: actorEmail },
      { resourceType: 'user', resourceId: userId, action: 'CREATE' },
      'SUCCESS',
      metadata,
    ),

  userUpdated: (actorId: string, actorRole: EnterpriseRole, actorEmail: string, userId: string, changes: Record<string, unknown>) =>
    logAuditEvent(
      AuditEventType.USER_UPDATED,
      AuditEventSeverity.LOW,
      { userId: actorId, role: actorRole, email: actorEmail },
      { resourceType: 'user', resourceId: userId, action: 'UPDATE' },
      'SUCCESS',
      { changes },
    ),

  userDeleted: (actorId: string, actorRole: EnterpriseRole, actorEmail: string, userId: string) =>
    logAuditEvent(
      AuditEventType.USER_DELETED,
      AuditEventSeverity.HIGH,
      { userId: actorId, role: actorRole, email: actorEmail },
      { resourceType: 'user', resourceId: userId, action: 'DELETE' },
      'SUCCESS',
    ),

  userStatusChanged: (actorId: string, actorRole: EnterpriseRole, actorEmail: string, userId: string, newStatus: string) =>
    logAuditEvent(
      AuditEventType.USER_STATUS_CHANGED,
      AuditEventSeverity.MEDIUM,
      { userId: actorId, role: actorRole, email: actorEmail },
      { resourceType: 'user', resourceId: userId, action: 'STATUS_CHANGED' },
      'SUCCESS',
      { newStatus },
    ),

  // Security events
  suspiciousActivity: (userId: string, role: EnterpriseRole, email: string, activityType: string, details: Record<string, unknown>) =>
    logAuditEvent(
      AuditEventType.SUSPICIOUS_ACTIVITY,
      AuditEventSeverity.HIGH,
      { userId, role, email },
      { resourceType: 'security', resourceId: userId, action: 'SUSPICIOUS_ACTIVITY' },
      'FAILURE',
      { activityType, ...details },
    ),

  bruteForceAttempt: (email: string, attempts: number) =>
    logAuditEvent(
      AuditEventType.BRUTE_FORCE_ATTEMPT,
      AuditEventSeverity.CRITICAL,
      { userId: 'unknown', role: EnterpriseRole.USER, email },
      { resourceType: 'auth', resourceId: email, action: 'BRUTE_FORCE' },
      'FAILURE',
      { attempts, email },
    ),

  unauthorizedAccess: (userId: string, role: EnterpriseRole, email: string, resource: string) =>
    logAuditEvent(
      AuditEventType.UNAUTHORIZED_ACCESS,
      AuditEventSeverity.HIGH,
      { userId, role, email },
      { resourceType: 'resource', resourceId: resource, action: 'UNAUTHORIZED_ACCESS' },
      'FAILURE',
      { resource },
    ),

  permissionEscalationAttempt: (userId: string, role: EnterpriseRole, email: string, attemptedRole: EnterpriseRole) =>
    logAuditEvent(
      AuditEventType.PERMISSION_ESCALATION_ATTEMPT,
      AuditEventSeverity.CRITICAL,
      { userId, role, email },
      { resourceType: 'security', resourceId: userId, action: 'ESCALATION_ATTEMPT' },
      'FAILURE',
      { attemptedRole, currentRole: role },
    ),

  deviceAdded: (userId: string, role: EnterpriseRole, email: string, deviceId: string, metadata?: Record<string, unknown>) =>
    logAuditEvent(
      AuditEventType.DEVICE_ADDED,
      AuditEventSeverity.LOW,
      { userId, role, email },
      { resourceType: 'device', resourceId: deviceId, action: 'ADDED' },
      'SUCCESS',
      metadata,
    ),

  deviceRemoved: (userId: string, role: EnterpriseRole, email: string, deviceId: string) =>
    logAuditEvent(
      AuditEventType.DEVICE_REMOVED,
      AuditEventSeverity.LOW,
      { userId, role, email },
      { resourceType: 'device', resourceId: deviceId, action: 'REMOVED' },
      'SUCCESS',
    ),

  // Data events
  dataExported: (userId: string, role: EnterpriseRole, email: string, dataType: string) =>
    logAuditEvent(
      AuditEventType.DATA_EXPORTED,
      AuditEventSeverity.HIGH,
      { userId, role, email },
      { resourceType: 'data', resourceId: dataType, action: 'EXPORT' },
      'SUCCESS',
    ),

  dataDeleted: (actorId: string, actorRole: EnterpriseRole, actorEmail: string, dataType: string, count: number) =>
    logAuditEvent(
      AuditEventType.DATA_DELETED,
      AuditEventSeverity.CRITICAL,
      { userId: actorId, role: actorRole, email: actorEmail },
      { resourceType: 'data', resourceId: dataType, action: 'DELETE' },
      'SUCCESS',
      { count, dataType },
    ),
};

// ──────────────────────────────────────────────────────────
// AUDIT LOG RETRIEVAL
// ──────────────────────────────────────────────────────────

/**
 * Get audit logs with filtering
 */
export function getAuditLogs(options?: {
  userId?: string;
  eventType?: AuditEventType;
  severity?: AuditEventSeverity;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
}): AuditEvent[] {
  let logs = getStoredAuditLogs();

  if (options?.userId) {
    logs = logs.filter(l => l.actor.userId === options.userId);
  }

  if (options?.eventType) {
    logs = logs.filter(l => l.eventType === options.eventType);
  }

  if (options?.severity) {
    logs = logs.filter(l => l.severity === options.severity);
  }

  if (options?.startDate) {
    logs = logs.filter(l => l.timestamp >= options.startDate!);
  }

  if (options?.endDate) {
    logs = logs.filter(l => l.timestamp <= options.endDate!);
  }

  if (options?.limit) {
    logs = logs.slice(-options.limit);
  }

  return logs;
}

/**
 * Get audit logs by resource
 */
export function getAuditLogsByResource(
  resourceType: string,
  resourceId: string,
  limit?: number,
): AuditEvent[] {
  let logs = getStoredAuditLogs().filter(
    l => l.resource.resourceType === resourceType && l.resource.resourceId === resourceId,
  );

  if (limit) {
    logs = logs.slice(-limit);
  }

  return logs;
}

/**
 * Get user activity timeline
 */
export function getUserActivityTimeline(userId: string, days: number = 30): AuditEvent[] {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  return getAuditLogs({
    userId,
    startDate,
    limit: 100,
  });
}

/**
 * Export audit logs to CSV
 */
export function exportAuditLogsCSV(logs: AuditEvent[]): string {
  const headers = [
    'Event ID',
    'Event Type',
    'Severity',
    'Actor ID',
    'Actor Role',
    'Resource Type',
    'Resource ID',
    'Result',
    'Timestamp',
  ];

  const rows = logs.map(log => [
    log.eventId,
    log.eventType,
    log.severity,
    log.actor.userId,
    log.actor.role,
    log.resource.resourceType,
    log.resource.resourceId,
    log.result,
    log.timestamp.toISOString(),
  ]);

  const csv = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
  ].join('\n');

  return csv;
}
