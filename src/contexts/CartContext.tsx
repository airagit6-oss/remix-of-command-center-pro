import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '../lib/api';

interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product?: {
    id: string;
    name: string;
    price: number;
    description: string;
  };
}

interface Cart {
  id: string;
  items: CartItem[];
}

interface CartContextType {
  cart: Cart | null;
  total: number;
  loading: boolean;
  addToCart: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const refreshCart = async () => {
    try {
      setLoading(true);
      const response = await api.get<{ cart: Cart; total: number }>('/cart');
      setCart(response.cart);
      setTotal(response.total);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshCart();
  }, []);

  const addToCart = async (productId: string, quantity: number) => {
    try {
      await api.post('/cart', { productId, quantity });
      await refreshCart();
    } catch (error) {
      console.error('Failed to add to cart:', error);
      throw error;
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      await api.delete(`/cart/${itemId}`);
      await refreshCart();
    } catch (error) {
      console.error('Failed to remove from cart:', error);
      throw error;
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      await api.patch(`/cart/${itemId}`, { quantity });
      await refreshCart();
    } catch (error) {
      console.error('Failed to update cart item:', error);
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      await api.delete('/cart');
      await refreshCart();
    } catch (error) {
      console.error('Failed to clear cart:', error);
      throw error;
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        total,
        loading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        refreshCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
