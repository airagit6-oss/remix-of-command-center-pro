/**
 * CART MODEL - Shopping cart persistence
 * Database schema for user shopping carts
 */

import mongoose, { Schema, Document } from 'mongoose';

export interface ICartItem {
  id: string;
  productId: string;
  quantity: number;
  product?: {
    id: string;
    name: string;
    price: number;
    image?: string;
  };
  addedAt: Date;
}

export interface ICart extends Document {
  userId: string;
  items: ICartItem[];
  total: number;
  status: 'active' | 'abandoned' | 'converted' | 'expired';
  lastModified: Date;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const CartItemSchema = new Schema<ICartItem>({
  id: { type: String, required: true },
  productId: { type: String, required: true, index: true },
  quantity: { type: Number, required: true, min: 1 },
  product: {
    id: String,
    name: String,
    price: Number,
    image: String,
  },
  addedAt: { type: Date, default: Date.now },
});

const CartSchema = new Schema<ICart>(
  {
    userId: { type: String, required: true, unique: true, index: true },
    items: [CartItemSchema],
    total: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'abandoned', 'converted', 'expired'], default: 'active' },
    lastModified: { type: Date, default: Date.now },
    expiresAt: { type: Date, default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) }, // 30 days
  },
  {
    timestamps: true,
  }
);

CartSchema.index({ status: 1, expiresAt: 1 });
CartSchema.index({ userId: 1, lastModified: -1 });

// Automatically delete expired carts
CartSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Cart = mongoose.model<ICart>('Cart', CartSchema);
