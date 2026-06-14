/**
 * Cart Routes - Shopping cart management with MongoDB persistence
 */

import { Router, Request, Response } from 'express';
import { Cart, ICart } from '../models/Cart';

const router = Router();

// Fallback in-memory mock storage when MongoDB unavailable
const mockCart = {
  id: 'mock-cart',
  items: [],
};

// Helper function to get or create cart
const getOrCreateCart = async (userId: string) => {
  try {
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({
        userId,
        items: [],
        total: 0,
      });
      await cart.save();
    }
    return cart;
  } catch (error) {
    console.warn('MongoDB unavailable, using mock cart:', error instanceof Error ? error.message : 'Unknown error');
    return null;
  }
};

// ============================================================================
// GET /cart - Get current user's cart
// ============================================================================
router.get('/', async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId as string || 'demo-user';
    
    // Try MongoDB first
    const cart = await getOrCreateCart(userId);
    
    if (cart) {
      res.json({
        cart,
        total: cart.total,
        source: 'mongodb',
      });
    } else {
      // Fallback to mock
      const total = mockCart.items.reduce((sum, item) => {
        return sum + (item.product?.price || 0) * item.quantity;
      }, 0);

      res.json({
        cart: mockCart,
        total: total,
        source: 'mock',
      });
    }
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch cart',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// ============================================================================
// POST /cart/items - Add item to cart
// ============================================================================
router.post('/items', async (req: Request, res: Response) => {
  try {
    const { productId, quantity, userId: bodyUserId } = req.body;
    const userId = bodyUserId || 'demo-user';

    if (!productId || !quantity) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['productId', 'quantity'],
      });
    }

    // Try MongoDB first
    const cart = await getOrCreateCart(userId);
    
    if (cart) {
      // Add to MongoDB cart
      const existingItem = cart.items.find(item => item.productId === productId);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({
          id: `item-${Date.now()}`,
          productId,
          quantity,
          addedAt: new Date(),
        });
      }

      // Recalculate total
      cart.total = cart.items.reduce((sum, item) => {
        return sum + (item.product?.price || 0) * item.quantity;
      }, 0);

      cart.lastModified = new Date();
      await cart.save();

      res.status(201).json({
        success: true,
        cart,
        total: cart.total,
        source: 'mongodb',
      });
    } else {
      // Fallback to mock cart
      const existingItem = mockCart.items.find(item => item.productId === productId);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        mockCart.items.push({
          id: `item-${Date.now()}`,
          productId,
          quantity,
        });
      }

      const total = mockCart.items.reduce((sum, item) => {
        return sum + (item.product?.price || 0) * item.quantity;
      }, 0);

      res.status(201).json({
        success: true,
        cart: mockCart,
        total,
        source: 'mock',
      });
    }
  } catch (error) {
    res.status(500).json({
      error: 'Failed to add item to cart',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// ============================================================================
// DELETE /cart/items/:itemId - Remove item from cart
// ============================================================================
router.delete('/items/:itemId', async (req: Request, res: Response) => {
  try {
    const { itemId } = req.params;
    const userId = req.query.userId as string || 'demo-user';

    // Try MongoDB first
    const cart = await Cart.findOne({ userId });
    
    if (cart) {
      // Remove from MongoDB cart
      const initialLength = cart.items.length;
      cart.items = cart.items.filter(item => item.id !== itemId);

      if (cart.items.length < initialLength) {
        cart.total = cart.items.reduce((sum, item) => {
          return sum + (item.product?.price || 0) * item.quantity;
        }, 0);
        cart.lastModified = new Date();
        await cart.save();
      }

      res.json({
        success: true,
        cart,
        total: cart.total,
        source: 'mongodb',
      });
    } else {
      // Fallback to mock cart
      mockCart.items = mockCart.items.filter(item => item.id !== itemId);

      const total = mockCart.items.reduce((sum, item) => {
        return sum + (item.product?.price || 0) * item.quantity;
      }, 0);

      res.json({
        success: true,
        cart: mockCart,
        total,
        source: 'mock',
      });
    }
  } catch (error) {
    res.status(500).json({
      error: 'Failed to remove item from cart',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// ============================================================================
// PUT /cart/items/:itemId - Update item quantity
// ============================================================================
router.put('/items/:itemId', async (req: Request, res: Response) => {
  try {
    const { itemId } = req.params;
    const { quantity, userId: bodyUserId } = req.body;
    const userId = bodyUserId || 'demo-user';

    if (!quantity || quantity <= 0) {
      return res.status(400).json({
        error: 'Invalid quantity',
        message: 'Quantity must be greater than 0',
      });
    }

    // Try MongoDB first
    const cart = await Cart.findOne({ userId });
    
    if (cart) {
      // Update in MongoDB cart
      const item = cart.items.find(i => i.id === itemId);

      if (!item) {
        return res.status(404).json({
          error: 'Item not found',
          itemId,
        });
      }

      item.quantity = quantity;
      cart.total = cart.items.reduce((sum, i) => {
        return sum + (i.product?.price || 0) * i.quantity;
      }, 0);
      cart.lastModified = new Date();
      await cart.save();

      res.json({
        success: true,
        cart,
        total: cart.total,
        source: 'mongodb',
      });
    } else {
      // Fallback to mock cart
      const item = mockCart.items.find(i => i.id === itemId);

      if (!item) {
        return res.status(404).json({
          error: 'Item not found',
          itemId,
        });
      }

      item.quantity = quantity;

      const total = mockCart.items.reduce((sum, i) => {
        return sum + (i.product?.price || 0) * i.quantity;
      }, 0);

      res.json({
        success: true,
        cart: mockCart,
        total,
        source: 'mock',
      });
    }
  } catch (error) {
    res.status(500).json({
      error: 'Failed to update item quantity',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// ============================================================================
// DELETE /cart - Clear cart
// ============================================================================
router.delete('/', async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId as string || 'demo-user';

    // Try MongoDB first
    const cart = await Cart.findOne({ userId });
    
    if (cart) {
      // Clear MongoDB cart
      cart.items = [];
      cart.total = 0;
      cart.lastModified = new Date();
      await cart.save();

      res.json({
        success: true,
        message: 'Cart cleared',
        cart,
        total: 0,
        source: 'mongodb',
      });
    } else {
      // Fallback to mock cart
      mockCart.items = [];

      res.json({
        success: true,
        message: 'Cart cleared',
        cart: mockCart,
        total: 0,
        source: 'mock',
      });
    }
  } catch (error) {
    res.status(500).json({
      error: 'Failed to clear cart',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
