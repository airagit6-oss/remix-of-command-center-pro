// ============================================================
// PRODUCTS SEARCH INDEX
// Product search with advanced filtering and ranking
// ============================================================

import { SearchService } from '../search.service';

export interface ProductDocument {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  price: number;
  rating: number;
  reviews: number;
  sales: number;
  authorId: string;
  authorName: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'SUSPENDED';
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export const productsSearch = new SearchService<ProductDocument>('products');

export async function initializeProductsIndex(): Promise<void> {
  try {
    await productsSearch.createIndex();
    
    await productsSearch.updateSettings({
      searchableAttributes: ['name', 'description', 'tags', 'category'],
      filterableAttributes: ['category', 'status', 'authorId', 'tags'],
      sortableAttributes: ['price', 'rating', 'reviews', 'sales', 'publishedAt', 'createdAt'],
      rankingRules: [
        'words',
        'typo',
        'proximity',
        'attribute',
        'sort',
        'exactness',
        'sales:desc',
        'rating:desc',
        'reviews:desc',
      ],
      displayedAttributes: [
        'id',
        'name',
        'description',
        'category',
        'tags',
        'price',
        'rating',
        'reviews',
        'sales',
        'authorId',
        'authorName',
        'status',
        'publishedAt',
      ],
      stopWords: ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'],
      synonyms: {
        'software': ['app', 'application', 'tool', 'program'],
        'saaS': ['cloud', 'web', 'online'],
      },
    });
    
    console.log('Products search index initialized');
  } catch (error) {
    console.error('Failed to initialize products index:', error);
    throw error;
  }
}

export async function indexProduct(product: ProductDocument): Promise<void> {
  await productsSearch.addDocuments([product]);
}

export async function indexProducts(products: ProductDocument[]): Promise<void> {
  await productsSearch.addDocuments(products);
}

export async function updateProductIndex(product: ProductDocument): Promise<void> {
  await productsSearch.updateDocuments([product]);
}

export async function removeProductFromIndex(productId: string): Promise<void> {
  await productsSearch.deleteDocuments([productId]);
}

export async function searchProducts(
  query: string,
  options?: {
    category?: string;
    status?: string;
    authorId?: string;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    sortBy?: 'price' | 'rating' | 'reviews' | 'sales' | 'publishedAt';
    sortOrder?: 'asc' | 'desc';
    limit?: number;
    offset?: number;
  }
) {
  const filters: string[] = [];
  
  if (options?.category) {
    filters.push(`category = "${options.category}"`);
  }
  
  if (options?.status) {
    filters.push(`status = "${options.status}"`);
  }
  
  if (options?.authorId) {
    filters.push(`authorId = "${options.authorId}"`);
  }
  
  if (options?.minPrice !== undefined) {
    filters.push(`price >= ${options.minPrice}`);
  }
  
  if (options?.maxPrice !== undefined) {
    filters.push(`price <= ${options.maxPrice}`);
  }
  
  if (options?.minRating !== undefined) {
    filters.push(`rating >= ${options.minRating}`);
  }

  const sort = options?.sortBy ? [`${options.sortBy}:${options.sortOrder || 'desc'}`] : undefined;

  return productsSearch.search<ProductDocument>(query, {
    filter: filters.length > 0 ? filters.join(' AND ') : undefined,
    sort,
    limit: options?.limit,
    offset: options?.offset,
  });
}
