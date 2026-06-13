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
  const authHeader = req.headers?.authorization;
  
  // Require Bearer token to be present
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return reply.status(401).send({ 
      error: 'UNAUTHORIZED',
      message: 'Missing or invalid authorization header. Expected: Authorization: Bearer <token>'
    });
  }

  const token = authHeader.substring(7);
  
  if (!token) {
    return reply.status(401).send({ 
      error: 'UNAUTHORIZED',
      message: 'Missing token'
    });
  }

  // Verify JWT token - NO FALLBACK TO DEFAULT USER
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    if (!decoded.id || !decoded.email || !decoded.role) {
      return reply.status(401).send({ 
        error: 'INVALID_TOKEN',
        message: 'Token missing required fields (id, email, role)'
      });
    }
    
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role
    };
  } catch (e: any) {
    if (e.name === 'TokenExpiredError') {
      return reply.status(401).send({ 
        error: 'TOKEN_EXPIRED',
        message: 'Token has expired'
      });
    }
    
    return reply.status(401).send({ 
      error: 'INVALID_TOKEN',
      message: 'Invalid or malformed token'
    });
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

