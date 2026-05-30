// @ts-nocheck
import { api } from '@/lib/api';

export interface Referral {
  id: string;
  code: string;
  referredUser: {
    id: string;
    name: string;
    email: string;
    joinedAt: string;
  };
  status: 'pending' | 'converted' | 'expired';
  commission: number;
  createdAt: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  source: string;
  notes: string;
  value: number;
  createdAt: string;
  updatedAt: string;
}

export interface Commission {
  id: string;
  orderId: string;
  customerName: string;
  amount: number;
  rate: number;
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  createdAt: string;
  approvedAt?: string;
  paidAt?: string;
}

export interface ResellerEarnings {
  availableBalance: number;
  pendingBalance: number;
  totalLifetimeEarnings: number;
  totalReferrals: number;
  totalLeads: number;
  conversionRate: number;
  monthlyEarnings: { month: string; earnings: number }[];
}

export interface Payout {
  id: string;
  amount: number;
  method: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  requestedAt: string;
  processedAt?: string;
  transactionId?: string;
}

export interface ResellerAnalytics {
  totalReferrals: number;
  convertedReferrals: number;
  conversionRate: number;
  totalLeads: number;
  qualifiedLeads: number;
  totalCommissions: number;
  pendingCommissions: number;
  topSources: { source: string; count: number }[];
  monthlyTrend: { month: string; referrals: number; commissions: number }[];
}

// Real API calls - no mock data
export const resellerApi = {
  // Dashboard
  getDashboard: () => api.get('/reseller/dashboard').then(r => r.data),
  
  // Referrals
  getReferrals: (params?: { status?: string; period?: string }) => 
    api.get('/reseller/referrals', { params }).then(r => r.data),
  getReferralCode: () => api.get('/reseller/referral-code').then(r => r.data),
  generateReferralCode: () => api.post('/reseller/referral-code').then(r => r.data),
  
  // Leads
  getLeads: (params?: { status?: string }) => api.get('/reseller/leads', { params }).then(r => r.data),
  getLead: (id: string) => api.get(`/reseller/leads/${id}`).then(r => r.data),
  createLead: (data: Partial<Lead>) => api.post('/reseller/leads', data).then(r => r.data),
  updateLead: (id: string, data: Partial<Lead>) => api.patch(`/reseller/leads/${id}`, data).then(r => r.data),
  deleteLead: (id: string) => api.delete(`/reseller/leads/${id}`).then(r => r.data),
  convertLead: (id: string) => api.patch(`/reseller/leads/${id}/convert`).then(r => r.data),
  
  // Commissions
  getCommissions: (params?: { status?: string }) => api.get('/reseller/commissions', { params }).then(r => r.data),
  
  // Earnings
  getEarnings: () => api.get('/reseller/earnings').then(r => r.data),
  
  // Payouts
  getPayouts: () => api.get('/reseller/payouts').then(r => r.data),
  requestPayout: (data: { amount: number; method: string; accountDetails: Record<string, string> }) => 
    api.post('/reseller/payouts', data).then(r => r.data),
  cancelPayout: (id: string) => api.delete(`/reseller/payouts/${id}`).then(r => r.data),
  
  // Analytics
  getAnalytics: (period?: string) => api.get('/reseller/analytics', { params: { period } }).then(r => r.data),
};