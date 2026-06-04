import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { logger } from '../utils/logger';

/**
 * PRODUCTION ERROR HANDLER
 * Catches all errors and returns safe, structured responses
 * No stack traces exposed to clients
 */

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational: boolean = true
  ) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (fastify: FastifyInstance) => {
  fastify.setErrorHandler(async (error, request, reply) => {
    // Log error with full details (internal only)
    logger.error({
      error: error.message,
      stack: error.stack,
      path: request.url,
      method: request.method,
      userId: request.user?.id,
      timestamp: new Date().toISOString(),
    });

    // Handle known errors
    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({
        success: false,
        error: error.message,
        code: error.statusCode,
        timestamp: new Date().toISOString(),
      });
    }

    // Handle validation errors (Fastify built-in)
    if (error.statusCode === 400) {
      return reply.status(400).send({
        success: false,
        error: 'Validation failed',
        code: 400,
        details: error.validation,
        timestamp: new Date().toISOString(),
      });
    }

    // Handle JWT errors
    if (error.name === 'UnauthorizedError' || error.message.includes('jwt')) {
      return reply.status(401).send({
        success: false,
        error: 'Authentication required',
        code: 401,
        timestamp: new Date().toISOString(),
      });
    }

    // Handle database errors (don't expose details)
    if (error.message.includes('database') || error.message.includes('prisma')) {
      logger.error({ error: 'Database error', details: error });
      return reply.status(500).send({
        success: false,
        error: 'Internal server error',
        code: 500,
        timestamp: new Date().toISOString(),
      });
    }

    // Handle rate limit errors
    if (error.statusCode === 429) {
      return reply.status(429).send({
        success: false,
        error: 'Too many requests. Please try again later.',
        code: 429,
        retryAfter: error.retryAfter || 60,
        timestamp: new Date().toISOString(),
      });
    }

    // Default: Generic error (never expose internals)
    return reply.status(500).send({
      success: false,
      error: 'Internal server error',
      code: 500,
      timestamp: new Date().toISOString(),
      requestId: request.id, // For debugging
    });
  });
};

/**
 * Throw errors from route handlers
 * Usage: throw new AppError(400, 'Invalid email')
 */
export const throwError = (statusCode: number, message: string) => {
  throw new AppError(statusCode, message);
};
