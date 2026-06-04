import { FastifyInstance, FastifyRequest } from 'fastify';

declare module 'fastify' {
  interface FastifyRequest {
    user?: {
      id: string;
      role: 'admin' | 'reseller' | 'author' | 'user';
      email: string;
    };
    validatedData?: any;
  }

  interface FastifyInstance {
    authenticate: any; // JWT auth hook
  }
}
