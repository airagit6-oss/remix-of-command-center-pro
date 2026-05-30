// ============================================================
// AUDIT MIDDLEWARE
// Middleware for automatic audit logging
// ============================================================

import { FastifyRequest, FastifyReply } from 'fastify';
import { AuditLogService } from './audit.service';

export interface AuditConfig {
  action: string;
  entityType: string;
  entityId?: string | ((req: FastifyRequest) => string);
  extractChanges?: (req: FastifyRequest) => Record<string, any>;
  extractMetadata?: (req: FastifyRequest) => Record<string, any>;
  logOnSuccess?: boolean;
  logOnError?: boolean;
}

export function auditMiddleware(config: AuditConfig) {
  return async (req: FastifyRequest, reply: FastifyReply) => {
    const startTime = Date.now();

    // Store original send function
    const originalSend = reply.raw.send;

    // Override send to intercept response
    reply.raw.send = function (this: any, body: any) {
      const duration = Date.now() - startTime;
      const isSuccess = reply.statusCode < 400;

      // Determine if we should log
      const shouldLog = (isSuccess && config.logOnSuccess !== false) || 
                        (!isSuccess && config.logOnError !== false);

      if (shouldLog) {
        const entityId = typeof config.entityId === 'function' 
          ? config.entityId(req) 
          : config.entityId;

        const changes = config.extractChanges ? config.extractChanges(req) : undefined;
        const metadata = config.extractMetadata ? config.extractMetadata(req) : undefined;

        AuditLogService.log({
          userId: (req as any).user?.id,
          action: config.action,
          entityType: config.entityType,
          entityId: entityId || req.params.id || req.body?.id,
          changes,
          metadata: {
            ...metadata,
            statusCode: reply.statusCode,
            duration,
            method: req.method,
            path: req.url,
          },
          ipAddress: req.ip,
          userAgent: req.headers['user-agent'],
          severity: isSuccess ? 'INFO' : 'ERROR',
        }).catch(err => {
          console.error('Audit logging failed:', err);
        });
      }

      // Call original send
      return originalSend.call(this, body);
    };
  };
}

export function auditUserAction(action: string, entityType: string) {
  return auditMiddleware({
    action,
    entityType,
    logOnSuccess: true,
    logOnError: true,
  });
}

export function auditSecurityEvent(action: string, entityType: string) {
  return auditMiddleware({
    action,
    entityType,
    logOnSuccess: false,
    logOnError: true,
  });
}
