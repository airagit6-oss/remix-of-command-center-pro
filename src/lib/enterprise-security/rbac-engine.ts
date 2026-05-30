/**
 * ENTERPRISE RBAC ENGINE
 * ═══════════════════════════════════════════════════════════
 * Role-Based Access Control with permission inheritance,
 * role hierarchy, and tenant isolation.
 * 
 * EXTENDS existing src/lib/roles.ts pattern
 */

import {
  EnterpriseRole,
  EnterprisePermission,
  ROLE_HIERARCHY,
  ROLE_PERMISSION_MATRIX,
  TenantContext,
  JWTPayload,
} from './types';

// ──────────────────────────────────────────────────────────
// ROLE HIERARCHY CHECKS
// ──────────────────────────────────────────────────────────

/**
 * Check if a role has a specific permission
 * Includes inherited permissions from role hierarchy
 */
export function hasPermission(
  role: EnterpriseRole,
  permission: EnterprisePermission,
): boolean {
  // Direct permission
  const directPermissions = ROLE_PERMISSION_MATRIX[role] || [];
  if (directPermissions.includes(permission)) {
    return true;
  }

  // Check inherited permissions from hierarchy
  const inheritedRoles = ROLE_HIERARCHY[role] || [];
  for (const inheritedRole of inheritedRoles) {
    const inheritedPermissions = ROLE_PERMISSION_MATRIX[inheritedRole] || [];
    if (inheritedPermissions.includes(permission)) {
      return true;
    }
  }

  return false;
}

/**
 * Check if user can perform action on resource
 */
export function canPerform(
  userRole: EnterpriseRole,
  requiredPermission: EnterprisePermission,
): boolean {
  return hasPermission(userRole, requiredPermission);
}

/**
 * Check if role can access another role
 * Used for user management — prevent privilege escalation
 */
export function canManageRole(
  actorRole: EnterpriseRole,
  targetRole: EnterpriseRole,
): boolean {
  // SUPER_ADMIN can manage any role
  if (actorRole === EnterpriseRole.SUPER_ADMIN) {
    return true;
  }

  // ADMIN can manage non-ADMIN roles
  if (actorRole === EnterpriseRole.ADMIN) {
    return targetRole !== EnterpriseRole.SUPER_ADMIN && targetRole !== EnterpriseRole.ADMIN;
  }

  // Other roles cannot manage any roles
  return false;
}

/**
 * Get all permissions for a role (including inherited)
 */
export function getAllPermissions(role: EnterpriseRole): EnterprisePermission[] {
  const permissions = new Set<EnterprisePermission>();

  // Add direct permissions
  const directPerms = ROLE_PERMISSION_MATRIX[role] || [];
  directPerms.forEach(p => permissions.add(p));

  // Add inherited permissions
  const inheritedRoles = ROLE_HIERARCHY[role] || [];
  for (const inheritedRole of inheritedRoles) {
    const inheritedPerms = ROLE_PERMISSION_MATRIX[inheritedRole] || [];
    inheritedPerms.forEach(p => permissions.add(p));
  }

  return Array.from(permissions);
}

/**
 * Get role hierarchy level (for permission escalation prevention)
 * Higher number = higher privilege
 */
export function getRoleHierarchyLevel(role: EnterpriseRole): number {
  const hierarchy = [
    EnterpriseRole.USER,
    EnterpriseRole.SUPPORT,
    EnterpriseRole.FINANCE,
    EnterpriseRole.AUTHOR,
    EnterpriseRole.RESELLER,
    EnterpriseRole.AI,
    EnterpriseRole.ADMIN,
    EnterpriseRole.SUPER_ADMIN,
  ];
  return hierarchy.indexOf(role);
}

/**
 * Prevent privilege escalation
 * User cannot assign roles higher than their own
 */
export function canAssignRole(actorRole: EnterpriseRole, targetRole: EnterpriseRole): boolean {
  const actorLevel = getRoleHierarchyLevel(actorRole);
  const targetLevel = getRoleHierarchyLevel(targetRole);
  return actorLevel > targetLevel;
}

// ──────────────────────────────────────────────────────────
// PERMISSION CONTEXT CHECKS
// ──────────────────────────────────────────────────────────

export interface PermissionContext {
  userRole: EnterpriseRole;
  userId: string;
  tenantId?: string;
  permissions: EnterprisePermission[];
  metadata?: Record<string, unknown>;
}

/**
 * Verify user has required permission in context
 */
export function verifyPermission(
  context: PermissionContext,
  requiredPermission: EnterprisePermission,
  deniedCallback?: (reason: string) => void,
): boolean {
  // Check direct permission list
  if (context.permissions.includes(requiredPermission)) {
    return true;
  }

  // Check role-based permission
  if (hasPermission(context.userRole, requiredPermission)) {
    return true;
  }

  if (deniedCallback) {
    deniedCallback(`User role ${context.userRole} lacks permission ${requiredPermission}`);
  }

  return false;
}

/**
 * Verify user can perform multiple permissions (AND logic)
 */
export function verifyAllPermissions(
  context: PermissionContext,
  requiredPermissions: EnterprisePermission[],
): boolean {
  return requiredPermissions.every(perm => verifyPermission(context, perm));
}

/**
 * Verify user can perform any of the permissions (OR logic)
 */
export function verifyAnyPermission(
  context: PermissionContext,
  requiredPermissions: EnterprisePermission[],
): boolean {
  return requiredPermissions.some(perm => verifyPermission(context, perm));
}

// ──────────────────────────────────────────────────────────
// TENANT ISOLATION & SCOPING
// ──────────────────────────────────────────────────────────

export interface ScopedPermission {
  permission: EnterprisePermission;
  tenantScopes: string[]; // tenant IDs where this permission applies
  resourceScopes: string[]; // resource IDs within tenant
}

/**
 * Check if user has scoped permission (cross-tenant access prevention)
 */
export function hasPermissionInTenant(
  context: PermissionContext,
  requiredPermission: EnterprisePermission,
  resourceTenantId: string,
): boolean {
  // SUPER_ADMIN has access across all tenants
  if (context.userRole === EnterpriseRole.SUPER_ADMIN) {
    return verifyPermission(context, requiredPermission);
  }

  // Other users must be in the same tenant
  if (context.tenantId !== resourceTenantId) {
    return false;
  }

  return verifyPermission(context, requiredPermission);
}

/**
 * Get resources user can access in tenant
 */
export function getAccessibleResourcesInTenant(
  context: PermissionContext,
  resourceType: string,
  tenantId: string,
): string[] {
  // SUPER_ADMIN has access to all resources
  if (context.userRole === EnterpriseRole.SUPER_ADMIN) {
    return ['*']; // Wildcard = all resources
  }

  // ADMIN has access to all resources in their tenant
  if (context.userRole === EnterpriseRole.ADMIN && context.tenantId === tenantId) {
    return ['*'];
  }

  // Other roles have resource-level restrictions
  // This should be fetched from a resource permissions table
  return [];
}

// ──────────────────────────────────────────────────────────
// JWT PERMISSION EXTRACTION
// ──────────────────────────────────────────────────────────

/**
 * Extract permission context from JWT payload
 */
export function extractPermissionContextFromJWT(payload: JWTPayload): PermissionContext {
  return {
    userRole: payload.role,
    userId: payload.sub,
    tenantId: payload.tenantId,
    permissions: payload.permissions,
    metadata: {
      email: payload.email,
      sessionId: payload.sessionId,
    },
  };
}

/**
 * Validate JWT has required permission
 */
export function validateJWTPermission(
  payload: JWTPayload,
  requiredPermission: EnterprisePermission,
): boolean {
  const context = extractPermissionContextFromJWT(payload);
  return verifyPermission(context, requiredPermission);
}

/**
 * Build JWT permission claims
 */
export function buildJWTPermissions(role: EnterpriseRole): EnterprisePermission[] {
  return getAllPermissions(role);
}

// ──────────────────────────────────────────────────────────
// PERMISSION POLICY ENGINE
// ──────────────────────────────────────────────────────────

export interface PermissionPolicy {
  policyId: string;
  name: string;
  roles: EnterpriseRole[];
  permissions: EnterprisePermission[];
  conditions?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Evaluate policy against context
 */
export function evaluatePolicyAgainstContext(
  policy: PermissionPolicy,
  context: PermissionContext,
): boolean {
  // Check if user's role is in policy
  if (!policy.roles.includes(context.userRole)) {
    return false;
  }

  // Check if user has all required permissions
  return policy.permissions.every(perm => hasPermission(context.userRole, perm));
}

/**
 * Get applicable policies for user
 */
export function getApplicablePolicies(
  context: PermissionContext,
  policies: PermissionPolicy[],
): PermissionPolicy[] {
  return policies.filter(policy => evaluatePolicyAgainstContext(policy, context));
}

// ──────────────────────────────────────────────────────────
// ROLE VERIFICATION HELPERS
// ──────────────────────────────────────────────────────────

export function isAdmin(role: EnterpriseRole): boolean {
  return role === EnterpriseRole.ADMIN || role === EnterpriseRole.SUPER_ADMIN;
}

export function isSuperAdmin(role: EnterpriseRole): boolean {
  return role === EnterpriseRole.SUPER_ADMIN;
}

export function isReseller(role: EnterpriseRole): boolean {
  return role === EnterpriseRole.RESELLER;
}

export function isAuthor(role: EnterpriseRole): boolean {
  return role === EnterpriseRole.AUTHOR;
}

export function isSupport(role: EnterpriseRole): boolean {
  return role === EnterpriseRole.SUPPORT;
}

export function isFinance(role: EnterpriseRole): boolean {
  return role === EnterpriseRole.FINANCE;
}

export function isAIRole(role: EnterpriseRole): boolean {
  return role === EnterpriseRole.AI;
}

export function isUser(role: EnterpriseRole): boolean {
  return role === EnterpriseRole.USER;
}
