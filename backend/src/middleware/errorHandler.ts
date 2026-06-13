import { FastifyError, FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

/**
 * Global error handler for Fastify
 * Standardizes error responses across the entire API
 * 
 * Usage in main server.ts:
 * fastify.setErrorHandler(globalErrorHandler);
 */

export interface ApiError {
  error: string;
  message: string;
  code?: string;
  statusCode: number;
  details?: any;
  timestamp: string;
  path?: string;
  requestId?: string;
}

export class AppError extends Error {
  constructor(
    public message: string,
    public code: string = 'INTERNAL_SERVER_ERROR',
    public statusCode: number = 500,
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
  }
}

/**
 * Register the global error handler with Fastify
 */
export function registerErrorHandler(fastify: FastifyInstance) {
  fastify.setErrorHandler((error: any, request: FastifyRequest, reply: FastifyReply) => {
    const requestId = request.id || 'unknown';
    const path = request.url;
    const timestamp = new Date().toISOString();

    // Log the error for monitoring/debugging
    if (error.statusCode >= 500) {
      console.error(`[ERROR] ${timestamp} [${requestId}] ${path}:`, {
        error: error.code || error.message,
        stack: error.stack,
        details: error.details
      });
    } else {
      console.warn(`[WARN] ${timestamp} [${requestId}] ${path}:`, {
        error: error.code || error.message
      });
    }

    // Handle AppError instances
    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({
        error: error.code,
        message: error.message,
        code: error.code,
        statusCode: error.statusCode,
        details: error.details,
        timestamp,
        path,
        requestId
      } as ApiError);
    }

    // Handle Fastify validation errors (400)
    if (error.validation) {
      return reply.status(400).send({
        error: 'VALIDATION_ERROR',
        message: 'Request validation failed',
        code: 'VALIDATION_ERROR',
        statusCode: 400,
        details: error.validation,
        timestamp,
        path,
        requestId
      } as ApiError);
    }

    // Handle JWT errors
    if (error.name === 'UnauthorizedError' || error.code === 'FST_JWT_VERIFICATION_FAILED') {
      return reply.status(401).send({
        error: 'UNAUTHORIZED',
        message: 'Invalid or expired authentication token',
        code: 'INVALID_TOKEN',
        statusCode: 401,
        timestamp,
        path,
        requestId
      } as ApiError);
    }

    // Handle Fastify HTTP errors
    if (error.statusCode) {
      return reply.status(error.statusCode).send({
        error: error.code || 'HTTP_ERROR',
        message: error.message,
        code: error.code,
        statusCode: error.statusCode,
        timestamp,
        path,
        requestId
      } as ApiError);
    }

    // Generic 500 error
    return reply.status(500).send({
      error: 'INTERNAL_SERVER_ERROR',
      message: process.env.NODE_ENV === 'production' 
        ? 'Internal server error' 
        : error.message || 'An unexpected error occurred',
      code: 'INTERNAL_SERVER_ERROR',
      statusCode: 500,
      details: process.env.NODE_ENV === 'production' ? undefined : {
        name: error.name,
        stack: error.stack
      },
      timestamp,
      path,
      requestId
    } as ApiError);
  });
}

/**
 * Helper functions for throwing common errors
 */

export function throwUnauthorized(message: string = 'Unauthorized') {
  throw new AppError(message, 'UNAUTHORIZED', 401);
}

export function throwForbidden(message: string = 'Forbidden') {
  throw new AppError(message, 'FORBIDDEN', 403);
}

export function throwBadRequest(message: string, details?: any) {
  throw new AppError(message, 'BAD_REQUEST', 400, details);
}

export function throwNotFound(resource: string = 'Resource') {
  throw new AppError(`${resource} not found`, 'NOT_FOUND', 404);
}

export function throwConflict(message: string) {
  throw new AppError(message, 'CONFLICT', 409);
}

export function throwValidationError(message: string, details?: any) {
  throw new AppError(message, 'VALIDATION_ERROR', 400, details);
}

export function throwInternalError(message: string, details?: any) {
  throw new AppError(message, 'INTERNAL_SERVER_ERROR', 500, details);
}
