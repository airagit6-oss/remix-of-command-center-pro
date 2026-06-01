import { FastifyRequest, FastifyReply } from 'fastify';
import { AppError } from './errorHandler';
import { logger } from '../utils/logger';

/**
 * PRODUCTION RBAC (Role-Based Access Control)
 * Enforces permissions at API boundaries
 */

export type Role = 'admin' | 'reseller' | 'author' | 'user';
export type Permission = string;

// Define role permissions
const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  admin: [
    'admin:read',
    'admin:write',
    'admin:delete',
    'user:manage',
    'report:view',
    'analytics:view',
  ],
  reseller: [
    'reseller:read',
    'reseller:write',
    'reseller:leads',
    'reseller:commissions',
    'reseller:payouts',
  ],
  author: [
    'author:read',
    'author:write',
    'author:products',
    'author:analytics',
    'author:earnings',
  ],
  user: ['user:read', 'marketplace:view', 'cart:manage', 'orders:view'],
};

/**
 * Check if user has required role
 */
export const requireRole = (allowedRoles: Role[]) => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const userRole = request.user?.role as Role;

    if (!userRole || !allowedRoles.includes(userRole)) {
      logger.warn({
        type: 'rbac_violation',
        userId: request.user?.id,
        requiredRole: allowedRoles,
        userRole,
        path: request.url,
      });

      throw new AppError(403, `Access denied. Required role: ${allowedRoles.join(', ')}`);
    }
  };
};

/**
 * Check if user has required permission
 */
export const requirePermission = (requiredPermissions: Permission[]) => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const userRole = request.user?.role as Role;
    const userPermissions = ROLE_PERMISSIONS[userRole] || [];

    const hasPermission = requiredPermissions.some((perm) =>
      userPermissions.includes(perm)
    );

    if (!hasPermission) {
      logger.warn({
        type: 'permission_violation',
        userId: request.user?.id,
        requiredPermissions,
        userRole,
        path: request.url,
      });

      throw new AppError(
        403,
        `Access denied. Required permission: ${requiredPermissions.join(' or ')}`
      );
    }
  };
};

/**
 * Check if user owns resource (for ownership-based access)
 */
export const requireOwnership = (resourceOwnerField: string = 'userId') => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const resource = request.params as any;
    const resourceOwnerId = resource[resourceOwnerField];
    const currentUserId = request.user?.id;
    const isAdmin = request.user?.role === 'admin';

    // Admin can access anything
    if (isAdmin) return;

    if (resourceOwnerId !== currentUserId) {
      logger.warn({
        type: 'ownership_violation',
        userId: currentUserId,
        resourceOwnerId,
        path: request.url,
      });

      throw new AppError(403, 'You do not have access to this resource');
    }
  };
};

/**
 * Get user permissions for current role
 */
export const getUserPermissions = (role: Role): Permission[] => {
  return ROLE_PERMISSIONS[role] || [];
};

/**
 * Add custom permission check
 */
export const requireCustom = (checkFn: (request: FastifyRequest) => boolean) => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    if (!checkFn(request)) {
      logger.warn({
        type: 'custom_check_failed',
        userId: request.user?.id,
        path: request.url,
      });

      throw new AppError(403, 'Access denied');
    }
  };
};

// Extend FastifyRequest type
declare module 'fastify' {
  interface FastifyRequest {
    user?: {
      id: string;
      role: Role;
      email: string;
    };
  }
}
