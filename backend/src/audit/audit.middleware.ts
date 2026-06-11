// ============================================================
// AUDIT MIDDLEWARE (STUB)
// Minimal stub - Audit logging disabled
// ============================================================

import { FastifyRequest, FastifyReply } from 'fastify';

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
    // Stub - do nothing
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

