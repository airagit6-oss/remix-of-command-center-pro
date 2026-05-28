/**
 * ENTERPRISE SECURITY TYPE DEFINITIONS
 * ═══════════════════════════════════════════════════════════
 * Core types for enterprise-grade RBAC, session management,
 * audit logging, and security infrastructure.
 * 
 * DO NOT BREAK EXISTING AUTH PATTERNS — extend them.
 */

// ──────────────────────────────────────────────────────────
// ROLE HIERARCHY & PERMISSION TYPES
// ──────────────────────────────────────────────────────────

export enum EnterpriseRole {
  SUPER_ADMIN = 'SUPER_ADMIN',    // System owner, all access
  ADMIN = 'ADMIN',                // Platform admin
  RESELLER = 'RESELLER',          // Reseller/Agency
  AUTHOR = 'AUTHOR',              // Content creator
  SUPPORT = 'SUPPORT',            // Support team
  FINANCE = 'FINANCE',            // Finance team
  AI = 'AI',                       // AI automation role
  USER = 'USER',                  // Regular user
}

// Role hierarchy: higher role inherits all lower role permissions
export const ROLE_HIERARCHY: Record<EnterpriseRole, EnterpriseRole[]> = {
  [EnterpriseRole.SUPER_ADMIN]: [
    EnterpriseRole.ADMIN,
    EnterpriseRole.RESELLER,
    EnterpriseRole.AUTHOR,
    EnterpriseRole.SUPPORT,
    EnterpriseRole.FINANCE,
    EnterpriseRole.AI,
    EnterpriseRole.USER,
  ],
  [EnterpriseRole.ADMIN]: [
    EnterpriseRole.RESELLER,
    EnterpriseRole.AUTHOR,
    EnterpriseRole.SUPPORT,
    EnterpriseRole.FINANCE,
    EnterpriseRole.USER,
  ],
  [EnterpriseRole.RESELLER]: [EnterpriseRole.USER],
  [EnterpriseRole.AUTHOR]: [EnterpriseRole.USER],
  [EnterpriseRole.SUPPORT]: [EnterpriseRole.USER],
  [EnterpriseRole.FINANCE]: [EnterpriseRole.USER],
  [EnterpriseRole.AI]: [EnterpriseRole.USER],
  [EnterpriseRole.USER]: [],
};

// Resource-based permissions
export enum EnterprisePermission {
  // System
  SYSTEM_FULL = 'system:full',
  SYSTEM_READ = 'system:read',
  SYSTEM_WRITE = 'system:write',

  // Users
  USERS_READ = 'users:read',
  USERS_WRITE = 'users:write',
  USERS_DELETE = 'users:delete',
  USERS_MANAGE = 'users:manage',

  // Roles
  ROLES_READ = 'roles:read',
  ROLES_WRITE = 'roles:write',
  ROLES_MANAGE = 'roles:manage',

  // Permissions
  PERMISSIONS_READ = 'permissions:read',
  PERMISSIONS_WRITE = 'permissions:write',
  PERMISSIONS_MANAGE = 'permissions:manage',

  // Sessions
  SESSIONS_READ = 'sessions:read',
  SESSIONS_REVOKE = 'sessions:revoke',
  SESSIONS_MANAGE = 'sessions:manage',

  // Audit
  AUDIT_READ = 'audit:read',
  AUDIT_WRITE = 'audit:write',
  AUDIT_MANAGE = 'audit:manage',

  // Reseller
  RESELLER_DASHBOARD = 'reseller:dashboard',
  RESELLER_MANAGE = 'reseller:manage',
  RESELLER_LEADS = 'reseller:leads',
  RESELLER_COMMISSIONS = 'reseller:commissions',

  // Author
  AUTHOR_DASHBOARD = 'author:dashboard',
  AUTHOR_PRODUCTS = 'author:products',
  AUTHOR_CONTENT = 'author:content',
  AUTHOR_ANALYTICS = 'author:analytics',

  // Support
  SUPPORT_DASHBOARD = 'support:dashboard',
  SUPPORT_TICKETS = 'support:tickets',
  SUPPORT_USERS = 'support:users',

  // Finance
  FINANCE_DASHBOARD = 'finance:dashboard',
  FINANCE_REPORTS = 'finance:reports',
  FINANCE_TRANSACTIONS = 'finance:transactions',
  FINANCE_PAYOUTS = 'finance:payouts',

  // AI
  AI_RUN = 'ai:run',
  AI_USE = 'ai:use',
  AI_ADMIN = 'ai:admin',
  AI_AUTOMATION = 'ai:automation',

  // Content
  CONTENT_CREATE = 'content:create',
  CONTENT_READ = 'content:read',
  CONTENT_WRITE = 'content:write',
  CONTENT_DELETE = 'content:delete',

  // Billing
  BILLING_READ = 'billing:read',
  BILLING_WRITE = 'billing:write',
  BILLING_MANAGE = 'billing:manage',

  // Marketplace
  MARKETPLACE_READ = 'marketplace:read',
  MARKETPLACE_WRITE = 'marketplace:write',

  // Notifications
  NOTIFICATIONS_READ = 'notifications:read',
  NOTIFICATIONS_WRITE = 'notifications:write',

  // Settings
  SETTINGS_READ = 'settings:read',
  SETTINGS_WRITE = 'settings:write',
  SETTINGS_MANAGE = 'settings:manage',

  // Analytics
  ANALYTICS_READ = 'analytics:read',
  ANALYTICS_WRITE = 'analytics:write',

  // Security
  SECURITY_READ = 'security:read',
  SECURITY_WRITE = 'security:write',
}

// Permission matrix by role
export const ROLE_PERMISSION_MATRIX: Record<EnterpriseRole, EnterprisePermission[]> = {
  [EnterpriseRole.SUPER_ADMIN]: [
    EnterprisePermission.SYSTEM_FULL,
    EnterprisePermission.USERS_MANAGE,
    EnterprisePermission.ROLES_MANAGE,
    EnterprisePermission.PERMISSIONS_MANAGE,
    EnterprisePermission.SESSIONS_MANAGE,
    EnterprisePermission.AUDIT_MANAGE,
    EnterprisePermission.RESELLER_MANAGE,
    EnterprisePermission.SUPPORT_DASHBOARD,
    EnterprisePermission.FINANCE_MANAGE,
    EnterprisePermission.AI_ADMIN,
    EnterprisePermission.SETTINGS_MANAGE,
    EnterprisePermission.SECURITY_WRITE,
  ],
  [EnterpriseRole.ADMIN]: [
    EnterprisePermission.SYSTEM_READ,
    EnterprisePermission.USERS_MANAGE,
    EnterprisePermission.AUDIT_READ,
    EnterprisePermission.SETTINGS_WRITE,
    EnterprisePermission.ANALYTICS_READ,
    EnterprisePermission.SECURITY_READ,
  ],
  [EnterpriseRole.RESELLER]: [
    EnterprisePermission.RESELLER_DASHBOARD,
    EnterprisePermission.RESELLER_LEADS,
    EnterprisePermission.RESELLER_COMMISSIONS,
    EnterprisePermission.ANALYTICS_READ,
    EnterprisePermission.NOTIFICATIONS_READ,
  ],
  [EnterpriseRole.AUTHOR]: [
    EnterprisePermission.AUTHOR_DASHBOARD,
    EnterprisePermission.AUTHOR_PRODUCTS,
    EnterprisePermission.AUTHOR_CONTENT,
    EnterprisePermission.AUTHOR_ANALYTICS,
    EnterprisePermission.CONTENT_CREATE,
    EnterprisePermission.NOTIFICATIONS_READ,
  ],
  [EnterpriseRole.SUPPORT]: [
    EnterprisePermission.SUPPORT_DASHBOARD,
    EnterprisePermission.SUPPORT_TICKETS,
    EnterprisePermission.SUPPORT_USERS,
    EnterprisePermission.NOTIFICATIONS_READ,
    EnterprisePermission.AUDIT_READ,
  ],
  [EnterpriseRole.FINANCE]: [
    EnterprisePermission.FINANCE_DASHBOARD,
    EnterprisePermission.FINANCE_REPORTS,
    EnterprisePermission.FINANCE_TRANSACTIONS,
    EnterprisePermission.FINANCE_PAYOUTS,
    EnterprisePermission.ANALYTICS_READ,
  ],
  [EnterpriseRole.AI]: [
    EnterprisePermission.AI_RUN,
    EnterprisePermission.AI_USE,
    EnterprisePermission.AI_AUTOMATION,
    EnterprisePermission.ANALYTICS_READ,
  ],
  [EnterpriseRole.USER]: [
    EnterprisePermission.MARKETPLACE_READ,
    EnterprisePermission.CONTENT_READ,
    EnterprisePermission.NOTIFICATIONS_READ,
    EnterprisePermission.SETTINGS_READ,
  ],
};

// ──────────────────────────────────────────────────────────
// SESSION & DEVICE TYPES
// ──────────────────────────────────────────────────────────

export enum SessionStatus {
  ACTIVE = 'ACTIVE',
  REVOKED = 'REVOKED',
  EXPIRED = 'EXPIRED',
  SUSPICIOUS = 'SUSPICIOUS',
}

export interface DeviceInfo {
  deviceId: string;
  userAgent: string;
  ipAddress: string;
  country?: string;
  city?: string;
  lastSeenAt: Date;
  isCurrentDevice: boolean;
  isTrusted: boolean;
}

export interface SessionData {
  sessionId: string;
  userId: string;
  role: EnterpriseRole;
  device: DeviceInfo;
  createdAt: Date;
  expiresAt: Date;
  revokedAt?: Date;
  lastRefreshAt: Date;
  status: SessionStatus;
  refreshTokenHash?: string;
  ipAddress: string;
  userAgent: string;
  tenantId?: string;
  metadata?: Record<string, unknown>;
}

// ──────────────────────────────────────────────────────────
// AUDIT & SECURITY EVENT TYPES
// ──────────────────────────────────────────────────────────

export enum AuditEventType {
  // Auth events
  LOGIN_SUCCESS = 'AUTH.LOGIN_SUCCESS',
  LOGIN_FAILURE = 'AUTH.LOGIN_FAILURE',
  LOGOUT = 'AUTH.LOGOUT',
  TOKEN_REFRESH = 'AUTH.TOKEN_REFRESH',
  SESSION_REVOKED = 'AUTH.SESSION_REVOKED',

  // Permission events
  PERMISSION_GRANTED = 'PERMISSION.GRANTED',
  PERMISSION_DENIED = 'PERMISSION.DENIED',
  ROLE_ASSIGNED = 'PERMISSION.ROLE_ASSIGNED',
  ROLE_REMOVED = 'PERMISSION.ROLE_REMOVED',

  // User events
  USER_CREATED = 'USER.CREATED',
  USER_UPDATED = 'USER.UPDATED',
  USER_DELETED = 'USER.DELETED',
  USER_STATUS_CHANGED = 'USER.STATUS_CHANGED',

  // Security events
  SUSPICIOUS_ACTIVITY = 'SECURITY.SUSPICIOUS_ACTIVITY',
  BRUTE_FORCE_ATTEMPT = 'SECURITY.BRUTE_FORCE_ATTEMPT',
  UNAUTHORIZED_ACCESS = 'SECURITY.UNAUTHORIZED_ACCESS',
  PERMISSION_ESCALATION_ATTEMPT = 'SECURITY.PERMISSION_ESCALATION_ATTEMPT',
  DEVICE_ADDED = 'SECURITY.DEVICE_ADDED',
  DEVICE_REMOVED = 'SECURITY.DEVICE_REMOVED',

  // Data events
  DATA_EXPORTED = 'DATA.EXPORTED',
  DATA_DELETED = 'DATA.DELETED',
  DATA_MODIFIED = 'DATA.MODIFIED',

  // Admin events
  SETTINGS_CHANGED = 'ADMIN.SETTINGS_CHANGED',
  POLICY_CREATED = 'ADMIN.POLICY_CREATED',
  POLICY_UPDATED = 'ADMIN.POLICY_UPDATED',
  POLICY_DELETED = 'ADMIN.POLICY_DELETED',
}

export enum AuditEventSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export interface AuditEvent {
  eventId: string;
  eventType: AuditEventType;
  severity: AuditEventSeverity;
  actor: {
    userId: string;
    role: EnterpriseRole;
    email: string;
  };
  resource: {
    resourceType: string;
    resourceId: string;
    action: string;
  };
  result: 'SUCCESS' | 'FAILURE';
  metadata: Record<string, unknown>;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
  tenantId?: string;
}

// ──────────────────────────────────────────────────────────
// TENANT ISOLATION TYPES
// ──────────────────────────────────────────────────────────

export interface TenantContext {
  tenantId: string;
  tenantName: string;
  plan: 'free' | 'pro' | 'enterprise';
  status: 'active' | 'suspended' | 'deleted';
  createdAt: Date;
  metadata?: Record<string, unknown>;
}

// ──────────────────────────────────────────────────────────
// THREAT DETECTION TYPES
// ──────────────────────────────────────────────────────────

export enum ThreatLevel {
  SAFE = 'SAFE',
  WARNING = 'WARNING',
  ALERT = 'ALERT',
  CRITICAL = 'CRITICAL',
}

export interface SecurityThreat {
  threatId: string;
  threatType: string;
  threatLevel: ThreatLevel;
  userId: string;
  ipAddress: string;
  description: string;
  metadata: Record<string, unknown>;
  detectedAt: Date;
  resolvedAt?: Date;
  action: 'BLOCK' | 'THROTTLE' | 'LOG' | 'ALERT';
}

// ──────────────────────────────────────────────────────────
// JWT & TOKEN TYPES
// ──────────────────────────────────────────────────────────

export interface JWTPayload {
  sub: string;              // User ID
  email: string;
  role: EnterpriseRole;
  sessionId: string;
  tenantId?: string;
  permissions: EnterprisePermission[];
  iat: number;              // Issued at
  exp: number;              // Expiration
  aud: string;              // Audience
}

export interface RefreshTokenData {
  refreshToken: string;
  refreshTokenHash: string;
  expiresAt: Date;
}
