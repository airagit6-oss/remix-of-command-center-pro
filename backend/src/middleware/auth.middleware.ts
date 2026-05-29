import { FastifyRequest, FastifyReply } from 'fastify';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export interface AuthenticatedRequest extends FastifyRequest {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export async function authenticate(req: AuthenticatedRequest, reply: FastifyReply) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return reply.status(401).send({ error: 'No token provided' });
    }

    const token = authHeader.substring(7);
    
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role
    };
  } catch (error) {
    return reply.status(401).send({ error: 'Invalid or expired token' });
  }
}

export function requireRole(...allowedRoles: string[]) {
  return async (req: AuthenticatedRequest, reply: FastifyReply) => {
    if (!req.user) {
      return reply.status(401).send({ error: 'Not authenticated' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return reply.status(403).send({ error: 'Insufficient permissions' });
    }
  };
}

export function requireOwnership(entityType: string) {
  return async (req: AuthenticatedRequest, reply: FastifyReply) => {
    const { id } = req.params as any;
    const userId = req.user?.id;

    if (!userId) {
      return reply.status(401).send({ error: 'Not authenticated' });
    }

    const prisma = (await import('@prisma/client')).PrismaClient;
    const prismaClient = new prisma();

    try {
      let isOwner = false;

      switch (entityType) {
        case 'Product': {
          const product = await prismaClient.product.findUnique({
            where: { id },
            include: { author: true }
          });
          isOwner = product?.author.userId === userId;
          break;
        }
        case 'Lead': {
          const lead = await prismaClient.lead.findUnique({
            where: { id },
            include: { reseller: true }
          });
          isOwner = lead?.reseller.userId === userId;
          break;
        }
        case 'Payout': {
          const payout = await prismaClient.payout.findUnique({
            where: { id }
          });
          isOwner = payout?.userId === userId;
          break;
        }
        case 'AuthorProfile': {
          const author = await prismaClient.authorProfile.findUnique({
            where: { id }
          });
          isOwner = author?.userId === userId;
          break;
        }
        case 'ResellerProfile': {
          const reseller = await prismaClient.resellerProfile.findUnique({
            where: { id }
          });
          isOwner = reseller?.userId === userId;
          break;
        }
        default:
          return reply.status(400).send({ error: 'Invalid entity type' });
      }

      if (!isOwner) {
        return reply.status(403).send({ error: 'You do not own this resource' });
      }
    } catch (error) {
      return reply.status(500).send({ error: 'Ownership check failed' });
    } finally {
      await prismaClient.$disconnect();
    }
  };
}
