import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { AppError } from './errorHandler';
import { logger } from '../utils/logger';

/**
 * PRODUCTION VALIDATION
 * Validates all inputs at API boundaries
 * Uses Zod for schema validation
 */

// Common schemas
export const schemas = {
  // Auth
  register: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  }),
  
  login: z.object({
    email: z.string().email('Invalid email'),
    password: z.string().min(1, 'Password required'),
  }),

  // Reseller
  createLead: z.object({
    name: z.string().min(1, 'Name required').max(100),
    email: z.string().email('Invalid email'),
    phone: z.string().optional(),
    source: z.string().max(100),
    value: z.number().min(0, 'Value must be positive').optional(),
    notes: z.string().max(500).optional(),
  }),

  updateLead: z.object({
    name: z.string().min(1).max(100).optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    source: z.string().max(100).optional(),
    status: z.enum(['new', 'contacted', 'qualified', 'converted', 'lost']).optional(),
    value: z.number().min(0).optional(),
    notes: z.string().max(500).optional(),
  }),

  requestPayout: z.object({
    amount: z.number().min(50, 'Minimum payout is $50'),
    method: z.enum(['bank_transfer', 'paypal', 'crypto']),
    accountDetails: z.record(z.any()).optional(),
  }),

  // Cart & Checkout
  addToCart: z.object({
    productId: z.string().uuid(),
    quantity: z.number().min(1, 'Quantity must be at least 1').max(1000),
  }),

  updateCartItem: z.object({
    cartItemId: z.string().uuid(),
    quantity: z.number().min(1).max(1000),
  }),

  createOrder: z.object({
    items: z.array(z.object({
      productId: z.string().uuid(),
      quantity: z.number().min(1),
    })),
    shippingAddress: z.object({
      street: z.string(),
      city: z.string(),
      state: z.string(),
      zipCode: z.string(),
      country: z.string(),
    }).optional(),
  }),
};

/**
 * Validation middleware factory
 * Usage: app.post('/route', validate('schema'), handler)
 */
export const validate = (schemaKey: keyof typeof schemas) => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const schema = schemas[schemaKey];
      
      // Validate request body
      const validated = schema.parse(request.body);
      
      // Attach validated data to request
      request.validatedData = validated;
    } catch (error) {
      if (error instanceof z.ZodError) {
        logger.warn({
          type: 'validation_error',
          path: request.url,
          errors: error.errors,
        });
        
        throw new AppError(400, `Validation failed: ${error.errors[0].message}`);
      }
      throw error;
    }
  };
};

/**
 * Sanitize input to prevent injection attacks
 */
export const sanitizeInput = (input: any): any => {
  if (typeof input === 'string') {
    // Remove HTML/script tags
    return input
      .replace(/<script[^>]*>.*?<\/script>/gi, '')
      .replace(/<[^>]+>/g, '')
      .trim();
  }
  
  if (Array.isArray(input)) {
    return input.map(sanitizeInput);
  }
  
  if (input !== null && typeof input === 'object') {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(input)) {
      sanitized[key] = sanitizeInput(value);
    }
    return sanitized;
  }
  
  return input;
};

/**
 * Pagination validation
 */
export const validatePagination = (page?: number, limit?: number) => {
  const p = Math.max(1, page || 1);
  const l = Math.min(100, Math.max(1, limit || 20));
  
  return { page: p, limit: l, offset: (p - 1) * l };
};

// Extend FastifyRequest type
declare module 'fastify' {
  interface FastifyRequest {
    validatedData?: any;
  }
}
