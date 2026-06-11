import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

// Stub error handler
export async function errorHandler(error: any, request: FastifyRequest, reply: FastifyReply) {
  return reply.status(500).send({ error: 'Internal Server Error' });
}

// Stub not found handler
export async function notFoundHandler(request: FastifyRequest, reply: FastifyReply) {
  return reply.status(404).send({ error: 'Not Found' });
}
