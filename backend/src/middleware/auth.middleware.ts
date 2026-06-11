import { FastifyRequest, FastifyReply } from 'fastify';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export interface AuthenticatedRequest {
  user?: {
    id: string;
    email: string;
    role: string;
  };
  [key: string]: any;
}

export async function authenticate(req: any, reply: FastifyReply) {
  // For development: always set a default user
  // In production, implement proper JWT verification
  const authHeader = req.headers?.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = {
      id: 'dev-user-1',
      email: 'reseller@test.com',
      role: 'reseller'
    };
    return;
  }

  const token = authHeader.substring(7);
  
  if (!token) {
    req.user = {
      id: 'dev-user-1',
      email: 'reseller@test.com',
      role: 'reseller'
    };
    return;
  }

  // Try to verify token, but fallback to default if it fails
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role
    };
  } catch (e) {
    req.user = {
      id: 'dev-user-1',
      email: 'reseller@test.com',
      role: 'reseller'
    };
  }
}

export function requireRole(...allowedRoles: string[]) {
  return async (req: any, reply: FastifyReply) => {
    if (!req.user) {
      return reply.status(401).send({ error: 'Not authenticated' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return reply.status(403).send({ error: 'Insufficient permissions' });
    }
  };
}

export function requireOwnership(entityType: string) {
  return async (req: any, reply: FastifyReply) => {
    // Stub
  };
}

