/**
 * Cart Routes - Shopping cart management
 */

import { Router, Request, Response } from 'express';

const router = Router();

// Mock cart storage (in-memory)
const mockCart = {
  id: 'mock-cart',
  items: [],
};

// ============================================================================
// GET /cart - Get current user's cart
// ============================================================================
router.get('/', (req: Request, res: Response) => {
  try {
    const total = mockCart.items.reduce((sum, item) => {
      return sum + (item.product?.price || 0) * item.quantity;
    }, 0);

    res.json({
      cart: mockCart,
      total: total,
    });
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
router.post('/items', (req: Request, res: Response) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['productId', 'quantity'],
      });
    }

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
    });
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
router.delete('/items/:itemId', (req: Request, res: Response) => {
  try {
    const { itemId } = req.params;

    mockCart.items = mockCart.items.filter(item => item.id !== itemId);

    const total = mockCart.items.reduce((sum, item) => {
      return sum + (item.product?.price || 0) * item.quantity;
    }, 0);

    res.json({
      success: true,
      cart: mockCart,
      total,
    });
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
router.put('/items/:itemId', (req: Request, res: Response) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({
        error: 'Invalid quantity',
        message: 'Quantity must be greater than 0',
      });
    }

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
    });
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
router.delete('/', (req: Request, res: Response) => {
  try {
    mockCart.items = [];

    res.json({
      success: true,
      message: 'Cart cleared',
      cart: mockCart,
      total: 0,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to clear cart',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
