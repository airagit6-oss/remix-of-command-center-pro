import { useQuery } from '@tanstack/react-query';
import { getReviews, products, type Product, type Review } from '@/lib/marketplaceData';

const findProduct = (id?: string): Product | null => {
  if (!id) return null;
  return products.find(product => product.id === id) ?? null;
};

export function useProduct(id?: string) {
  return useQuery<Product | null>({
    queryKey: ['product', id],
    queryFn: async () => findProduct(id),
    enabled: Boolean(id),
    staleTime: 5 * 60 * 1000,
  });
}

export function useProductReviews(id?: string) {
  return useQuery<Review[]>({
    queryKey: ['product-reviews', id],
    queryFn: async () => getReviews(),
    enabled: Boolean(id),
    staleTime: 5 * 60 * 1000,
  });
}

export function useRelatedProducts(id?: string) {
  return useQuery<Product[]>({
    queryKey: ['related-products', id],
    queryFn: async () => {
      const product = findProduct(id);
      if (!product) return products.slice(0, 4);
      return products
        .filter(item => item.id !== product.id && item.categorySlug === product.categorySlug)
        .slice(0, 4);
    },
    enabled: Boolean(id),
    staleTime: 5 * 60 * 1000,
  });
}