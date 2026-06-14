import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /cart
export async function getCart(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req as any).user?.id || 'anonymous';

    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { product: true } } }
    });

    if (!cart) {
      return reply.send({ cart: { items: [] }, total: 0 });
    }

    // Calculate total as sum of (price * quantity)
    const total = cart.items.reduce((sum: number, item: any) => {
      const itemPrice = item.product?.price || 0;
      return sum + (itemPrice * (Number(item.quantity) || 0));
    }, 0);

    return reply.send({ cart, total: Number(total.toFixed(2)) });
  } catch (error) {
    console.error('Get cart error:', error);
    reply.status(500).send({ error: 'Failed to fetch cart' });
  }
}

// POST /cart
export async function addToCart(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req as any).user?.id || 'anonymous';
    const { productId, quantity } = req.body as any;

    if (!productId || !quantity || quantity < 1) {
      return reply.status(400).send({ error: 'Invalid product or quantity' });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      return reply.status(404).send({ error: 'Product not found' });
    }

    let cart = await prisma.cart.upsert({
      where: { userId },
      update: {},
      create: { userId },
      include: { items: true }
    });

    const existingItem = cart.items.find((item: any) => item.productId === productId);

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

    // Calculate total
    const total = updatedCart?.items.reduce((sum: number, item: any) => {
      const itemPrice = item.product?.price || 0;
      return sum + (itemPrice * (Number(item.quantity) || 0));
    }, 0) || 0;

    return reply.send({ cart: updatedCart, total: Number(total.toFixed(2)) });
  } catch (error) {
    console.error('Add to cart error:', error);
    reply.status(500).send({ error: 'Failed to add to cart' });
  }
}

// PATCH /cart/:itemId
export async function updateCartItem(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { itemId } = req.params as any;
    const { quantity } = req.body as any;

    if (!quantity || quantity < 1) {
      return reply.status(400).send({ error: 'Invalid quantity' });
    }

    const cartItem = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { cart: true }
    });

    if (!cartItem) {
      return reply.status(404).send({ error: 'Cart item not found' });
    }

    await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity }
    });

    const updatedCart = await prisma.cart.findUnique({
      where: { id: cartItem.cartId },
      include: { items: { include: { product: true } } }
    });

    const total = updatedCart?.items.reduce((sum: number, item: any) => {
      const itemPrice = item.product?.price || 0;
      return sum + (itemPrice * (Number(item.quantity) || 0));
    }, 0) || 0;

    return reply.send({ cart: updatedCart, total: Number(total.toFixed(2)) });
  } catch (error) {
    console.error('Update cart error:', error);
    reply.status(500).send({ error: 'Failed to update cart' });
  }
}

// DELETE /cart/:itemId
export async function removeFromCart(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { itemId } = req.params as any;

    const cartItem = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { cart: true }
    });

    if (!cartItem) {
      return reply.status(404).send({ error: 'Cart item not found' });
    }

    await prisma.cartItem.delete({
      where: { id: itemId }
    });

    const updatedCart = await prisma.cart.findUnique({
      where: { id: cartItem.cartId },
      include: { items: { include: { product: true } } }
    });

    const total = updatedCart?.items.reduce((sum: number, item: any) => {
      const itemPrice = item.product?.price || 0;
      return sum + (itemPrice * (Number(item.quantity) || 0));
    }, 0) || 0;

    return reply.send({ cart: updatedCart, total: Number(total.toFixed(2)) });
  } catch (error) {
    console.error('Remove from cart error:', error);
    reply.status(500).send({ error: 'Failed to remove from cart' });
  }
}

// DELETE /cart (clear entire cart)
export async function clearCart(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req as any).user?.id || 'anonymous';

    const cart = await prisma.cart.findUnique({
      where: { userId }
    });

    if (!cart) {
      return reply.send({ success: true });
    }

    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id }
    });

    return reply.send({ cart: { items: [], total: 0 }, success: true });
  } catch (error) {
    console.error('Clear cart error:', error);
    reply.status(500).send({ error: 'Failed to clear cart' });
  }
}

// Register routes with Fastify
export async function cartRoutes(fastify: FastifyInstance) {
  fastify.get('/cart', getCart);
  fastify.post('/cart', addToCart);
  fastify.patch('/cart/:itemId', updateCartItem);
  fastify.delete('/cart/:itemId', removeFromCart);
  fastify.delete('/cart', clearCart);
}
