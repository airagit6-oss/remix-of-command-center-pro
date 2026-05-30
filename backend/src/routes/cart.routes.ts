import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /cart
export async function getCart(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req as any).user?.id;
    const sessionId = (req as any).sessionId;

    let cart;

    if (userId) {
      cart = await prisma.cart.findUnique({
        where: { userId },
        include: { items: { include: { product: true } } }
      });
    } else if (sessionId) {
      cart = await prisma.cart.findUnique({
        where: { sessionId },
        include: { items: { include: { product: true } } }
      });
    }

    if (!cart) {
      return reply.send({ items: [], total: 0 });
    }

    const total = cart.items.reduce((sum, item) => {
      return sum + (Number(item.quantity) || 0);
    }, 0);

    // Validate product availability and prices
    for (const item of cart.items) {
      if (!item.product || item.product.status !== 'PUBLISHED') {
        // Remove unavailable items
        await prisma.cartItem.delete({ where: { id: item.id } });
      }
    }

    return reply.send({ cart, total });
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch cart' });
  }
}

// POST /cart
export async function addToCart(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req as any).user?.id;
    const sessionId = (req as any).sessionId;
    const { productId, quantity } = req.body as any;

    if (!productId || !quantity || quantity < 1) {
      return reply.status(400).send({ error: 'Invalid product or quantity' });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product || product.status !== 'PUBLISHED') {
      return reply.status(404).send({ error: 'Product not available' });
    }

    let cart;

    if (userId) {
      cart = await prisma.cart.upsert({
        where: { userId },
        update: {},
        create: { userId },
        include: { items: true }
      });
    } else if (sessionId) {
      cart = await prisma.cart.upsert({
        where: { sessionId },
        update: {},
        create: { sessionId },
        include: { items: true }
      });
    } else {
      return reply.status(400).send({ error: 'No user or session' });
    }

    const existingItem = cart.items.find(item => item.productId === productId);

    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity }
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity
        }
      });
    }

    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: { items: { include: { product: true } } }
    });

    // Audit log
    if (userId) {
      await prisma.auditLog.create({
        data: {
          userId,
          action: 'ADD_TO_CART',
          entity: 'CartItem',
          changes: { productId, quantity }
        }
      });
    }

    return reply.send(updatedCart);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to add to cart' });
  }
}

// PATCH /cart/:itemId
export async function updateCartItem(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { itemId } = req.params as any;
    const { quantity } = req.body as any;
    const userId = (req as any).user?.id;

    if (!quantity || quantity < 1) {
      return reply.status(400).send({ error: 'Invalid quantity' });
    }

    const cartItem = await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity }
    });

    // Audit log
    if (userId) {
      await prisma.auditLog.create({
        data: {
          userId,
          action: 'UPDATE_CART_ITEM',
          entity: 'CartItem',
          entityId: itemId,
          changes: { quantity }
        }
      });
    }

    return reply.send(cartItem);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to update cart item' });
  }
}

// DELETE /cart/:itemId
export async function removeFromCart(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { itemId } = req.params as any;
    const userId = (req as any).user?.id;

    await prisma.cartItem.delete({
      where: { id: itemId }
    });

    // Audit log
    if (userId) {
      await prisma.auditLog.create({
        data: {
          userId,
          action: 'REMOVE_FROM_CART',
          entity: 'CartItem',
          entityId: itemId
        }
      });
    }

    return reply.send({ success: true });
  } catch (error) {
    reply.status(500).send({ error: 'Failed to remove from cart' });
  }
}

// DELETE /cart
export async function clearCart(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req as any).user?.id;
    const sessionId = (req as any).sessionId;

    let cart;

    if (userId) {
      cart = await prisma.cart.findUnique({ where: { userId } });
    } else if (sessionId) {
      cart = await prisma.cart.findUnique({ where: { sessionId } });
    }

    if (cart) {
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id }
      });
    }

    // Audit log
    if (userId) {
      await prisma.auditLog.create({
        data: {
          userId,
          action: 'CLEAR_CART',
          entity: 'Cart'
        }
      });
    }

    return reply.send({ success: true });
  } catch (error) {
    reply.status(500).send({ error: 'Failed to clear cart' });
  }
}

export function cartRoutes(fastify: FastifyInstance) {
  fastify.get('/cart', getCart);
  fastify.post('/cart', addToCart);
  fastify.patch('/cart/:itemId', updateCartItem);
  fastify.delete('/cart/:itemId', removeFromCart);
  fastify.delete('/cart', clearCart);
}
