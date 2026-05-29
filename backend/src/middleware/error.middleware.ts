import { FastifyError, FastifyRequest, FastifyReply } from 'fastify';

export async function errorHandler(error: FastifyError, request: FastifyRequest, reply: FastifyReply) {
  const statusCode = error.statusCode || 500;
  
  // Log error
  request.log.error(error);

  // Handle validation errors
  if (error.validation) {
    return reply.status(400).send({
      error: 'Validation Error',
      details: error.validation
    });
  }

  // Handle JWT errors
  if (error.message.includes('jwt')) {
    return reply.status(401).send({
      error: 'Authentication Error',
      message: error.message
    });
  }

  // Handle Prisma errors
  if (error.code?.startsWith('P')) {
    return reply.status(400).send({
      error: 'Database Error',
      message: error.message
    });
  }

  // Default error response
  reply.status(statusCode).send({
    error: error.message || 'Internal Server Error',
    statusCode
  });
}

export async function notFoundHandler(request: FastifyRequest, reply: FastifyReply) {
  reply.status(404).send({
    error: 'Not Found',
    path: request.url
  });
}
