/**
 * ENTERPRISE SECURITY MIDDLEWARE SUITE
 * ═══════════════════════════════════════════════════════════
 * Express middleware for authentication, authorization,
 * rate limiting, audit logging, and security headers.
 * 
 * EXTENDS existing backend patterns
 */

import { Request, Response, NextFunction } from 'express';
import { JWTPayload, EnterpriseRole, SecurityEventType, AuditLogEntry } from './types';
import {
  verifyPermission,
  hasPermissionInTenant,
  PermissionContext,
  extractPermissionContextFromJWT,
} from './rbac-engine';

// ──────────────────────────────────────────────────────────
// EXTENDED REQUEST INTERFACE
// ──────────────────────────────────────────────────────────

declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
      permissionContext?: PermissionContext;
      requestId?: string;
      startTime?: number;
      securityEvents?: SecurityEventType[];
    }
  }
}

// ──────────────────────────────────────────────────────────
// AUTHENTICATION MIDDLEWARE
// ──────────────────────────────────────────────────────────

export const authenticateMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Missing authorization token' });
      return;
    }

    const token = authHeader.substring(7);

    // Verify and decode JWT (implementation depends on jwt library)
    // const payload = verifyJWT(token);
    // For now, assume payload is attached
    
    // In real implementation:
    // const payload: JWTPayload = jwt.verify(token, process.env.JWT_SECRET) as JWTPayload;
    // req.user = payload;
    // req.permissionContext = extractPermissionContextFromJWT(payload);

    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

/**
 * Optional authentication — attach user if token exists
 */
export const optionalAuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      // Attempt to decode (see authenticateMiddleware for full implementation)
      // req.user = jwt.verify(token, process.env.JWT_SECRET) as JWTPayload;
      // req.permissionContext = extractPermissionContextFromJWT(req.user);
    }
    next();
  } catch {
    // Silently fail — user will be undefined
    next();
  }
};

// ──────────────────────────────────────────────────────────
// AUTHORIZATION MIDDLEWARE
// ──────────────────────────────────────────────────────────

/**
 * Require specific permission
 */
export const requirePermission = (requiredPermission: string) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    if (!req.permissionContext) {
      res.status(403).json({ error: 'Permission context missing' });
      return;
    }

    if (!verifyPermission(req.permissionContext, requiredPermission as any)) {
      res.status(403).json({ error: 'Insufficient permissions' });
      return;
    }

    next();
  };
};

/**
 * Require specific role
 */
export const requireRole = (requiredRole: EnterpriseRole) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    if (req.user.role !== requiredRole) {
      res.status(403).json({ error: 'Insufficient role' });
      return;
    }

    next();
  };
};

/**
 * Require any of multiple roles
 */
export const requireAnyRole = (allowedRoles: EnterpriseRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({ error: 'Insufficient role' });
      return;
    }

    next();
  };
};

/**
 * Require tenant access
 */
export const requireTenantAccess = () => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const requestedTenantId = req.params.tenantId || req.query.tenantId;

    // SUPER_ADMIN can access any tenant
    if (req.user.role === EnterpriseRole.SUPER_ADMIN) {
      next();
      return;
    }

    // Other users must be in the requested tenant
    if (req.user.tenantId !== requestedTenantId) {
      res.status(403).json({ error: 'Tenant access denied' });
      return;
    }

    next();
  };
};

// ──────────────────────────────────────────────────────────
// RATE LIMITING MIDDLEWARE
// ──────────────────────────────────────────────────────────

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Rate limit by IP or user ID
 */
export const rateLimit = (maxRequests: number, windowMs: number) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const key = req.user?.sub || req.ip || 'unknown';
    const now = Date.now();

    let entry = rateLimitStore.get(key);
    if (!entry || entry.resetTime < now) {
      entry = { count: 0, resetTime: now + windowMs };
      rateLimitStore.set(key, entry);
    }

    entry.count++;

    res.set('X-RateLimit-Limit', maxRequests.toString());
    res.set('X-RateLimit-Remaining', Math.max(0, maxRequests - entry.count).toString());
    res.set('X-RateLimit-Reset', entry.resetTime.toString());

    if (entry.count > maxRequests) {
      res.status(429).json({ error: 'Too many requests' });
      return;
    }

    next();
  };
};

/**
 * Auth endpoint rate limiting (stricter)
 */
export const authRateLimit = rateLimit(20, 15 * 60 * 1000); // 20 requests per 15 minutes

/**
 * API rate limiting (standard)
 */
export const apiRateLimit = rateLimit(300, 60 * 1000); // 300 requests per minute

// ──────────────────────────────────────────────────────────
// AUDIT LOGGING MIDDLEWARE
// ──────────────────────────────────────────────────────────

/**
 * Log all API requests and access
 */
export const auditLogMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  req.startTime = Date.now();
  req.requestId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  req.securityEvents = [];

  // Override res.json to log response
  const originalJson = res.json;
  res.json = function (data: any) {
    if (req.user && req.startTime) {
      const duration = Date.now() - req.startTime;
      const auditLog: AuditLogEntry = {
        id: req.requestId!,
        userId: req.user.sub,
        action: `${req.method} ${req.path}`,
        resource: req.path,
        status: res.statusCode,
        duration,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        metadata: {
          method: req.method,
          path: req.path,
          query: req.query,
          statusCode: res.statusCode,
        },
        createdAt: new Date(),
        securityEvents: req.securityEvents,
      };
      
      // Log audit entry (implementation dependent on logging service)
      // await logAuditEntry(auditLog);
    }

    return originalJson.call(this, data);
  };

  next();
};

// ──────────────────────────────────────────────────────────
// SECURITY HEADERS MIDDLEWARE
// ──────────────────────────────────────────────────────────

export const securityHeadersMiddleware = (
  _req: Request,
  res: Response,
  next: NextFunction,
): void => {
  // Content Security Policy
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'",
  );

  // HSTS (HTTP Strict-Transport-Security)
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

  // X-Frame-Options
  res.setHeader('X-Frame-Options', 'DENY');

  // X-Content-Type-Options
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // X-XSS-Protection
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // Referrer-Policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Permissions-Policy
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

  next();
};

// ──────────────────────────────────────────────────────────
// SUSPICIOUS ACTIVITY DETECTION
// ──────────────────────────────────────────────────────────

interface SuspiciousActivity {
  userId: string;
  type: string;
  count: number;
  firstSeen: Date;
  lastSeen: Date;
}

const suspiciousActivityStore = new Map<string, SuspiciousActivity>();

/**
 * Detect and log suspicious activity
 */
export const suspiciousActivityDetectionMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (!req.user) {
    next();
    return;
  }

  // Detect multiple failed permission checks
  if (res.statusCode === 403) {
    const key = `permission_denied_${req.user.sub}`;
    let activity = suspiciousActivityStore.get(key);

    if (!activity) {
      activity = {
        userId: req.user.sub,
        type: 'MULTIPLE_PERMISSION_DENIALS',
        count: 0,
        firstSeen: new Date(),
        lastSeen: new Date(),
      };
      suspiciousActivityStore.set(key, activity);
    }

    activity.count++;
    activity.lastSeen = new Date();

    // Alert if too many permission denials in short time
    if (activity.count > 10) {
      req.securityEvents?.push('SUSPICIOUS_PERMISSION_PATTERN');
    }
  }

  // Detect multiple auth failures
  if (res.statusCode === 401 && req.path.includes('/auth/')) {
    const key = `auth_failure_${req.ip}`;
    let activity = suspiciousActivityStore.get(key);

    if (!activity) {
      activity = {
        userId: 'unknown',
        type: 'MULTIPLE_AUTH_FAILURES',
        count: 0,
        firstSeen: new Date(),
        lastSeen: new Date(),
      };
      suspiciousActivityStore.set(key, activity);
    }

    activity.count++;
    activity.lastSeen = new Date();

    if (activity.count > 5) {
      req.securityEvents?.push('SUSPICIOUS_AUTH_PATTERN');
      // Could trigger account lockout here
    }
  }

  next();
};

// ──────────────────────────────────────────────────────────
// CSRF PROTECTION MIDDLEWARE
// ──────────────────────────────────────────────────────────

const csrfTokenStore = new Map<string, { token: string; expiresAt: number }>();

export const generateCSRFToken = (sessionId: string): string => {
  const token = `${Date.now()}-${Math.random().toString(36).substr(2, 24)}`;
  csrfTokenStore.set(sessionId, {
    token,
    expiresAt: Date.now() + 60 * 60 * 1000, // 1 hour
  });
  return token;
};

export const verifyCSRFToken = (sessionId: string, token: string): boolean => {
  const stored = csrfTokenStore.get(sessionId);
  if (!stored) return false;
  if (stored.expiresAt < Date.now()) return false;
  return stored.token === token;
};

export const csrfProtectionMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  // GET requests are exempt from CSRF
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    next();
    return;
  }

  const token = req.headers['x-csrf-token'] as string;
  const sessionId = req.user?.sessionId;

  if (!sessionId || !token) {
    res.status(403).json({ error: 'CSRF token missing' });
    return;
  }

  if (!verifyCSRFToken(sessionId, token)) {
    res.status(403).json({ error: 'Invalid CSRF token' });
    return;
  }

  next();
};

// ──────────────────────────────────────────────────────────
// REQUEST ID TRACKING
// ──────────────────────────────────────────────────────────

export const requestIdMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  req.requestId = req.headers['x-request-id'] as string || generateRequestId();
  res.setHeader('X-Request-ID', req.requestId);
  next();
};

function generateRequestId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// ──────────────────────────────────────────────────────────
// MIDDLEWARE COMPOSITION
// ──────────────────────────────────────────────────────────

export function createSecurityMiddlewareStack() {
  return [
    requestIdMiddleware,
    securityHeadersMiddleware,
    auditLogMiddleware,
    suspiciousActivityDetectionMiddleware,
    csrfProtectionMiddleware,
  ];
}

export function createAuthenticatedMiddlewareStack() {
  return [
    authenticateMiddleware,
    auditLogMiddleware,
    suspiciousActivityDetectionMiddleware,
  ];
}
