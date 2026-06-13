import { FastifyRequest, FastifyReply } from 'fastify';

/**
 * Authorization middleware - checks if user has required role(s)
 * Must be used AFTER authenticate middleware
 */
export function authorize(...requiredRoles: string[]) {
  return async (req: any, reply: FastifyReply) => {
    // Check if user is authenticated
    if (!req.user) {
      return reply.status(401).send({
        error: 'UNAUTHORIZED',
        message: 'Not authenticated'
      });
    }

    // Check if user has required role
    if (!requiredRoles.includes(req.user.role)) {
      return reply.status(403).send({
        error: 'FORBIDDEN',
        message: `Insufficient permissions. Required roles: ${requiredRoles.join(', ')}. Your role: ${req.user.role}`
      });
    }

    // User is authorized, continue to next handler
  };
}

/**
 * Verify user owns the requested resource
 * Usage: { preHandler: [authenticate, verifyOwnership('product', 'productId')] }
 */
export function verifyOwnership(resourceType: string, idParamName: string = 'id') {
  return async (req: any, reply: FastifyReply) => {
    if (!req.user) {
      return reply.status(401).send({
        error: 'UNAUTHORIZED',
        message: 'Not authenticated'
      });
    }

    const resourceId = req.params[idParamName];
    if (!resourceId) {
      return reply.status(400).send({
        error: 'BAD_REQUEST',
        message: `Missing ${idParamName} parameter`
      });
    }

    // Store resourceId for use in handler
    req.resourceId = resourceId;
    // Ownership verification happens in route handler with database lookup
    // This middleware just validates the parameter exists
  };
}

/**
 * Check if user has specific permission
 * Can be used with custom permission system
 */
export function requirePermission(permission: string) {
  return async (req: any, reply: FastifyReply) => {
    if (!req.user) {
      return reply.status(401).send({
        error: 'UNAUTHORIZED',
        message: 'Not authenticated'
      });
    }

    // TODO: Implement permission checking system
    // For now, map common permissions to roles
    const rolePermissions: Record<string, string[]> = {
      ADMIN: ['*'], // Admin has all permissions
      AUTHOR: ['upload_product', 'edit_product', 'view_earnings'],
      RESELLER: ['manage_leads', 'manage_contacts', 'view_commission'],
      CUSTOMER: ['view_products', 'make_purchase', 'write_review']
    };

    const userPermissions = rolePermissions[req.user.role] || [];
    const hasPermission = userPermissions.includes('*') || userPermissions.includes(permission);

    if (!hasPermission) {
      return reply.status(403).send({
        error: 'FORBIDDEN',
        message: `Permission denied: ${permission}`
      });
    }
  };
}

/**
 * RBAC (Role-Based Access Control) levels:
 * - ADMIN: Full system access
 * - AUTHOR: Can upload products, view earnings
 * - RESELLER: Can manage sales, commissions, contacts
 * - CUSTOMER: Can browse, purchase, review products
 * - GUEST: Limited read access only
 */

export const ROLES = {
  ADMIN: 'ADMIN',
  AUTHOR: 'AUTHOR',
  RESELLER: 'RESELLER',
  CUSTOMER: 'CUSTOMER',
  GUEST: 'GUEST'
};

export const ROLE_HIERARCHY = {
  ADMIN: 4,
  AUTHOR: 3,
  RESELLER: 3,
  CUSTOMER: 2,
  GUEST: 1
};
