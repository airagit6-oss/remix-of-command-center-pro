import { FastifyInstance } from 'fastify';
import { AppError, throwError } from '../middleware/errorHandler';
import { validate, schemas, sanitizeInput } from '../middleware/validation';
import { strictRateLimiter } from '../middleware/rateLimiter';
import { prisma } from '../db';
import { hashPassword, verifyPassword, generateToken } from '../utils/auth';
import { logger } from '../utils/logger';

/**
 * AUTHENTICATION ROUTES - PRODUCTION HARDENED
 */

export async function authRoutes(fastify: FastifyInstance) {
  /**
   * POST /auth/register
   * Register new user with validation and rate limiting
   */
  fastify.post(
    '/auth/register',
    { preHandler: [strictRateLimiter] },
    async (request, fastify) => {
      try {
        // Validate input
        const validated = schemas.register.parse(request.body);
        const { email, password, name } = sanitizeInput(validated);

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
          where: { email },
        });

        if (existingUser) {
          throw new AppError(409, 'Email already registered');
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Create user
        const user = await prisma.user.create({
          data: {
            email,
            name,
            password: hashedPassword,
            role: 'CUSTOMER',
          },
        });

        // Generate token
        const token = generateToken(user.id);

        logger.info({
          type: 'user_registered',
          userId: user.id,
          email: user.email,
        });

        return {
          success: true,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role === 'CUSTOMER' ? 'user' : user.role.toLowerCase(),
          },
          token,
        };
      } catch (error) {
        if (error instanceof AppError) throw error;
        
        logger.error({
          type: 'register_error',
          error: error.message,
        });
        throw new AppError(500, 'Registration failed');
      }
    }
  );

  /**
   * POST /auth/login
   * Login with email and password
   */
  fastify.post(
    '/auth/login',
    { preHandler: [strictRateLimiter] },
    async (request, fastify) => {
      try {
        const validated = schemas.login.parse(request.body);
        const { email, password } = sanitizeInput(validated);

        // Find user
        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          // Don't reveal if email exists (security best practice)
          throw new AppError(401, 'Invalid email or password');
        }

        // Verify password
        const isValid = await verifyPassword(password, user.password);

        if (!isValid) {
          logger.warn({
            type: 'failed_login',
            email,
            reason: 'invalid_password',
          });
          throw new AppError(401, 'Invalid email or password');
        }

        // Generate token
        const token = generateToken(user.id);

        logger.info({
          type: 'user_login',
          userId: user.id,
          email: user.email,
        });

        return {
          success: true,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role === 'CUSTOMER' ? 'user' : user.role.toLowerCase(),
          },
          token,
        };
      } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError(500, 'Login failed');
      }
    }
  );

  /**
   * GET /auth/me
   * Get current user info (requires auth)
   */
  fastify.get(
    '/auth/me',
    { onRequest: [fastify.authenticate] },
    async (request, fastify) => {
      const user = await prisma.user.findUnique({
        where: { id: request.user.id },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
        },
      });

      if (!user) {
        throw new AppError(404, 'User not found');
      }

      return {
        success: true,
        user: {
          ...user,
          role: user.role === 'CUSTOMER' ? 'user' : user.role.toLowerCase(),
        },
      };
    }
  );
}
