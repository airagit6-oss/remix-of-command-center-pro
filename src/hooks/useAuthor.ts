import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authorApi, type AuthorProduct, type AuthorAnalytics, type AuthorEarnings, type PayoutRequest } from '@/services/authorApi';
import { toast } from 'sonner';

// No mock data - all real API calls
export const useAuthorProducts = () => {
  return useQuery({
    queryKey: ['author', 'products'],
    queryFn: authorApi.getProducts,
    staleTime: 30000,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authorApi.createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['author', 'products'] });
      toast.success('Product created successfully');
    },
    onError: () => toast.error('Failed to create product'),
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AuthorProduct> }) => 
      authorApi.updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['author', 'products'] });
      toast.success('Product updated');
    },
    onError: () => toast.error('Failed to update product'),
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authorApi.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['author', 'products'] });
      toast.success('Product deleted');
    },
    onError: () => toast.error('Failed to delete product'),
  });
};

export const usePublishProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authorApi.publishProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['author', 'products'] });
      toast.success('Product published');
    },
    onError: () => toast.error('Failed to publish product'),
  });
};

export const useUnpublishProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authorApi.unpublishProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['author', 'products'] });
      toast.success('Product unpublished');
    },
    onError: () => toast.error('Failed to unpublish product'),
  });
};

export const useAuthorAnalytics = (period?: string) => {
  return useQuery<AuthorAnalytics>({
    queryKey: ['author', 'analytics', period],
    queryFn: () => authorApi.getAnalytics(period),
    staleTime: 60000,
  });
};

export const useAuthorEarnings = () => {
  return useQuery<AuthorEarnings>({
    queryKey: ['author', 'earnings'],
    queryFn: authorApi.getEarnings,
    staleTime: 30000,
  });
};

export const useAuthorPayouts = () => {
  return useQuery({
    queryKey: ['author', 'payouts'],
    queryFn: authorApi.getPayouts,
    staleTime: 30000,
  });
};

export const useRequestPayout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authorApi.requestPayout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['author', 'payouts'] });
      queryClient.invalidateQueries({ queryKey: ['author', 'earnings'] });
      toast.success('Payout requested');
    },
    onError: () => toast.error('Failed to request payout'),
  });
};

export const useCancelPayout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authorApi.cancelPayout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['author', 'payouts'] });
      queryClient.invalidateQueries({ queryKey: ['author', 'earnings'] });
      toast.success('Payout cancelled');
    },
    onError: () => toast.error('Failed to cancel payout'),
  });
};

export const useAuthorDashboard = () => {
  return useQuery({
    queryKey: ['author', 'dashboard'],
    queryFn: authorApi.getDashboard,
    staleTime: 30000,
  });
};
