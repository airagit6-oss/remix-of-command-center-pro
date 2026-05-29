import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// POST /auth/register
export async function register(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { email, password, name, referralCode, role } = req.body as any;
    
    // Check if user exists
    const existing = await prisma.user.findUnique({
      where: { email }
    });

    if (existing) {
      return reply.status(400).send({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: role || 'CUSTOMER'
      }
    });

    // Handle referral
    if (referralCode) {
      const reseller = await prisma.resellerProfile.findUnique({
        where: { referralCode }
      });

      if (reseller) {
        // Validate referral (no self-referral, no duplicate)
        if (reseller.userId !== user.id) {
          const existingReferral = await prisma.referral.findFirst({
            where: {
              referrerId: reseller.userId,
              referredUserId: user.id
            }
          });

          if (!existingReferral) {
            await prisma.referral.create({
              data: {
                referrerId: reseller.userId,
                referredUserId: user.id,
                code: referralCode,
                status: 'PENDING'
              }
            });

            // Update reseller stats
            await prisma.resellerProfile.update({
              where: { id: reseller.id },
              data: { totalReferrals: { increment: 1 } }
            });
          }
        }
      }
    }

    // Create profile based on role
    if (role === 'AUTHOR') {
      await prisma.authorProfile.create({
        data: {
          userId: user.id
        }
      });
    } else if (role === 'RESELLER') {
      const referralCodeNew = `REF${Date.now().toString(36).toUpperCase()}${Math.floor(Date.now() % 10000)}`;
      await prisma.resellerProfile.create({
        data: {
          userId: user.id,
          referralCode: referralCodeNew,
          referralLink: `${process.env.APP_URL || 'http://localhost:3000'}/signup?ref=${referralCodeNew}`
        }
      });
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'REGISTER',
        entity: 'User',
        entityId: user.id,
        changes: { email, role: user.role, referralCode }
      }
    });

    reply.status(201).send({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      token
    });
  } catch (error) {
    reply.status(500).send({ error: 'Failed to register' });
  }
}

// POST /auth/login
export async function login(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { email, password } = req.body as any;
    
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return reply.status(401).send({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return reply.status(401).send({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'LOGIN',
        entity: 'User',
        entityId: user.id
      }
    });

    reply.send({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      token
    });
  } catch (error) {
    reply.status(500).send({ error: 'Failed to login' });
  }
}

// GET /auth/me
export async function getMe(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req as any).user.id;
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isVerified: true,
        createdAt: true,
        authorProfile: true,
        resellerProfile: true
      }
    });

    if (!user) {
      return reply.status(404).send({ error: 'User not found' });
    }

    reply.send(user);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch user' });
  }
}

export function authRoutes(fastify: FastifyInstance) {
  fastify.post('/auth/register', register);
  fastify.post('/auth/login', login);
  fastify.get('/auth/me', { preHandler: [fastify.authenticate] }, getMe);
}
