// @ts-nocheck
import { api } from '@/lib/api';

export interface AuthorProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  status: 'draft' | 'published' | 'archived';
  media: string[];
  sales: number;
  revenue: number;
  createdAt: string;
  updatedAt: string;
}

export interface AuthorAnalytics {
  totalRevenue: number;
  totalSales: number;
  totalProducts: number;
  followers: number;
  rating: number;
  monthlyRevenue: { month: string; revenue: number }[];
  topProducts: { name: string; sales: number; revenue: number }[];
}

export interface AuthorEarnings {
  availableBalance: number;
  pendingBalance: number;
  totalLifetimeEarnings: number;
  lastPayout: {
    amount: number;
    date: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
  } | null;
}

export interface PayoutRequest {
  amount: number;
  method: 'bank_transfer' | 'paypal' | 'crypto';
  accountDetails: Record<string, string>;
}

export interface Payout {
  id: string;
  amount: number;
  method: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  requestedAt: string;
  processedAt?: string;
}

// Real API calls - no mock data
export const authorApi = {
  // Dashboard
  getDashboard: () => api.get('/author/dashboard').then(r => r.data),
  
  // Products
  getProducts: () => api.get('/author/products').then(r => r.data),
  getProduct: (id: string) => api.get(`/author/products/${id}`).then(r => r.data),
  createProduct: (data: Partial<AuthorProduct>) => api.post('/author/products', data).then(r => r.data),
  updateProduct: (id: string, data: Partial<AuthorProduct>) => api.patch(`/author/products/${id}`, data).then(r => r.data),
  deleteProduct: (id: string) => api.delete(`/author/products/${id}`).then(r => r.data),
  publishProduct: (id: string) => api.patch(`/author/products/${id}/publish`).then(r => r.data),
  unpublishProduct: (id: string) => api.patch(`/author/products/${id}/unpublish`).then(r => r.data),
  
  // Analytics
  getAnalytics: (period?: string) => api.get('/author/analytics', { params: { period } }).then(r => r.data),
  
  // Earnings
  getEarnings: () => api.get('/author/earnings').then(r => r.data),
  
  // Payouts
  getPayouts: () => api.get('/author/payouts').then(r => r.data),
  requestPayout: (data: PayoutRequest) => api.post('/author/payouts', data).then(r => r.data),
  cancelPayout: (id: string) => api.delete(`/author/payouts/${id}`).then(r => r.data),
  
  // Profile
  getProfile: () => api.get('/author/profile').then(r => r.data),
  updateProfile: (data: Record<string, unknown>) => api.patch('/author/profile', data).then(r => r.data),
};