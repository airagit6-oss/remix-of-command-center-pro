import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { resellerApi, type Referral, type Lead, type Commission, type ResellerEarnings, type ResellerAnalytics } from '@/services/resellerApi';
import { toast } from 'sonner';

// No mock data - all real API calls
export const useResellerDashboard = () => {
  return useQuery({
    queryKey: ['reseller', 'dashboard'],
    queryFn: resellerApi.getDashboard,
    staleTime: 30000,
  });
};

export const useReferrals = (params?: { status?: string; period?: string }) => {
  return useQuery<Referral[]>({
    queryKey: ['reseller', 'referrals', params],
    queryFn: () => resellerApi.getReferrals(params),
    staleTime: 30000,
  });
};

export const useReferralCode = () => {
  return useQuery({
    queryKey: ['reseller', 'referral-code'],
    queryFn: resellerApi.getReferralCode,
    staleTime: Infinity, // Code rarely changes
  });
};

export const useGenerateReferralCode = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: resellerApi.generateReferralCode,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reseller', 'referral-code'] });
      toast.success('New referral code generated');
    },
    onError: () => toast.error('Failed to generate referral code'),
  });
};

export const useLeads = (params?: { status?: string }) => {
  return useQuery<Lead[]>({
    queryKey: ['reseller', 'leads', params],
    queryFn: () => resellerApi.getLeads(params),
    staleTime: 30000,
  });
};

export const useCreateLead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: resellerApi.createLead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reseller', 'leads'] });
      toast.success('Lead created');
    },
    onError: () => toast.error('Failed to create lead'),
  });
};

export const useUpdateLead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Lead> }) => 
      resellerApi.updateLead(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reseller', 'leads'] });
      toast.success('Lead updated');
    },
    onError: () => toast.error('Failed to update lead'),
  });
};

export const useDeleteLead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: resellerApi.deleteLead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reseller', 'leads'] });
      toast.success('Lead deleted');
    },
    onError: () => toast.error('Failed to delete lead'),
  });
};

export const useConvertLead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: resellerApi.convertLead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reseller', 'leads'] });
      queryClient.invalidateQueries({ queryKey: ['reseller', 'commissions'] });
      queryClient.invalidateQueries({ queryKey: ['reseller', 'earnings'] });
      toast.success('Lead converted to commission');
    },
    onError: () => toast.error('Failed to convert lead'),
  });
};

export const useCommissions = (params?: { status?: string }) => {
  return useQuery<Commission[]>({
    queryKey: ['reseller', 'commissions', params],
    queryFn: () => resellerApi.getCommissions(params),
    staleTime: 30000,
  });
};

export const useResellerEarnings = () => {
  return useQuery<ResellerEarnings>({
    queryKey: ['reseller', 'earnings'],
    queryFn: resellerApi.getEarnings,
    staleTime: 30000,
  });
};

export const useResellerPayouts = () => {
  return useQuery({
    queryKey: ['reseller', 'payouts'],
    queryFn: resellerApi.getPayouts,
    staleTime: 30000,
  });
};

export const useRequestResellerPayout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: resellerApi.requestPayout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reseller', 'payouts'] });
      queryClient.invalidateQueries({ queryKey: ['reseller', 'earnings'] });
      toast.success('Payout requested');
    },
    onError: () => toast.error('Failed to request payout'),
  });
};

export const useCancelResellerPayout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: resellerApi.cancelPayout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reseller', 'payouts'] });
      queryClient.invalidateQueries({ queryKey: ['reseller', 'earnings'] });
      toast.success('Payout cancelled');
    },
    onError: () => toast.error('Failed to cancel payout'),
  });
};

export const useResellerAnalytics = (period?: string) => {
  return useQuery<ResellerAnalytics>({
    queryKey: ['reseller', 'analytics', period],
    queryFn: () => resellerApi.getAnalytics(period),
    staleTime: 60000,
  });
};
