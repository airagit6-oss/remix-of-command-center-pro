/**
 * ============================================================================
 * REQUEST VALIDATION MIDDLEWARE
 * ============================================================================
 * Validates incoming requests for:
 * - Content-Type validation
 * - Payload size limits
 * - SQL injection prevention
 * - XSS prevention
 * - Suspicious patterns detection
 * ============================================================================
 */

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

/**
 * Dangerous patterns that suggest injection attacks
 */
const DANGEROUS_SQL_PATTERNS = [
  /(\b(union|select|insert|update|delete|drop|create|alter|exec|execute|script)\b)/gi,
  /([\'\"%;()]*.*([\'\"%;()])+.*)/,
  /(\/\*|\*\/|--|;|\|\|)/,
];

const XSS_PATTERNS = [
  /<script[^>]*>.*?<\/script>/gi,
  /on\w+\s*=/gi,
  /javascript:/gi,
  /<iframe/gi,
  /<object/gi,
  /<embed/gi,
];

/**
 * Scan request body for dangerous patterns
 */
function scanForDangerousPatterns(value: any, fieldPath = ''): { safe: boolean; reason?: string } {
  if (typeof value === 'string') {
    // Check for SQL injection
    for (const pattern of DANGEROUS_SQL_PATTERNS) {
      if (pattern.test(value)) {
        return {
          safe: false,
          reason: `SQL injection pattern detected in field: ${fieldPath}`,
        };
      }
    }

    // Check for XSS
    for (const pattern of XSS_PATTERNS) {
      if (pattern.test(value)) {
        return {
          safe: false,
          reason: `XSS pattern detected in field: ${fieldPath}`,
        };
      }
    }
  } else if (typeof value === 'object' && value !== null) {
    // Recursively check nested objects
    for (const [key, val] of Object.entries(value)) {
      const result = scanForDangerousPatterns(val, `${fieldPath}.${key}`);
      if (!result.safe) {
        return result;
      }
    }
  }

  return { safe: true };
}

/**
 * Content-Type validation middleware
 */
export async function validateContentType(request: FastifyRequest, reply: FastifyReply) {
  const contentType = request.headers['content-type'];
  
  // Whitelist allowed content types
  const allowedTypes = ['application/json', 'multipart/form-data', 'application/x-www-form-urlencoded'];
  
  if (request.method !== 'GET' && request.method !== 'HEAD' && request.method !== 'OPTIONS') {
    if (contentType && !allowedTypes.some(type => contentType.includes(type))) {
      return reply.code(415).send({
        code: 'UNSUPPORTED_MEDIA_TYPE',
        message: `Content-Type must be one of: ${allowedTypes.join(', ')}`,
      });
    }
  }
}

/**
 * Request payload validation middleware
 */
export async function validateRequestPayload(request: FastifyRequest, reply: FastifyReply) {
  // Skip GET, HEAD, OPTIONS
  if (['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
    return;
  }

  // Check body exists
  if (!request.body) {
    return; // Allow empty body for some endpoints
  }

  // Validate payload for dangerous patterns
  const validation = scanForDangerousPatterns(request.body);
  if (!validation.safe) {
    console.warn(`[SECURITY] ${validation.reason}`);
    return reply.code(400).send({
      code: 'INVALID_REQUEST_PAYLOAD',
      message: 'Request payload contains suspicious patterns',
      details: process.env.NODE_ENV === 'development' ? validation.reason : undefined,
    });
  }
}

/**
 * Request size limit validation
 */
export async function validateRequestSize(request: FastifyRequest, reply: FastifyReply) {
  const contentLength = parseInt(request.headers['content-length'] || '0', 10);
  const maxSize = parseInt(process.env.BODY_LIMIT_MB || '1', 10) * 1024 * 1024;

  if (contentLength > maxSize) {
    return reply.code(413).send({
      code: 'PAYLOAD_TOO_LARGE',
      message: `Request payload exceeds maximum size of ${process.env.BODY_LIMIT_MB}MB`,
    });
  }
}

/**
 * Sanitize sensitive data from logs
 */
export function sanitizeForLogging(obj: any): any {
  if (!obj) return obj;
  
  const sensitiveFields = (process.env.SENSITIVE_FIELDS_TO_HIDE || 'password,pin,token,secret,api_key').split(',');
  const clone = JSON.parse(JSON.stringify(obj));
  
  const sanitize = (target: any) => {
    if (typeof target !== 'object') return;
    
    for (const [key, value] of Object.entries(target)) {
      if (sensitiveFields.some(field => key.toLowerCase().includes(field.trim()))) {
        target[key] = '***REDACTED***';
      } else if (typeof value === 'object' && value !== null) {
        sanitize(value);
      }
    }
  };
  
  sanitize(clone);
  return clone;
}

/**
 * Register validation middleware with Fastify
 */
export async function registerValidationMiddleware(fastify: FastifyInstance) {
  // Content-Type validation
  fastify.addHook('preHandler', validateContentType);
  
  // Request size validation
  fastify.addHook('preHandler', validateRequestSize);
  
  // Payload validation
  fastify.addHook('preHandler', validateRequestPayload);
  
  console.log('[SECURITY] Request validation middleware registered');
}

export default {
  validateContentType,
  validateRequestPayload,
  validateRequestSize,
  sanitizeForLogging,
  registerValidationMiddleware,
};
